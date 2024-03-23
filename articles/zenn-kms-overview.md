---
title: "【初心者向け】AWS KMS入門！完全ガイド" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: true
---

# AWS Key Management Service（KMS）

## ☘️ はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents

- [AWS Key Management Service（KMS）](#aws-key-management-servicekms)
  - [☘️ はじめに](#️-はじめに)
  - [👀 Contents](#-contents)
  - [KMS とは](#kms-とは)
  - [基本概念](#基本概念)
  - [マスターキーとデータキー](#マスターキーとデータキー)
  - [マスターキー](#マスターキー)
  - [エイリアス](#エイリアス)
  - [キーマテリアル](#キーマテリアル)
  - [キーポリシー](#キーポリシー)
  - [マルチリージョンキー](#マルチリージョンキー)
  - [別の AWS アカウントへの許可](#別の-aws-アカウントへの許可)
  - [キーの削除](#キーの削除)
    - [削除予定または無効化された CMK の使用を通知](#削除予定または無効化された-cmk-の使用を通知)
    - [キーが削除予定または無効化された場合の通知](#キーが削除予定または無効化された場合の通知)
  - [データキーキャッシュ](#データキーキャッシュ)
  - [クライアントサイド暗号化とサーバサイド暗号化](#クライアントサイド暗号化とサーバサイド暗号化)
  - [📖 まとめ](#-まとめ)

## KMS とは

Duration: 0:59:33

暗号化操作に使用されるキーを簡単に作成および管理できるマネージドサービスです。

【AWS Black Belt Online Seminar】[AWS Key Management Service(YouTube)](https://www.youtube.com/watch?v=4F5rSxzu0U4)(0:59:33)

![blackbelt-kms](/images/kms/blackbelt-kms-s.jpg)

[KMS サービス概要](https://aws.amazon.com/jp/kms/)

[KMS ドキュメント](https://docs.aws.amazon.com/ja_jp/kms/?id=docs_gateway)

[KMS よくある質問](https://aws.amazon.com/jp/kms/faqs/)

[KMS の料金](https://aws.amazon.com/jp/kms/pricing/)

## 基本概念

Duration: 0:01:30

[基本概念](https://docs.aws.amazon.com/ja_jp/kms/latest/cryptographic-details/basic-concepts.html)

KMS では、[エンベロープ暗号化](https://docs.aws.amazon.com/ja_jp/wellarchitected/latest/financial-services-industry-lens/use-envelope-encryption-with-customer-master-keys.html)を使用しています。
これは、データを暗号化する鍵(データキー)とデータキーを暗号化する鍵(マスターキー)を利用する方式で、セキュリティが強化されます。

KMS のキーに対する操作は CloudTrail に記録されます。詳しくは、「[AWS KMS による AWS CloudTrail API コールのログ記録](https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/logging-using-cloudtrail.html)」を参照してください。

![kms](/images/kms/kms-overview.png)

## マスターキーとデータキー

Duration: 0:01:30

KMS では、マスターキーとデータキーという 2 種類の鍵が登場します。

- マスターキー(Customer Master Key: CMK)
  - データキーを暗号化するキー
  - AWS の管理下において、マスターキーも暗号化して格納されています
- データキー(Customer Data Key: CDK)
  - データを暗号化するキー
  - `kms:GenerateDataKey` を使用して平文のデータキーと暗号化されたデータキーを都度生成します。
  - `kms:GenerateDataKeyWithoutPaintext` では、暗号化されたデータキーのみを生成します。
  - 後述のサーバサイド暗号化の場合はデータ暗号化後に平文のキーは削除されますが、クライアントサイド暗号化の場合はクライアント側が保持している平文のキーを削除するようにします。残しておいて第三者の手に渡った場合、暗号化されたデータを簡単に復号できてしまいます。

## マスターキー

Duration: 0:01:30

- AWS マネージド型キー
  - AWS サービスが作成・管理する CMK で、キー名が「aws/s3」 のようになっています。
  - 1 年ごとに自動的にローテーションされます
  - 無効化や削除ができません
- カスタマー管理型のキー
  - 利用者が作成・管理する CMK です。
  - 自動ローテーションを有効化することで、1 年ごとにローテーションさせることができます。
  - 1 年より短い周期でローテーションしたい場合は手動で新しいキーを作成します。
  - 無効化や削除ができます。
- AWS 所有のキー
  - AWS サービスの裏側で使用されるキーで、ユーザーからは見えないため、意識する必要はありません。
  - 利用者から見えないので、無効化や削除はできません

## エイリアス

Duration: 0:01:30

CMK にはエイリアス（別名）を付けることができます。エイリアスを使用することで、キーをローテーションした場合など、エイリアスの紐づけを変更するだけで、アプリケーション側の更新が不要になります。

![kms-alias](/images/kms/kms-rotate.png)

エイリアス名の ARN は次のようになります。そのため、リージョン/アカウントで一意にする必要があります。

```text
arn:aws:kms:ap-northeast-1:123456789012:alias/aliasName
```

## キーマテリアル

Duration: 0:03:00

[キーマテリアル](https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/concepts.html#key-material)とは、「暗号化キーを生成するために必要な材料」であり「CMK 作成時に使用されるデータのこと」をいいます。

キーマテリアルは、次の 3 種類が指定できます。

- KMS
  - デフォルト
  - AWS 独自のキーストアに作成され管理されます。
  - アクセス制限はされていますが、物理的には他のアカウントと同じサーバ上に保管されています。
- 外部
  - 利用者が作成した共通鍵を指定します
- カスタムキーストア（CloudHSM）
  - これを利用するには、[AWS CloudHSM クラスターを事前に作成](https://docs.aws.amazon.com/ja_jp/cloudhsm/latest/userguide/create-cluster.html)しておく必要があります。
  - AWS CloudHSM クラスター とは、ユーザー自身しかアクセスできない 専用 HSM（ハードウェアセキュリティモジュール）インスタンスを作成してデータセキュリティのコンプライアンスを満たすことができるキーストアを作成できるもの。HSM は VPC 内で実行されます。
  - VPC 内に配置しているので、レイテンシーは低い。
  - 冗長化構成は利用者の責任範囲となる。推奨は AZ を跨いだ 2 台以上の HSM インスタンス
  - [AWS CloudHSM の概要](https://docs.aws.amazon.com/ja_jp/cloudhsm/latest/userguide/introduction.html)
  - [AWS CloudHSM のよくある質問](https://aws.amazon.com/jp/cloudhsm/faqs/)
  - 料金は東京リージョンでは、1 時間当たり 1.81USD と KMS に比べると高額です。
  - 次のような要件がある場合に利用します。
    - PCI DSS やその他の特定の縦断的なセキュリティ標準
    - 政府のワークロード
    - FIPS 認可要求ポリシー
    - RDS Oracle での[透過的なデータ暗号化](https://docs.oracle.com/cd/E57425_01/121/ASOAG/introduction-to-transparent-data-encryption.htm) (Transparent data encryption: TDE) サポート

## キーポリシー

Duration: 0:01:00

CMK にはリソースベースの[キーポリシー](https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/key-policies.html)を付与することができます。
これにより、特定のサービスからのみアクセスさせるといった制御ができます。
CMK 作成時には[デフォルトのキーポリシー](https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/key-policy-default.html)が設定されているので、必要に応じて変更します。

キーポリシーに指定できる代表的な条件は次のとおりです。その他については、[AWS KMS 条件キー](https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/policy-conditions.html)を参照してください。

- kms:ViaService
- kms:CallerAccount
- kms:EncryptionAlgorithm
- kms:KeyOrigin
- kms:ValidTo

## マルチリージョンキー

Duration: 0:01:00

単一リージョンで作成した CMK はエクスポートのインポートも出来ないため、作成したリージョン以外では使用することができません。
しかし、[マルチリージョンキー](https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/multi-region-keys-overview.html)を選択することで、複数のリージョンにレプリケートすることが可能です。

## 別の AWS アカウントへの許可

Duration: 0:01:00

CMK は別のアカウントに使用を許可することができます。

次のように使用を許可するアカウントを指定すると、キーポリシーに反映されます。
![kms-use-other-account](/images/kms/kms-use-other-account.png)

![kms-use-other-account-policy](/images/kms/kms-use-other-account-policy.png)

## キーの削除

Duration: 0:05:00

[キーの削除](https://docs.aws.amazon.com/ja_jp/kms/latest/cryptographic-details/key-deletion.html)

CMK は即時削除することはできません。削除スケジュールを設定し、一定期間後に削除されます。
削除スケジュールは、7 日～ 30 日を指定できます。この期間内であれば削除をキャンセルすることができます。
削除されると、既存データを二度と復号できなくなるので注意が必要です。

削除ではなく、無効化することもできますのでまずは無効化を行い、本当にキーが使用されていないことを確認することを推奨します。

[キーの有効化と無効化](https://docs.aws.amazon.com/ja_jp/kms/latest/cryptographic-details/enable-and-disable-key.html)

削除予定の CMK が利用されたら通知させることもできます。

### 削除予定または無効化された CMK の使用を通知

[削除保留中の KMS キーの使用を検出するアラームの作成](https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/deleting-keys-creating-cloudwatch-alarm.html)
[キーステータスの表](https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/key-state.html)

CloudTrail に以下のイベントが記録されます。

- 削除予定

  - KMSInvalidStateException

  ```text
  {
    "errorCode": "KMSInvalidStateException",
    "errorMessage": "arn:aws:kms:ap-northeast-1:123456789012:key/XXX is pending deletion."
  }
  ```

- 無効化

  - DisabledException

  ```text
  {
    "errorCode": "KMSInvalidStateException",
    "errorMessage": "arn:aws:kms:ap-northeast-1:123456789012:key/XXX is disabled."
  }
  ```

フィルタパターン例

```text
{($.eventSource=kms.amazonaws.com) && (($.errorCode="KMSInvalidStateException") || ($.errorCode="DisabledException"))}

OR

{($.eventSource=kms.amazonaws.com) && (($.errorCode="*Exception"))}

```

### キーが削除予定または無効化された場合の通知

次の CloudTrail イベントを監視することで通知が可能です。

- 削除予定
  - 「eventName」が[ScheduleKeyDeletion](https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/ct-schedule-key-deletion.html)
- 無効化
  - 「eventName」が[DisableKey](https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/ct-disablekey.html)

フィルタパターン例

```text
{($.eventSource=kms.amazonaws.com) && (($.eventName="DisableKey") || ($.eventName="ScheduleKeyDeletion"))}
```

## データキーキャッシュ

Duration: 0:00:15

AWS Encryption SDK の機能として、「[データキーキャッシュ](https://docs.aws.amazon.com/ja_jp/encryption-sdk/latest/developer-guide/data-caching-details.html)」があります。
これを利用することでデータキー取得の API コールを減らすことができます。

## クライアントサイド暗号化とサーバサイド暗号化

Duration: 0:03:00

KMS を利用した暗号化は、次の 2 種類があります。

- クライアントサイド暗号化（Client-Side-Encryption: CSE）
  - アプリケーション側で暗号化を実施します。
  - アプリケーション側で暗号化済みデータを送信するので、AWS までの通信経路上は暗号化された状態となります。
  - クライアントサイドで暗号化/復号の処理が必要なため、実装に手間がかかります
- サーバサイド暗号化（Server-Side-Encryption: SSE）
  - AWS の各サービスが提供する暗号化を利用します。（例：S3 バケット）
  - ![s3-encrypt](/images/kms/s3-encrypt.png)
  - AWS 側で暗号化し、データにアクセスがあった場合は自動的に復号されます。
  - 通信経路上では暗号化されていません。（使用しているプロトコルによる暗号化は別）
  - クライアントサイドでの暗号化/復号の処理が必要ないため、実装が容易になります。

## 📖 まとめ

![kms-overview](/images/all/kms.png)
