---
title: "【初心者向け】AWS CloudFormation入門！完全ガイド" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: true
---

# AWS CloudFormation<!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

- [CloudFormation とは](#cloudformation-とは)
- [コンソールでの表示](#コンソールでの表示)
- [基本用語](#基本用語)
- [テンプレートの構成](#テンプレートの構成)
  - [【必須】AWSTemplateFormatVersion](#必須awstemplateformatversion)
  - [【任意】Description](#任意description)
  - [【任意】Metadata](#任意metadata)
  - [【任意】Parameters](#任意parameters)
  - [【任意】Conditions](#任意conditions)
  - [【任意】Mappings](#任意mappings)
  - [【必須】Resources](#必須resources)
  - [【任意】Outputs](#任意outputs)
- [組み込み関数](#組み込み関数)
  - [条件関数](#条件関数)
  - [その他](#その他)
    - [Sub と ImportValue を組み合わせる例](#sub-と-importvalue-を組み合わせる例)
- [テンプレートで利用できる共通変数](#テンプレートで利用できる共通変数)
- [Rollbacks](#rollbacks)
- [ChangeSets（変更セット）](#changesets変更セット)
- [Drift](#drift)
- [Nested Stacks](#nested-stacks)
- [StackSet](#stackset)
- [Secrets Manager](#secrets-manager)
- [CloudFormation デザイナー](#cloudformation-デザイナー)
- [IaC ジェネレータ](#iac-ジェネレータ)

## CloudFormation とは

リソースを簡単にモデル化、プロビジョニング、管理することができる Infrastructure as Code (IaC) サービスです。
リソースをテンプレート（JSON または YAML 形式）で管理することができます。
CloudFormation 自体は基本的には無料で利用できますが、プロビジョニングしたリソースにはコストが発生します。（料金については下記を参照してください。）

【AWS Black Belt Online Seminar】[AWS CloudFormation(YouTube)](https://youtu.be/Viyqh9fNBjw)(0:56:03)

![cfn_1](/images/blackbelt/blackbelt-cfn_1-320.jpg)

【AWS Black Belt Online Seminar】[AWS CloudFormation deep dive(YouTube)](https://youtu.be/XOuhtEIdf0k)(1:06:10)

![cfn_2](/images/blackbelt/blackbelt-cfn_2-320.jpg)

【AWS Black Belt Online Seminar】[AWS CloudFormation#1 基礎編(YouTube)](https://youtu.be/4dyiPsYXG8I)(0:15:15)

![cfn_3](/images/blackbelt/blackbelt-cfn_3-320.jpg)

【AWS Black Belt Online Seminar】[AWS CloudFormation CloudFormation レジストリ編(YouTube)](https://www.youtube.com/watch?v=3-rOuhahaDI)(0:23:43)

![cfn_4](/images/blackbelt/blackbelt-cfn_4-320.jpg)

【AWS Black Belt Online Seminar】[AWS CloudFormation よくあるユースケースと質問編(YouTube)](https://www.youtube.com/watch?v=FHFfWMddd-0)(0:29:05)

![cfn_5](/images/blackbelt/blackbelt-cfn_5-320.jpg)

[AWS CloudFormation サービス概要](https://aws.amazon.com/jp/cloudformation/)

[AWS CloudFormation ドキュメント](https://docs.aws.amazon.com/ja_jp/cloudformation/?icmpid=docs_homepage_mgmtgov)

[AWS CloudFormation よくある質問](https://aws.amazon.com/jp/cloudformation/faqs/)

[AWS CloudFormation の料金](https://aws.amazon.com/jp/cloudformation/pricing/)

## コンソールでの表示

テンプレート管理してリリースしたものはこのような画面で確認することができます。

![cfn-console](/images/cfn/cfn-console.png)

エラーがあった場合はこのようにエラー内容が表示されます。「根本原因を検出」ボタンを押すと、原因となったエラーメッセージ部分にフォーカスされます。

![cfn-console-error](/images/cfn/cfn-console-error.png)

## 基本用語

- テンプレート
  - リソースの設定などを記述した YAML(xxx.yaml) か JSON(xxx.json)のテキストファイルのことです。
  - ※ 本ドキュメントでは、基本的に YAML で表記します。
- スタック
  - テンプレートファイルと１：１となるリソースのコレクションです。
  - 後述するテンプレートのネストを使うことで複数テンプレートをまとめて管理することもできます。
  - スタックの単位でリソースを管理します。
- テンプレートのアップロード
  - スタックを新規作成する、または更新するときにテンプレートファイルをローカルから送信することです。
  - S3 バケットに保存したものを指定または、コンソールから直接アップロードすることができます。
  - [Git と同期](https://aws.amazon.com/jp/about-aws/whats-new/2023/11/aws-cloudformation-git-management-stacks/)
    - Nov 26, 2023 に使えるようになった機能で、従来のアップロードではなく Git リポジトリと同期して、Push したら自動的にスタックが更新されるようにできます。

## テンプレートの構成

テンプレートファイルは、以下の構成になっています。

```yaml
AWSTemplateFormatVersion:
Description:
Metadata:
Parameters:
Conditions:
Mappings:
Resources:
Outputs:
```

### 【<font color="red">必須</font>】AWSTemplateFormatVersion

ここは固定です。2024 年 3 月時点で有効な値は `2010-09-09` のみです。
詳しくは下記を参照してください。
https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/format-version-structure.html

```yaml
AWSTemplateFormatVersion: "2010-09-09"
```

### 【任意】Description

テンプレートの説明を記述します。スタックの画面で説明を見ることができます。スタック名で判断できるのであれば無くてもよいです。

```yaml
Description: >
  Here are some
  details about
  the template.
```

### 【任意】Metadata

テンプレートに対する追加情報を記述します。
よく使うのは、`AWS::CloudFormation::Interface` で、パラメータの量が多い場合、グループ化し変数のソート順を指定して画面表示することができるので、作業が分かりやすくなります。

グループ化されていないパラメータ入力画面です。

![image.png](/images/cfn/612340d96065b200a61bdbff.png)

グループ化されたパラメータ入力画面です。グループ化単位でラベルが付与でき、強調表示されます。
![image.png](/images/cfn/612340a46065b200a61bdbfe.png)

### 【任意】Parameters

実行時に変更したい値をパラメータとして定義することで、１つのテンプレートファイルで環境に合わせた構築ができます。

```yaml
  パラメータ名：
    Type: パラメータの型を指定します。指定できる型は、String,Number,List<Number>,CommaDelimitedList,AWS 固有のパラメーター型
    Default: パラメータのデフォルト値を設定しておくことができます。
    Description: パラメータの説明文を設定できます。
    :
```

指定できるプロパティは以下を参照してください。String 型の場合、AllowedPattern で正規表現による入力制限を行ったり、Number 型は、最小～最大値を指定できるなど様々なオプションがあります。

https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html#parameters-section-structure-properties

### 【任意】Conditions

入力されたパラメータに、分岐するフラグを作成することができます。例えば、EnvName に test が設定された場合に、 IsTest というフラグを True にし、Resources セクションでは、このパラメータでリソース作成を制御したり、名称を変更したりすることができます。

パターン ①：パラメータによって条件に利用する

```yaml
Parameters:
  EnvName:
    Type: String
    Default: true
    AllowedValues:
      - dev
      - prod
      - stage
      - test
Conditions:
  IsTest: # 環境名が test の場合、true
    !Equals ["test", !Ref EnvName]
```

パターン ②：パラメータの入力有無による条件に利用する

```yaml
Parameters:
  ManagementAccountId:
    Type: String
Conditions:
  EnableManagementAccount: # 管理アカウントID が指定されていたら true
    !Not [!Equals [!Ref ManagementAccountId, ""]]
```

パターン ③：いくつかの条件を組み合わせる

```yaml
Conditions:
  IsSupportedRegion:
    !Or [
      !Equals [!Ref "AWS::Region", us-east-1],
      !Equals [!Ref "AWS::Region", us-east-2],
      !Equals [!Ref "AWS::Region", us-west-1],
      !Equals [!Ref "AWS::Region", us-west-2],
      !Equals [!Ref "AWS::Region", ap-northeast-1],
      !Equals [!Ref "AWS::Region", ap-northeast-2],
      !Equals [!Ref "AWS::Region", ap-southeast-2],
      !Equals [!Ref "AWS::Region", eu-west-1],
      !Equals [!Ref "AWS::Region", eu-west-2],
      !Equals [!Ref "AWS::Region", eu-north-1],
    ]
```

### 【任意】Mappings

パラメータでは対応できないようなキーと値の組み合わせを記述するときに利用します。
リージョンが ap-northeast-1 の場合、ELBAccountID が xxxx、ap-northeast-3 の場合 ELBAccountID が zzzz といった変換ができるようになります。

ロードバランサの AWS アカウント ID はリージョンで異なりますので、`[ "arn:aws:iam::${AccountId}:root", { AccountId: !FindInMap [ RegionMap, !Ref AWS::Region , LBAWSAccount]}]` とすることでリージョンが変更されてもテンプレートを修正する必要がありません。

```yaml
RegionMap:
  us-east-1: # 米国東部（バージニア北部）
    LBAWSAccount: 127311923021
  us-east-2: # 米国東部 (オハイオ)
    LBAWSAccount: 33677994240
  us-west-1: # 米国西部 (北カリフォルニア)
    LBAWSAccount: 27434742980
  us-west-2: # 米国西部 (オレゴン)
    LBAWSAccount: 797873946194
```

また、dev と test で VPC やサブネットの CIDR が異なる場合、`!Sub [ "${VPCCIDRBASE}${Subnet}", { Subnet: !FindInMap [ VpcConfig, !Ref EnvName, Vpc ]}]` と指定することで環境ごとに変更でき、一か所に記述してあるため確認がしやすくなります。

```yaml
VpcConfig:
  dev:
    Vpc: .0.0/16
    BastionSubnet1: .0.0/24
    DbSubnet1: .1.0/24
    DbSubnet2: .2.0/24
  test:
    Vpc: .0.0/16
    BastionSubnet1: .10.0/24
    DbSubnet1: .11.0/24
    DbSubnet2: .12.0/24
```

### 【<font color="red">必須</font>】Resources

AWS の各種リソースを作成する部分です。リソースに合わせて必要なパラメータが異なりますので、ドキュメントを参照して記述していきます。記述が間違っている場合のエラーメッセージはあまり親切とはいえないので、何がエラーか分からないで苦労する場合もあります。

```yaml
テンプレート内で識別するID:
  Type: AWS リソースのタイプ
  Properties: リソース毎のパラメータ
```

S3 を作成する場合は以下のようにします。`DeletionPolicy: Retain` というパラメータを指定すると、テンプレートを削除してもリソースを残すことができるオプションです。（スタックを削除したあと同じテンプレートを再実行する場合は、リソースが残っているので手動で削除する必要があります。）

```yaml
S3Bucket:
  Type: AWS::S3::Bucket
  DeletionPolicy: Retain
  Properties:
    BucketName: "example-bucket"
    AccessControl: Private
    PublicAccessBlockConfiguration:
      BlockPublicAcls: True
      BlockPublicPolicy: True
      IgnorePublicAcls: True
      RestrictPublicBuckets: True
```

### 【任意】Outputs

スタック内で作成したリソースの名やリソース ARN を出力することができます。出力したパラメータは、**同一リージョンにある**別のスタックで `!ImportValue 変数名` として利用することができます。

```yaml
出力するパラメータID（リソースで指定したIDと同じでもよい）:
  Value: 出力するパラメータの値
  Export:
    Name: 出力するパラメータに名前を付けたい場合に指定します。指定しなかった場合は、パラメータIDとなります。組み込み関数を利用して柔軟な名前を作成することができます。
```

出力するパラメータの値は、`!Ref S3Bucket` と Resources 内の ID を指定するとリソース毎のデフォルトの値が設定されます。リソースによって、リソースの名前や ARN が設定されます。他の属性は、`!GetAtt  S3Bucket.Arn` と指定すると取得できます。リソースによってサポートしている属性が異なるので、詳しくは AWS ドキュメントを参照してください。

## 組み込み関数

### 条件関数

条件関数に、`Fn::If` `Fn::Equals` `Fn::Not` などを利用してリソース名やリソースの削除を制御できます。詳しくは、以下のドキュメントを参照してください。

https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-conditions.html#intrinsic-function-reference-conditions-if

### その他

条件関数以外には、`Sub` 、 `ImportValue` 、 `Join` といったものを使うことができます。これらを使えば、他のテンプレートの変数を利用したり、文字列を結合したりといった操作ができるようになり、柔軟なリソース作成ができます。

詳しくは、以下のドキュメントを参照してください。
https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html

#### Sub と ImportValue を組み合わせる例

個人的には、次の使い方が便利なので紹介します。

Sub の基本的な使い方としては、以下のように動的に名称をつけたり、Arn を指定したりします。

```yaml
!Sub "arn:aws:iam::${AWS::AccountId}:root"
```

CloudFormation を使っていると外部テンプレートで Output した変数を使いたい場合があります。外部テンプレートの変数は `ImportValue` を使う必要があるので、`${変数名}` では参照できません。このときは、Sub の変数マップを使います。これを使うことで、`ImportValue` や `GetAtt` の値を利用することが可能になります。

```yaml
!Sub
- !Sub "arn:aws:iam::${AWS::AccountId}:role/{PjName}-{EnvName}-{XXXXArn}"
- {
    PjName: !ImportValue PjName,
    EnvName: !ImportValue EnvName,
    XXXXArn: !GetAtt XXXX.Outputs.XXXXArn,
  }
```

## テンプレートで利用できる共通変数

CloudFormation では予め利用できる変数が存在します。

https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html

変数をテンプレート内で利用するには、`!Ref 'AWS::AccountId'` や、`!Sub '${AWS::AccountId}'` と記述します。

```yaml
# 使用例
Policy:
  - Version: 2012-10-17
    Statement:
      - Effect: Allow
        Principal: "*"
        Action: execute-api:Invoke
        Resource:
          !Join [
            ":",
            [
              "arn:aws:execute-api",
              !Ref "AWS::Region",
              !Ref "AWS::AccountId",
              "*",
            ],
          ]
```

| 変数名                | 利用頻度 | 説明                                                                                                                                                                                                                                 |
| --------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| AWS::AccountId        | 高       | AWS のアカウント ID である 12 桁の数値 (123456789012)が取得できます。                                                                                                                                                                |
| AWS::Region           | 高       | `ap-northeast-1` といったリージョン名が取得できます。                                                                                                                                                                                |
| AWS::NoValue          | 高       | Conditions で指定した条件と組み合わせて、パラメータの有無を制御したい場合に利用します。                                                                                                                                              |
| AWS::StackName        | 中       | スタック名が取得できます。リソース名などに利用したいといった用途で使うことができます。                                                                                                                                               |
| AWS::StackId          | 低       | スタックの ID が取得できます。リソース名などに利用したいといった用途で使うことができます。                                                                                                                                           |
| AWS::Partition        | 低       | AWS リソースを一意にする ARN `arn:aws:iam::aws:policy/AdministratorAccess` の `aws` というパーティションを取得することができます。 中国や一部のリージョンを除いて、基本的に `aws` となっているため、あまり利用することはありません。 |
| AWS::NotificationARNs | 低       | スタックに設定した通知用の SNS トピック ARN のリストを取得することができます。複数設定した場合は、組込関数である Fn::Select で絞り込みます                                                                                           |
| AWS::URLSuffix        | 低       | ドメインのサフィックスを取得します。通常は、`amazonaws.com` なので、一部のリージョンを除いてはあまり利用することはありません。                                                                                                       |

## Rollbacks

[更新のロールバックを続ける](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-continueupdaterollback.html)

スタック更新中にエラーが発生した場合は、スタック更新前の状態に自動的に戻ります。その場合、スタックのステータスは `UPDATE_ROLLBACK_COMPLETE` になります。
自動的に戻らない場合は、スタックのステータスが`UPDATE_ROLLBACK_FAILED`になりますので対処が必要になります。

## ChangeSets（変更セット）

[変更セット](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html)

現在適用されているテンプレートと、これから適用するテンプレートの差分をチェックして表示してくれるものです。
スタックを更新する途中でも同じようにチェックしてくれるものと同じです。

![changeset](/images/cfn/cfn-changeset.jpg)

スタック更新とは別に作成することもできます。作成した変更セットは、その後、実行（スタック更新）することができます。
スタック更新途中でも確認できますが、誤ってスタック更新してしまわないので、安全に確認するのであれば事前に変更セットを作成するのがよいでしょう。

![cfn-changeset-create](/images/cfn/cfn-changeset-create.png)

## Drift

[CloudFormation スタック全体のドリフトを検出する](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/detect-drift-stack.html)

テンプレートと実際のリソースの状態をチェックして差分を検出してくれる機能です。
テンプレートによるスタック管理を行っていたが、何らかの理由で手動による修正を行ったものが検出できます。

![drift](/images/cfn/console-stacks-drifts-drift-details-differences-1.png)

## Nested Stacks

[ネストされたスタックの操作](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/using-cfn-nested-stacks.html)

利用する AWS リソースが多くなると、テンプレートの記述量が増えてきて可読性を低下させてしまったり、同じリソースを作る場合には記述が冗長になってしまったりします。

巨大なテンプレートになってしまった場合、サービスや機能ごとにテンプレートを分割して複数のスタックにしてもよいのですが、そうすると依存関係による実行順序を管理しにくくなります。
そんなときに、スタックのネストを行うことで親スタックから呼び出すことができます。

次の例では、それぞれの機能ごとに分割したテンプレートを特定の S3 バケットに格納し、親スタックから呼び出しています。

他のスタックの出力値を使用したい場合は、`!GetAtt スタック名.Outputs.出力パラメータ名` のように指定することで使用できます。

```yaml
  IamGroup:
    Type: AWS::CloudFormation::Stack
    Properties:
      TemplateURL: !Join ["", [!Ref CfnTemplateBucketUrl, "IAMGroups.yaml"]]
      Parameters:
        ：
  NetworkSecurity:
    Type: AWS::CloudFormation::Stack
    Properties:
      TemplateURL: !Join ["", [!Ref CfnTemplateBucketUrl, "NetworkSecurity.yaml"]]
      Parameters:
        paramxxx: !GetAtt IamGroup.Outputs.xxxxx
        ：
  ApiGatewayExternal:
    Type: AWS::CloudFormation::Stack
    Properties:
      TemplateURL: !Join ["", [!Ref CfnTemplateBucketUrl, "ApiGateway.yaml"]]
        IsPrivate: false
        ：
  ApiGatewayInternal:
    Type: AWS::CloudFormation::Stack
    Properties:
      TemplateURL: !Join ["", [!Ref CfnTemplateBucketUrl, "ApiGateway.yaml"]]
      Parameters:
        IsPrivate: true
        ：
```

## StackSet

[AWS CloudFormation StackSets の操作](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html)

CloudFormation StackSets を使うことで、1 つのテンプレートから複数の AWS アカウント、リージョンに対し Stack を作成することが可能になります。

## Secrets Manager

CloudFormation で Secrets Manager の値を使用する方法です。

[Secrets Manager のシークレット](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-secretsmanager)

次のようにすることで、テンプレートにシークレットの情報を残さずに MasterUsername や MasterUserPassword を取得できます。

```yaml
MyRDSInstance:
  Type: "AWS::RDS::DBInstance"
  Properties:
    DBName: MyRDSInstance
    AllocatedStorage: "20"
    DBInstanceClass: db.t2.micro
    Engine: mysql
    MasterUsername: "{{resolve:secretsmanager:MyRDSSecret:SecretString:username}}"
    MasterUserPassword: "{{resolve:secretsmanager:MyRDSSecret:SecretString:password}}"
```

その他、SSM パラメータストアなどの使用は次のドキュメントを参照してください。
[スタックテンプレートでの動的な参照の指定](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/dynamic-references.html#dynamic-references-pattern)

## CloudFormation デザイナー

GUI と、YAML または JSON で記述することができます。

実際に操作してみたい場合は、チュートリアルの [デザイナー の開始方法](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/working-with-templates-cfn-designer-additional-info.html) をやってみるとよいです。

![cfn-designer](/images/cfn/cfn-designer-tutorial.png)

## IaC ジェネレータ

[既存のリソースのテンプレートを生成](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/generate-IaC.html)

既存のリソースをスキャンして、テンプレート化できる機能です。
テンプレート化できるのは、スタック管理されていないものだけのようです。

同じような機能に、[既存のリソースからのスタックの作成](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/resource-import-new-stack.html#resource-import-new-stack-console)というのがありますが、こちらはテンプレートにリソース用のコードを追加した状態で、既存リソースとテンプレートを紐づけてスタック管理できるようにするものです。

[IaC ジェネレータで既存リソースからテンプレートを生成してみた記事はこちら](./cfn-iac-generator-tried-it.md)

このように生成することができます。
![iac_generator_9_finish_5](/images/cfn_iac_generator/iac_generator_9_finish_5.png)

IaC ジェネレータで生成したものを CloudFormation デザイナーに貼り付けても表示できました。行数が多いと応答がなくなるので注意が必要かもしれません。
![cfn-designer](/images/cfn/cfn-designer.png)

CLI で実行する場合はこちら。[テンプレートを生成 (AWS CLI)](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/generate-IaC.html#generate-template-cli)

[create-generated-template — AWS CLI 1.32.32 Command Reference](https://docs.aws.amazon.com/cli/latest/reference/cloudformation/create-generated-template.html)
[describe-generated-template — AWS CLI 1.32.33 Command Reference](https://docs.aws.amazon.com/cli/latest/reference/cloudformation/describe-generated-template.html)
[get-generated-template — AWS CLI 1.32.33 Command Reference](https://docs.aws.amazon.com/cli/latest/reference/cloudformation/get-generated-template.html)
