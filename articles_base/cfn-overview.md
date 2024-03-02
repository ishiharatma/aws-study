# AWS CloudFormation

## ☘️ はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents

Duration: 00:01:00

- [AWS CloudFormation](#aws-cloudformation)
  - [☘️ はじめに](#️-はじめに)
  - [👀 Contents](#-contents)
  - [xx とは](#xx-とは)
  - [xx の基本](#xx-の基本)

## xx とは

【AWS Black Belt Online Seminar】[AWS CloudFormation(YouTube)](https://youtu.be/Viyqh9fNBjw)(0:56:03)

![xx](/images/blackbelt/)

【AWS Black Belt Online Seminar】[AWS CloudFormation deep dive(YouTube)](https://youtu.be/XOuhtEIdf0k)(1:06:10)

![xx](/images/blackbelt/)

【AWS Black Belt Online Seminar】[AWS CloudFormation#1 基礎編(YouTube)](https://youtu.be/4dyiPsYXG8I)(0:15:15)

![xx](/images/blackbelt/)

【AWS Black Belt Online Seminar】[AWS CloudFormation CloudFormation レジストリ編(YouTube)](https://www.youtube.com/watch?v=3-rOuhahaDI)(0:23:43)

![xx](/images/blackbelt/)

【AWS Black Belt Online Seminar】[AWS CloudFormation よくあるユースケースと質問編(YouTube)](https://www.youtube.com/watch?v=FHFfWMddd-0)(0:29:05)

![xx](/images/blackbelt/)

[AWS CloudFormation サービス概要](https://aws.amazon.com/jp/cloudformation/)

[AWS CloudFormation ドキュメント](https://docs.aws.amazon.com/ja_jp/cloudformation/?icmpid=docs_homepage_mgmtgov)

[AWS CloudFormation よくある質問](https://aws.amazon.com/jp/cloudformation/faqs/)

[AWS CloudFormation の料金](https://aws.amazon.com/jp/cloudformation/pricing/)

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

## 【<font color="red">必須</font>】AWSTemplateFormatVersion

ここは固定です。詳しくは下記を参照してください。
https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/format-version-structure.html

```yaml
AWSTemplateFormatVersion: "2010-09-09"
```

## 【任意】Description

テンプレートの説明を記述します。スタックの画面で説明を見ることができます。スタック名で判断できるのであれば無くてもよいです。

## 【任意】Metadata

テンプレートに対する追加情報を記述します。
よく使うのは、```AWS::CloudFormation::Interface``` で、パラメータの量が多い場合、グループ化し変数のソート順を指定して画面表示することができるので、作業が分かりやすくなります。

グループ化されていないパラメータ入力画面です。

![image.png](files/612340d96065b200a61bdbff.png)

グループ化されたパラメータ入力画面です。グループ化単位でラベルが付与でき、強調表示されます。
![image.png](files/612340a46065b200a61bdbfe.png)

## 【任意】Parameters

実行時に変更したい値をパラメータとして定義することで、１つのテンプレートファイルで環境に合わせた構築ができます。
```yaml
  パラメータ名：
    Type: パラメータの型を指定します。指定できる型は、String,Number,List<Number>,CommaDelimitedList,AWS 固有のパラメーター型
    Default: パラメータのデフォルト値を設定しておくことができます。
    Description: パラメータの説明文を設定できます。
    : 
```
指定できるプロパティは以下を参照してください。String 型の場合、AllowedPatternで正規表現による入力制限を行ったり、Number 型は、最小～最大値を指定できるなど様々なオプションがあります。

https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html#parameters-section-structure-properties


## 【任意】Conditions

入力されたパラメータに、分岐するフラグを作成することができます。例えば、EnvName に test が設定された場合に、 IsTest というフラグを True にし、Resources セクションでは、このパラメータでリソース作成を制御したり、名称を変更したりすることができます。

パターン①：パラメータによって条件に利用する

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
    !Equals ['test', !Ref EnvName]
```

パターン②：パラメータの入力有無による条件に利用する

```yaml
Parameters:
  ManagementAccountId:
    Type: String
Conditions:
  EnableManagementAccount: # 管理アカウントID が指定されていたら true
    !Not [ !Equals [!Ref ManagementAccountId, ""] ]
```

パターン③：いくつかの条件を組み合わせる
```yaml
Conditions:
  IsSupportedRegion:
    !Or [!Equals [ !Ref "AWS::Region", us-east-1 ],
         !Equals [ !Ref "AWS::Region", us-east-2 ],
         !Equals [ !Ref "AWS::Region", us-west-1 ],
         !Equals [ !Ref "AWS::Region", us-west-2 ],
         !Equals [ !Ref "AWS::Region", ap-northeast-1 ],
         !Equals [ !Ref "AWS::Region", ap-northeast-2 ],
         !Equals [ !Ref "AWS::Region", ap-southeast-2 ],
         !Equals [ !Ref "AWS::Region", eu-west-1 ],
         !Equals [ !Ref "AWS::Region", eu-west-2 ],
         !Equals [ !Ref "AWS::Region", eu-north-1 ]]
```

## 【任意】Mappings
パラメータでは対応できないようなキーと値の組み合わせを記述するときに利用します。
リージョンが ap-northeast-1 の場合、ELBAccountID がxxxx、ap-northeast-3 の場合 ELBAccountID が zzzz といった変換ができるようになります。

ロードバランサの AWS アカウント ID はリージョンで異なりますので、```[ "arn:aws:iam::${AccountId}:root", { AccountId: !FindInMap [ RegionMap, !Ref AWS::Region , LBAWSAccount]}]``` とすることでリージョンが変更されてもテンプレートを修正する必要がありません。

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

また、dev と test で VPC やサブネットの CIDR が異なる場合、```!Sub [ "${VPCCIDRBASE}${Subnet}", { Subnet: !FindInMap [ VpcConfig, !Ref EnvName, Vpc ]}]``` と指定することで環境ごとに変更でき、一か所に記述してあるため確認がしやすくなります。

```yaml
  VpcConfig:
    dev:
      Vpc                   : .0.0/16
      BastionSubnet1        : .0.0/24
      DbSubnet1             : .1.0/24
      DbSubnet2             : .2.0/24
    test:
      Vpc                   : .0.0/16
      BastionSubnet1        : .10.0/24
      DbSubnet1             : .11.0/24
      DbSubnet2             : .12.0/24
```

## 【<font color="red">必須</font>】Resources

AWS の各種リソースを作成する部分です。リソースに合わせて必要なパラメータが異なりますので、ドキュメントを参照して記述していきます。記述が間違っている場合のエラーメッセージはあまり親切とはいえないので、何がエラーか分からないで苦労する場合もあります。


```yaml
  テンプレート内で識別するID:
    Type: AWS リソースのタイプ
    Properties: リソース毎のパラメータ
```

S3 を作成する場合は以下のようにします。```DeletionPolicy: Retain``` というパラメータを指定すると、テンプレートを削除してもリソースを残すことができるオプションです。（スタックを削除したあと同じテンプレートを再実行する場合は、リソースが残っているので手動で削除する必要があります。）

```yaml
  S3Bucket:
    Type: AWS::S3::Bucket
    DeletionPolicy: Retain
    Properties:
      BucketName: 'example-bucket'
      AccessControl: Private
      PublicAccessBlockConfiguration:
        BlockPublicAcls: True
        BlockPublicPolicy: True
        IgnorePublicAcls: True
        RestrictPublicBuckets: True
```

## 【任意】Outputs

スタック内で作成したリソースの名やリソース ARN を出力することができます。出力したパラメータは、**同一リージョンにある**別のスタックで ```!ImportValue 変数名``` として利用することができます。

```yaml
  出力するパラメータID（リソースで指定したIDと同じでもよい）:
    Value: 出力するパラメータの値
    Export:
      Name: 出力するパラメータに名前を付けたい場合に指定します。指定しなかった場合は、パラメータIDとなります。組み込み関数を利用して柔軟な名前を作成することができます。
```

出力するパラメータの値は、```!Ref S3Bucket``` と Resources 内の ID を指定するとリソース毎のデフォルトの値が設定されます。リソースによって、リソースの名前や ARN が設定されます。他の属性は、```!GetAtt  S3Bucket.Arn``` と指定すると取得できます。リソースによってサポートしている属性が異なるので、詳しくは AWS ドキュメントを参照してください。


## 組み込み関数
### 条件関数

条件関数に、```Fn::If``` ```Fn::Equals``` ```Fn::Not``` などを利用してリソース名やリソースの削除を制御できます。詳しくは、以下のドキュメントを参照してください。

https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-conditions.html#intrinsic-function-reference-conditions-if

### その他

条件関数以外には、```Sub``` 、 ```ImportValue``` 、 ```Join``` といったものを使うことができます。これらを使えば、他のテンプレートの変数を利用したり、文字列を結合したりといった操作ができるようになり、柔軟なリソース作成ができます。

詳しくは、以下のドキュメントを参照してください。
https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html

#### Sub と ImportValue を組み合わせる例
個人的には、この使い方が便利なので紹介します。Sub の基本的な使い方としては、以下のように動的に名称をつけたり、Arn を指定したりします。

```yaml
!Sub 'arn:aws:iam::${AWS::AccountId}:root'
```

CloudFormation を使っていると外部テンプレートで Output した変数を使いたい場合があります。外部テンプレートの変数は ```ImportValue``` を使う必要があるので、```${変数名}```  では参照できません。このときは、Sub の変数マップを使います。これを使うことで、```ImportValue``` や ```GetAtt``` の値を利用することが可能になります。

```yaml
!Sub
  - !Sub 'arn:aws:iam::${AWS::AccountId}:role/{PjName}-{EnvName}-{XXXXArn}'
  - {PjName: !ImportValue PjName, EnvName: !ImportValue EnvName, XXXXArn: !GetAtt XXXX.Outputs.XXXXArn}
```

## テンプレートで利用できる共通変数
CloudFormation では予め利用できる変数が存在します。

https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html

変数をテンプレート内で利用するには、```!Ref 'AWS::AccountId'``` や、```!Sub '${AWS::AccountId}'``` と記述します。

```yaml
# 使用例
      Policy:
      - Version: 2012-10-17
        Statement:
          - Effect: Allow
            Principal: '*'
            Action: execute-api:Invoke
            Resource: !Join [':' , ['arn:aws:execute-api', !Ref 'AWS::Region', !Ref 'AWS::AccountId', '*']]
```

| 変数名 | 利用頻度 | 説明 |
| --- | --- | --- |
|AWS::AccountId| 高 | AWS のアカウント ID である12桁の数値 (123456789012)が取得できます。|
|AWS::Region| 高 | ```ap-northeast-1``` といったリージョン名が取得できます。|
|AWS::NoValue| 高 | Conditionsで指定した条件と組み合わせて、パラメータの有無を制御したい場合に利用します。 |
|AWS::StackName| 中 | スタック名が取得できます。リソース名などに利用したいといった用途で使うことができます。 |
|AWS::StackId| 低 | スタックのIDが取得できます。リソース名などに利用したいといった用途で使うことができます。|
|AWS::Partition| 低 | AWS リソースを一意にする ARN ```arn:aws:iam::aws:policy/AdministratorAccess``` の ```aws``` というパーティションを取得することができます。 中国や一部のリージョンを除いて、基本的に ```aws``` となっているため、あまり利用することはありません。 |
|AWS::NotificationARNs| 低 | スタックに設定した通知用の SNS トピック ARN のリストを取得することができます。複数設定した場合は、組込関数である Fn::Select で絞り込みます |
|AWS::URLSuffix| 低 | ドメインのサフィックスを取得します。通常は、```amazonaws.com``` なので、一部のリージョンを除いてはあまり利用することはありません。 |


## Rollbacks
## ChangeSets
## Drift
## Nested Stacks


利用する AWS リソースが多くなると、テンプレートの記述量が増えてきて可読性を低下させてしまったり、同じリソースを作る場合には記述が冗長になってしまったりします。
そんなときは、サービスや機能ごとにテンプレートを作成して、親スタックから呼び出すことができます。

以下の例では、それぞれの機能ごとに作成したテンプレートを特定の S3 バケットに格納し、親スタックから呼び出しています。
API Gatewayは、パラメータのフラグにてパブリックかプライベートの制御をしているため１つのテンプレートで構築することができます。

```
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
## Secrets Manager
## CloudFormation デザイナー
## CloudFormation IaC Generator

create-generated-template — AWS CLI 1.32.32 Command Reference
https://docs.aws.amazon.com/cli/latest/reference/cloudformation/create-generated-template.html
describe-generated-template — AWS CLI 1.32.33 Command Reference
https://docs.aws.amazon.com/cli/latest/reference/cloudformation/describe-generated-template.html
get-generated-template — AWS CLI 1.32.33 Command Reference
https://docs.aws.amazon.com/cli/latest/reference/cloudformation/get-generated-template.html

既存のリソースからのスタックの作成
https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/resource-import-new-stack.html#resource-import-new-stack-cli