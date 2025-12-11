<!--# Temporary elevated access management (TEAM) for AWS IAM Identity Center <!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。
手順画像などの一部は公式ドキュメントの画像を流用しております。

![TEAM](/images/team/home_page.png)

本ガイドは、全6部構成となっています。

- [TEAM for AWS IAM Identity Center 導入ガイド ──(1/6) 概要](./zenn-team-01-overview.md)
- [TEAM for AWS IAM Identity Center 導入ガイド ──(2/6) デプロイ](./zenn-team-02-deployment-guide.md)
- [TEAM for AWS IAM Identity Center 導入ガイド ──(3/6) DeepDive](./zenn-team-03-deepdive.md)
- [TEAM for AWS IAM Identity Center 導入ガイド ──(4/6) 申請者/承認者向けガイド](./zenn-team-04-guides-01-requestor-and-approver.md)
- [TEAM for AWS IAM Identity Center 導入ガイド ──(5/6) 管理者向けガイド](./zenn-team-04-guides-02-administrator.md)
- [TEAM for AWS IAM Identity Center 導入ガイド ──(6/6) 監査者向けガイド](./zenn-team-04-guides-03-auditor.md)

本ページでは、TEAMの仕組みを詳しく解説します。

**📌 対象読者**

- TEAMの内部実装を理解したい技術者
- カスタマイズを検討している開発者
- トラブルシューティングを行う必要がある運用担当者

## 👀 Contents<!-- omit in toc -->

- [1. アーキテクチャの詳細](#1-アーキテクチャの詳細)
  - [1.1. 権限ライフサイクル管理の仕組み](#11-権限ライフサイクル管理の仕組み)
    - [1.1.1. データストア (DynamoDB)](#111-データストア-dynamodb)
    - [1.1.2. Waitステートの実装詳細](#112-waitステートの実装詳細)
    - [1.1.3. Step Functionsワークフロー](#113-step-functionsワークフロー)
  - [1.2. トラブルシューティング](#12-トラブルシューティング)
    - [1.2.1. 申請一覧に自分の申請が表示されない](#121-申請一覧に自分の申請が表示されない)
    - [1.2.2. 特定の権限セットが選択できない](#122-特定の権限セットが選択できない)
- [📖 まとめ](#-まとめ)
  - [次のステップ](#次のステップ)
  - [参考リソース](#参考リソース)

## 1. アーキテクチャの詳細

![TEAM architecture](/images/team/process-flow.png)

<!-- Duration: 0:01:30 -->

### 1.1. 権限ライフサイクル管理の仕組み

#### 1.1.1. データストア (DynamoDB)

![dynamodb](/images/team/archi-dynamodb.png)

TEAMは、AWS DynamoDBを使用して、権限申請のライフサイクル全体を管理します。
以下の5つのテーブルで構成されています。

- Requests Table: 申請情報と状態を管理
- Approver Table: 承認者ポリシーの定義を管理
- Eligibility Table: 申請可能な権限の定義を管理
- Settings Table: アプリケーション設定を管理
- Sessions Table: CloudTrail Lake に StartQuery APIを実行したクエリIDを管理。取得結果をポーリングするために利用。TTL有効（項目: `expireAt`）

#### 1.1.2. Waitステートの実装詳細

TEAMではStep Functionsで権限申請のライフサイクルを管理していますが、ライフサイクル管理の重要なポイントである Waitステートについて解説します。

Step Functionsの[Waitステート](https://docs.aws.amazon.com/step-functions/latest/dg/state-wait.html)の特徴は次のとおりです。

Waitステートの指定は、相対時間と絶対時間があります。

- 相対時間（秒）: `SecondsPath`
  - 0～99,999,999
- 絶対時間（ISO 8601）: `TimestampPath`
  - 例: 2024-08-18T17:33:00Z

指定できる最大待機時間は、[Standard Workflows]が1年で、[Express Workflows]が5分となります。(厳密には、ステートマシン全体の実行時間)
TEAMでは、[Standard Workflows]を使用していますので最大時間は1年（8,760時間）となります。
ただし、TEAMでは最大時間は「8000時間」に制限をしています。

これはドキュメント(参考: [Eligibility policy](https://aws-samples.github.io/iam-identity-center-team/docs/overview/policies.html))でも以下のように明記されています。

```text
Maximum duration: Determines the maximum elevated access duration in hours 
(between 1 - 8000 hours / ~ 1 year) that can be requested by an entity.
```

コード上でも以下の実装が確認できます。

[iam-identity-center-team/src/components/Admin/Eligible.js#L537](https://github.com/aws-samples/iam-identity-center-team/blob/main/src/components/Admin/Eligible.js#L537)

```javascript
if (!duration || isNaN(duration) || Number(duration) > 8000 || Number(duration) < 1) {
  setDurationError(`Enter number between 1-8000`);
  valid = false;
}
```

#### 1.1.3. Step Functionsワークフロー

![sfn](/images/team/archi-sfn.png)

TEAMは5つの Step FunctionsState Machine で権限のライフサイクルを管理します。

1. Approval State Machine: 申請者への通知、申請期限切れまで待機
2. Schedule State Machine: 申請者への通知、権限利用開始日時まで待機
3. Grant State Machine: 申請者への通知、権限付与、権限付与期間終了まで待機
4. Revoke State Machine: 権限はく奪と、申請者への通知
5. Reject State Machine: 申請の棄却やキャンセル、申請者/承認者への通知

各State Machineの処理フローは次のとおりです。

1. Approval State Machine（承認フェーズ）

![approval-sm](/images/team/sfn/team-approval-sm.jpg)

このステートマシンでは、以下の処理を行います。

- 承認者への通知
- 設定された承認期限（相対時間（秒数））まで待機（Waitステート）
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

2. Schedule State Machine（スケジュールフェーズ）

![schedule-sm](/images/team/sfn/team-schedule-sm.jpg)

このステートマシンでは、以下の処理を行います。

- リクエストステータスを `scheduled` に更新
- 申請者へ通知
- 申請時に指定した"Start Time"（絶対時刻（ISO 8601形式））まで待機（Waitステート）
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

3. Grant State Machine（権限付与フェーズ）

![grant-sm](/images/team/sfn/team-grant-sm.jpg)

このステートマシンでは、以下の処理を行います。

- [CreateAccountAssignment API](https://docs.aws.amazon.com/singlesignon/latest/APIReference/API_CreateAccountAssignment.html)実行（権限付与）
- リクエストステータスを `in progress` に更新
- DynamoDBに開始時刻を記録
- 申請者への通知
- 申請時に指定した"Duration"（相対時間（秒数））まで待機（Waitステート）
  ```json
  "Wait": {
    "Next": "Revoke Permission",
    "SecondsPath": "$.duration",
    "Type": "Wait"
  }
  ```
- Revoke State Machineを起動

4. Revoke State Machine（権限削除フェーズ）

![revoke-sm](/images/team/sfn/team-revoke-sm.jpg)

このステートマシンでは、以下の処理を行います。

- [DeleteAccountAssignment API](https://docs.aws.amazon.com/singlesignon/latest/APIReference/API_DeleteAccountAssignment.html)実行（権限削除）
- リクエストステータスを `ended` または `revoked` に更新
- DynamoDB に終了時刻を記録
- 申請者への通知

5. Reject State Machine（キャンセル/棄却フェーズ）

![reject-sm](/images/team/sfn/team-reject-sm.jpg)

このステートマシンでは、以下の処理を行います。

- ステータスが `rejected` か `cancelled` かを判定
- 申請者/承認者への通知

### 1.2. トラブルシューティング

#### 1.2.1. 申請一覧に自分の申請が表示されない

申請一覧に表示される申請には、自分自身が行った申請は表示されません。

![approve_requests](/images/team/approver/approve_requests.jpg)

申請一覧では、GraphQLクエリのフィルタ条件として`"email": {"ne": "ログインユーザーのメールアドレス"}`を指定しています。これにより、自分自身が申請したリクエストは除外されます。

以下は実際のGraphQLクエリの抜粋です。

```json
{
	"query": "query ListRequests($filter: ModelRequestsFilterInput, $limit: Int, $nextToken: String) {\n
  listRequests(filter: $filter, limit: $limit, nextToken: $nextToken) {\n items {\nid\nemail\naccountId\naccountName...}
  \n}\n",
	"variables": {
		"filter": {
			"and": [
				{
					"email": {"ne": "your-name@example.com"}
				},
				{
					"status": {"eq": "pending"}
				},
				{
					"approvers": {"contains": "your-name@example.com"}
				}
			]
		},
		"nextToken": null
	}
}
```

参考:

[iam-identity-center-team/src/graphql
/queries.js>ListRequests](https://github.com/aws-samples/iam-identity-center-team/blob/main/src/graphql/queries.js#L36)

[iam-identity-center-team/src/components/Approvals
/Approvals.js#L234](https://github.com/aws-samples/iam-identity-center-team/blob/main/src/components/Approvals/Approvals.js#L234)

#### 1.2.2. 特定の権限セットが選択できない

TEAMアプリケーションの申請画面に、特定の権限セットが表示されない場合があります。
この理由は、[iam-identity-center-team\amplify\backend\function\teamGetPermissionSets\src\index.py#L120](https://github.com/aws-samples/iam-identity-center-team/blob/main/amplify/backend/function/teamGetPermissionSets/src/index.py#L120)にあります。

```python
109 def handler(event, context):
110     print(event)
111     id = event['id']
112     permissions = []
113     mgmt_ps = get_mgmt_ps()
114     deployed_in_mgmt = True if ACCOUNT_ID == mgmt_account_id else False
115     try:
116         p = client.get_paginator('list_permission_sets')
117         paginator = p.paginate(InstanceArn=sso_instance['InstanceArn'])
118
119          for page in paginator:
120              for permission in page['PermissionSets']:
121                  if not deployed_in_mgmt:
122                      if permission not in mgmt_ps:
123                          permissions.append(getPS(permission))
124                  else:
125                      permissions.append(getPS(permission))
126          permissions =  sorted(permissions, key=itemgetter('Name')) 
:
```

このコードでは、以下のロジックで権限セットをフィルタリングしています。

1. TEAMが委任されたアカウントにデプロイされている場合（`deployed_in_mgmt == False`）
2. AWS Organizationsの管理アカウントに割り当てられた権限セット（`mgmt_ps`）を除外（122行目）
3. それ以外の権限セットのみを申請可能として表示

結果として、以下の権限セットは申請画面に表示されません。

- `AdministratorAccess`
- `ReadOnlyAccess`
- その他、AWS Organizationsの管理アカウントに割り当てられているAWS管理ポリシー

💡 この制約の理由: 

AWS Organizationsの管理アカウント割り当てられている権限セットは、組織全体のセキュリティに重大な影響を与える可能性があります。TEAMはこのリスクを考慮し、管理アカウントに割り当てられた権限セットは一時的なアクセスに使用できないよう、意図的に制限しているのだと考えます。

```python
# AWS Organizationsの管理アカウントIDを取得
# see: https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/sso-admin/client/list_permission_sets_provisioned_to_account.html
def get_mgmt_account_id():
    org_client = boto3.client('organizations')
    try:
        response = org_client.describe_organization()
        return response['Organization']['MasterAccountId']
    except ClientError as e:
        print(e.response['Error']['Message'])

mgmt_account_id = get_mgmt_account_id()

# AWS Organizationsの管理アカウントにプロビジョニングされた権限セットを取得
def get_mgmt_ps():
    try:
        p = client.get_paginator('list_permission_sets_provisioned_to_account')
        paginator = p.paginate(
            InstanceArn=sso_instance['InstanceArn'],
            AccountId=mgmt_account_id,)
        all_permissions = []
        for page in paginator:
            all_permissions.extend(page["PermissionSets"])
        return all_permissions
    except ClientError as e:
        print(e.response['Error']['Message'])
        return []
```

## 📖 まとめ

本記事では、TEAMの内部実装について詳しく解説しました。

TEAMのコアとなる仕組みは以下の3つです。

1. DynamoDBによるデータ管理: 5つのテーブルで申請情報、承認者、権限定義を管理
2. Step Functionsによるライフサイクル管理: 5つのState Machineで権限の承認から削除までを自動化
3. Waitステートによる時間制御: 最大8000時間（約11ヶ月）の柔軟な権限期間設定

特に、Step FunctionsのWaitステートを活用した実装は、AWSのサーバーレスアーキテクチャを最大限に活用した設計です。申請期限、権限開始時刻、権限終了時刻をすべて自動管理することで、運用負荷を大幅に削減しています。

### 次のステップ

次の記事「TEAM導入ガイド(4/6) 申請者/承認者向けガイドライン編」では、申請者および承認者向けのガイドラインについて詳しく解説します。

### 参考リソース

TEAMに関するさらに詳しい情報は、以下の公式リソースを参照してください。

- [TEAM 公式ドキュメント](https://aws-samples.github.io/iam-identity-center-team/)
- [GitHub リポジトリ](https://github.com/aws-samples/iam-identity-center-team/tree/main)
- [AWS Security Blog](https://aws.amazon.com/jp/blogs/security/temporary-elevated-access-management-with-iam-identity-center/)
- [builders.flash 記事（AWS Community Hero: 山口 正徳氏）](https://aws.amazon.com/jp/builders-flash/202505/temporary-elevated-access-management/)
