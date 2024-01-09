# AWS Certified DevOps Engineer - Professional 認定 (DOP-C02)

## ☘️ はじめに

本ページは、AWS 認定資格取得に向けて個人的に勉強した各サービスのキーワードを記載しております。AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

- [試験概要](https://aws.amazon.com/jp/certification/certified-devops-engineer-professional/)
- [試験ガイド](https://d1.awsstatic.com/ja_JP/training-and-certification/docs-devops-pro/AWS-Certified-DevOps-Engineer-Professional_Exam-Guide.pdf)
- [サンプル問題](https://d1.awsstatic.com/ja_JP/training-and-certification/docs-devops-pro/AWS-Certified-DevOps-Engineer-Professional_Sample-Questions.pdf)

- 第 1 分野: SDLC のオートメーション (22%)
- 第 2 分野: 設定管理と IaC (17%)
- 第 3 分野: 耐障害性の高いクラウドソリューション (15%)
- 第 4 分野: モニタリングとロギング (15%)
- 第 5 分野: インシデントとイベントへの対応 (14%)
- 第 6 分野: セキュリティとコンプライアンス (17%)

## CodeCommit

- レビュー担当者
  - [承認ルールテンプレートを作成する](https://docs.aws.amazon.com/ja_jp/codecommit/latest/userguide/how-to-create-template.html)
  - 承認ルールのテンプレートで、IAM ユーザー名やロールを指定できる
    - ワイルドカードでロールを指定できる
  - テンプレートはリポジトリに個別指定
- Linux の場合、 ~/.ssh 内に

  - [Linux、macOS、または Unix で認証情報を設定する](https://docs.aws.amazon.com/ja_jp/codecommit/latest/userguide/setting-up-ssh-unixes.html#setting-up-ssh-unixes-keys)

    ```sh
    Host git-codecommit.*.amazonaws.com
    User APKAEIBAERJR2EXAMPLE
    IdentityFile ~/.ssh/codecommit_rsa
    ```

- Chatbot で Slack 通知
  - Chatbot で Slack のチャネル設定を作成しておく
  - 通知ルール > プルリクイベント(Created) > ターゲット (SNS or Chatbot) > Chatbot を指定
  - 他の方法は、EventBridge ＞ SNS ＞ Chatbot

## CodeDeploy

- appspec.yml

  ```yml

  ```

- デプロイ
  - インプレースデプロイ
    - 稼働中サーバーに対して直接新しいアプリケーションを配置、再起動する方法。
  - B/G
    - EC2 のみ。オンプレではできない
- [デプロイでのフックの実行順](https://docs.aws.amazon.com/ja_jp/codedeploy/latest/userguide/reference-appspec-file-structure-hooks.html#reference-appspec-file-structure-hooks-run-order)
  - Blue/Green デプロイ
    - ApploicationStop
    - DownloadBundle
    - BeforeInstall
    - Install
    - AfterInstall
    - ApplicationStart
    - ValidateService
    - BeforeAllowTraffic
    - AllowTraffic
    - AfterAllowTraffic
  - AWS::CodeDeploy:BlueGreen
    - https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/blue-green.html
- CodeDeploy を使ってアプリケーションを EC2 インスタンスへデプロイ
  - IAM ロールがアタッチ、ssh と https でアクセスできる
  - CodeDeploy エージェントを EC2 にインストール
  - https://docs.aws.amazon.com/ja_jp/codedeploy/latest/userguide/instances.html
- オンプレと EC2
  - [インプレースデプロイ用のデプロイグループを作成](https://docs.aws.amazon.com/ja_jp/codedeploy/latest/userguide/deployment-groups-create-in-place.html)
  - [オンプレミスインスタンスから手動でオンプレミスインスタンスタグを削除します](https://docs.aws.amazon.com/ja_jp/codedeploy/latest/userguide/on-premises-instances-operations-remove-tags.html)
- オンプレミスインスタンスを登録
  - https://docs.aws.amazon.com/ja_jp/codedeploy/latest/userguide/on-premises-instances-register.html
  - register-on-premises-instance
- ソースリポジトリは、S3, Github, BitBucket
- デプロイ設定（ECS）
  - CodeDeployDefault.AllAtOnce 可能な限り多く
  - CodeDeployDefault.HalfAtATime 半分ずつ
  - CodeDeployDefault.OneAtATime １つずつ
- デプロイ設定（Lambda）
  - CodeDeployDefault.LambdaAllAtOnce 　一度に
  - CodeDeployDefault.LambdaCanary10Percent5Minutes 　 10％５分後に 90％
  - CodeDeployDefault.LambdaCanary10Percent10Minutes
  - CodeDeployDefault.LambdaCanary10Percent15Minutes
  - CodeDeployDefault.LambdaCanary10Percent30Minutes
  - CodeDeployDefault.LambdaLinear10PercentEvery1Minute 1 分ごとに 10%ずつ
  - CodeDeployDefault.LambdaLinear10PercentEvery2Minutes
  - CodeDeployDefault.LambdaLinear10PercentEvery3Minutes
  - CodeDeployDefault.LambdaLinear10PercentEvery10Minutes
- デプロイ失敗を通知したい
  - EventBridge
    - source「aws.codedeploy」、detail-type「CodeDeploy Deployment State-change Notification」、detail>state「FAILURE, SUCCESS」
- 自動ロールバック
  - デプロイが失敗または設定されたアラームによってトリガーされる
  - https://docs.aws.amazon.com/ja_jp/codedeploy/latest/userguide/deployments-rollback-and-redeploy.html
- Lambda をデプロイ
  - https://docs.aws.amazon.com/ja_jp/codedeploy/latest/userguide/deployment-steps.html#deployment-steps-lambda
  - https://docs.aws.amazon.com/ja_jp/codedeploy/latest/userguide/deployment-steps-lambda.html
    - Create application
    - Specify deployment group
    - specify deployment configuration
    - Specify an appSpec file
    - Deploy
    - Check result
    - Redeploy as needed

## CodeBuild

- [CodeBuild のビルド仕様に関するリファレンス](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/build-spec-ref.html)

```yml
version: 0.2

env:
  shell: shell-tag
  variables:
    key: "value"
    key: "value"
  parameter-store:
    key: "value"
    key: "value"
  exported-variables:
    - variable
    - variable
  secrets-manager:
    key: xxx
proxy:
batch:
phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws --version
      - $(aws ecr get-login --region $AWS_DEFAULT_REGION --no-include-email)
      - REPOSITORY_URI=012345678910.dkr.ecr.us-east-1.amazonaws.com/base-image
      - COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
      - IMAGE_TAG=${COMMIT_HASH:=latest}
  build:
    commands:
      - echo Build started on `date`
      - echo Building the Docker image...
      - docker build -t $REPOSITORY_URI:latest .
      - docker tag $REPOSITORY_URI:latest $REPOSITORY_URI:$IMAGE_TAG
  post_build:
    commands:
      - echo Build completed on `date`
      - echo Pushing the Docker images...
      - docker push $REPOSITORY_URI:latest
      - docker push $REPOSITORY_URI:$IMAGE_TAG
```

- 実行環境

  - マネージドイメージ
    - Ubuntu
    - Amazon Linux
    - Windows
  - カスタムイメージ
    - Docker イメージのみ。AMI は使えない
    - 別のアカウントの ECR にある Docker イメージを使用するには、URI を指定する
      - [AWS CodeBuild でクロスアカウント ECR イメージへのアクセスをサポート開始](https://aws.amazon.com/jp/about-aws/whats-new/2019/01/aws-codebuild-now-supports-accessing-cross-account-ecr-images/)

- CodeArtifact
  - https://docs.aws.amazon.com/ja_jp/codeartifact/latest/ug/using-python-packages-in-codebuild.html
  - "codeartifact:GetAuthorizationToken"
  - "codeartifact:GetRepositoryEndpoint",
  - "codeartifact:ReadFromRepository"

## CodePipeline

- CodeCommit や CodeBuild などの AWS サービスと統合している
- Lambda に環境変数を渡す
  - https://docs.aws.amazon.com/ja_jp/codepipeline/latest/userguide/actions-invoke-lambda-function.html
  - ユーザーパラメータ
    - Configuration > UserParameters > JSON 形式で
    - Lambda での取得　 → 　 job_data['actionConfiguration']['configuration']['UserParameters']
  - Configuration > EnvironmentVariables 　 environment: { key: value ... }
  - Lambda で環境変数を取得
- AWS Device Farm アクションプロバイダーをテストステージに追加
  - https://docs.aws.amazon.com/ja_jp/codepipeline/latest/userguide/tutorials-codebuild-devicefarm.html
- ステージが失敗した場合の通知
  - source「aws.codepipeline」、detail-type「CodePipeline Stage Execution State Change」、detail>state「FAILED」,pipeline「xxxx」

## CodeStar

- ダッシュボード
  - CodeCommit のコミット履歴
  - パイプラインのステータス
  - CloudWatch
- チームメンバーのアクセス管理
  - https://docs.aws.amazon.com/ja_jp/codestar/latest/userguide/how-to-manage-team-permissions.html
  - [Projects]>[Team]>[Team members]>[Edit]>[Project role]（所有者、寄稿者、閲覧者）
- Atlassian JIRA と統合している

## ECR

- 基本スキャン
  - オープンソースの Clair プロジェクトの共通脆弱性識別子 (CVE) データベースを使用
  - 24 時間に 1 回スキャン
  - レジストリレベルでリージョン毎に有効化
- 拡張スキャン
  - Amazon Inspector と統合

## CloudFormation

- AWS CloudFormation best practices
  - https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/best-practices.html
- ドリフト
  - 実際のリソースと異なる点を発見してくれる機能
  - `aws cloudformation detect-stack-drift --stack-name xxx`
- 変更セット
  - `create-change-set`
  - `list-changes-sets` → 変更セットの中身はみれない
  - `describe-change-set` → 中身が見れる
- 削除時の失敗
  - セキュリティグループに EC2 が存在するとスタック削除失敗する
  - S3 バケットにオブジェクトがあると削除に失敗する
- リソース属性リファレンス
  - https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/aws-product-attribute-reference.html
    - CreationPolicy
      - リソース作成時に成功シグナル（cfn-signal）かタイムアウトまで作成完了にならないようにする
    - DeletetionPolicy
      - 削除されるときにリソースを保持したり、バックアップする
        - Retain 　 → 　削除せずに保持する
        - Snapshot 　 → スナップショットをサポートするリソースの場合、スナップショット作成後に削除する
    - DependsOn
      - 特定のリソースの後に作成する
    - UpdatePolicy
      - リソースに対する更新方法を指定できる
      - AWS::AutoScaling::AutoScalingGroup
        - AutoScalingReplacingUpdate → 新しい ASG を作成して新旧グループ入れ替え → ブルー／グリーン、レッド／ブラック
          - 全台同時入れ替えなので時間が短い、新旧混在しない、ロールバック時に現行への影響なし
          - 一時的に 2 倍になる
          - WillReplace →AutoScalingRollingUpdate と同時指定した場合に、AutoScalingReplacingUpdate が優先される
        - AutoScalingRollingUpdate →ASG 配下のインスタンスを数台ずつ入れ替える
          - 数台ずつ入れ替えるので同時起動数はかわらない
          - 入れ替え、ロールバックに時間がかかる、入れ替え中は新旧混在
          - MaxBatchSize → 最大のインスタンス数
          - MinInstancesInService → 更新時に Inservice にする最小台数
          - PauseTime → バッチ更新の後、CloudFormation が待機する長さ
          - WaitOnResourceSignals →Auto Scaling グループがインスタンスのシグナルを待機するか
    - UpdateReplacePolicy
      - リソースの置き換えが必要になったときの動作を指定する
      - Retain, Delete, Snapshot
- Fn::ImportValue
  - スタックの Outputs で出力したものを別のスタックで利用する
  - 他のスタックに参照されている場合、参照先で参照を削除しないと参照元スタックは削除できない
  - 他のスタックから参照されている値を変更できない
- AWS::CloudFormation::WaitCondition
- ネストされたスタック
  - AWS::CloudFormation::Stack
  - https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/using-cfn-nested-stacks.html
  - https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/best-practices.html
    - 複数のテンプレートにする
- StackSet
  - OUTDATED
    - 管理アカウントとメンバーアカウントの間の信頼されたアクセスが無効に
  - 複数のリージョンに追加する場合
    - StackSet で対象リージョンを選択
    - `create-stack -region` オプション
  - スタックの失敗
    - https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/stacksets-troubleshooting.html#stack-instance-failure-count-for-stackset-operations
    - FailureTolerancePercentage : 失敗許容割合
    - FailureToleranceCount : 失敗許容数
    - 敷居値を超えるとそれ以降は実行されなくなる
- list-stacks コマンド
  - 90 日間、削除されたスタック情報を保持する
  - stack-status-filter がない場合は既存＋削除スタック
  - [list-stacks](https://docs.aws.amazon.com/cli/latest/reference/cloudformation/list-stacks.html)
- ECS クラスターのデプロイ
  - `/etc/ecs/ecs.config` ファイルに ECS_CLUSTER 環境パラメータ
  - [ecs-cluster.yaml の例](https://github.com/aws-samples/ecs-refarch-cloudformation/blob/master/infrastructure/ecs-cluster.yaml)
  - [Amazon ECS コンテナエージェントの設定](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/ecs-agent-config.html)
- EC2 をデプロイするときのユーザーデータ
  - リソース > ユーザーデータ
- ライフサイクルフックを ASG に設定
  - https://docs.aws.amazon.com/ja_jp/autoscaling/ec2/userguide/lifecycle-hooks.html
  - ライフサイクルフックを追加する：put-lifecycle-hook
  - ライフサイクルフックを完了する：complete-lifecycle-action
- 誰かが変更したのを検知したい
  - https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/cloudformation-stack-drift-detection-check.html
  - AWS Config の `cloudformation-stack-drift-detection-check`
- 組み込み関数
  - https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html
  - Fn::GetAtt, Fn::ImportValue, Fn::Join など
  - 使用できるのはテンプレートの特定の部分のみ
    - リソースプロパティ
    - 出力
    - メタデータ属性
    - 更新ポリシー属性
- CodePipeline で使用するときは、「変更セットの作成または置換」ステージ →「承認」ステージ → 実行　とする
- AWS::StepFuntions::StateMachine
- NoEcho を true
  - https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html
  - アスタリスク (**\***) としてマスクされたパラメータ値を表示する
- ユーザーデータ
  - https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-base64.html
- AWS::CloudFormation::CustomResource
  - https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/template-custom-resources.html
  - ServiceToken
  - https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/aws-resource-cfn-customresource.html
  - Amazon SNS topic ARN or Lambda function ARN.
- AWS::CodeDeployBlueGreen
  - CodeDeploy で B/G Deoloy

## SAM

- [SAM コネクタ](https://docs.aws.amazon.com/ja_jp/serverless-application-model/latest/developerguide/sam-resource-connector.html)

  - 2 つのリソース間のアクセス許可を設定
  - AWS::Serverless::Connector

    - 例：AWS Lambda 関数と Amazon DynamoDB テーブルの間

      ```yml
      MyConnector:
        Type: AWS::Serverless::Connector
        Properties:
          Source:
            Id: MyFunction
          Destination:
            Id: MyTable
          Permissions:
            - Read
            - Write
      ```

- [AWS::Serverless::HttpApi](https://docs.aws.amazon.com/ja_jp/serverless-application-model/latest/developerguide/sam-resource-httpapi.html)

  - 例：Lambda 関数によってサポートされる HTTP API エンドポイントをセットアップ

    ```yml
    ApiFunction:
      Type: AWS::Serverless::Function
      Properties:
        Events:
          ApiEvent:
            Type: HttpApi
        Handler: index.handler
        InlineCode: |
          def handler(event, context):
              return {'body': 'Hello World!', 'statusCode': 200}
        Runtime: python3.7
    Transform: AWS::Serverless-2016-10-31
    ```

- Bash スクリプトで

  - aws autoscaling set-instance-health

- トラブルシューティングで ASG で終了したインスタンスを残しておきたい
  - ASG ヘルスチェック設定で ELB ヘルスチェックを無効 →ASG でインスタンスをスタンバイ（[Actions]、[Set to Standby] ）→ASG から外す
    - https://docs.aws.amazon.com/ja_jp/autoscaling/ec2/userguide/as-enter-exit-standby.html

## Jenkins

https://d1.awsstatic.com/whitepapers/DevOps/Jenkins_on_AWS.pdf

- 統合できるのは、
  - EC2, ECR, SNS ,ECS, S3, ElasticBeanstalk
  - CodeDeploy, CodePipeline, CodeCommit, CloudFormation
  - Device Farm

Update the yum package management tool.

```sh
$ sudo yum update –y
```

Download the latest Jenkins code package.

```sh
$ sudo wget -O /etc/yum.repos.d/jenkins.repo
http://pkg.jenkins-ci.org/redhat/jenkins.repo
```

Import a key file from Jenkins-CI to enable installation from the package.

```sh
$ sudo rpm --import
https://pkg.jenkins.io/redhat/jenkins.io.key
```

Install Jenkins.

```sh
$ sudo yum install jenkins -y
```

Start Jenkins as a service.

```sh
$ sudo service jenkins start
```

http://<your-serveraddress>:8080

```sh
/var/lib/jenkins/secrets/initialAdminPassword
```

## AppConfig

- 機能フラグ
  - https://docs.aws.amazon.com/ja_jp/appconfig/latest/userguide/appconfig-creating-configuration-and-profile.html
  - [デプロイ戦略の作成](https://docs.aws.amazon.com/ja_jp/appconfig/latest/userguide/appconfig-creating-deployment-strategy.html)
    - 線形
    - 指数

## AWS Config

- 設定タイムライン
  - https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/view-manage-resource-console.html
  - リソースの変更のタイムラインを確認できる
- コンプライアンスタイムライン
  - https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/view-compliance-history.html
  - ルールがいつ非準拠になったか
- ルールのトリガー
  - https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/evaluate-config-rules.html
  - リソースタイプ → EC2:SecurityGroup など
  - リソースタイプとリソース ID の組み合わせ
  - タグキーと値
- 評価モード
  - リソースのプロビジョニング前
  - プロビジョニング後
  - 両方
- カスタムポリシールール
  - https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/evaluate-config_develop-rules_cfn-guard.html
- WS Config カスタム Lambda ルールの作成
  - https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/evaluate-config_develop-rules_lambda-functions.html
  - Lambda （ブループリント[config-rule-change-triggered] ）を作成して、カスタムルールで Lambda の ARN を指定
- 非準拠リソースの修復
  - 修復アクションは、AWS Systems Manager Automation を使用する
  - https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/remediation.html
- restricted-ssh
  - https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/restricted-ssh.html
  - セキュリティグループの受信 SSH トラフィックがアクセス可能かどうかを確認
- restricted-common-ports
  - https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/restricted-common-ports.html
  - 使用中のセキュリティグループが、指定されたポートへの制限されていない受信 TCP トラフィックを不許可にしているかどうかを確認

## AWS GuardDuty

- [Amazon GuardDuty とは](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/what-is-guardduty.html)
- 以下を継続的に監視できる
  - VPC フローログ,
  - CloudTrail イベントログ,
  - DNS ログ
  - EBS
  - S3 ログ　など
- 悪意のある IP アドレスやドメイン名リスト
- 悪意のあるアクティビティ（マルウェア、DB へのログインイベントの異常）
- CloudWatch Events を利用して結果を検出、SNS に通知できる

## AutoScaling

- [LifeCycleHook 機能](https://docs.aws.amazon.com/ja_jp/autoscaling/ec2/userguide/ec2-auto-scaling-lifecycle.html)
  - Pending:Wait
  - Termination:Wait
    - 処理が完了してからシグナル送信
- CloudFormation で AS の置換更新
  - AutoScalingReplacingUpdate
    - WillReplace : true
- Auto Scaling AddToLoadBalancer を一時停止、停止中に起動したインスタンスは？
  - [Auto Scaling グループのプロセスを中断して再開する](https://docs.aws.amazon.com/ja_jp/autoscaling/ec2/userguide/as-suspend-resume-processes.html)
  - ELB に登録されないので手動で登録

## Systems Manager

- パッチベースライン
- Patch Manager

## Amazon EventBridge

- 外部 SaaS から送信できるイベントバスを作成、リソースベースのポリシーで許可
  - https://docs.aws.amazon.com/ja_jp/eventbridge/latest/userguide/eb-create-event-bus.html
- 他アカウントからイベント送信するには

  - 受信側でアカウント ID からのアクセスを追加
  - 送信側

    - 信頼関係

      ```json
      {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Principal": {
              "Service": "events.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
          }
        ]
      }
      ```

    - アクセス権限

      ```json
      {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": ["events:PutEvents"],
            "Resource": [
              "arn:aws:events:ap-northeast-1:受信側アカウントID:event-bus/イベントバス名"
            ]
          }
        ]
      }
      ```

## AWS CloudWatch

- サブスクリプションフィルターで特定も文字列をフィルタリングして転送（Lambda や Kinesis）
  - https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/SubscriptionFilters.html
  - Kinesis Streams に送信するには、kinesis への　 action:"kinesis:PutRecord" を Allow
  - Lambda に送信するには、Lamnda のパーミッションで、logs.amazonaws.com からの action:"lambda:InvokeFunction" を Allow
  - Kinesis Firehose に送信するには、S3 バケットへの action: ["s3:PutObject" など..] を Allow
  - OpenSearch
  - フィルタパターン
    - { $.eventType = "UpdateTrail" }
- put-metric-data
  - https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/publishingMetrics.html
  - メトリクスの解像度
    - 標準像度 → 1 分
    - 高解像度 → 1 秒 → StorageResolution =1
  - 単一
    - `--value 2`
  - 統計セット
    - `--statistic-values Sum=11,Minimum=2,Maximum=5,SampleCount=3`
    - put-metric-data への呼び出し回数を最小化できる → コストダウン

## S3

- Amazon Macie
  - 大規模な機密データを検出して保護する
  - https://docs.aws.amazon.com/ja_jp/macie/latest/user/what-is-macie.html
  - 機械学習とパターンマッチングで検出
- AWS Backup
  - [Amazon S3 バックアップの作成](https://docs.aws.amazon.com/ja_jp/aws-backup/latest/devguide/s3-backups.html)
    - バージョニングを有効にする必要あり
    - ライフサイクルを設定しないと全てのバージョンをバックアップするのでコスト増
  - [S3 データの復元](https://docs.aws.amazon.com/ja_jp/aws-backup/latest/devguide/restoring-s3.html)
    - 過去 35 日間の任意の時点に復元できる
    - PITR
- S3 MFA Delete
  - バージョニングのオプションとして
  - 削除時に MFA 認証
  - `aws s3api put-bucket-versioning --bucket hoge --versioning-configuration Status=Enabled,MfaDelete=Enabled  --mfa 'arn:aws:iam::XXXXXXXXXXXX:mfa/xxxxx XXXXXX'`
    - MFA デバイスの認証情報とトークンを指定
- オンプレの AD や LDAP で SSO してバケット内のユーザーフォルダ
  - フェデレーションプロキシまたはアイデンティティプロバイダーのセットアップ
  - [AWS Security Token Service](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_credentials_temp.html) を使用して一時トークンを生成
  - IAM ロール
  - https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles_common-scenarios_federated-users.html
  - https://aws.amazon.com/jp/blogs/security/writing-iam-policies-grant-access-to-user-specific-folders-in-an-amazon-s3-bucket/
  - https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles_create_for-idp_saml.html?icmpid=docs_iam_console#idp_saml_Create
- クロスリージョンレプリケーション

## Elastic Beanstalk

- 基本的なヘルスレポート
  - https://docs.aws.amazon.com/ja_jp/elasticbeanstalk/latest/dg/using-features.healthstatus.html
  - ELB
  - EC2 メトリクス　など
- 拡張ヘルスレポート
  - https://docs.aws.amazon.com/ja_jp/elasticbeanstalk/latest/dg/health-enhanced.html
- デプロイ
  - https://docs.aws.amazon.com/ja_jp/elasticbeanstalk/latest/dg/environments-updating.html
  - [All at once (一度に)]
    - 同時にすべて更新、最速
  - [ローリング](https://docs.aws.amazon.com/ja_jp/elasticbeanstalk/latest/dg/using-features.rollingupdates.html)
    - 常に最低限必要なインスタンスを実行してトラフィックを処理
    - [バッチサイズ]、[最小キャパシティー]、[停止時間]
  - [Rolling with additional batch (追加バッチによるローリング)]
  - [イミュータブルな更新](https://docs.aws.amazon.com/ja_jp/elasticbeanstalk/latest/dg/environmentmgmt-updates-immutable.html) - インスタンスの置換を必要とする構成変更が効率的かつ安全に適用 -独自のランタイムアプリケーションや、Elastic Beanstalk がサポートしていないレガシープログラミング言語を移行するには。
  - Docker コンテナ
  - https://docs.aws.amazon.com/ja_jp/elasticbeanstalk/latest/dg/create_deploy_docker.html
- Elastic Beanstalk
- デプロイ前にスクリプト実行するには、container_commands
  - https://docs.aws.amazon.com/ja_jp/elasticbeanstalk/latest/dg/customize-containers-ec2.html
- カスタム CW メトリクス
  - .extensions/cloudwatch.config
- AWS コンソールの設定 > .extensions の設定 > デフォルト値
  - コンソールで ASG 最大 10、.extensions で ASG 最大 5 とした場合、ASG は 10 となる
- eb config ＞　.extensions の設定
- .extensions
  - https://docs.aws.amazon.com/ja_jp/elasticbeanstalk/latest/dg/customize-containers-ec2.html#linux-container-commands
  - コンテナコマンド container_commands > コマンド command
- Linux サーバーでのソフトウェアのカスタマイズ
  - https://docs.aws.amazon.com/ja_jp/elasticbeanstalk/latest/dg/customize-containers-ec2.html#linux-packages
  - packages
    - 複数のパッケージを指定できます
    - yum、rubygems、python、および rpm
    - 各パッケージマネージャ内では、パッケージのインストール順序は保証されません。
- マネージドプラットフォーム更新
  - https://docs.aws.amazon.com/ja_jp/elasticbeanstalk/latest/dg/environment-platform-update-managed.html
  - 定期的にプラットフォームの更新をリリースし、修正やソフトウェア更新、新機能を提供している
- Elastic Beanstalk 環境のプラットフォームバージョンの更新
  - https://docs.aws.amazon.com/ja_jp/elasticbeanstalk/latest/dg/using-features.platform.upgrade.html
  - 新しいプラットフォームバージョンを定期的にリリースして、すべての Linux ベースおよび Windows Server ベースの プラットフォームを更新
- [Elastic Beanstalk を使用したブルー/グリーンデプロイ](https://docs.aws.amazon.com/ja_jp/elasticbeanstalk/latest/dg/using-features.CNAMESwap.html)
- ライフサイクルポリシー
  - https://docs.aws.amazon.com/ja_jp/elasticbeanstalk/latest/dg/applications-lifecycle.html
  - 使用しなくなったバージョンを削除しないと、最終的にはアプリケーションバージョンのクォータ（1000/リージョン）に到達し、そのアプリケーションの新しいバージョンを作成できなくなります。
  - 一度に最大 100 個まで削除できる
- 環境の作成後に設定オプションを設定する
  - aws elasticbeanstalk update-environment
  - https://docs.aws.amazon.com/ja_jp/elasticbeanstalk/latest/dg/environment-configuration-methods-after.html

## OpsWorks

Chef や Puppet を使用して、Amazon EC2 インスタンスやオンプレミスのコンピューティング環境でのサーバーの設定、デプロイ、管理を自動化

- CloudFormation はほぼすべてのリソースを作成可能だが、OpsWorks はアプリケーション周りのリソース作成に限られる
  - EC2, EBS, Elastic IP, CloudWatch メトリクスなど
- Chef
  - Cookbook, Recipe と呼ばれる再利用しやすい構造の設定ファイル
  - Docker コンテナは扱わない。コンテナなら Elatic Beanstalk など。
- Puppet
- スタックやレイヤー
  - カスタム Cookbook オプションを OpsWorks スタックに設定する
    - 有効にしていない場合は、スタックの設定で有効にする
    - https://docs.aws.amazon.com/ja_jp/opsworks/latest/userguide/workingcookbook-installingcustom-enable.html
  - レイヤーにライフサイクルイベントに割り当てられたレシピ
- OpsWorks スタックはエージェントがサービスと 5 分以上通信しない場合、インスタンスに障害が発生したとみなします。
  - https://docs.aws.amazon.com/ja_jp/opsworks/latest/userguide/workinginstances-autohealing.html
- 移行スクリプト
  - Application Manager がインポートするための Cfn テンプレを生成可能
  - https://docs.aws.amazon.com/ja_jp/opsworks/latest/userguide/migrating-to-systems-manager.html
- レシピ実行に失敗した場合は、インスタンスはオンラインではないが、EC2 インスタンスは実行されているので、ログインしてレシピが正しく構成されているか確認
- 自動修復イベントで通知するには、EventBridge で、ソース「aws.opsworks」、「auto-healing」
- Docker の使用
  - https://aws.amazon.com/jp/blogs/devops/running-docker-on-aws-opsworks/
- https://docs.aws.amazon.com/ja_jp/opsworks/latest/userguide/workinginstances-os.html
  - スタックのインスタンスは Linux または Windows のいずれか。混合できない
  - インスタンスを手動で開始・停止、スケールできる
  - OpsWorks スタック外インスタンスも登録できる
- 外部 Cookbook
  - Opswork と Berkshelf
  - https://docs.aws.amazon.com/opsworks/latest/userguide/cookbooks-101-opsworks-berkshelf.html
- インスタンスの起動が完了後、セットアップ中アップデートをする。
  - インスタンスがオンラインになった場合、アップデートは自動で行わない。
  - https://docs.aws.amazon.com/ja_jp/opsworks/latest/userguide/workingsecurity-updates.html

## ECS

- [Amazon ECS での X-Ray デーモンの実行](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/xray-daemon-ecs.html)
  - 公式 Docker イメージの使用
  - タスク定義で UDP 2000 でポートマッピングで xra-daemon
  - アプリケーション側で、AWS_XRAY_DAEMON_ADDRESS 環境変数により xray-daemon:2000 を指定

## AWS Copilit CLI

https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/AWS_Copilot.html

ローカル開発環境から、Amazon ECS での本番稼働対応のコンテナ化されたアプリケーションの構築、リリース、および運用を簡素化します。

- copilot pipeline
  - codepipeline でパイプラインを迅速に管理するための CLI
    - copilot pipeline init マニフェストファイル(Pipeline.yml)作成
    - copilot pipeline update
    - copilot pipeline status

## AWS Resilience Hub

アプリケーションの復元力を検査・管理できるサービス。

- 重要機能
  - アプリケーションの追加
  - RTO・RPO 定義（復旧力ポリシー設定）
  - 復旧性評価
  - 定期的テストや検証機能
- [AWS Resilience Hub の概要](https://docs.aws.amazon.com/ja_jp/resilience-hub/latest/userguide/what-is.html)
- [AWS Resilience Hub アプリケーションにリソースを追加する](https://docs.aws.amazon.com/ja_jp/resilience-hub/latest/userguide/discover-structure.html)
  - CloudFormation スタックを最大 5 個まで指定可能
  - Resource Group を最大 5 個まで指定可能
  - AWS Service Catalog の AppRegistry
- 6 か月間、最大３つのアプリまで無料、その後 15 USD／月／アプリ

## Service Catalog

- AWS サービスのカタログを作成し、使用方法を制限する

## CA

- オンプレミスのプライベート CA を AWS のプライベート CA に変更、証明書失効リストを配布
  - [証明書失効オプション](https://docs.aws.amazon.com/ja_jp/privateca/latest/userguide/Create-CA-console.html#PcaCreateRevocation)
    - CRL 配布を有効にする
      - [証明書失効オプション] で、[CRL 配布を有効にする]
      - S3 バケットを作成
      - CloudFront ディストリビューションを作成

## API Gateway

- API Gateway での Canary リリースのデプロイ
  - https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/canary-release.html#api-gateway-canary-release-deployment-overview
- APIGateway + Lambda でバージョン１と２を同時利用
  - マッピングテンプレートでバックエンドからのレスポンスを調整する
- マッピングテンプレート
  - API Gateway がフロントエンド ⇔ バックエンドの形式にあうように変換する機能
  - フロントエンドがバックエンドの想定する形式ではないものを送信 → 統合リクエストマッピングテンプレート → バックエンド
  - バックエンドがフロントエンドの想定する形式ではないものを送信 → 統合レスポンスマッピングテンプレート → フロントエンド
  - https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/models-mappings.html

## EC2 EBS

- EBS ボリュームのバックアップ
  - Amazon Data Lifecycle Manager(DLM): スナップショットの作成、保持（S3）、削除
  - [Amazon EBS スナップショット](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/EBSSnapshots.html)
  - CW Ecents で ECS CreateSnapshot API Call を呼び出してスケジュールにしてもよい
- SSH 経由の root ログイン、パスワード認証無効のチェック
  - Amazon Inspector で
- スポットインスタンスを使う場合
  - ASG で複数のインスタンスタイプを指定することで、スポットインスタンスを起動できる可能性がアップ
  - 「要求に一致する利用可能なスポット容量がありません」
  - https://repost.aws/ja/knowledge-center/ec2-spot-instance-insufficient-capacity
- アプリケーションの異常を調査するには、CW エージェントをインストールして全てのログを CW logs に
- EC2 Image Builder を使って STIG(セキュリティ技術実装ガイド)に準拠させる
  - レシピ作成、イメージパイプライン作成
  - https://docs.aws.amazon.com/ja_jp/imagebuilder/latest/userguide/toe-stig.html#linux-os-stig
- EC2 を特定インスタンスタイプだけ。一致しないものリスト
  - AWS Config で特定のインスタンスタイプに一致しているか確認するルール
- NAT インスタンス
  - https://docs.aws.amazon.com/vpc/latest/userguide/route-table-options.html#route-tables-nat
  - Type: AWS::EC2::Route
    Properties:
    RouteTableId: !Ref PrivateRouteTable
    DestinationCidrBlock: 0.0.0.0/0
    NatGatewayId: !Ref NatGateway1
    or
    InstanceId: !Ref NatInstance1
- 暗号化されていない EBS を暗号化
- 暗号化されていないスナップショットを作成して、スナップショットを暗号化コピー、そこから暗号化した EBS で復元
- 暗号化された EBS をアタッチしてコピー

## WAF

- [Prepare for the OWASP Top 10 Web Application Vulnerabilities Using AWS WAF and Our New White Paper](https://aws.amazon.com/jp/blogs/aws/prepare-for-the-owasp-top-10-web-application-vulnerabilities-using-aws-waf-and-our-new-white-paper/)
- [Use AWS WAF to MitigateOWASP’s Top 10 WebApplication Vulnerabilities](https://d1.awsstatic.com/whitepapers/Security/aws-waf-owasp.pdf)
- マネージドルールで対応 or Marketplace もあるがコストかかる

## SQS

- Amazon SQS に基づくスケーリング
  - https://docs.aws.amazon.com/ja_jp/autoscaling/ec2/userguide/as-using-sqs-queue.html
  - CW でカスタムメトリクスを作成
    - ①ApproximateNumberOfMessages を取得
    - ②describe-auto-scaling-groups コマンドを使用してインスタンス数を取得
    - ③ ①÷② でインスタンスあたりのキュー数を算出
    - ④CW にメトリクス送信
    - ⑤ 上記メトリクスの敷居値でスケールするように、autoscaling put-scaling-policy

## IAM access advisor

- AWS organization の OU で使われているサービスを調べる
  - https://aws.amazon.com/jp/blogs/security/set-permission-guardrails-using-iam-access-advisor-analyze-service-last-accessed-information-aws-organization/

## AWS License Manager

ベンダーが提供するライセンスの管理

- https://docs.aws.amazon.com/ja_jp/license-manager/index.html
- https://docs.aws.amazon.com/cli/latest/reference/license-manager/list-usage-for-license-configuration.html
- https://dev.classmethod.jp/articles/reinvent2018-getting-start-license-manager/
- ゴールデン AMI を紐づけることで、その AMI からの起動するときにルールをチェックしてライセンスを超える場合は起動できなくなる

## Lambda@Edge

- A/B テスト
  - https://dev.classmethod.jp/articles/a-b-testing-with-cloudfront-and-lambda-at-edge/

## AWS Detective

- Detective の管理者アカウントを GuardDuty および Security Hub の管理者アカウントと一致させることが推奨
  - https://docs.aws.amazon.com/ja_jp/detective/latest/adminguide/detective-prerequisites.html#recommended-service-alignment
  -

## AWS Elastic Disaster Recovery

スケーラブルでコスト効率性に優れた AWS へのアプリケーションの復旧

https://aws.amazon.com/jp/disaster-recovery/
https://docs.aws.amazon.com/drs/latest/userguide/failback-preparing.html

パフォーマンスに影響を与えることなく、複製したい環境（ソースサーバー）を AWS アカウントに継続的にレプリケートします。

・最新時点のリカバリポイント
・過去のある時点を指定

Elastic Disaster Recovery とは
AWS Elastic Disaster Recovery とは、AWS の災害対策のためのサービスです。

パフォーマンスに影響を与えることなく、複製したい環境（ソースサーバー）を AWS アカウントに継続的にレプリケートします。
アイドル状態のリカバリサイトリソースを削除することで、従来のオンプレミスの災害対策ソリューションと比較してコストが削減され、手頃な AWS ストレージと最小限のコンピューティングリソースを活用して継続的なレプリケーションを維持します。

いつの時点にリカバリするかは、利用者が２パターンのうち一つを選ぶことができます。

・最新時点のリカバリポイント
・過去のある時点を指定

ポイントインタイムリカバリは、ランサムウェアなどのデータ破損イベントからのリカバリに役立ちます。
プライマリ環境で例えば、ランサムウェア等のデータ破損の問題が解決されたら、AWS Elastic Disaster Recovery を使用してリカバリされたアプリケーションをフェイルバックできます。

ドリル（訓練）

## EMR Serverless

クラスターを構成、最適化、チューニング、管理することなく Spark および Hive のアプリケーションを実行することができます。

https://docs.aws.amazon.com/ja_jp/emr/latest/EMR-Serverless-UserGuide/emr-serverless.html

- EMR Studio

## AWS Fault Injection Simulator

- 停止条件で CloudWatch アラームを設定
  - https://docs.aws.amazon.com/ja_jp/fis/latest/userguide/fis-tutorial-run-cpu-stress.html
  - https://docs.aws.amazon.com/ja_jp/fis/latest/userguide/stop-conditions.html

## AWS Managed Microsoft AD

- https://docs.aws.amazon.com/ja_jp/directoryservice/latest/admin-guide/directory_microsoft_ad.html
- [AWS Directory Service で AWS Secrets Manager を利用する方法](https://docs.aws.amazon.com/ja_jp/secretsmanager/latest/userguide/integrating_how-services-use-secrets_Dir.html)
  -
