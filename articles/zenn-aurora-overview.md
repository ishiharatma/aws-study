---
title: "【初心者向け】Amazon Aurora について改めて整理してみた" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: false
---

# Amazon Aurora

## はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## Contents

Duration: 00:01:00

- [Amazon Aurora](#amazon-aurora)
  - [はじめに](#はじめに)
  - [Contents](#contents)
  - [Aurora について知るには](#aurora-について知るには)
  - [Aurora について知るには(その他)](#aurora-について知るにはその他)
  - [Amazon Aurora とは](#amazon-aurora-とは)
  - [サポートされているデータベースエンジン](#サポートされているデータベースエンジン)
  - [Aurora の基本的な構成](#aurora-の基本的な構成)
  - [SLA](#sla)
  - [可用性](#可用性)
    - [単一構成](#単一構成)
    - [レプリカ構成](#レプリカ構成)
  - [レプリカの昇格](#レプリカの昇格)
  - [インスタンスタイプ](#インスタンスタイプ)
  - [スケールアップ/ダウン](#スケールアップダウン)
  - [ストレージの自動スケーリング](#ストレージの自動スケーリング)
  - [Aurora のログ](#aurora-のログ)
  - [Serverless](#serverless)
  - [Global Database](#global-database)
  - [Blue/Green Deployments(New: 2022-11-27)](#bluegreen-deploymentsnew-2022-11-27)

## Aurora について知るには

Duration: 03:22:41

【AWS Black Belt Online Seminar】[Amazon Aurora MySQL(YouTube)](https://youtu.be/VerVNchaqVY)(55:41)

![blackbelt-aurora-mysql](/images/aurora/blackbelt-aurora-mysql-320.jpg)

【AWS Black Belt Online Seminar】[Amazon Aurora MySQL Compatible Edition ユースケース毎のスケーリング手法](https://www.youtube.com/watch?v=9KQkskyP930)(55:41)

![blackbelt-aurora-mysql-usecase](/images/aurora/blackbelt-aurora-mysql-usecase-320.jpg)

【AWS Black Belt Online Seminar】[Amazon Aurora with PostgreSQL Compatibility(YouTube)](https://youtu.be/oJqIzHIMh7Q)(1:03:46)

![blackbelt-aurora-postgresql](/images/aurora/blackbelt-aurora-postgresql-320.jpg)

[RDS/Aurora Update | 2.5時間で学ぶ！ Amazon Aurora のいま(YouTube)](https://youtu.be/8uPU2T5Xj9E)(27:33)

![rds-aurora-updates](/images/aurora/rds-aurora-updates-320.jpg)

[Amazon Aurora サービス概要](https://aws.amazon.com/jp/rds/aurora/)

[Amazon Aurora ドキュメント](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html)

[Amazon Aurora よくある質問](https://aws.amazon.com/jp/rds/aurora/faqs/)

## Aurora について知るには(その他)

Duration: 03:05:36

【AWS Summit Tokyo 2019】[AWS におけるデータベースの選択指針](https://www.youtube.com/watch?v=h1r8AzOdlqo)(39:25)

![aws-summit-2019-c2-03](/images/rds-aurora/aws-summit-2019-c2-03-320.jpg)

【AWS Summit Tokyo 2019】[Amazon RDS におけるパフォーマンス最適化とパフォーマンス管理](https://www.youtube.com/watch?v=3oMR2hglQR0)(41:33)

![aws-summit-2019-b3-04](/images/rds-aurora/aws-summit-2019-b3-04-320.jpg)

【AWS Summit Tokyo 2019】[Amazon Aurora with PostgreSQL Compatibility における運用設計のファーストステップ](https://www.youtube.com/watch?v=5McG3hJae9A)(39:53)

![aws-summit-2019-b3-05](/images/rds-aurora/aws-summit-2019-b3-05-320.jpg)

【AWS Summit Tokyo 2019】[Amazon Aurora storage demystified: How it all works (DAT309-R)](https://www.youtube.com/watch?v=DrtwAOND1Pc)(1:04:45)

![aws-summit-2019-dat309-r](/images/rds-aurora/aws-summit-2019-dat309-r-320.jpg)

## Amazon Aurora とは

Duration: 00:01:00

MySQL および PostgreSQL と互換性のあるクラウド向けのリレーショナルデータベースを提供するフルマネージドサービスです。

マネジメントコンソールからわずか数クリックで冗長化、バックアップなどが設定されたデータベースを作成できます。

## サポートされているデータベースエンジン

Duration: 00:01:00

- PostgreSQL(互換)
- MySQL(互換)

[Amazon Aurora メジャーバージョン](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/Aurora.VersionPolicy.html#Aurora.VersionPolicy.MajorVersions)

## Aurora の基本的な構成

Duration: 00:05:00

RDS とは異なり、Aurora では DB インスタンスとストレージが分離されています。これにより、RDS の 2倍の性能を発揮すると言われています。

![aurora-architecture](/images/aurora/aurora-architecture.png)

Aurora を構成する要素は次の通りです。

- Aurora DB クラスター
  - DB インスタンスとクラスタボリューム
- DB インスタンス
- クラスタボリューム

![aurora](/images/aurora/aurora.png)

データベースを作成すると、Writer と Reader のエンドポイントと呼ばれる専用の DNS 名が発行されます。

アプリケーションは、エンドポイントに接続して、データベースへの操作を行います。

このエンドポイントは、各データベースエンジンの接続ポートのみ接続することができます。

## SLA

Duration: 00:01:00

[Amazon Aurora Service Level Agreement](https://aws.amazon.com/jp/rds/aurora/sla/)

## 可用性

Duration: 00:10:00

### 単一構成

１つの AZ に プライマリインスタンスを構築した最小構成です。
AZ 障害時にはインスタンスが利用できなくなります。

![aurora-single](/images/aurora/aurora-single.png)

開発環境や、可用性を求められない場合にコストを低く抑えることが出来る構成です。インスタンスの障害であれば、同じ AZ 内に新規インスタンスが作成され、10分以内に復旧します。AZ 障害時にはフェールオーバーが失敗する可能性があります。

エンドポイントは Writer と Reader のエンドポイントが自動的に作成されますが、レプリカがない場合は、Reader エンドポイントは プライマリインスタンスに接続します。

読み取りスループットを向上させたい場合は、レプリカを追加します。

### レプリカ構成

Duration: 00:05:00

読み取り頻度の高いデータベースのワークロードに対して、スケールアウトすることにより、パフォーマンスを向上させます。また、プライマリインスタンスに障害が発生した場合は、レプリカにフェールオーバーすることで自動的に復旧します。

レプリカは最大で 15台まで追加することが可能です。

レプリカへのレプリケーションは非同期で行われます。

エンドポイントは Writer と Reader のエンドポイントが自動的に作成され、Reader エンドポイントは レプリカに負荷分散します。

レプリカのインスタンスタイプがプライマリインスタンスよりも小さい場合、負荷に耐えられないことがあります。ベストプラクティスはクラスター内のすべてのインスタンスを同じサイズにすることです。

リードレプリカは一部のデータベースエンジンを除いて、別リージョンでも作成することができます。（クロスリージョンレプリカ：CRR）

| DB エンジン | レプリカ作成可？ | CRR可能？ |
| ----------- | ---------------- | --------- |
| PostgreSQL  | ○                |           |
| MySQL       | ○                | ○         |

[Aurora レプリカ](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/Aurora.Replication.html#Aurora.Replication.Replicas)

[Aurora PostgreSQL でのレプリケーション](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/Aurora.Replication.html#Aurora.Replication.AuroraPostgreSQL)

[Aurora MySQL でのレプリケーション](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/Aurora.Replication.html#Aurora.Replication.AuroraMySQL)

[AWS リージョン 間での Amazon Aurora MySQL DB クラスターのレプリケーション](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Replication.CrossRegion.html)

## レプリカの昇格

Duration: 00:05:00

レプリカを手動でフェールオーバーさせることで、プライマリインスタンスに昇格させることができます。

[Amazon Aurora でリードレプリカを使用するときの一般的な問題を解決するにはどうすればよいですか？](https://aws.amazon.com/jp/premiumsupport/knowledge-center/aurora-mysql-read-replicas/)

## インスタンスタイプ

Duration: 00:01:00

RDS のインスタンスタイプは、「db.m6g.large」のように `db` から始まります。それ以降は、EC2 のインスタンスタイプと同じ構成となっています。

[Amazon Aurora の料金](https://aws.amazon.com/jp/rds/aurora/pricing/)

## スケールアップ/ダウン

Duration: 00:01:00

DB インスタンスはインスタンスタイプを変更することができます。インスタンスタイプの変更ではダウンタイムが発生します。

インスタンスタイプの変更は、マネジメントコンソールや AWS CLI を使って手動で追加することができます。変更を適用するには、「すぐに適用」か「次に予定されるメンテナンスウィンドウ中」を選択できます。

[[すぐに適用] で使用できる設定](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/Aurora.Modifying.html#Aurora.Modifying.Settings)

## ストレージの自動スケーリング

Duration: 00:05:00

クラスタボリュームはデータベースのデータ量が増えるにつれて自動的に増加します。データが削除された場合は、データに割り当てられていた領域が解放され、ストレージ料金を最小限に抑えることができます。

[Aurora ストレージのサイズを自動的に変更する方法](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.StorageReliability.html#aurora-storage-growth)

[ストレージのスケーリング](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Performance.html#Aurora.Managing.Performance.StorageScaling)

## Aurora のログ

Duration: 00:05:00

オンプレミスのデータベースでは、データベースのログはファイルシステムに存在します。ログが必要であれば、サーバーにログインすることでログを取得することができました。

Aurora でも、データベースのログは Aurora のサーバー内のファイルにシステムに存在します。ただし、Aurora ではデータベースサーバに SSH などで直接ログインできないため、取得できません。

そのため、Aurora では CloudWatch Logs にログをエクスポートする機能をもっています。

CloudWatch Logs にエクスポートすることで、ログの検索やサブスクリプションフィルターによる検知を行うことが可能になります。

データベースエンジンごとの保存できるログファイルの種類は次の通りです。

| DB エンジン          | ログファイル                                                     |
| -------------------- | ---------------------------------------------------------------- |
| PostgreSQL           | Postgresql ログ、アップグレードログ                              |
| MySQL                | 監査ログ、全般ログ、スロークエリログ                             |

## Serverless

Aurora Serverless は現在 v1 と v2 が存在します。それぞれのユースケースは次の通りです。安定したトラフィックが予想できる場合は Provisioned インスタンス（通常の Aurora）を利用するほうが良いです。

- v1
  - 頻度が低く、断続的、または予測が困難なワークロード
- v2
  - データベースの使用負荷が短時間の間だけ増大し、その後に軽いアクティビティが長時間続く

基本的にどちらも、開発とテストを主なユースケースとしつつ、一部本番アプリケーションも想定されています。

| 項目                 | Serverless v1                                                                     | Serverless v2                                                         |
| -------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| GA                   | 2018年10月                                                                        | 2022年4月                                                             |
| サポートエンジン     | Aurora MySQL 5.6 or 5.7 互換バージョン、Aurora PostgreSQL 10 or 11 互換バージョン | Aurora MySQL バージョン 3、Aurora PostgreSQL 13 or 14                 |
| ACU                  | 1～128 ACU                                                                        | 0.5～256 ACU（Performance Insights を使用した場合最低でも 2ACU必要 ） |
| 料金                 | 0.10 USD/ACU                                                                      | 0.20 USD/ACU                                                          |
| マルチ AZ            |                                                                                   | ○                                                                     |
| 一時停止             | ○                                                                                 |                                                                       |
| Data API             | ○                                                                                 |                                                                       |
| クエリエディタ       | ○                                                                                 |                                                                       |
| Global Database      |                                                                                   | ○                                                                     |
| Performance Insights |                                                                                   | ○ |
| RDS Proxy |                                                                                   | ○ |

[Amazon Aurora Serverless v1 の使用](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/aurora-serverless.html)

[Aurora Serverless v2 を使用する](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html)

## Global Database

## Blue/Green Deployments(New: 2022-11-27)

[New – Fully Managed Blue/Green Deployments in Amazon Aurora and Amazon RDS](https://aws.amazon.com/jp/blogs/aws/new-fully-managed-blue-green-deployments-in-amazon-aurora-and-amazon-rds/)

[Using Amazon RDS Blue/Green Deployments for database updates](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/blue-green-deployments.html)

![blue-green-deployment](/images/rds-aurora/blue-green-deployment.png)

データベースの切り替えを安全に行えるようになるマネージドサービスです。

以下のような機能が提供されています。ステージング環境（Green）でテストを行い、適切なタイミングで本番環境（Blue）と切り替えを行った後で、万が一新しい環境で問題が発生してもすぐに切り戻しが可能になります。

- 本番環境をコピーしたステージング環境
- 本番環境とステージング環境のレプリケーション
- 本番環境に影響を与えず、ステージング環境に変更を加えることが可能
  - データベースのメジャーバージョンのアップグレード
  - データベースパラメータ変更
  - スキーマ変更　など。
- 切り替えは1分以内
- デーア損失なし
- アプリケーションの変更不要
