# AWS CDK

## ☘️ はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents

Duration: 00:01:00

- [AWS CDK](#aws-cdk)
  - [☘️ はじめに](#️-はじめに)
  - [👀 Contents](#-contents)
  - [xx とは](#xx-とは)
  - [xx の基本](#xx-の基本)

## AWS CDK とは

Duration: 2:31:03

AWS Cloud Development Kit のことで、使い慣れたプログラミング言語を使用してクラウドアプリケーションのリソースを定義するためのオープンソースのソフトウェア開発フレームワークです。

【AWS Black Belt Online Seminar】[AWS CDK の開発を効率化する機能 (Basic #3)(YouTube)](https://youtu.be/z3Mst77p-aU)(0:29:20)[PDF](https://pages.awscloud.com/rs/112-TZM-766/images/AWS-Black-Belt_2023_AWS-CDK-Basic-3-AppDev_0831_v1.pdf)

![xx](/images/blackbelt/)

【AWS Black Belt Online Seminar】[AWS CDK の基本的なコンポーネントと機能 (Basic #2)(YouTube)](https://youtu.be/aqa2bFFzcjs)(0:28:13)[PDF](https://pages.awscloud.com/rs/112-TZM-766/images/AWS-Black-Belt_2023_AWS-CDK-Basic-2-Features_0831_v1.pdf)

![xx](/images/blackbelt/)

【AWS Black Belt Online Seminar】[AWS CDK 概要 (Basic #1)(YouTube)](https://youtu.be/BmCpa44rAXI)(0:33:07)[PDF](https://pages.awscloud.com/rs/112-TZM-766/images/AWS-Black-Belt_2023_AWS-CDK-Basic-1-Overview_0731_v1.pdf)

![xx](/images/blackbelt/)

【AWS Black Belt Online Seminar】[AWS Cloud Development Kit (CDK)(YouTube)](https://youtu.be/1i7kWqpqtoY)(1:01:23)

![xx](/images/blackbelt/)


[AWS クラウド開発キット](https://aws.amazon.com/jp/cdk/)

[AWS CDK Reference Documentation](https://docs.aws.amazon.com/cdk/api/v2/)

[AWS CDK DEVELOPER GUIDE](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/home.html)

[AWS CDK API REFERENCE](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html)

[AWS Cloud Development Kit のよくある質問](https://aws.amazon.com/jp/cdk/faqs/)


## CDK v2

Duration: 0:01:30

CDK の v2 は、2021年 5月のプレビューが実施され、 2021年 12月 2日に GA されました。

AWS Cloud Development Kit v2 開発者プレビューのお知らせ
https://aws.amazon.com/jp/blogs/news/announcing-aws-cloud-development-kit-v2-developer-preview/

AWS Cloud Development Kit (AWS CDK) v2 の一般提供開始
https://aws.amazon.com/jp/about-aws/whats-new/2021/12/aws-cloud-development-kit-cdk-generally-available/

v2 ではConstruct ライブラリが aws-cdk-lib に単一化されたため、v1 で実施していた個々のパッケージインストールが不要になりました。

v1 では個別にパッケージをインストールする必要があったため、後からインストールしたパッケージはバージョンを指定しないとバージョンが異なってしまうことがあります。バージョンを合わせるために、「npm install @aws-cdk/aws-lambda@1.111.0」とする必要がありました。

```ts
npm install @aws-cdk/aws-lambda
npm install @aws-cdk/aws-cloudfront
npm install @aws-cdk/aws-iam
npm install @aws-cdk/aws-s3


import * as cdk from "@aws-cdk/core";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as s3 from "@aws-cdk/aws-s3";
import * as iam from "@aws-cdk/aws-iam";
```

v2 では単一のパッケージに統合されたため、個別パッケージをインストールすることなく使用できます。

```ts
npm install aws-cdk-lib

import {
  aws_s3 as s3,
  aws_iam as iam,
  aws_cloudfront as cloudfront,
from "aws-cdk-lib";
```

## 対応言語

- TypeScript
- JavaScript
- Python
- Java
- C#/.NET

## CDK ワークショップ

手を動かして学ぶことができます。

https://cdkworkshop.com/

## 構成要素

### App

CDK の最上位層で、複数のスタックの依存関係などを定義します。

### Stack

CloudFormation のスタックに対応します。AWSへのデプロイはこのスタック単位で行います。

### Construct

Stack 層に AWS リソースの定義を作成します。

Construct には3つの種類があります。

- L1 Construct(Low Level Construct)
- L2 Construct(High Level Construct)
- L3 Construct(Patterns)

#### L1 Construct / L2 Construct

L1 Construct とは、Low Level Construct のことです。CloudFormation の各リソースと 1:1 の関係になっています。

CloudFormation で定義するのと同じレベルでの記載になります。L2 Construct が存在するリソースは、L2 Construct を利用することを推奨しますが、要件に応じた細かい設定が必要な場合は、L1 Construct を利用します。

https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/constructs.html#constructs_l1_using

```ts
const bucket = new s3.CfnBucket(this, "MyBucket", {
  bucketName: "MyBucket"
});
```

L2 Construct とは、High Level Construct と呼ばれるもので、L1 Construct をラップした Construct です。

https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/constructs.html#constructs_using

```ts
import * as s3 from 'aws-cdk-lib/aws-s3';

const bucket = new s3.Bucket(this, 'MyBucket', {
  versioned: true
});
```

TypeScript を使用して、VPC を作る場合は下記のようにするだけで、VPC、ルートテーブル、インターネットゲートウェイ、NAT ゲートウェイ、サブネット 6つ（3種類 × maxAzs数分） の CloudFormation 定義を作成してくれます。CloudFormation で記述すると 430 行にもなる定義が 12 行だけで完了します。

cidrMask の数字だけ指定しているので、サブネットの CIDR ブロックは自動的に生成されます。CIDR ブロックを特定の値で指定したい場合は、L1 Construct を使用します。

```ts
const vpc = new ec2.Vpc(this, 'vpc', {
  vpcName: 'vpc',
  cidr: '10.0.0.0/16',
  natGateways: 2,
  natGatewaySubnets: {subnetType: ec2.SubnetType.PUBLIC},
  maxAzs: 2,
  subnetConfiguration: [
    {subnetType: ec2.SubnetType.PUBLIC, name:'public', cidrMask: 20},
    {subnetType: ec2.SubnetType.PRIVATE_WITH_NAT, name:'private', cidrMask: 19},
    {subnetType: ec2.SubnetType.PRIVATE_ISOLATED, name:'protected', cidrMask: 21},
  ],
});
```

この定義を実行した場合に生成される CloudFormation のコードは次の通りです。


![](images/cdk/vpc_cfn_00.png)
：
：
![](images/cdk/vpc_cfn_01.png)

#### Patterns

L3 Constructとして、ECS PatternsのようにECS関連のリソースを簡単に生成できるものがあります。

次のようにするだけで、ECSサービス、ALB、関連するセキュリティグループ、タスク用のIAMロールなど 200～300行の CloudFormation のコードを出力してくれます。

```ts
// クラスタを作成
const cluster = new ecs.Cluster(this, 'MyCluster', {
  vpc: props.vpc,
});

const loadBalancedFargateService =new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'MyFargateService',{
  cluster: cluster,
  cpu: 4096,
  memoryLimitMiB: 30720,
  publicLoadBalancer: true,
  desiredCount: 6,
  taskImageOptions:
  {
    image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  },
});
```

## Unit Test

Jest を使った Unit Test も実施できます。VPC の場合は、以下のようにして VPC やサブネットの数、ルートテーブルの状態などをテストすることができます。

ただ、"AWS::EC2::VPC" のように AWS のリソースを知っていないといけないので慣れないうちは手間取るかもしれません。

```ts
test('create the vpc', () => {
    // GIVEN
    const app = new App({
        context : {
            'PJName': 'junit',
            'EnvName': 'prod',
            'CidrBlock': '10.0.0.0/16',
        }
    });
    const stack = new VPCStack(app, 'testing-vpcstack', {});
    // WHEN
    const template = Template.fromStack(stack);

    // THEN
    // VPC
    template.resourceCountIs('AWS::EC2::VPC', 1);
    template.hasResourceProperties('AWS::EC2::VPC', {
        CidrBlock: '10.0.0.0/16',
    });

    // Subnet
    template.resourceCountIs('AWS::EC2::Subnet', 6);
    // Internet Gateway
    template.resourceCountIs('AWS::EC2::InternetGateway', 1);
    template.resourceCountIs('AWS::EC2::VPCGatewayAttachment', 1);
    template.hasResourceProperties('AWS::EC2::VPCGatewayAttachment', {
        VpcId: Match.anyValue(),
        InternetGatewayId: Match.anyValue()
    });
    // Elastic IP
    template.resourceCountIs('AWS::EC2::EIP', 2);
    // NatGateway
    template.resourceCountIs('AWS::EC2::NatGateway', 2);
    template.hasResourceProperties('AWS::EC2::NatGateway', {
        AllocationId: Match.anyValue(),
        SubnetId: Match.anyValue(),
    });
    template.hasResourceProperties('AWS::EC2::NatGateway', {
        AllocationId: Match.anyValue(),
        SubnetId: Match.anyValue(),
    });
    // Route Table
    template.resourceCountIs('AWS::EC2::RouteTable', 6);
    template.resourceCountIs('AWS::EC2::Route', 4);
    template.hasResourceProperties('AWS::EC2::Route', {
        RouteTableId: Match.anyValue(),
        DestinationCidrBlock: '0.0.0.0/0',
        GatewayId: Match.anyValue()
    });
    template.hasResourceProperties('AWS::EC2::Route', {
        RouteTableId: Match.anyValue(),
        DestinationCidrBlock: '0.0.0.0/0',
        NatGatewayId: Match.anyValue()
    });
    template.resourceCountIs('AWS::EC2::SubnetRouteTableAssociation', 6);
    template.hasResourceProperties('AWS::EC2::SubnetRouteTableAssociation', {
        RouteTableId: Match.anyValue(),
        SubnetId: Match.anyValue()
    });

});
```

テストを実行した結果は次のようになります。

![](images/cdk/jest.png)


## CDK のコマンド

- cdk deploy
  https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/cli.html#cli-deploy
  CDK で定義されたリソースを AWS 環境にデプロイするコマンドです。
  すべてのスタックをデプロイしたい場合は、```--all``` オプションを指定します。
  指定したスタックをデプロイしたい場合は、deploy の後にスタック名を指定します。
- cdk diff
  https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/cli.html#cli-diff
  現在の CDK とすでにデプロイされているバージョンとの差分を確認し、変更点を一覧で取得するコマンドです。
- cdk synth
  https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/cli.html#cli-synth
  CDK で定義されたスタックを CloudFormation テンプレートにするコマンドです。
  リソースに付与される Metadata を削除したい場合は、```--path-metadata false``` オプションを付与します。
  テンプレートは出力せずに、プログラム内に記述した console.log() だけ確認したい場合は、 ```--quit``` または ```-q``` オプションを付与します。
- cdk ls
  https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/cli.html#cli-list
  現在の CDK アプリに含まれるスタックの一覧を確認するコマンドです。

## CDK 作成時の Metadata を削除したい場合

cdk.json に ```"versionReporting": false,``` を追加します。

![](images/cdk/versionReporting.png)


