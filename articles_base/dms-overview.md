# AWS Database Migration Service (DMS)<!-- omit in toc -->

![icon](/images/icons/64/Arch_AWS-Database-Migration-Service_64.png)

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWSに関する個人の勉強および勉強会で使用することを目的に、AWSドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

- [AWS Database Migration Service (DMS) とは](#aws-database-migration-service-dms-とは)
- [DMSの全体像](#dmsの全体像)
- [DMSの主な機能](#dmsの主な機能)
- [DMSの構成要素](#dmsの構成要素)
- [サポートされるデータベースエンジン](#サポートされるデータベースエンジン)
- [移行のタイプ](#移行のタイプ)
- [ソースデータベースの設定](#ソースデータベースの設定)
- [移行対象オブジェクト](#移行対象オブジェクト)
- [DMSの料金](#dmsの料金)
- [DMSのクォータ](#dmsのクォータ)
- [レプリケーションインスタンスの選択](#レプリケーションインスタンスの選択)
- [タスクの設定](#タスクの設定)
  - [テーブルマッピング](#テーブルマッピング)
  - [タスク設定](#タスク設定)
  - [変換ルール](#変換ルール)
- [モニタリングとログ](#モニタリングとログ)
- [ベストプラクティス](#ベストプラクティス)
- [トラブルシューティング](#トラブルシューティング)
- [📖 まとめ](#-まとめ)

## AWS Database Migration Service (DMS) とは

AWS Database Migration Service (DMS) は、データベースをAWSに安全かつ簡単に移行するためのフルマネージドサービスです。オンプレミスのデータベースからAWSへの移行、AWSクラウド内でのデータベース間の移行、さらには異なるデータベースエンジン間の移行も可能です。

移行中もソースデータベースは稼働し続けるため、ダウンタイムを最小限に抑えることができます。

【AWS Black Belt Online Seminar】[AWS Database Migration Service 概要(YouTube)](https://www.youtube.com/watch?v=oopjz4vu9CY)(37:19)

![dms-01-overview](/images/blackbelt/blackbelt-dms-01-overview-320.jpg)

【AWS Black Belt Online Seminar】[AWS Database Migration Service ベストプラクティス - 計画編(YouTube)](https://www.youtube.com/watch?v=teaU4tWraXE)(51:06)

![dms-02-plan](/images/blackbelt/blackbelt-dms-02-plan-320.jpg)

【AWS Black Belt Online Seminar】[AWS Database Migration Service ベストプラクティス - 実践編(YouTube)](https://www.youtube.com/watch?v=2tE9uCGrk6M)(47:01)

![dms-03-practice](/images/blackbelt/blackbelt-dms-03-practice-320.jpg)

【AWS Black Belt Online Seminar】[AWS Database Migration Service ベストプラクティス - トラブルシューティング編(YouTube)](https://www.youtube.com/watch?v=HDa_f9Tmf-U)(59:44)

![dms-04-troubleshooting](/images/blackbelt/blackbelt-dms-04-troubleshooting-320.jpg)

[生成 AI を活用したデータベースのスキーマ変換で移行を加速しよう：AWS Database Migration Service Schema Conversion（AWS-09）(YouTube)](https://www.youtube.com/watch?v=qAPNWy4WTGU)(40:06)

![dms-10-aws09](/images/blackbelt/blackbelt-dms-10-aws09-320.jpg)

[AWSブログ>はじめてAWS DMSを検討する際に読んでいただきたいこと](https://aws.amazon.com/jp/blogs/news/%E3%81%AF%E3%81%98%E3%82%81%E3%81%A6awsdms%E3%82%92%E6%A4%9C%E8%A8%8E%E3%81%99%E3%82%8B%E9%9A%9B%E3%81%AB%E8%AA%AD%E3%82%93%E3%81%A7%E3%81%84%E3%81%9F%E3%81%A0%E3%81%8D%E3%81%9F%E3%81%84/)

[AWS Database Migration Service サービス概要](https://aws.amazon.com/jp/dms/)

[AWS Database Migration Service ドキュメント](https://docs.aws.amazon.com/ja_jp/dms/)

[AWS Database Migration Service よくある質問](https://aws.amazon.com/jp/dms/faqs/)

[AWS Database Migration Service 料金](https://aws.amazon.com/jp/dms/pricing/)

## DMSの全体像

![dms](/images/all/dms.png)

## DMSの主な機能

DMSには次のような特徴があります。

- 同種・異種データベース間の移行
  - 同じデータベースエンジン間（例: Oracle → Oracle）だけでなく、異なるデータベースエンジン間（例: Oracle → PostgreSQL）の移行も可能
- 最小限のダウンタイム
  - 継続的なデータレプリケーション (CDC: Change Data Capture) により、移行中もソースデータベースを稼働し続けることが可能
- 多様なデータベースに対応
  - 商用データベース（Oracle、SQL Server）からオープンソースデータベース（PostgreSQL、MySQL、MariaDB）まで幅広くサポート
- データ変換機能
  - 異種間移行の場合は、[AWS Schema Conversion Tool (SCT)](https://docs.aws.amazon.com/SchemaConversionTool/latest/userguide/CHAP_Welcome.html) と連携することで、スキーマやコードの変換も支援

## DMSの構成要素

DMSを使用する際には、以下の4つの主要コンポーネントを理解する必要があります。

- IAM Role
  - `dms-vpc-role` と `dms-cloudwatch-logs-role` という**固定名称**のロールが必要です。
  - ターゲットデータベースにAmazon Redshiftを指定する場合は、 `dms-access-for-endpoint` というロールも必要になります。
  - 参考: [Creating the IAM roles to use with AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/security-iam.html#CHAP_Security.APIRole)
- エンドポイント
  - ソースエンドポイント
    - 移行元のデータベース接続情報を定義
    - データベースの種類、ホスト名、ポート番号、認証情報などを設定
  - ターゲットエンドポイント
    - 移行先のデータベース接続情報を定義
    - ソースと同様に接続に必要な情報を設定
- レプリケーションインスタンス
  - プロビジョンドインスタンス
    - 実際にデータ移行処理を実行するEC2インスタンス
    - VPC内に配置され、ソースとターゲットの両方にアクセス可能である必要がある
    - インスタンスタイプによって処理性能が変わる
  - サーバーレスインスタンス
    - EC2のプロビジョニング、エンジンバージョン、パッチ適用が不要なタイプ
    - レプリケーションが稼働している時間のみ課金されます。
      - ただし、レプリケーションが停止した状態（`Stopped`）でも`Deprovisioned`になるまでの48時間は課金が継続しているようです。
      - この48時間はレプリケーションが停止したインスタンスを再開可能な猶予時間のようです。48時間以内であれば、初期化などのフェーズを行わず再開が可能だが、この状態が課金対象となっているようです。
      - 参考: [AWS DMS Serverless Components](https://docs.aws.amazon.com/ja_jp/dms/latest/userguide/CHAP_Serverless.Components.html)
    - プロビジョンドインスタンスに比べてサポートしているソースデータベースとターゲットデータベースに制限がある
      - 参考: [DMS Serverless components - Supported Endpoints](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Serverless.Components.html#CHAP_Serverless.SupportedVersions)
- レプリケーションタスク
  - ソースデータベースからターゲットデータベースへの移行に関する移行方式やテーブルマッピングなどを管理する

## サポートされるデータベースエンジン

DMSがサポートする主なデータベースエンジンは以下のとおりです。

詳細なサポート状況については、[Sources for data migration](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.html) / [Targets for data migration](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.html)と[DMS Serverless components - Supported Endpoints](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Serverless.Components.html#CHAP_Serverless.SupportedVersions)を参照してください。

※ *付はサーバーレス

| データベースエンジン | ソース | ターゲット | *ソース | *ターゲット |
| :--- | :---: | :---: | :---: | :---: |
| Amazon S3 | ✅ | ✅ | ✅ | ✅ |
| Amazon Aurora (MySQL互換、PostgreSQL互換) | ✅ | ✅ | ✅ | ✅ |
| Amazon RDS (MySQL, PostgreSQL) | ✅ | ✅ | ✅ | ✅ |
| MySQL | ✅ | ✅ | ✅ | ✅ |
| GooleCloud for MySQL | ✅ |  |  |  | 
| OCI MySQL | ✅ |  |  |  | 
| PostgreSQL | ✅ | ✅ | ✅ | ✅ |
| GoogleCloud for PostgreSQL | ✅ |  |  |  | 
| Amazon RDS (MariaDB) | ✅ | ✅ | ✅ |  |
| MariaDB | ✅ | ✅ | ✅ |  |
| Amazon RDS (Oracle) | ✅ | ✅ | ✅ | ✅ |
| Oracle Database | ✅ | ✅ | ✅ | ✅ |
| Amazon RDS (SQL Server) | ✅ | ✅ | ✅ | ✅ |
| Microsoft SQL Server | ✅ | ✅ | ✅ | ✅ |
| Azure SQL Database | ✅ | ✅ |  |  |
| MongoDB | ✅ | ✅ | ✅ |  |
| SAP ASE (Sybase) | ✅ | ✅ |  |  |
| Amazon RDS (Db2) | ✅ | ✅ | ✅ |  |
| IBM Db2 (Linux, Unix, Windows用) | ✅ | ✅ | ✅ |  |
| Amazon DynamoDB |  | ✅ |  | ✅ |
| Amazon Redshift |  | ✅ |  | ✅ |
| Amazon OpenSearch Service |  | ✅ |  | ✅ |
| Amazon Kinesis Data Streams |  | ✅ |  | ✅ |
| Amazon DocumentDB | ✅ | ✅ | ✅ | ✅ |
| Amazon Neptune |  | ✅ |  | ✅ |
| Amazon Managed Streaming for Apache Kafka |  | ✅ |  | ✅ |
| Amazon Timestream |  | ✅ |  |  | 
| Babelfish |  | ✅ |  |  | 
| Redis OSS | ✅ |  |  |  |

## 移行のタイプ

DMSでは、要件に応じて3つの移行タイプを選択できます。

- フルロード (Full Load)
  - 既存データを一度だけ移行する方式です。移行中にソースデータベースで発生した変更は含まれません。
- フルロード + CDC (Change Data Capture)
  - 既存データの移行後、継続的にソースの変更をターゲットに反映します。最も一般的な移行パターンです。
- CDC のみ
  - 既存データは別の方法で移行済みの場合に、変更分のみを継続的に反映します。

## ソースデータベースの設定

DMSを使用する前に、ソースデータベースのパラメータを変更する必要があります。
以下に一例を示します。一部のパラメータにはデータベースの再起動が必要なものがありますので、移行前に確認が必要です。

そのほかについては、[Sources for data migration](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.html)を参照してください。

MySQL or MariaDB:

参考: [AWSドキュメント>Using a MySQL-compatible database as a source for AWS DMS](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.MySQL.html)

```text
binlog_format=ROW
binlog_row_image=FULL
```

PostgreSQL: 

参考: [AWSドキュメント>Using a PostgreSQL database as an AWS DMS source](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Source.PostgreSQL.html#CHAP_Source.PostgreSQL.RDSPostgreSQL.CDC)

```text
logical_replication=1
synchronous_commit=ON
```

## 移行対象オブジェクト

DMSでは、ソースデータベースの以下のオブジェクトが移行されます。

- テーブル
- プライマリキー

これ以外のオブジェクトは移行されないため、移行前または移行後に手動で作成する必要があります。
異種間データベース移行の場合は、[AWS SCT](https://docs.aws.amazon.com/SchemaConversionTool/latest/userguide/CHAP_Welcome.html)の利用も検討します。

- インデックス
- シーケンス
- ファンクション
- 外部キー
- ビュー
- トリガー など。

[AWSドキュメント>Migration planning for AWS Database Migration Service](https://docs.aws.amazon.com/dms/latest/userguide/CHAP_BestPractices.html)を参考にしてください。

```text
Source and target endpoints – Make sure that you know what information and 
tables in the source database need to be migrated to the target database. 
AWS DMS supports basic schema migration, including the creation of tables 
and primary keys. However, AWS DMS doesn't automatically create secondary 
indexes, foreign keys, user accounts, and so on, in the target database. 
Depending on your source and target database engine, you might need to set 
up supplemental logging or modify other settings for a source or target 
database. For more information, see Sources for data migration and Targets 
for data migration.
```

## DMSの料金

DMSの料金は、主に以下の要素で構成されます。

- レプリケーションインスタンスの料金
  - プロビジョンドインスタンス
    - 起動している時間に対して課金（時間単位）
    - インスタンスタイプによって料金が異なる
  - サーバーレスインスタンス
    - 
- 追加ストレージの料金
  - レプリケーションインスタンスに割り当てたストレージ容量に対して課金
- データ転送料金
  - 基本的に、同一リージョン内のデータ転送は無料
  - リージョン間のデータ転送には料金が発生

詳細は[料金ページ](https://aws.amazon.com/jp/dms/pricing/)を参照してください。

- 無料枠
  - AWS Free Tierの一部として、1 年間、毎月最大 750 時間分のシングルアベイラビリティーゾーン (AZ) dms.t3.microが利用可能です

## DMSのクォータ

DMSには以下のような制限があります。

| 項目 | デフォルト制限 | 引き上げ可能 |
|------|--------------|-------------|
| レプリケーションインスタンス数 | 60/アカウント | はい |
| レプリケーションタスク数 | 600/アカウント | はい |
| レプリケーションタスク数 | 200/レプリケーションインスタンス | はい |
| エンドポイント数 | 1,000/アカウント | はい |
| エンドポイント数 | 100/レプリケーションインスタンス | はい |
| サブネットグループ数 | 60/アカウント | はい |
| レプリケーション インスタンスの合計ストレージ容量 | 30 TB | はい |

その他の制限については、[AWSドキュメント](https://docs.aws.amazon.com/ja_jp/dms/latest/userguide/CHAP_Limits.html)を参照してください。

## レプリケーションインスタンスの選択

レプリケーションインスタンスの選択は、移行のパフォーマンスに大きく影響します。

インスタンスサイズの決定要因:

- 移行するデータ量
- 移行期間の要件
- ソースとターゲット間のネットワーク帯域幅
- CDCを使用する場合の変更率

インスタンスサイズの選択例:

- 小規模なデータベース（10GB未満）: dms.t3.medium
- 中規模なデータベース（10GB～100GB）: dms.c5.xlarge
- 大規模なデータベース（100GB以上）: dms.c5.2xlarge以上

実際の移行では、最初に小さいインスタンスで試験移行を実施し、パフォーマンスを確認してから本番移行用のインスタンスサイズを決定することを推奨します。

## タスクの設定

レプリケーションタスクには、以下のような重要な設定があります。

### テーブルマッピング

移行対象のテーブルを指定します。特定のテーブルのみ、または特定のスキーマ全体を対象にすることができます。

```json
{
  "rules": [
    {
      "rule-type": "selection",
      "rule-id": "1",
      "rule-name": "1",
      "object-locator": {
        "schema-name": "myschema",
        "table-name": "%"
      },
      "rule-action": "include"
    }
  ]
}
```

### タスク設定

タスクの動作を細かく制御できます。

```json
{
  "TargetMetadata": {
    "SupportLobs": true,
    "FullLobMode": false,
    "LobChunkSize": 64,
    "LimitedSizeLobMode": true,
    "LobMaxSize": 32
  },
  "FullLoadSettings": {
    "TargetTablePrepMode": "DROP_AND_CREATE",
    "CreatePkAfterFullLoad": false,
    "StopTaskCachedChangesApplied": false,
    "StopTaskCachedChangesNotApplied": false,
    "MaxFullLoadSubTasks": 8,
    "TransactionConsistencyTimeout": 600,
    "CommitRate": 10000
  }
}
```

主な設定項目は以下のとおりです。

- LOB (Large Object) の処理方法
  - 画像やテキストなどの大きなオブジェクトをどう扱うか
- フルロード時の動作
  - ターゲットテーブルを削除して作成するか、データを追加するか
- 並列処理の数
  - 同時に処理するサブタスクの数

### 変換ルール

DMSでは、移行時にテーブル名やカラム名を変換することができます。

テーブル名の変換

```json
{
  "rules": [
    {
      "rule-type": "transformation",
      "rule-id": "1",
      "rule-name": "1",
      "rule-target": "table",
      "object-locator": {
        "schema-name": "oldschema",
        "table-name": "%"
      },
      "rule-action": "rename",
      "value": "newschema",
      "old-value": null
    }
  ]
}
```

カラムの追加や削除

特定のカラムを移行対象から除外したり、新しいカラムを追加したりすることも可能です。

## モニタリングとログ

DMSタスクの状態は、Amazon CloudWatchで監視できます。

主要なメトリクス

- CDCLatencySource
  - ソースエンドポイントでの遅延時間
- CDCLatencyTarget
  - ターゲットエンドポイントでの遅延時間
- FullLoadThroughputRowsSource
  - フルロード時の処理行数/秒

ログの確認

CloudWatch Logsにレプリケーションタスクのログが出力されます。エラーが発生した場合は、まずここを確認します。

## ベストプラクティス

DMSを効果的に使用するためのベストプラクティスをいくつか紹介します。

移行前の準備

- ソースデータベースのバックアップを取得
- ネットワーク帯域幅を確認
- セキュリティグループとネットワークACLの設定を確認
- ソースデータベースでバイナリログやアーカイブログが有効になっているか確認

パフォーマンスの最適化

- 大きなテーブルは分割して移行
- インデックスの作成はフルロード後に実施
- 不要なトリガーやストアドプロシージャを一時的に無効化
- レプリケーションインスタンスとデータベースを同じAZに配置

セキュリティ

- VPC内にレプリケーションインスタンスを配置
- エンドポイントの認証情報はAWS Secrets Managerで管理
- 転送中のデータはSSL/TLSで暗号化

## トラブルシューティング

よくある問題と対処方法を紹介します。

接続エラー

エンドポイントのテスト接続が失敗する場合は、以下を確認してください。

- セキュリティグループの設定
- ネットワークACLの設定
- データベースのファイアウォール設定
- 認証情報の正確性

レプリケーション遅延

CDCの遅延が大きい場合は、以下を検討してください。

- レプリケーションインスタンスのサイズアップ
- 並列処理数の増加
- ターゲットデータベースのパフォーマンス向上
- 不要なインデックスの削除

メモリ不足エラー

レプリケーションインスタンスのメモリが不足している場合は、インスタンスタイプを変更するか、LOBの処理方法を見直します。

## 📖 まとめ

AWS Database Migration Serviceは、データベース移行を安全かつ効率的に実行するための強力なツールです。この記事では、DMSの基本的な概念から実践的な設定方法まで解説しました。

重要なポイントをまとめます。

- DMSは最小限のダウンタイムでデータベースを移行できる
- 同種・異種データベース間の移行に対応
- フルロード、CDC、またはその組み合わせで移行方式を選択
- レプリケーションインスタンスのサイズ選択が性能に影響
- CloudWatchでの監視とログ確認が重要

実際の移行では、必ず小規模な環境でテストを実施し、パフォーマンスやデータの整合性を確認してから本番環境に適用することをお勧めします。

