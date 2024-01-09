---
title: "【初心者向け】AWS Security Hub について改めて整理してみた" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: false
---

# AWS Security Hub

## ☘️ はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents

Duration: 00:01:00

- [AWS Security Hub](#aws-security-hub)
  - [☘️ はじめに](#️-はじめに)
  - [👀 Contents](#-contents)
  - [AWS Security Hub とは](#aws-security-hub-とは)
  - [特徴](#特徴)
  - [Security Hub の有効化](#security-hub-の有効化)
  - [検出項目（コントロール）](#検出項目コントロール)
  - [サービスリンクロール](#サービスリンクロール)
  - [クロスリージョン集約](#クロスリージョン集約)
  - [検出結果通知](#検出結果通知)
    - [Compliance](#compliance)
    - [Severity](#severity)
    - [「AWS Foundational Security Best Practices」のみ](#aws-foundational-security-best-practicesのみ)
  - [Security Hub 自動応答と修復](#security-hub-自動応答と修復)
  - [📖 まとめ](#-まとめ)

## AWS Security Hub とは

Duration: 1:02:06

AWS Security Hub とは、Cloud Security Posture Management（CSPM：クラウドセキュリティの構成ミス、管理不備などへ対応するための仕組み）に相当するサービスで、「AWS リソースのセキュリティ設定がベストプラクティスから逸脱していないか」を自動でチェックします。

【AWS Black Belt Online Seminar】[AWS Security Hub(YouTube)](https://www.youtube.com/watch?v=1JJw9efXIlw)(1:02:06) [pdf](https://d1.awsstatic.com/webinars/jp/pdf/services/20201013_AWS-BlackBelt-AWSSecurityHub.pdf)

![blackbelt-securityhub](/images/blackbelt/blackbelt-securityhub-320.jpg)

[AWS Security Hub サービス概要](https://aws.amazon.com/jp/security-hub/)

[AWS Security Hub ドキュメント](https://docs.aws.amazon.com/ja_jp/securityhub/?id=docs_gateway)

[AWS Security Hub よくある質問](https://aws.amazon.com/jp/security-hub/faqs/)

[AWS Security Hub の料金](https://aws.amazon.com/jp/security-hub/pricing/)

## 特徴

Duration: 0:00:30

- 30 日間は無料
- Security Hub はリージョンサービス
- 全てのリージョンで有効化することを推奨
  - AWS Config が有効化されている必要がある
  - 全リージョンで有効化するには、CLI や CDK などで効率化する

## Security Hub の有効化

Duration: 0:01:30

[AWS Security Hub の設定](https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/securityhub-settingup.html)

AWS Organizations のアカウントでは Security Hub が自動的に有効になります。
それ以外のアカウントでは、手動で有効化する必要がありますが、有効化はコンソールで簡単に実施することができます。
AWS Security Hub を有効化する前に、AWS Config でリソースの記録を有効にする必要があります。

![securityhub-setup](/images/securityhub/securityhub-setup.png)

Security Hub はリージョンサービスであるため、リージョン毎に有効化する必要があります。

有効化したものを無効にすることもできます。
[Security Hub を無効にする](https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/securityhub-disable.html#securityhub-disable-console)

## 検出項目（コントロール）

Duration: 0:01:30

検出項目はコントロールとよばれ、次のようなものがあります。

```text
[Account.1] AWS アカウント について、セキュリティの連絡先情報を提供する必要があります
[IAM.4] IAM ルートユーザーアクセスキーが存在してはいけません
```

コントロールは、すでに用意されているものから選択することができます。

![securityhub-controls](/images/securityhub/securityhub-controls.png)

[AWS Foundational Security Best Practices (FSBP) 標準](https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/fsbp-standard.html)

[Center for Internet Security (CIS) AWS Foundations Benchmark v1.2.0 および v1.4.0](https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/cis-aws-foundations-benchmark.html)

[米国国立標準技術研究所 (NIST) SP 800-53 Rev. 5](https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/nist-standard.html)

[PCI DSS](https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/pci-standard.html)

それぞれで検出される項目の詳細は次を参照します。

[Security Hub コントロールのリファレンス](https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/securityhub-controls-reference.html)

## サービスリンクロール

Duration: 0:00:30

`AWSServiceRoleForSecurityHub` という名前のロールをサービスリンクロールとして使用します。
コンソールで Security Hub を有効化した場合は、`securityhub.amazonaws.com` のサービスにリンクしたロールが自動的に作成されます。

手動で作成することもできます。手動で作成する方法は、[サービスにリンクされたロールの作成](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/using-service-linked-roles.html#create-service-linked-role) を参照してください。

作成したサービスリンクロールは、ロールを使用するすべてのリージョンの Security Hub が無効化された後でしか削除できません。

## クロスリージョン集約

Duration: 0:00:30

[クロスリージョン集約を有効にする](https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/finding-aggregation-enable.html)
[クロスリージョン集約を停止する](https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/finding-aggregation-stop.html)

Security Hub はリージョンサービスです。そのため、各リージョンの検出結果は各リージョンで確認しなければなりません。
しかし、クロスリージョン集約を使うことで、1 つのリージョンに集約して管理することができます。

![Aggregation Region](/images/securityhub/aggregation-region.png)

## 検出結果通知

Duration: 0:05:00

検出結果通知は、Security Hub から Amazon EventBridge に発信されるイベントを検出し、SNS と連携することで実現できます。

Security Hub から 発信される [EventBridge イベント形式](https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/securityhub-cwe-event-formats.html) は次のようになります。

```json
{
   "version":"0",
   "id":"CWE-event-id",
   "detail-type":"Security Hub Findings - Imported",
   "source":"aws.securityhub",
   "account":"111122223333",
   "time":"2019-04-11T21:52:17Z",
   "region":"us-west-2",
   "resources":[
      "arn:aws:securityhub:us-west-2::product/aws/macie/arn:aws:macie:us-west-2:111122223333:integtest/trigger/6294d71b927c41cbab915159a8f326a3/alert/f2893b211841"
   ],
   "detail":{
      "findings": [{
         <finding content>
       }]
   }
}
```

上記のようなイベントを検出できるように、EventBridge の[イベントパターン](https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/securityhub-cwe-all-findings.html#securityhub-cwe-all-findings-rule-format)を定義します。定義の雛形は次のとおりです。

```json
{
  "source": [
    "aws.securityhub"
  ],
  "detail-type": [
    "Security Hub Findings - Imported"
  ],
  "detail": {
    "findings": {
      <attribute filter values>
    }
  }
}
```

通知対象を限定せずに設定を行うと大量のメールが送信される可能性があるため注意が必要です。

[AWS Foundational Security Best Practices](https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/fsbp-standard.html) のいくつかを検出するイベントパターンの例は次のとおりです。

```text
[IAM.4] IAM ルートユーザーアクセスキーが存在してはいけません
[IAM.6] ルートユーザーに対してハードウェア MFA を有効にする必要があります
[S3.2] S3 バケットではパブリック読み取りアクセスを禁止する必要があります
[CloudTrail.1] CloudTrail を有効にして、少なくとも 1 つのマルチリージョンの追跡で、読み取りと書き込みの管理イベントを含めた設定をする必要があります。
[PCI.CloudTrail.4] CloudTrail ログファイルの検証を有効にする必要があります
```

```json
{
  "source": ["aws.securityhub"],
  "detail-type": ["Security Hub Findings - Imported"],
  "detail": {
    "findings": {
      "Severity": {
        "Label": ["HIGH", "CRITICAL"]
      },
      "Compliance": {
        "Status": ["FAILED"]
      },
      "Workflow": {
        "Status": ["NEW"]
      },
      "RecordState": ["ACTIVE"],
      "ProductFields": {
        "StandardsArn": [
          {
            "prefix": "arn:aws:securityhub:::standards/aws-foundational-security-best-practices"
          }
        ],
        "ControlId": [
          "IAM.4",
          "IAM.6",
          "S3.2",
          "CloudTrail.1",
          "PCI.CloudTrail.4"
        ]
      }
    }
  }
}
```

このまま通知すると、JSON 形式の可読性の低いものになりますので、[インプットトランスフォーマー](https://docs.aws.amazon.com/ja_jp/eventbridge/latest/userguide/eb-transform-target-input.html)機能をつかって、整形します。

![transform-target-input](/images/securityhub/transform-target-input.png)

”入力パス” で定義する項目は、次を参考にします。

- [AWS Security Finding 形式](https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/securityhub-findings-format-syntax.html)
- [必須属性](https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/asff-required-attributes.html)
- [オプションの最上位属性](https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/asff-top-level-attributes.html)

入力パス

```json
{
  "accountId": "$.detail.findings[0].AwsAccountId",
  "region": "$.region",
  "FindingId": "$.detail.findings[0].Types[0]",
  "FindingDescription": "$.detail.findings[0].description",
  "StandardsArn": "$.detail.findings[0].ProductFields.StandardsArn",
  "ControlId": "$.detail.findings[0].ProductFields.ControlId",
  "Title": "$.detail.findings[0].Title",
  "ResourcesId": "$.detail.findings[0].Resources[0].Id",
  "ResourcesType": "$.detail.findings[0].Resources[0].Type",
  "Severity": "$.detail.findings[0].Severity.Label",
  "ComplianceStatus": "$.detail.findings[0].Compliance.Status",
  "Description": "$.detail.findings[0].Description",
  "WorkflowStatus": "$.detail.findings[0].Workflow.Status",
  "RemediationText": "$.detail.findings[0].Remediation.Recommendation.Text",
  "RemediationUrl": "$.detail.findings[0].Remediation.Recommendation.Url",
  "createdAt": "$.createdAt"
}
```

入力テンプレート

```text
The following non-compliant (Failed) diagnostic items were discovered in SecurityHub's event rules.
account: <accountId>
region: <region>
Finding Id: <FindingId>
Finding Description: <FindingDescription>
StandardsArn: <StandardsArn>
ControlId: <ControlId>
Title: <Title>
ResourceType: <ResourceType>
ResourceId: <ResourceId>
Severity: <Severity>
ComplianceStatus: <ComplianceStatus>
WorkflowStatus: <WorkflowStatus>
RemediationText: <RemediationText>
RemediationUrl: <RemediationUrl>
createdAt: <createdAt>
See below for details.
https://<region>.console.aws.amazon.com/securityhub/home?region=<region>#/summary
```

### Compliance

Compliance の Status の意味については、[API_Compliance](https://docs.aws.amazon.com/securityhub/1.0/APIReference/API_Compliance.html) を参照してください。

| Status        | Description                                                       |
| ------------- | ----------------------------------------------------------------- |
| PASSED        | チェックに合格                                                    |
| WARNING       | 不足している情報がある or チェックをサポートしていない            |
| FAILED        | 1 つ以上のリソースがチェックに不合格                              |
| NOT_AVAILABLE | サービス停止もしくは API エラーにより、チェックを実行できなかった |

合格しなかったものという条件の場合は次のようにします。

```json
  "detail": {
    "findings": {
      "Compliance": {
        "Status": [
          {
            "anything-but": "PASSED"
          }
        ]
      },
      :
```

### Severity

重要度については、[API_Severity](https://docs.aws.amazon.com/securityhub/1.0/APIReference/API_Severity.html)を参考にします。

| Severity      | Description                                  |
| ------------- | -------------------------------------------- |
| INFORMATIONAL | 問題が見つかりません                         |
| LOW           | この問題自体に対処する必要はありません       |
| MEDIUM        | 対処する必要がありますが、緊急ではありません |
| HIGH          | 優先的に対処する必要はあります               |
| CRITICAL      | 最優先で対処する必要があります               |

対処が必要な重要度だけとする条件は次のとおりです。

```json
  "detail": {
    "findings":
:
        "Severity": {
           "Label": [
             "CRITICAL",
             "HIGH"
           ]
        },
:
```

### 「AWS Foundational Security Best Practices」のみ

その他のセキュリティ標準を指定する場合は、[コントロールの検出結果のサンプル](https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/sample-control-findings.html#sample-finding-fsbp)を参考にします。

```json
  "detail": {
    "findings":
      {
        "ProductFields":{
          "StandardsArn": [
            "arn:aws:securityhub:::standards/aws-foundational-security-best-practices/v/1.0.0"
          ]
        },
```

## Security Hub 自動応答と修復

Duration: 0:00:30

[自動応答および自動修復](https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/securityhub-cloudwatch-events.html)

Amazon EventBridge を使用して、つぎのようなリソースを自動的にトリガーすることで自動修復などを行うことができます。

- Lambda
- Run Command
- Step Functions
- など

次のサイトには、Step Functions を利用したメンバーアカウントの自動修復が説明されています。
[AWS ソリューションライブラリ > AWS での自動化されたセキュリティ対応](https://aws.amazon.com/jp/solutions/implementations/automated-security-response-on-aws/)

![automated-security-response-on-aws_architecture_diagram.png](/images/securityhub/automated-security-response-on-aws_architecture_diagram.png)

## 📖 まとめ

![security-hub](/images/all/securityhub.png)
