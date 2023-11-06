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
  - [クラスター：サービスとタスクを実行する基盤](#クラスターサービスとタスクを実行する基盤)
  - [サービス：実行中のタスクを管理する単位](#サービス実行中のタスクを管理する単位)
  - [タスク：起動する１つ以上のコンテナの集合](#タスク起動する１つ以上のコンテナの集合)
  - [タスク定義：タスクを作成する定義テンプレート](#タスク定義タスクを作成する定義テンプレート)
    - [memoryReservation（ソフト制限）とmemory（ハード制限）の組み合わせ](#memoryreservationソフト制限とmemoryハード制限の組み合わせ)
  - [ECS クラスタ作成手順](#ecs-クラスタ作成手順)
  - [AWS Copilot](#aws-copilot)
  - [まとめ](#まとめ)

## Amazon ECS とは

Duration: 2:45:12

コンテナ化されたアプリケーションのデプロイ、管理、スケーリングを容易にするフルマネージドコンテナオーケストレーションサービスです。

【AWS Black Belt Online Seminar】[Amazon Elastic Container Service (Amazon ECS)(YouTube)](https://www.youtube.com/watch?v=tmMLLjQrrRA)(1:00:02)

![blackbelt-ecs](/images/ecs/blackbelt-ecs-s.jpg)

【AWS Black Belt Online Seminar】[CON201 ECS入門(YouTube)](https://www.youtube.com/watch?v=XAyrpXj4TVA)(0:20:28)

![blackbelt-ecs-start](/images/ecs/blackbelt-ecs-start-s.jpg)

【AWS Black Belt Online Seminar】[CON202 ECS Fargate入門(YouTube)](https://www.youtube.com/watch?v=5fXwkTgWrjw)(0:16:29)

![blackbelt-ecs-fargate](/images/ecs/blackbelt-ecs-fargate-start-s.jpg)

【AWS Black Belt Online Seminar】[CON371 Amazon ECS Anywhere(YouTube)](https://www.youtube.com/watch?v=2D0Sw-2e5UY)(0:18:36)

![blackbelt-ecs-anywhere](/images/ecs/blackbelt-ecs-anywhere-s.jpg)

【AWS Black Belt Online Seminar】 [CON207 Auto Scaling in ECS](https://www.youtube.com/watch?v=FeRkcA33-d0)(0:11:16)

【AWS Black Belt Online Seminar】[CON307 ECS Capacity Providers](https://www.youtube.com/watch?v=45uuyy16RS4)(0:17:47)

![blackbelt-ecs-cp](/images/ecs/blackbelt-ecs-cp-s.jpg)

【AWS Black Belt Online Seminar】 [CON303 Amazon Elastic Container Service − EC２ / Fargate Spot ことはじめ](https://www.youtube.com/watch?v=fvzbLMrteZg)(0:20:34)

![blackbelt-ecs-ec2-spot](/images/ecs/blackbelt-ecs-ec2-spot-s.jpg)

[Amazon Elastic Container Service サービス概要](https://aws.amazon.com/jp/ecs/)

[Amazon Elastic Container Service ドキュメント](https://docs.aws.amazon.com/ja_jp/ecs/?id=docs_gateway)

[Amazon Elastic Container Service よくある質問](https://aws.amazon.com/jp/ecs/faqs/)

[Amazon Elastic Container Service の料金](https://aws.amazon.com/jp/ecs/pricing/)

## ハンズオン

Duration: 0:00:00

[Amazon ECS 入門ハンズオン](https://pages.awscloud.com/JAPAN-event-OE-Hands-on-for-Beginners-ECS-2022-reg-event.html)

[JP Contents Hub > Containers](https://aws-samples.github.io/jp-contents-hub/#containers)

## ECS の構成要素

Duration: 0:01:00

![ecs-components](/images/ecs/ecs-components_no.png)

1. クラスター
1. サービス
1. タスク
1. タスク定義

## クラスター：サービスとタスクを実行する基盤

Duration: 0:01:00

![ecs-components-1](/images/ecs/ecs-components_no-1.jpg)

起動タイプが EC2 の場合、EC2 インスタンス群のことです。
Fargate の場合は、どのインスタンスで動いているかは隠ぺいされているので、論理的なグループに過ぎない。

システム、環境などで分けるのが一般的だと思われます。

[Amazon ECS のサービスクォータ](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/service-quotas.html) の制限もあるので、クラスターを分けることで、クォータの制限を回避できる場合があります。

また、「Container Insights」を有効化したクラスタと無効化したクラスタを作成することで、CloudWatchのカスタムメトリクスの不要なコストを削減することもできます。

## サービス：実行中のタスクを管理する単位

Duration: 0:01:00

[Amazon ECS サービス](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/ecs_services.html)

![ecs-components-2](/images/ecs/ecs-components_no-2.jpg)

サービスは、指定した数のタスクを維持したり、ロードバランサーなど、実行するタスクの管理をする単位です。

## タスク：起動する１つ以上のコンテナの集合

Duration: 0:01:00

![ecs-components-3](/images/ecs/ecs-components_no-3.jpg)

タスク定義とよばれる定義テンプレートに従って起動されるコンテナの集まりです。
タスクの単位で、CPU やメモリの割り当てを行い、割り当てられた範囲でコンテナを起動します。

## タスク定義：タスクを作成する定義テンプレート

Duration: 0:05:00

[Amazon ECSの タスク定義](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/task_definitions.html)

![ecs-components-4](/images/ecs/ecs-components_no-4.jpg)

タスク定義は、次のようになります。（公式のサンプル）

```json
{
   "containerDefinitions": [ 
      { 
         "command": [
            "/bin/sh -c \"echo '<html> <head> <title>Amazon ECS Sample App</title> <style>body {margin-top: 40px; background-color: #333;} </style> </head><body> <div style=color:white;text-align:center> <h1>Amazon ECS Sample App</h1> <h2>Congratulations!</h2> <p>Your application is now running on a container in Amazon ECS.</p> </div></body></html>' >  /usr/local/apache2/htdocs/index.html && httpd-foreground\""
         ],
         "entryPoint": [
            "sh",
            "-c"
         ],
         "essential": true,
         "image": "httpd:2.4",
         "logConfiguration": { 
            "logDriver": "awslogs",
            "options": { 
               "awslogs-group" : "/ecs/fargate-task-definition",
               "awslogs-region": "us-east-1",
               "awslogs-stream-prefix": "ecs"
            }
         },
         "name": "sample-fargate-app",
         "portMappings": [ 
            { 
               "containerPort": 80,
               "hostPort": 80,
               "protocol": "tcp"
            }
         ]
      }
   ],
   "cpu": "256",
   "executionRoleArn": "arn:aws:iam::012345678910:role/ecsTaskExecutionRole",
   "family": "fargate-task-definition",
   "memory": "512",
   "networkMode": "awsvpc",
   "runtimePlatform": {
        "operatingSystemFamily": "LINUX"
    },
   "requiresCompatibilities": [ 
       "FARGATE" 
    ]
}
```

代表的なパラメータは次のとおりです。その他のパラメータについては、「[タスク定義パラメータ](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/task_definition_parameters.html)」を参照してください。

- [ファミリー名](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/task_definition_parameters.html#family)
  - タスク定義の名称を指定します。
- [起動タイプ](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/launch_types.html)
  - Fargate（デフォルト）
  - EC2
  - 外部
- [ランタイムプラットフォーム](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/task_definition_parameters.html#runtime-platform)
  - Fargate では必須のパラメータで、operatingSystemFamily とcpuArchitectureを指定します。デフォルトは、Linux/X86_64 です。
  - Linux/X86_64
  - Linux/ARM64
  - Windows
- [タスクサイズ](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/task_definition_parameters.html#task_size)
  - タスクが使用する CPU、メモリの合計量を指定
  - 起動タイプが `EC2` の場合は省略可能です。省略した場合は、EC2 インスタンスのスペックが上限となります。
  - 起動タイプが `Fargate` の場合は特定の組み合わせのみ指定可能です。
- [ネットワークモード](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/task_definition_parameters.html#network_mode)
  - awsvpc（タスクにENIが割り当てられる）
  - host（ホストのENIに直接マッピング）
  - bridge（ホスト内でのみ）
  - none(外部へ接続できない)
  - 詳細はこちら [Amazon ECS タスクネットワーキング](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-networking.html)
- [タスク実行ロール](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/task_definition_parameters.html#execution_role_arn)
  - [Amazon ECS タスク実行IAM ロール](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/task_execution_IAM_role.html) とは、タスクを起動する際に必要となる権限を設定したロールです。主に次のようなものを設定しておきます。  
    - ECR から コンテナイメージを Pull するための権限
    - CloudWatch Logs にログを記録するための権限
- [タスクロール](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/task_definition_parameters.html#task_role_arn)
  - [タスク IAM ロール](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/task-iam-roles.html) とは、コンテナ化したアプリケーションから実行するのに必要な権限を設定したロールです。例えば、S3 へのアクセスなどです。EC2 でいうところの `インスタンスプロファイル` のようなものです。
- [コンテナ定義](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/task_definition_parameters.html#container_definitions)
  - タスクで起動するコンテナの定義です。コンテナごとに定義します。
  - name
    - コンテナの名前です
  - image
    - Docker Hub や ECR のイメージを指定します
  - memory
    - コンテナが使用するメモリの最大量。コンテナはこのメモリを超えることはできません。
    - タスク内のコンテナの総 memory は、タスクサイズ で指定した cpu を超えることはできません。
  - memoryReservation
    - memoryReservation はコンテナに確保する最低限のメモリ量を指定します。
    - 設定した値を超えるメモリが必要な場合は、空きメモリを自動で割り当てます。ただし、memory で指定した値まで。
    - タスクサイズ memory ≧ コンテナ定義 memory ≧ コンテナ定義 memoryReservation
  - cpu
    - タスク内のコンテナの総 cpu は、タスクサイズ で指定した cpu を超えることはできません。

### memoryReservation（ソフト制限）とmemory（ハード制限）の組み合わせ

Duration: 0:01:00

`memoryReservation` と `memory` のパラメータは指定有無などの組み合わせによって割り当てが異なります。

| memoryReservation（ソフト制限） | memory（ハード制限） | 予約メモリ～上限メモリ                          |
| ------------------------------- | -------------------- | ----------------------------------------------- |
| 未指定                          | 3072 MiB             | 3072 MiB ～ 3072 MiB                            |
| 2048 MiB                        | 未指定               | 2048 MiB ～  タスクサイズのmemory / EC2のメモリ |
| 2048 MiB                        | 3072 MiB             | 2048 MiB ～ 3072 MiB                            |

## ECS クラスタ作成手順

Duration: 0:00:30

1. コンテナイメージの作成
2. コンテナイメージを ECR に Push
3. クラスター作成

   ```sh
   aws ecs create-cluster --cluster-name fargate-cluster
   ```

   ![ecs-create-00-cluster](/images/ecs/ecs-create-00-cluster-s.jpg)

4. タスク定義の作成

   ```sh
   aws ecs register-task-definition --cli-input-json file://$HOME/tasks/fargate-task.json
   ```
   
   ![ecs-create-01-taskdef](/images/ecs/ecs-create-01-taskdef-s.jpg)

5. サービスの作成

   ```sh
   aws ecs create-service --cluster fargate-cluster --service-name fargate-service \
   --task-definition sample-fargate:1 --desired-count 1 --launch-type "FARGATE" \
   --network-configuration "awsvpcConfiguration={subnets=[subnet-abcd1234],securityGroups=[sg-abcd1234]}" \
   --enable-execute-command
   ```

   ![ecs-create-02-service](/images/ecs/ecs-create-02-service-s.jpg)

## AWS Copilot

Duration: 0:00:30

[AWS Copilot](https://aws.amazon.com/jp/containers/copilot/)

AWS Cpilot(コパイロット)とは、Amazon ECS CLI の後継にあたるもので、コンテナ化されたアプリケーション用のコマンドラインインターフェイスです。

コマンド１つといくつかの設定で、可用性を考慮した構成や LB の構築、設定などを行ってくれるというものです。

詳しい使い方はこちら。
https://aws.github.io/copilot-cli/ja/

## まとめ

![ecs](/images/all/ecs.png)