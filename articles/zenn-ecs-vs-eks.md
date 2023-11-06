---
title: "【初心者向け】Amazon ECS と EKS について改めて整理してみた" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: true
---

# ECS（Elastic Container Service）とEKS（Elastic Kubernetes Service）

## はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## Contents

- [ECS（Elastic Container Service）とEKS（Elastic Kubernetes Service）](#ecselastic-container-serviceとekselastic-kubernetes-service)
  - [はじめに](#はじめに)
  - [Contents](#contents)
  - [ECS と EKS とは](#ecs-と-eks-とは)
    - [コンテナオーケストレーション](#コンテナオーケストレーション)
    - [コントロールプレーン](#コントロールプレーン)
    - [データプレーン](#データプレーン)
    - [データプレーン の種類](#データプレーン-の種類)
  - [4つのアーキテクチャパターン](#4つのアーキテクチャパターン)
  - [ECS と EKS のサービスの利用想定](#ecs-と-eks-のサービスの利用想定)
  - [比較](#比較)
  - [付録：AWS コンテナロードマップ](#付録aws-コンテナロードマップ)
  - [付録：コンテナセキュリティ](#付録コンテナセキュリティ)

## ECS と EKS とは

簡単にいうと、コンテナオーケストレーションのソフトウェアが、[Kubernetes (K8s)](https://kubernetes.io/ja/docs/concepts/overview/) か AWS オリジナルか、という違いです。

- EKS（Elastic Kubernetes Service）
  - Amazon Web Services (AWS) 上で、独自の Kubernetes コントロールプレーンをインストール、運用、保守する必要がないフルマネージドコンテナオーケストレーションサービスです。
- ECS（Elastic Container Service）
  - EKS は コンテナオーケストレーション に Kubernetes を利用していますが、ECS は　AWS オリジナルのソフトウェアをベースに構築されている コンテナ化されたアプリケーションのデプロイ、管理、スケーリングを容易にするフルマネージドコンテナオーケストレーションサービスです。

### コンテナオーケストレーション

コンテナのワークロードやサービス、ライフサイクル管理やデプロイメント等のコンテナに関わる調整と管理の自動化技術のことで、コントロールプレーンとデータプレーンから成り立っています。

![container-orchestration](/images/ecs-vs-eks/container-orchestration.png)

※ 【AWS Black Belt Online Seminar】CON120 AWSコンテナ全体概要 より引用

### コントロールプレーン

コントロールプレーンとは、コンテナを管理する機能（＝コンテナオーケストレータ）のことを指します。
つまり、ECS、EKSのことです。

### データプレーン

データプレーンとは、コンテナが実際に稼働するリソース環境を指します。

AWS が提供するデータプレーンは次の2種類あります。

- EC2
- Fargate

### データプレーン の種類

AWS が提供するデータプレーンは次の2種類あります。

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
    - コンテナイメージをキャッシュできないので EC2 タイプに比べてデプロイが遅い
      - ただし、ロードマップ上には、[[Fargate/ECS] [Image caching]: provide image caching for Fargate.](https://github.com/aws/containers-roadmap/issues/696) があるので将来的には・・
    - EC2 タイプに比べて価格が高い

これだけを見ると、Fargate のデメリットが多いように思えますが、コンテナが実際に稼働するリソース環境の運用から解放されるのは非常に大きなメリットですので、作業要員のコストも考えるとデメリットを上回る価値があると考えられます。
よって、まずは Fargate を利用することができないかを検討するのが良いと思います。

## 4つのアーキテクチャパターン

コントロールプレーンとデータプレーンの組み合わせで 4つのアーキテクチャパターンがあります。

![pattern-matrix](/images/ecs-vs-eks/pattern-matrix.png)

それぞれのパターンの構成概要図は次の通りです。

- ECS on Fargate

![ecs-fargate-pattern](/images/ecs-vs-eks/ecs-fargate-pattern.png)

- ECS on EC2

![ecs-ec2-pattern](/images/ecs-vs-eks/ecs-ec2-pattern.png)

- EKS on Fargate

![eks-fargate-pattern](/images/ecs-vs-eks/eks-fargate-pattern.png)

※ 2023年10月現在、Fargate には 1つの Pod しか起動できない制約([Fargate Pod の設定](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/fargate-pod-configuration.html))があります。そのため、[DaemonSet](https://kubernetes.io/ja/docs/concepts/workloads/controllers/daemonset/) が利用できません。ログ集約などで利用したい場合、サイドカーコンテナを作成する方法があります。（参考：[AWS Fargate で Amazon EKS を使用するときにアプリケーションログをキャプチャする方法](https://aws.amazon.com/jp/blogs/news/how-to-capture-application-logs-when-using-amazon-eks-on-aws-fargate/)）

- EKS on EC2

![eks-ec2-pattern](/images/ecs-vs-eks/eks-ec2-pattern.png)

## ECS と EKS のサービスの利用想定

簡単に書くと、次のような利用想定です。

- EKS（Elastic Kubernetes Service）
  - 既に [Kubernetes (K8s)](https://kubernetes.io/ja/docs/concepts/overview/)を利用している、またはこれから積極的に利用してコンテナの管理を行いたい
  - オンプレミスや他のクラウド上でも稼働させたい
- ECS（Elastic Container Service）
  - K8s の運用経験がないか、K8s よりも簡単にコンテナの管理を行いたい
    - K8s は 基本的に 3か月に1回のアップデートが行われるため、アップデートに追従するために運用コストが高くなる傾向があります。
  - AWS のみで利用できればよい

## 比較

コントロールプレーン（ECS と EKS）×データプレーン（EC2 と Fargate）から、4パターンの選択肢があります。

![ecs-eks-ec2-fargate](/images/ecs-vs-eks/ecs-eks-ec2-fargate.png)

※ 【AWS Black Belt Online Seminar】CON120 AWSコンテナ全体概要 より引用

それぞれのパターンをいくつかの比較項目で、3段階の評価を行い比較した結果は次のとおりです。

※個人的な解釈をベースとザックリと比較した結果となっておりますので、参考程度にお読みください。

◎・・・3点、○・・・2点、△・・・1点

| 比較項目         | EKS on EC2 | EKS on Fargeate | ECS on EC2 | ECS on Fargate |
| :--------------- | :--------: | :-------------: | :--------: | :------------: |
| 利用料金(※1)     |     ○      |        ○        |     ○      |       ○        |
| 運用コスト       |     △      |        ◎        |     △      |       ◎        |
| 学習コスト       |     △      |        △        |     ◎      |       ◎        |
| 拡張性           |     ◎      |      ○(※2)      |     ◎      |     ○(※2)      |
| 信頼性           |     ◎      |      ◎(※3)      |     ◎      |     ◎(※3)      |
| 事例の豊富さ(※4) |     ◎      |        ◎        |     ◎      |       ◎        |
|                  |            |                 |            |                |
| 総合得点         |   13 点    |      14 点      |   15 点    |     16 点      |

※1 ... アジアパシフィック（東京）リージョンで Linux を利用した場合の比較

Fargate のほうが EC2 に比べてコストが高いが、3段階評価で差が出るほどではないとの判断。
[2019年1月](https://aws.amazon.com/jp/about-aws/whats-new/2019/01/announcing-aws-fargate-price-reduction-by-up-to-50-/) に Fargate の大幅な値下げがあったため、以前に比べて利用しやすくなっています。

| スペック       | Fargate     | EC2                       | Fargate vs EC2 |
| -------------- | ----------- | ------------------------- | -------------- |
| 2 vCPU/ 4 GB   | USD 0.09858 | USD 0.0856（c6g.large）   | + 15 %          |
| 8 vCPU/ 16 GB  | USD 0.39432 | USD 0.3638（c7g.2xlarge） | + 8 %           |
| 16 vCPU/ 32 GB | USD 0.78864 | USD 0.7277（c7g.4xlarge） | + 8 %           |

アジアパシフィック（東京）リージョンでの Fargate 利用料金
1 時間あたりの vCPU 単位　＞ USD 0.04045
1 時間あたりの GB 単位 ＞ USD 0.00442

※2 ... コンテナが稼働するリソース環境にはいくつか制限があります

- [エフェメラルストレージは最大 200GB](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/fargate-task-storage.html)
- [AWS Fargate の料金](https://aws.amazon.com/jp/fargate/pricing/)にもあるとおり、2023年10月現在では 16 vCPU/32~120 GB メモリという上限があります。
- EKS on Fargate は Pod を１つしか構成できません。([Fargate Pod の設定](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/fargate-pod-configuration.html))
  - [AWS Fargate で Amazon EKS を使用するときにアプリケーションログをキャプチャする方法](https://aws.amazon.com/jp/blogs/news/how-to-capture-application-logs-when-using-amazon-eks-on-aws-fargate/)

※3 ... 以前はコンテナに接続するには自前で sshd を立てるなどしなければならなかったが、「[Amazon ECS Exec](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/userguide/ecs-exec.html)」により障害調査はしやすくなった

※4 ... EKS on Fargate が一般公開されたのが2019年12月であるため、2023年10月現在では事例も数多く存在し、それぞれのパターンで差がないと判断。

2014/11/13 Amazon ECS

2018/06/05 [Amazon Elastic Container Service for Kubernetes が利用可能となりました。](https://aws.amazon.com/jp/about-aws/whats-new/2018/06/amazon-elastic-container-service-for-kubernetes-eks-now-ga/)

2017/11/30 [AWS Fargateの紹介 – インフラストラクチャの管理不要でコンテナを起動](https://aws.amazon.com/jp/blogs/news/aws-fargate/)

2019/12/05 [AWS Fargate 上の Amazon EKS を一般公開](https://aws.amazon.com/jp/blogs/news/amazon-eks-on-aws-fargate-now-generally-available/)

2021/05/27 [Amazon Elastic Container Service Anywhere が利用可能に](https://aws.amazon.com/jp/about-aws/whats-new/2021/05/amazon-elastic-container-service-anywhere-is-now-generally-available/)

2021/09/10 [Amazon EKS Anywhere — オンプレミスで Kubernetes クラスターの作成と管理が広く利用可能になりました](https://aws.amazon.com/jp/blogs/news/amazon-eks-anywhere-now-generally-available-to-create-and-manage-kubernetes-clusters-on-premises/)

## 付録：AWS コンテナロードマップ

[aws-containers-roadmap](https://github.com/aws/containers-roadmap/)

![aws-containers-roadmap](/images/ecs-vs-eks/aws-containers-roadmap-s.jpg)

## 付録：コンテナセキュリティ

- [NECセキュリティブログ>特権コンテナの脅威から学ぶコンテナセキュリティ](https://jpn.nec.com/cybersecurity/blog/210730/index.html)

- [【IPA】NIST SP800-190 アプリケーションコンテナセキュリティガイド](https://www.ipa.go.jp/security/reports/oversea/nist/ug65p90000019cp4-att/000085279.pdf)

- [AWS ドキュメント > AWS Fargate のセキュリティ](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/bestpracticesguide/security-fargate.html)

- [AWS ドキュメント > タスクとコンテナのセキュリティ](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/bestpracticesguide/security-tasks-containers.html)