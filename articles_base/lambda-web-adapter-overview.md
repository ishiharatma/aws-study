# AWS Lambda Web Adapter (LWA)<!-- omit in toc -->

![icon](/images/icons/64/Arch_AWS-Lambda_64.png)

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

- [AWS Lambda Web Adapter とは](#aws-lambda-web-adapter-とは)
- [なぜ必要になるのか](#なぜ必要になるのか)
- [仕組み](#仕組み)
- [対応イベントソース](#対応イベントソース)
- [対応フレームワーク](#対応フレームワーク)
- [主な機能](#主な機能)
  - [レスポンスストリーミング](#レスポンスストリーミング)
  - [レスポンス圧縮](#レスポンス圧縮)
  - [グレースフルシャットダウン](#グレースフルシャットダウン)
  - [SnapStart との連携](#snapstart-との連携)
  - [ポータビリティ](#ポータビリティ)
- [導入方法](#導入方法)
  - [コンテナイメージでの導入](#コンテナイメージでの導入)
  - [Zip パッケージ（Lambda Layer）での導入](#zip-パッケージlambda-layerでの導入)
- [主な環境変数](#主な環境変数)
- [利用例](#利用例)
- [ユースケース](#ユースケース)
- [メリット](#メリット)
- [デメリット・注意点](#デメリット注意点)
- [📖 まとめ](#-まとめ)

## AWS Lambda Web Adapter とは

AWS Labs（AWS Open Source）が公開している OSS ツールで、Express.js、Next.js、Flask、FastAPI、Spring Boot、ASP.NET、Laravel、Nginx などの既存の Web フレームワークで作られたアプリケーションを、コードをほとんど、あるいはまったく変更せずに AWS Lambda 上で動かせるようにするアダプタです。

[aws/aws-lambda-web-adapter（GitHub）](https://github.com/aws/aws-lambda-web-adapter)

Lambda 関数は本来、`event` と `context` を受け取るハンドラー関数として実装するものであり、通常の Web フレームワークが前提とする「HTTP サーバーとして listen する」というモデルとは異なります。このギャップを埋め、Web アプリケーションの資産をそのままサーバーレス化するために作られたのが Lambda Web Adapter です。

## なぜ必要になるのか

多くの Web フレームワークは、特定のポートで HTTP サーバーを起動し、リクエストを受け付ける作りになっています。これを Lambda で動かそうとすると、本来はフレームワーク側のルーティングやミドルウェア機構を Lambda 用に書き換える（あるいは専用のアダプタライブラリを個別に組み込む）必要があり、フレームワークやランタイムごとに実装がバラバラになりがちでした。

Lambda Web Adapter は、この変換処理を Lambda 拡張（Extension）として切り出すことで、アプリケーション側のコード変更を最小限に抑えつつ、任意の HTTP ベースのフレームワークを Lambda に載せられるようにしています。

## 仕組み

Lambda Web Adapter は、Lambda Extension の仕組みを利用して、関数の実行環境内で独立した Rust 製のプロセスとして動作します。この拡張プロセスが、Lambda に届いた API Gateway・ALB・Function URL などのイベントを受け取り、それを通常の HTTP リクエストに変換して、同じ実行環境内でローカルに起動している Web アプリケーション（既定では 8080 番ポートなど）へ転送します。アプリケーションから返された HTTP レスポンスは、再び Lambda が期待する形式に変換されて呼び出し元へ返されます。

アプリケーション自身は「自分が Lambda 上で動いている」ことをほぼ意識せず、ローカル環境や EC2、Fargate 上で動かすときと同じように、ポートを listen する通常の HTTP サーバーとして実装できます。

[Design（aws-lambda-web-adapter, GitHub）](https://github.com/aws/aws-lambda-web-adapter/blob/main/docs/design.md)

## 対応イベントソース

- Amazon API Gateway（REST API）
- Amazon API Gateway（HTTP API）
- Lambda 関数 URL（Function URLs）
- Application Load Balancer（ALB）
- SQS など非 HTTP のイベントソース（拡張的な対応）

いずれも最終的には HTTP リクエスト／レスポンスの形に正規化してアプリケーションとやり取りします。

## 対応フレームワーク

HTTP/1.0 または HTTP/1.1 で通信するフレームワークであれば、基本的に言語やフレームワークを問わず利用できます。公式リポジトリのサンプルには、次のような多数のフレームワーク・言語向けの例が用意されています。

- Node.js：Express.js、Next.js、NestJS など
- Python：Flask、FastAPI、Django など
- Java：Spring Boot
- .NET：ASP.NET Core
- PHP：Laravel
- Go：Gin
- Rust：Actix、Axum
- その他：Nginx をそのまま前段に立てる構成 など

40 種類以上のフレームワーク・構成のサンプルが公式リポジトリの `examples` 配下に公開されています。

## 主な機能

### レスポンスストリーミング

Lambda の関数 URL などがサポートするレスポンスストリーミング（Response Streaming）に対応しており、`AWS_LWA_INVOKE_MODE` を `response_stream` に設定することで、Server-Sent Events や大きめのペイロードを、バッファリングせずに逐次クライアントへ返すことができます。生成 AI のトークンをストリーミングで返すようなユースケースと相性が良い機能です。

[Using response streaming with AWS Lambda Web Adapter to optimize performance（AWS Compute Blog）](https://aws.amazon.com/blogs/compute/using-response-streaming-with-aws-lambda-web-adapter-to-optimize-performance/)

### レスポンス圧縮

`AWS_LWA_ENABLE_COMPRESSION` を有効にすることで、gzip や Brotli によるレスポンス圧縮を Adapter 側で行えます。

### グレースフルシャットダウン

Lambda の実行環境が終了する際のシグナルを Adapter が仲介し、アプリケーション側に猶予を持たせた終了処理を行わせることができます。

### SnapStart との連携

Lambda の SnapStart（実行環境の初期化状態をスナップショットして再利用する機能）を利用する場合、スナップショット取得の前後でコネクションの切断・再接続などの後処理・前処理が必要になることがあります。Lambda Web Adapter は、`AWS_LWA_SNAPSTART_BEFORE_CHECKPOINT_PATH` と `AWS_LWA_SNAPSTART_AFTER_RESTORE_PATH` という 2 つのフックパスを提供しており、それぞれスナップショット取得直前・復元直後にアプリケーションへ空の POST リクエストを送ります。アプリケーション側はこれを受けてリソースの解放・再確立を行い、2xx を返すことで正常完了を通知します。

### ポータビリティ

同じコンテナイメージを Lambda、Amazon EC2、AWS Fargate、そしてローカルの開発環境でそのまま動かせる点も特徴です。Lambda 固有のコードをアプリケーションに書き込む必要がないため、実行基盤を移行する際の書き換えコストを抑えられます。

## 導入方法

### コンテナイメージでの導入

Dockerfile 内で Lambda Web Adapter のバイナリをマルチステージビルドの `COPY --from` でコンテナイメージに取り込みます。

```dockerfile
FROM public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1 AS lambda-adapter

FROM node:20-alpine
COPY --from=lambda-adapter /lambda-adapter /opt/extensions/lambda-adapter
WORKDIR /app
COPY . .
RUN npm install
ENV PORT=8080
CMD ["npm", "start"]
```

### Zip パッケージ（Lambda Layer）での導入

コンテナイメージを使わない場合は、Lambda Layer として公開されている Lambda Web Adapter を関数にアタッチし、関数の起動コマンドをアプリケーションの起動スクリプトに向ける形でも利用できます。

## 主な環境変数

| 環境変数 | 説明 | デフォルト |
| --- | --- | --- |
| `AWS_LWA_PORT` | アプリケーションが listen するポート番号 | `8080` |
| `AWS_LWA_READINESS_CHECK_PATH` | 起動時のヘルスチェックに使うパス | `/` |
| `AWS_LWA_ENABLE_COMPRESSION` | レスポンス圧縮の有効化 | `false` |
| `AWS_LWA_INVOKE_MODE` | `buffered` または `response_stream` | `buffered` |
| `AWS_LWA_SNAPSTART_BEFORE_CHECKPOINT_PATH` | SnapStart のスナップショット取得前に呼び出すパス | 未設定 |
| `AWS_LWA_SNAPSTART_AFTER_RESTORE_PATH` | SnapStart の復元後に呼び出すパス | 未設定 |

これら以外にも多数の設定項目が用意されているため、詳細は README を参照してください。

## 利用例

Express.js アプリケーションであれば、Lambda 用に特別なハンドラーを書く必要はなく、通常どおりポートを listen するだけで済みます。

```js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Express on Lambda!");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
```

このアプリケーションを Lambda Web Adapter を組み込んだコンテナイメージでビルドし、Lambda 関数として API Gateway や関数 URL に紐づけるだけで、既存の Express アプリケーションがそのまま Lambda 上で稼働します。

## ユースケース

- 既存の Web アプリケーション（Express、Flask、Spring Boot など）を、書き換えを最小限にしてサーバーレス化したい場合
- EC2／ECS／Fargate からサーバーレスへの移行を段階的に進めたい場合（同じイメージを両方の基盤で動かして比較検証できる）
- 生成 AI のレスポンスをストリーミングで返す API を、使い慣れたフレームワークで実装したい場合
- チームがすでに特定の Web フレームワークに習熟しており、Lambda 専用のハンドラー実装を新たに学習するコストを避けたい場合

## メリット

- 既存の Web フレームワークの知識・資産（ルーティング、ミドルウェア、テンプレートエンジンなど）をそのまま活用できる
- ローカル・EC2・Fargate・Lambda で同じイメージ／コードベースを使い回せるため、移行や検証がしやすい
- レスポンスストリーミングや圧縮など、Lambda のネイティブ機能を意識せずに利用できる
- SnapStart 利用時のコネクション再確立といった、サーバーレス特有の考慮事項をフックとして分離できる

## デメリット・注意点

- Lambda 自体の制約（最大実行時間、ペイロードサイズ、同時実行数などのクォータ）がなくなるわけではない
- 常時 HTTP サーバープロセスと Adapter プロセスが実行環境内で動作するため、素の Lambda ハンドラーに比べてわずかにオーバーヘッドが増える
- ステートフルな WebSocket のような長時間の双方向接続には、Lambda の実行時間上限や API Gateway の制約が別途関わってくるため、そのままでは不向きなケースがある
- コールドスタート自体は Lambda 側の特性に依存するため、Adapter の導入だけで解消されるわけではない（言語ランタイムやイメージサイズの最適化は引き続き必要）

## 📖 まとめ

Lambda Web Adapter は、「Lambda 専用のハンドラーを書き直す」というサーバーレス移行のハードルを取り除き、使い慣れた Web フレームワークの資産をそのまま Lambda に持ち込むための橋渡し役です。レスポンスストリーミングや SnapStart 連携など、Lambda ならではの機能とも統合されており、既存アプリケーションのサーバーレス化や、EC2／Fargate とのハイブリッド運用を検討する際の有力な選択肢になります。
