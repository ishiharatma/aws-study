---
title: "【初心者向け】Amazon Cognito 入門！完全ガイド" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: false
---

# Amazon Cognito<!-- omit in toc -->

![icon](/images/icons/64/Arch_Amazon-Cognito_64.png)

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

- [1. Amazon Cognito とは](#1-amazon-cognito-とは)
  - [1.1. 公式ドキュメント](#11-公式ドキュメント)
  - [1.2. 学習リソース](#12-学習リソース)
  - [1.3. ワークショップ](#13-ワークショップ)
  - [1.4. 導入のメリット](#14-導入のメリット)
- [2. 基本機能](#2-基本機能)
  - [2.1 Cognito の主な機能](#21-cognito-の主な機能)
  - [2.2 ユーザープール](#22-ユーザープール)
    - [2.2.1. ユーザープール機能プラン](#221-ユーザープール機能プラン)
      - [既存ユーザープールと、Liteのコスト比較](#既存ユーザープールとliteのコスト比較)
      - [「高度なセキュリティ機能」を使用した場合の比較：MAU 500万まで](#高度なセキュリティ機能を使用した場合の比較mau-500万まで)
      - [「高度なセキュリティ機能」を使用した場合の比較：MAU 5,000万まで](#高度なセキュリティ機能を使用した場合の比較mau-5000万まで)
    - [2.2.2. サインアップとサインインのカスタマイズ](#222-サインアップとサインインのカスタマイズ)
    - [2.2.3. 認証フロー](#223-認証フロー)
    - [2.2.4. トリガー](#224-トリガー)
    - [2.2.5. ユーザープールのセキュリティ機能](#225-ユーザープールのセキュリティ機能)
    - [2.2.6. ホストされた UI](#226-ホストされた-ui)
    - [2.2.7. トークンの種類と管理](#227-トークンの種類と管理)
      - [ID トークン](#id-トークン)
      - [アクセストークン](#アクセストークン)
      - [更新トークン](#更新トークン)
      - [トークンの有効期限と更新](#トークンの有効期限と更新)
  - [2.3. ID プール](#23-id-プール)
    - [2.3.1. ID プールの仕組み](#231-id-プールの仕組み)
    - [2.3.2. 認証プロバイダー](#232-認証プロバイダー)
    - [2.3.3. IAM ロールの設定](#233-iam-ロールの設定)
  - [2.4. Cognito Sync から AppSync への移行](#24-cognito-sync-から-appsync-への移行)
  - [2.5. Cognito の料金体系](#25-cognito-の料金体系)
  - [2.6. Cognito のクォータ](#26-cognito-のクォータ)
- [3. 実装パターン](#3-実装パターン)
  - [①Webアプリケーションでの一般的な実装パターン](#webアプリケーションでの一般的な実装パターン)
  - [②静的ウェブサイトへの認証機能実装パターン](#静的ウェブサイトへの認証機能実装パターン)
  - [③サーバーレス認証パターン](#サーバーレス認証パターン)
- [3. Cognito と CDK](#3-cognito-と-cdk)
- [4. 運用のポイント](#4-運用のポイント)
  - [4.1. ロギングとモニタリング](#41-ロギングとモニタリング)
  - [4.2. セキュリティ](#42-セキュリティ)
- [📖 まとめ](#-まとめ)

## 1. Amazon Cognito とは

Amazon Cognito は、ウェブおよびモバイルアプリケーションに認証、認可、およびユーザー管理機能を追加するためのサービスです。ユーザーは、ユーザー名とパスワードを使用して直接サインインするか、Facebook、Amazon、Google、Apple などのサードパーティーを通じてサインインすることができます。

### 1.1. 公式ドキュメント

Amazon Cognitoを理解する公式ドキュメントは次のとおりです。

[Amazon Cognito サービス概要](https://aws.amazon.com/jp/cognito/)

[Amazon Cognito ドキュメント](https://docs.aws.amazon.com/ja_jp/cognito/)

[Amazon Cognito よくある質問](https://aws.amazon.com/jp/cognito/faqs/)

[Amazon Cognito の料金](https://aws.amazon.com/jp/cognito/pricing/)


### 1.2. 学習リソース

[「Amazon Cognito」をグラレコで解説|builders.flash](https://aws.amazon.com/jp/builders-flash/202103/awsgeek-cognito/)

【AWS Black Belt Online Seminar】[Amazon Cognito(YouTube)](https://www.youtube.com/watch?v=vWfTe5MHOIk)(59:18)

![blackbelt](/images/blackbelt/blackbelt-cognito-320.jpg)

### 1.3. ワークショップ

[Amazon Cognito Workshop](https://dcj71ciaiav4i.cloudfront.net/0A4DEB20-C89E-11ED-A834-5D52D9748576/chapter1.html)

[Cognito API ハンズオン](https://dcj71ciaiav4i.cloudfront.net/591796E0-D127-11EB-A6A5-FB83B2BAF6EE/)

[Simplify web app authentication: A guide to AD FS federation with Amazon Cognito user pools](https://aws.amazon.com/jp/blogs/security/simplify-web-app-authentication-a-guide-to-ad-fs-federation-with-amazon-cognito-user-pools/)

[SAML for Your Serverless JavaScript Application](https://aws.amazon.com/jp/blogs/compute/saml-for-your-serverless-javascript-application-part-i/)

[Implementing passwordless email authentication with Amazon Cognito](https://aws.amazon.com/jp/blogs/mobile/implementing-passwordless-email-authentication-with-amazon-cognito/)

[SaaS AuthN/Z Workshop](https://catalog.us-east-1.prod.workshops.aws/workshops/9180bbda-7747-4b8f-ac05-14e7f258fcea/ja-JP/10-introduction)

### 1.4. 導入のメリット

Cognito の主な利点は以下の通りです：

- アプリケーションにユーザー登録・認証機能を簡単に追加できる
- ソーシャルIDプロバイダーとの連携が容易
- AWSリソースへのアクセス制御が可能
- セキュリティ機能（多要素認証など）が組み込まれている
- 数百万人のユーザーまでスケール可能

## 2. 基本機能

### 2.1 Cognito の主な機能

Amazon Cognito は主に2つのコンポーネントで構成されています：

1. **ユーザープール**: ユーザーディレクトリを提供し、サインアップ/サインイン機能を実装するためのもの
2. **ID プール**: ユーザーに対して一時的なAWS認証情報を提供し、特定のAWSリソースへのアクセスを許可するためのもの

![cognito_overview](/images/cognito/cognito_overview.png)

この2つを組み合わせることで、認証されたユーザーにアプリケーションやAWSリソースへのアクセス権を付与する仕組みを構築できます。

### 2.2 ユーザープール

[ユーザープール](https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/cognito-user-pools.html)は、Amazon Cognitoのユーザーディレクトリです。ユーザープールを使用すると、ユーザーはAmazon Cognitoを通じて、またはサードパーティーIDプロバイダー（IdP）を通じてウェブやモバイルアプリにサインインできます。

![cognito_user_pool](/images/cognito/cognito_user_pool.png)

ユーザープールの主な特徴は以下の通りです：

- ユーザーの登録と認証
- カスタマイズ可能なサインインページの提供
- 多要素認証（MFA）のサポート
- ソーシャルIDプロバイダー（Facebook、Google、Appleなど）との連携
- SAML、OIDCによる企業のIDプロバイダーとの連携
- セキュリティ機能（パスワードポリシー、アカウントロックなど）
- カスタムワークフローのためのLambdaトリガー

#### 2.2.1. ユーザープール機能プラン

[2024年11月22日 Amazon Cognito 新しい機能ティア Essentials と Plus のお知らせ](https://aws.amazon.com/jp/about-aws/whats-new/2024/11/new-feature-tiers-essentials-plus-amazon-cognito/)

Cognitoユーザープールに[機能と料金の異なる３つのプラン](https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/cognito-sign-in-feature-plans.html)(Lite / Essentials / Plus)が追加されました。

- Lite：月間アクティブユーザー数が少ないサービス向け。
  - **アップデート前のユーザープールはLiteとなる**
  - Essentialsに比べると一部の新しい機能が使えない制約あり。
    - ブランディングデザイナーによるマネージドログインページのカスタマイズ
    - メールワンタイムコード付きの MFA
    - ワンタイムコードによるパスワードなしのサインイン
    - 生体認証とハードウェアキーによるパスキーサインイン
    - 最近使用したパスワードを再利用できないようにする
    - 実行時にアクセストークンのスコープとクレームをカスタマイズ
- Essentials：デフォルトのプラン。従来の「高度なセキュリティ機能」のうち、Plusで利用できる一部が利用不可となったプラン。
  - 従来の「高度なセキュリティ機能」の全機能が不要な場合は「Essentials」を選択することでコストの最適化が可能
- Plus：Essentialsの上位で、下記のようなユーザーを保護する高度なセキュリティ機能が使用できる。
  - 安全でないパスワードからの保護
  - 悪意のあるログイン試行からの保護
  - ユーザーアクティビティの記録と分析
  - ユーザーアクティビティログをエクスポートする

詳細は、公式のプラン比較を確認してください。

![cognito-plan](/images/cognito/cognito-plan.jpg)

次に、料金比較と特徴は次のとおりです。

- Plusは無料枠がないが、MAUあたりの単価は一律である
- Essentialsは無料枠（MAU10,000）があり、無料枠超過後のMAUあたりの単価は一律
- Liteは無料枠（MAU10,000）があり、無料枠超過から段階的なコスト設定。
  - アップデート前からのユーザープールは無料枠はMAU50,000となる

| 料金範囲 (MAU)          | Lite        | Essentials | Plus     |
| ----------------------- | ----------- | ---------- | -------- |
| 無料利用枠              | 10,000      | 10,000     | なし     |
| 10,001～100,000         | USD 0.0055  | USD 0.015  | USD 0.02 |
| 100,001～1,000,000      | USD 0.0046  | 〃         | 〃       |
| 1,000,001 ～ 10,000,000 | USD 0.00325 | 〃         | 〃       |
| 10,000,000 超           | USD 0.0025  | 〃         | 〃       |

Liteプランでは従来の「高度なセキュリティ機能」が追加コストで利用できます。

| 料金範囲 (MAU) | MAU あたりの料金 |
| -------------- | ---------------- |
| 最初の 50,000  | USD 0.050        |
| 次の 50,000    | USD 0.035        |
| 次の 90 万     | USD 0.020        |
| 次の 900 万    | USD 0.015        |
| 10,00 万超     | USD 0.010        |

##### 既存ユーザープールと、Liteのコスト比較

無料MAUが50,000から10,000に引き下げられていますので、コスト増となります。
「高度なセキュリティ機能」を使用しておらず、MAU 10,000以下というのであれば、コスト増の影響を受けません。

![before-lite-comparison](/images/cognito/before-lite-comparison.jpg)

##### 「高度なセキュリティ機能」を使用した場合の比較：MAU 500万まで

MAU 500万までを比較してみます。最初は `Essensials < Plus < Lite = 既存` となっていますが、MAU 350万を超えたあたりで、Plusのほうが既存+ASFよりコストが高くなり始めます。

![allplan-comparison-mau5m](/images/cognito/allplan-comparison-mau5m.jpg)

##### 「高度なセキュリティ機能」を使用した場合の比較：MAU 5,000万まで

次に、MAU 5,000万までを比較してみます。1000万を超えたところでは、`Plus > Lite=既存 > Essentials` となっています。
さらにMAU 2,500万を超えたあたりで、EssentialsがLiteを追い抜き、`Plus > Essentials > Lite=既存` となるようです。
![allplan-comparison](/images/cognito/allplan-comparison.jpg)

この結果を見ると、「高度なセキュリティ機能」がすべて必要なければ、MAU 2,500万まではEssentialsを選択することでコストが抑えられます。
MAU 2,500万以上の場合は、コストをしっかり算出し、適切な機能プランを選択するとよいでしょう。

#### 2.2.2. サインアップとサインインのカスタマイズ

Amazon Cognito では、サインアップとサインインのプロセスを以下のようにカスタマイズできます：

- **必須属性の設定**: ユーザー登録時に収集する必須情報の指定
- **属性検証**: メールアドレスや電話番号の検証要件
- **カスタム属性**: アプリケーション固有のユーザー情報の保存
- **パスワードポリシー**: 複雑さやローテーション要件の設定
- **Lambda トリガー**: サインアップ前後にカスタムロジックを実行
- **ホスト型 UI のカスタマイズ**: ロゴ、CSS、テキストのカスタマイズ

#### 2.2.3. 認証フロー

Amazon Cognito ユーザープールは、複数の[認証フロー](https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/amazon-cognito-user-pools-authentication-flow-methods.html)をサポートしています：

1. **選択ベースの認証(ALLOW_USER_AUTH)**:サインイン時に認証タイプ（ワンタイムパスワード、生体認証デバイスとセキュリティキー、MFA によるパスワードベースのサインインなど）を選択する
1. **ユーザーパスワード認証(ALLOW_USER_PASSWORD_AUTH)**：最も一般的なフローで、ユーザー名とパスワードによる認証
    認証時にはパスワードを平文で送信する。
    ```json
      {
    "AuthFlow": "USER_PASSWORD_AUTH",
    "AuthParameters": { 
        "USERNAME" : "testuser",
        "PASSWORD" : "Example1234!"
      },
      "ClientId": "1example23456789"
      }
    ```
2. **安全なリモートパスワード認証(ALLOW_USER_SRP_AUTH)**:サーバー側の認証操作でユーザー名とパスワードによる認証
    パスワードをハッシュ化して送信する。ALLOW_USER_PASSWORD_AUTHよりもセキュア。
    ```json
    {
      "AuthFlow": "USER_PASSWORD_AUTH",
      "AuthParameters": { 
          "USERNAME" : "testuser",
          "SRP_A" : "g^a"
      },
      "ClientId": "1example23456789"
    }
    ```
3. **カスタム認証フロー(ALLOW_CUSTOM_AUTH)**：Lambda トリガーを使用したカスタム認証チャレンジのフロー
4. **管理者認証フロー(ALLOW_ADMIN_USER_PASSWORD_AUTH)**：AWS Admin API を使用したバックエンドサービスからの認証
5. **更新トークン認証フロー(ALLOW_REFRESH_TOKEN_AUTH)**:既存の認証済みセッションから更新トークンを使用した認証

#### 2.2.4. トリガー

ユーザープールは [Lambda 関数をトリガー](https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/cognito-user-pools-working-with-lambda-triggers.html)として関連付け、認証フローや登録プロセスをカスタマイズできます。主なトリガーには以下のようなものがあります：

- **サインアップ前 (Pre Sign-up)**: 新規ユーザー登録前の検証やデータ処理
- **確認後 (Post Confirmation)**: ユーザー認証前の処理
- **認証前 (Pre Authentication)**: ユーザー認証前の処理
- **認証後 (Post Authentication)**: 認証成功後の処理（ログ記録など）
- **トークン生成前 (Pre Token Generation)**: トークン生成前にクレームをカスタマイズ
- **カスタム認証チャレンジ**: カスタム認証フローの実装
- **ユーザー移行**: 既存のユーザーストアからCognitoへのシームレスな移行などに使用。トリガーされたLambdaが正常のレスポンスを返した場合に、ユーザープールにユーザーを追加する。

参考：開発者ガイド＞[Lambda トリガーの使用](https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/cognito-user-pools-working-with-lambda-triggers.html)

#### 2.2.5. ユーザープールのセキュリティ機能

ユーザープールには、以下のようなセキュリティ機能が含まれています：

- **パスワードポリシー**: 最小長、必要な文字種類などの設定
- **アカウントタイムアウト**: 連続した認証失敗後のアカウントロック
- **高度なセキュリティ機能**: 
  - MFA
    - SMS、時間ベースのワンタイムパスワード（TOTP）アプリによる第二認証要素の追加
  - 侵害された認証情報の検出
  - アダプティブ認証

#### 2.2.6. ホストされた UI

Amazon Cognito は、カスタマイズ可能なホスト型のウェブUIを提供しています。これにより、アプリケーションは独自のサインインページを構築することなく、すぐに認証機能を利用できます。

ホストされた UI の主な特徴：

- **ユーザー登録／サインイン画面**: 基本的な認証フローのUI
- **多言語サポート**: 複数言語での表示をサポート
- **カスタマイズ**: ロゴやCSS による見た目のカスタマイズ
- **OAuthフロー**: 認可コードフロー、暗黙的フロー、クライアント認証情報などをサポート
- **ソーシャルログイン**: Facebook、Google、Amazonなどとの連携

Liteプランでは、従来のクラシックUIのみが利用できます。

![hosted-ui-classic-branding](/images/cognito/hosted-ui-classic-branding.jpg)

Essentials以上のプランでは、ブランドデザイナーによるマネージドログインのカスタマイズが可能です。

![managed-login-brandingdesigner](/images/cognito/managed-login-brandingdesigner.jpg)

#### 2.2.7. トークンの種類と管理

Amazon Cognito は認証後に以下の種類のトークンを発行します：

##### ID トークン

- JWT (ジョット、[JSON Web Token |Wikipedia](https://ja.wikipedia.org/wiki/JSON_Web_Token)) 形式
  - JWTは、３つの情報をピリオドでつなげた形式「(ヘッダー).(クレーム).(署名)」
    - サンプルは次の通り（引用：[JSON Web Tokens - jwt.io](https://jwt.io/)）
    - `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
- ユーザーの識別情報（name、email、および phone_number など）は クレーム (claims) に含まれる
- クレームは、OpenID Connect (OIDC、参考＞[OpenID Connect (OIDC) とは? | Microsoft Security](https://www.microsoft.com/ja-jp/security/business/security-101/what-is-openid-connect-oidc#:~:text=OpenID%20Connect%20(OIDC)%20%E3%81%AF%E3%80%81,%E8%AA%8D%E8%A8%BC%E3%82%92%E6%8F%90%E4%BE%9B%E3%81%97%E3%81%BE%E3%81%99%E3%80%82)) 仕様に準拠
  - sub：認証されたユーザーの固有識別子 (UUID)、特定のユーザーを識別可能なもの
  - identities：ユーザーの識別情報
  - iss：トークンを発行した ID プロバイダー
  - aud：ユーザーを認証したユーザープールアプリクライアント
  - auth_time：ユーザーが認証を完了した認証時刻 (Unix の時間形式、例：1676312777)
  - exp：ユーザーのトークンの有効期限が切れる有効期限 (Unix の時間形式、例：1676312777)
  - iat：Amazon Cognito がユーザーのトークンを発行した発行時刻 (Unix の時間形式、例：1676312777)

##### アクセストークン

- JWT 形式
- ユーザーが実行できるアクションを定義
- スコープ属性によりアクセス権限を制御
- OAuth 2.0 仕様に準拠

##### 更新トークン

- 有効期限が切れたIDトークンとアクセストークンを更新するために使用
- 長期間有効（デフォルトで30日）
- セキュアに保存する必要あり
- GlobalSignOut API を使用すると、[すべてのデバイスからサインアウト] といった機能をアプリケーションで提供できる
  - API実行時には、有効なアクセストークンを指定する
- AdminUserGlobalSignOut API を使用すると、ユーザープール内の任意のユーザーをサインアウトさせられる
  - API実行時には、ユーザー名とユーザープールIDを指定する

##### トークンの有効期限と更新

トークンの有効期限はユーザープールの設定で定義できます：

- IDトークン: 5分～1日（デフォルト1時間）
- アクセストークン: 5分～1日（デフォルト1時間）
- 更新トークン: 1時間～10年（デフォルト30日）

トークンの更新フローは以下の通りです：

1. 更新トークンをAPIに送信
2. 新しいIDトークンとアクセストークンを受け取る
3. 必要に応じて更新トークンも更新される

### 2.3. ID プール

[ID プール](https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/cognito-identity.html)を使用すると、ユーザーに AWS サービスへのアクセスを許可するための一時的な AWS 認証情報を取得できます。ID プールはユーザープールと連携して動作し、認証されたユーザーに特定の AWS リソースへのアクセス権を付与します。

#### 2.3.1. ID プールの仕組み

[ID プールの認証フロー](https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/authentication-flow.html)は以下の通りです：

1. ユーザーがIDP（ユーザープールまたは外部プロバイダー）で認証
2. 認証後、IDPからトークンを受け取る
3. このトークンをID プールに提示
4. IDプールが一時クレデンシャルを要求
5. 生成された一時クレデンシャルをIDプールが受領
6. ID プールが一時的なAWS認証情報を提供
7. これらの認証情報を使用してAWSリソースにアクセス

![cognito_id_pool](/images/cognito/cognito_id_pool.png)

#### 2.3.2. 認証プロバイダー

ID プールは以下のような様々な[認証プロバイダー（IDP）をサポート](https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/external-identity-providers.html)しています：

- **Amazon Cognito ユーザープール**
- **パブリックプロバイダー**: Google、Facebook、Apple、Amazon
- **SAML IDプロバイダー**: 企業の認証システム
- **OpenID Connect プロバイダー**: 標準準拠の任意のOIDCプロバイダー
- **デベロッパープロバイダー**: カスタム認証システム
- **非認証アクセス**: 匿名ユーザーへの制限付きアクセスの提供

#### 2.3.3. IAM ロールの設定

ID プールは [IAM ロールと連携](https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/iam-roles.html)して動作します。主に以下の2種類のロールを設定できます：

- **認証されたユーザーのロール**: 認証済みユーザーに付与されるアクセス権
- **非認証ユーザーのロール**: 匿名ユーザーに付与される制限付きアクセス権

さらに、ユーザー属性に基づいてロールを選択するための「ロールベースのアクセス制御」を実装することができます。これにより、ユーザーの所属グループなどに基づいて異なるレベルのアクセス権を付与できます。

詳細は、Cognito開発者ガイドの[IAMロール](https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/iam-roles.html)を参照してください。

### 2.4. Cognito Sync から AppSync への移行

[Cognito Sync](https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/cognito-sync.html)とは、アプリケーションに関連するユーザーデータをデバイス間で同期できる機能で、一人のユーザーが複数デバイスを保持している場合にデバイス間でデータを同期します。最大 1 MB のキーと値のペアを保存できるデータセットに保存され、ユーザー ID ごとに最大 20 個のデータセットを持つことができます。これらのデータをローカルに保持し、デバイスがオフラインの場合でもデータを利用できるようにします。

しかし、Cognito Sync は古いサービスで、現在は高機能なAWS AppSync への移行が推奨されています。

- **Cognito Sync**: デバイス間でのユーザーデータの同期のための以前のサービス
- **AWS AppSync**: GraphQL を使用した最新のデータ同期サービス

AppSync の主な利点：

- リアルタイム更新とオフライン同期
- 細かいアクセス制御
- GraphQL API による柔軟なデータ操作
- CloudWatch との統合による詳細なモニタリング

### 2.5. Cognito の料金体系

Amazon Cognito の料金は以下の要素に基づきます：

- **機能プラン**: Lite / Essensials / Plus
- **アクティブユーザー**: 月間のアクティブユーザー数（MAU）
- **ユーザープール高度なセキュリティ機能**: 特定のセキュリティ機能の使用料
- **ID プール**: 認証されたIDの数と認証リクエスト数

[Amazon Cognito 料金ページ](https://aws.amazon.com/jp/cognito/pricing/)で最新の料金情報を確認することができます。

基本的な料金構造：
- Lite / Essensials は、月間アクティブユーザー (MAU) 10,000人までは無料（旧ユーザープールは50,000まで）
- それ以降は段階的な料金体系（ユーザー数が増えるほど単価は下がる）
- 無料利用枠は常に適用（毎月最初の10,000 MAUは無料）

### 2.6. Cognito のクォータ

Amazon Cognito には以下のようなサービスクォータがあります：

**ユーザープール**:
- ユーザープールあたりのユーザー数: 40,000,000（デフォルト）、引き上げ可能
- AWSアカウントのリージョンごとのユーザープール数: 1,000（デフォルト）、引き上げ可能
- APIリクエストのレート制限: 各API操作によって異なる

**ID プール**:
- AWSアカウントあたりのIDプール数: 1,000（デフォルト）
- トークンサイズ制限: 4KB
- ロールベースのアクセス制御 (RBAC) ルール: IDプールあたり25

クォータの詳細と引き上げ方法については、[Amazon Cognito サービスクォータ](https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/limits.html)を参照してください。


## 3. 実装パターン

### ①Webアプリケーションでの一般的な実装パターン

Amplify ライブラリを使用したReact/Vue.jsなどでの実装したフロントエンドでCognitoによる認証を行い、認証情報を使って、API Gatewayを呼び出す実装例です。
API Gateway のオーソライザーにCognitoを設定します。

![web_pattern](/images/cognito/web-pattern-diagram.png)

### ②静的ウェブサイトへの認証機能実装パターン

CloudFront 経由でS3の静的ウェブサイトを配信している場合に、認証機能を付与する実装例です。
Lambda@EdgeによってCognito認証を行います。

こちらの方法のサンプルはGitHubの[awslabs/cognito-at-edge](https://github.com/awslabs/cognito-at-edge)にあります。

![cloudfront-s3-pattern](/images/cognito/cloudfront-s3-pattern-diagram.png)

### ③サーバーレス認証パターン

①と②を組み合わせたパターンで、認証部分をフロントエンドで実装せずに、Lambda@EdgeでCognito認証を行います。ログイン画面は「CognitoのホストされたUIを使用」を使用することができます。

![serverless-pattern](/images/cognito/serverless-pattern-diagram.png)

## 3. Cognito と CDK

[GitHub＞aws-samples/cdk-cognito-idp](https://github.com/aws-samples/cdk-cognito-idp)

AWS CDK を使用してCognitoリソースをデプロイする例：

このCDKスタックでは、以下のCognitoリソースを作成しています：

1. ユーザープール - ユーザー登録と認証のためのディレクトリ
2. ユーザープールクライアント - アプリケーションがユーザープールにアクセスするための設定
3. IDプール - 認証されたユーザーにAWSリソースへのアクセスを提供

<details>
  <summary>CDKのコード(クリックしてください)</summary>

```typescript
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  aws_cognito as cognito 
} from 'aws-cdk-lib';

export class CognitoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ユーザープールの作成
    const userPool = new cognito.UserPool(this, 'MyUserPool', {
      userPoolName: 'my-user-pool', // ユーザープール名
      selfSignUpEnabled: true, // セルフサービスのサインアップ設定
      signInAliases: { // サインインエイリアス。ユーザープルに登録する属性
        email: true,
        username: false
      },
      autoVerify: {
        email: true
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true
        }
      },
      customAttributes: { // カスタム属性
        'family_name_kana': new cognito.StringAttribute({ minLen: 1, maxLen: 256, mutable: true }),
        'given_name_kana': new cognito.StringAttribute({ minLen: 1, maxLen: 256, mutable: true }),
      },
      passwordPolicy: { // パスワードポリシー
        minLength: 16,  // パスワード文字列長
        requireLowercase: true, // 小文字
        requireUppercase: true, // 大文字
        requireDigits: true, // 数字
        requireSymbols: true, // 記号
        temporaryPasswordValidityDays: Duration.days(3), // 一時パスワードが有効な日数
      },
      lambdaTriggers: { // トリガー
        preSignUp: '', // サインアップ前の Lambda トリガー
        postConfirmation: '', // 確認後の Lambda トリガー
        preAuthentication: '', // 認証前の Lambda トリガー
        postAuthentication: '', // 認証後の Lambda トリガー
        // チャレンジの Lambda トリガー
        defineAuthChallenge: '',
        createAuthChallenge: '',
        verifyAuthChallengeResponse: '',

        preTokenGeneration: '', // トークン生成前の Lambda トリガー
        userMigration: '', // ユーザー移行のトリガー
        customMessage: '', // カスタムメッセージのトリガー

        // カスタム送信者のトリガー
        customEmailSender: '',
        customSmsSender: '',
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY, // ユーザーアカウントの復旧設定
      email: cognito.UserPoolEmail.withCognito('support@example.com'),
      /*
      email: cognito.UserPoolEmail.withSES({ // SES で送信する場合
        fromEmail: 'noreply@example.com',
        fromName: 'Awesome App',
        replyTo: 'support@example.com',
        sesVerifiedDomain: 'example.com',
      }),
      */
    });

    // ユーザープールクライアントの作成
    const userPoolClient = new cognito.UserPoolClient(this, 'MyUserPoolClient', {
      userPool,
      authFlows: {
        userPassword: true,
        userSrp: true
      },
      oAuth: {
        flows: {
          authorizationCodeGrant: true
        },
        scopes: [
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.PROFILE
        ],
        callbackUrls: ['https://example.com/callback'],
        logoutUrls: ['https://example.com/'],
      },
    });

    // IDプールの作成
    const identityPool = new cognito.CfnIdentityPool(this, 'MyIdentityPool', {
      identityPoolName: 'my-identity-pool',
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [{
        clientId: userPoolClient.userPoolClientId,
        providerName: userPool.userPoolProviderName
      }]
    });

    // 出力
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId
    });

    new cdk.CfnOutput(this, 'IdentityPoolId', {
      value: identityPool.ref
    });
  }
}
```
</details>

## 4. 運用のポイント

### 4.1. ロギングとモニタリング

- ロギング
  - AWS CloudTrail
  - Amazon CloudWatch Logs 
- モニタリング
  - Amazon CloudWatch メトリクス
  - Amazon CloudWatch Logs Insights

### 4.2. セキュリティ

- データ保護
  - 
- アクセス管理
  - AWS IAMによってアクセス制御を行います。
  - 詳細は「[Amazon Cognito 向けの Identity and access management](https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/security-iam.html)」を参照してください

## 📖 まとめ

Amazon Cognito は、アプリケーション向けの認証・認可サービスとして以下の価値を提供します：

- **統合認証管理**: ユーザー登録からアクセス管理までワンストップで提供
- **柔軟な認証オプション**: ソーシャルID、SAML、カスタム認証など多様な選択肢
- **セキュリティ**: 多要素認証、高度なセキュリティ機能によるリスク軽減
- **スケーラビリティ**: 数百万ユーザーまでシームレスに拡張可能
- **開発効率化**: 認証のためのコードを最小限に抑え、ビジネスロジックに集中可能

![cognito_summary](/images/all/cognito.png)

アプリケーションの認証機能を実装する際は、Cognitoを検討してみてください。特に複数の認証方法をサポートしたり、AWSリソースへの安全なアクセスを提供したりする場合に威力を発揮します。
