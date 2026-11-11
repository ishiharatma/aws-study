---
title: "AWS Lambda の 3 つのコンピュートプリミティブ比較（Event / Web / MicroVMs）" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study", "lambda"]
published: false
emoji: "⚖️"
---

# AWS Lambda の 3 つのコンピュートプリミティブ比較<!-- omit in toc -->

![icon](/images/icons/64/Arch_AWS-Lambda_64.png)

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

<!-- Duration: 00:01:00 -->

- [Lambda は 3 種類になった](#lambda-は-3-種類になった)
- [3 種類の比較](#3-種類の比較)
- [durable functions と Managed Instances の位置づけ](#durable-functions-と-managed-instances-の位置づけ)
- [Lambda Web Adapter との関係](#lambda-web-adapter-との関係)
- [どれを選ぶか](#どれを選ぶか)
- [組み合わせの例](#組み合わせの例)
- [コストの考え方](#コストの考え方)
- [動かして確認する](#動かして確認する)
  - [Web Functions のストリーミングと多重実行](#web-functions-のストリーミングと多重実行)
  - [durable functions の承認待ちワークフロー](#durable-functions-の承認待ちワークフロー)
  - [MicroVMs のサスペンドとレジューム](#microvms-のサスペンドとレジューム)
- [既存記事と実装例](#既存記事と実装例)
- [Web 上の比較記事](#web-上の比較記事)
- [📖 まとめ](#-まとめ)

## Lambda は 3 種類になった

<!-- Duration: 00:02:00 -->

[What is AWS Lambda?](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) には、Lambda のコンピュートプリミティブとして次の 3 種類が挙げられています。

- Event Functions
  - 従来の Lambda 関数。イベントで呼び出され、ハンドラが動く
- Web Functions
  - 2026 年 10 月に登場。HTTP サーバーをそのまま動かす
- MicroVMs
  - 2026 年 6 月に登場。セッションごとに隔離された、状態を持つ実行環境

```text
Event Functions は元の Lambda 関数の名称が変わったものです。
API（CreateFunction、Invoke）、SDK、CLI、AWS::Lambda::Function、ARN はそのままで、コードの変更も不要です。
```

## 3 種類の比較

<!-- Duration: 00:05:00 -->

公式の比較表から、主な項目を抜き出しました。

| 項目 | Event Functions | Web Functions | MicroVMs |
| --- | --- | --- | --- |
| 向いている用途 | API、データ処理、自動化などのイベント駆動 | HTTP を直接サーブする Web アプリと API | ユーザーや AI が生成した、信頼できないコードの実行環境 |
| プログラミングモデル | ランタイムから呼ばれるハンドラ | ポートで listen する HTTP サーバー | 任意のアプリ（独自バイナリ、Linux の OS 機能など） |
| 実行時間 | 1 回の呼び出しで最大 15 分 | 1 リクエスト最大 15 分（既定 30 秒） | セッション最大 8 時間、サスペンドとレジュームが可能 |
| ランタイム | マネージドランタイムとカスタム | マネージドの Node.js | 自分で用意する MicroVM イメージ |
| パッケージ | zip（展開後 250 MB）またはコンテナイメージ（最大 10 GB） | zip のみ | MicroVM イメージ |
| 呼び出し方 | 直接の Invoke、AWS イベント連携 | TLS 付き HTTPS エンドポイント | 任意のポートへの L7 プロトコル |
| 同時実行 | 既定で 1 環境 1 リクエスト | 1 環境で多重処理 | 1 MicroVM で複数の接続 |
| 状態 | 実行環境の再利用はあるが、永続の保証なし | 同左 | サスペンドしてもメモリとディスクを保持 |
| スケーリング | 自動 | 自動、アイドル時はゼロ | 開発者が API で制御 |
| 課金 | リクエスト + GB 秒 | リクエスト + active CPU（1 ms 単位）+ 環境の存続期間中のメモリ | 実行中の秒課金 + サスペンド中のスナップショットストレージ |

MicroVMs だけ、スケーリングとライフサイクルの責任が開発者側にあります。Event と Web が「リクエストに応じて Lambda が増減させる」ものなのに対して、MicroVMs は「API で作成し、止め、再開するもの」です。

コンテナイメージで動かす Lambda は Event Functions に含まれます。違うのはパッケージの形式だけで、実行モデルや課金は zip の場合と同じです。

Web Functions の主な制限は次のとおりです。発表時の提供リージョンは us-east-1、us-east-2、us-west-2、ap-northeast-1、eu-west-1 です。

- ランタイムは `nodejs24.x` のみ
- 1 環境は 2 vCPU、2 GB
- 環境あたりの同時実行の上限は 1〜128（既定 64）
- エンドポイントあたり 10,000 RPS、アカウント合計で 100,000 RPS

## durable functions と Managed Instances の位置づけ

<!-- Duration: 00:02:00 -->

「Lambda の種類」として並べて語られることが多いですが、公式の 3 種類には含まれません。どちらも Event Functions の機能や実行基盤の選択肢です。

durable functions は Event Functions の機能で、チェックポイントとリプレイによって最大 1 年の処理を実現します。同時実行のプールも通常の Event Functions と共通です。

Managed Instances は Event Functions を EC2 上で動かす実行基盤の選択肢です。現時点で対応するのは Event Functions のみで、Firecracker ではなく Nitro とコンテナで分離され、1 環境で多重実行します。非同期呼び出しや ESM では最大 90 分まで実行できます。料金は $0.20/100 万リクエストに、EC2 の料金と、EC2 オンデマンド料金の 15% の管理料金が加わります。

## Lambda Web Adapter との関係

<!-- Duration: 00:01:00 -->

Web Functions の登場前から、[Lambda Web Adapter](./lambda-web-adapter-overview.md) を使えば Web フレームワークを Event Functions で動かせました。Lambda Web Adapter は Event Functions の上で動くアダプターなので、Node.js 以外の言語や、1 環境 1 リクエストのモデルが必要な場合は引き続き選択肢になります。

## どれを選ぶか

<!-- Duration: 00:03:00 -->

[Lambda の FAQ](https://aws.amazon.com/lambda/faqs/) は "Start with how your workload is invoked." として、呼び出し方から考えることを勧めています。

| 状況 | 選択 | 決め手 |
| --- | --- | --- |
| S3、SQS、EventBridge などの AWS イベントで起動する | Event Functions | AWS サービスとのイベント連携 |
| I/O 待ちが多い、トラフィックの変動が大きい、ストリーミングする Node.js の Web アプリや API | Web Functions | 1 環境の多重処理と active CPU 課金 |
| ユーザーや AI が生成したコードを、セッションごとに隔離して動かす | MicroVMs | VM 単位の隔離と、サスペンドしても残る状態 |
| 複数ステップで長時間待つ処理（承認待ちなど） | Event Functions + durable functions | 待機中は compute の課金が発生しない |
| Node.js 以外の言語で Web フレームワークを動かす、または API Gateway の機能を使う | Event Functions + Lambda Web Adapter | 言語を選ばず、API Gateway と組み合わせられる |

Web Functions でも、API Gateway の機能が必要なら API Gateway を残す判断になります。使用量プラン、API キー、Cognito や Lambda のオーソライザー、マッピング、mTLS、WebSocket API がその例です。Provisioned Concurrency と SnapStart も Web Functions では使えません。

ECS や Fargate との使い分けについて公式の比較はありません。

## 組み合わせの例

<!-- Duration: 00:02:00 -->

実際のシステムでは、1 種類に揃える必要はありません。

- Web Functions の API + Event Functions の非同期処理
  - リクエストを受けて SQS に入れ、Event Functions で後続処理を実行する
- 認証付きのコントロールプレーン + MicroVMs のセッション
  - ログインしたユーザーごとに MicroVM を起動する。[code-server-session-control-plane](https://github.com/ishiharatma/aws-cdk-reference-architectures/tree/main/infrastructure/workspaces/code-server-session-control-plane) がこの形
- Event Functions + durable functions の承認フロー + 通知
  - 人の判断を待つ間は compute の課金なしで止める。[lambda-durable-functions-approval](https://github.com/ishiharatma/aws-cdk-reference-architectures/tree/main/infrastructure/workspaces/lambda-durable-functions-approval) がこの形

## コストの考え方

<!-- Duration: 00:03:00 -->

ap-northeast-1 の arm64 の単価は次のとおりです（2026 年 10 月時点の Price List API の値）。課金の単位が違うので、単価だけでは比較できません。

| 対象 | リクエスト（100 万あたり） | コンピュート |
| --- | --- | --- |
| Event Functions | $0.20 | $0.0000133334/GB 秒 |
| Web Functions | $0.30 | $0.0000322421/vCPU 秒 + $0.0000042688/GB 秒 |
| API Gateway REST API（最初の 3.33 億） | $4.25 | なし |
| API Gateway HTTP API（最初の 3 億） | $1.29 | なし |

[lambda-web-functions-express](https://github.com/ishiharatma/aws-cdk-reference-architectures/tree/main/infrastructure/workspaces/lambda-web-functions-express) の Todos API で試算すると、100 万リクエストあたり Web Functions は約 $0.45、Event Functions は約 $0.25 に API Gateway REST API の $4.25 が加わります。Web Functions が安くなるのは API Gateway が不要になる分で、コンピュートが安いわけではありません。

active CPU 課金では CPU を使っていない時間に CPU の料金がかからないため、I/O 待ちが多い処理ほど安くなります。I/O 待ちのテストでは、EnvironmentCPUTime 4.6 秒に対して ActiveTime 361.7 秒で、CPU を使っていたのは約 1.3% でした。逆に CPU バウンドの処理では利点がなくなり、Node.js が 2 vCPU のうち 1 つしか使わない点も不利です。

⚠️ Web Functions のメモリは環境の存続期間全体に課金されます。1 環境が常時動いていると、それだけで月に約 $2.2 かかります。

短い CRUD だけなら、CloudFront + Function URL + Event Functions の構成の方が安くなります。

MicroVMs はセッションの長さで考えます。実行中は秒課金で、サスペンド中はスナップショットのストレージのみになるので、アイドルポリシーの設定がコストに直結します。

## 動かして確認する

<!-- Duration: 00:10:00 -->

3 つとも [aws-cdk-reference-architectures](https://github.com/ishiharatma/aws-cdk-reference-architectures) のワークスペースを使います。最初に依存関係をインストールし、環境変数を設定します。

```bash
cd infrastructure && npm install
export PROJECT=myproject ENV=dev
```

### Web Functions のストリーミングと多重実行

```bash
npm run bootstrap -w workspaces/lambda-web-functions-express
cdk bootstrap aws://<account-id>/us-east-1 --profile ${PROJECT}-${ENV}
npm run stage:deploy:all -w workspaces/lambda-web-functions-express
```

スタックの出力 `DistributionUrl` を `URL` に入れて実行します。

```bash
curl -s "$URL/health"
curl -N "$URL/debug/stream?count=5&intervalMs=500"
curl -s "$URL/debug/env" | jq .
```

`curl -N` で 500 ms ごとに 1 行ずつ届くのが見どころです。

ワークスペースのディレクトリで次を実行すると、同時リクエストの動作を確認できます。

```bash
./test-api.sh --project myproject --env dev --only concurrency --parallel 30
```

### durable functions の承認待ちワークフロー

`infrastructure` でデプロイしたあと、ワークスペースのディレクトリでデモ用のユーザーを作成します。

```bash
npm run stage:deploy:all -w workspaces/lambda-durable-functions-approval

cd workspaces/lambda-durable-functions-approval
./scripts/create-demo-users.sh <DemoUserPoolId> requester@example.com approver@example.com \
  --profile ${PROJECT}-${ENV} --region ap-northeast-1
```

`DemoWebUrl` を 2 つのブラウザで開き、申請者と承認者としてサインインします。`受付 → 承認待ち → 決定受信 → 完了` と進み、「自分で承認してみる」は 403、2 回目の決定は 409 になります。承認を待っている間、compute の課金は発生しません。コンソールの Durable executions タブでタイムラインを確認できます。

確認が終わったら、待機中の実行を止めてから削除します。待機中の実行があると、関数の削除が待たされます。

```bash
aws lambda list-durable-executions-by-function --function-name "<WorkflowFunctionName>" --statuses RUNNING
aws lambda stop-durable-execution --durable-execution-arn "<arn>"
cd ../.. && npm run stage:destroy:all -w workspaces/lambda-durable-functions-approval
```

### MicroVMs のサスペンドとレジューム

ベースイメージが `aws lambda-microvms list-managed-microvm-images` で確認できることを前提にします。

```bash
cd infrastructure/workspaces/code-server-ec2-vs-lambda-microvms
PROJECT=<project> ENV=dev npx cdk deploy '**/Microvms' --require-approval never

export PROJECT=<project>
./scripts/microvm-session.sh start --idle-seconds 120 --profile <profile>
./scripts/microvm-session.sh connect --profile <profile>
```

`http://localhost:8443` を開き、次のコマンドで取得したパスワードでログインします。

```bash
aws secretsmanager get-secret-value --secret-id <project>-dev-code-server-microvms-password --query SecretString --output text
```

ファイルを作成してしばらく放置し、自動でサスペンドされたあとに再度アクセスすると、ファイルがそのまま残っています。検証ではサスペンド後の初回アクセスは 0.65 秒でした。

終わったら `./scripts/microvm-session.sh stop --profile <profile>` で停止し、スタックも削除します。

## 既存記事と実装例

<!-- Duration: 00:01:00 -->

サービスごとの解説記事は次のとおりです。

- [AWS Lambda 概要](./lambda-overview.md)
- [AWS Lambda MicroVMs 概要](./lambda-microvms-overview.md)
- [AWS Lambda Web Adapter (LWA) 概要](./lambda-web-adapter-overview.md)
- [AWS Lambda durable functions 概要](./lambda-durable-functions-overview.md)

Web Functions の詳細な検証は Zenn の [Lambda Web Functions を CDK でデプロイして、多重実行・スロットリング・リリースを検証した](https://zenn.dev/issy/articles/aws-lambda-web-functions-express) にまとめています。

CDK の実装は [aws-cdk-reference-architectures](https://github.com/ishiharatma/aws-cdk-reference-architectures) にあります。

| 種類 | ワークスペース | 内容 |
| --- | --- | --- |
| Event | [apigw-single-purpose-lambda](https://github.com/ishiharatma/aws-cdk-reference-architectures/tree/main/infrastructure/workspaces/apigw-single-purpose-lambda) | ルートごとに関数を分ける |
| Event | [apigw-lambdalith](https://github.com/ishiharatma/aws-cdk-reference-architectures/tree/main/infrastructure/workspaces/apigw-lambdalith) | 1 関数にルーティングをまとめる |
| Event | [apigw-lambda-web-adapter](https://github.com/ishiharatma/aws-cdk-reference-architectures/tree/main/infrastructure/workspaces/apigw-lambda-web-adapter) | Express.js を Web Adapter で動かす |
| Event | [sqs-lambda-firehose](https://github.com/ishiharatma/aws-cdk-reference-architectures/tree/main/infrastructure/workspaces/sqs-lambda-firehose) | SQS をイベントソースにした処理 |
| Event + durable | [lambda-durable-functions-approval](https://github.com/ishiharatma/aws-cdk-reference-architectures/tree/main/infrastructure/workspaces/lambda-durable-functions-approval) | 最大 48 時間待つ承認フロー |
| Web | [lambda-web-functions-express](https://github.com/ishiharatma/aws-cdk-reference-architectures/tree/main/infrastructure/workspaces/lambda-web-functions-express) | Express.js を CloudFront OAC の背後で動かす |
| MicroVMs | [code-server-ec2-vs-lambda-microvms](https://github.com/ishiharatma/aws-cdk-reference-architectures/tree/main/infrastructure/workspaces/code-server-ec2-vs-lambda-microvms) | code-server を EC2 と MicroVMs で比較 |
| MicroVMs | [code-server-session-control-plane](https://github.com/ishiharatma/aws-cdk-reference-architectures/tree/main/infrastructure/workspaces/code-server-session-control-plane) | Cognito ログインでユーザーごとに起動 |
| MicroVMs | [lambda-microvms-codex-appserver](https://github.com/ishiharatma/aws-cdk-reference-architectures/tree/main/infrastructure/workspaces/lambda-microvms-codex-appserver) | セッションごとに VM 分離した Codex App Server |
| MicroVMs | [claude-managed-agents-lambda-microvms](https://github.com/ishiharatma/aws-cdk-reference-architectures/tree/main/infrastructure/workspaces/claude-managed-agents-lambda-microvms) | Claude Managed Agents のセルフホスト型サンドボックス |

## Web 上の比較記事

<!-- Duration: 00:01:00 -->

一次情報は公式の [What is AWS Lambda?](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) の比較表です。Web Functions の背景は次のブログが参考になります。

- [Announcing AWS Lambda Web Functions](https://aws.amazon.com/blogs/aws/announcing-aws-lambda-web-functions-for-fast-consistent-web-app-performance-anywhere/)
- [Exploring AWS Lambda Web Functions](https://aws.amazon.com/blogs/compute/exploring-aws-lambda-web-functions-for-building-web-applications/)

コミュニティの記事には次のものがあります。durable functions と Managed Instances を加えて 5 種類として整理した記事もあります。

- [Lambdaが3種類になったみたいなので、全部試してみた](https://qiita.com/maeda-kazutoshi/items/4674e080c2ce3d53c809)（Qiita、3 種類を実機で試した記事）
- [AWS Lambda Web Functionsから考えるAWS Lambdaとは何なのか](https://qiita.com/ymd65536/items/3bc00ba77b87808bda9b)（Qiita）
- [FaaS比較シリーズ #1](https://qiita.com/Doc-Tanukichi/items/0d62a69743f03f01a294)（Qiita）
- [Which AWS Lambda Type Should You Pick in 2026?](https://builder.aws.com/content/3LKHlt0CjHOlkrS1lLEH9jdnzfX/which-aws-lambda-type-should-you-pick-in-2026)（AWS Builder Center のコミュニティ投稿）
- [What Is AWS Lambda in 2026? 5 Flavors Explained](https://ranthebuilder.cloud/blog/what-is-aws-lambda-in-2026-5-flavors-explained/)

## 📖 まとめ

<!-- Duration: 00:01:00 -->

3 種類の違いは、呼び出し方と、状態とライフサイクルを誰が持つかに表れます。AWS のイベントで動かすなら Event Functions、HTTP サーバーをそのまま動かすなら Web Functions、セッションごとに隔離した環境が必要なら MicroVMs です。

Event Functions は名前が変わっただけなので、既存の関数を移行する必要はありません。Web Functions は API Gateway をなくせるかどうかでコストの結論が変わるので、必要な機能を確認してから検討しましょう。
