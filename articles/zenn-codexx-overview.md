---
title: "【初心者向け】AWS Code 兄弟 入門！完全ガイド" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: true
---

# Code 兄弟

## ☘️ はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents

- [Code 兄弟](#code-兄弟)
  - [☘️ はじめに](#️-はじめに)
  - [👀 Contents](#-contents)
  - [Code 兄弟 とは](#code-兄弟-とは)
    - [AWS CodeCommit](#aws-codecommit)
    - [AWS CodeBuild](#aws-codebuild)
    - [AWS CodeDeploy](#aws-codedeploy)
    - [AWS CodePipeline](#aws-codepipeline)
  - [AWS CodeCommit の基本](#aws-codecommit-の基本)
    - [Amazon CodeGuru Reviewer との連携](#amazon-codeguru-reviewer-との連携)
    - [AWS CodeArtifact](#aws-codeartifact)
  - [AWS CodeBuild の基本](#aws-codebuild-の基本)
    - [buildspec.yml](#buildspecyml)
    - [ビルド環境で利用できる環境変数](#ビルド環境で利用できる環境変数)
    - [ビルドのフェーズ](#ビルドのフェーズ)
    - [ビルドを高速化する方法](#ビルドを高速化する方法)
    - [ローカルでビルド](#ローカルでビルド)
    - [VPC での利用](#vpc-での利用)
  - [AWS CodeDeploy の基本](#aws-codedeploy-の基本)
    - [appspec.yml](#appspecyml)
  - [AWS CodePipeline の基本](#aws-codepipeline-の基本)
  - [AWS CodeStar](#aws-codestar)
  - [ハンズオン](#ハンズオン)

## Code 兄弟 とは

Duration: 327:55:00

AWS の Code がつくサービス CodeCommit、CodeDeploy CodeBuild CodePipeline などの俗称である。

![code-family](/images/codexx/codexx-overview.png)

### AWS CodeCommit

【AWS Black Belt Online Seminar】[AWS CodeCommit & AWS CodeArtifact(YouTube)](https://www.youtube.com/watch?v=rqy_wluHDe0)(55:47)

![CodeCommit](/images/codexx/blackbelt_codecommit-320.jpg)

[AWS CodeCommit サービス概要](https://aws.amazon.com/jp/codecommit/)
[AWS CodeCommit ドキュメント](https://docs.aws.amazon.com/ja_jp/codecommit/?icmpid=docs_homepage_devtools)
[AWS CodeCommit よくある質問](https://aws.amazon.com/jp/codecommit/faqs/)
[AWS CodeCommit の料金](https://aws.amazon.com/jp/codecommit/pricing/)

[AWS CodeArtifact サービス概要](https://aws.amazon.com/jp/codeartifact/)
[AWS CodeArtifact ドキュメント](https://docs.aws.amazon.com/ja_jp/codeartifact/?icmpid=docs_homepage_devtools)
[AWS CodeArtifact よくある質問](https://aws.amazon.com/jp/codeartifact/faq/)
[AWS CodeArtifact の料金](https://aws.amazon.com/jp/codeartifact/pricing/)

【AWS Black Belt Online Seminar】[Amazon CodeGuru(YouTube)](https://www.youtube.com/watch?v=OF-NfrcgR-o)(54:41)

![CodeGuru](/images/codexx/blackbelt_codeguru-320.jpg)

[AWS CodeGuru サービス概要](https://aws.amazon.com/jp/codeguru/)
[AWS CodeGuru ドキュメント](https://docs.aws.amazon.com/ja_jp/codeguru/?icmpid=docs_homepage_ml)
[AWS CodeGuru よくある質問](https://aws.amazon.com/jp/codeguru/faqs/)
[AWS CodeGuru の料金](https://aws.amazon.com/jp/codeguru/pricing/)

### AWS CodeBuild

【AWS Black Belt Online Seminar】[AWS CodeBuild(YouTube)](https://www.youtube.com/watch?v=Zzv1_ztf-B0)(59:01)

![CodeBuild](/images/codexx/blackbelt_codebuild-320.jpg)

[AWS CodeBuild サービス概要](https://aws.amazon.com/jp/codebuild/)
[AWS CodeBuild ドキュメント](https://docs.aws.amazon.com/ja_jp/codebuild/?icmpid=docs_homepage_devtools)
[AWS CodeBuild よくある質問](https://aws.amazon.com/jp/codebuild/faqs/)
[AWS CodeBuild の料金](https://aws.amazon.com/jp/codebuild/pricing/)

### AWS CodeDeploy

【AWS Black Belt Online Seminar】[AWS CodeDeploy(YouTube)](https://www.youtube.com/watch?v=cXa2S2kS0TU)(54:29)

![CodeDeploy](/images/codexx/blackbelt_codedeploy-320.jpg)

[AWS CodeDeploy サービス概要](https://aws.amazon.com/jp/codedeploy/)
[AWS CodeDeploy ドキュメント](https://docs.aws.amazon.com/ja_jp/codedeploy/?icmpid=docs_homepage_devtools)
[AWS CodeDeploy よくある質問](https://aws.amazon.com/jp/codedeploy/faqs/)
[AWS CodeDeploy の料金](https://aws.amazon.com/jp/codedeploy/pricing/)

### AWS CodePipeline

【AWS Black Belt Online Seminar】[AWS CodeStar & AWS CodePipeline(YouTube)](https://www.youtube.com/watch?v=31-w23SdOAs)(56:29)

![CodePipeline](/images/codexx/blackbelt_codepipeline-320.jpg)

[Streamline Your Software Release Process Using AWS CodePipeline(YouTube)](https://www.youtube.com/watch?v=zMa5gTLrzmQ)(16:33)

[AWS CodePipeline サービス概要](https://aws.amazon.com/jp/codepipeline/)
[AWS CodePipeline ドキュメント](https://docs.aws.amazon.com/ja_jp/codepipeline/?icmpid=docs_homepage_devtools)
[AWS CodePipeline よくある質問](https://aws.amazon.com/jp/codepipeline/faqs/)
[AWS CodePipeline の料金](https://aws.amazon.com/jp/codepipeline/pricing/)

[NEW LAUNCH! AWS CodeStar: The Central Experience to Quickly Start Developing Applications on AWS(YouTube)](https://youtu.be/pIaB7wSSReU)(30:55)

![codestar-awssummit](/images/codexx/codestar-awssummit-320.jpg)

[AWS CodeStar サービス概要](https://aws.amazon.com/jp/codestar/)
[AWS CodeStar ドキュメント](https://docs.aws.amazon.com/ja_jp/codestar/?icmpid=docs_homepage_devtools)
[AWS CodeStar よくある質問](https://aws.amazon.com/jp/codestar/faqs/)
[AWS CodeStar の料金](https://aws.amazon.com/jp/codestar/pricing/)

## AWS CodeCommit の基本

Duration: 0:05:00

![codecommit-overview](/images/codexx/codecommit.png)

プライベート Git リポジトリのフルマネージド型サービスです。

作成するリポジトリ名は、大文字小文字が区別され、作成する AWS リージョンの AWS アカウント内で一意にする必要があります。

同一リージョンでも、別のアカウントでは同じ名前のリポジトリを作成することができます。

![same-repository](/images/codexx/same-repository.png)

作成したリポジトリには、リージョン毎に `https://git-codecommit.ap-northeast-1.amazonaws.com/v1/repos/xxxxx` (東京リージョンの場合) という URL で接続できます。

アクセスする URL にはリポジトリ名以外区別する情報がありませんので、別アカウントで同じリポジトリを作成すると、OS に保存されている認証情報で誤ったリポジトリに接続する可能性があるため、同一リポジトリ名は特別な理由がない限り避けたほうがよいと思います。

リポジトリへの接続は IAM ユーザーを使用し、認証は IAM ユーザーで作成する Git 認証情報を使用します。

複数の AWS アカウントで同一リージョンのリポジトリを扱う場合は、`credential.namespace` で使い分けましょう。初めて CodeCommit を利用する場合でも、今後を考えて `credential.namespace` を指定しておくと、HTTP ステータスコード 403 が返ってくることを回避できます。
もし、別のアカウントの認証情報が残っていて 403 が出た場合は、OS の認証情報のキャッシュを削除しましょう。

```sh
git -c credential.namespace=hoge clone git-codecommit.ap-northeast-1.amazonaws.com/v1/repos/xxxxx
```

### Amazon CodeGuru Reviewer との連携

https://aws.amazon.com/jp/codeguru/

機械学習を使用して、ソースコードの問題を検知してくれるサービスです。

2023 年 4 月現在、Java と Python に対応しています。

リポジトリを関連付けすると、プルリクエストに対して自動的に推奨事項をコメントしてくれます。

![codeguru-reviewer](/images/codexx/codeguru-reviewer.png)

![coreguru-reviewer-result](/images/codexx/codeguru-reviewer-result.png)

90 日間、100,000 行のコードまでは無料で利用できます。90 日経過または、100,000 行のコードを超えた場合に料金が発生します。

### AWS CodeArtifact

![codeartifact-overview](/images/codexx/codeartifact.png)

ソフトウェアパッケージを保存公開できるサービスです。
これを利用することで以下のメリットがあります。

- maven や npm などの対応するパッケージマネージャーの Proxy として利用でき、組織内で使用が承認されているパッケージのみ提供できるようになります。
- ネットワークによっては公開リポジトリへのアクセスが制限されている場合、VPC エンドポイントを利用することで、CodeArtifact にキャッシュされたパッケージにアクセスできます。
- ダウンロード時間の短縮も期待できます。
- 組織内で開発したパッケージの公開と共有ができます。

## AWS CodeBuild の基本

Duration: 0:15:00

![codebuild-overview](/images/codexx/codebuild.png)

自動テストやビルドを実行してくれるプライベートリポジトリサービスです。

### buildspec.yml

[CodeBuild のビルド仕様に関するリファレンス](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/build-spec-ref.html)

CodeBuild を使用するには、ビルドの仕様を決めるファイルを定義する必要があります。

buildspec.yml の構成は次の通りです。

```yaml
version: 0.2
env:
  variables:
    # ここで環境変数を定義します。
    環境変数名: "値"
  parameter-store:
    # Systems Manager パラメータストアに保存されているカスタム環境変数
    環境変数名: "パラメータストアのキー名"
  secrets-manager:
    # AWS Secrets Manager に保存されているカスタム環境変数
    環境変数名: secret-id:json-key:version-stage:version-id
phases:
  install:
    # ビルド環境でのパッケージインストール
    commands:
      - pip install --upgrade awscli
  pre_build:
    # ビルド前に実行する
    # 例）ECR へのサインイン、npm の依存関係インストール
    commands:
      - npm install
      - npm install --save-dev jest-junit
build:
    # ビルド
    commands:
      - echo Build started on `date`
      - npm run build
  post_build:
    # ビルド後に実行する
    # 例）ECR に Docker イメージを push
reports:
  # テストレポート
  jest_reports:
  # https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/test-report-jest.html
    files:
      - test-results.xml
    file-format: JUNITXML
    base-directory: reports/results
artifacts:
  # ビルド出力アーティファクトを含む場所
  files:
     - "**/*"
cache:
  # キャッシュする場所を指定
  # ビルドプロジェクトでキャッシュタイプを S3 か　ローカルを選択
    paths:
    - './node_modules/**/*'
```

### ビルド環境で利用できる環境変数

[ビルド環境の環境変数](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/build-env-ref-env-vars.html)

- AWS_DEFAULT_REGION
  - ビルドが実行されている リージョン（例：ap-northeast-1）
- CODEBUILD_RESOLVED_SOURCE_VERSION
  - ビルドのソースコードのバージョンの識別子
  - CodeCommit の場合は、コミット ID（例：6e0de7938dda5363e2192fe2a2ec39987a3573b0）

### ビルドのフェーズ

[AWS CodeBuild におけるビルドの詳細の表示](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/view-build-details.html)

ビルドは次のフェーズがあります。

- SUBMITTED
- QUEUED
- PROVISIONING
  - これ以降のフェーズの実行時間が課金対象のようです。
  - ここで失敗すると、`COMPLETED` が実行されます。
- DOWNLOAD_SOURCE
  - ここで失敗すると、`FINALIZING` が実行されます。
- INSTALL
  - ここで失敗すると、`FINALIZING` が実行されます。
- PRE_BUILD
  - ここで失敗すると、`FINALIZING` が実行されます。
- BUILD
  - これ以降は失敗しても次のフェーズが実行されます。
- POST_BUILD
- UPLOAD_ARTIFACTS
- FINALIZING
- COMPLETED

### ビルドを高速化する方法

ビルド時間を短縮することで、ビルド時間に対する従量課金分のコストを削減することができます。
ビルド時間がかかっている場合は、ビルドのフェーズ詳細から、どのフェーズで時間がかかっているかを調査することができます。次の例では、BUILD フェーズが他に比べて時間がかかっていることが分かります。

![codebuild-phase](/images/codexx/codebuild-phase.png)

- BuildKit の有効化

  - 「Docker のランタイムバージョンが 18.09 以上」の場合、依存関係のないレイヤを並列実行させたり、キャッシュを有効利用できるようにしたりと大幅な実行時間短縮が期待できます。
  - buildspec.yml への DOCKER_BUILDKIT の有効化設定

    ```yaml
    env:
      variables:
        DOCKER_BUILDKIT: "1"
    ```

- S3 キャッシュの利用

  - S3 バケットに保存する方式
  - 複数の CodeBuild でキャッシュすることができます。
  - S3 との通信が発生するため、キャッシュ対象が少ないとキャッシュの復元自体のコストが上回り、利点が失われます。

- ローカルキャッシュ利用

  - ローカルキャッシュはビルドホストのみが利用できるキャッシュです。ビルド頻度が高い場合、同じビルドホストが再利用されることがあるため、キャッシュを有効に利用できます。
  - 逆に、ビルド頻度が低い場合はキャッシュの恩恵を受けることが出来ません。
  - ローカルキャッシュの種類

    - DockerLayerCache
      - BUILD フェーズの実行時間が短縮されます。
    - SourceCache
      - DOWNLOAD_SOURCE フェーズの実行時間が短縮されます。
    - CustomCache

      - buidspec.yml の cache/paths で指定したディレクトリ配下のパスに存在するファイル群がキャッシュされるようになります。

      ```yaml
      cache:
        paths:
          - "./node_modules/**/*"
      ```

- 必要なライブラリなどをインストール済の Docker イメージを使用する

  - CodeBuild で毎回インストールするより高速化ができます。

- CodeBuild のホスト環境をスケールアップします。
  - 次の[コンピューティングタイプ](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/build-env-ref-compute-types.html)があります。
    - BUILD_GENERAL1_SMALL
    - BUILD_GENERAL1_MEDIUM
    - BUILD_GENERAL1_LARGE
    - BUILD_GENERAL1_2XLARGE

### ローカルでビルド

https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/use-codebuild-agent.html

ローカルでビルドすることで、buildspec.yml の動作を手軽に確認することができます。また、何度も動作確認を行うことで無料利用枠を使い切ってしまうといったことを回避できます。

### VPC での利用

[Amazon Virtual Private Cloud での AWS CodeBuild の使用](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/vpc-support.html)

CodeBuild では通常 VPC 内のリソースにはアクセスできません。そのようなとき、VPC 上にビルドホストを構築することでリソースにアクセスできるようになります。

主なユースケースは次のとおりです。

- VPC 内リソースにアクセスする
- VPC エンドポイント経由のみアクセス許可された S3 バケットにアクセスする
- 固定の IP アドレス（NAT ゲートウェイ）を必要とする外部サービスにアクセスする

## AWS CodeDeploy の基本

Duration: 0:05:00

デプロイを実行してくれるサービスです。
デプロイ先として下記 3 タイプのリソースがサポートされます。

- EC2/オンプレミス
- Lambda
- ECS

appspec.yml というファイルに設定を記載します。

### appspec.yml

[CodeDeploy AppSpec ファイルリファレンス](https://docs.aws.amazon.com/ja_jp/codedeploy/latest/userguide/reference-appspec-file.html)

CodeDeploy を使用するには、デプロイの仕様を決めるファイルを定義する必要があります。

appspec.yml の構成は次の通りです。

```yaml
version:
  0.0
  # 現在許容されている値は、0.0 のみ
Resources:
  - TargetService:
      # ECS 用
      Type: AWS::ECS::Service
      Properties:
        TaskDefinition: "task-definition-ARN"
        :
  - name-of-function-to-deploy:
      # Lambda 用
      type: "AWS::Lambda::Function"
      properties:
        name: name-of-lambda-function-to-deploy
        :
Hooks:
  - BeforeInstall: "LambdaFunction名"
  - AfterInstall: "LambdaFunction名"
  - AfterAllowTestTraffic: "LambdaFunction名"
  - BeforeAllowTraffic: "LambdaFunction名"
  - AfterAllowTraffic: "LambdaFunction名"
```

[AppSpec ファイル例](https://docs.aws.amazon.com/ja_jp/codedeploy/latest/userguide/reference-appspec-file-example.html)

## AWS CodePipeline の基本

Duration: 0:05:00

CI / CD を構築できるサービスです。

CodeCommit、CodeBuild、CodeDeploy を組み合わせたパイプラインを作成することができます。

![codepipeline-overview](/images/codexx/codepipeline-overview.png)

## AWS CodeStar

Duration: 0:05:00

アプリケーションを開発および構築して AWS にデプロイするために必要なツールを備えたクラウドベースの開発サービスです。

テンプレートを使用して、「Amazon EC2、AWS Lambda、AWS Elastic Beanstalk」を使った開発プロジェクトを始めることができます。
開発に使える言語は、「Java、JavaScript、PHP、Ruby、Python」の５つがサポートされています。

これらのサービスで構築できる場合、簡単に CI/CD を構築できるようになります。

![codestar](/images/codexx/codestar.png)

## ハンズオン

Duration: 2:00:00

> AWS Hands-on for Beginners
> AWS Code サービス群を活用して、CI/CD のための構成を構築しよう！
> https://aws.amazon.com/jp/blogs/news/aws-hands-on-for-beginners-10/ > https://pages.awscloud.com/JAPAN-event-OE-Hands-on-for-Beginners-cicd-2020-reg-event-LP.html?trk=aws_blog_k

![h4b-codexx.png](/images/codexx/h4b-codexx.png)

- Agenda
  - 今回のハンズオンので構築する構成の紹介 + ハンズオンで登場するサービスの紹介
  - S3 をデプロイ先とした、CI/CD 環境を構築する【事前準備 + CodeCommit 編】
  - S3 をデプロイ先とした、CI/CD 環境を構築する【CodePipeline 編】
  - EC2 インスタンスをデプロイ先とした、CI/CD 環境を構築する【事前準備編】
  - EC2 インスタンスをデプロイ先とした、CI/CD 環境を構築する【CodeBuild 編】
  - EC2 インスタンスをデプロイ先とした、CI/CD 環境を構築する【CodeDeploy 編】
  - EC2 インスタンスをデプロイ先とした、CI/CD 環境を構築する【CodePipeline 編】
  - 削除手順の紹介、本シリーズのまとめ、Next Step のご案内
