# AWS CDK<!-- omit in toc -->

![icon](/images/icons/64/Arch_AWS-Cloud-Development-Kit_64.png)

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

- [1. AWS CDK とは](#1-aws-cdk-とは)
  - [1.1. 公式ドキュメント](#11-公式ドキュメント)
  - [1.2. 学習リソース](#12-学習リソース)
  - [1.3. ワークショップ](#13-ワークショップ)
  - [1.4. 導入のメリット](#14-導入のメリット)
    - [1. 型安全性によるエラー検出](#1-型安全性によるエラー検出)
    - [2. コード再利用による品質向上とコスト削減](#2-コード再利用による品質向上とコスト削減)
    - [3. 開発生産性の向上](#3-開発生産性の向上)
    - [4. インフラとアプリケーションコードの統合](#4-インフラとアプリケーションコードの統合)
    - [5. スケーリングとガバナンスの強化](#5-スケーリングとガバナンスの強化)
  - [1.5. CloudFormationとの違い](#15-cloudformationとの違い)
  - [補足：ボイラープレートコードについて](#補足ボイラープレートコードについて)
- [2. AWS CDKの基礎](#2-aws-cdkの基礎)
  - [2.1. AWS CDK の構成要素](#21-aws-cdk-の構成要素)
    - [2.1.1. App](#211-app)
    - [2.1.2. Stack(s)](#212-stacks)
    - [2.1.3. Construct](#213-construct)
      - [L1 Construct](#l1-construct)
      - [L2 Construct](#l2-construct)
      - [L3 Construct](#l3-construct)
  - [2.2. AWS CDK のコマンド](#22-aws-cdk-のコマンド)
    - [2.2.1. cdk init](#221-cdk-init)
    - [2.2.2. cdk bootstrap](#222-cdk-bootstrap)
    - [2.2.3. cdk deploy](#223-cdk-deploy)
    - [2.2.4. cdk diff](#224-cdk-diff)
    - [2.2.5. cdk synth](#225-cdk-synth)
    - [2.2.6. cdk destroy](#226-cdk-destroy)
    - [2.2.7. cdk list / cdk ls](#227-cdk-list--cdk-ls)
  - [2.3. CDKのバージョン](#23-cdkのバージョン)
    - [2.3.1. CDK v2](#231-cdk-v2)
    - [2.3.2.（2025/2/3追記）AWS CDK は AWS CDK CLI と CDK コンストラクトライブラリを分離](#232202523追記aws-cdk-は-aws-cdk-cli-と-cdk-コンストラクトライブラリを分離)
- [3. AWS CDK での開発方法](#3-aws-cdk-での開発方法)
  - [3.1. AWS CDK開発に必要なもの](#31-aws-cdk開発に必要なもの)
    - [3.1.1. 知識](#311-知識)
    - [3.1.2. 環境](#312-環境)
  - [3.2. 個人的AWS CDKのディレクトリ構造ベストプラクティス](#32-個人的aws-cdkのディレクトリ構造ベストプラクティス)
  - [3.3. スタックの分割方法](#33-スタックの分割方法)
    - [3.3.1. スタック分割で困ること](#331-スタック分割で困ること)
  - [3.4. Construct ID の命名規則](#34-construct-id-の命名規則)
    - [ルール①：Construct IDは`PascalCase`を推奨する](#ルールconstruct-idはpascalcaseを推奨する)
    - [ルール②：Construct IDは`シンプルな名称`とする](#ルールconstruct-idはシンプルな名称とする)
    - [ルール③：別のコンストラクタを呼び出す場合、`同じ意味`のConstruct IDを付与しない](#ルール別のコンストラクタを呼び出す場合同じ意味のconstruct-idを付与しない)
  - [3.x. Construct ID に関する余談](#3x-construct-id-に関する余談)
    - [3.x.1. Construct ID から論理IDにどのように変換されるか？](#3x1-construct-id-から論理idにどのように変換されるか)
- [4. AWS CDK のテスト方法](#4-aws-cdk-のテスト方法)
  - [4.1. Snapshot test](#41-snapshot-test)
  - [4.2. Unit Test(Fine-grained Assertions)](#42-unit-testfine-grained-assertions)
      - [記述例①：単純なリソース存在チェック](#記述例単純なリソース存在チェック)
      - [記述例②：属性値のチェック](#記述例属性値のチェック)
- [5. AWS CDK Tips](#5-aws-cdk-tips)
  - [5.1. App定義のTips](#51-app定義のtips)
    - [5.1.1. 共通するリソースを一括で付与したい](#511-共通するリソースを一括で付与したい)
    - [5.1.2. CDKコマンド実行時に動的なパラメータを渡したい](#512-cdkコマンド実行時に動的なパラメータを渡したい)
    - [5.1.3. パラメータで指定した環境識別子をチェックしたい](#513-パラメータで指定した環境識別子をチェックしたい)
    - [5.1.4. 本番環境（prod）リリース時に注意喚起してミスを防止策したい](#514-本番環境prodリリース時に注意喚起してミスを防止策したい)
    - [5.1.5. スタックの削除を防止したい](#515-スタックの削除を防止したい)
    - [5.1.6. リージョンの指定を変数化](#516-リージョンの指定を変数化)
    - [5.1.7. マルチリージョンへの一括デプロイ](#517-マルチリージョンへの一括デプロイ)
  - [5.2. AWS CDK Tips その他Tips](#52-aws-cdk-tips-その他tips)
    - [5.2.1. 環境識別子とプロファイル名の二重指定をやめる](#521-環境識別子とプロファイル名の二重指定をやめる)
    - [5.2.2. AWS CDK 作成時の Metadata を削除したい場合](#522-aws-cdk-作成時の-metadata-を削除したい場合)
- [6. cdk-nagによるセキュリティとコンプライアンスの強化](#6-cdk-nagによるセキュリティとコンプライアンスの強化)
  - [6.1. cdk-nagとは](#61-cdk-nagとは)
  - [6.2. 導入方法](#62-導入方法)
  - [6.3. 実装方法](#63-実装方法)
  - [6.4. Rules Pack](#64-rules-pack)
  - [6.5. エラーの抑止](#65-エラーの抑止)
  - [6.6. テスト実施方法](#66-テスト実施方法)
  - [6.7. 【発展】CDK-NAGへのカスタムルールの追加](#67-発展cdk-nagへのカスタムルールの追加)
- [📖 まとめ](#-まとめ)

## 1. AWS CDK とは

AWS Cloud Development Kit のことで、使い慣れたプログラミング言語を使用してクラウドアプリケーションのリソースを定義するためのオープンソースのソフトウェア開発フレームワークです。

AWS CDKを学習するためのリソースは次のとおりです。

### 1.1. 公式ドキュメント

AWS CDKを理解する公式ドキュメントは次のとおりです。

[AWS クラウド開発キット](https://aws.amazon.com/jp/cdk/)

[AWS CDK Reference Documentation](https://docs.aws.amazon.com/cdk/api/v2/)

[AWS CDK DEVELOPER GUIDE](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/home.html)

[AWS CDK API REFERENCE](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html)

[AWS Cloud Development Kit のよくある質問](https://aws.amazon.com/jp/cdk/faqs/)

### 1.2. 学習リソース

【AWS Black Belt Online Seminar】AWS CDK 概要 (Basic #1)[ | YouTube](https://youtu.be/BmCpa44rAXI)(0:33:07) | [PDF](https://pages.awscloud.com/rs/112-TZM-766/images/AWS-Black-Belt_2023_AWS-CDK-Basic-1-Overview_0731_v1.pdf)

![blackbelt-cdk-0](/images/blackbelt/blackbelt-cdk_1-320.jpg)

【AWS Black Belt Online Seminar】AWS CDK の基本的なコンポーネントと機能 (Basic #2) | [YouTube](https://youtu.be/aqa2bFFzcjs)(0:28:13) | [PDF](https://pages.awscloud.com/rs/112-TZM-766/images/AWS-Black-Belt_2023_AWS-CDK-Basic-2-Features_0831_v1.pdf)

![blackbelt-cdk-1](/images/blackbelt/blackbelt-cdk_2-320.jpg)

【AWS Black Belt Online Seminar】AWS CDK の開発を効率化する機能 (Basic #3) | [YouTube](https://youtu.be/z3Mst77p-aU)(0:29:20) | [PDF](https://pages.awscloud.com/rs/112-TZM-766/images/AWS-Black-Belt_2023_AWS-CDK-Basic-3-AppDev_0831_v1.pdf)

![blackbelt-cdk-2](/images/blackbelt/blackbelt-cdk_3-320.jpg)

【AWS Black Belt Online Seminar】AWS Cloud Development Kit (CDK) | [YouTube](https://youtu.be/1i7kWqpqtoY)(1:01:23)

![blackbelt-cdk-3](/images/blackbelt/blackbelt-cdk_4-320.jpg)

[初心者がおさえておきたいAWS CDKのベストプラクティス 2024| Speaker Deck](https://speakerdeck.com/konokenj/cdk-best-practice-2024)

[AWS CDKのあるあるお悩みに答えたい| Speaker Deck](https://speakerdeck.com/tmokmss/answering-cdk-faqs)

[AWS CDK における単体テストの使い所を学ぶ|builders.flash](https://aws.amazon.com/jp/builders-flash/202411/learn-cdk-unit-test/)

[AWS CDK におけるバリデーションの使い分け方を学ぶ|builders.flash](https://aws.amazon.com/jp/builders-flash/202406/cdk-validation/)

[AWS CDK でアプリと一緒にインフラをコードで操ろう !|builders.flash](https://aws.amazon.com/jp/builders-flash/202411/operate-infrastructure-with-cdk/)

### 1.3. ワークショップ

[AWS CDK Immersion Day Workshop](https://catalog.us-east-1.prod.workshops.aws/workshops/10141411-0192-4021-afa8-2436f3c66bd8/ja-JP)

[AWS CDK のローカル開発環境を作ろう！|builders.flash](https://aws.amazon.com/jp/builders-flash/202411/create-cdk-local-dev-environment/)

### 1.4. 導入のメリット

AWS CDKをプロジェクトに導入することで得られる主なメリットは以下の通りです。

#### 1. 型安全性によるエラー検出

TypeScriptやJavaなどの静的型付き言語を使用することで、CloudFormationでは実行時にしか検出できなかったパラメータミスを、コンパイル時に発見できます。
これは、大規模プロジェクトほどこの恩恵は大きくなります。

```ts
// With TypeScript, incorrectly typed parameters are caught during development
const bucket = new s3.Bucket(this, 'MyBucket', {
    versioned: true,
    // If you try to set an invalid property, TypeScript will flag it
    // invalidProperty: 'value' // This would cause a compilation error
});
```

#### 2. コード再利用による品質向上とコスト削減
カスタムConstructを作成することで、組織内のベストプラクティスを組み込んだコンポーネントの再利用が可能になります。
これにより、以下を実現できコスト削減と品質向上につながります。

- 個々のプロジェクト間でのインフラ設計の一貫性確保
- セキュリティ設計の標準化
- 変更が必要になった場合の一元管理


```ts
export class SecureS3Bucket extends Construct {
    public readonly bucket: s3.IBucket;
    
    constructor(scope: Construct, id: string, props?: s3.BucketProps) {
        super(scope, id);
        
        // Apply organization's security standards
        this.bucket = new s3.Bucket(this, 'Bucket', {
            ...props,
            encryption: s3.BucketEncryption.S3_MANAGED,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            enforceSSL: true,
            versioned: true
        });
    }
}
```

#### 3. 開発生産性の向上

AWS CDKは使い慣れたプログラミング言語を使用できます。サポートされている言語は、以下のとおりです。詳しくは[AWSドキュメント](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/languages.html)を参照してください。

- TypeScript
- JavaScript
- Python
- Java
- C#
- Go

これらのプログラミング言語を使用することで、CloudFormationでは難しかった次のような開発生産性の向上につながります。

- コードエディタのサポート（コード補完、リファクタリング）を活用できる
- 条件分岐、ループ、関数抽象化などのプログラミングの手法が使える
- 単体テスト、統合テストなどの既存テスト手法が適用できる

特に価値が高いのは、条件分岐によって環境による違いなどを簡単に実装できる点です。
ただし、過度なプログラミング機能への依存は複雑性を高め、保守性が低下します。適度な利用を心がけましょう。


```ts
// Easily implement environment-specific configurations
const isProd:boolean = app.node.tryGetContext('environment') === 'prod';

const bucket = new s3.Bucket(this, 'DataBucket', {
    versioned: true,
    lifecycleRules: isProd ? [
        {
            expiration: Duration.days(365),
            transitions: [
                {
                    storageClass: s3.StorageClass.INFREQUENT_ACCESS,
                    transitionAfter: Duration.days(30)
                },
                {
                    storageClass: s3.StorageClass.GLACIER,
                    transitionAfter: Duration.days(90)
                }
            ]
        }
    ] : undefined
});
```

#### 4. インフラとアプリケーションコードの統合

AWS CDKを使用すると、アプリケーションコードとインフラコードを同じリポジトリで管理することが可能になります。

- アプリケーションの変更に伴うインフラ変更を同一PR（Pull Request, プルリクエスト）で管理
- 環境変数やIAMポリシーなどの設定がアプリケーションコードと常に同期
- デプロイパイプラインの一元化

#### 5. スケーリングとガバナンスの強化

大規模な組織やプロジェクトにおいて、AWS CDKは以下の効果をもたらします。

- キャパシティ拡大: 同じパターンを複数環境や複数リージョンに素早く展開可能
- 標準化: 組織のベストプラクティスをコードとして強制
- コンプライアンス対応: セキュリティ要件を事前に組み込んだConstructを活用
- 継続的改善: プログラム的に既存インフラの監査や更新が可能

### 1.5. CloudFormationとの違い

AWSには、IaCを実現するツールとして、AWS CDKのほかにCloudFormationがあります。Black Beltでは次のような比較が説明されています。

![cdk-cfn](/images/cdk/cdk-cfn.jpg)

AWS CDKは、Appによって複数のスタックを一度にデプロイできるので作業効率が向上します。

また、CloudFormationとAWS CDKではコード記述面において、大きな違いがあります。

CloudFormationでは、次のような特徴があります。

- JSONやYAML形式のみで記述する必要がある
- すべての定義を明示的に記述していく必要がある
- 構成の複雑度に比例して、コード記述量が増大する
- コード量の増大に伴い、可読性が低下する

これに対して、AWS CDKでは、次のようなメリットがあります。

- TypeScriptなどのプログラミング言語が利用可能
- IDEなどでコード補完が利用可能
- CDKライブラリによる自動生成が利用できるため、コード記述量を最小限に抑えられる
- コメントやIDEの機能により、コード量が増大しても可読性への影響は限定的

例えば、下図のような2つのAZにサブネットとNATGateway1台を備えたVPCを構築する場合で、各実装方法を比較してみましょう。

![sample](/images/cdk/sample.png)

まず、JSONで記述した例は次のようになります。括弧などの構文の特性上、コードが非常に長くなり、人間が直感的に読み解くのは容易ではありません。

![sample-cfn-json](/images/cdk/sample-cfn-json.png)

次に、YAMLで記述した例です。JSONではコメントを記入できないため、実務ではYAML形式が多く採用されています。JSON形式よりは階層構造が視覚的に理解しやすくなりますが、それでも記述するコード量は多く、複雑なインフラ構成では管理が難しくなります。

![sample-cfn-yaml](/images/cdk/sample-cfn-yaml.png)

最後に、AWS CDKでTypeScriptを使って実装した例です。後述するL2コンストラクトを使用することで、ボイラープレートコードが自動生成され、開発者は本質的な設定のみに集中できます。そのため、このように少ないコード量で同等の機能を実装でき、可読性と保守性が大幅に向上します。

![sample-cdk-ts](/images/cdk/sample-cdk-ts.png)

### 補足：ボイラープレートコードについて

AWS CDKが大幅に削減できる「ボイラープレートコード」とは、プログラミングにおいて繰り返し記述される定型的なコードのことを指します。名前の由来は、かつての新聞業界で何度も再利用された金属製の印刷版（ボイラープレート）から来ています。

CloudFormationのJSONやYAML記述では、以下のようなボイラープレートコードが必要になります。

- リソースタイプの完全修飾名の記述
- 必須パラメータの明示的な宣言
- リソース間の関連付けを示す参照構文
- デフォルト値であっても必要な設定項目の記述
- リソース属性やタグの繰り返し定義

一方、AWS CDKでは、L2コンストラクトなどの高レベル抽象化により、これらのボイラープレートコードが自動生成されます。開発者は本質的な設定（VPCのCIDR範囲やサブネット数など）のみ記述するだけで、関連する標準的なリソースやその設定は自動的に生成されます。

このボイラープレートコードの削減は、単にコード量を減らすだけでなく、次のような効果をもたらします。

- 人為的なエラーの減少
- コード全体の可読性向上
- メンテナンス工数の削減
- 本質的なインフラ設計への集中

さきほど示した構成例でも、AWS CDKを使用した実装では、VPCとサブネットの本質的な設定のみに焦点を当て、その他の標準的な設定は自動生成されているため、コード量が大幅に削減されています。

## 2. AWS CDKの基礎

### 2.1. AWS CDK の構成要素

開発者ガイドの構成図から、主要構成要素は以下の３つです。

- App
- Stack(s)
- Construct

![AppStacks.png](/images/cdk/AppStacks.png)

引用：[開発者ガイド>CDK とは](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/home.html)

AWS CDKを使用してAWS環境にリソースをデプロイすると、最終的にはCloudFormationのスタックとして管理されます。

スタックについては、CloudFormationの[ドキュメント](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/cloudformation-overview.html#cfn-concepts-stacks)を参照してください。

#### 2.1.1. App

AWS CDK の最上位層で、複数のスタックの依存関係などを定義する部分です。複数のリージョンも管理することができます。

```ts
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

// Stackのインポート
import { Stack1 } from '../lib/stacks/stack1'
import { Stack2 } from '../lib/stacks/stack2'

const app = new cdk.App();

// デフォルトリージョン
const stack1 = new Stack1(app,'Stack1',{
  // ここにパラメータを指定
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  }
});

// 明示的に東京リージョンを指定
const stack2 = new Stack2(app,'Stack2',{
  // ここにパラメータを指定
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "ap-northeast-1",
  }
});
stack2.addDependency(stack1); // 依存関係

// バージニア北部リージョン
const stack3 = new Stack2(app,'Stack3',{
  // ここにパラメータを指定
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-east-1",
  }
});
stack3.addDependency(stack1); // 依存関係
```

#### 2.1.2. Stack(s)

CloudFormation のスタック１つに対応する部分です。Appから呼び出されて実行されます。

```ts
import { StackProps } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  aws_s3 as s3,
  aws_ec2 as ec2, 
  aws_iam as iam,
  aws_kms as kms,
} from 'aws-cdk-lib';

interface Stack1Props extends StackProps {
  readonly param1: string;
  readonly param2: string;
}

export class Stack1 extends cdk.Stack {
  constructor(scope: Construct, id: string, props: Stack1Props) {
    super(scope, id, props);

  }
}
``` 

#### 2.1.3. Construct

Stack 層に AWS リソースの定義を作成します。

Construct には 3 つの種類があります。L1→L3の順で抽象化のレベルが上がります。

- L1 Construct(Low Level Construct)
- L2 Construct(High Level Construct)
- L3 Construct(Patterns)

![cdk-construct](/images/cdk/cdk-construct.jpg)

引用：【AWS Black Belt Online Seminar】[AWS CDK 概要 (Basic #1)(YouTube)](https://youtu.be/BmCpa44rAXI)

##### L1 Construct

L1 Construct とは、Low Level Construct のことです。CloudFormation の各リソースと 1:1 の関係になっています。`Cfn`で始まるものが L1 です。

CloudFormation で定義するのと同じレベルでの記載になります。**L2 Construct が存在するリソースは、L2 Construct を利用することを推奨**しますが、要件に応じた細かい設定が必要な場合は、L1 Construct を利用します。

```ts
const bucket = new s3.CfnBucket(this, "MyBucket", {
  bucketName: "MyBucket",
});
```

##### L2 Construct

L2 Construct とは、High Level Construct と呼ばれるもので、L1 Construct をラップした Construct です。
AWSリソースを作成するのに必要な要素が未指定だった場合に自動的に生成してくれるのが最大のメリットです。これによって、記述するコード量を削減することができます。

L1 ConstructでS3バケットを作成する場合、バケット名は必須ですが、L2 Constructでは未指定の場合は自動生成されるので、バケット名すら省略することが可能です。

```ts
import * as s3 from "aws-cdk-lib/aws-s3";

const bucket = new s3.Bucket(this, "MyBucket", {
  versioned: true,
});
```

##### L3 Construct

L3 Construct として、ECS Patterns のように ECS 関連のリソースを簡単に生成できるものがあります。

次のようにするだけで、ECS サービス、ALB、関連するセキュリティグループ、タスク用の IAM ロールなど 200 ～ 300 行の CloudFormation のコードを出力してくれます。
要件が合致すれば非常に簡単に環境構築が行えますが、カスタマイズが行いにくいという特徴があります。公式で提供されているL3 Constructも数が少ないことから、基本的にはL2 Constructを使用して構築することになります。

```ts
// クラスタを作成
const cluster = new ecs.Cluster(this, "MyCluster", {
  vpc: props.vpc,
});

const loadBalancedFargateService =
  new ecs_patterns.ApplicationLoadBalancedFargateService(
    this,
    "MyFargateService",
    {
      cluster: cluster,
      cpu: 4096,
      memoryLimitMiB: 30720,
      publicLoadBalancer: true,
      desiredCount: 6,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      },
    }
  );
```

### 2.2. AWS CDK のコマンド

AWS CDKで使用する主なコマンドについて説明します。
ここで説明していないコマンドなど、詳細は[ドキュメント](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/ref-cli-cmd.html)を参照してください。

#### 2.2.1. [cdk init](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/ref-cli-cmd-init.html)

AWS CDKでコードを作成する前に、実行するコマンドです。コマンドを実行したカレントディレクトリ内で、必要なファイルをセットアップします。
languageには、[csharp|fsharp|go|java|javascript|python|typescript]のいずれかを指定します。

以下は、TypeScriptを使用する場合の例です。

```sh
cdk init app --language typescript
```

#### 2.2.2. [cdk bootstrap](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/ref-cli-cmd-bootstrap.html)

AWSアカウントで初めてAWS CDKを利用する際に実行します。実行するとリージョンごとに`CDKToolkit`というCloudFormationのスタックが作成され、AWS CDKを利用するのに必要なリソースが作成されます。

```sh
cdk bootstrap
```

作成されるリソースは記事作成時点では、下記11種類となっています。

- CdkBootstrapVersion：BootStrapのバージョンを管理するSSMパラメータストアです。定期的にバージョンアップがあるため、バージョンのチェックに利用されます。
- DeploymentActionRole：デプロイ時にCloudFormatioスタックを操作するためのIAMロールです
- CloudFormationExecutionRole：`AdministratorAccess`が付与されたロールで、`cdk deploy`で作成されるスタック実行時に使用されます。
- LookupRole：既存リソースを参照する`fromLookup()`などの実行に必要なロールです
- ContainerAssetsRepository：ECRリポジトリです
- ImagePublishingRole：ECRリポジトリにコンテナイメージをプッシュするためのIAMロールです
- ImagePublishingRoleDefaultPolicy：上記IAMロールのポリシーです
- StagingBucket：`cdk deploy`時にCloudFormationテンプレートやLambdaソースのzipファイルなどをアップロードするためのS3バケットです
- StagingBucketPolicy：上記バケットポリシーです
- FilePublishingRole：S3バケットにアーティファクトをアップロードするためのIAMロールです
- FilePublishingRoleDefaultPolicy：上記IAMロールのポリシーです

#### 2.2.3. [cdk deploy](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/cli.html#cli-deploy)

AWS CDK で定義されたリソースを AWS 環境にデプロイするコマンドです。すべてのスタックをデプロイしたい場合は、`--all` オプションを指定します。

```sh
cdk deploy --all
```

指定したスタックをデプロイしたい場合は、deploy の後にスタック名を指定します。

```sh
cdk deploy Stack1 Stack2
```

#### 2.2.4. [cdk diff](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/cli.html#cli-diff)

現在の AWS CDK とすでにデプロイされているバージョンとの差分を確認し、変更点を一覧で取得するコマンドです。
`deploy`と同じように、すべてのスタックの場合は`--all`、特定のスタックの場合はスタック名を指定します。

```sh
cdk diff --all
or
cdk diff  Stack1 Stack2
```

#### 2.2.5. [cdk synth](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/cli.html#cli-synth)

AWS CDK で定義されたスタックを CloudFormation テンプレートにするコマンドです。
リソースに付与される Metadata を削除したい場合は、`--path-metadata false` オプションを付与します。
テンプレートは出力せずに、プログラム内に記述した console.log() だけ確認したい場合は、 `--quit` または `-q` オプションを付与します。

```sh
cdk synth
or
cdk synth --version-reporting false --path-metadata false --asset-metadata false
or
cdk synth -q
```

#### 2.2.6. [cdk destroy](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/ref-cli-cmd-destroy.html)

スタックを削除する場合に利用するコマンドです。
`deploy`と同じように、すべてのスタックの場合は`--all`、特定のスタックの場合はスタック名を指定します。
依存関係のエラーなどを無視して強制的に削除する場合は、`--force`を指定します。

```sh
cdk destroy --all
or
cdk destroy  Stack1 Stack2
```

#### 2.2.7. [cdk list / cdk ls](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/cli.html#cli-list)

現在の AWS CDK アプリに含まれるスタックの一覧を確認するコマンドです。

```sh
cdk list
or
cdk ls
```

### 2.3. CDKのバージョン

#### 2.3.1. CDK v2

![cdk-v2](/images/cdk/cdk-v2.jpg)

現在のAWS CDKのバージョンは、`v2`となっています。v2は、2021年5月のプレビューが実施され、2021年12月2日にGAされました。

AWS Cloud Development Kit v2 開発者プレビューのお知らせ
https://aws.amazon.com/jp/blogs/news/announcing-aws-cloud-development-kit-v2-developer-preview/

AWS Cloud Development Kit (AWS CDK) v2 の一般提供開始
https://aws.amazon.com/jp/about-aws/whats-new/2021/12/aws-cloud-development-kit-cdk-generally-available/

v2sではConstructライブラリが`aws-cdk-lib`に単一化されたため、v1で実施していた個々のパッケージインストールが不要になりました。

v1では個別にパッケージをインストールする必要があったため、後からインストールしたパッケージはバージョンを指定しないとバージョンが異なってしまうことがあります。バージョンを合わせるために、「npm install @aws-cdk/aws-lambda@1.111.0」とする必要がありました。

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

#### 2.3.2.（2025/2/3追記）AWS CDK は AWS CDK CLI と CDK コンストラクトライブラリを分離

[AWS CDK は AWS CDK CLI と CDK コンストラクトライブラリを分離します](https://aws.amazon.com/jp/blogs/news/aws-cdk-is-splitting-construct-library-and-cli/)

AWS CDK CLI と CDK コンストラクトライブラリの分離で以下の影響があります：

1. バージョン番号の不一致: aws-cdkとaws-cdk-libで異なるバージョン番号体系に
  - `aws-cdk`のバージョンが`2.174.0`の次から、`2.1000.0`になります。
2. 依存関係管理の変更: package.jsonでの指定方法が変更

具体的な対応方法としては、以下のようにpackage.jsonを更新します。

以前の指定方法：

```json
  "devDependencies": {
    "aws-cdk": "2.174.0",
    :
  },
  "dependencies": {
    "aws-cdk-lib": "2.174.0",
    :
  }
```

これからの指定方法：

```json
  "devDependencies": {
    "aws-cdk": "2.1000.0", // CLIは2.1000.0から始まる新しい体系
    :
  },
  "dependencies": {
    "aws-cdk-lib": "2.180.0",  // コンストラクトライブラリは従来のバージョン体系を継続
    :
  }
```

この分離による影響を最小化するには、以下のプラクティスを推奨します。

1. CI/CD環境では特定のバージョンに固定する
2. 依存関係を正確に管理する
3. peerDependenciesを使用して依存関係を管理する

## 3. AWS CDK での開発方法

![cdk-dev-flow](/images/cdk/cdk-dev-flow.jpg)

AWS CDKで開発する順序は次のとおりです。

- 対象のディレクトリで`cdk init`を実行
- app定義を編集
- stack定義を作成
- テストコードを作成
- 初回：
  - `cdk bootstrap`を実行
  - `cdk deploy`を実行
- 2回目以降：
  - （任意）`cdk diff`を実行して差分チェック
  - `cdk deploy`を実行（ここでも差分チェックできます）

### 3.1. AWS CDK開発に必要なもの

#### 3.1.1. 知識

知識としてあったほうがいいものは次のとおりです。

- AWSリソース全般に対する基礎知識。認定試験「[AWS Certified Solutions Architect - Associate](https://aws.amazon.com/jp/certification/certified-solutions-architect-associate/)」以上が望ましい
- CloudFormationテンプレートを使った環境構築経験
- プログラミング開発経験

#### 3.1.2. 環境

最低限必要なものは次のとおりです。

- AWS CLI v2
- Node.js
- テキストエディタ

できれば用意したほうがいいものは次のとおりです。

- Git
- IDE
  - テキストエディタより、VS CodeなどのIDEを使うほうが開発生産性が向上します

### 3.2. 個人的AWS CDKのディレクトリ構造ベストプラクティス

`cdk init --typescript` を実行すると初期ディレクトリが作成されます。
通常は、[lib] ディレクトリにスタックの構成ファイルを配置します。

しかし、共通で利用したいものなどが出てきたときに分かりにくくなります。

そこで、個人的なディレクトリ構造ベストプラクティスはこのようだと考えます。'★' が付いているディレクトリは標準作成以外で追加したディレクトリです。

ポイントは次のとおりです。

- 環境ごとの動的設定を`cdk.json`ではなく、`parameters`というディレクトリで管理
- スタック定義を明示的に、`stacks`ディレクトリに配置
- 共通利用や、スタック定義から呼び出されるものを`utils`や`resources`に分離
- Lambdaなどのソースを`src`ディレクトリに配置

```text
プロジェクトルートディレクトリ
    ├─ [bin]                   // App定義。複数のスタックの依存関係などを定義
    ├─ [lib]
        ├─ ★[stacks]           // スタック定義
        ├─ ★[resources]        // 各リソースごとの定義。スタックから呼ばれる
        ├─ ★[utils]            // 共通使用するものを格納
    ├─ ★[parameters]           // 環境依存情報ファイルを格納（※contextを使わない）
    ├─ ★[src]                  // Lambda や HTML などのソースを格納
    ├─ [test]                  // テスト
        ├─ xxxxx.test.ts           // スナップショットテスト
        ├─ xxxxx-cdk-nag.test.ts   // CDK-NAG
        ├─ xxxxx-unittest.test.ts  // Unit Test
    ├─ [node_modules]
    ├─ cdk.context.json        // 環境依存情報(context)
    ├─ cdk.json                // デフォルトのappなどが入る
    ├─ cdk.out                 // cfnなどの出力先。コンパイルされたjsを動かすと出力される
    ├─ jest.config.js          // テストの設定ファイル
    ├─ package-lock.json
    ├─ package.json
    ├─ tsconfig.json
    ├─ README.md
```

### 3.3. スタックの分割方法

「アプリケーションのライフサイクルが異なる」などの理由でスタックを分割することがあると思います。
分割したスタックが互いに依存していない場合は、積極的に分割することになんの問題もありませんが、スタック間でリソースの参照が発生する場合には、注意が必要です。依存している場合は、スタック分割を最小限にとどめるということを検討してください。

AWS CDKでは以下のような特別な理由を除き、**単一のスタックで構築する**のがよいと考えます。

- 影響範囲を分離したい
  - 例：あるサービスを削除してもストレージ（監査ログなどの利用）だけは残す可能性がある
- １つのスタックで管理できる制限を超える
  - 参照：[CloudFormationのクオータ](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/cloudformation-limits.html)

#### 3.3.1. スタック分割で困ること

スタックを分割することで困ることの１つにスタック間でリソースを参照しているケースが挙げられます。
このスタック間の参照のことを「[クロススタック参照](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/walkthrough-crossstackref.html)」といい、CloudFormationでも利用可能で大変便利な機能です。

しかし、参照元（親）と参照先（子）の依存関係を強めてしまい、親側でリソースを更新や削除をしたくでも、子側で参照していると更新や削除を実施できない。といったことが発生します。
このような「デッドロック」状態を解決する方法はありますが、運用が複雑化します。
このリスクを回避するため、スタック分割は慎重に検討する必要があります。

「[CDK tips, part 3 – how to unblock cross-stack references](https://www.endoflineblog.com/cdk-tips-03-how-to-unblock-cross-stack-references)」という記事に具体的な方法が解説されていますが、複雑な手順です。

スタック分割については、以下のドキュメントを参照するとよいでしょう。

[参考：AWS CloudFormationユーザーガイド>ライフサイクルと所有権によるスタックの整理](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/best-practices.html#organizingstacks)

### 3.4. Construct ID の命名規則

Construct ID とは、以下のように第二引数で指定する文字列のことをいいます。この文字列はコンストラクトのスコープ内で一意である必要があります。

```ts
export class Stack1 extends cdk.Stack {
  constructor(scope: Construct, id: string, props: Stack1Props) {
    super(scope, id, props);

    const bucket1 = new s3.Bucket(this, "MyBucket", {});
    // bucket2で指定した"MyBucket"はすでに使用済みなのでエラーになります。
    const bucket2 = new s3.Bucket(this, "MyBucket", {});

  }
}
```

⚠Construct ID は、CloudFormationのテンプレートに変換後の[論理ID（論理名）](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/resources-section-structure.html#resources-section-logical-id)の一部として利用されます。

#### ルール①：Construct IDは`PascalCase`を推奨する

まず、AWS CDKが論理IDを生成する過程で、`[A-Za-z0-9]`以外除去されます。そのため、指定しても無駄になってしまいます。

参考： [aws-cdk/packages/aws-cdk-lib/core/lib/private/uniqueid.ts >removeNonAlphanumeric](https://github.com/aws/aws-cdk/blob/4b00ffeb86b3ebb9a0190c2842bd36ebb4043f52/packages/aws-cdk-lib/core/lib/private/uniqueid.ts#L86)

実際は、`PascalCase`でなくても問題ありませんが、AWS CloudFormationのユーザーガイドのサンプルでは論理IDが`PascalCase`で記載されていますので合わせるのがよいでしょう。

#### ルール②：Construct IDは`シンプルな名称`とする

長すぎると理解しにくくなりますので、できるだけシンプルな名称にすることを心がけます。
また、AWS CDKでは240文字で切り捨てられるようになっていますので、CloudFormationテンプレートになったときに意味が欠落します。

参考： [aws-cdk/packages/aws-cdk-lib/core/lib/private/uniqueid.ts >makeUniqueId](https://github.com/aws/aws-cdk/blob/4b00ffeb86b3ebb9a0190c2842bd36ebb4043f52/packages/aws-cdk-lib/core/lib/private/uniqueid.ts#L32)

#### ルール③：別のコンストラクタを呼び出す場合、`同じ意味`のConstruct IDを付与しない

![construct-tree](/images/cdk/construct-tree.jpg)

単一のコンストラクタで処理が完結せず、共通定義された別のコンストラクタを呼び出すような場合は注意が必要です。
Construct IDは親＋子というように連結されていきます。

例えばこのような呼び出しを行っていた場合です。

呼び出し元で指定したConstruct ID「MyBucket」＋呼び出し先で指定したConstruct ID「S3Bucket」が連結されて、「MyBucketS3Bucket9C4D8843」という論理IDが生成されます。
「Bucket」部分が重複して、可読性が低下します。

```ts
import { BucketConstruct } from '../lib/bucket';

export class Stack1 extends cdk.Stack {
  constructor(scope: Construct, id: string, props: Stack1Props) {
    super(scope, id, props);

    const myBucket = new BucketConstruct(this,'MyBucket',{
      :
    });
  }
}

// 呼び出し先
export class BucketConstruct extends Construct {
  public readonly bucket: s3.IBucket;
  constructor(scope: Construct, id: string, props: S3BucketProps) {
    this.bucket =  new s3.Bucket(this, 'S3Bucket', {
      :
    }
  }
}
```

### 3.x. Construct ID に関する余談

#### 3.x.1. Construct ID から論理IDにどのように変換されるか？

Construct IDと論理IDは完全一致するものではなく、Construct IDから論理IDに変換されるとハッシュ値が付与されます。

例えば次のようにS3バケットを作成した場合には、論理IDが「LogsBucket9C4D8843」となっています。

```ts
const logBucket = new s3.Bucket(this, 'LogsBucket', {});
```

```json
"Resources": {
  "LogsBucket9C4D8843": {
   "Type": "AWS::S3::Bucket",
   "Properties": {
    :
   }
  }
}
```

Construct IDから論理IDへの変換ロジックが気になる人は、以下のコードを読むとよいでしょう。

[aws-cdk/packages/aws-cdk-lib/core/lib/stack.ts > allocateLogicalId](https://github.com/aws/aws-cdk/blob/4b00ffeb86b3ebb9a0190c2842bd36ebb4043f52/packages/aws-cdk-lib/core/lib/stack.ts#L1357)

![Stack.allocateLogicalId](/images/cdk/stack-allocateLogicalId.jpg)

## 4. AWS CDK のテスト方法

ここでは、AWS CDKのテスト方法を説明します。

- Snapshot test
- Unit Test(Fine-grained Assertions)

### 4.1. Snapshot test

前回生成された CloudFormation テンプレートと比較して差分をチェックする[スナップショットテスト](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/testing.html#testing_snapshot)が実施できます。
スナップショットテストを行うことで、意図しないテンプレートへの変更があるかどうかを検知できます。

例えば以下のようなケースで効果を発揮します。

- AWS CDKのバージョンアップによる差分チェック
- リファクタリング前後の差分チェック

具体的なスナップショットテストの記述方法は次のとおりです。

```ts
test('snapshot validation test',() =>{
    const stack = new MyTestStack(app, 'MyTest', {
        pjName: projectName,
        envName: envName,
        description: 'xxxxxxxx',
        :
        isAutoDeleteObject: false,
        env: defaultEnv,
        terminationProtection: false, // Enabling deletion protection
    });
    // add tag
    cdk.Tags.of(app).add('Project', projectName);
    cdk.Tags.of(app).add('Environment', envName);
    // test with snapshot
    expect(Template.fromStack(stack)).toMatchSnapshot();

})
```

### 4.2. Unit Test(Fine-grained Assertions)

Jest を使った Unit Test も実施できます。これにより、リソース単位の細かなテストを行うことができます。
VPC の場合は、以下のようにして VPC やサブネットの数、ルートテーブルの状態などをテストすることができます。
ただ、"AWS::EC2::VPC" のように AWS のリソースを知っていないといけないので慣れないうちは難しく感じるかもしれません。

具体的な記述方法は次のとおりです。
さらに詳しく知りたい場合は、[AWS CDKの公式ドキュメント](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions-readme.html)を参照してください。

```ts
test("create the vpc", () => {
  // GIVEN
  const app = new App({
    context: {
      PJName: "junit",
      EnvName: "prod",
      CidrBlock: "10.0.0.0/16",
    },
  });
  const stack = new VPCStack(app, "testing-vpc", {});
  // WHEN
  const template = Template.fromStack(stack);

  // THEN
  // これ以降にテストコードを記述していきます。
  // VPC
  template.resourceCountIs("AWS::EC2::VPC", 1);
  template.hasResourceProperties("AWS::EC2::VPC", {
    CidrBlock: "10.0.0.0/16",
  });
  :
```

##### 記述例①：単純なリソース存在チェック

```ts
  // Subnet
  template.resourceCountIs("AWS::EC2::Subnet", 6);
  // Internet Gateway
  template.resourceCountIs("AWS::EC2::InternetGateway", 1);
  template.resourceCountIs("AWS::EC2::VPCGatewayAttachment", 1);
```

##### 記述例②：属性値のチェック

```ts
  // VPCGatewayAttachment
  template.hasResourceProperties("AWS::EC2::VPCGatewayAttachment", {
    VpcId: Match.anyValue(),
    InternetGatewayId: Match.anyValue(),
  });
  // Elastic IP
  template.resourceCountIs("AWS::EC2::EIP", 2);
  // NatGateway
  template.resourceCountIs("AWS::EC2::NatGateway", 2);
  template.hasResourceProperties("AWS::EC2::NatGateway", {
    AllocationId: Match.anyValue(),
    SubnetId: Match.anyValue(),
  });
  template.hasResourceProperties("AWS::EC2::NatGateway", {
    AllocationId: Match.anyValue(),
    SubnetId: Match.anyValue(),
  });
  // Route Table
  template.resourceCountIs("AWS::EC2::RouteTable", 6);
  template.resourceCountIs("AWS::EC2::Route", 4);
  template.hasResourceProperties("AWS::EC2::Route", {
    RouteTableId: Match.anyValue(),
    DestinationCidrBlock: "0.0.0.0/0",
    GatewayId: Match.anyValue(),
  });
  template.hasResourceProperties("AWS::EC2::Route", {
    RouteTableId: Match.anyValue(),
    DestinationCidrBlock: "0.0.0.0/0",
    NatGatewayId: Match.anyValue(),
  });
  template.resourceCountIs("AWS::EC2::SubnetRouteTableAssociation", 6);
  template.hasResourceProperties("AWS::EC2::SubnetRouteTableAssociation", {
    RouteTableId: Match.anyValue(),
    SubnetId: Match.anyValue(),
  });
});
```

テストを実行した結果は次のようになります。

![jest](/images/cdk/jest.png)

## 5. AWS CDK Tips

### 5.1. App定義のTips

#### 5.1.1. 共通するリソースを一括で付与したい

App定義の最後に以下を追加することで、App全体で共通してリソースタグを付与することができます。

```ts
// --------------------------------- Tagging  -------------------------------------
// ここを指定しておくと、全てのスタックにタグ付けしてくれます。
// プロジェクト名や環境識別子は共通タグとして定義します。
cdk.Tags.of(this).add('Project', props.PJName);
cdk.Tags.of(this).add('Environment', props.EnvName);
```

スタック特有のリソースタグを付与する場合は、スタック定義ファイルのほうで指定します。

```ts
export class MyStack extends Stack {
  // 別のスタックで参照
  public readonly xxx: string;

  constructor(scope: Construct, id: string, props: IMyStackProps) {
    super(scope, id, props);

    // タグを付与する -> スタック内の全てにタグ付けしてくれます。
    cdk.Tags.of(this).add('hogehoge', 'foobar');
  }
}
```

#### 5.1.2. CDKコマンド実行時に動的なパラメータを渡したい

CDKコマンドに`-c key=value`という形式で指定します。複数のパラメータを渡す場合は、`-c key1=value -c key2=value`のように繰り返します。

```sh
cdk deploy -c key=value
or
cdk deploy -c key1=value -c key2=value
```

パラメータを取得するには次のようにします。

```ts
const key1: string = app.node.tryGetContext('key1');
const key2: string = app.node.tryGetContext('key2');
```

#### 5.1.3. パラメータで指定した環境識別子をチェックしたい

```ts
// 環境識別子の指定 -> 環境識別子はコマンド実行時に '-c project=xxx -c env=xxx' と指定します
const projectName: string = app.node.tryGetContext('project');
const envName: string = app.node.tryGetContext('env');

// 環境識別子のチェック
const envNames: string[] = ['dev', 'test', 'stage', 'prod'];
if (!envNames.includes(envName)) {
  console.error(`Invalid environment specified. Please use one of the following: ${envNames.join(', ')}.`);
  process.exit(1);
}
```

#### 5.1.4. 本番環境（prod）リリース時に注意喚起してミスを防止策したい

デプロイするときは、`cdk deploy MyStack -c env=dev --profile xxxxx` として、AWS プロファイル名を指定するのが一般的ですが、これだと環境識別子やプロファイル名を間違えてしまった場合、間違った環境にデプロイされてしまう危険があります。

コンソール上で注意喚起のメッセージがあると、それだけで気付くことがありミス防止にもなります。

具体的には env で与えられる環境によって、メッセージを表示する方法です。

`prod` とした環境の場合には、次のようにコンソールに表示されます。

![CAUTION](/images/cdk/cdk-CAUTION.png)

```ts
// 文字色
const color_red: string = "\u001b[31m";
const color_green: string = "\u001b[32m";
const color_yellow: string = "\u001b[33m";
const color_white: string = "\u001b[37m";
const color_reset: string = "\u001b[0m";

console.log();
console.log(
  `${color_yellow}##########################################${color_reset}`
);
console.log(`${color_yellow}  プロジェクト名: ${projectName} ${color_reset}`);
console.log(
  `${color_yellow}  リリース環境：${color_reset} ${color_red}${envname}${color_reset}`
);
console.log(
  `${color_yellow}##########################################${color_reset}`
);
console.log();

// 環境識別子のチェック
const envNames: string[] = ['dev', 'test', 'stage', 'prod'];
if (!envNames.includes(envName)) {
  console.error(`Invalid environment specified. Please use one of the following: ${envNames.join(', ')}.`);
  process.exit(1);
}

const isProduction: boolean = envname.match(/^(prod)$/) ? true : false;
if (isProduction) {
  console.log(`${color_red}!!!!!!!!!! CAUTION !!!!!!!!!!${color_reset}`);
  console.log(`${color_red}   本番環境へのリリースです。${color_reset}`);
  console.log(`${color_red}!!!!!!!!!! CAUTION !!!!!!!!!!${color_reset}`);
}
```

#### 5.1.5. スタックの削除を防止したい

CloudFormationにある[スタック削除](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/using-cfn-protect-stacks.html)をAWS CDKから指定する方法です。
具体的には、`terminationProtection: true`を指定します。こうすることで、スタック作成と同時に、削除保護を有効にできます。誤って`cdk deploy`してしまうこともありません。
ただし、本当に削除したい場合はマネジメントコンソールやAWS CLI（[update-termination-protection](https://docs.aws.amazon.com/cli/latest/reference/cloudformation/update-termination-protection.html)）から削除保護を解除する必要があります。

```ts
// スタック
const myStack = new MyStack (app, 'MySample ', {
  terminationProtection: true, // 削除保護の有効化
});
```

#### 5.1.6. リージョンの指定を変数化

複数のスタックを管理する場合は、リージョンを毎回指定するのではなくまとめて変数化しておくと便利です。

```ts
// env
const defaultEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

// see: https://docs.aws.amazon.com/ja_jp/general/latest/gr/rande.html#regional-endpoints
const useast1Env = {
// US East (Virginia)
account: process.env.CDK_DEFAULT_ACCOUNT,
  region: "us-east-1", // リージョンを固定したい場合
};

// stack1はデフォルトリージョン
const stack1 = new MyStack (app, 'Stack1', {
  env: defaultEnv,
});

// stack2はバージニア北部リージョン
const stack2 = new MyStack (app, 'Stack2 ', {
  env: useast1Env,
});
```

#### 5.1.7. マルチリージョンへの一括デプロイ

マルチリージョンへのデプロイで、リージョンごとの設定を定義できます。

```ts
const regionConfig = {
  'us-east-1': {
    name: 'Virginia',
    isPrimary: true,
    availabilityZones: ['us-east-1a', 'us-east-1b', 'us-east-1c'],
    certificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/uuid',
  },
  'eu-west-1': {
    name: 'Ireland',
    isPrimary: false,
    availabilityZones: ['eu-west-1a', 'eu-west-1b', 'eu-west-1c'],
    certificateArn: 'arn:aws:acm:eu-west-1:123456789012:certificate/uuid',
  },
  'ap-northeast-1': {
    name: 'Tokyo',
    isPrimary: false,
    availabilityZones: ['ap-northeast-1a', 'ap-northeast-1c', 'ap-northeast-1d'],
    certificateArn: 'arn:aws:acm:ap-northeast-1:123456789012:certificate/uuid',
  }
};

// Usage example
const deploymentRegions = ['us-east-1', 'ap-northeast-1']; // Selected regions for deployment

deploymentRegions.forEach(regionId => {
  const region = regionConfig[regionId];
  
  const networkStack = new NetworkStack(app, `${props.projectName}-${props.environment}-${region.name}-network`, {
    env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: regionId },
    availabilityZones: region.availabilityZones,
    isPrimary: region.isPrimary,
  });
  
  // Create other region-specific stacks...
});
```

### 5.2. AWS CDK Tips その他Tips

#### 5.2.1. 環境識別子とプロファイル名の二重指定をやめる

「5.1.3. 本番環境（prod）リリース時に注意喚起してミスを防止策したい」では、`cdk deploy MyStack -c env=dev --profile xxxxx`のようにしましたが、これでは`profile`の指定誤りを検知できません。
具体的には、`package.json`に以下の定義をして、`profile`を動的に指定できるようにします。
そのためには、`.aws\credentials`に、`--profile %npm_config_project%-%npm_config_env%"`で指定できる形式のプロファイルを追加しておきます。

```json
{
  :
  "scripts": {
    "build": "tsc",
    "watch": "tsc -w",
    "test": "jest",
    "cdk": "cdk",
    "cdk:synth": "cdk synth --version-reporting false --path-metadata false --asset-metadata false -c project=%npm_config_project% -c env=%npm_config_env% --profile %npm_config_project%-%npm_config_env%",
    "cdk:diff:all": "cdk diff --all --version-reporting false --path-metadata false --asset-metadata false -c project=%npm_config_project% -c env=%npm_config_env% --profile %npm_config_project%-%npm_config_env%",
    "cdk:deploy:all": "cdk deploy --all --version-reporting false --path-metadata false --asset-metadata false -c project=%npm_config_project% -c env=%npm_config_env% --profile %npm_config_project%-%npm_config_env%",
    "cdk:destroy:all": "cdk destroy --all -c project=%npm_config_project% -c env=%npm_config_env% --profile %npm_config_project%-%npm_config_env%"
  },
:
}
```

#### 5.2.2. AWS CDK 作成時の Metadata を削除したい場合

AWS CDK で作成される CloudFormation テンプレートファイルには、メタデータが含まれます。[バージョンレポート](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/cli.html#version_reporting)と呼ばれるものです。

```yaml
Resources:
  CDKMetadata:
    Type: AWS::CDK::Metadata
    Properties:
      Analytics: v2:deflate64:H4sIAAAAAAAAEzPUMzQw0TNQdEgsL9ZNTsnWT84vStWrDi5JTM7Wcc7PKy4pKk0u0XFOywtKLc4vLUpOBbGBEimZJZn5ebU6efkpqXpZxfplhmZ6hkCDsoozM3WLSvNKMnNT9YIgNAAtXENFZQAAAA==
    Metadata:
      aws:cdk:path: MyStack/CDKMetadata/Default
    Condition: CDKMetadataAvailable
Conditions:
  CDKMetadataAvailable:
    Fn::Or:
      - Fn::Or:
          - Fn::Equals:
              - Ref: AWS::Region
              - af-south-1
:
```

これは、次のような目的で付与される内容です。

![cdk-metadata.png](/images/cdk/cdk-metadata.png)

バージョンレポートを付与したくない場合は、cdk コマンドに以下のオプションを追加して実行します。

```sh
cdk synth --no-version-reporting --path-metadata false
```

または、cdk.json に `"versionReporting": false,` を追加します。

![versionReporting](/images/cdk/versionReporting.png)

GitHub などからダウンロードしてきた CloudFormation テンプレートにこのような Metadata の記載がある場合は、消しても問題ありません。

## 6. cdk-nagによるセキュリティとコンプライアンスの強化

「Amazon Web Services ブログ>[AWS Cloud Development Kit と cdk-nag でアプリケーションのセキュリティとコンプライアンスを管理する](https://aws.amazon.com/jp/blogs/news/manage-application-security-and-compliance-with-the-aws-cloud-development-kit-and-cdk-nag/)」にも紹介されている「cdk-nag」を使ったセキュリティとコンプライアンスの強化を行う方法です。

### 6.1. cdk-nagとは

`cdk-nag`とは「[cfn_nag](https://github.com/stelligent/cfn_nag)」に影響された静的解析ツールです。

GitHubリポジトリは[こちら](https://github.com/cdklabs/cdk-nag)

### 6.2. 導入方法

次のコマンドで cdk-nag パッケージを開発依存関係（devDependencies）としてインストールします。

```sh
npm install cdk-nag --save-dev
or
npm install cdk-nag -D
```

### 6.3. 実装方法

App定義(./bin/xxxxxx.ts)に次のように実装します。
このように指定することで、AWS Solutionsルールに準拠しているか確認するようにできます。

```ts
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AwsSolutionsChecks } from "cdk-nag";
import { Stack1 } from "../lib/stack1";

const app = new cdk.App();
cdk.Aspects.of(app).add(new AwsSolutionsChecks());

const stack1 = new Stack1(app,'Stack1',{
  // ここにパラメータを指定
});
```

次のコマンドを実行することでルールに沿っているかどうかをチェックできます。

```sh
cdk synth
```

違反しているルールがある場合はつぎのように表示されます。

```text
[Error at /CdkTestStack/Bucket/Resource] AwsSolutions-S1: The S3 Bucket has server access logs disabled. The bucket should have server access logging enabled to provide detailed records for the requests that are made to the bucket.

[Error at /CdkTestStack/Bucket/Resource] AwsSolutions-S2: The S3 Bucket does not have public access restricted and blocked. The bucket should have public access restricted and blocked to prevent unauthorized access.

[Error at /CdkTestStack/Bucket/Resource] AwsSolutions-S3: The S3 Bucket does not default encryption enabled. The bucket should minimally have SSE enabled to help protect data-at-rest.

[Error at /CdkTestStack/Bucket/Resource] AwsSolutions-S10: The S3 Bucket does not require requests to use SSL. You can use HTTPS (TLS) to help prevent potential attackers from eavesdropping on or manipulating network traffic using person-in-the-middle or similar attacks. You should allow only encrypted connections over HTTPS (TLS) using the aws:SecureTransport condition on Amazon S3 bucket policies.

Found errors
```

対応するには、該当するソースを修正します。例えば、`AwsSolutions-S3`に対応するには、`enforceSSL: true`を指定します。（enforceSSLは未指定の場合、デフォルトがfalseです。）

※現在は、`AwsSolutions-S3`のルールが削除されています。

```ts
const bucket = new Bucket(this, 'MyBucket', {
  :
+  enforceSSL: true
  }
)
```

### 6.4. Rules Pack

チェックできるルールはGitHubリポジトリの[RULES.md](https://github.com/cdklabs/cdk-nag/blob/main/RULES.md)に記載があるように、以下の5種類になります。

- [AWS Solutions](https://github.com/cdklabs/cdk-nag/blob/main/RULES.md#awssolutions)
- [HIPAA security](https://github.com/cdklabs/cdk-nag/blob/main/RULES.md#hipaa-security)
- [NIST 800-53 rev 4](https://github.com/cdklabs/cdk-nag/blob/main/RULES.md#nist-800-53-rev-4)
- [NIST 800-53 rev 5](https://github.com/cdklabs/cdk-nag/blob/main/RULES.md#nist-800-53-rev-5)
- [Payment Card Industry Data Security Standard (PCI DSS) 3.2.1](https://github.com/cdklabs/cdk-nag/blob/main/RULES.md#pci-dss-321)

使用するには、importでルールを指定します。

```ts
import {
  AwsSolutionsChecks,
  HIPAASecurityChecks,
  NIST80053R4Checks,
  NIST80053R5Checks,
  PCIDSS321Checks,
} from 'cdk-nag';

Aspects.of(app).add(new AwsSolutionsChecks());
Aspects.of(app).add(new HIPAASecurityChecks());
Aspects.of(app).add(new NIST80053R4Checks());
Aspects.of(app).add(new NIST80053R5Checks());
Aspects.of(app).add(new PCIDSS321Checks());
```

ルールには、パラメータを指定することができます。

```ts
Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
```

### 6.5. エラーの抑止

cdk-nagでチェックされるルールは、あくまでベストプラクティスに則ったものであり、特定のユースケースでは除外したい場合もあります。
そのような場合、`NagSuppressions`を使用することで除外することができます。

- addStackSuppressions
  - スタック全体で除外する場合
  - または、CDKが自動的に生成するリソースに対して除外する場合
- addResourceSuppressions
  - リソースを指定して除外する場合
- addResourceSuppressionsByPath
  - リソースのパス名を指定します。

特定のスタック(./lib/stacks/xxxxx.ts)で次のように除外するルールIDを指定します。

```ts
import { NagSuppressions } from "cdk-nag";

export class MyStack extends Stack {
  // 別のスタックで参照
  public readonly xxx: string;

  constructor(scope: Construct, id: string, props: IMyStackProps) {
    super(scope, id, props);

    const appLogsBucket = new Bucket(this, 'AppLogsBucket', { enforceSSL: true })
+    // スタック全体で指定する場合
+    NagSuppressions.addStackSuppressions(this, [
+      {
+        // サーバーアクセスログが無効
+        id: 'AwsSolutions-S1',
+        reason: 'Demonstrate a stack level suppression.'
+      },
+    ]);

+    // リソースを指定する場合
+    NagSuppressions.addResourceSuppressions(this.bucket, [
+      {
+        // サーバーアクセスログが無効
+        id: 'AwsSolutions-S1',
+        reason: 'Demonstrate a stack level suppression.'
+      },
+    ]);

+    // リソースパスを指定する場合
+    NagSuppressions.addResourceSuppressionsByPath(this,
+    '/path/to/a/b/c/d/DefaultPolicy/Resource'
+    [
+      {
+        // サーバーアクセスログが無効
+        id: 'AwsSolutions-S1',
+        reason: 'Demonstrate a stack level suppression.'
+      },
+    ]);
  }
}
```

### 6.6. テスト実施方法

以下は、テストコード(./test/xxxxx.text.ts)の例になります。

```ts
import { Annotations, Match } from "aws-cdk-lib/assertions";
import { App, Aspects, Stack } from "aws-cdk-lib";
import { Stack1 } from "../lib/stack1";
import { AwsSolutionsChecks } from "cdk-nag";

describe("cdk-nag Aws Solutions Pack", () => {
  let stack: Stack;
  let app: App;
  beforeAll(() => {
    app = new App();
    stack = new Stack1(app, "test-stack",{
      // スタックパラメータ
    });

    Aspects.of(stack).add(new AwsSolutionsChecks());
  });

  test("No unsuppressed Warnings", () => {
    const Warnings = Annotations.fromStack(stack).findWarning(
      "*",
      Match.stringLikeRegexp("AwsSolutions-.*")
    );
    expect(Warnings).toHaveLength(0);
  });

  test("No unsuppressed Errors", () => {
    const errors = Annotations.fromStack(stack).findError(
      "*",
      Match.stringLikeRegexp("AwsSolutions-.*")
    );
    expect(errors).toHaveLength(0);
  });
});
```

### 6.7. 【発展】CDK-NAGへのカスタムルールの追加

CDK-NAGを使ったカスタムルールを追加する方法です。`NagPack`をextendsしたクラスを定義することで、組織などで規定されている独自ルールに対するチェックが実施できます。

例えば、S3やEC2に独自のタグを付与しなければならないルールがあった場合のコード例は次のとおりです。

```ts
import { NagPack, NagMessageLevel,NagPackProps } from 'cdk-nag';
import * as cdk from 'aws-cdk-lib';
import { IConstruct } from 'constructs';;
import {
    aws_ec2 as ec2,
    aws_s3 as s3
 } from 'aws-cdk-lib';

export class CustomCdkNagRules extends NagPack {
    constructor(props?: NagPackProps) {
        super(props);
        this.packName = 'MyCompanyRules';
      }
    visit(node: IConstruct): void {
    if (node instanceof cdk.CfnResource) {
        // S3バケットに特定のタグが必要というカスタムルール
        this.applyRule({
            ruleSuffixOverride: 'S3BucketTaggingRule', // The rule ID.
            info: 'MyCompanyRule-S3-TAG-HOGEHOGE', //Why the rule was triggered.
            explanation: 'S3 バケットには hogehoge タグが必要です', // Why the rule exists.
            rule: (node: IConstruct) => {
                if (node instanceof s3.CfnBucket) {
                    // タグの存在確認ロジック
                    const tags = node.tags?.renderTags();
                    if (!tags || !tags.some((tag: { key: string }) => tag.key === 'hogehoge')) {
                    return [node.logicalId];
                    }
                }
                return [];
            },
            level: NagMessageLevel.ERROR, // The annotations message level to apply to the rule if triggered.
            node: node,
        });
        // EC2に特定のタグが必要というカスタムルール
        this.applyRule({
            ruleSuffixOverride: 'EC2TaggingRule', // The rule ID.
            info: 'MyCompanyRule-EC2-TAG-FOOBAR', //Why the rule was triggered.
            explanation: 'EC2インスタンスには foobar タグが必要です', // Why the rule exists.
            rule: (node: IConstruct) => {
                if (node instanceof ec2.CfnInstance) {
                    // タグの存在確認ロジック
                    const tags = node.tags?.renderTags();
                    if (!tags || !tags.some((tag: { key: string }) => tag.key === 'foobar')) {
                    return [node.logicalId];
                    }
                }
                return [];
            },
            level: NagMessageLevel.ERROR, // The annotations message level to apply to the rule if triggered.
            node: node,
        });
    }
  }
}
```

チェックを適用するには、`AwsSolutionsChecks`と同様の方法でインポートして使用します。

```ts
import { AwsSolutionsChecks } from 'cdk-nag'
import { Aspects } from 'aws-cdk-lib';
+ import { CustomCdkNagRules } from '/path/to/custom-cdk-nag-rules';

// Add the cdk-nag AwsSolutions Pack with extra verbose logging enabled.
Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }))
+ Aspects.of(app).add(new CustomCdkNagRules({ verbose: true }));
```

実行するとこのようなエラーが表示されるようになります。

```text
[Error at /SampleStack/LogsBucket/S3Bucket/Resource] MyCompanyRules-S3BucketTaggingRule[LogsBucketS3BucketD57C9602]: MyCompanyRule-S3-TAG-HOGEHOGE S3 バケットには hogehoge タグが必要です
[Error at /SampleStack/EC2Instance1/Resource] MyCompanyRules-EC2TaggingRule[EC2Instance14196AB1A]: MyCompanyRule-EC2-TAG-FOOBAR EC2インスタンスには foobar タグが必要です
```

## 📖 まとめ

AWS CDKは、使い慣れたプログラミング言語を活用してクラウドインフラストラクチャをコードとして定義する強力なフレームワークです。この記事では、AWS CDKの基本概念から高度な使用方法まで幅広く解説しました。
CDKを使用することの主なメリットは以下の通りです。

- 静的型付き言語による型安全性と早期のエラー検出
- コード再利用によるベストプラクティスの標準化と品質向上
- プログラミング言語の機能（条件分岐、ループ、抽象化）が活用できる開発生産性
- インフラとアプリケーションコードの統合による一元管理
- 組織全体でのスケーリングとガバナンス強化

特にL2レベルのコンストラクトを使用することで、CloudFormationでは数百行に及ぶコードが数十行で実現でき、可読性と保守性が大幅に向上します。

また、cdk-nagや、効率的な開発のための命名規則、環境識別方法などの実践的なテクニックを使用することで、大規模なプロジェクトや組織全体でのCDKの活用に役立ちます。

AWS CDKを適切に活用し、安全で堅牢、かつ効率的なクラウドインフラストラクチャ管理を実現しましょう。