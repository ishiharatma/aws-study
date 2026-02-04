# AWS Amplify<!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

- [AWS Amplify とは](#aws-amplify-とは)
- [Gen 1 と Gen 2 の違い](#gen-1-と-gen-2-の違い)
  - [コードファーストへの変化](#コードファーストへの変化)
  - [CDK ベースの拡張性](#cdk-ベースの拡張性)
- [認証（Auth）](#認証auth)
  - [Authenticator UI コンポーネント](#authenticator-ui-コンポーネント)
- [データ（Data）](#データdata)
  - [認可ルール](#認可ルール)
- [ストレージ（Storage）](#ストレージstorage)
- [関数（Functions）](#関数functions)
- [ホスティング](#ホスティング)
  - [SSR サポート](#ssr-サポート)
  - [Git ベースの CI/CD](#git-ベースの-cicd)
- [AI 連携](#ai-連携)
- [サンドボックス環境](#サンドボックス環境)
- [Gen 1 からの移行](#gen-1-からの移行)
- [📖 まとめ](#-まとめ)

## AWS Amplify とは

<!-- Duration: 0:03:00 -->

フロントエンド開発者がフルスタックアプリケーションを迅速に構築・デプロイできるようにする開発プラットフォームです。データモデル、ビジネスロジック、認証・認可ルールを TypeScript で記述するだけで、適切なクラウドリソースが自動的にプロビジョニングされます。

2024 年 5 月に Amplify Gen 2 が一般提供（GA）開始され、TypeScript ベースのコードファーストな開発者体験（DX）が提供されるようになりました。内部的には AWS CDK（Cloud Development Kit）をベースとしており、CloudFormation スタックとしてリソースが管理されます。

Gen 2 では、Auth、Data、Storage、Functions の 4 つのカテゴリが組み込みでサポートされており、その他のユースケースは AWS CDK コンストラクトを使用して拡張できます。

【AWS Black Belt Online Seminar】AWS Amplify Gen2(YouTube)-なし

![blackbelt_amplify](/images/amplify/blackbelt-amplify-320.jpg)

【AWS Black Belt Online Seminar】[AWS Amplify Gen1(YouTube)](https://www.youtube.com/watch?v=A4HOzn7ERqE)(1:02:59)

[AWS Amplify サービス概要](https://aws.amazon.com/jp/amplify/)

[AWS Amplify Gen 2 ドキュメント](https://docs.amplify.aws/)

[AWS Amplify よくある質問](https://aws.amazon.com/jp/amplify/faqs/)

[AWS Amplify 料金](https://aws.amazon.com/jp/amplify/pricing/)

[AWS Amplify で加速する生成 AI アプリケーション開発（AWS-16）(YouTube)](https://www.youtube.com/watch?v=HsMUZLDX38Y)(40:30)

## Gen 1 と Gen 2 の違い

<!-- Duration: 0:05:00 -->

Gen 2 は Gen 1 からの大きなパラダイムシフトです。主な違いは以下のとおりです。

| 項目 | Gen 1 | Gen 2 |
| --- | --- | --- |
| 開発アプローチ | Amplify CLI（対話型コマンド） | TypeScript コードファースト |
| バックエンド定義 | CLI が CloudFormation テンプレートを自動生成 | CDK ベースで TypeScript でリソースを定義 |
| 開発環境 | 共有のバックエンド環境 | 開発者ごとに分離されたサンドボックス |
| デプロイ速度 | 通常のデプロイ | 最大 8 倍高速（インテリジェントキャッシュ） |
| 環境管理 | CLI/Console で手動設定 | Git ブランチと 1:1 対応（ゼロコンフィグ） |
| 拡張性 | Amplify プラグイン | CDK コンストラクトで任意の AWS サービスを追加 |
| コンソール | Amplify Studio と Hosting が別々 | 統合コンソール |
| 型安全性 | codegen コマンドで明示的に生成 | 自動的に型を生成 |

### コードファーストへの変化

Gen 1 では `amplify add auth` や `amplify add api` などの CLI コマンドを対話的に実行してバックエンドを構築していました。Gen 2 では、`amplify/auth/resource.ts` や `amplify/data/resource.ts` といった TypeScript ファイルにバックエンドの定義を記述します。

```text
Gen 1: CLI ベース → 対話的にリソースを生成 → CloudFormation テンプレートが自動生成
Gen 2: コードファースト → TypeScript でリソースを定義 → CDK 経由で CloudFormation にデプロイ
```

### CDK ベースの拡張性

Gen 2 は AWS CDK の上に構築されているため、Amplify が標準提供しない AWS サービスも CDK コンストラクトとして追加できます。Data や Auth の機能は L3 CDK コンストラクトをラップしているため、Amplify が生成するリソースの拡張に特別な設定は不要です。

## 認証（Auth）

<!-- Duration: 0:03:00 -->

Amplify Auth は **Amazon Cognito** を基盤としたユーザー認証機能を提供します。`amplify/auth/resource.ts` で `defineAuth` 関数を使用して認証リソースを定義します。

```ts
// amplify/auth/resource.ts
import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});
```

デフォルトではメールアドレスによるログインが設定されますが、以下のような認証方式もサポートしています。

- 電話番号によるサインイン
- 外部プロバイダー（Google、Facebook、Amazon、Sign in with Apple）
- パスワードレス認証（Email OTP、SMS OTP、WebAuthn パスキー）
- 多要素認証（MFA）

AWS ドキュメント > [Set up Amplify Auth](https://docs.amplify.aws/react/build-a-backend/auth/set-up-auth/)

### Authenticator UI コンポーネント

Amplify は認証フローを迅速に構築するための UI コンポーネントを提供しています。`amplify/auth/resource.ts` の設定と自動的に連携し、バックエンドリソースに接続します。

対応フレームワーク:

- React / Vue / Angular
- React Native
- Swift / Android / Flutter

## データ（Data）

<!-- Duration: 0:05:00 -->

Amplify Data は `amplify/data/resource.ts` で `defineData` 関数を使用してデータスキーマを定義します。定義されたスキーマから **AWS AppSync GraphQL API** と **Amazon DynamoDB** テーブルが自動的にプロビジョニングされます。

```ts
// amplify/data/resource.ts
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      isDone: a.boolean(),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
```

TypeScript で定義するため、ドット補完、IntelliSense、型バリデーションが利用できます。Gen 1 で必要だった明示的な codegen ステップは不要で、型は自動的に生成されます。

`observeQuery` を使用することで、バックエンドデータのライブフィードをサブスクライブし、リアルタイムなデータ同期が可能です。

AWS ドキュメント > [Set up Amplify Data](https://docs.amplify.aws/react/build-a-backend/data/set-up-data/)

### 認可ルール

Amplify Data では、データモデル全体、特定のモデル、特定のフィールドに対して認可ルールを適用できます。Amplify は常に最も具体的なルールを適用します。

| 認可戦略 | 説明 |
| --- | --- |
| **public** | 全員にアクセスを許可（API キーまたは未認証 IAM ロール） |
| **owner** | レコードの所有者のみに操作を制限 |
| **private** | サインイン済みユーザーのみにアクセスを制限（IAM / Cognito / OIDC） |
| **group** | 特定のユーザーグループにアクセスを制限（静的/動的グループ） |
| **custom** | Lambda 関数によるカスタム認可ルール |

AWS ドキュメント > [Customize your auth rules](https://docs.amplify.aws/react/build-a-backend/data/customize-authz/)

## ストレージ（Storage）

<!-- Duration: 0:01:30 -->

Amplify Storage は **Amazon S3** と連携し、Cognito によるアクセス制御が適用されたオブジェクトストレージを提供します。

ブラウザやモバイルデバイスから直接メディア、ドキュメント、ユーザーコンテンツをアップロードでき、プリサイン URL のロジックを手書きする必要はありません。

```ts
// amplify/storage/resource.ts
import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "myProjectFiles",
  access: (allow) => ({
    "profile-pictures/{entity_id}/*": [
      allow.guest.to(["read"]),
      allow.entity("identity").to(["read", "write", "delete"]),
    ],
    "media/*": [
      allow.authenticated.to(["read", "write"]),
    ],
  }),
});
```

## 関数（Functions）

<!-- Duration: 0:01:30 -->

Amplify Functions は **AWS Lambda** と連携し、TypeScript でサーバーサイドのビジネスロジックを定義できます。

```ts
// amplify/functions/say-hello/resource.ts
import { defineFunction } from "@aws-amplify/backend";

export const sayHello = defineFunction({
  name: "say-hello",
  entry: "./handler.ts",
});
```

```ts
// amplify/functions/say-hello/handler.ts
export const handler = async (event: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from Amplify!" }),
  };
};
```

定義した関数は Data のカスタムリゾルバや Auth のトリガーとしても利用できます。

## ホスティング

<!-- Duration: 0:03:00 -->

Amplify Hosting は、静的サイト、SSR アプリケーション、ハイブリッド Web アプリのデプロイとホスティングを提供します。

### SSR サポート

以下のフレームワークがサポートされています。

- **Next.js** — アダプターなしで Next.js 15 をサポート
- **Nuxt** — オープンソースのビルドアダプター経由
- **Astro** — オープンソースのビルドアダプター経由
- **SvelteKit** — オープンソースのビルドアダプター経由

```text
2025 年 9 月 15 日以降、Node.js 14/16/18 ランタイムのサポートが終了します。
Node.js 20 または Node.js 22 への移行が必要です。
```

2025 年 2 月には SSR アプリケーション向けに IAM ロールのサポートが追加されました。これにより、環境変数でクレデンシャルを定義する必要がなくなり、一時的な資格情報による安全なアクセスが可能になりました。

AWS ドキュメント > [Deploying server-side rendered applications with Amplify Hosting](https://docs.aws.amazon.com/amplify/latest/userguide/server-side-rendering-amplify.html)

### Git ベースの CI/CD

Amplify Hosting は GitHub、GitLab、CodeCommit に接続し、コミットごとに自動ビルド・デプロイを実行します。

- 本番、ステージングなどの共有環境は Git ブランチと 1:1 で対応
- プルリクエストプレビューで本番マージ前に検証可能
- 即時ロールバックとゼロダウンタイムデプロイ
- カスタムドメインの設定

## AI 連携

<!-- Duration: 0:01:00 -->

Amplify は **Amazon Bedrock** との連携機能を提供しており、バンドルされたチャット UI コンポーネントと型付きクライアントにより、LLM（大規模言語モデル）を数分でアプリケーションに統合できます。

Amplify のロードマップでは、CDK 統合の深化と AI サービスプラグインの拡張が重点項目として挙げられています。

## サンドボックス環境

<!-- Duration: 0:02:00 -->

Gen 2 の特徴的な機能の一つが、開発者ごとに分離されたクラウドサンドボックス環境です。

- 各開発者が独立した AWS バックエンド環境を持つ
- 他の開発者の環境に影響を与えずに変更をテストできる
- イテレーションの更新は Gen 1 比で最大 8 倍高速
- インテリジェントキャッシュにより、変更のない部分はビルドをスキップ

```text
サンドボックス環境は開発時のみ使用します。
本番環境やステージング環境は Git ブランチベースの共有環境を使用します。
```

サンドボックスの起動は以下のコマンドで行います。

```sh
npx ampx sandbox
```

## Gen 1 からの移行

<!-- Duration: 0:02:00 -->

AWS は Gen 1 のサポート継続を明言していますが、新規アプリケーションには Gen 2 が推奨されています。

移行時の主な注意点:

- DataStore など、一部機能が Gen 2 で未対応の場合がある
- CDK や AWS リソース管理の知識が新たに求められる
- 2026 年 1 月の AWS Amplify Conference 2026 にて、Gen 1 から Gen 2 へのマイグレーションツールのベータ提供が発表

AWS ドキュメント > [Gen 2 for Gen 1 customers](https://docs.amplify.aws/react/start/migrate-to-gen2/)

| ユースケース | 推奨 |
| --- | --- |
| 新規アプリケーション | Gen 2 |
| 大人数チームでの並行開発 | Gen 2（ブランチごとのフルスタックデプロイが有利） |
| 長期運用・高トラフィック | Gen 2 |
| DataStore 必須のモバイルアプリ | Gen 1（Gen 2 では未対応の可能性） |
| 既存 Gen 1 アプリ | 慎重に移行を検討 |

## 📖 まとめ

![amplify](/images/all/amplify.png)
