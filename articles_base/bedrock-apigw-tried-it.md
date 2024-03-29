# Amazon Bedrock を利用した画像生成アプリケーションを AWS CDK で開発してみた！<!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

- [参考にしたサイト](#参考にしたサイト)
- [モデルの有効化](#モデルの有効化)
- [API Gateway + Lambda の REST API](#api-gateway--lambda-の-rest-api)
  - [ソースはこちら](#ソースはこちら)
  - [コードの解説](#コードの解説)
  - [実行](#実行)
- [まとめ](#まとめ)

## 参考にしたサイト

このサイトの内容を参考にして、AWS CDK で実装してみました。
[Amazon Bedrock を利用して、画像生成アプリケーションを開発してみた！ | builders.flash](https://aws.amazon.com/jp/builders-flash/202402/bedrock-image-generation/?awsf.filter-name=*all)

全体の構成は次のとおりです。

![overview](/images/bedrock/handson/overview.png)

参考にしたサイトでは、簡易的なフロントエンドを実装していますが、今回 CDK で実装するのは API Gateway までとしています。

## モデルの有効化

まずはモデルの有効化をします。

1. AWS コンソールにログインし、「Bedrock」を選択します。
2. バージニア北部リージョンに変更します。
   ※東京リージョンは、執筆時点（2024.3.29）で利用できる画像生成モデルがありません。
3. 左側メニューから「モデルアクセス＞モデルアクセスを管理」をクリックします。

   ![model-access](/images/bedrock/model-access.png)

4. Stability AI の SDXL1.0 にチェックを入れて「変更を保存」をクリックします。

   ![model-access](/images/bedrock/model-access-request.png)

   暫くすると、アクセスが付与されます。

   ![model-access](/images/bedrock/model-access-request_1.png)

   ![model-access](/images/bedrock/model-access-request_done.png)

## API Gateway + Lambda の REST API

### ソースはこちら

[aws-handson-apigw-bedrock | GitHub](https://github.com/ishiharatma/aws-handson-apigw-bedrock)

### コードの解説

- 画像保存用の S3 作成

```ts
// lib/aws-handson-apigw-bedrock-stack.ts
const resultS3Bucket = new s3.Bucket(this, "BedrockResultBucket", {
  bucketName: [props.pjName, props.envName, baseName, accountId].join("."),
  accessControl: s3.BucketAccessControl.PRIVATE,
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
  encryption: s3.BucketEncryption.KMS_MANAGED,
});
```

- Lambda の作成

`src/lambda/handson-bedrock` にあるソースをまるごとデプロイします。
環境変数で、結果を格納する S3 バケット名を渡しています。

```ts
const bedrockLambdaFunction = new lambda.Function(
  this,
  "bedrockLambdaFunction",
  {
    functionName: [props.pjName, props.envName, baseName].join("-"),
    code: lambda.Code.fromAsset(
      path.join(__dirname, `${srcLambdaDirBase}/handson-bedrock`)
    ),
    handler: "index.lambda_handler",
    runtime: lambda.Runtime.PYTHON_3_12,
    timeout: cdk.Duration.seconds(25),
    architecture: lambda.Architecture.ARM_64, //X86_64,
    environment: {
      S3_BUCKET_NAME: resultS3Bucket.bucketName,
      LOG_LEVEL: "INFO",
    },
    role: bedrockLambdaFunctionRole,
    //tracing: lambda.Tracing.ACTIVE,
  }
);
```

Lambda 内で実際に Bedrock へリクエストを行っている部分は下記です。

```python
# Amazon Bedrockで用意した基盤モデルへAPIリクエストし、画像を生成する
response = bedrock_runtime.invoke_model(
    body='{"text_prompts": [{"text":"'+input_text+'"}]}',
    contentType='application/json',
    accept='image/png',
    modelId='stability.stable-diffusion-xl-v1'
    )
```

- Rest API の作成

```ts
// lib/aws-handson-apigw-bedrock-stack.ts
const restApi = new apigw.RestApi(this, 'APIGateway', {
    restApiName: restApiName,
    policy: resourcePolicy,
    endpointTypes: [apigw.EndpointType.REGIONAL],
    :
    },
});
//API Gatewayにリクエスト先のリソースを追加
const restApiBedrock = restApi.root.addResource('bedrock');
restApiBedrock.addMethod(
  'POST',
  new apigw.LambdaIntegration(bedrockLambdaFunction)
);
```

### 実行

実行してみます。

```bat
curl -X POST https://xxxxx.execute-api.us-east-1.amazonaws.com/v1/bedrock ^
-H "Content-Type: application/json" -d "{\"input_text\":\"an image of cat\"}"
```

レスポンスに署名付き URL が返ってきますので、アクセスすると画像が生成されていました。

```text
{"presigned_url": "https://s3.amazonaws.com/xxxxxx"}
```

ただし、絵画っぽいです。

![result1](/images/bedrock/handson/result1-640.jpg)

参考にしたサイトではもっとリアルな猫になっています。

![handson-image](/images/bedrock/handson/flash-2402-bedrock10.2d877df45130bc33f0a20e192a3597ee2eea8b9c-640.jpg)

いろいろ調べていると、もう少し指示を増やした方が良いということが分かったので付け足してみます。
「with a photo-realistic」というのを最後に付け足します。

```bat
curl -X POST https://xxxxx.execute-api.us-east-1.amazonaws.com/v1/bedrock ^
-H "Content-Type: application/json" -d "{\"input_text\":\"an image of cat with a photo-realistic.\"}"
```

リアルな猫の画像が生成されました。

![result2](/images/bedrock/handson/result2-640.jpg)

## まとめ

参考にしたサイトでは、手作業で作成していますが、CDK を使うことで実際のシステム構築時に近いことを実習することができました。
ただ、Amazon Bedrock 自体に対する知識はまだまだ足りていないので、これからもっと勉強していろいろなことに挑戦しようと思います。
