# Amazon Elastic Container Service (Amazon ECS)

## はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## Contents

- [Amazon Elastic Container Service (Amazon ECS)](#amazon-elastic-container-service-amazon-ecs)
  - [はじめに](#はじめに)
  - [Contents](#contents)
  - [Amazon ECS とは](#amazon-ecs-とは)
  - [ハンズオン](#ハンズオン)
  - [ECS の構成要素](#ecs-の構成要素)
  - [タスク定義：タスクを作成する定義テンプレート](#タスク定義タスクを作成する定義テンプレート)
  - [クラスター：サービスとタスクを実行する基盤](#クラスターサービスとタスクを実行する基盤)
  - [サービス：実行中のタスクを管理する単位](#サービス実行中のタスクを管理する単位)
  - [タスク：起動する１つ以上のコンテナの集合](#タスク起動する１つ以上のコンテナの集合)

## Amazon ECS とは

コンテナ化されたアプリケーションのデプロイ、管理、スケーリングを容易にするフルマネージドコンテナオーケストレーションサービスです。

【AWS Black Belt Online Seminar】[Amazon Elastic Container Service (Amazon ECS)(YouTube)](https://www.youtube.com/watch?v=tmMLLjQrrRA)(1:00:02)

![blackbelt-ecs](/images/ecs/)

【AWS Black Belt Online Seminar】[CON201 ECS入門(YouTube)](https://www.youtube.com/watch?v=XAyrpXj4TVA)(0:20:28)

![blackbelt-ecs-start](/images/ecs/)

【AWS Black Belt Online Seminar】[CON202 ECS Fargate入門(YouTube)](https://www.youtube.com/watch?v=5fXwkTgWrjw)(0:16:29)

![blackbelt-ecs-fargate](/images/ecs/)

【AWS Black Belt Online Seminar】[CON371 Amazon ECS Anywhere(YouTube)](https://www.youtube.com/watch?v=2D0Sw-2e5UY)(0:18:36)

![blackbelt-ecs-anywhere](/images/ecs/)

【AWS Black Belt Online Seminar】 [CON207 Auto Scaling in ECS](https://www.youtube.com/watch?v=FeRkcA33-d0)(0:11:16)

![blackbelt-ecs-as](/images/ecs/)

【AWS Black Belt Online Seminar】[CON307 ECS Capacity Providers](https://www.youtube.com/watch?v=45uuyy16RS4)(0:17:47)

![blackbelt-ecs-cp](/images/ecs/)

【AWS Black Belt Online Seminar】 [CON303 Amazon Elastic Container Service − EC２ / Fargate Spot ことはじめ](https://www.youtube.com/watch?v=fvzbLMrteZg)(0:20:34)

![blackbelt-ecs-ec2-spot](/images/ecs/)

[Amazon Elastic Container Service サービス概要](https://aws.amazon.com/jp/ecs/)

[Amazon Elastic Container Service ドキュメント](https://docs.aws.amazon.com/ja_jp/ecs/?id=docs_gateway)

[Amazon Elastic Container Service よくある質問](https://aws.amazon.com/jp/ecs/faqs/)

[Amazon Elastic Container Service の料金](https://aws.amazon.com/jp/ecs/pricing/)

## ハンズオン

[Amazon ECS 入門ハンズオン](https://pages.awscloud.com/JAPAN-event-OE-Hands-on-for-Beginners-ECS-2022-reg-event.html)

[JP Contents Hub > Containers](https://aws-samples.github.io/jp-contents-hub/#containers)

## ECS の構成要素

Duration: 0:05:00

1. コンテナイメージの作成
2. コンテナイメージを ECR に Push
3. クラスター作成

   ```sh
   aws ecs create-cluster --cluster-name fargate-cluster
   ```

4. タスク定義の作成

   ```sh
   aws ecs register-task-definition --cli-input-json file://$HOME/tasks/fargate-task.json
   ```

5. サービスの作成

   ```sh
   aws ecs create-service --cluster fargate-cluster --service-name fargate-service --task-definition sample-fargate:1 --desired-count 1 --launch-type "FARGATE" --network-configuration "awsvpcConfiguration={subnets=[subnet-abcd1234],securityGroups=[sg-abcd1234]}" --enable-execute-command
   ```

## タスク定義：タスクを作成する定義テンプレート

Duration: 0:01:30

[Amazon ECSの タスク定義](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/task_definitions.html)

- [起動タイプ](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/launch_types.html)
  - Fargate（デフォルト）
  - EC2
  - 外部
- OS
  - Linux/X86_64
  - Linux/ARM64
  - Windows
- タスクサイズ
  - CPU、メモリ
- コンテナイメージ
- ネットワークモード
  - awsvpc（デフォルト）
  - bridge
  - host
  - 詳細はこちら [Amazon ECS タスクネットワーキング](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-networking.html)
- タスクロール
  - タスクに割り当てる IAM ロールを指定します。
  - [Amazon ECS タスク実行IAM ロール](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/task_execution_IAM_role.html) とは、タスクを起動する際に必要となる権限を設定したロールです。主に次のようなものを設定しておきます。
    - ECR から コンテナイメージを Pull するための権限
    - CloudWatch Logs にログを記録するための権限
    - タスク実行 IAM ロールの他に、[タスク IAM ロール](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/task-iam-roles.html) というものがありますが、こちらはコンテナ化したアプリケーションから実行するのに必要な権限を設定したロールです。例えば、S3 へのアクセスなどです。

## クラスター：サービスとタスクを実行する基盤

## サービス：実行中のタスクを管理する単位

[Amazon ECS サービス](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/ecs_services.html)

サービスは、指定した数のタスクを維持したり、ロードバランサーなど、実行するタスクの管理をする単位です。

## タスク：起動する１つ以上のコンテナの集合

