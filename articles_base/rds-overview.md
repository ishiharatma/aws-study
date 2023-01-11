# Amazon Relational Database Service(RDS)

## はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## Contents

Duration: 00:01:00

- [Amazon Relational Database Service(RDS)](#amazon-relational-database-servicerds)
  - [はじめに](#はじめに)
  - [Contents](#contents)
  - [RDS について知るには](#rds-について知るには)
  - [RDS について知るには(その他)](#rds-について知るにはその他)
  - [Amazon RDS とは](#amazon-rds-とは)
  - [サポートされているデータベースエンジン](#サポートされているデータベースエンジン)
  - [RDS の基本的な構成](#rds-の基本的な構成)
  - [SLA](#sla)
  - [可用性](#可用性)
    - [シングル AZ](#シングル-az)
    - [マルチ AZ](#マルチ-az)
    - [マルチ AZ（２つの読み取り可能なスタンバイ）](#マルチ-az２つの読み取り可能なスタンバイ)
  - [リードレプリカ](#リードレプリカ)
  - [リードレプリカの昇格](#リードレプリカの昇格)
  - [RDS のクロスリージョン自動バックアップ](#rds-のクロスリージョン自動バックアップ)
  - [インスタンスタイプ](#インスタンスタイプ)
  - [スケールアップ/ダウン](#スケールアップダウン)
  - [ストレージクラス](#ストレージクラス)
  - [ストレージの自動スケーリング](#ストレージの自動スケーリング)
  - [RDS のログ](#rds-のログ)
  - [Blue/Green Deployments(New: 2022-11-27)](#bluegreen-deploymentsnew-2022-11-27)
  - [まとめ](#まとめ)

## RDS について知るには

Duration: 00:52:48

【AWS Black Belt Online Seminar】[Amazon Relational Database Service (Amazon RDS)(YouTube)](https://youtu.be/nDme-ET-_EY)(52:48)

![blackbelt-rds](/images/rds/blackbelt-rds-320.jpg)

[Amazon RDS サービス概要](https://aws.amazon.com/jp/rds/)

[Amazon RDS ドキュメント](https://docs.aws.amazon.com/ja_jp/rds/?icmpid=docs_homepage_databases)

[Amazon RDS よくある質問](https://aws.amazon.com/jp/rds/faqs/)

## RDS について知るには(その他)

Duration: 03:05:36

【AWS Summit Tokyo 2019】[AWS におけるデータベースの選択指針](https://www.youtube.com/watch?v=h1r8AzOdlqo)(39:25)

![aws-summit-2019-c2-03](/images/rds-aurora/aws-summit-2019-c2-03-320.jpg)

【AWS Summit Tokyo 2019】[Amazon RDS におけるパフォーマンス最適化とパフォーマンス管理](https://www.youtube.com/watch?v=3oMR2hglQR0)(41:33)

![aws-summit-2019-b3-04](/images/rds-aurora/aws-summit-2019-b3-04-320.jpg)

【AWS Summit Tokyo 2019】[Amazon Aurora with PostgreSQL Compatibility における運用設計のファーストステップ](https://www.youtube.com/watch?v=5McG3hJae9A)(39:53)

![aws-summit-2019-b3-05](/images/rds-aurora/aws-summit-2019-b3-05-320.jpg)

【AWS Summit Tokyo 2019】[Amazon Aurora storage demystified: How it all works (DAT309-R)](https://www.youtube.com/watch?v=DrtwAOND1Pc)(1:04:45)

![aws-summit-2019-dat309-r](/images/rds-aurora/aws-summit-2019-dat309-r-320.jpg)

## Amazon RDS とは

Duration: 00:01:00

リレーショナルデータベースを提供するフルマネージドサービスです。

マネジメントコンソールからわずか数クリックで冗長化、バックアップなどが設定されたデータベースを作成できます。

## サポートされているデータベースエンジン

Duration: 00:01:00

サポートされているデータベースエンジンは以下の通りです。それぞれのデータベースエンジンでバージョンや機能などサポートされている範囲が異なるので、利用するには確認が必要です。

- PostgreSQL
  - 他のデータベースエンジンに比べて制限がほとんどない
- MySQL
  - [Amazon RDS での MySQL のバージョン](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/MySQL.Concepts.VersionMgmt.html)
- Oracle
  - [Amazon RDS for Oracle](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/CHAP_Oracle.html)
- Microsoft SQL Server
  - [Amazon RDS for Microsoft SQL Server](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/CHAP_SQLServer.html)
- MariaDB
  - [Amazon RDS for MariaDB](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/CHAP_MariaDB.html#MariaDB.Concepts.Storage)


## RDS の基本的な構成

Duration: 00:05:00

RDS は EC2 に MySQL や PostgreSQL をインストールする場合と同じように、インスタンスに EBS が紐づいており、ミラーリング用の EBS で耐久性を高めています。

データベースを作成すると、エンドポイントと呼ばれる専用の DNS 名が発行されます。

アプリケーションは、エンドポイントに接続して、データベースへの操作を行います。

このエンドポイントは、各データベースエンジンの接続ポートのみ接続することができます。

![rds-instance-00](/images/rds/rds-instance-00.png)

シングル AZ（単一構成） の場合は、１つの DB サーバーを DB インスタンスと呼びます。

マルチ AZ（冗長化構成） の場合は、プライマリ・スタンバイの両方を合わせて、１つの DB インスタンスと呼びます。

![rds-instance-01](/images/rds/rds-instance-01.png)

## SLA

Duration: 00:01:00

[Amazon RDS Service Level Agreement](https://aws.amazon.com/rds/sla/?nc1=h_ls)

## 可用性

Duration: 00:15:00

### シングル AZ

１つの AZ に RDS インスタンスを構築した最小構成です。
AZ 障害時にはインスタンスが利用できなくなります。

![rds-single-az](/images/rds/rds-single-az.png)

開発環境や、可用性を求められない場合にコストを低く抑えることが出来る構成です。ただし、自動バックアップ時には、I/O が数秒～数分のごく短時間中断されることがあります。インスタンスタイプによってこの時間は異なります。

読み取りスループットを向上させたい場合は、リードレプリカを追加します。

シングル AZ で構成された RDS を後からマルチ AZ に変更することも可能です。ダウンタイムは発生しません。マルチ AZ 変更後は、シングル AZ に比べてトランザクションスループットは若干低下します。これは同期的レプリケーションが行われるようになるからです。

>シングル AZ Amazon RDS インスタンスをマルチ AZ インスタンス、またはその逆に変換すると、どのような影響がありますか?
[https://aws.amazon.com/jp/premiumsupport/knowledge-center/rds-convert-single-az-multi-az/](https://aws.amazon.com/jp/premiumsupport/knowledge-center/rds-convert-single-az-multi-az/)

### マルチ AZ

![rds-multi-az-1](/images/rds/rds-multi-az-1.png)

同一リージョンの２つの AZ に プライマリインスタンスとスタンバイインスタンスを構築し、プライマリからスタンバイに同期的にレプリケーションされています。
スタンバイインスタンスには、読み取りのみでもアクセスは出来ません。

プライマリ障害時には、60秒ほどで自動的にスタンバイに切り替わります。エンドポイントの DNS が切り替わることで行われます。

読み取りスループットを向上させたい場合は、リードレプリカを追加します。

メンテナンス（システムアップグレード – OS パッチ適用など）時は、以下の順で実行されます。

1. スタンバイインスタンスに変更を適用
2. フェールオーバー実行
3. 旧プライマリインスタンスに変更を適用

アプリケーションの構成が DNS をキャッシュする環境の場合、フェールオーバー後すぐに上手く切り替わらない場合もあります。その場合は、有効期限（TTL）を短くする（30秒未満）といった対応が必要です。アプリケーション側ではリトライを入れるなど、アクセスできないケースを想定しておく必要があります。

RDS の自動バックアップは、スタンバイインスタンスから取得されます。そのため、プライマリインスタンスの I/O に影響を与えません。ただし、RDS for SQL Server については、プライマリインスタンスの I/O が一時的に中断されます。

マルチ AZ 構成をシングル AZ に戻すことも可能です。ダウンタイムは発生しません。

>シングル AZ Amazon RDS インスタンスをマルチ AZ インスタンス、またはその逆に変換すると、どのような影響がありますか?
[https://aws.amazon.com/jp/premiumsupport/knowledge-center/rds-convert-single-az-multi-az/](https://aws.amazon.com/jp/premiumsupport/knowledge-center/rds-convert-single-az-multi-az/)

### マルチ AZ（２つの読み取り可能なスタンバイ）

![rds-multi-az-2](/images/rds/rds-multi-az-2.png)

以前からあるマルチ AZ を拡張したもので、スタンバイインスタンスは読み取りアクセスが可能となります。そのため、「従来のマルチ AZ + リードレプリカ」構成よりも読み取りスループット向上できます。

自動フェールオーバーは 従来のマルチ AZ より早い、35秒となっています。トランザクションスループットも従来のマルチ AZ と比べて最大で2倍高速となっています。

従来のマルチ AZ にリードレプリカを1台以上追加する場合は、こちらのマルチ AZを利用するほうがよいです。

また、３つの AZ で構成されるため、AZ 障害にも強い構成と言えます。２つの AZ が同時に障害になっても継続できます。

ただし、利用可能なデータベースエンジンは、2022年12月現在では MySQL と PostgreSQL のみとなっていますので注意が必要です。

参考>[Readable standby instances in Amazon RDS Multi-AZ deployments: A new high availability option](https://aws.amazon.com/blogs/database/readable-standby-instances-in-amazon-rds-multi-az-deployments-a-new-high-availability-option/)

この構成から、さらに読み取りスループットを向上させたい場合は、リードレプリカを追加します。

## リードレプリカ

Duration: 00:05:00

読み取り頻度の高いデータベースのワークロードに対して、スケールアウトすることにより、パフォーマンスを向上させます。

リードレプリカへのレプリケーションは非同期で行われます。

![rds-readreplica-00](/images/rds/rds-readreplica-00.png)

リードレプリカは一部のデータベースエンジンを除いて、別リージョンでも作成することができます。（クロスリージョンリードレプリカ：CRR）

![rds-crr](/images/rds/rds-crr.png)

| DB エンジン          | リードレプリカ作成可？ | CRR可能？ |
| -------------------- | ---------------------- | --------- |
| PostgreSQL           | ○                      | ○         |
| MySQL                | ○                      | ○         |
| Oracle               | ○                      | ○         |
| Microsoft SQL Server | ○                      |           |
| MariaDB              | ○                      | ○         |

[Amazon RDS リードレプリカ](https://aws.amazon.com/jp/rds/features/read-replicas/)

[Amazon RDS for PostgreSQL でのリードレプリカの使用](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_PostgreSQL.Replication.ReadReplicas.html)

[MySQL リードレプリカの使用](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_MySQL.Replication.ReadReplicas.html)

[Amazon RDS for Oracle でのリードレプリカの使用](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/oracle-read-replicas.html)

[Amazon RDS での Microsoft SQL Server 用のリードレプリカの使用](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/SQLServer.ReadReplicas.html)

## リードレプリカの昇格

Duration: 00:05:00

リードレプリカは、スタンドアロン DB インスタンスに昇格させることができます。

この昇格というのは、マスター・スレーブの関係性でマスターになるというわけではなく、リードレプリカが独立した DB インスタンスとなることです。

そのため、昇格（独立）した時点でデータのレプリケーションは行われません。

昇格するには、リードレプリカのダウンタイム（サーバの再起動）が発生するため、その間に書き込みがあった場合は、データにズレが生じます。

![rds-promote-read-replica](/images/rds/rds-promote-read-replica.png)

## RDS のクロスリージョン自動バックアップ

Duration: 00:05:00

RDS のクロスリージョン自動バックアップは、レプリケーション先のリージョンに自動スナップショットとトランザクションログのバックアップが保存されます。

本機能によって、災害対策（DR）が求められるシステムにおいて、リージョン障害が発生してもバックアップが作成されたリージョンでリストアを行うことで迅速に復旧することができます。

ただし、リージョンを跨いだストレージ料金やデータ転送（スナップショットとトランザクションログ）が必要です。

また、送信元と送信先のリージョンのサポートも確認しておく必要があります。

日本に存在するリージョンでは、東京リージョンはサポートするリージョンは多いですが、大阪リージョンでは東京のみとなっています。

- アジアパシフィック (東京)
  - ⇒アジアパシフィック (大阪)
  - ⇒アジアパシフィック (ソウル)
  - ⇒アジアパシフィック (シンガポール)
  - ⇒米国東部 (バージニア北部)
  - ⇒米国東部 (オハイオ)
  - ⇒米国西部 (オレゴン)
- アジアパシフィック (大阪)
  - ⇒アジアパシフィック (東京)

参考＞[送信元と送信先 AWS リージョン サポート](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_ReplicateBackups.html#USER_ReplicateBackups.RegionVersionAvailability)

クロスリージョン自動バックアップがサポートされているデータベースエンジンは以下の通りです。

| DB エンジン          | CR自動バックアップ作成可？ |
| -------------------- | -------------------------- |
| PostgreSQL           | ○                          |
| MySQL                |                            |
| Oracle               | ○                          |
| Microsoft SQL Server | ○                          |
| MariaDB              |                            |

参考＞[クロスリージョン自動バックアップ](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/Concepts.RDS_Fea_Regions_DB-eng.Feature.CrossRegionAutomatedBackups.html)

参考＞[別の AWS リージョン への自動バックアップのレプリケーション](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_ReplicateBackups.html)

参考＞[Amazon RDS for PostgreSQL クロスリージョンリードレプリカのためのベストプラクティス](https://aws.amazon.com/jp/blogs/news/best-practices-for-amazon-rds-for-postgresql-cross-region-read-replicas/)

## インスタンスタイプ

Duration: 00:01:00

RDS のインスタンスタイプは、「db.m6g.large」のように `db` から始まります。それ以降は、EC2 のインスタンスタイプと同じ構成となっています。

[Amazon RDS インスタンスタイプ](https://aws.amazon.com/jp/rds/instance-types/)

## スケールアップ/ダウン

Duration: 00:01:00

DB インスタンスはインスタンスタイプを変更することができます。インスタンスタイプの変更ではダウンタイムが発生します。

インスタンスタイプの変更は、マネジメントコンソールや AWS CLI を使って手動で追加することができます。変更を適用するには、「すぐに適用」か「次に予定されるメンテナンスウィンドウ中」を選択できます。

[[すぐに適用] で使用できる設定](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/Overview.DBInstance.Modifying.html#USER_ModifyInstance.Settings)

## ストレージクラス

Duration: 00:05:00

RDS で選択できるストレージクラスは次の通りです。

- 汎用 SSD
  - 一般的な用途
  - MariaDB、MySQL、Oracle、PostgreSQL データベースインスタンス: 20～64 TiB
  - SQL Server Enterprise、Standard、Web、および Express エディション: 20 GiB-16 TiB
- プロビジョンド IOPS
  - 低レイテンシー、高 I/O スループットが必要な場合
  - MariaDB:100 GiB - 64 TiB
  - SQL Server:20 GiB - 16 TiB
  - MySQL:100 GiB - 64 TiB
  - Oracle:100 GiB - 64 TiB
  - PostgreSQL:100 GiB - 64 TiB
- マグネティック
  - 下位互換
  - 現在は、汎用 SSD かプロビジョンド IOPS を推奨

## ストレージの自動スケーリング

Duration: 00:08:00

[Amazon RDS ストレージの自動スケーリングによる容量の自動管理](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_PIOPS.StorageTypes.html#USER_PIOPS.Autoscaling)

RDS で使用するストレージは、DB インスタンス作成時にサイズを指定します。

ストレージにかかるコストは、実際に使っている容量ではなく、定義した容量で課金されています。300 GB で定義した場合、実際には 10 GB しか使っていなくても 300 GB 分のストレージ料金を支払っています。

最初に割り当てたストレージ容量が不足する場合、マネジメントコンソールや AWS CLI を使って手動で追加することができます。変更を適用するには、「すぐに適用」か「次に予定されるメンテナンスウィンドウ中」を選択できます。

[DB インスタンスストレージの容量を増加する](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_PIOPS.StorageTypes.html#USER_PIOPS.ModifyingExisting)

「すぐに適用」をすると、ダウンタイムなしでストレージを追加することができます。ストレージが追加されるタイミングでパフォーマンスの低下が発生する可能性があります。

ストレージの空き容量に余裕がある場合やパフォーマンス低下を発生させたくない場合は、「次に予定されるメンテナンスウィンドウ中」を選択することもできます。

[[すぐに適用] で使用できる設定](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/Overview.DBInstance.Modifying.html#USER_ModifyInstance.Settings)

また、ストレージ追加後は「ストレージの最適化」というステータスになり、数時間かかる場合があります。さらにその後の6時間（ストレージの最適化がそれ以上かかる場合は、完了まで）は、ストレージを新たに追加することができなくなります。

このように、ストレージ追加には手動での作業が必要なことと、次の割り当ての制約があることから、最初からある程度多めの容量を割り当て、CloudWatch のメトリクスにより空き容量を監視していました。

この方式は、オンプレミスのデータベースサーバーと同じであり、クラウド的な利用形態ではありませんでした。

そこで登場したのが、ストレージの自動スケーリングです。これにより必要になったタイミングでストレージが自動拡張できるようになります。

自動拡張の発動条件は次の通りです。

- 空き容量が割り当てられたサイズの10 % 未満
- 低ストレージ状態が5分以上継続
- 最後のストレージ変更後から6時間経過
  - この制約があるため、RDS の自動スケーリングはストレージ不足状態を完全に防ぐことはできません。
  - 自動スケーリング後に大量のデータロードが発生した場合に数時間ストレージ容量不足状態になる可能性があります。

自動拡張で追加されるストレージは以下のうち大きい方です。

- 5 GiB
- 割り当てられているサイズの 10 %
- 直近 1 時間の FreeStorageSpace メトリクスの変動に基づいて予測される 7 時間のストレージの増分

RDS のストレージの自動スケーリングは有効にする前に、ドキュメントやよくある質問などをよく読み、利用するかどうかを慎重に検討する必要があります。

[ストレージの自動スケーリングをオンにした後に、Amazon RDS の DB インスタンスの空きストレージ容量が少ない状態になったり、storage-full 状態になったりするのはなぜですか?](https://aws.amazon.com/jp/premiumsupport/knowledge-center/rds-autoscaling-low-free-storage/)

## RDS のログ

Duration: 00:05:00

オンプレミスのデータベースでは、データベースのログはファイルシステムに存在します。ログが必要であれば、サーバーにログインすることでログを取得することができました。

RDS でも、データベースのログは RDS のサーバー内のファイルにシステムに存在します。ただし、RDS ではデータベースサーバに SSH などで直接ログインできないため、取得できません。

そのため、RDS では CloudWatch Logs にログをエクスポートする機能をもっています。

CloudWatch Logs にエクスポートすることで、ログの検索やサブスクリプションフィルターによる検知を行うことが可能になります。

データベースエンジンごとの保存できるログファイルの種類は次の通りです。

| DB エンジン          | ログファイル                                                     |
| -------------------- | ---------------------------------------------------------------- |
| PostgreSQL           | Postgresql ログ、アップグレードログ                              |
| MySQL                | 監査ログ、全般ログ、スロークエリログ                             |
| Oracle               | アラートログ、監査ログ、トレースログ、リスナーログ               |
| Microsoft SQL Server | エラーログ、エージェントログ、トレースファイル、ファンプファイル |
| MariaDB              | エラーログ、スロークエリログ、一般ログ                           |

[Amazon CloudWatch Logs への PostgreSQL ログの発行](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_LogAccess.Concepts.PostgreSQL.html#USER_LogAccess.Concepts.PostgreSQL.PublishtoCloudWatchLogs)

[Amazon CloudWatch Logs への MySQL ログの発行](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_LogAccess.MySQLDB.PublishtoCloudWatchLogs.html)

[Amazon CloudWatch Logs への Oracle ログの発行](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_LogAccess.Concepts.Oracle.html#USER_LogAccess.Oracle.PublishtoCloudWatchLogs)

[Amazon CloudWatch Logs への SQL Server ログの発行](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_LogAccess.Concepts.SQLServer.html#USER_LogAccess.SQLServer.PublishtoCloudWatchLogs)

[MariaDB ログを Amazon CloudWatch Logs に発行する](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_LogAccess.Concepts.MariaDB.html#USER_LogAccess.MariaDB.PublishtoCloudWatchLogs)

## Blue/Green Deployments(New: 2022-11-27)

Duration: 00:01:00

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

## まとめ

Duration: 00:01:00

![rds](/images/all/rds.png)
