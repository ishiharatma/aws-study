---
title: "【AWS学習】AWS BuilderCards 2nd Edition 完全ガイド" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: true
emoji: "🃏"
---
# 【AWS学習】AWS BuilderCards 2nd Edition 完全ガイド<!-- omit in toc -->

![whats-buildercards](/images/buildercards/01-whats-buildercards.png)

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## AWS BuilderCards とは？

> AWS BuilderCards は、Amazon Web Services が提供するクラウドサービスや、サービスを組み合わせたアーキテクチャを学べるカードゲームです。
> サービスを組み合わせてアーキテクチャを構成する思想は、ビルディングブロックと呼ばれます。
> AWS BuilderCards を通じて AWS が提供している数多くのサービスを組み合わせて「可用性が高く」、「柔軟性があり」、「拡張性のある」、「セキュリティが適用された」システムを作り上げる Well-Architected なアーキテクチャを学ぶことができます。

### 学習リソース

[AWS BuilderCards |AWS for Games](https://aws.amazon.com/jp/gametech/buildercards/)

[楽しみながら学べる AWS BuilderCards の遊び方、そして日本語化に込めた思い 2024-05-01 | Author : 山口 正徳 (AWS Community Hero) |builders.flash](https://aws.amazon.com/jp/builders-flash/202405/japanese-builder-cards/)

[AWS BuilderCards 2nd Edition の遊び方 |builders.flash](https://aws.amazon.com/jp/builders-flash/202509/builder-cards-2nd-edition/)

[AWS BuilderCards日本語化プロジェクト |GitHub](https://github.com/jaws-ug/AWS-BuilderCards-Japanese)

[AWS BuilderCards 日本語版開発に向けた思い |SpeakerDeck](https://speakerdeck.com/coosuke/awssummitjapan-jawsugchiba-buildercards-jp)

[AWS ビルダーカード、第 2 版 |YouTube](https://www.youtube.com/watch?v=bYCsNjrcTbE)

### プレイマット

これ以外も[公式ページ](https://aws.amazon.com/jp/gametech/buildercards/)の「Play Mats」からダウンロードできます。

- [Console](https://pages.awscloud.com/rs/112-TZM-766/images/AWS-BuilderCards-console-A3.pdf)

![console-mat](/images/buildercards/console.png)

- [Player](https://pages.awscloud.com/rs/112-TZM-766/images/AWS-BuilderCards-2player-A3.pdf)

![player-mat](/images/buildercards/player.png)

## 概要とルールをAI生成グラレコで

![game-over](/images/buildercards/07-end.png)
_図：ゲームの終わり方と勝利条件_

![kind](/images/buildercards/02-kind-of-cards.png)
_図：3種類のカード_

![setup](/images/buildercards/03-setup.png)
_図：セットアップ_

![build](/images/buildercards/04-build-phase.png)
_図：ビルドフェーズ_

![other](/images/buildercards/05-other-phase.png)
_図：次フェーズ_

![categories](/images/buildercards/08-card-categories.png)
_図：カードカテゴリ_

![hints](/images/buildercards/09-hints.png)
_図：ヒント_

## カードセット内容

**合計：** 144枚

- Starter Cards：40枚
- Builder Cards：91枚
  - コストなしカード：77枚
  - コストありカード：14枚
- Well-Architected Cards：12枚
  - 1点：7枚
  - 3点：5枚
- マニュアル：1枚

## BuilderCards詳細

**コストなしカード：** 77枚

EC2、Lambda、S3が多く、その他は2～3枚という構成です。

| サービス名                       | 枚数 | カテゴリ                            | Zenn記事リンク |
|-----------------------------|----|---------------------------------|------------|
| [AWS Marketplace](https://docs.aws.amazon.com/ja_jp/marketplace/latest/buyerguide/what-is-marketplace.html)             | 2  |                                 |            |
| [Amazon EC2](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/concepts.html)                  | 8  | compute                         | [Zenn記事はこちら](https://zenn.dev/issy/articles/zenn-ec2-overview) |
| [AWS Lambda](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/welcome.html)                  | 6  | compute                         | [Zenn記事はこちら](https://zenn.dev/issy/articles/zenn-lambda-overview) |
| [AWS Fargate](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/AWS_Fargate.html)                 | 2  | containers                      |            |
| [Amazon ECS](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/Welcome.html)                  | 2  | containers                      | [Zenn記事はこちら](https://zenn.dev/issy/articles/zenn-ecs-overview) |
| [Amazon EKS](https://docs.aws.amazon.com/ja_jp/eks/latest/userguide/what-is-eks.html)                  | 2  | containers                      | [Zenn記事はこちら](https://zenn.dev/issy/articles/zenn-ecs-vs-eks) |
| [Amazon S3](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/Welcome.html)                   | 4  | storage                         | [Zenn記事はこちら](https://zenn.dev/issy/articles/zenn-s3-overview) |
| [Amazon EFS](https://docs.aws.amazon.com/ja_jp/efs/latest/ug/whatisefs.html)                  | 2  | storage                         |            |
| [Amazon SNS](https://docs.aws.amazon.com/ja_jp/sns/latest/dg/welcome.html)                  | 3  | application integration         | [Zenn記事はこちら](https://zenn.dev/issy/articles/zenn-sns-overview) |
| [Amazon SQS](https://docs.aws.amazon.com/ja_jp/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html)                  | 3  | application integration         | [Zenn記事はこちら](https://zenn.dev/issy/articles/zenn-sqs-overview) |
| [Amazon EventBridge](https://docs.aws.amazon.com/ja_jp/eventbridge/latest/userguide/eb-what-is.html)          | 2  | application integration         |            |
| [AWS Step Functions](https://docs.aws.amazon.com/ja_jp/step-functions/latest/dg/welcome.html)          | 2  | application integration         |            |
| [Amazon API Gateway](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/welcome.html)          | 2  | application integration         | [Zenn記事はこちら](https://zenn.dev/issy/articles/zenn-apigw-overview) |
| [Amazon Route 53](https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/Welcome.html)             | 2  | networking & content delivery   | [Zenn記事はこちら](https://zenn.dev/issy/articles/zenn-route53-overview) |
| [Amazon VPC](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/what-is-amazon-vpc.html)                  | 2  | networking & content delivery   | [Zenn記事はこちら](https://zenn.dev/issy/articles/zenn-vpc-overview) |
| [Elastic Load Balancing](https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/userguide/what-is-load-balancing.html)      | 2  | networking & content delivery   | [Zenn記事はこちら](https://zenn.dev/issy/articles/zenn-elb-overview) |
| [Amazon CloudFront](https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/Introduction.html)           | 2  | networking & content delivery   | [Zenn記事はこちら](https://zenn.dev/issy/articles/zenn-cloudfront-overview) |
| [Amazon RDS](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/Welcome.html)                  | 2  | database                        | [Zenn記事はこちら](https://zenn.dev/issy/articles/zenn-rds-overview) |
| [Amazon Aurora](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html)               | 2  | database                        | [Zenn記事はこちら](https://zenn.dev/issy/articles/zenn-aurora-overview) |
| [Amazon DynamoDB](https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/Introduction.html)             | 3  | database                        | [Zenn記事はこちら](https://zenn.dev/issy/articles/zenn-dynamodb-overview) |
| [Amazon ElastiCache](https://docs.aws.amazon.com/ja_jp/AmazonElastiCache/latest/dg/WhatIs.html)          | 2  | database                        | [Zenn記事はこちら](https://zenn.dev/issy/articles/zenn-elasticache-overview) |
| [Amazon Kinesis Data Streams](https://docs.aws.amazon.com/ja_jp/streams/latest/dev/introduction.html) | 2  | analytics                       |            |
| [Amazon Data Firehose](https://docs.aws.amazon.com/ja_jp/firehose/latest/dev/what-is-this-service.html)        | 2  | analytics                       |            |
| [Amazon Redshift](https://docs.aws.amazon.com/ja_jp/redshift/latest/mgmt/welcome.html)             | 2  | analytics                       |            |
| [Amazon Athena](https://docs.aws.amazon.com/ja_jp/athena/latest/ug/what-is.html)               | 2  | analytics                       | [Zenn記事はこちら](https://zenn.dev/issy/articles/zenn-athena-overview) |
| [Amazon OpenSearch Service](https://docs.aws.amazon.com/ja_jp/opensearch-service/latest/developerguide/what-is.html)   | 2  | analytics                       |            |
| [AWS CloudTrail](https://docs.aws.amazon.com/ja_jp/awscloudtrail/latest/userguide/cloudtrail-user-guide.html)              | 2  | management & governance         | [Zenn記事はこちら](https://zenn.dev/issy/articles/zenn-cloudtrail-overview) |
| [Amazon CloudWatch](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html)           | 2  | management & governance         | [Zenn記事はこちら](https://zenn.dev/issy/articles/zenn-cloudwatch-overview) |
| [AWS IAM Identity Center](https://docs.aws.amazon.com/ja_jp/singlesignon/latest/userguide/what-is.html)     | 4  | security, identity & compliance |  |
| [Amazon CodeCatalyst](https://docs.aws.amazon.com/ja_jp/codecatalyst/latest/userguide/welcome.html)         | 2  | developer tools                 |            |

**コストありカード：** 14枚

| サービス名                      | 枚数 | カテゴリ                       | Zenn記事リンク |
|----------------------------|----|----------------------------|------------|
| [Amazon EC2 Auto Scaling](https://docs.aws.amazon.com/ja_jp/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html)    | 2  | compute                    |            |
| [AWS CDK](https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/home.html)                    | 3  | developer tools            | [Zenn記事はこちら](https://zenn.dev/issy/articles/zenn-cdk-overview) |
| [AWS CloudFormation](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/Welcome.html)         | 2  | management & governance    | [Zenn記事はこちら](https://zenn.dev/issy/articles/zenn-cfn-overview) |
| [AWS Systems Manager](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/what-is-systems-manager.html)        | 3  | management & governance    | [Zenn記事はこちら](https://zenn.dev/issy/articles/zenn-ssm-overview) |
| [AWS Well-Architected Tool](https://docs.aws.amazon.com/ja_jp/wellarchitected/latest/userguide/intro.html)  | 2  | management & governance    |            |
| [Cloud Financial Management](https://docs.aws.amazon.com/ja_jp/cost-management/latest/userguide/what-is-costmanagement.html) | 2  | cloud finalcial management |            |

## カード構成例

BuilderCards を組み合わせたアーキテクチャ例 10種類です。少ない枚数のシンプルな構成から最大 5 枚の応用例まで、初心者が段階的に学べるよう並べています。カード効果によっては 5 枚以上での構成が可能ですので、慣れてきたら追加の構成を考えてみましょう。

★ は **コストありカード** を示します。

「[目的別 クラウド構成と概算料金例](https://aws.amazon.com/jp/cdp/)」から各構成に近いものをリンクしています。

---

### 構成例 1：静的 Web サイト配信（2 枚）

| ![S3](/images/icons/64/Arch_Amazon-Simple-Storage-Service_64.png) | ![CloudFront](/images/icons/64/Arch_Amazon-CloudFront_64.png) |
|:---:|:---:|

| カード | 役割 |
|-------|------|
| Amazon S3 | HTML / CSS / JS などの静的ファイルをホスティング |
| Amazon CloudFront | 世界中のエッジから高速配信・HTTPS 対応 |

**シナリオ：** 企業サイトや LP を、サーバー不要で安価に公開する最小構成。

> **CDP：** [Web アプリケーションに対するセキュリティ対策がしたい](https://aws.amazon.com/jp/cdp/web-app-security/)

#### 派生①：CloudFront + ELB でオンプレミスを CDN 化（4 枚）

| ![CloudFront](/images/icons/64/Arch_Amazon-CloudFront_64.png) | ![ELB](/images/icons/64/Arch_Elastic-Load-Balancing_64.png) | ![VM](/images/icons/64/Res_Forums_48_Light.png) | ![Bare](/images/icons/64/Res_Servers_48_Light.png) |
|:---:|:---:|:---:|:---:|

| カード | 役割 |
|-------|------|
| Amazon CloudFront | 世界中のエッジから高速配信・HTTPS 対応 |
| Elastic Load Balancing | 複数のターゲットへトラフィックを均等に分散 |
| Virtual Machine | オンプレ仮想マシン（アプリケーションサーバー） |
| Bare Metal Host | オンプレ物理サーバー |

**シナリオ：** 既存のオンプレミスサーバーを AWS に完全移行する前段階として、CloudFront と ELB だけを先行導入する段階的移行パターン。オンプレ資産を活かしながら CDN によるグローバル高速配信・DDoS 対策・HTTPS 化を即座に適用できる。

---

### 構成例 2：S3 イベント駆動のサムネイル自動生成（2 枚）

| ![S3](/images/icons/64/Arch_Amazon-Simple-Storage-Service_64.png) | ![Lambda](/images/icons/64/Arch_AWS-Lambda_64.png) |
|:---:|:---:|


| カード | 役割 |
|-------|------|
| Amazon S3 | 元画像のアップロード先・生成したサムネイルの保存先 |
| AWS Lambda | S3 へのアップロードをトリガーにサムネイル生成処理を実行 |

**シナリオ：** 画像がアップロードされた瞬間に Lambda が自動起動してサムネイルを生成。サーバー常時稼働なしで処理でき、月額約 24 USD〜の低コスト運用が可能。

> **CDP：** [イベント処理](https://aws.amazon.com/jp/cdp/event-processing/)

---

### 構成例 3：サーバーレス API バックエンド（3 枚）

| ![API Gateway](/images/icons/64/Arch_Amazon-API-Gateway_64.png) | ![Lambda](/images/icons/64/Arch_AWS-Lambda_64.png) | ![DynamoDB](/images/icons/64/Arch_Amazon-DynamoDB_64.png) |
|:---:|:---:|:---:|

| カード | 役割 |
|-------|------|
| Amazon API Gateway | HTTPS エンドポイントでリクエストを受付 |
| AWS Lambda | サーバー管理不要でビジネスロジックを実行 |
| Amazon DynamoDB | 高速・スケーラブルな NoSQL データ保存 |

**シナリオ：** モバイルアプリのバックエンドや軽量 API をインフラ管理なしで構築。

> **CDP：** [サーバレスサービスを用いて高負荷なトラフィックにも耐えうるウェブアプリケーションを構築したい](https://aws.amazon.com/jp/cdp/web-hightraffic/)

#### 派生①：+ CloudFront でエッジキャッシュ（4 枚）

| ![API Gateway](/images/icons/64/Arch_Amazon-API-Gateway_64.png) | ![Lambda](/images/icons/64/Arch_AWS-Lambda_64.png) | ![DynamoDB](/images/icons/64/Arch_Amazon-DynamoDB_64.png) | ![CloudFront](/images/icons/64/Arch_Amazon-CloudFront_64.png) |
|:---:|:---:|:---:|:---:|

| 追加カード | 役割 |
|-----------|------|
| Amazon CloudFront | API レスポンスをエッジにキャッシュし、レイテンシ削減・DDoS 対策 |

**シナリオ：** 読み取り頻度が高い API に CloudFront を前段に置き、オリジンへのリクエストを削減。

#### 派生②：+ CloudFront + S3 でフルスタックサーバーレス（5 枚）

| ![API Gateway](/images/icons/64/Arch_Amazon-API-Gateway_64.png) | ![Lambda](/images/icons/64/Arch_AWS-Lambda_64.png) | ![DynamoDB](/images/icons/64/Arch_Amazon-DynamoDB_64.png) | ![CloudFront](/images/icons/64/Arch_Amazon-CloudFront_64.png) | ![S3](/images/icons/64/Arch_Amazon-Simple-Storage-Service_64.png) |
|:---:|:---:|:---:|:---:|:---:|

| 追加カード | 役割 |
|-----------|------|
| Amazon S3 | フロントエンド（SPA など）の静的ファイルをホスティング |

**シナリオ：** フロントエンド（React / Vue など）を S3 に、バックエンド API を Lambda に置く完全サーバーレス構成。CloudFront が S3 と API Gateway の両方を一本化する。

#### 派生③：+ Route 53 で独自ドメイン（6 枚・参考）

| ![Route 53](/images/icons/64/Arch_Amazon-Route-53_64.png) | ![CloudFront](/images/icons/64/Arch_Amazon-CloudFront_64.png) | ![S3](/images/icons/64/Arch_Amazon-Simple-Storage-Service_64.png) | ![API Gateway](/images/icons/64/Arch_Amazon-API-Gateway_64.png) | ![Lambda](/images/icons/64/Arch_AWS-Lambda_64.png) |
|:---:|:---:|:---:|:---:|:---:|
| ![DynamoDB](/images/icons/64/Arch_Amazon-DynamoDB_64.png) |  |  |  |  |

| 追加カード | 役割 |
|-----------|------|
| Amazon Route 53 | 独自ドメインを CloudFront へ紐付け・ヘルスチェック |

**シナリオ：** 派生②に独自ドメインを加えた本番向けの完成形。カード 6 枚となるが、実アーキテクチャとして一般的な構成。

---

### 構成例 4：イベント駆動の非同期処理（4 枚）

| ![EventBridge](/images/icons/64/Arch_Amazon-EventBridge_64.png) | ![SQS](/images/icons/64/Arch_Amazon-Simple-Queue-Service_64.png) | ![Lambda](/images/icons/64/Arch_AWS-Lambda_64.png) | ![SNS](/images/icons/64/Arch_Amazon-Simple-Notification-Service_64.png) |
|:---:|:---:|:---:|:---:|

| カード | 役割 |
|-------|------|
| Amazon EventBridge | スケジュール・イベントを検知してルーティング |
| Amazon SQS | メッセージをキューに積んで処理を分離 |
| AWS Lambda | キューのメッセージをトリガーに処理を実行 |
| Amazon SNS | 処理完了や異常をメール・Slack などへ通知 |

**シナリオ：** 注文処理・バッチ処理・通知配信など、疎結合な非同期システムを構築したい場合。

> **CDP：** [バッチ処理をスケジュール化してジョブを管理したい](https://aws.amazon.com/jp/cdp/job-management/)

---

### 構成例 5：スケーラブル Web アプリ（4 枚）

| ![Route 53](/images/icons/64/Arch_Amazon-Route-53_64.png) | ![ELB](/images/icons/64/Arch_Elastic-Load-Balancing_64.png) | ![EC2](/images/icons/64/Arch_Amazon-EC2_64.png) | ![RDS](/images/icons/64/Arch_Amazon-RDS_64.png) |
|:---:|:---:|:---:|:---:|

| カード | 役割 |
|-------|------|
| Amazon Route 53 | ドメイン名解決・ヘルスチェック |
| Elastic Load Balancing | 複数の EC2 へトラフィックを均等に分散 |
| Amazon EC2 | アプリケーションサーバー |
| Amazon RDS | リレーショナルデータベース |

**シナリオ：** 動的 Web サービスを冗長化・負荷分散した基本的なシステム構成。

> **CDP：** [ウェブサイト構築 基本編](https://aws.amazon.com/jp/cdp/midscale-webservice/)

#### 派生①：+ EFS で共有ファイルストレージ（5 枚）

| ![Route 53](/images/icons/64/Arch_Amazon-Route-53_64.png) | ![ELB](/images/icons/64/Arch_Elastic-Load-Balancing_64.png) | ![EC2](/images/icons/64/Arch_Amazon-EC2_64.png) | ![RDS](/images/icons/64/Arch_Amazon-RDS_64.png) | ![EFS](/images/icons/64/Arch_Amazon-EFS_64.png) |
|:---:|:---:|:---:|:---:|:---:|

| カード | 役割 |
|-------|------|
| Amazon Route 53 | ドメイン名解決・ヘルスチェック |
| Elastic Load Balancing | 複数の EC2 へトラフィックを均等に分散 |
| Amazon EC2 | アプリケーションサーバー（複数台） |
| Amazon RDS | データベース（ユーザー・投稿データ） |
| Amazon EFS | 複数の EC2 から同時マウントできる共有ファイルストレージ |

**シナリオ：** WordPress などの CMS は画像・プラグイン・テーマを `wp-content` 以下にファイルとして保存する。複数台の EC2 で水平スケールする場合、EFS をマウントすることで全インスタンスが同じファイルを参照でき、アップロードしたメディアが特定サーバーにしか存在しない問題を解消できる。

#### 派生②：+ Systems Manager で EC2 へセキュアアクセス（5 枚）

| ![Route 53](/images/icons/64/Arch_Amazon-Route-53_64.png) | ![ELB](/images/icons/64/Arch_Elastic-Load-Balancing_64.png) | ![EC2](/images/icons/64/Arch_Amazon-EC2_64.png) | ![RDS](/images/icons/64/Arch_Amazon-RDS_64.png) | ![SSM](/images/icons/64/Arch_AWS-Systems-Manager_64.png) |
|:---:|:---:|:---:|:---:|:---:|

| カード | 役割 |
|-------|------|
| Amazon Route 53 | ドメイン名解決・ヘルスチェック |
| Elastic Load Balancing | 複数の EC2 へトラフィックを均等に分散 |
| Amazon EC2 | アプリケーションサーバー |
| Amazon RDS | リレーショナルデータベース |
| AWS Systems Manager ★ | Session Manager で EC2 へ SSH ポート・踏み台なしにセキュアアクセス |

**Session Manager 接続の流れ**

```
開発者（AWS CLI / マネジメントコンソール）
  ↓ SSM Session Manager（HTTPS のみ・IAM 認証）
EC2 インスタンス（SSM エージェント経由）
  ↓ ポートフォワーディング
RDS（DB への直接接続・調査・マイグレーション）
```

**シナリオ：** EC2 への SSH（22番ポート）を閉じたまま、IAM 権限を持つ開発者だけがマネジメントコンソールや CLI からセキュアに接続できる運用パターン。接続操作は CloudTrail・Session Manager ログとして監査記録に残り、踏み台（Bastion）サーバーの運用コストも不要になる。

---

### 構成例 6：オートスケールする Web アプリ（5 枚）

| ![Route 53](/images/icons/64/Arch_Amazon-Route-53_64.png) | ![ELB](/images/icons/64/Arch_Elastic-Load-Balancing_64.png) | ![EC2](/images/icons/64/Arch_Amazon-EC2_64.png) | ![Autoscaling](/images/icons/64/Arch_Amazon-EC2-Auto-Scaling_64.png) | ![RDS](/images/icons/64/Arch_Amazon-RDS_64.png) |
|:---:|:---:|:---:|:---:|:---:|

| カード | 役割 |
|-------|------|
| Amazon Route 53 | DNS ルーティング |
| Elastic Load Balancing | 負荷分散 |
| Amazon EC2 | アプリケーションサーバー |
| Amazon EC2 Auto Scaling ★ | アクセス増減に合わせて EC2 を自動的にスケール |
| Amazon RDS | データベース |

**シナリオ：** セール時などのアクセス急増でも自動でスケールアウトし、コストも最適化する構成。

> **CDP：** [ウェブサイト構築 応用編](https://aws.amazon.com/jp/cdp/ec-scaleup/)

---

### 構成例 7：コンテナ Web サービス（5 枚）

| ![ELB](/images/icons/64/Arch_Elastic-Load-Balancing_64.png) | ![ECS](/images/icons/64/Arch_Amazon-Elastic-Container-Service_64.png) | ![Fargate](/images/icons/64/Arch_AWS-Fargate_64.png) | ![Aurora](/images/icons/64/Arch_Amazon-Aurora_64.png) | ![ElastiCache](/images/icons/64/Arch_Amazon-ElastiCache_64.png) |
|:---:|:---:|:---:|:---:|:---:|

| カード | 役割 |
|-------|------|
| Elastic Load Balancing | トラフィックをコンテナへ分散 |
| Amazon ECS | コンテナのオーケストレーション |
| AWS Fargate | サーバー管理不要でコンテナを実行 |
| Amazon Aurora | 高可用性・高性能な RDB |
| Amazon ElastiCache | クエリ結果をキャッシュして応答を高速化 |

**シナリオ：** Docker コンテナで動くアプリを、インフラ管理なしで本番運用したい場合。

> **CDP：** [コンテナ ECS/Fargate](https://aws.amazon.com/jp/cdp/ec-container/)

#### 派生：ECS + EC2 起動タイプ（5 枚）

| ![ELB](/images/icons/64/Arch_Elastic-Load-Balancing_64.png) | ![ECS](/images/icons/64/Arch_Amazon-Elastic-Container-Service_64.png) | ![EC2](/images/icons/64/Arch_Amazon-EC2_64.png) | ![Aurora](/images/icons/64/Arch_Amazon-Aurora_64.png) | ![ElastiCache](/images/icons/64/Arch_Amazon-ElastiCache_64.png) |
|:---:|:---:|:---:|:---:|:---:|

| カード | 役割 |
|-------|------|
| Elastic Load Balancing | トラフィックをコンテナホストへ分散 |
| Amazon ECS | コンテナのオーケストレーション |
| Amazon EC2 | コンテナを動かす仮想マシン（コンテナホスト） |
| Amazon Aurora | 高可用性・高性能な RDB |
| Amazon ElastiCache | クエリ結果をキャッシュして応答を高速化 |

**Fargate との違い**

| | Fargate 起動タイプ | EC2 起動タイプ |
|--|-------------------|--------------|
| サーバー管理 | 不要（AWS が管理） | 必要（EC2 を自分で管理） |
| コスト | vCPU / メモリ単位で課金 | EC2 インスタンス単位で課金 |
| カスタマイズ性 | 低い（OS アクセス不可） | 高い（インスタンスタイプ・GPU なども選択可） |
| 初心者向け | ◎ | △ |

**シナリオ：** GPU インスタンスが必要な場合などに EC2 起動タイプを選択。

#### 派生：Systems Manager Session Manager でコンテナへセキュアアクセス（6 枚）

| ![ELB](/images/icons/64/Arch_Elastic-Load-Balancing_64.png) | ![ECS](/images/icons/64/Arch_Amazon-Elastic-Container-Service_64.png) | ![Fargate](/images/icons/64/Arch_AWS-Fargate_64.png) | ![Aurora](/images/icons/64/Arch_Amazon-Aurora_64.png) | ![ElastiCache](/images/icons/64/Arch_Amazon-ElastiCache_64.png) |
|:---:|:---:|:---:|:---:|:---:|
| ![SSM](/images/icons/64/Arch_AWS-Systems-Manager_64.png) |  |  |  |  |

| カード | 役割 |
|-------|------|
| Elastic Load Balancing | トラフィックをコンテナへ分散 |
| Amazon ECS | コンテナのオーケストレーション |
| AWS Fargate | サーバー管理不要でコンテナを実行 |
| Amazon Aurora | 高可用性・高性能な RDB |
| Amazon ElastiCache | クエリ結果をキャッシュして応答を高速化 |
| AWS Systems Manager ★ | Session Manager で稼働中のコンテナへ SSH ポート・踏み台なしにセキュアアクセス |

**Session Manager 接続の流れ**

```
開発者（AWS CLI / マネジメントコンソール）
  ↓ SSM Session Manager
ECS Fargate コンテナ（SSMエージェント経由）
  ↓ ポートフォワーディング
Aurora（DB への直接接続・調査・マイグレーション）
```

**シナリオ：** SSH ポート（22番）を一切開けず、踏み台サーバーも不要でコンテナへ接続できる運用パターン。本番環境のコンテナへのアクセスを IAM ポリシーで制御・CloudTrail で監査ログとして記録できる。DB の初期データ投入やトラブルシューティング時のポートフォワーディングにも活用できる。

> **補足：** DB 接続情報（パスワード等）の管理には **AWS Secrets Manager** の利用を推奨。

---

### 構成例 8：データ分析パイプライン（5 枚）

| ![Kinesis](/images/icons/64/Arch_Amazon-Kinesis_64.png) | ![Firehose](/images/icons/64/Arch_Amazon-Data-Firehose_64.png) | ![S3](/images/icons/64/Arch_Amazon-Simple-Storage-Service_64.png) | ![Athena](/images/icons/64/Arch_Amazon-Athena_64.png) | ![Redshift](/images/icons/64/Arch_Amazon-Redshift_64.png) |
|:---:|:---:|:---:|:---:|:---:|

| カード | 役割 |
|-------|------|
| Amazon Kinesis Data Streams | センサー・ログデータをリアルタイム収集 |
| Amazon Data Firehose | S3 へデータを自動転送・変換 |
| Amazon S3 | データレイクとして生データを蓄積 |
| Amazon Athena | S3 上のデータを SQL でアドホック分析 |
| Amazon Redshift | 大量データを集計・BI ツール連携 |

**シナリオ：** IoT センサーや Web アクセスログをリアルタイムに収集し、分析・レポート化したい場合。

> **CDP：** [IoT デバイス制御のための クラウド構成と料金試算例](https://aws.amazon.com/jp/cdp/iot-device-control/)

---

### 構成例 9：ステートマシンによるワークフロー自動化（5 枚）

| ![Step Functions](/images/icons/64/Arch_AWS-Step-Functions_64.png) | ![Lambda](/images/icons/64/Arch_AWS-Lambda_64.png) | ![S3](/images/icons/64/Arch_Amazon-Simple-Storage-Service_64.png) | ![DynamoDB](/images/icons/64/Arch_Amazon-DynamoDB_64.png) | ![SNS](/images/icons/64/Arch_Amazon-Simple-Notification-Service_64.png) |
|:---:|:---:|:---:|:---:|:---:|

| カード | 役割 |
|-------|------|
| AWS Step Functions | 複数の Lambda をシーケンシャル・並列・分岐で制御するワークフローを定義 |
| AWS Lambda | 各ステップの処理を実行（入力検証・外部 API 呼び出し・変換など） |
| Amazon S3 | 処理対象ファイルの入力・処理結果の出力先 |
| Amazon DynamoDB | ワークフローの処理状態・履歴を記録 |
| Amazon SNS | 処理完了・エラー発生をメールや Slack へ通知 |

**ワークフローの例：**

```
S3 にファイル着信
  ↓ Step Functions が起動
  ├─ Lambda①：入力ファイルのバリデーション
  ├─ Lambda②：データ変換・加工（並列実行も可）
  ├─ Lambda③：外部 API 連携・DB 書き込み
  └─ 成功 → SNS で完了通知 / 失敗 → 自動リトライ → SNS でエラー通知
```

**シナリオ：** 注文処理・審査フロー・データ変換バッチなど、複数の Lambda を順番や並列に制御したい場合。リトライ・タイムアウト・分岐処理を Step Functions に任せることで、各 Lambda のコードをシンプルに保てる。

参考：[TEAM](https://aws-samples.github.io/iam-identity-center-team/)の権限ライフサイクルの仕組み| [Zenn記事](https://zenn.dev/issy/articles/zenn-team-03-deepdive#1.1.-%E6%A8%A9%E9%99%90%E3%83%A9%E3%82%A4%E3%83%95%E3%82%B5%E3%82%A4%E3%82%AF%E3%83%AB%E7%AE%A1%E7%90%86%E3%81%AE%E4%BB%95%E7%B5%84%E3%81%BF)

---

### 構成例 10：DevOps / インフラ自動化パイプライン（5 枚）

| ![CodeCatalyst](/images/icons/64/Arch_Amazon-CodeCatalyst_64.png) | ![CDK](/images/icons/64/Arch_AWS-Cloud-Development-Kit_64.png) | ![CloudFormation](/images/icons/64/Arch_AWS-CloudFormation_64.png) | ![CloudWatch](/images/icons/64/Arch_Amazon-CloudWatch_64.png) | ![IAM Identity Center](/images/icons/64/Arch_AWS-IAM-Identity-Center_64.png) |
|:---:|:---:|:---:|:---:|:---:|

| カード | 役割 |
|-------|------|
| Amazon CodeCatalyst | ソースリポジトリ・CI/CD パイプラインを一元管理 |
| AWS CDK ★ | インフラをプログラミング言語（TypeScript / Python など）で定義 |
| AWS CloudFormation ★ | CDK が生成したテンプレートをスタックとしてデプロイ・管理 |
| Amazon CloudWatch | デプロイ後のアプリケーション・インフラをモニタリング |
| AWS IAM Identity Center | 複数の AWS アカウントへの開発者アクセスを SSO で一元制御 |

**パイプラインの流れ：**

```
開発者 → CodeCatalyst へコードプッシュ
  ↓ CI（自動テスト・CDK synth）
CDK → CloudFormation テンプレートを生成
  ↓ CD（自動デプロイ）
CloudFormation → スタックを更新・リソースをプロビジョニング
  ↓ デプロイ後
CloudWatch → アラーム監視・ダッシュボード確認
IAM Identity Center → 各アカウントへの権限を SSO で管理
```

**シナリオ：** インフラ変更をコードレビュー → 自動テスト → 自動デプロイで管理する IaC パイプライン。環境ごとにスタックを切り替えることで dev / staging / prod を同じコードベースで管理でき、手作業によるリソース変更（コンソール操作）を排除できる。★ カードが 2 枚含まれる。

[AWSブログ：Amazon CodeCatalyst で Environment を利用したマルチアカウントのデプロイ](https://aws.amazon.com/jp/blogs/news/using-environments-multi-account-deployments-with-amazon-codecatalyst/)