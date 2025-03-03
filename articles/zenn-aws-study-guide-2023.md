---
title: "AWS 初心者向け！上から順に実施すればよい AWS 学習教材完全ガイド 2023年最新版" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: false
---
<!--# AWS 学習教材完全ガイド 2023年最新版-->

AWS 初心者が AWS を理解していくのに必要になる学習教材について、AWS Black Belt Online Seminar を中心にまとめたものになります。
上の項目から順番に学習していくことで、脱 AWS 初心者となれるようにしております。

**Let's try AWS Certified Solutions Architect – Associate !!**

## 全体像

![study-loadmap](/images/all/study-loadmap.png)

## Basics

- クラウド (クラウドサービス) とは？
  - https://aws.amazon.com/jp/cloud/
- AWSとは
  - https://aws.amazon.com/jp/what-is-aws/
- グローバルインフラストラクチャ
  - https://docs.aws.amazon.com/ja_jp/whitepapers/latest/aws-overview/global-infrastructure.html
- 責任共有モデル
  - https://aws.amazon.com/jp/compliance/shared-responsibility-model/
  - AWS 責任共有モデルについて- AWS セキュリティとコンプライアンス
    - https://www.youtube.com/watch?v=16LiIHbrQFw
- クラウドコンピューティングの 6 つの長所
  - https://docs.aws.amazon.com/ja_jp/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html
- Well-Architected Framework について
  - AWS Well-Architected Framework
    - https://youtu.be/jMJFFo1Oybo
  - クラウド設計・運用のベストプラクティス集 “AWS Well-Architected Framework”
    - https://www.youtube.com/watch?v=MgyLqnkSxn4
  - Well-Architected Frameworkによるコスト最適化
    - https://pages.awscloud.com/rs/112-TZM-766/images/20190312_AWS-BlackBelt_Cost_Optimazed_with_WA.pdf
- 3層アーキテクチャとは
  - https://docs.aws.amazon.com/ja_jp/whitepapers/latest/serverless-multi-tier-architectures-api-gateway-lambda/three-tier-architecture-overview.html
- タグ戦略
  - https://docs.aws.amazon.com/ja_jp/whitepapers/latest/tagging-best-practices/building-your-tagging-strategy.html
- MFA
  - https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_credentials_mfa.html
- コスト最適化
  - AWSの支払方法
    - https://pages.awscloud.com/rs/112-TZM-766/images/20200820_AWS_Payment_Information_1pager.pdf
  - Cost Explorer
    - https://youtu.be/Yx7Q6peW5u0
  - Cost Explorer 使用状況レポート
    - https://pages.awscloud.com/rs/112-TZM-766/images/AWS-Utilization-1-pager.pdf
  - Savings Plansでコスト最適化
    - https://pages.awscloud.com/rs/112-TZM-766/images/20200420_AWS_Savings_Plans_1pager.pdf
  - 請求アラーム
    - https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html
- 用語集
  - https://docs.aws.amazon.com/ja_jp/general/latest/gr/glos-chap.html
- AWS マンガ
  - https://aws.amazon.com/jp/campaigns/manga/series/

## コンピューティング

- Amazon EC2
  - Amazon EC2
    - https://www.youtube.com/watch?v=_Rbmhns0CxU
  - Amazon EC2入門
    - https://youtu.be/1ALvDtb2ziM
  - AWS EC2 Image Builder
    - https://youtu.be/MDSnM68JMOs
- Amazon EC2 スポットインスタンス
  - AWS EC2 スポットインスタンスの基礎
    - https://youtu.be/3blgtNU-ZV0
  - Amazon EC2スポットインスタンス
    - https://youtu.be/e-L-1z08j8Q
  - Amazon EC2 スポットインスタンス活用のための 6 つのベストプラクティスと実践例
    - https://youtu.be/HRaDSZ8N5TA
  - 【初級】Amazon EC2インスタンスタイプの選び方ガイド | AWS Summit Tokyo 2019
    - https://www.youtube.com/watch?v=Q1LUX8WMjHY
- Amazon EC2 AutoScaling
  - Amazon EC2 Auto Scaling 入門編
    - https://youtu.be/B8RIZmTH7dk
  - Amazon EC2 Auto Scaling 複数のインスタンスタイプと購入オプションの活用編
    - https://youtu.be/CYSDzVCUBVA
- AWS Elastic Beanstalk
  - AWS Elastic Beanstalk 入門
    - https://www.youtube.com/watch?v=LhmFZryVLiI
  - AWS Elastic Beanstalk
    - https://d1.awsstatic.com/webinars/jp/pdf/services/20170111_AWS-Blackbelt-Elastic-Beanstalk.pdf
- Amazon Lightsail
  - Amazon Lightsail
    - https://pages.awscloud.com/rs/112-TZM-766/images/20170118_AWS-Blackbelt-Lightsail-public02.pdf
- AWS Batch
  - AWS Batch
    - https://youtu.be/-2Kz3d7hPBk
  - AWS Batch 入門編
    - https://youtu.be/EFuLmazpH_o

## データベース

- Amazon RDS
  - Amazon Relational Database Service (RDS)
    - https://youtu.be/nDme-ET-_EY
- Amazon Aurora
  - Amazon Aurora with MySQL Compatibility
    - https://youtu.be/VerVNchaqVY
  - Amazon Aurora with PostgreSQL Compatibility
    - https://youtu.be/oJqIzHIMh7Q
  - Amazon Aurora MySQL Compatible Edition ユースケース毎のスケーリング手法
    - https://youtu.be/9KQkskyP930
  - 使ってみよう！Amazon Aurora！ 〜データベースの課題をクラウドネイティブに解決する〜
    - https://www.youtube.com/watch?v=Dz5XFupyRm4
- Amazon ElastiCache
  - Amazon ElastiCache
    - https://youtu.be/-NU1U8_fxo4
- Amazon DynamoDB
  - Amazon DynamoDB
    - https://pages.awscloud.com/rs/112-TZM-766/images/20170809_AWS-BlackBelt-DynamoDB_rev.pdf
  - Amazon DynamoDB Advanced Design Pattern
    - https://youtu.be/Wd5gbLQ2a1E
  - Amazon DocumentDB (with MongoDB Compatibility)
    - https://youtu.be/RTfCVlo1EoA
- Amazon Redshift
  - Amazon Redshift
    - https://youtu.be/Myzy68VEXjM
  - Amazon Redshift Overview
    - https://youtu.be/xTDHFeUtYCg
  - Amazon Redshift Update
    - https://youtu.be/eqf5bhVwIe4
  - Amazon Redshift 運用管理
    - https://youtu.be/bXTqW0hAWuc
  - Next Generation Redshift
    - https://youtu.be/CkSBRQYkHXM
  - AWS でデータ分析ならここから！はじめての Amazon Redshift Serverless
    - https://www.youtube.com/watch?v=5bKysXZC3Ao

## ネットワーキングとコンテンツ配信

- Amazon VPC
  - Amazon Virtual Private Cloud (VPC)
    - https://youtu.be/JAzsGRS_o4c
  - Amazon VPC IP Address Manager (IPAM)
    - https://youtu.be/RUxKN_CIPsE
- ELB
  - Elastic Load Balancing (ELB)
    - https://youtu.be/4laAoK-zXko
  - Elastic Load Balancing
    - https://youtu.be/gKCK0RDAhnw
- Amazon Route 53
  - Amazon Route 53 導入編
    - https://youtu.be/Yi-e5O_jd6o
  - Amazon Route 53 Resolver
    - https://youtu.be/6nf6vIQha1g
  - Amazon Route 53 Hosted zone 編
    - https://youtu.be/7z1rmlCJDwE
- Amazon CloudFront
  - Amazon CloudFrontの概要
    - https://youtu.be/mmRKzzOvJJY
  - Amazon CloudFront の レポート / モニタリング / ロギング編
    - https://youtu.be/tIkfu7NAeQE
  - Amazon CloudFront ( Cache Control 編 )
    - https://youtu.be/acdiWZK2Z0Y
  - AmazonCloudFrontのこの機能使えてますか
    - https://www.youtube.com/watch?v=-RldYeiMu2k
  - Amazon CloudFront AWS Lambda@Edge
    - https://pages.awscloud.com/rs/112-TZM-766/images/20170927_AWS-BlackBelt-CloudFront-LambdaEdge.pdf
- AWS Global Accelerator
  - Gateway Load Balancer
    - https://youtu.be/tiwgoSNvh3k
- AWS Direct Connect
  - AWS Direct Connect
    - https://youtu.be/mEtluVrgXlk
- AWS PrivateLink
- AWS Transit Gateway
  - AWS Transit Gateway
    - https://youtu.be/Yhe2jYzFmfs
- AWS VPN
  - AWS Site-to-Site VPN
    - https://youtu.be/RxiARNnP3nM
- Amazon API Gateway
  - Amazon API Gateway
    - https://youtu.be/EpEETIox03s

## ストレージ

- Amazon S3 / S3 Glacier
  - Amazon Simple Storage Service (S3)
    - https://youtu.be/oFG5kMZjKtc
  - Amazon Simple Storage Service (Amazon S3) 入門編
    - https://youtu.be/ffND-tX1Qxshttps://youtu.be/wQ8ZDvoMSno
  - Amazon Simple Storage Service (Amazon S3) データ保護編
    - https://youtu.be/ffND-tX1Qxshttps://youtu.be/JCuSaHroRbo
  - Amazon Simple Storage Service (Amazon S3) セキュリティ編
    - https://youtu.be/ffND-tX1Qxshttps://youtu.be/VutHE2vSvFo
  - Amazon Simple Storage Service (Amazon S3) コスト最適化編
    - https://youtu.be/ffND-tX1Qxshttps://youtu.be/EeJhcsScWIo
- Amazon EBS
  - Amazon Elastic Block Store (EBS)
    - https://youtu.be/ffND-tX1Qxs
- Amazon EFS
  - Amazon Elastic File System (EFS)
    - https://youtu.be/srLHV0ualZs
- Amazon FSx
  - Amazon FSx for Windows File Server
    - https://youtu.be/74rdt--zb-c
  - Amazon FSx for Windows File Server: 2022 ver
    - https://youtu.be/_86Iych7GwU
- AWS Storage Gateway
  - AWS Storage Gateway
    https://youtu.be/TsGqN_ZKD-c
- AWS Backup

## セキュリティ、アイデンティティ、コンプライアンス

- AWS IAM
  - AWS Identity and Access Management (IAM) Part1
    - https://youtu.be/K7F5yTThynw
  - AWS Identity and Access Management (IAM) Part2
    - https://youtu.be/qrZKKF6V6Dc
- AWS KMS
  - AWS Key Management Service
    - https://youtu.be/4F5rSxzu0U4
- AWS Secrets Manager
  - AWS Secrets Manager
    - https://youtu.be/r7JQSBaQwh4
- Amazon Cognito
  - Amazon Cognito
    - https://youtu.be/vWfTe5MHOIk
- AWS WAF
  - AWS Managed Rules for AWS WAF の活用
    - https://youtu.be/ceQ7eU_jkD4
  - AWS WAF アップデート
    - https://youtu.be/4KbCJAjiA3A
  - AWS WAF でできる Bot 対策
    - https://youtu.be/x11kHIESSGA
- AWS Shield
  - AWS Shield Advanced
    - https://youtu.be/qKNsYWHWOiY
- AWS Certificate Manager
  - AWS Certificate Manager
    - https://youtu.be/d-zsi1ZRwLs
- AWS Security Hub
  - AWS Security Hub
    - https://youtu.be/1JJw9efXIlw
- Amazon GuardDuty
  - Amazon GuardDuty
    - https://youtu.be/Tb2Uw4B_Ihw
  - Amazon GuardDuty Malware Protection
    - https://youtu.be/GwzBiO1jBvU

## コンテナ、サーバーレス

- AWS Lambda
  - AWS Lambda Part1
    - https://youtu.be/QvPgjEwgiew
  - AWS Lambda Part2
    - https://youtu.be/96ku2x1NCaE
  - AWS Lambda Part3
    - https://youtu.be/rMG18Fr896U
  - AWS Lambda Part4
    - https://youtu.be/AOx5iNmxOC8
- Amazon ECR
  - CON241 Elastic Container Registry
    - https://youtu.be/wNWzdoeHhUE
- Amazon ECS
  - Amazon Elastic Container Service (Amazon ECS)
    - https://youtu.be/tmMLLjQrrRA
  - Amazon ECS Deep Dive
    - https://youtu.be/3bohQetK2OE
  - CON201 ECS 入門
    - https://youtu.be/XAyrpXj4TVA
  - CON207 Auto Scaling in ECS
    - https://youtu.be/FeRkcA33-d0
  - CON303 Amazon Elastic Container Service − EC2 スポットインスタンス / Fargate Spot ことはじめ
    - https://youtu.be/fvzbLMrteZg
  - CON307 ECS Capacity Providers
    - https://youtu.be/45uuyy16RS4
  - CON371 Amazon ECS Anywhere
    - https://youtu.be/2D0Sw-2e5UY
  - CON464 Amazon ECS deployment circuit breakerを使った自動ロールバック
    - https://youtu.be/GlNP5aGhfEA
- Amazon EKS
  - CON221 Amazon Elastic Kubernetes Service (Amazon EKS) 入門
    - https://youtu.be/OCcAXCpTRak
  - CON222 Amazon Elastic Kubernetes Service (Amazon EKS) での Data Plane管理
    - https://youtu.be/WzCxHW0wNBo
  - CON316 Amazon EKS における EC2 スポットインスタンスをもっと身近に
    - https://youtu.be/_hgWoHhmdlM
  - CON372 Amazon EKS Anywhere
    - https://youtu.be/O_F2-D6MxHU
- AWS Fargate
  - AWS Fargate
    - https://youtu.be/rwwOoFBq2AU
  - CON202 ECS Fargate 入門
    - https://youtu.be/5fXwkTgWrjw
  - Introduction to AWS Fargate and Amazon Elastic Container Service for Kubernetes
    - https://youtu.be/VDPI91bHN-Q
- その他（コンテナ）
  - CON001 AWSコンテナサービス予告
    - https://youtu.be/Y-FBkc7t804
  - CON110 なぜ今コンテナなのか
    - https://youtu.be/-xqg95QBK2M
  - CON120 AWSコンテナ全体概要
    - https://youtu.be/pAGW0MdNGj4
  - CON130 コンテナセキュリティ100
    - https://youtu.be/jA63YPmkQ8I
  - CON141 コンテナ入門
    - https://youtu.be/fUPyxos7Z-k
  - CON142 Docker 入門
    - https://youtu.be/CGfRsyQW1rE
  - CON231 コンテナセキュリティ入門 Part.1
    - https://youtu.be/I1o01lkQNHY
  - CON232 コンテナセキュリティ入門 Part.2
    - https://youtu.be/OTwC6zpgZjc
  - CON233 コンテナセキュリティ入門 Part.3
    - https://youtu.be/drWE7enGFvo
  - CON246 ログ入門
    - https://youtu.be/DLVFJYhr-Z8
  - CON248 トレーシング入門 コンテナ上でアプリケーションを動かすために
    - https://youtu.be/4nu8f4A1hoc
  - CON350 コンテナとサーバレスの使い分け
    - https://www.youtube.com/watch?v=_Rbmhns0CxU
  - CON332 AWS App Mesh
    - https://youtu.be/_fT6C_aCQ6M
  - CON261 サービスディスカバリとAWS Cloud Map
    - https://youtu.be/GZ0ZMKx6rSc
- その他(サーバーレス)
  - サーバーレスイベント駆動アーキテクチャ
    - https://youtu.be/3PATYwC-fPM
  - 実践的 Serverless セキュリティプラクティス
    - https://youtu.be/KfQUhK4mUZo
　- 形で考えるサーバーレス設計 サーバーレスユースケースパターン解説
  　- https://youtu.be/H0IlWdrb_yM
  - サーバーレスサービスを活用した非同期処理のはじめの一歩
    - https://www.youtube.com/watch?v=i7msA8Iq4j4

## マネジメントとガバナンス

- Amazon CloudWatch
  - Amazon CloudWatch
    - https://youtu.be/gOaZeJpb0Y4
  - Amazon CloudWatch の概要と基本
    - https://youtu.be/fzVkJne3OMI
  - Amazon CloudWatch Container Insights で始めるコンテナモニタリング入門
    - https://youtu.be/-w1nb99hxz8
  - Amazon CloudWatch Synthetics
    - https://youtu.be/H1YXgBEY5nE
  - Amazon CloudWatch RUM
    - https://youtu.be/gdG0bhxgR2w
- AWS CloudTrail
  - AWS CloudTrail
    - https://youtu.be/_mmZa1Blxc4
- AWS Trusted Advisor
  - AWS Trusted Advisor
    - https://youtu.be/ibxlKOdFMwc
- AWS Config
  - AWS Config
    - https://youtu.be/vnqX0gMj6jw
  - AWS Config update
    - https://youtu.be/2Ar2CclFvqY
- AWS Systems Manager
  - AWS Systems Manager
    - https://youtu.be/UXSbh4Wsp7c
  - AWS Systems Manager Overview
    - https://youtu.be/g5ndLFklyb4
  - AWS Systems Manager State Manager
    - https://youtu.be/vSAbhWZFtKU
  - AWS Systems Manager Maintenance Windows
    - https://youtu.be/WouU6pTvEHQ
  - AWS Systems Manager Inventory 編
    - https://youtu.be/2_6YcNmNFcg
  - AWS Systems Manager Incident Manager 編
    - https://youtu.be/03MiGRe9fkI
  - AWS Systems Manager Hybrid Activations 編
    - https://youtu.be/LUdXlWW5F9I
  - AWS Systems Manager Explorer / OpsCenter 編
    - https://youtu.be/XXG88mXS6_E
  - AWS Systems Manager Distributor 編
    - https://youtu.be/wjyzvKRT9zw
- AWS CloudFormation
  - AWS CloudFormation
    - https://youtu.be/Viyqh9fNBjw
  - AWS CloudFormation deep dive
    - https://youtu.be/XOuhtEIdf0k
  - AWS CloudFormation#1 基礎編
    -https://youtu.be/4dyiPsYXG8I
  - AWS CloudFormation CloudFormation レジストリ編
    -https://www.youtube.com/watch?v=3-rOuhahaDI
  - AWS CloudFormation よくあるユースケースと質問編
    - https://www.youtube.com/watch?v=FHFfWMddd-0
- AWS Organizations
  - AWS Organizations
    - https://pages.awscloud.com/rs/112-TZM-766/images/20180214_AWS-Blackbelt-Organizations.pdf

## アプリケーション統合

- Amazon EventBridge
  - Amazon EventBridge
    - https://youtu.be/H7641kZMghg
  - Amazon EventBridge Scheduler
    - https://youtu.be/kihjlOlOc_E
- Amazon SNS
  - Amazon Simple Notification Service (SNS)
    - https://youtu.be/bPCjOG_jQlc
  - Amazon SNS Mobile Push
    - https://pages.awscloud.com/rs/112-TZM-766/images/20150311_AWS-Black-Belt-SNSMobilePush-public.pdf
- Amazon SQS
  - Amazon Simple Queue Service (SQS)
    - https://youtu.be/avfc0gQ7X0A

## デベロッパーツール

- AWS CloudShell
  - https://docs.aws.amazon.com/ja_jp/cloudshell/latest/userguide/welcome.html
- AWS Cloud9
  - AWS Cloud9 入門
    - https://youtu.be/3Sl6Hzcw7Bk
- AWS CodeCommit
  - AWS CodeCommit & AWS CodeArtifact
    - https://youtu.be/rqy_wluHDe0
- AWS CodeBuild
  - AWS CodeBuild
    - https://youtu.be/Zzv1_ztf-B0
- AWS CodeDeploy
  - AWS CodeDeploy
    - https://youtu.be/cXa2S2kS0TU
- AWS CodePileline
  - AWS CodeStar & AWS CodePipeline
    - https://youtu.be/31-w23SdOAs
- AWS CodeStar
- AWS CLI
  - AWS Command Line Interface
    - https://youtu.be/1FexvzegG3o
- AWS CDK
  - AWS Cloud Development Kit (CDK)
    - https://youtu.be/1i7kWqpqtoY
  - AWS CDK 概要 (Basic #1)
    - https://youtu.be/BmCpa44rAXI
  - AWS CDK の基本的なコンポーネントと機能 (Basic #2)
    - https://youtu.be/aqa2bFFzcjs
  - AWS CDKの開発を効率化する機能 (Basic #3)
    - https://youtu.be/z3Mst77p-aU
- AWS SDK
  - AWS SDK
    - https://pages.awscloud.com/rs/112-TZM-766/images/20150318_AWS-Black-Belt-AWS-SDK.pdf

## 移行とデータ転送

- AWS Application Discovery Service
  - Server Migration Service & Application Discovery Service
    - https://pages.awscloud.com/rs/112-TZM-766/images/20170621_AWS-BlackBelt-ads-sms.pdf
- AWS Database Migration Service (DMS)
  - AWS Database Migration Service
    - https://youtu.be/Od83ySfrzGc
- AWS Migration Hub
  - クラウド移行における Discovery ツールの必要性（AWS 移行準備シリーズ）
    - https://youtu.be/gFbQ6VR-onw
- AWS Application Migration Service(MGN)
  - AWS Application Migration Service (AWS MGN) 概要
    - https://youtu.be/HktS_jCIv9Q

## 分析

- Amazon Athena
  - Amazon Athena
    - https://youtu.be/6FLkOE60Pfs
- Amazon Kinesis
  - Amazon Kinesis
    - https://pages.awscloud.com/rs/112-TZM-766/images/20180110_AWS-BlackBelt-Kinesis.pdf
    - Amazon Kinesis Video Streams
      - https://youtu.be/WAJBCt6L5b8
    - Amazon Kinesis Video Streams 基礎編
      - https://youtu.be/M3QK8WrrTPg
    - Amazon Kinesis Video Streams 応用編
      - https://youtu.be/IWmSU-4pTsA
- Amazon QuickSight
  - Amazon QuickSight を使ったアクションにつながるビジュアルベストプラクティス
    - https://youtu.be/6rdwOxX7c8o
  - Amazon QuickSight のBI機能を独自アプリケーションやSaaSに埋め込む
    - https://youtu.be/eWogEkzOI8E
  - Amazon QuickSight アップデート
    - https://youtu.be/jjxr2j990rc
