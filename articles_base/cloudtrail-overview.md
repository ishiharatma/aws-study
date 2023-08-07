# AWS CloudTrail

## はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## Contents

- [AWS CloudTrail](#aws-cloudtrail)
  - [はじめに](#はじめに)
  - [Contents](#contents)
  - [CloudTrail とは](#cloudtrail-とは)
  - [CloudTrail の基本](#cloudtrail-の基本)
  - [管理イベント](#管理イベント)
  - [データイベント](#データイベント)
  - [CloudTrail ログファイル名の形式](#cloudtrail-ログファイル名の形式)
  - [ログのフォーマット](#ログのフォーマット)
  - [監視する主要なログ](#監視する主要なログ)
  - [AWS CloudTrail ログのクエリの Athena による分析](#aws-cloudtrail-ログのクエリの-athena-による分析)
  - [CloudTrail Lake](#cloudtrail-lake)
  - [まとめ](#まとめ)

## CloudTrail とは

Duration: 0:59:46

CloudTrail は、AWS アカウントのガバナンス、コンプライアンス、運用監査、リスク監査を行うためのサービスです。
アカウントのアクティビティをログ記録し、継続的にモニタリングできます。

【AWS Black Belt Online Seminar】[AWS CloudTrail(YouTube)](https://www.youtube.com/watch?v=_mmZa1Blxc4)(59:46)

![blackbelt-cloudtrail](/images/cloudtrail/blackbelt-cloudtrail-320.jpg)

[CloudTrail サービス概要](https://aws.amazon.com/jp/cloudtrail/)

[CloudTrail ドキュメント](https://docs.aws.amazon.com/ja_jp/cloudtrail/?id=docs_gateway)

[CloudTrail よくある質問](https://aws.amazon.com/jp/cloudtrail/faqs/)

[CloudTrail の料金](https://aws.amazon.com/jp/cloudtrail/pricing/)

## CloudTrail の基本

Duration: 0:01:30

CloudTrailで記録できるイベントは次のとおりです。

- 管理イベント
  - AWS アカウントのリソースで実行される管理およびネットワーク操作のAPIアクティビティ
  - 例：セキュリティグループの設定をいつ誰が変更したか
  - デフォルトで記録されるようになっています
- データイベント
  - データリクエスト操作のAPIアクティビティ
  - 例：S3バケットのデータ操作をいつ誰が行ったか
  - デフォルトでは記録が「OFF」になっています
- Insights イベント
  - 短期間の過剰な API 呼び出しなど、過去の API 使用状況の機械学習によって得られたデータから 管理イベントの異常なAPIアクティビティを検出
  - デフォルトでは記録が「OFF」になっています

これらの管理イベントは、コンソール上から履歴を参照することが可能で、90日間の履歴は無料となっています。
それ以上保存しなければならない要件がある場合は、別途 S3 や CloudWatch Logs へエクスポートする設定を行っておく必要があります。

CloudTrail のイベント記録の大部分は、「管理イベント」と「データイベント」になります。

Insights イベントについては、[AWS ドキュメント](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/logging-insights-events-with-cloudtrail.html) を参照してください。

[AWS CloudTrail の開始方法のチュートリアル](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/cloudtrail-tutorial.html) を実施して、理解を深めるのもおすすめです。

## 管理イベント

Duration: 0:01:30

管理イベントは、アカウント内のリソースに対して実行されるすべての管理操作と、ほぼすべての非 API アクションが含まれます。
非 API アクションとは、コンソールへのログイン（AwsConsoleSignIn）などです。

## データイベント

Duration: 0:01:30

AWS IAM ロール、Amazon EC2 インスタンス、Amazon S3 バケット、AWS Lambda 関数などのリソースまたはサービス上または内部で実行される操作が含まれます。
これらの操作は、AWS サービスを利用して構築したシステムの多くの場合で大量のアクティビティが発生するイベントのため、デフォルトでは無効になっています。

## CloudTrail ログファイル名の形式

Duration: 0:01:30

[CloudTrail ログファイル名の形式](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/cloudtrail-log-file-examples.html#cloudtrail-log-filename-format)

ログファイルは次のような名称で出力されます。

```text
AccountID_CloudTrail_RegionName_YYYYMMDDTHHmmZ_UniqueString.FileNameFormat 
```

S3 にエクスポートした場合は、次のようになります。

```text
111122223333_CloudTrail_us-east-2_20150801T0210Z_Mu0KsOhtH1ar15ZZ.json.gz
```

![cloudtrail-s3](/images/cloudtrail/cloudtrail-s3.png)

## ログのフォーマット

Duration: 0:03:00

[ログファイルの例](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/cloudtrail-log-file-examples.html#cloudtrail-log-file-examples-section)

ConsoleLogin 時の例です。

```json
{
    "eventVersion": "1.08",
    "userIdentity": {
        "type": "IAMUser",
        "principalId": "AIDAAAAAAAAAAAAAAAAAA",
        "arn": "arn:aws:iam::111111111111:user/Alice",
        "accountId": "111111111111",
        "userName": "Alice"
    },
    "eventTime": "2023-04-05T01:14:33Z",
    "eventSource": "signin.amazonaws.com",
    "eventName": "ConsoleLogin",
    "awsRegion": "ap-northeast-1",
    "sourceIPAddress": "192.0.2.111",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    "requestParameters": null,
    "responseElements": {
        "ConsoleLogin": "Success"
    },
    "additionalEventData": {
        "LoginTo": "https://ap-northeast-1.console.aws.amazon.com/console/home?xxxxx",
        "MobileVersion": "No",
        "MFAIdentifier": "arn:aws:iam::111111111111:mfa/Alice",
        "MFAUsed": "Yes"
    },
    "eventID": "814cde86-2626-41ab-9557-6c7299981035",
    "readOnly": false,
    "eventType": "AwsConsoleSignIn",
    "managementEvent": true,
    "recipientAccountId": "111111111111",
    "eventCategory": "Management",
    "tlsDetails": {
        "tlsVersion": "TLSv1.2",
        "cipherSuite": "ECDHE-RSA-AES128-GCM-SHA256",
        "clientProvidedHostHeader": "ap-northeast-1.signin.aws.amazon.com"
    }
}
```

よく使いそうな主な項目は次のとおりです。詳細は[AWS ドキュメント](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html)を参照してください。

- eventSource
  - リクエストが行われたサービス。この名前は通常、スペースなしのサービス名の短縮形に .amazonaws.com を付けたもの
    - cloudformation.amazonaws.com、ec2.amazonaws.com、signin.amazonaws.com など
- eventName
  - リクエストされたアクション。そのサービスの API アクションの 1 つです。
    - ConsoleLogin、SwitchRole、CreateUser、CreateVpc など
- errorCode
  - AWS のサービスエラー
  - [エラーコードとメッセージログの例](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/cloudtrail-log-file-examples.html#error-code-and-error-message)
  - 例えば、`AccessDenied` といった文字列が含まれます。
- errorMessage
  - リクエストがエラーを返す場合、エラーの説明
  - [エラーコードとメッセージログの例](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/cloudtrail-log-file-examples.html#error-code-and-error-message)
  - 認証失敗の場合は、`Failed authentication` が含まれます。
- additionalEventData
  - リクエストまたはレスポンスの一部ではないイベントに関する追加のデータ
  - 例えば、MFAを利用したかどうかは `MFAUsed` に格納されます。
- eventType
  - イベントレコードを生成したイベントのタイプ
  - AwsApiCall、AwsServiceEvent、AwsConsoleAction、AwsConsoleSignIn、AwsCloudTrailInsight

## 監視する主要なログ

Duration: 0:05:00

[Amazon CloudWatch Logs による CloudTrail ログファイルをモニタリングする](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/monitor-cloudtrail-log-files-with-cloudwatch-logs.html)

[CloudTrail イベントの CloudWatch アラームの作成: 例](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/cloudwatch-alarms-for-cloudtrail.html)


- ユーザーアカウント
  - ルートアカウントの使用を監視
    - ```"{$.userIdentity.type=\"Root\" && $.userIdentity.invokedBy NOT EXISTS && $.eventType !=\"AwsServiceEvent\"}```
  - コンソールへの認証失敗を監視
    - ```"{ ($.eventName = ConsoleLogin) && ($.errorMessage = \"Failed authentication\") }"```
  - 他要素認証 (MFA) を使用していないコンソールサインインを監視
    - ```"{ $.eventName = \"ConsoleLogin\" && $.additionalEventData.MFAUsed = \"No\" }"```
  - IAMポリシーやポリシーへの変更を監視
    - ```"{($.eventName=DeleteGroupPolicy)||($.eventName=DeleteRolePolicy)||($.eventName=DeleteUserPolicy)||($.eventName=PutGroupPolicy)||($.eventName=PutRolePolicy)||($.eventName=PutUserPolicy)||($.eventName=CreatePolicy)||($.eventName=DeletePolicy)||($.eventName=CreatePolicyVersion)||($.eventName=DeletePolicyVersion)||($.eventName=AttachRolePolicy)||($.eventName=DetachRolePolicy)||($.eventName=AttachUserPolicy)||($.eventName=DetachUserPolicy)||($.eventName=AttachGroupPolicy)||($.eventName=DetachGroupPolicy)}"```
  - IAMユーザの作成を監視
    - ```"{($.eventName=CreateUser)||($.eventName=CreateLoginProfile)}"```
  - IAMアクセスキーの作成を監視
    - ```"{$.eventName=CreateAccessKey}"```
  - SwitchRoleエラーの連続発生を監視
    - ```"{ $.eventSource = \"signin.amazonaws.com\" && $.eventName = \"SwitchRole\" && $.responseElements.SwitchRole= \"Failure\" }"```
  - セッションマネージャーでのログインを監視
    - ```"{ ($.eventSource = \"s3.amazonaws.com\") && ($.eventName = \"StartSession\" || $.eventName = \"ResumeSession\" || $.eventName = \"TerminateSession\") }"```
- 不正アクセス
  - CloudTrailの変更を監視
    - ```"{ ($.eventName = CreateTrail) || ($.eventName = UpdateTrail) || ($.eventName = DeleteTrail) || ($.eventName = StartLogging) || ($.eventName = StopLogging) }"```
  - GuardDuty 検出システムの削除
    - ```"{ ($.eventSource = \"guardduty.amazonaws.com\") && ($.eventName = \"DeleteDetector\") }"```
  - KMSキーの無効またはスケジュールされた削除の発生を監視
    - ```"{ $.eventSource = kms.amazonaws.com && ($.eventName = \"DisableKey\" || $.eventName = \"ScheduleKeyDeletion\") }"```
  - 無効または削除されたKMSのキー使用時のエラー発生を監視
    - ```"{ $.eventSource = kms.amazonaws.com && $.errorCode = \"*Exception\" }"```
  - 不正な API 呼び出しの発生を監視
    - ```"{($.errorCode = "*UnauthorizedOperation" || $.errorCode = "AccessDenied*") && ($.eventName != "Decrypt" || $.userIdentity.invokedBy != "config.amazonaws.com" )}"```
  - EC2 インスタンスの作成、終了、起動、停止、再起動
    - ```"{ ($.eventName = RunInstances) || ($.eventName = RebootInstances) || ($.eventName = StartInstances) || ($.eventName = StopInstances) || ($.eventName = TerminateInstances) }"```
  - サイズの大きい EC2 インスタンス (4x or 8x-large) の作成、終了、起動、停止、再起動
    - ```"{ ($.eventName = RunInstances) && (($.requestParameters.instanceType = *.8xlarge) || ($.requestParameters.instanceType = *.4xlarge)) }"```
- バケット
  - S3バケットポリシーへの変更を監視
    - ```"{ ($.eventSource = \"s3.amazonaws.com\") && ($.eventName = \"PutBucketPolicy\") }"```
  - S3 パブリックアクセスブロックの削除
    - ```"{ ($.eventSource = \"s3.amazonaws.com\") && ($.eventName = \"DeleteAccountPublicAccessBlock\") }"```
- ネットワークコンポーネント
  - Amazon Virtual Private Cloud (VPC) の変更を監視
    - ```"{ ($.eventName = CreateVpc) || ($.eventName = DeleteVpc) || ($.eventName = ModifyVpcAttribute) || ($.eventName = AcceptVpcPeeringConnection) || ($.eventName = CreateVpcPeeringConnection) || ($.eventName = DeleteVpcPeeringConnection) || ($.eventName = RejectVpcPeeringConnection) || ($.eventName = AttachClassicLinkVpc) || ($.eventName = DetachClassicLinkVpc) || ($.eventName = DisableVpcClassicLink) || ($.eventName = EnableVpcClassicLink) }"```
  - ネットワークゲートウェイの変更を監視
    - ```"{ ($.eventName = CreateCustomerGateway) || ($.eventName = DeleteCustomerGateway) || ($.eventName = AttachInternetGateway) || ($.eventName = CreateInternetGateway) || ($.eventName = DeleteInternetGateway) || ($.eventName = DetachInternetGateway) }"```
  - セキュリティグループへの変更を監視
    - ```"{ ($.eventName = AuthorizeSecurityGroupIngress) || ($.eventName = AuthorizeSecurityGroupEgress) || ($.eventName = RevokeSecurityGroupIngress) || ($.eventName = RevokeSecurityGroupEgress) || ($.eventName = CreateSecurityGroup) || ($.eventName = DeleteSecurityGroup) }"```
  - ネットワークアクセスコントロールリスト (ACL) の変更を監視
    - ```"{ ($.eventName = CreateNetworkAcl) || ($.eventName = CreateNetworkAclEntry) || ($.eventName = DeleteNetworkAcl) || ($.eventName = DeleteNetworkAclEntry) || ($.eventName = ReplaceNetworkAclEntry) || ($.eventName = ReplaceNetworkAclAssociation) }"```

## AWS CloudTrail ログのクエリの Athena による分析

Duration: 0:01:30

[AWS CloudTrail ログのクエリ](https://docs.aws.amazon.com/ja_jp/athena/latest/ug/cloudtrail-logs.html)

CloudTrail のログを Athena を使って分析できます。
CloudTrail の証跡画面を開き、「Athenaテーブルを作成」をクリックします。
![cloudtrail-athena-00](/images/cloudtrail/cloudtrail-athena-00.png)

対象の S3 バケットを指定します。
![cloudtrail-athena-01](/images/cloudtrail/cloudtrail-athena-01.png)

これだけで、Athena テーブルが作成されました。
![cloudtrail-athena-02](/images/cloudtrail/cloudtrail-athena-02.png)

クエリエディタで、SQL を使って分析できます。
例えば、次のような「ログインレポート」を出力する SQL です。

```sql
SELECT
  eventTime,
  eventSource,
  eventName,
  awsRegion,
  sourceIPAddress,
  userIdentity.type,
  userIdentity.arn
FROM cloudtrail_logs_cloudtrail
WHERE eventName = 'ConsoleLogin'
LIMIT 10;
```

## CloudTrail Lake

Duration: 0:01:30

https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/cloudtrail-lake.html

こちらも、Athena と同様に SQL で分析できます。

![cloudtrail-lake-00](/images/cloudtrail/cloudtrail-lake-00.png)

![cloudtrail-lake-01](/images/cloudtrail/cloudtrail-lake-01.png)

## まとめ

![cloudtrail](/images/all/cloudtrail.png)
