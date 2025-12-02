---
title: "TEAM for AWS IAM Identity Center 導入ガイド ──(3/4) DeepDive" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: false
---

<!--# Temporary elevated access management (TEAM) for AWS IAM Identity Center <!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

<!-- Duration: 00:01:00 -->

- [1. はじめに](#1-はじめに)
- [2. アーキテクチャの詳細](#2-アーキテクチャの詳細)
  - [2.1. 権限ライフサイクル管理の仕組み](#21-権限ライフサイクル管理の仕組み)
    - [2.2.1. データストア (DynamoDB)](#221-データストア-dynamodb)
    - [2.2.2. Wait ステートの実装詳細](#222-wait-ステートの実装詳細)
    - [2.2.3. Step Functions ワークフロー](#223-step-functions-ワークフロー)
- [📖 まとめ](#-まとめ)
  - [参考リソース](#参考リソース)

## 1. はじめに

![TEAM](/images/team/home_page.png)

Temporary elevated access management (TEAM) for AWS IAM Identity Center とは、AWS が提供するオープンソースソリューションで、ユーザーに一時的な管理者権限を付与するための仕組みです。

![TEAM architecture](/images/team/archi.png)

本ページでは、TEAMの仕組みを詳しく解説します。

## 2. アーキテクチャの詳細

![TEAM architecture](/images/team/process-flow.png)

<!-- Duration: 0:01:30 -->

### 2.1. 権限ライフサイクル管理の仕組み

#### 2.2.1. データストア (DynamoDB)

TEAMは、AWS DynamoDBを使用して、権限申請のライフサイクル全体を管理します。
以下の5つのテーブルで構成されています。

- Requests Table: 申請情報と状態を管理
- Approver Table: 承認者ポリシーの定義を管理
- Eligibility Table: 申請可能な権限の定義を管理
- Settings Table: アプリケーション設定を管理
- Sessions Table: CloudTrail Lake に StartQuery APIを実行したクエリIDを管理。取得結果をポーリングするために利用。TTL有効（項目：`expireAt`）

#### 2.2.2. Wait ステートの実装詳細

TEAMではStep Functionsで権限申請のライフサイクルを管理していますが、ライフサイクル管理の重要なポイントである Waitステートについて解説します。

Step Functionsの[Waitステート](https://docs.aws.amazon.com/step-functions/latest/dg/state-wait.html)の特徴は次のとおりです。

Waitの指定は、相対時間と絶対時間があります。

- 相対時間（秒）: `SecondsPath`
  - 0～99,999,999
- 絶対時間（ISO 8601）: `TimestampPath`
  - 例：2024-08-18T17:33:00Z

指定できる最大待機時間は、[Standard Workflows]が１年で、[Express Workflows]が５分となります。(厳密には、ステートマシン全体の実行時間)
TEAMでは、[Standard Workflows]を使用していますので最大時間は１年（8,760時間）となります。
ただし、TEAMでは最大時間は「8000時間」に制限をしています。

これはドキュメント(参考: [Eligibility policy](https://aws-samples.github.io/iam-identity-center-team/docs/overview/policies.html))でも以下のように明記されています。

```text
Maximum duration: Determines the maximum elevated access duration in hours 
(between 1 - 8000 hours / ~ 1 year) that can be requested by an entity.
```

コード上でも以下の実装が確認できます。

[iam-identity-center-team/src/components/Admin/Eligible.js](https://github.com/aws-samples/iam-identity-center-team/blob/main/src/components/Admin/Eligible.js)

```javascript
if (!duration || isNaN(duration) || Number(duration ) > 8000 || Number(duration ) < 1) {
  setDurationError(`Enter number between 1-8000`);
  valid = false;
}
```

#### 2.2.3. Step Functions ワークフロー

TEAMは5つのStep Functions State Machineで権限のライフサイクルを管理します。

1. Approval State Machine: 申請者への通知、申請期限切れまで待機
2. Schedule State Machine: 申請者への通知、権限利用開始日時まで待機
3. Grant State Machine: 申請者への通知、権限付与、権限付与期間終了まで待機
4. Revoke State Machine: 権限はく奪と、申請者への通知
5. Reject State Machine: 申請の棄却やキャンセル、申請者/承認者への通知

各State Machineの処理フローは次のとおりです。

1. Approval State Machine

![approval-sm](/images/team/sfn/team-approval-sm.jpg)

このステートマシンでは、以下の処理を行います。

- 承認者への通知
- 設定された承認期限（相対時間（秒数））まで待機
  ```json
  "Wait": {
    "Next": "DynamoDB GetStatus",
    "SecondsPath": "$.expire",
    "Type": "Wait"
  },
  "Pending?": {
    "Choices": [
      {
        "Next": "Update Request Status",
        "StringEquals": "pending",
        "Variable": "$.result.Item.status.S"
      }
    ],
    "Default": "Pass",
    "Type": "Choice"
  },
  ```
- 承認/否認されない場合、リクエストステータスを `expired` に変更

2. Schedule State Machine

![schedule-sm](/images/team/sfn/team-schedule-sm.jpg)

このステートマシンでは、以下の処理を行います。

- リクエストステータスを `scheduled` に更新
- 申請者へ通知
- 申請時に指定した"Start Time"（絶対時刻（ISO 8601形式））まで待機
  ```json
  "Schedule": {
    "Next": "DynamoDB GetStatus",
    "TimestampPath": "$.startTime",
    "Type": "Wait"
  },
  "Scheduled?": {
    "Choices": [
      {
        "Next": "Grant Permission",
        "StringEquals": "scheduled",
        "Variable": "$.result.Item.status.S"
      }
    ],
    "Default": "Pass",
    "Type": "Choice"
  },
  ```
- Grant State Machineを起動

3. Grant State Machine

![grant-sm](/images/team/sfn/team-grant-sm.jpg)

このステートマシンでは、以下の処理を行います。

- `CreateAccountAssignment` API実行（権限付与）
- リクエストステータスを `in progress` に更新
- DynamoDBに開始時刻を記録
- 申請者への通知
- 申請時に指定した"Duration"（相対時間（秒数））まで待機
  ```json
  "Wait": {
    "Next": "Revoke Permission",
    "SecondsPath": "$.duration",
    "Type": "Wait"
  }
  ```
- Revoke State Machineを起動

4. Revoke State Machine

![revoke-sm](/images/team/sfn/team-revoke-sm.jpg)

このステートマシンでは、以下の処理を行います。

- `DeleteAccountAssignment` API実行（権限削除）
- リクエストステータスを `ended` または `revoked` に更新
- DynamoDB に終了時刻を記録
- 申請者への通知

5. Reject State Machine

![reject-sm](/images/team/sfn/team-reject-sm.jpg)

このステートマシンでは、以下の処理を行います。

- ステータスが `rejected` か `cancelled` かを判定
- 申請者/承認者への通知


## 📖 まとめ

本記事では、「TEAM（Temporary Elevated Access Management）」の実装について深堀しました。


### 参考リソース

TEAMに関するさらに詳しい情報は、以下の公式リソースを参照してください。

- [TEAM 公式ドキュメント](https://aws-samples.github.io/iam-identity-center-team/)
- [GitHub リポジトリ](https://github.com/aws-samples/iam-identity-center-team/tree/main)
- [AWS Security Blog](https://aws.amazon.com/jp/blogs/security/temporary-elevated-access-management-with-iam-identity-center/)
- [builders.flash 記事（AWS Community Hero: 山口 正徳氏）](https://aws.amazon.com/jp/builders-flash/202505/temporary-elevated-access-management/)
