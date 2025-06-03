---
title: "【初心者向け】Amazon VPC Lattice 入門！完全ガイド" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: false
---

<!--# Amazon VPC Lattice<!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

<!-- Duration: 00:01:00 -->

- [1. Amazon VPC Lattice とは](#1-amazon-vpc-lattice-とは)
  - [1.1. 公式ドキュメント](#11-公式ドキュメント)
  - [1.2. 学習リソース](#12-学習リソース)
  - [1.3. ワークショップ](#13-ワークショップ)
  - [1.4. 既存サービスとの違い](#14-既存サービスとの違い)
  - [1.5. 導入のメリット](#15-導入のメリット)
  - [1.6. 主なユースケース](#16-主なユースケース)
- [2. 基本機能](#2-基本機能)
  - [2.1. サービスネットワーク](#21-サービスネットワーク)
  - [2.2. サービス](#22-サービス)
  - [2.3. ターゲットグループ](#23-ターゲットグループ)
  - [2.4. リスナーとルール](#24-リスナーとルール)
  - [2.5. 認証と認可](#25-認証と認可)
- [3. 高度な機能](#3-高度な機能)
  - [3.1. クロスアカウント接続](#31-クロスアカウント接続)
  - [3.2. サービスディスカバリー](#32-サービスディスカバリー)
  - [3.3. TCPワークロードのサポート](#33-tcpワークロードのサポート)
- [4. 運用のポイント](#4-運用のポイント)
  - [4.1. コスト管理](#41-コスト管理)
  - [4.2. モニタリング](#42-モニタリング)
  - [4.3. セキュリティ](#43-セキュリティ)
- [📖 まとめ](#-まとめ)
  - [主要なポイント](#主要なポイント)

## 1. Amazon VPC Lattice とは

Amazon VPC Lattice は、VPCやアカウントをまたいでサービス間の通信を簡単に接続・保護・監視できるアプリケーションネットワーキングサービスです。マイクロサービスやサービス指向アーキテクチャを採用する場合に、基盤となるインフラストラクチャやネットワーク接続を意識することなく、サービス同士を接続できるようになります。

![overview](/images/vpc-lattice/vpc-lattice-overview.drawio.svg)

主要コンポーネントには次のようなものがあります。

- サービス
  - リスナー
  - ターゲットグループ
- サービスネットワーク

### 1.1. 公式ドキュメント

Amazon VPC Latticeを理解する公式ドキュメントは次のとおりです。

[Amazon VPC Lattice サービス概要](https://aws.amazon.com/jp/vpc/lattice/)

[Amazon VPC Lattice ドキュメント](https://docs.aws.amazon.com/ja_jp/vpc-lattice/?id=docs_gateway)

[Amazon VPC Lattice よくある質問](https://aws.amazon.com/jp/vpc/lattice/faqs/)

[Amazon VPC Lattice の料金](https://aws.amazon.com/jp/vpc/lattice/pricing/)

### 1.2. 学習リソース

【AWS Black Belt Online Seminar】[PrivateLink and Lattice - Amazon VPC Lattice Service 編(YouTube)](https://www.youtube.com/watch?v=6_s_KuKkahY)(0:36:17) | [PDF](https://pages.awscloud.com/rs/112-TZM-766/images/AWS-Black-Belt_2025_AmazonVPCLattice_0122_v1.pdf)

![blackbelt-vpc-lattice](/images/blackbelt/vpc-lattice-320.jpg)

Amazon VPC Lattice × EKS で実現するアプリケーションネットワーキング([PDF](https://pages.awscloud.com/rs/112-TZM-766/images/20230525_30th_ISV_DiveDeepSeminar_Lattice_EKS.pdf))

Amazon VPC Lattice: エンタープライズネットワークアーキテクチャをモダン化し、簡素化する([Amazon Web Services ブログ](https://aws.amazon.com/jp/blogs/news/amazon-vpc-vattice-modernize-and-simplify-your-enterprise-network-architectures/))


### 1.3. ワークショップ

[Amazon VPC Lattice ワークショップ](https://catalog.us-east-1.prod.workshops.aws/workshops/036b30f8-1541-4656-af12-4e6c5558eeee/ja-JP) - AWS が提供する VPC Lattice ハンズオン形式のワークショップです。
- 所要時間の目安: 4 時間
- 学習目標: Amazon VPC Lattice の主要概念の紹介

![v2-vpclattice-target-architecture](/images/vpc-lattice/v2-vpclattice-target-architecture.png)

### 1.4. 既存サービスとの違い

VPC Lattice以外のVPC間接続サービスは次のようなものがあります。

- VPC Peering: 単純なVPC間の接続
- Transit Gateway: 複数VPCやオンプレミスとの接続

![VPC-Peering](/images/vpc-lattice/vpc-peering.drawio.svg)

![TransitGW](/images/vpc-lattice/trangitgw.drawio.svg)

これらのサービスは、ネットワークレイヤー（L3）での接続に焦点を当てているのに対し、VPC Latticeは**アプリケーションレベル（L7）のサービス接続と管理**に重点を置いています。

特定のリソースを接続するサービスには次のようなものがあります。

- PrivateLink

PrivateLinkは、VPC Latticeと共通する部分が多いですが、目的と機能が異なります。
PrivateLinkは、サービスプロバイダーがサービスをプライベートに公開するなどのシナリオに適しています。一方、VPC Latticeは、**マイクロサービスアーキテクチャでの複数サービス間の接続管理**に適しています。

### 1.5. 導入のメリット

Amazon VPC Latticeを導入する主なメリットは以下の3つです。

- 接続の簡素化: VPCやアカウントをまたいだサービス間の接続を自動化し、基盤となるネットワークインフラを抽象化します。
- セキュリティの向上: 認証・認可ポリシーを一元管理でき、サービスレベルでのきめ細かいアクセス制御を実現します。
- 運用監視の統一: サービス間通信の監視、ログ記録、トラブルシューティングを一元的に管理できます。

### 1.6. 主なユースケース

- マイクロサービスアーキテクチャの接続管理: 多数のマイクロサービス間の通信を効率的に管理し、サービスメッシュのような機能を提供します。
  ![Figure-1-1.png](/images/vpc-lattice/Figure-1-1.png)
- クロスアカウントサービス連携: 複数のAWSアカウントにまたがるサービスを安全に接続し、マルチアカウント戦略を促進します。
  - 参考＞[Kong Enterprise & Kong Konnect with Amazon VPC Lattice](https://konghq.com/blog/news/kong-with-amazon-vpc-lattice)
  ![image1-3.avif](/images/vpc-lattice/image1-3.avif)
- ハイブリッドワークロードの統合: EC2インスタンス、コンテナ、Lambda関数などの異なるコンピューティングリソース間の通信を統一的に管理します。
- TCPベースのサービス連携: HTTPだけでなく、TCPベースの通信も含めた幅広いサービスの接続を可能にします。
  ![vpc-lattice-tcp](/images/vpc-lattice/vpc-lattice-tcp-rds.drawio.svg)

参考：Amazon Web Services ブログ＞[Amazon VPC Lattice: エンタープライズネットワークアーキテクチャをモダン化し、簡素化する](https://aws.amazon.com/jp/blogs/news/amazon-vpc-vattice-modernize-and-simplify-your-enterprise-network-architectures/)


## 2. 基本機能

<!-- Duration: 0:10:00 -->

Amazon VPC Latticeは、いくつかの主要コンポーネントから構成されており、これらが連携してサービス間の通信を実現します。

![vpc-lattice-service-network](/images/vpc-lattice/service-network.png)

### 2.1. サービスネットワーク

[サービスネットワーク](https://docs.aws.amazon.com/ja_jp/vpc-lattice/latest/ug/service-networks.html)は、VPC Latticeの中核となる概念で、サービスとVPCの関連付けを管理する論理的なコンテナです。

- 定義: サービスディスカバリーと接続性を提供する論理的なグループで、サービスとVPCを関連付けます
- 機能
  - 複数のサービスを1つのネットワークに関連付け可能
  - 複数のVPCをサービスネットワークに関連付け可能
  - クロスアカウント共有をサポート（AWS RAM経由）
- 制限 
  - リージョンごとのアカウントあたり最大10個のサービスネットワーク
  - サービスネットワークごとに最大500個のVPCアソシエーション
  - サービスネットワークごとに最大500個のサービスアソシエーション

### 2.2. サービス

VPC Lattice内の[サービス](https://docs.aws.amazon.com/ja_jp/vpc-lattice/latest/ug/services.html)は、アプリケーションのエンドポイントを表現し、クライアントがリクエストを送信する対象となります。

- 定義: Lattice内の個々のサービスエンドポイントを表し、リスナーとルートを含みます
- 特徴
  - 各サービスには一意のDNS名が割り当てられる
    - デフォルトは、`service_name-service_id.partition_id.vpc-lattice-svcs.region.on.aws`
    - カスタムドメイン名の設定が可能
  - サービスはHTTP、HTTPS、gRPC、TCPプロトコルをサポート
    - **VPC Lattice では WebSocket はサポートされていません。**
  - 認証ポリシーとアクセスコントロールルールを設定可能
- 作成方法
  - コンソール、CLI、API、CloudFormation、CDKから作成可能

### 2.3. ターゲットグループ

[ターゲットグループ](https://docs.aws.amazon.com/ja_jp/vpc-lattice/latest/ug/target-groups.html)は、リクエストを処理する実際のバックエンドリソースを定義します。

- 定義: トラフィックをルーティングする宛先となるリソースのグループ
- タイプ
  - インスタンス: EC2インスタンス
  - IP: IPアドレス（VPC内またはオンプレミス）
  - Lambda: Lambda関数
  - ALB: Application Load Balancer
- ヘルスチェック: 設定可能なヘルスチェックによりターゲットの健全性を監視
  - **LambdaとALBではヘルスチェックは使用不可**
- 重み付けルーティング: 各ターゲットに重み付けを設定可能

### 2.4. リスナーとルール

[リスナー](https://docs.aws.amazon.com/ja_jp/vpc-lattice/latest/ug/listeners.html)と[ルール](https://docs.aws.amazon.com/ja_jp/vpc-lattice/latest/ug/listener-rules.html)は、トラフィックの受信とリクエストのルーティングを担当します。

- リスナー
  - 指定したポートとプロトコル（HTTP/HTTPS/gRPC/TCP）でトラフィックを待ち受ける
  - 複数のリスナーを1つのサービスに設定可能
  - TLS証明書の管理（ACMと統合）

- ルール
  - HTTPベースプロトコル（HTTP/HTTPS/gRPC）の場合：
    - パスベースルーティング
    - ヘッダーベースルーティング
    - メソッドベースルーティング
  - TCPの場合は単純なフォワーディング
  - 優先度を設定してルーティングの順序を制御可能

### 2.5. 認証と認可

VPC Latticeは、サービスへのアクセスを制御するための認証と認可の仕組みを提供します。

- [認証ポリシー](https://docs.aws.amazon.com/ja_jp/vpc-lattice/latest/ug/auth-policies.html)
  - AWS IAMベースの認証をサポート
  - 相互TLS（mTLS）による認証
  - 匿名アクセスの許可も可能

- 認可ポリシー
  - リソースベースのポリシー（JSON形式）
  - きめ細かいアクセス制御（サービスレベル、操作レベル）
  - プリンシパル（IAMユーザー、ロール、AWSアカウント）単位でのアクセス制限
  - タグベースの条件付きアクセス制御

## 3. 高度な機能

<!-- Duration: 0:08:00 -->

### 3.1. クロスアカウント接続

VPC Latticeはマルチアカウント環境において、アカウントをまたいだサービスの接続をシームレスに実現します。

- AWS RAM (Resource Access Manager)との統合
  - サービスネットワークをアカウント間で共有可能
  - サービスを別アカウントのサービスネットワークに関連付け可能

- 接続フロー
  1. サービスネットワークの所有者がAWS RAMを使用して他アカウントとネットワークを共有
  2. 共有先アカウントはVPCをそのサービスネットワークに関連付け
  3. サービス所有者はサービスを同じネットワークに関連付け
  4. クライアントアカウントのVPC内のリソースはサービスを利用可能に

- セキュリティ考慮事項
  - 共有されたリソースへのアクセス権限は、認証・認可ポリシーで詳細に制御可能
  - 組織単位（OU）単位でのリソース共有が可能

### 3.2. サービスディスカバリー

VPC Latticeはサービスディスカバリー機能を提供し、クライアントが利用可能なサービスを簡単に特定できるようにします。

- 自動DNS登録
  - 各サービスに一意のDNS名を自動的に割り当て
  - 形式: `<service-name>.<lattice-domain-name>`
  - プライベートDNSゾーンとの統合

- サービスディレクトリ
  - サービスネットワークに関連付けられたサービスの一覧をクエリ可能
  - API、AWS CLIでのリスト取得サポート
  - サービスのメタデータ（タグなど）を含む情報の取得

- DNS設定オプション
  - Route 53プライベートホストゾーンとの連携
  - カスタムドメイン名のサポート
  - 複数のエイリアスレコードによるアクセス

### 3.3. TCPワークロードのサポート

VPC LatticeはHTTPベースのプロトコルに加えて、TCPベースのワークロードもサポートしています。

- TCP接続の利点
  - レイヤー4（トランスポート層）レベルでの接続
  - プロトコルに依存しない通信が必要なアプリケーションに適合
  - 既存のTCPベースのシステムを容易に統合可能

- 主なTCPリソース
  - RDS
  - 任意のTCPサービス（カスタムアプリケーションなど）

- 制限事項
  - TCPトラフィックではコンテンツベースのルーティングは利用不可
  - TCPリスナーはシンプルなフォワーディングのみ
  - HTTP/HTTPSと比較して高度なルーティング機能は制限される

## 4. 運用のポイント

<!-- Duration: 0:07:00 -->

### 4.1. コスト管理

VPC Latticeのコスト構造を理解し、効率的に管理するためのポイントです。

- 料金体系
  - 処理時間: サービスリクエストの処理時間に対する課金
  - データ転送: サービス間で転送されるデータ量に対する課金
  - サービス時間: サービスとVPCの関連付けに対する課金

- コスト最適化の戦略
  - 不要なサービスネットワークの関連付けを削除
  - キャッシング戦略の実装によるリクエスト数削減
  - CloudWatchメトリクスを活用したコスト監視
  - リザーブドインスタンスやSavings Planの活用（バックエンドリソース向け）

### 4.2. モニタリング

VPC Latticeは、サービス間通信の監視とトラブルシューティングのための包括的なモニタリング機能を提供します。

- [CloudWatch統合](https://docs.aws.amazon.com/ja_jp/vpc-lattice/latest/ug/monitoring-cloudwatch.html)
  - サービスメトリクス: リクエスト数、レイテンシー、エラー率
  - ディメンション別の分析: サービス、VPC、ターゲットグループ
  - カスタムダッシュボードの作成方法

- [ログ記録](https://docs.aws.amazon.com/ja_jp/vpc-lattice/latest/ug/monitoring-access-logs.html)
  - アクセスログの設定（CloudWatch Logs、S3、Firehoseへの配信）
  - ログフォーマットとフィールド
  - ログの分析とクエリ

- 分散トレーシング
  - AWS X-Rayとの統合
  - サービス間依存関係の可視化
  - パフォーマンスボトルネックの特定

- アラートとアクション
  - CloudWatchアラームの設定
  - SNSとの連携による通知
  - 自動修復アクションの実装

### 4.3. セキュリティ

VPC Latticeでのセキュリティ強化のためのベストプラクティスです。

- ネットワークセキュリティ
  - 最小権限の原則に基づく設計
  - セキュリティグループとNACLの適切な設定
  - VPCエンドポイントポリシーの活用

- 認証と認可
  - IAMポリシーの詳細設定
  - 相互TLS（mTLS）の実装手順
  - リソースポリシーの定期的な監査

- 暗号化
  - 転送中のデータ暗号化（TLSの強制）
  - ACM証明書

- コンプライアンス
  - AWSコンプライアンスプログラムの活用
  - リソースのタグ付けと監査
  - セキュリティイベントの記録と追跡

## 📖 まとめ

<!-- Duration: 0:02:00 -->

Amazon VPC Latticeは、マイクロサービスやサービス指向アーキテクチャを採用する組織にとって、サービス間通信を簡素化し、セキュアにするための強力なソリューションです。

### 主要なポイント

- VPC Latticeはアプリケーションネットワーキングサービスとして、サービス間の接続、保護、監視を一元管理
- サービスネットワーク、サービス、ターゲットグループ、リスナー、ルートという主要コンポーネントで構成
- クロスアカウント、クロスVPC接続を簡素化し、サービスディスカバリーをネイティブサポート
- HTTPSだけでなく、TCPベースのワークロードもサポート
- CloudWatchとの統合による包括的なモニタリングと可観測性を実現
- 適切なIAMポリシーと認証メカニズムによるセキュリティの確保
