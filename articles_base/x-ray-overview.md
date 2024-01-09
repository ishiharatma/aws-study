# AWS X-Ray

## ☘️ はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents

- [AWS X-Ray](#aws-x-ray)
  - [☘️ はじめに](#️-はじめに)
  - [👀 Contents](#-contents)
  - [AWS X-Ray とは](#aws-x-ray-とは)
  - [AWS X-Ray の構造](#aws-x-ray-の構造)
    - [トレース](#トレース)
    - [セグメント](#セグメント)
    - [サブセグメント](#サブセグメント)
    - [トレースヘッダー](#トレースヘッダー)
    - [フィルタ式](#フィルタ式)
    - [注釈とメタデータ](#注釈とメタデータ)
  - [利用パターン](#利用パターン)
  - [サービスマップ](#サービスマップ)
  - [X-Ray API でのデータ送信と取得](#x-ray-api-でのデータ送信と取得)
  - [X-Ray Analytics](#x-ray-analytics)
  - [X-Ray Insights](#x-ray-insights)
  - [サンプリング](#サンプリング)

## AWS X-Ray とは

AWS X-Ray はアプリケーションが処理するリクエストに関するデータを収集するサービスです。 データを表示、フィルタリング、洞察を取得して問題の識別や最適化の機会を識別するために使用するツールを提供します。
Amazon EC2、Amazon ECS、AWS Lambda、AWS Elastic Beanstalk、API Gateway などで実行しているアプリケーションで使用できるデバッグツールです。

【AWS Black Belt Online Seminar】[AWS X-Ray(YouTube)](https://www.youtube.com/watch?v=oVVTS1NgWSQ)(54:47)

![blackbelt-xray](/images/xray/blackbelt-xray-320.jpg)

[AWS X-Ray サービス概要](https://aws.amazon.com/jp/xray/)

[AWS X-Ray ドキュメント](https://docs.aws.amazon.com/ja_jp/xray/?id=docs_gateway)

[AWS X-Ray よくある質問](https://aws.amazon.com/jp/xray/faqs/)

[AWS X-Ray 料金](https://aws.amazon.com/jp/xray/pricing/)

## AWS X-Ray の構造

Duration: 0:01:30

![xray-000](/images/xray/xray-000.png)

### トレース

１つの End-to-End のリクエストの単位で一意になるもの。`trace_id` で識別されます。

### セグメント

X-Ray の送信を行うサービス、X-Ray SDK、X-Ray デーモンを使用しているコンピューティングリソースから記録される情報です。

```json
{
  "name": "example.com",
  "id": "70de5b6f19ff9a0a",
  "start_time": 1.478293361271e9,
  "trace_id": "1-581cf771-a006649127e371903a2de979",
  "end_time": 1.478293361449e9
}
```

### サブセグメント

DynamoDB のような X-Ray の送信を直接行わないサービスは、呼び出し元 AWS サービスからのサブセグメントという形で呼び出しに関する情報が記録されます。

```json
  "subsegments" : [
    {
      "id"         : "53995c3f42cd8ad8",
      "name"       : "api.example.com",
      "start_time" : 1461096053.37769,
      "end_time"   : 1461096053.40379,
      "namespace"  : "remote",
      "http"       : {
        "request"  : {
          "url"    : "https://api.example.com/health",
          "method" : "POST",
          "traced" : true
        },
        "response" : {
          "status"         : 200,
          "content_length" : 861
        }
      }
    }
  ]
```

### トレースヘッダー

X-Ray SDK が、Ｈ TTP リクエスト に不要するヘッダー（X-Amzn-Trace-Id）です。

```text
X-Amzn-Trace-Id: Root=1-57…93;Parent=53…d8;Sampled=1

// Root: トレースID
// Parent: 親セグメントID
// Sampled: サンプリング対象かどうか
```

### フィルタ式

AWS X-Ray コンソールで、トレースデータを検索する際に使用するものです。

[フィルタ式の詳細](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-console-filters.html#xray-console-filters-details)

```text
//応答時間が 5 秒を超えたリクエストの場合は次のようにします。
responsetime > 5

// 総所要時間が 5〜8 秒のリクエスト
duration >= 5 AND duration <= 8

// Http.url に特定の文字列が含まれている
http.url CONTAINS "/api/game/"
```

### 注釈とメタデータ

「注釈（Annotations）」とは、フィルタ式で使用されるインデックス化されたキーと値のペアのことです。
AWS サービスによってセグメントに追加されていますが、独自の注釈も セグメントドキュメントに追加することで使用できます。
トレースごとに最大 50 のインデックスを保持します。

以下のように追加することができます。

```json
  "annotations": {
    "customer_category" : 124,
    "zip_code" : 98101,
    "country" : "United States",
    "internal" : false
  },
```

「メタデータ」とは、セグメントやカスタムセグメントに追加する情報で、デバッグや分析のための詳細情報など。インデックスは作成されないため、フィルタ式では使用できません。

```json
  "metadata": {
    "debug": {
      "test": "Metadata string from UserModel.saveUser"
    }
  },
```

## 利用パターン

- EC2
  - [Amazon EC2 での X-Ray デーモンの実行](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-daemon-ec2.html)
  - インスタンスプロファイルにトレースデータを X-Ray にアップロードするための IAM マネージドポリシー `AWSXRayDaemonWriteAccess` を付与します。
  - インスタンス起動時に X-Ray デーモンがインストールされるように、ユーザーデータにスクリプトを設定します。
- ECS
  - [Amazon ECS での X-Ray デーモンの実行](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-daemon-ecs.html)
  - サイドカーコンテナとして、動作させます。
  - ![xray-ecs](/images/xray/xray-ecs.png)
  - 専用のコンテナイメージも用意されています（amazon/aws-xray-daemon）
  - 通信できるように、UDP:2000 のポートをタスク定義ファイルでポートマッピングに設定します。
  - タスクロールに IAM マネージドポリシー `AWSXRayDaemonWriteAccess` を付与します。
  - VPC のプライベートサブネットで awsvpc ネットワークモードを使用する場合は、`AWS_XRAY_DAEMON_ADDRESS` の環境変数は省略できる。それ以外は、環境変数に `AWS_XRAY_DAEMON_ADDRESS: 2000` の追加が必要。⇒[Docker イメージの作成と構築](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-daemon-ecs.html#xray-daemon-ecs-build)
- Elastic Beanstalk
  - [Elastic Beanstalk X-Ray 統合を使用して X-Ray デーモンを実行する](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-daemon-beanstalk.html#xray-daemon-beanstalk-option)
  - 設定するには、コンソールで `X-Ray 統合をオン` にするか、`ソースコード` で有効化する必要があります。
  - ソースコードで指定する場合は、`.ebextensions/xray-daemon.config` に設定を追加し、`XRayEnabled: true` にします。
  - 手動でインストールする方法もあります。⇒[X-Ray デーモンを手動でダウンロードして実行する (高度)](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-daemon-beanstalk.html#xray-daemon-beanstalk-manual)
- Lambda
  - [AWS X-Ray を AWS Lambda と使用する](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/services-xray.html)
  - Lambda コンソールから、「X-Ray のアクティブトレース」をオンにします。
  - ![xray-lambda](/images/xray/xray-lambda.png)
  - コンソールでアクティブトレースを設定すると実行ロールに `AWSXRayDaemonWriteAccess` が追加されます。
  - ローカル環境で動作確認を行う場合は、環境変数に以下が必要です。実環境では設定されています。
    - \_X_AMZN_TRACE_ID
      - Root=1-5adffa5a-fff4d301c626fcc26d6336b5;Parent=0bba66737cd163b4;Sampled=0
    - AWS_XRAY_CONTEXT_MISSING
      - LOG_ERROR
    - AWS_XRAY_DAEMON_ADDRESS
      - 169.254.79.2:2000
- Amazon API Gateway
  - [Amazon API Gateway のアクティブトレーシングサポート AWS X-Ray](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-services-apigateway.html)
  - API Gateway コンソールから、対象ステージを選択し、ログ/トレースから、「X-Ray トレースを有効にする」にチェックを入れます。
  - ![xray-apigw](/images/xray/xray-apigw.png)
- その他 AWS サービスと統合されているもの
  - [AWS X-Ray と他の AWS のサービスの統合](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-services.html)
  - Amazon SNS
  - Elastic Load Balancing

## サービスマップ

[サービスマップの表示](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-console-servicemap.html)

X-Ray のトレースデータをビジュアルツールで可視化するもの。複雑な構造のアプリケーションを視覚的に表示することで、障害箇所を直感的に理解することができます。

## X-Ray API でのデータ送信と取得

送信には `PutTraceSegments` を使用します。
取得には、トレースの取得は `GetTraceSummaries` または `BatchGetTraces`、サービスグラフの取得には `GetServiceGraph` を使用します。

## X-Ray Analytics

## X-Ray Insights

## サンプリング
