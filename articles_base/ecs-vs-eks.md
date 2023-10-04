# ECS（Elastic Container Service）とEKS（Elastic Kubernetes Service）

## はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## Contents

- [ECS（Elastic Container Service）とEKS（Elastic Kubernetes Service）](#ecselastic-container-serviceとekselastic-kubernetes-service)
  - [はじめに](#はじめに)
  - [Contents](#contents)
  - [それぞれのサービスの利用想定](#それぞれのサービスの利用想定)
  - [コントロールプレーン](#コントロールプレーン)
  - [データプレーン](#データプレーン)
  - [比較](#比較)

## それぞれのサービスの利用想定

簡単に書くと、次のような利用想定です。

- EKS（Elastic Kubernetes Service）
  - 既に [Kubernetes (K8s)](https://kubernetes.io/ja/docs/concepts/overview/)を利用している、またはこれから積極的に利用してコンテナの管理を行いたい
  - オンプレミスや他のクライド上でも稼働させたい
- ECS（Elastic Container Service）
  - K8s の運用経験がないか、K8s よりも簡単にコンテナの管理を行いたい
  - AWS のみで利用できればよい

## コントロールプレーン

コントロールプレーンとは、コンテナを管理する機能（＝コンテナオーケストレータ）のことを指します。
つまり、ECS、EKSのことです。

## データプレーン

データプレーンとは、コンテナが実際に稼働するリソース環境を指します。AWS が提供するデータプレーンは次の2種類あります。

- EC2
  - コンテナが稼働するリソースの管理を利用者自身で行うもの
  - メリット
    - スペック（CPUコア数、メモリ、ストレージ 等）が柔軟に選択できる
    - 実稼働リソースの OS に直接介入することが出来る（カーネルパラメータなどをチューニングする 等）
    - コンテナイメージを EC2 内にキャッシュできるので Fargate タイプに比べてデプロイが早い
  - デメリット
    - ホストの管理（サーバのスケーリング、パッチ 等）が必要
- Fargate
  - コンテナが稼働するリソースの管理を AWS が行ってくれるもの
  - メリット
    - ホストの管理（サーバのスケーリング、パッチ 等）が不要
  - デメリット
    - スペック（CPUコア数、メモリ、ストレージ 等）に制限がある（決まった構成からのみ選択可能）
    - 実稼働リソースの OS に直接介入することが出来ない（カーネルパラメータなどをチューニングする 等）
    - EC2 タイプに比べて価格が高い
    - コンテナイメージをキャッシュできないので EC2 タイプに比べてデプロイが遅い
      - ただし、ロードマップ上には、[[Fargate/ECS] [Image caching]: provide image caching for Fargate.](https://github.com/aws/containers-roadmap/issues/696) があるので将来的には・・

これだけを見ると、Fargate のデメリットが多いように思えますが、コンテナが実際に稼働するリソース環境の運用から解放されるのは非常に大きなメリットですので、作業要員のコストも考えるとデメリットを上回る価値があると考えられます。
よって、まずは Fargate を利用することができないかを検討するのが良いと思います。

## 比較

◎・・・3点
○・・・2点
△・・・1点

| 比較項目       | EKS on EC2 | EKS on Fargeate | ECS on EC2 | ECS on Fargate |
| :------------- | :--------: | :-------------: | :--------: | :------------: |
| 利用料金※1     |     ○      |        ○        |     ○      |       ○        |
| 運用コスト     |     △      |        ◎        |     △      |       ◎        |
| 学習コスト     |     △      |        △        |     ◎      |       ◎        |
| 拡張性         |     ◎      |       ○※2       |     ◎      |      ○※2       |
| 信頼性         |     ◎      |       ◎※3       |     ◎      |      ◎※3       |
| 事例の豊富さ※4 |     ◎      |        ◎        |     ◎      |       ◎        |
|                |            |                 |            |                |
| 総合得点       |   13 点    |      14 点      |   15 点    |     16 点      |

※1 ... アジアパシフィック（東京）リージョンで Linux を利用した場合の比較

| スペック       | Fargate     | EC2                       | Fargate vs EC2 |
| -------------- | ----------- | ------------------------- | -------------- |
| 2 vCPU/ 4 GB   | USD 0.09858 | USD 0.0856（c6g.large）   | + 15 %          |
| 8 vCPU/ 16 GB  | USD 0.39432 | USD 0.3638（c7g.2xlarge） | + 8 %           |
| 16 vCPU/ 32 GB | USD 0.78864 | USD 0.7277（c7g.4xlarge） | + 8 %           |

アジアパシフィック（東京）リージョンでの Fargate 利用料金
1 時間あたりの vCPU 単位　＞ USD 0.04045
1 時間あたりの GB 単位 ＞ USD 0.00442

※2 ... コンテナが稼働するリソース環境にはいくつか制限がある

- [エフェメラルストレージは最大 200GB](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/fargate-task-storage.html)
- [AWS Fargate の料金](https://aws.amazon.com/jp/fargate/pricing/)にもあるとおり、2023年10月現在では 16 vCPU/32~16GB メモリという上限があります。

※3 ... 以前はコンテナに接続するには自前で sshd を立てるなどしなければならなかったが、「[Amazon ECS Exec](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/userguide/ecs-exec.html)」により障害調査はしやすくなった

※4 EKS on Fargate が一般公開されたのが2019年12月であるため、2023年10月現在では事例も数多く存在し、それぞれのパターンで差がないと判断。

2014/11/13 Amazon ECS

2018/06/05 [Amazon Elastic Container Service for Kubernetes が利用可能となりました。](https://aws.amazon.com/jp/about-aws/whats-new/2018/06/amazon-elastic-container-service-for-kubernetes-eks-now-ga/)

2017/11/30 [AWS Fargateの紹介 – インフラストラクチャの管理不要でコンテナを起動](https://aws.amazon.com/jp/blogs/news/aws-fargate/)

2019/12/05 [AWS Fargate 上の Amazon EKS を一般公開](https://aws.amazon.com/jp/blogs/news/amazon-eks-on-aws-fargate-now-generally-available/)

2021/05/27 [Amazon Elastic Container Service Anywhere が利用可能に](https://aws.amazon.com/jp/about-aws/whats-new/2021/05/amazon-elastic-container-service-anywhere-is-now-generally-available/)

2021/09/10 [Amazon EKS Anywhere — オンプレミスで Kubernetes クラスターの作成と管理が広く利用可能になりました](https://aws.amazon.com/jp/blogs/news/amazon-eks-anywhere-now-generally-available-to-create-and-manage-kubernetes-clusters-on-premises/)