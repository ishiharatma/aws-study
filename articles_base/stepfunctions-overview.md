# AWS Step Functions<!-- omit in toc -->

![icon](/images/icons/64/Arch_AWS-Step-Functions_64.png)

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

- [AWS Step Functions とは](#aws-step-functions-とは)
- [ステートマシンと Amazon States Language](#ステートマシンと-amazon-states-language)
- [ステートの種類](#ステートの種類)
- [ワークフロータイプ](#ワークフロータイプ)
  - [Standard ワークフロー](#standard-ワークフロー)
  - [Express ワークフロー](#express-ワークフロー)
- [AWS のサービスとの直接統合](#aws-のサービスとの直接統合)
- [エラーハンドリングと再試行](#エラーハンドリングと再試行)
- [実行方法](#実行方法)
- [モニタリング](#モニタリング)
- [ユースケース](#ユースケース)
- [料金](#料金)
- [メリット](#メリット)
- [デメリット・注意点](#デメリット注意点)
- [📖 まとめ](#-まとめ)

## AWS Step Functions とは

複数の AWS のサービスや Lambda 関数を、視覚的なワークフロー（ステートマシン）として組み合わせ、オーケストレーション（処理の順序制御）できるフルマネージドサービスです。2016 年の re:Invent で発表されました。

[AWS Step Functions サービス概要](https://aws.amazon.com/step-functions/)

[AWS Step Functions ドキュメント](https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html)

[AWS Step Functions よくある質問](https://aws.amazon.com/step-functions/faqs/)

[AWS Step Functions の料金](https://aws.amazon.com/step-functions/pricing/)

各処理のステップを自前でコーディングして繋ぎ合わせる代わりに、ステートマシンとして定義しておくことで、実行順序、並列処理、条件分岐、エラー時のリトライ、待機といった制御をサービス側に任せられます。実行履歴が自動的に記録されるため、どのステップで何が起きたかを後から追いやすい点も特徴です。

## ステートマシンと Amazon States Language

ステートマシンは、Amazon States Language（ASL）という JSON ベースの言語で定義します。ステートマシンは複数の「ステート」で構成されており、各ステートが 1 つの処理単位（タスクの実行、条件分岐、待機など）を表します。

```json
{
  "Comment": "シンプルなステートマシンの例",
  "StartAt": "ValidateOrder",
  "States": {
    "ValidateOrder": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:ap-northeast-1:123456789012:function:validateOrder",
      "Next": "IsValid"
    },
    "IsValid": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.valid",
          "BooleanEquals": true,
          "Next": "ProcessPayment"
        }
      ],
      "Default": "RejectOrder"
    },
    "ProcessPayment": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:ap-northeast-1:123456789012:function:processPayment",
      "End": true
    },
    "RejectOrder": {
      "Type": "Fail",
      "Error": "OrderRejected"
    }
  }
}
```

コンソールには、このステートマシンをグラフとして可視化する機能（Workflow Studio）があり、ドラッグ＆ドロップでステートマシンを組み立てることもできます。

## ステートの種類

主なステートタイプは次のとおりです。

- `Task`：Lambda 関数の実行や、他の AWS サービスの API 呼び出しなど、実際の作業を行う
- `Choice`：条件分岐
- `Parallel`：複数の処理分岐を並列実行
- `Map`：配列の各要素に対して同じ処理を繰り返す（近年は大量データ向けの `Distributed Map` も利用可能）
- `Wait`：指定時間または指定時刻まで待機
- `Pass`：入力をそのまま（あるいは加工して）出力に渡す、デバッグ用の空処理
- `Succeed` / `Fail`：ステートマシンの正常終了・異常終了

## ワークフロータイプ

Step Functions には、用途に応じて 2 種類のワークフロータイプがあります。

### Standard ワークフロー

- 実行履歴を長期間保持し、実行状況を細かく追跡できる
- 最大 1 年間実行可能な長時間ワークフローに対応
- 実行は "厳密に 1 回のみ" のセマンティクスを持つ（Exactly-once）
- 料金は状態遷移の回数に応じて課金される

### Express ワークフロー

- 高頻度・短時間（最大 5 分）のイベント処理向け
- "少なくとも 1 回" のセマンティクス（At-least-once）で、高いスループットを実現
- 料金は実行回数、実行時間、消費メモリに基づいて課金される
- 実行履歴は CloudWatch Logs に出力する形になる

IoT データ処理やストリーミングデータの変換など、大量かつ短時間のイベントを処理したい場合は Express ワークフロー、注文処理や承認フローのように、実行の厳密性や長時間実行、詳細な実行履歴の追跡が必要な場合は Standard ワークフローを選ぶのが基本的な指針です。

## AWS のサービスとの直接統合

Step Functions は、Lambda を経由しなくても、200 を超える AWS のサービスの API を直接呼び出せる「AWS SDK 統合」を備えています。DynamoDB へのデータ書き込み、SNS への通知発行、ECS タスクの起動、Glue ジョブの実行などを、Lambda 関数を作らずにステートマシンから直接呼び出せます。

さらに、ECS タスクの完了や SNS の応答のように、処理が終わるまで待ってから次のステートに進みたい場合のための「サービス統合パターン（Run a Job、Wait for Callback など）」も用意されています。

## エラーハンドリングと再試行

各 `Task` ステートには、`Retry`（リトライ）と `Catch`（例外時の遷移先）を個別に設定できます。指数バックオフを伴うリトライ回数の指定や、特定のエラーの種類ごとに異なる後続処理を割り当てることが可能です。これにより、エラーハンドリングのロジックをアプリケーションコード側に書き込む必要がなくなります。

## 実行方法

- マネジメントコンソールからの手動実行
- AWS CLI・SDK からの実行（`StartExecution` API）
- Amazon EventBridge のルールをトリガーにした実行
- API Gateway 経由での実行（HTTP リクエストからの直接起動）

## モニタリング

各実行の状態遷移はコンソール上でグラフィカルに表示され、どのステートでどれだけ時間がかかったか、どこで失敗したかを視覚的に確認できます。CloudWatch と統合されており、実行数やエラー数、実行時間などのメトリクスを監視できます。X-Ray によるトレースにも対応しています。

## ユースケース

- マイクロサービスのオーケストレーション（複数の Lambda 関数・コンテナタスクの連携）
- データ処理パイプライン、ETL ジョブのオーケストレーション
- 人による承認を挟む業務プロセス（注文処理、稟議フローなど）
- 機械学習のトレーニング・推論パイプライン
- IT インフラの自動運用（パッチ適用、インスタンスのプロビジョニングなど）

## 料金

Standard ワークフローは状態遷移の回数に応じて課金され、月間 4,000 回までの無料利用枠があります。Express ワークフローは、実行回数、実行時間、使用メモリ量に基づく課金体系です。いずれの場合も、ステートマシンから呼び出す Lambda や他のサービス自体の料金は別途発生します。正確な単価は [AWS Step Functions の料金ページ](https://aws.amazon.com/step-functions/pricing/) で確認してください。

## メリット

- 複雑な分岐・並列処理・リトライを、コードを書かずに定義できる
- 実行履歴が自動的に残り、可視化されたグラフでデバッグしやすい
- 200 以上の AWS サービスと直接統合でき、グルーコードとしての Lambda を減らせる
- Standard ワークフローでは最大 1 年の長時間ワークフローに対応できる

## デメリット・注意点

- ASL（JSON）でのステートマシン定義は、慣れるまで可読性が低く感じられることがある
- Standard ワークフローは状態遷移数に応じた課金のため、細かいステートに分割しすぎるとコストが増えやすい
- Express ワークフローは At-least-once のため、べき等性を考慮した設計が必要になる場合がある
- 複雑なワークフローになるほどステートマシン定義自体が肥大化し、テストや変更管理の工夫が必要になる

## 📖 まとめ

Step Functions は、複数の AWS サービスにまたがる処理をコードではなく宣言的なステートマシンとして定義し、実行順序・エラーハンドリング・可視化をマネージドサービスに任せられる点が最大の特徴です。Lambda を中心としたアプリケーションロジックの実装には Lambda Durable Functions という選択肢も登場していますが、Step Functions は多数の AWS サービスをまたぐワークフロー全体のオーケストレーションに強みがあり、両者は用途に応じて使い分ける、あるいは組み合わせて使うことになります。
