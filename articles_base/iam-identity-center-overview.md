# AWS IAM Identity Center<!-- omit in toc -->

![icon](/images/icons/64/Arch_AWS-IAM-Identity-Center_64.png)

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

- [AWS IAM Identity Center とは](#aws-iam-identity-center-とは)
  - [AWS ドキュメント](#aws-ドキュメント)
  - [学習リソース](#学習リソース)
- [主要機能](#主要機能)
- [AWS SSO と AWS IAM Identity Center で変わっていないこと](#aws-sso-と-aws-iam-identity-center-で変わっていないこと)
- [IAM Identity Center の利用手順](#iam-identity-center-の利用手順)
- [IAM Identity Center の有効化](#iam-identity-center-の有効化)
  - [アカウントインスタンス](#アカウントインスタンス)
- [ID ソースの設定](#id-ソースの設定)
  - [自動プロビジョニング（SCIM）](#自動プロビジョニングscim)
- [ユーザーとグループ](#ユーザーとグループ)
- [許可セット(Permission Set)](#許可セットpermission-set)
  - [属性ベースのアクセス制御（ABAC）](#属性ベースのアクセス制御abac)
- [AWS アカウントへの割り当て](#aws-アカウントへの割り当て)
- [AWS アカウント以外への割り当て（アプリケーション）](#aws-アカウント以外への割り当てアプリケーション)
- [ログイン](#ログイン)
- [AWS CLI の設定](#aws-cli-の設定)
- [参考：委任管理の方法](#参考委任管理の方法)
- [📖 まとめ](#-まとめ)

## AWS IAM Identity Center とは

<!-- Duration: 1:49:12 -->

クラウド環境におけるアイデンティティとアクセス管理は、セキュリティと効率性の両面で重要な課題です。
この課題に対応するためのサービスが AWS IAM Identity Center です。
AWS Identity Center は、AWS アカウント、クラウドアプリケーション、およびオンプレミスアプリケーションへのシングルサインオン（SSO）アクセスを一元管理するサービスです。

以前は AWS Single Sign-On (AWS SSO)でしたが、機能拡張に伴い AWS IAM Identity Center に名称が変更されました。（[Jul 26, 2022](https://aws.amazon.com/jp/about-aws/whats-new/2022/07/aws-single-sign-on-aws-sso-now-aws-iam-identity-center/)）


### AWS ドキュメント

[AWS IAM Identity Center サービス概要](https://aws.amazon.com/jp/iam/identity-center/)

[AWS IAM Identity Center ドキュメント](https://docs.aws.amazon.com/ja_jp/singlesignon/?id=docs_gateway)

[AWS IAM Identity Center よくある質問](https://aws.amazon.com/jp/iam/identity-center/faqs/)

IAM Identity Center 自体の利用料金はかかりません

[入門チュートリアル](https://docs.aws.amazon.com/ja_jp/singlesignon/latest/userguide/tutorials.html)

### 学習リソース

【AWS Black Belt Online Seminar】[AWS アカウント シングルサインオンの設計と運用(YouTube)](https://www.youtube.com/watch?v=ZzD9-5XZgRE)(53:24)

![blackbelt-iam-sso](/images/blackbelt/blackbelt-iam-sso-320.jpg)

## 主要機能

1. 中央集権的なアクセス管理
   - マルチアカウント権限管理
   - きめ細かなアクセス制御を実現する許可セットの定義と割り当て
2. ID プロバイダー（IdP）の連携
   - 複数の IdP サポート
     - AWS Managed Microsoft AD、オンプレミスの Active Directory、外部の IdP との連携
     - SAML 2.0 準拠の IdP との互換性
3. セキュリティ強化
   - 複数の MFA 方式をサポート（ハードウェアトークン、ソフトウェアトークン）
   - セッションの有効期限設定、強制ログアウト機能
4. 監査とコンプライアンス
   - AWS CloudTrail との統合によるユーザーアクティビティの追跡
   - アクセス権限レポート、使用状況レポートの生成

## AWS SSO と AWS IAM Identity Center で変わっていないこと

サービス名が変更されただけで、技術的な機能や API（sso, sso-directory, and identitystore）は下位互換維持のため変更されていません。

## IAM Identity Center の利用手順

1. IAM Identity Center の有効化
2. ID ソースの設定
3. 多要素認証の設定
4. ユーザーとグループの作成
5. 許可セットの作成
6. AWS アカウントとの紐づけ
7. MFA デバイスの登録

## IAM Identity Center の有効化

![idc-enable.png](/images/iam-idc/idc-enable.png)

有効化できるリージョンは１つのみです。
選択したリージョンに IAM Identity Center で設定したすべてのデータが保存されるインスタンスが配置されます。

- 許可セット(Permission Set)
- ユーザーとグループ
- AWS アカウントへのユーザー/グループ割り当て情報

別のリージョンにしたい場合は、一度削除してから切り替える必要があります。切り替えると、 AWS アクセスポータル URL が変更され、これまで設定した情報を再設定する必要がありますので慎重に削除します。

![idc-delete](/images/iam-idc/idc-delete-01.png)

リージョンを選択するには、[AWS リージョンを選択する際の考慮事項](https://docs.aws.amazon.com/ja_jp/singlesignon/latest/userguide/get-started-prereqs-considerations.html#prereq-choose-region)を参考にして検討してください。

### アカウントインスタンス

IAM Identity Center は AWS Organizations での利用を想定しているため、単一 AWS アカウント（スタンドアロンアカウント）でも AWS Organizations を利用する必要がありましたが、2023 年 11 月 17 日に AWS Organizations なしでも利用可能になりました。

[AWS IAM アイデンティティセンターが新しいアカウントインスタンスを提供し、AWS マネージドアプリケーションの評価と導入を迅速化](https://aws.amazon.com/jp/about-aws/whats-new/2023/11/aws-iam-identity-center-account-instance-evaluation-adoption-managed-applications/)

ただし、公式として推奨するのは「組織インスタンス」のようです。

```text
We recommend that you enable IAM Identity Center with AWS Organizations,
which creates an organization instance of IAM Identity Center.
An organization instance is our recommended best practice
because it supports all features of IAM Identity Center and provides central management capabilities.

AWS Organizations で IAM Identity Center を有効にして、IAM Identity Center の組織インスタンスを
作成することをお勧めします。組織インスタンスは、IAM Identity Center のすべての機能をサポートし、
集中管理機能を提供するため、推奨されるベストプラクティスです。
```

参考：[AWS ドキュメント>IAM アイデンティティセンターの組織インスタンスとアカウントインスタンスの管理](https://docs.aws.amazon.com/ja_jp/singlesignon/latest/userguide/identity-center-instances.html)

## ID ソースの設定

IAM Identity Center を有効化したら、次に「ID ソース」（ユーザー情報をどこで管理するか）を決めます。選択肢は以下の3つです。

1. **IAM Identity Center ディレクトリ**（デフォルト）
   - Identity Center 自体でユーザー・グループを作成／管理する方式。既存のディレクトリを持たない小規模な環境向け。
2. **Active Directory**
   - AWS Managed Microsoft AD、または AD Connector 経由でオンプレミスの Active Directory と連携する方式。
3. **外部 ID プロバイダー**
   - Microsoft Entra ID や Okta など、SAML 2.0 に対応した外部 IdP と連携する方式。

すでに社内で Active Directory や IdP を運用している場合は、ユーザー管理を二重に行わずに済むよう、そちらと連携する方式を選ぶのが一般的です。

### 自動プロビジョニング（SCIM）

外部 IdP を ID ソースとして利用する場合、SCIM（System for Cross-domain Identity Management）を有効にすることで、IdP 側で行ったユーザー・グループの追加／削除／属性変更を IAM Identity Center 側へ自動的に同期できます。

SCIM を有効化しないと、IdP 側と Identity Center 側でユーザー情報を別々に管理することになり、退職者のアカウント削除漏れなど棚卸し漏れのリスクが高まるため、外部 IdP と連携する場合は SCIM の有効化が推奨されます。

## ユーザーとグループ

IAM ユーザーと IAM グループと同等の機能を持つものです。
違いといえば、IAM グループのように IAM ポリシーの割り当てを行わない点です。
IAM ポリシーに相当する「許可セット(Permission Set)」は、アクセス先の AWS アカウントとセットで指定することになります。

![idc-user](/images/iam-idc/idc-user.png)

![idc-group](/images/iam-idc/idc-group.png)

## 許可セット(Permission Set)

IAM ポリシーと同等の機能を持つものです。

IAM ポリシーのように、AWS によって事前定義された許可セットや、カスタマイズした許可セットを作成することができます。
![idc-permission-00](/images/iam-idc/idc-permission-00.png)

カスタム許可セットでは、インラインポリシーで指定することも可能です。

![idc-permission-01](/images/iam-idc/idc-permission-01.png)

### 属性ベースのアクセス制御（ABAC）

対象の AWS アカウントやチームの数だけ許可セットを作るとメンテナンスが大変になります。そこで役立つのが ABAC（Attribute-Based Access Control）です。

ユーザーやグループに設定した属性（部署名、コストセンターなど）をセッションタグとして一時認証情報に付与し、IAM ポリシー側で `aws:PrincipalTag` などの条件キーを使ってアクセス可否を判定する仕組みです。

例えば「部署ごとに、その部署専用の S3 バケットだけアクセスさせたい」場合、部署の数だけ許可セットを作らなくても、タグ条件を使った 1 つの許可セットで対応できます。ABAC を利用するには、あらかじめ IAM Identity Center 側でユーザー属性をセッションタグとして渡すための設定（属性マッピング）が必要です。

## AWS アカウントへの割り当て

作成したユーザー／グループと許可セットを、AWS アカウントに割り当てます。

![idc-allocation-00](/images/iam-idc/idc-allocation-00.png)

![idc-allocation-01](/images/iam-idc/idc-allocation-01.png)

## AWS アカウント以外への割り当て（アプリケーション）

IAM Identity Center は AWS アカウントへの SSO だけでなく、Salesforce や Slack、Box など事前統合済みの SaaS アプリケーション、および SAML 2.0 に対応した独自のカスタムアプリケーションへのシングルサインオンにも対応しています。

管理画面の「アプリケーション」から割り当てたいアプリを登録し、AWS アカウントへの割り当てと同様の操作でユーザー・グループを割り当てることができます。

社内で複数の SaaS を利用している場合、IAM Identity Center を「AWS アカウント用の認証基盤」だけでなく「全社的な SSO ポータル」として活用できる点は大きなメリットです。

## ログイン

アクセスポータル URL からログインすることができます。

![login](/images/iam-idc/idc-login.png)

## AWS CLI の設定

`.aws/config` を以下のように設定します。

```text
# Example of SSO configuration
[sso-session mysso]
sso_start_url = https://d-123456a123.awsapps.com/start/
sso_region = ap-northeast-1
sso_registration_scopes = sso:account:access

[profile example-dev]
sso_session = mysso
sso_account_id = 123456789012
sso_role_name = your-role-name
region = ap-northeast-1
output = json
```

AWS CLIでログインするには、次のコマンドを実行します。
このコマンドを実行すると以下の認証処理が行われます。

1. IAM Identity Center アクセスポータルで認証実施
2. `GetRoleCredentials` で許可セットに紐づいた一時認証情報を取得
3. 許可セットに設定されたセッション時間の間、利用可能

```sh
aws sso login --profile example-dev
```

デフォルトのブラウザで自動的に開きたくない場合は、以下のオプションをつけます。
画面に表示されたURLを普段利用しているブラウザに貼り付けてログインを実施します。

```sh
aws sso login --profile example-dev --no-browser
```

## 参考：委任管理の方法

[AWS セキュリティブログ>AWS IAM Identity Center での許可セット管理とアカウント割り当ての委任](https://aws.amazon.com/jp/blogs/security/delegating-permission-set-management-and-account-assignment-in-aws-iam-identity-center/)

Identity Center の管理を AWS Organizations のメンバーアカウントに委任できます。

その場合の方法について解説があります。記事では以下の３つの方法が紹介されており、委任管理のベストプラクティスについて記載があります。

- アカウントベースモデル
- 許可ベースのモデル
- タグベースモデル

## 📖 まとめ

![iam-idc](/images/all/iam-idc.png)
