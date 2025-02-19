# AWS IAM Identity Center<!-- omit in toc -->

![icon](/images/icons/64/Arch_AWS-IAM-Identity-Center_64.png)

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

- [AWS IAM Identity Center とは](#aws-iam-identity-center-とは)
- [主要機能](#主要機能)
- [AWS SSO と AWS Identity Center で変わっていないこと](#aws-sso-と-aws-identity-center-で変わっていないこと)
- [IAM Identity Center の利用手順](#iam-identity-center-の利用手順)
- [IAM Identity Center の有効化](#iam-identity-center-の有効化)
  - [アカウントインスタンス](#アカウントインスタンス)
- [ユーザーとグループ](#ユーザーとグループ)
- [アクセス権限セット](#アクセス権限セット)
- [AWS アカウントへの割り当て](#aws-アカウントへの割り当て)
- [ログイン](#ログイン)
- [参考：委任管理の方法](#参考委任管理の方法)
- [📖 まとめ](#-まとめ)

## AWS IAM Identity Center とは

<!-- Duration: 1:49:12 -->

クラウド環境におけるアイデンティティとアクセス管理は、セキュリティと効率性の両面で重要な課題です。
この課題に対応するために AWS Identity Center を提供しています。
AWS Identity Center は、AWS アカウント、クラウドアプリケーション、およびオンプレミスアプリケーションへのシングルサインオン（SSO）アクセスを一元管理するサービスです。

以前は AWS Single Sign-On (AWS SSO)でしたが、機能拡張に伴い に名称が変更されました。（[Jul 26, 2022](https://aws.amazon.com/jp/about-aws/whats-new/2022/07/aws-single-sign-on-aws-sso-now-aws-iam-identity-center/)）

【AWS Black Belt Online Seminar】[AWS アカウント シングルサインオンの設計と運用(YouTube)](https://www.youtube.com/watch?v=ZzD9-5XZgRE)(53:24)

![blackbelt-iam-sso](/images/blackbelt/blackbelt-iam-sso-320.jpg)

[AWS IAM Identity Center サービス概要](https://aws.amazon.com/jp/iam/identity-center/)

[AWS IAM Identity Center ドキュメント](https://docs.aws.amazon.com/ja_jp/singlesignon/?id=docs_gateway)

[AWS IAM Identity Center よくある質問](https://aws.amazon.com/jp/iam/identity-center/faqs/)

IAM の料金 はありません。

[入門チュートリアル](https://docs.aws.amazon.com/ja_jp/singlesignon/latest/userguide/tutorials.html)

## 主要機能

1. 中央集権的なアクセス管理
   - マルチアカウント権限管理
   - きめ細かなアクセス制御を実現する権限セットの定義と割り当て
2. ID プロバイダー（IdP）の連携
   - 複数の IdP サポート
     - AWS Managed Microsoft AD、オンプレミスの Active Directory、外部の IdP との連携
     - SAML 2.0 準拠の IdP との互換性
3. セキュリティ強化
   - 複数の MFA 方式をサポート（ハードウェアトークン、ソフトウェアトークン、SMS）
   - セッションの有効期限設定、強制ログアウト機能
4. 監査とコンプライアンス
   - AWS CloudTrail との統合によるユーザーアクティビティの追跡
   - アクセス権限レポート、使用状況レポートの生成

## AWS SSO と AWS Identity Center で変わっていないこと

サービス名が変更されただけで、技術的な機能や API（sso, sso-directory, and identitystore）は下位互換維持のため変更されていません。

## IAM Identity Center の利用手順

1. IAM Identity Center の有効化
2. 多要素認証の設定
3. ユーザーとグループの作成
4. 許可セットの作成
5. AWS アカウントとの紐づけ
6. MFA デバイスの登録

## IAM Identity Center の有効化

![idc-enable.png](/images/iam-idc/idc-enable.png)

有効化できるリージョンは１つのみです。
選択したリージョンに IAM Identity Center で設定したすべてのデータが保存されるインスタンスが配置されます。

- アクセス権限セット
- ユーザーとグループ
- AWS アカウントへのユーザー/グループ割り当て情報

別にリージョンにしたい場合は、一度削除してから切り替える必要があります。切り替えると、 AWS アクセスポータル URL が変更され、これまで設定した情報を再設定する必要がありますので慎重に削除します。

![idc-delete](/images/iam-idc/idc-delete-01.png)

リージョンを選択するには、[AWS リージョンを選択する際の考慮事項](https://docs.aws.amazon.com/ja_jp/singlesignon/latest/userguide/get-started-prereqs-considerations.html#prereq-choose-region)を参考にして検討してください。

### アカウントインスタンス

IAM Identity Center は AWS Organization での利用を想定しているため、単一 AWS アカウント（スタンドアロンアカウント）でも AWS Organizations を利用する必要がありましたが、2023 年 11 月 17 日に AWS Organizations なしでも利用可能になりました。

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

## ユーザーとグループ

IAM ユーザーと IAM グループと同等の機能を持つものです。
違いといえば、IAM グループのように IAM ポリシーの割り当てを行わない点です。
IAM ポリシーに相当する「アクセス権限セット」は、アクセス先の AWS アカウントとセットで指定することになります。

![idc-user](/images/iam-idc/idc-user.png)

![idc-group](/images/iam-idc/idc-group.png)

## アクセス権限セット

IAM ポリシーと同等の機能を持つものです。

IAM ポリシーのように、AWS によって事前定義された許可セットや、カスタマイズした許可セットを作成することができます。
![idc-permission-00](/images/iam-idc/idc-permission-00.png)

カスタム許可セットでは、インラインポリシーで指定することも可能です。

![idc-permission-01](/images/iam-idc/idc-permission-01.png)

## AWS アカウントへの割り当て

作成したユーザー／グループとアクセス権限セットを、AWS アカウントに割り当てます。

![idc-allocation-00](/images/iam-idc/idc-allocation-00.png)

![idc-allocation-01](/images/iam-idc/idc-allocation-01.png)

## ログイン

アクセスポータル URL からログインすることができます。

![login](/images/iam-idc/idc-login.png)

## 参考：委任管理の方法

[AWS セキュリティブログ>AWS IAM Identity Center での権限セット管理とアカウント割り当ての委任](https://aws.amazon.com/jp/blogs/security/delegating-permission-set-management-and-account-assignment-in-aws-iam-identity-center/)

Identity Center の管理を AWS Organizations のメンバーアカウントに委任できます。

その場合の方法について解説があります。記事では以下の３つの方法が紹介されており、委任管理のベストプラクティスについて記載があります。

- アカウントベースモデル
- 許可ベースのモデル
- タグベースモデル

## 📖 まとめ

![iam-idc](/images/all/iam-idc.png)
