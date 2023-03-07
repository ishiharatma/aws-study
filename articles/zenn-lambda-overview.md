---
title: "【初心者向け】AWS Lambda について改めて整理してみた" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: false
---

# AWS Lambda

## はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## Contents

- [AWS Lambda](#aws-lambda)
  - [はじめに](#はじめに)
  - [Contents](#contents)
  - [AWS Lambda とは](#aws-lambda-とは)
  - [ネットワーク](#ネットワーク)
  - [実行環境](#実行環境)
    - [コールドスタート問題](#コールドスタート問題)
    - [SnapStart for Java](#snapstart-for-java)
  - [命令セットアーキテクチャ](#命令セットアーキテクチャ)
  - [Lambda のアクセス権限](#lambda-のアクセス権限)
  - [トリガー](#トリガー)
    - [Pull モデル](#pull-モデル)
    - [Push モデル](#push-モデル)
  - [呼び出しタイプ](#呼び出しタイプ)
  - [対応ランタイム](#対応ランタイム)
  - [Layer](#layer)
  - [デプロイパッケージ](#デプロイパッケージ)
    - [コンソール](#コンソール)
    - [CloudFormation](#cloudformation)
    - [AWS CDK](#aws-cdk)
    - [AWS SAM](#aws-sam)
  - [エフェメラルストレージ(一時領域)](#エフェメラルストレージ一時領域)
  - [同時実行](#同時実行)
  - [Qualifier](#qualifier)
  - [関数 URL](#関数-url)
  - [モニタリング](#モニタリング)
  - [ベストプラクティス](#ベストプラクティス)
  - [クォータ](#クォータ)
  - [まとめ](#まとめ)

## AWS Lambda とは

Duration: 4:01:22

サーバーをプロビジョニングまたは管理せずにコードを実行できるようにするコンピューティングサービスです。FaaS(Function as a Service：ファース、エフアース)に分類されるサービスです。

【AWS Black Belt Online Seminar】[AWS Lambda Part1(YouTube)](https://www.youtube.com/watch?v=QvPgjEwgiew)(1:02:22)

![AWS Lambda Part1](/images/lambda/blackbelt-lambda-part1-320.jpg)

【AWS Black Belt Online Seminar】[AWS Lambda Part2(YouTube)](https://www.youtube.com/watch?v=96ku2x1NCaE)(1:01:17)

![AWS Lambda Part2](/images/lambda/blackbelt-lambda-part2-320.jpg)

【AWS Black Belt Online Seminar】[AWS Lambda Part3(YouTube)](https://www.youtube.com/watch?v=rMG18Fr896U)(1:01:15)

![AWS Lambda Part3](/images/lambda/blackbelt-lambda-part3-320.jpg)

【AWS Black Belt Online Seminar】[AWS Lambda Part4(YouTube)](https://www.youtube.com/watch?v=AOx5iNmxOC8)(56:28)

![AWS Lambda Part4](/images/lambda/blackbelt-lambda-part4-320.jpg)

[チュートリアル: Amazon S3 トリガーを使用して Lambda 関数を呼び出す](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/with-s3-example.html)
[チュートリアル: API Gateway で Lambda を使用する](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/services-apigateway-tutorial.html)
[チュートリアル: スケジュールされたイベントでの AWS Lambda の使用](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/services-cloudwatchevents-tutorial.html)

[AWS Lambda サービス概要](https://aws.amazon.com/jp/lambda/)

[AWS Lambda ドキュメント](https://docs.aws.amazon.com/ja_jp/lambda/?id=docs_gateway)

[AWS Lambda よくある質問](https://aws.amazon.com/jp/lambda/faqs/)

[AWS Lambda 料金](https://aws.amazon.com/jp/lambda/pricing/)

## ネットワーク

Duration: 0:01:00

Lambda は Lambda サービスが所有する VPC 内で実行されています。
![lambda-eni.png](/images/lambda/invoke-path-320.jpg)

Lambda を自 VPC に接続すると、Lambda サービスの VPC と自VPC を接続するために Hyperplane ENI(Elastic Network Interface)を作成し、関数に割り当てます。

![lambda-eni.png](/images/lambda/lambda-eni-320.jpg)

## 実行環境

Duration: 0:01:30

https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/lambda-runtime-environment.html

安全で分離されたランタイムを実行するための環境で、実行環境のライフサイクルは次のようになっています。

- 通常
  - INIT(初期化)  → INVOLE（呼び出し） → SHUTDOWN（シャットダウン）
- SnapStart を利用している場合
  - RESTORE(復元)  → INVOLE（呼び出し） → SHUTDOWN（シャットダウン）

### コールドスタート問題

生成された Lambda 関数インスタンスは、一定時間後に消失します。消失するまでの間は実行環境が再利用されることがありますが、そうでない場合は、初期化から開始します。

実行頻度が低い関数の実行時に毎回起動時間がかかってしまうことです。

- コンパイルが必要な言語で作成された関数は、コンパイル時間も毎回必要になります。
  - 「プロビジョニングされた同時実行」という機能がなかったときは、定期実行をして、コールドスタートの発生確率を下げる方法でした。
  - 「プロビジョニングされた同時実行」にすることで、予めプロビジョニングされた状態にできます。ただし、Lambda の特徴である「関数が実行された時間だけ」課金されるメリットが失われ、「プロビジョニングされていた時間」の課金となります。
- VPC Lambda は ENI の起動が必要になるため遅い。
  - ENI は作成までに 10秒以上かかることがある
  - 2019/09 以前は、関数ごとに ENI が作成されており、実行環境がスケールしてリクエストが増加するにつれて、多くの ENI が作成されるようになっていました。ENI 数に比例して サブネットに割り当てた IP アドレスを消費してしまいます。
  ![many-enis-1024x616-320.jpg](/images/lambda/many-enis-1024x616-320.jpg)
  - 現在は、事前に作成した 共通利用する ENI を利用して VPC に接続しているため ENI の作成に関する問題は解消されました。

### SnapStart for Java

https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/snapstart.html

https://aws.amazon.com/jp/blogs/news/reducing-java-cold-starts-on-aws-lambda-functions-with-snapstart/

Lambda の起動時のレイテンシー（主に、コールドスタート時間）の最大要因は関数の初期化です。
それを解消するために、関数のバージョンを発行するときに関数を初期化し、その実行環境（メモリとディスク状態）のスナップショットをキャッシュさせ、キャッシュさせたスナップショットから実行環境を再開することで起動時のレイテンシーが短縮される機能です。

SnapStart の使用に追加コストは発生しませんが、利用するには以下の制約があります。

- サポートしているのは、`Java 11` のみ
- エフェメラルストレージのサイズが512 MB 以下
- プロビジョニングされた同時実行ではない
- arm 64 アーキテクチャではない
- EFS を利用していない
- X-Ray を利用していない

## 命令セットアーキテクチャ

Duration: 0:00:30

https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/foundation-arch.html

- arm64 — AWS Graviton2 プロセッサ用の 64 ビット ARM アーキテクチャ
  - アームろくよん
  - x86_64アーキテクチャより34%のコスト効率よく利用できる
  - 実際のコストは 東京リージョンでは 20%ほど低い。
  - 利用できる場合は、こちらを選ぶ。
- x86_64 — x86 ベースプロセッサ用の 64 ビット x86 アーキテクチャ
  - エックスはちろく・ろくよん

それぞれの違いは、このあたりを参考に。
ARM と x86：その違い：https://www.redhat.com/ja/topics/linux/ARM-vs-x86

## Lambda のアクセス権限

Duration: 0:01:00

Lambda のアクセス権限には、IAM ロール（＝実行ロールと呼ばれます。ロールの中には、IAMポリシーが含まれます）とリソースベースのポリシーがあります。

実行ロールでは、Lambda 関数が他のリソースにアクセスできる権限や実行をまかせるための信頼ポリシーを記述するロールで、Lambda 関数を作成する際には必ず付与します。

リソースポリシーでは、どのサービスやアカウントが Lambda 関数を呼び出せるかを記述します。後述する Push モデルのトリガー（S3, CloudWatch など）を使用する場合に指定します。

[IAM ロールとリソースベースのポリシーとの相違点](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles_compare-resource-policies.html)

| Key          | IAM ポリシー            | リソースポリシー                                             |
| ------------ | ----------------------- | ------------------------------------------------------------ |
| Resource     | 適用対象のリソースのARN | 適用対象のリソースのARN                                      |
| Action   | オペレーション          | オペレーション                                               |
| Effect         | Allow or Deny           | Allow or Deny                                                |
| Principal | ×                       | 権限を受け取りたいエンティティ(サービス、アカウント、ユーザ) |

## トリガー

Duration: 0:01:30

Pull モデルと Push モデルがあります。

### Pull モデル

Pull モデルは、ポーリング型の実行です。Lambda の[イベントソースマッピング](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/invocation-eventsourcemapping.html)で指定されたイベントソースをポーリングして読み取りを行うものです。イベントが一度ストリームまたはキューに格納されるので、処理順序が保証されています。
以下のサービスとの連携が対象です。

- Amazon DynamoDB
- Amazon Kinesis
- Amazon MQ
- Amazon Managed Streaming for Apache Kafka (Amazon MSK)
- セルフマネージド Apache Kafka
- Amazon Simple Queue Service (Amazon SQS)

### Push モデル

Push モデルは、イベント駆動型の実行です。Lambda がイベントソースから直接呼び出されるものです。発生したイベントの実行順序は保証されていません。発生したイベントの順番に処理される場合もありますし、タイミングによっては前後する場合もあります。
イベントソースとなるサービスによって、Lmabda の呼び出しタイプ（同期、非同期）が決まっています。

主に以下のようなサービスがあります。

- Amazon S3（非同期）
- Amazon CloudWatch（非同期）
- Amazon SNS（非同期）
- Amazon Cognito（同期）
- Amazon API Gateway（同期）

## 呼び出しタイプ

Duration: 0:01:30

AWS SDK や CLI から実行する際に、`InvocationType` を指定することでコントロールできます。

- RequestResponse
  - デフォルト
  - 同期実行
  - 直接 Lambda を1回実行し、処理が完了したらレスポンスが返ってきます。
  
  ```sh
  aws lambda invoke --function-name hoge-function \
  --payload .... response.json

  # Response
  {
        "StatusCode": 202,
        "ExecutedVersion": "$LATEST",
        "FunctionError": "...."
  }
  ```

- Event
  - 非同期実行
  - Lambda の実行はキューイングされます。
  - キューイングされたタイミングでレスポンスが返ってきます。
  - 失敗した場合自動的に2回までリトライされます。
  - DLQ（デッドレターキュー）で、失敗した場合の設定が行えます。

  ```sh
  aws lambda invoke --function-name hoge-function \
  --invocation-type Event --payload .... response.json

  # Response
  {
        "StatusCode": 202
  }
  ```

- DryRun
  - 関数を実行しないで必要な権限が付いているか確認できます。

  ```sh
  aws lambda invoke --function-name hoge-function \
  --invocation-type DryRun --payload .... response.json

  # Response
  {
        "StatusCode": 204,
        "FunctionError": "...."
  }
  ```

## 対応ランタイム

Duration: 0:01:30

- Node.js
  - 18,16,14,12
  - 非推奨：12 (2023-3-31)
- Python
  - 3.9,3.8,3.7
- Java
  - 11,8
- .NET Code
  - 非推奨：3.1 (2023-4-3)
- .NET
  - 6,5
- Go
  - 1
- Ruby
  - 2.7
- カスタムランタイム

ランタイムの非推奨化は、２つのフェーズで発生します。

- フェーズ１
  - ランタイムに対するセキュリティパッチの更新停止
  - 既存関数は更新可能
  - 新規関数は作成不可
- フェーズ２
  - フェーズ１から少なくとも30日経過したものがフェーズ２になる
    - Python 3.6 の場合、非推奨フェーズ１（2022-7-18）→フェーズ２（2022-8-29）
  - 新規関数、既存関数ともに作成、更新不可
  - ただし、既存関数は継続して実行可能
  - サポートされているランタイムに移行が必要

サポート終了がスケジュールされている場合、60日以内なったら Eメールで通知が来るようになります。
また、Trusted Advisor では、[非推奨となる120日の前チェック](https://docs.aws.amazon.com/ja_jp/awssupport/latest/user/security-checks.html#aws-lambda-functions-deprecated-runtimes)が出来ます。

## Layer

Duration: 0:01:00

https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/configuration-layers.html

Lambda 関数で使用するライブラリとその他の依存関係をパッケージ化できる機能です。関数には最大で 5つのレイヤーを含めることができます。
レイヤーを使用することで、デプロイパッケージのサイズを削減し、デプロイスピードを速めることができます。

## デプロイパッケージ

Duration: 0:03:00

関数をデプロイするには、関数コードと依存関係を含む .zip ファイルまたは、[Open Container Initiative](https://opencontainers.org/) (OCI) の仕様に準拠したコンテナーイメージでデプロイできます。

Lambda 関数を作成するには、次の方法があります。

- コンソール上でコードを記述
- CloudFormation
- AWS CDK
- AWS SAM

### コンソール

https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/getting-started.html

![lambda-console](/images/lambda/lambda-console.png)

### CloudFormation

CLoudFormation で関数をデプロイするには、次の方法があります。

- S3 バケットにコードの .zip ファイルをアップロードする

  ```yaml
  Resources:
    Function1:
      Type: AWS::Lambda::Function
      Properties:
        Code:
          S3Bucket: !Ref S3Bucket
          S3Key: !Ref S3Key
        Environment:
  ```

- CloudFormation の YAML ファイルにインラインで記述する（コードの依存関係がない場合のみ）

  ```yaml
  Resources:
    Function2:
      Type: AWS::Lambda::Function
      Properties:
        Code:
          ZipFile: |
            import boto3
            import json
            import os
            
            def lambda_handler(event, context):
            :
  ```

- コンテナイメージから

  ```yaml
  Resources:
  Function3:
    Type: AWS::Lambda::Function
    Properties:
      Code:
        ImageUri: !Ref ImageUri
  ```

### AWS CDK

```ts
    const Function1 = new lambda.Function(
      this,
      'Function1',
      {
        functionName: "Function1",
        description: 'comment....',
        code: lambda.Code.fromAsset(
          path.join(__dirname, `${srcLambdaDirBase}/hello_world`)
        ),
        handler: 'index.lambda_handler',
        runtime: lambda.Runtime.PYTHON_3_9,
        timeout: cdk.Duration.seconds(300),
        architecture: lambda.Architecture.ARM_64,
        environment: {
          LOG_LEVEL: props.lambdaLogLevel ?? 'INFO',
          :
        },
        role: xxxx,
        tracing: lambda.Tracing.ACTIVE,
      }
    );
```

### AWS SAM

AWS Serverless Application Model (AWS SAM) でデプロイするには次のようにします。

```yaml
  Function1:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: hello_world/
      Handler: app.lambda_handler
      Runtime: python3.9
      Architectures:
        - arm64
```

## エフェメラルストレージ(一時領域)

Duration: 0:00:30

AWS Lambda で最大 10 GB のエフェメラルストレージをサポート可能に
https://aws.amazon.com/jp/blogs/news/aws-lambda-now-supports-up-to-10-gb-ephemeral-storage/

512 MB ～ 10 GB まで `/tmp` 領域を作成できます。

## 同時実行

Duration: 0:00:30

ある時点で実行されているリクエストの数のことです。
Lambda関数の同時実行数は同一アカウントの同一リージョン内につき、1,000に制限されています。
Lambdaの同時実行数の計測は以下のように考えます。

```text
同時実行=（1秒あたりの呼び出し数）x（平均実行時間（秒））
```

Lambda関数が平均10秒かかり、1秒あたり100個のイベントを発行するとLambda関数を1000同時に実行することになり、制限ぎりぎりとなります。

## Qualifier

Duration: 0:01:00

https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/configuration-aliases.html

![lambda-alias](/images/lambda/lambda-alias.png)

関数を呼び出す場合のバージョン（my-function:1）やエイリアス（my-function:BLUE）を指定できます。
エイリアス作成時に`Weighted alias (加重エイリアス)`を指定することで、リクエストの振り分けに重みをつけることができます。
ほとんどのトラフィックを既存バージョンに振り分けて一部のトラフィックを新しいバージョンに振り分けるといったことができます。これにより、新しいバージョンを展開するリスクを軽減できます。

![5-8-AWS-Lambda-function-versions-and-aliases-1024x637.png](/images/lambda/5-8-AWS-Lambda-function-versions-and-aliases-1024x637.png)

## 関数 URL

Duration: 0:01:00

https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/lambda-urls.html

![lambda-alias](/images/lambda/lambda-url.png)

関数を呼び出すための HTTPS エンドポイントが作成できます。

APIGateway を作成しなくても、HTTPS の URL を利用することができます。

```sh
https://<url-id>.lambda-url.<region>.on.aws
```

このエンドポイントには、IAM 認証も付けることができます。
IAM 認証を付けた場合は、`AWS Signature Version 4 (SigV4) `による署名が必要です。詳しくは下記ドキュメントを参照してください。
https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/urls-invocation.html

## モニタリング

Duration: 0:01:30

https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/lambda-monitoring.html

![monitoring-320.jpg](/images/lambda/monitoring-320.jpg)

監視するメトリクスとしては次のようなものがあります。

- Invocations
  このメトリクスは監視間隔として300秒(5分)若しくは60秒(1分)を設定してください。監視の際には、stasticsとして「Sum」を利用することを推奨します。
- Errors
  このメトリクスは監視間隔として300秒(5分)若しくは60秒(1分)を設定してください。監視の際には、stasticsとして「Sum」を利用することを推奨します。
- Throttles
  このメトリクスは監視間隔として300秒(5分)若しくは60秒(1分)を設定してください。監視の際には、stasticsとして「Sum」を利用することを推奨します。

その他、Lambda 関数のメモリをモニタリングするしたい場合は、次のドキュメントを参照します。
https://aws.amazon.com/jp/premiumsupport/knowledge-center/lambda-function-memory-usage-monitoring/

## ベストプラクティス

Duration: 0:01:00

https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/best-practices.html

主なベストプラクティスは次の通りです。

- Lambda ハンドラーをコアロジックから分離
  - `lambda_handler` の中にロジックを全て記述しないで、メソッド分割する。
  - 単体テストがしやすい、コードの可読性が向上する、など。
- ランタイムを必要最低限にしてサイズを小さく
  - 起動時間にも影響するので最小限に
- レイヤー使う
  - 共通化しよう
- 再帰呼び出しを行わない
  - 位置しない処理で料金が急増するリスクがあるため
- 環境変数を使う
  - ハードコーディングしない。
- 冪等性のコード
  - Lambda が重複して実行されることも考慮しておく。

## クォータ

Duration: 0:00:30

https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/gettingstarted-limits.html

主に、同時実行数を引き上げたいなど。

## まとめ

![lambda](/images/all/lambda.png)
