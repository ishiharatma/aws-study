# Amazon API Gateway

## ☘️ はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents

Duration: 00:01:00

- [Amazon API Gateway](#amazon-api-gateway)
  - [☘️ はじめに](#️-はじめに)
  - [👀 Contents](#-contents)
  - [Amazon API Gateway とは](#amazon-api-gateway-とは)
  - [API Gateway の種類](#api-gateway-の種類)
  - [API Gateway の料金](#api-gateway-の料金)
  - [OpenAPI を使用した REST API の設定](#openapi-を使用した-rest-api-の設定)
  - [Amazon API Gateway のクォータ](#amazon-api-gateway-のクォータ)
    - [HTTP API](#http-api)
    - [REST API](#rest-api)
    - [WebSocket API](#websocket-api)
  - [REST API のエンドポイントタイプ](#rest-api-のエンドポイントタイプ)
  - [API Gateway のメトリクス](#api-gateway-のメトリクス)
  - [X-Ray でのトレース](#x-ray-でのトレース)
  - [📖 まとめ](#-まとめ)

## Amazon API Gateway とは

Duration: 00:50:34

あらゆる規模の REST、HTTP、および WebSocket API を作成、公開、維持、モニタリング、およびセキュア化するための AWS のサービスです。
簡単にいうと、API の管理や実行を容易にしてくれる AWS のフルマネージドサービスです。

API のバージョン管理、レスポンスのモニタリング、認証などの機能が揃っているので、開発工数の大幅な削減が期待できます。

また、AWS Lambda と連携すれば、手軽にサーバーレスでの API が構築可能になります。

【AWS Black Belt Online Seminar】[Amazon API Gateway(YouTube)](https://www.youtube.com/watch?v=EpEETIox03s)(50:34)

![apigw_blackbelt](/images/apigw/apigw_blackbelt-320.jpg)

[Amazon API Gateway サービス概要](https://aws.amazon.com/jp/api-gateway/)

[Amazon API Gateway ドキュメント](https://docs.aws.amazon.com/ja_jp/apigateway/)

[Amazon API Gateway よくある質問](https://aws.amazon.com/jp/api-gateway/faqs/)

[Amazon API Gateway 料金](https://aws.amazon.com/jp/api-gateway/pricing/)

## API Gateway の種類

Duration: 00:01:00

- REST API
  - RESTful API を使用したい場合
- HTTP API
  - こちらも、RESTful API が構築できますが、REST API のほうが多くの機能をサポートしています。
  - HTTP API のほうは最小限の機能を低価格で利用することができます。
  - どちらを選択したらよいかは、ドキュメントの[REST API と HTTP API 間で選択する](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/http-api-vs-rest.html)を参照してください。
- WebSocket API
  - クライアントとサーバー間でステートフルな全二重通信を行いたい場合

## API Gateway の料金

Duration: 00:01:00

[Amazon API Gateway の料金](https://aws.amazon.com/jp/api-gateway/pricing/)

利用する API Gateway の種類で異なります。

HTTP API では API コール数、REST API では API コール数とキャッシュメモリサイズ、WebSocket API では メッセージ転送回数と接続時間で課金されます。

- 無料枠
  - 12 か月間無料枠
  - REST API コール受信数 100 万件 | HTTP API コール受信数 100 万件 | メッセージ数 100 万件 | 接続時間 750,000 分/月

## OpenAPI を使用した REST API の設定

Duration: 00:01:00

OpenAPI v2.0 および OpenAPI v3.0 定義ファイルをサポートしており、インポートすることで既存の API 定義をそのまま移行したり、新しい API を構築することができます。

[Swagger](https://swagger.io/) を利用して API の管理を行い、API Gateway にインポートすることもできます。

[OpenAPI を使用した REST API の設定](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/api-gateway-import-api.html)

## Amazon API Gateway のクォータ

Duration: 00:01:00

リクエストやレスポンスに影響する主なクォーターは次の通りです。

それ以外については、ドキュメントを参照してください。

[Amazon API Gateway のクォータと重要な注意点](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/limits.html)

### HTTP API

| 項目                                 | Quota         | 引き上げ |
| ------------------------------------ | ------------- | -------- |
| 最大統合タイムアウト                 | 30 秒         | いいえ   |
| リクエスト行とヘッダー値の合計サイズ | 10,240 バイト | いいえ   |
| ペイロードサイズ                     | 10 MB         | いいえ   |

### REST API

| 項目                           | Quota            | 引き上げ                 |
| ------------------------------ | ---------------- | ------------------------ |
| 統合のタイムアウト             | 50 ミリ秒〜29 秒 | 下限または上限には適用外 |
| すべてのヘッダー値の合計サイズ | 10,240 バイト    | いいえ                   |
| ペイロードサイズ               | 10 MB            | いいえ                   |

### WebSocket API

| 項目                         | Quota  | 引き上げ |
| ---------------------------- | ------ | -------- |
| WebSocket API の接続時間     | 2 時間 | いいえ   |
| アイドル接続のタイムアウト   | 10 分  | いいえ   |
| WebSocket のフレームサイズ   | 32 KB  | いいえ   |
| メッセージのペイロードサイズ | 128 KB | いいえ   |

## REST API のエンドポイントタイプ

REST API は、3 種類のエンドポイントタイプが選択できます。

![apigw_endpoint](/images/apigw/apigw_endpoint.png)

- エッジ最適化
  - CloudFront のエッジローケーションを経由して、最適なリージョンにルーティングされます。エッジロケーションからリージョンまでは AWS 内のネットワークが利用されるので高速です。
  - エッジロケーションは AWS が管理します。
    ![apigw_endpoint-1](/images/apigw/apigw_endpoint-1.png)
- リージョン
  - 直接リージョンにルーティングされます。同一リージョンの場合、エッジロケーションを経由しない分、レイテンシを削減できます。
  - デフォルトのエンドポイントタイプです。
  - 自前の CloudFront と組み合わせることでエッジ最適化の構成にすることもできます。既に CloudFront を利用しているシステムの場合にこのような構成になります。
    ![apigw_endpoint-2](/images/apigw/apigw_endpoint-2.png)
  - 自前の CloudFront を利用する場合は、API Gateway のエンドポイントを `リージョン` にしておきます。`エッジ最適化` を選択していると、自前の CloudFront から、AWS が管理する CloudFront を経由して、API Gateway にアクセスすることになり、不要なレイテンシが発生したり、HTTP ヘッダーが予期しない値となったりするので注意が必要です。CloudFront を経由すると一部のヘッダーを書き換えます。自前の CloudFront はこれを回避することができますが、AWS が管理する CloudFront は設定を行うことが出来ません。
    ![apigw_endpoint-3](/images/apigw/apigw_endpoint-3.png)
- プライベート
  - VPC 内から AWS PrivateLink でのみアクセスできるエンドポイントです。
    ![apigw_endpoint-4](/images/apigw/apigw_endpoint-4.png)

## API Gateway のメトリクス

Duration: 00:03:00

以下のメトリクスを監視することを検討してください。

- バックエンドの応答性
  - IntegrationLatency
    - API Gateway がバックエンドにリクエストを中継してから、レスポンスを受け取るまでの時間
- API コール全体の応答性
  - Latency
    - API Gateway がクライアントからリクエストを受け取ってから、クライアントにレスポンスを返すまでの時間で、API Gateway のオーバーヘッドと IntegrationLatency の合計です。
    - `Latency` = API Gateway のオーバーヘッド + `IntegrationLatency`
  - 監視の閾値は、たとえば、REST API の統合タイムアウトが 29 秒なので、これを事前に把握できるような余裕のある値にするというパターンもあります。
- API キャッシュが有効になっている場合
  - CacheHitCount
  - CacheMissCount
- エラーの把握
  - 4XXError
  - 5XXError
  - 上記メトリクスは、`Average` にすると、エラー率になります。つまり、期間内のエラー数を Count メトリクスで割ったものです。

その他、API Gateway の種類によって異なるメトリクスを取得できるので、必要に応じて監視を検討します。

[REST API のメトリクス](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/api-gateway-metrics-and-dimensions.html)
[HTTP API のメトリクス](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/http-api-metrics.html)
[WebSocket API のメトリクス](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/apigateway-websocket-api-logging.html)

## X-Ray でのトレース

Duration: 00:01:00

[X-Ray を使用した REST API へのユーザーリクエストのトレース](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/apigateway-xray.html)

「X-Ray トレースの有効化」とするだけで簡単に各サービスへの流れをトレースして可視化することができます。

[X-Ray のサービスマップの例](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/apigateway-using-xray-maps.html#apigateway-using-xray-maps-active)

![apigateway-xray-servicemap-2](/images/apigw/apigateway-xray-servicemap-2.png)

[X-Ray のトレースビューの例](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/apigateway-using-xray-maps.html#apigateway-using-xray-trace-view-active)

![apigateway-xray-traceview-1](/images/apigw/apigateway-xray-traceview-1.png)

## 📖 まとめ

Duration: 00:01:00

![apigateway](/images/all/apigateway.png)
