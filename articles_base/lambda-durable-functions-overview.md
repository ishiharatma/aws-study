# AWS Lambda Durable Functions<!-- omit in toc -->

![icon](/images/icons/64/Arch_AWS-Lambda_64.png)

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

- [AWS Lambda Durable Functions とは](#aws-lambda-durable-functions-とは)
- [解決したい課題](#解決したい課題)
- [仕組み：チェックポイントとリプレイ](#仕組みチェックポイントとリプレイ)
- [決定論的リプレイという制約](#決定論的リプレイという制約)
- [主要な概念](#主要な概念)
  - [Step（ステップ）](#stepステップ)
  - [Wait（待機）とコールバック](#wait待機とコールバック)
  - [Parallel／Map（並列実行）](#parallelmap並列実行)
  - [Child Context（子コンテキスト）](#child-context子コンテキスト)
  - [Replay-safe Logging](#replay-safe-logging)
- [SDK と利用方法](#sdk-と利用方法)
- [対応ランタイムとリージョン](#対応ランタイムとリージョン)
- [料金](#料金)
- [Step Functions との違い・使い分け](#step-functions-との違い使い分け)
- [ユースケース](#ユースケース)
- [メリット](#メリット)
- [デメリット・注意点](#デメリット注意点)
- [📖 まとめ](#-まとめ)

## AWS Lambda Durable Functions とは

2025 年 12 月の re:Invent 2025 で発表された、Lambda 上で長時間・複数ステップにわたる耐久性のあるワークフローを、普通の逐次的なコードとして書けるようにする機能です。注文処理やユーザーオンボーディングのような多段階の業務フロー、あるいは複数回の LLM 呼び出しやツール実行を伴う AI エージェントのワークフローを、追加のオーケストレーションサービスを組まずに Lambda の開発体験の延長線上で実装できるようにすることを狙っています。

[AWS Lambda announces durable functions for multi-step applications and AI workflows](https://aws.amazon.com/about-aws/whats-new/2025/12/lambda-durable-multi-step-applications-ai-workflows/)

[Lambda durable functions（AWS Lambda Developer Guide）](https://docs.aws.amazon.com/lambda/latest/dg/durable-functions.html)

[AWS Durable Execution SDK Developer Guide](https://docs.aws.amazon.com/durable-execution/)

## 解決したい課題

従来、Lambda で長時間・複数ステップの処理を耐障害性を持たせて実装しようとすると、次のような選択肢がありました。

- AWS Step Functions でステートマシンを定義し、各ステップから Lambda を呼び出す
- DynamoDB などに自前で進捗状態を保存し、再試行やタイムアウトのハンドリングを自力で実装する

いずれも有効な方法ですが、前者は Step Functions の学習・設計（ASL によるステートマシン定義）が必要になり、後者は状態管理やエラーハンドリングのコードが複雑になりがちです。Durable Functions は、この中間にあたる「コードファーストで、Lambda のハンドラーを書く感覚のまま、長時間ワークフローの耐久性・再開性を得る」という選択肢を提供します。

## 仕組み：チェックポイントとリプレイ

Durable Functions のハンドラーは、実行中の一時停止・再起動のたびに、コードの先頭から再実行されます。ただし、すでに完了済みの操作（Step や Wait）については、実際に処理を再実行するのではなく、チェックポイントとして保存されている結果をそのまま使い、その部分を飛ばして進みます。これを「リプレイ」と呼びます。

つまり、最初の呼び出しでは各ステップが実際に実行されチェックポイントに結果が記録されますが、待機（wait）からの再開や、一時的な中断からの再開時には、コードは同じ経路を辿りながらも、完了済みのステップ部分は保存済みの結果を返すだけで瞬時にスキップされます。これにより、実行環境の再起動や長時間の待機を挟んでも、開発者が明示的に状態を永続化するコードを書かなくても処理を継続できます。

## 決定論的リプレイという制約

このリプレイの仕組みが正しく機能するためには、「Step や Wait などの耐久操作の外側にあるコードが、毎回同じ経路・同じ値を返す」という決定論性が必要です。ハンドラーの本体（Step でラップされていない部分）は、入力値とすでに完了した操作の結果だけから決まる、純粋な処理として書く必要があります。

具体的には、次のような非決定的な処理は、ハンドラー本体に直接書くのではなく、必ず Step の中に閉じ込める必要があります。

- 乱数生成、UUID の生成
- 現在時刻・タイムスタンプの取得
- 外部 API 呼び出しやデータベースへの問い合わせ
- ファイルシステムへのアクセスなど副作用のある処理

これらをハンドラー本体に直接書いてしまうと、リプレイのたびに異なる値が生成され、条件分岐の結果が初回実行時と食い違ってしまい、後続の Step が誤った入力で実行されてしまう可能性があります。Durable Functions を使う際は、このリプレイ安全性を意識したコーディングスタイルが必須になります。

[Determinism during replay（AWS Durable Execution SDK Developer Guide）](https://docs.aws.amazon.com/durable-execution/patterns/best-practices/determinism/)

## 主要な概念

### Step（ステップ）

再試行戦略と決定論的リプレイを備えた作業の実行単位です。初回実行時には実際の処理を行い、結果をチェックポイントとして記録します。リプレイ時には、記録済みの結果を即座に返します。

### Wait（待機）とコールバック

時間の経過や外部からのシグナル（コールバック）を待つための仕組みです。待機中は Lambda の実行環境を専有し続ける必要がなく、オンデマンド実行の場合は待機時間分の実行時間課金も発生しません。最大で 1 年程度の長期間の待機が可能とされています。

### Parallel／Map（並列実行）

複数の作業を並列に実行し、完了基準（すべて完了、いずれか完了など）を指定して結果を集約するための操作です。

### Child Context（子コンテキスト）

複雑なワークフローを、分離されたサブフロー（子コンテキスト）に分割して構造化するための仕組みです。

### Replay-safe Logging

`context.logger` を使うことで、リプレイによって同じログが重複して出力されるのを防ぎ、構造化されたログを一貫して出力できます。

## SDK と利用方法

Python 向けには `aws-durable-execution-sdk-python`、テスト用には `aws-durable-execution-sdk-python-testing` という 2 つのパッケージが提供されています（Node.js 向けの SDK も提供されています）。

```bash
pip install aws-durable-execution-sdk-python
```

基本的な使い方は、ハンドラーを `@durable_execution` で、個々の処理を `@durable_step` でデコレートするというものです。

```python
from aws_durable_execution_sdk_python import (
    DurableContext,
    StepContext,
    durable_execution,
    durable_step,
)
from aws_durable_execution_sdk_python.config import Duration


@durable_step
def validate_order(step_ctx: StepContext, order_id: str) -> dict:
    step_ctx.logger.info("Validating order", extra={"order_id": order_id})
    return {"order_id": order_id, "valid": True}


@durable_execution
def handler(event: dict, context: DurableContext) -> dict:
    order_id = event["order_id"]
    context.logger.info("Starting workflow", extra={"order_id": order_id})

    validation = context.step(validate_order(order_id), name="validate_order")
    if not validation["valid"]:
        return {"status": "rejected", "order_id": order_id}

    # 実際には wait_for_callback などで外部からの承認を待つ
    context.wait(duration=Duration.from_seconds(5), name="await_confirmation")

    return {"status": "approved", "order_id": order_id}
```

`context.step()` で Step を呼び出し、`context.wait()` で時間待機を行っている点がポイントです。ハンドラー本体はごく普通の逐次処理として読めますが、内部的にはリプレイによって耐久性が実現されています。

[aws/aws-durable-execution-sdk-python（GitHub）](https://github.com/aws/aws-durable-execution-sdk-python)

## 対応ランタイムとリージョン

発表当初（2025 年 12 月）は、米国東部（オハイオ）リージョンで、Python（3.13、3.14）と Node.js（22、24）ランタイムのみが対象でした。その後 2025 年 12 月に 14 リージョン、2026 年 4 月にさらに 16 リージョンが追加されるなど、対応リージョンは段階的に拡大しています。最新の対応状況は必ず AWS 公式ドキュメントで確認してください。

## 料金

Durable Functions の料金は、複数の要素の組み合わせで構成されます。

- 通常の Lambda コンピュート料金（リプレイに伴うサブ呼び出しの実行時間も含む）
- 耐久操作（Step の開始・完了、Wait の作成など）に対する課金（100 万回あたり数ドル程度のオーダー）
- 耐久操作が書き込むデータ量に応じた課金（GB 単位）
- 実行中および実行後のデータ保持に対する課金（GB-月単位、日割り）

Wait による待機中は、オンデマンド実行であれば、待機している間の実行時間課金は発生しません。正確な単価は変更される可能性があるため、必ず [AWS Lambda 料金ページ](https://aws.amazon.com/lambda/pricing/) を確認してください。

## Step Functions との違い・使い分け

どちらも「複数ステップにまたがる、耐久性のあるワークフロー」を実現する点は共通していますが、設計思想が異なります。

| 観点 | Lambda Durable Functions | AWS Step Functions |
| --- | --- | --- |
| 定義方法 | 通常のプログラミング言語のコード（コードファースト） | Amazon States Language（ASL）によるステートマシン定義（設定ファースト） |
| 主な守備範囲 | Lambda 内でのアプリケーションロジックの耐久化 | AWS の多数のサービスをまたぐワークフローオーケストレーション |
| 可視化 | ログと実行履歴が中心 | ビジュアルなワークフローグラフ |
| 得意なパターン | 「Lambda が Lambda を呼び、合間に待機を挟む」ような、コード中心のフロー | 「SQS を受けて DynamoDB に書き込み、ECS タスクを起動して完了を待ち、SNS で通知する」といった、多数のサービス連携をネイティブ統合で組みたい場合 |

実際には二者択一というより、Step Functions で複数サービスをまたぐ大きなワークフローを組み、その中の一部の Lambda 中心の処理を Durable Functions で実装する、といった併用も選択肢になります。

[Durable functions or Step Functions（AWS Lambda Developer Guide）](https://docs.aws.amazon.com/lambda/latest/dg/durable-step-functions.html)

## ユースケース

- E コマースの注文処理（在庫確認 → 決済 → 出荷指示 → 通知、といった多段階フロー）
- ユーザーオンボーディング（アカウント作成 → メール確認待ち → 初期設定 → ウェルカム通知）
- 承認フロー（人による承認を長時間待機し、コールバックで再開する）
- 複数回の LLM 呼び出しやツール実行を組み合わせる AI エージェントのワークフロー
- バッチ的な後続処理を伴う非同期処理で、失敗時の自動リトライと進捗の保持が欲しい場合

## メリット

- Step Functions のようなステートマシン定義を新たに学ばなくても、使い慣れた言語のコードのまま長時間ワークフローを実装できる
- チェックポイントと自動リトライにより、実行環境の再起動や一時的な障害からの復旧を自前で実装する必要がない
- 待機（Wait）中はコンピュート課金が発生しないため、長時間の待ち合わせを含むフローでもコストを抑えやすい
- Parallel／Map や Child Context など、複雑なワークフローを構造化するための部品が用意されている

## デメリット・注意点

- リプレイによる決定論性を維持するためのコーディング規約（非決定的な処理を必ず Step でラップする）を守る必要があり、既存コードをそのまま持ち込めるわけではない
- ビジュアルなワークフロー可視化がなく、実行状況の把握はログや実行履歴が中心になる
- 発表直後は対応リージョン・ランタイムが限定的で、順次拡大している段階
- 料金体系が「コンピュート課金＋耐久操作課金＋データ量課金＋保持課金」の複合になっており、Step Functions や通常の Lambda 単体に比べてコスト試算がやや複雑
- 数千規模の分岐を持つような大規模なステートマシンについては、深いリプレイチェーンになりやすく、Step Functions の方が効率的だとする指摘もある

## 📖 まとめ

Lambda Durable Functions は、「オーケストレーション専用サービスを別途組まずに、コードとして長時間・複数ステップのワークフローを書きたい」というニーズに応える機能です。チェックポイントとリプレイという仕組みにより耐久性を実現している分、非決定的な処理を Step に閉じ込めるといった作法を理解しておく必要があります。Step Functions を置き換えるものというより、ワークフローの性質（コード中心か、多数のサービス連携中心か）に応じて使い分ける、あるいは組み合わせて使う新しい選択肢と捉えるのが実態に近いといえます。
