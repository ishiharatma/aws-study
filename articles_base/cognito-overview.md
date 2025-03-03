# Amazon Cognito<!-- omit in toc -->

![icon](/images/icons/64/Arch_Amazon-Cognito_64.png)

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

- [Amazon Cognito とは](#amazon-cognito-とは)
- [Cognito の主な機能](#cognito-の主な機能)
- [ユーザープール](#ユーザープール)
  - [認証フロー](#認証フロー)
  - [トリガー](#トリガー)
  - [高度な認証機能](#高度な認証機能)
  - [ユーザープールのセキュリティ機能](#ユーザープールのセキュリティ機能)
- [ID プール (フェデレーティッド ID)](#id-プール-フェデレーティッド-id)
  - [認証プロバイダー](#認証プロバイダー)
  - [ID プールの仕組み](#id-プールの仕組み)
  - [IAM ロールの設定](#iam-ロールの設定)
- [ホストされた UI](#ホストされた-ui)
- [トークンの種類と管理](#トークンの種類と管理)
  - [ID トークン](#id-トークン)
  - [アクセストークン](#アクセストークン)
  - [更新トークン](#更新トークン)
  - [トークンの有効期限と更新](#トークンの有効期限と更新)
- [サインアップとサインインのカスタマイズ](#サインアップとサインインのカスタマイズ)
- [Cognito Sync から AppSync への移行](#cognito-sync-から-appsync-への移行)
- [Cognito の料金](#cognito-の料金)
- [Cognito のクォータ](#cognito-のクォータ)
- [実装パターン](#実装パターン)
  - [Webアプリケーション](#webアプリケーション)
  - [モバイルアプリケーション](#モバイルアプリケーション)
  - [サーバーレスアプリケーション](#サーバーレスアプリケーション)
- [Cognito と CDK](#cognito-と-cdk)
- [📖 まとめ](#-まとめ)

## Amazon Cognito とは

Amazon Cognito は、ウェブおよびモバイルアプリケーションに認証、認可、およびユーザー管理機能を追加するためのサービスです。ユーザーは、ユーザー名とパスワードを使用して直接サインインするか、Facebook、Amazon、Google、Apple などのサードパーティーを通じてサインインすることができます。

Cognito の主な利点は以下の通りです：

- アプリケーションにユーザー登録・認証機能を簡単に追加できる
- ソーシャルIDプロバイダーとの連携が容易
- AWSリソースへのアクセス制御が可能
- セキュリティ機能（多要素認証など）が組み込まれている
- 数百万人のユーザーまでスケール可能

【AWS Black Belt Online Seminar】[Amazon Cognito(YouTube)](https://youtu.be/KQE4vVPymvI)(55:23)

[Amazon Cognito サービス概要](https://aws.amazon.com/jp/cognito/)

[Amazon Cognito ドキュメント](https://docs.aws.amazon.com/ja_jp/cognito/)

[Amazon Cognito よくある質問](https://aws.amazon.com/jp/cognito/faqs/)

## Cognito の主な機能

Amazon Cognito は主に2つのコンポーネントで構成されています：

1. **ユーザープール**: ユーザーディレクトリを提供し、サインアップ/サインイン機能を実装するためのもの
2. **ID プール（フェデレーティッド ID）**: ユーザーに対して一時的なAWS認証情報を提供し、特定のAWSリソースへのアクセスを許可するためのもの

![cognito_overview](/images/cognito/cognito_overview.png)

この2つを組み合わせることで、認証されたユーザーにアプリケーションやAWSリソースへのアクセス権を付与する仕組みを構築できます。

## ユーザープール

ユーザープールは、Amazon Cognitoのユーザーディレクトリです。ユーザープールを使用すると、ユーザーはAmazon Cognitoを通じて、またはサードパーティーIDプロバイダー（IdP）を通じてウェブやモバイルアプリにサインインできます。

![cognito_user_pool](/images/cognito/cognito_user_pool.png)

ユーザープールの主な特徴は以下の通りです：

- ユーザーの登録と認証
- カスタマイズ可能なサインインページの提供
- 多要素認証（MFA）のサポート
- ソーシャルIDプロバイダー（Facebook、Google、Appleなど）との連携
- SAML、OIDCによる企業のIDプロバイダーとの連携
- セキュリティ機能（パスワードポリシー、アカウントロックなど）
- カスタムワークフローのためのLambdaトリガー

### 認証フロー

Amazon Cognito ユーザープールは、複数の認証フローをサポートしています：

1. **ユーザーパスワード認証フロー**：最も一般的なフローで、ユーザー名とパスワードによる認証
2. **カスタム認証フロー**：Lambda トリガーを使用したカスタム認証チャレンジのフロー
3. **管理者認証フロー**：AWS Admin API を使用したバックエンドサービスからの認証
4. **フェデレーション認証フロー**：外部 ID プロバイダーを使用した認証

### トリガー

ユーザープールは Lambda 関数をトリガーとして関連付け、認証フローや登録プロセスをカスタマイズできます。主なトリガーには以下のようなものがあります：

- **サインアップ前 (Pre Sign-up)**: 新規ユーザー登録前の検証やデータ処理
- **確認後 (Post Confirmation)**: ユーザー認証前の処理
- **認証前 (Pre Authentication)**: ユーザー認証前の処理
- **認証後 (Post Authentication)**: 認証成功後の処理（ログ記録など）
- **トークン生成前 (Pre Token Generation)**: トークン生成前にクレームをカスタマイズ
- **カスタム認証チャレンジ**: カスタム認証フローの実装
- **ユーザー移行**: 既存のユーザーストアからCognitoへのシームレスな移行

![lambda_triggers](/images/cognito/lambda_triggers.png)

参考：開発者ガイド＞[Lambda トリガーの使用](https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/cognito-user-pools-working-with-lambda-triggers.html)

### 高度な認証機能

ユーザープールでは、以下のような高度な認証機能をサポートしています：

- **多要素認証（MFA）**: SMS、時間ベースのワンタイムパスワード（TOTP）アプリによる第二認証要素の追加
- **適応型認証**: リスクベースの認証で、デバイス、場所、ユーザー行動に基づき追加の認証を要求
- **デバイス認証**: 記憶されたデバイスからのサインインをトラッキング
- **カスタム認証チャレンジ**: 独自の認証フローを構築するためのLambdaトリガー

### ユーザープールのセキュリティ機能

ユーザープールには、以下のようなセキュリティ機能が含まれています：

- **パスワードポリシー**: 最小長、必要な文字種類などの設定
- **アカウントタイムアウト**: 連続した認証失敗後のアカウントロック
- **高度なセキュリティ機能**: 
  - 侵害された認証情報の検出
  - 異常なサインインの検出
  - 適応型認証

## ID プール (フェデレーティッド ID)

ID プール（フェデレーティッド ID）を使用すると、ユーザーに AWS サービスへのアクセスを許可するための一時的な AWS 認証情報を取得できます。ID プールはユーザープールと連携して動作し、認証されたユーザーに特定の AWS リソースへのアクセス権を付与します。

![cognito_id_pool](/images/cognito/cognito_id_pool.png)

### 認証プロバイダー

ID プールは以下のような様々な認証プロバイダー（IDP）をサポートしています：

- **Amazon Cognito ユーザープール**
- **パブリックプロバイダー**: Google、Facebook、Apple、Amazon
- **SAML IDプロバイダー**: 企業の認証システム
- **OpenID Connect プロバイダー**: 標準準拠の任意のOIDCプロバイダー
- **デベロッパープロバイダー**: カスタム認証システム
- **非認証アクセス**: 匿名ユーザーへの制限付きアクセスの提供

### ID プールの仕組み

ID プールの動作フローは以下の通りです：

1. ユーザーがIDP（ユーザープールまたは外部プロバイダー）で認証
2. 認証後、IDPからトークンを受け取る
3. このトークンをID プールに提示
4. ID プールが一時的なAWS認証情報を提供
5. これらの認証情報を使用してAWSリソースにアクセス

![idpool_flow](/images/cognito/idpool_flow.png)

### IAM ロールの設定

ID プールは IAM ロールと連携して動作します。主に以下の2種類のロールを設定できます：

- **認証されたユーザーのロール**: 認証済みユーザーに付与されるアクセス権
- **非認証ユーザーのロール**: 匿名ユーザーに付与される制限付きアクセス権

さらに、ユーザー属性に基づいてロールを選択するための「ロールベースのアクセス制御」を実装することができます。これにより、ユーザーの所属グループなどに基づいて異なるレベルのアクセス権を付与できます。

## ホストされた UI

Amazon Cognito は、カスタマイズ可能なホスト型のウェブUIを提供しています。これにより、アプリケーションは独自のサインインページを構築することなく、すぐに認証機能を利用できます。

ホストされた UI の主な特徴：

- **ユーザー登録／サインイン画面**: 基本的な認証フローのUI
- **多言語サポート**: 複数言語での表示をサポート
- **カスタマイズ**: ロゴやCSS による見た目のカスタマイズ
- **OAuthフロー**: 認可コードフロー、暗黙的フロー、クライアント認証情報などをサポート
- **ソーシャルログイン**: Facebook、Google、Amazonなどとの連携

![hosted_ui](/images/cognito/hosted_ui.png)

## トークンの種類と管理

Amazon Cognito は認証後に以下の種類のトークンを発行します：

### ID トークン

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

### アクセストークン

- JWT 形式
- ユーザーが実行できるアクションを定義
- スコープ属性によりアクセス権限を制御
- OAuth 2.0 仕様に準拠

### 更新トークン

- 有効期限が切れたIDトークンとアクセストークンを更新するために使用
- 長期間有効（デフォルトで30日）
- セキュアに保存する必要あり
- GlobalSignOut API を使用すると、[すべてのデバイスからサインアウト] といった機能をアプリケーションで提供できる
  - API実行時には、有効なアクセストークンを指定する
- AdminUserGlobalSignOut API を使用すると、ユーザープール内の任意のユーザーをサインアウトさせられる
  - API実行時には、ユーザー名とユーザープールIDを指定する

### トークンの有効期限と更新

トークンの有効期限はユーザープールの設定で定義できます：

- IDトークン: 5分～1日（デフォルト1時間）
- アクセストークン: 5分～1日（デフォルト1時間）
- 更新トークン: 1時間～10年（デフォルト30日）

トークンの更新フローは以下の通りです：

1. 更新トークンをAPIに送信
2. 新しいIDトークンとアクセストークンを受け取る
3. 必要に応じて更新トークンも更新される

## サインアップとサインインのカスタマイズ

Amazon Cognito では、サインアップとサインインのプロセスを以下のようにカスタマイズできます：

- **必須属性の設定**: ユーザー登録時に収集する必須情報の指定
- **属性検証**: メールアドレスや電話番号の検証要件
- **カスタム属性**: アプリケーション固有のユーザー情報の保存
- **パスワードポリシー**: 複雑さやローテーション要件の設定
- **Lambda トリガー**: サインアップ前後にカスタムロジックを実行
- **ホスト型 UI のカスタマイズ**: ロゴ、CSS、テキストのカスタマイズ

## Cognito Sync から AppSync への移行

Amazon Cognito Sync は古いサービスで、現在はAWS AppSync への移行が推奨されています。

- **Cognito Sync**: デバイス間でのユーザーデータの同期のための以前のサービス
- **AWS AppSync**: GraphQL を使用した最新のデータ同期サービス

AppSync の主な利点：

- リアルタイム更新とオフライン同期
- 細かいアクセス制御
- GraphQL API による柔軟なデータ操作
- CloudWatch との統合による詳細なモニタリング

## Cognito の料金

Amazon Cognito の料金は以下の要素に基づきます：

- **アクティブユーザー**: 月間のアクティブユーザー数（MAU）
- **ユーザープール高度なセキュリティ機能**: 特定のセキュリティ機能の使用料
- **ID プール**: 認証されたIDの数と認証リクエスト数

[Amazon Cognito 料金ページ](https://aws.amazon.com/jp/cognito/pricing/)で最新の料金情報を確認することができます。

基本的な料金構造：
- 月間アクティブユーザー (MAU) 50,000人までは無料
- それ以降は段階的な料金体系（ユーザー数が増えるほど単価は下がる）
- 無料利用枠は常に適用（毎月最初の50,000 MAUは無料）

## Cognito のクォータ

Amazon Cognito には以下のようなサービスクォータがあります：

**ユーザープール**:
- ユーザープールあたりのユーザー数: 40,000,000（デフォルト）
- AWSアカウントあたりのユーザープール数: 1,000（デフォルト）
- APIリクエストのレート制限: 各API操作によって異なる

**ID プール**:
- AWSアカウントあたりのIDプール数: 1,000（デフォルト）
- トークンサイズ制限: 4KB
- ロール割り当てルール数: IDプールあたり25

クォータの詳細と引き上げ方法については、[Amazon Cognito サービスクォータ](https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/limits.html)を参照してください。

## 実装パターン

### Webアプリケーション

Webアプリケーションでの一般的な実装パターン：

1. **フロントエンド認証**:
   - Amplify ライブラリを使用したReact/Vueなどでの実装
   - ホスト型UIを使用したOAuth/OIDC認証フロー

2. **バックエンド検証**:
   - API Gateway + Lambdaでのトークン検証
   - ALB認証統合によるアクセス制御

![web_pattern](/images/cognito/web_pattern.png)

### モバイルアプリケーション

モバイルアプリケーションでの一般的な実装パターン：

1. **ネイティブSDK統合**:
   - AWS Amplify SDKによるiOS/Android統合
   - ソーシャルIDプロバイダーとの連携

2. **オフラインアクセス**:
   - 更新トークンを使用した長期アクセス
   - AppSyncによるオフラインデータ同期

![mobile_pattern](/images/cognito/mobile_pattern.png)

### サーバーレスアプリケーション

サーバーレスアーキテクチャでの実装パターン：

1. **APIセキュリティ**:
   - API Gatewayのオーソライザーによるアクセス制御
   - Lambdaでのトークン検証

2. **マイクロサービスアクセス**:
   - サービス間でのCognito認証情報の伝播
   - IDプールを使用したAWSリソースへの直接アクセス

![serverless_pattern](/images/cognito/serverless_pattern.png)

## Cognito と CDK

AWS CDK を使用してCognitoリソースをデプロイする例：

```typescript
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';

export class CognitoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ユーザープールの作成
    const userPool = new cognito.UserPool(this, 'MyUserPool', {
      userPoolName: 'my-user-pool',
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
        username: true
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
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY
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
        callbackUrls: ['https://example.com/callback']
      }
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

このCDKスタックでは、以下のCognitoリソースを作成しています：

1. ユーザープール - ユーザー登録と認証のためのディレクトリ
2. ユーザープールクライアント - アプリケーションがユーザープールにアクセスするための設定
3. IDプール - 認証されたユーザーにAWSリソースへのアクセスを提供

## 📖 まとめ

Amazon Cognito は、アプリケーション向けの認証・認可サービスとして以下の価値を提供します：

- **統合認証管理**: ユーザー登録からアクセス管理までワンストップで提供
- **柔軟な認証オプション**: ソーシャルID、SAML、カスタム認証など多様な選択肢
- **セキュリティ**: 多要素認証、高度なセキュリティ機能によるリスク軽減
- **スケーラビリティ**: 数百万ユーザーまでシームレスに拡張可能
- **開発効率化**: 認証のためのコードを最小限に抑え、ビジネスロジックに集中可能

![cognito_summary](/images/all/cognito.png)

アプリケーションの認証機能を実装する際は、Cognitoを検討してみてください。特に複数の認証方法をサポートしたり、AWSリソースへの安全なアクセスを提供したりする場合に威力を発揮します。

**Lv300相当の追加学習トピック提案**:

1. **カスタムLambdaトリガーによる高度な認証フロー**: 
   - チャレンジ/レスポンス認証の実装
   - リスクベースの動的認証要件の設定

2. **エンタープライズ統合**:
   - Active DirectoryとのSAML統合
   - 複数IDPでのJust-In-Time (JIT) プロビジョニング

3. **セキュリティベストプラクティス**:
   - トークン管理と漏洩対策
   - リソースベースのきめ細かいアクセス制御の実装

4. **マルチテナントアーキテクチャ**:
   - テナントごとの分離と権限管理
   - グローバル分散アプリケーションでの地域別ユーザープール管理

5. **APIアクセス制御の高度な実装**:
   - カスタムオーソライザーによる細粒度の権限管理
   - API Gatewayとの詳細な統合パターン