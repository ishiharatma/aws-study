# AWS Certified Security – Database 認定 (DBS-C01)

## ☘️ はじめに

本ページは、AWS 認定資格取得に向けて個人的に勉強した各サービスのキーワードを記載しております。AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

- [試験概要](https://aws.amazon.com/jp/certification/certified-database-specialty/?ch=tile&tile=getstarted)
- [試験ガイド](https://d1.awsstatic.com/ja_JP/training-and-certification/docs-database-specialty/AWS-Certified-Database-Specialty_Exam-Guide.pdf)
- [公式サンプル問題](https://d1.awsstatic.com/ja_JP/training-and-certification/docs-database-specialty/AWS-Certified-Database-Specialty_Sample-Questions.pdf)
- [Exam Readiness: AWS Certified Security - Database (Japanese) | AWS Skill Builder](https://explore.skillbuilder.aws/learn/course/external/view/elearning/8832/exam-readiness-aws-certified-database-specialty-japanese)
- [AWS Certified Database - Specialty Official Practice Question Set (DBS-C01 - Japanese) | AWS Skill Builder](https://explore.skillbuilder.aws/learn/course/external/view/elearning/12511/aws-certified-database-specialty-official-practice-question-set-dbs-c01-japanese)

- [](https://www.youtube.com/watch?v=Y2KnmHhyvc0&t=1653s)
- [Build a Modern Application with Purpose-Built AWS Databases](https://aws.amazon.com/jp/blogs/database/building-a-modern-application-with-purpose-built-aws-databases/)

## 参考

- https://qiita.com/tags/dbs

## 対象データベースサービス

- Amazon Aurora (PostgreSQL, MySQL, Serverless)
  - MySQL や PostgreSQL と互換性のあるリレーショナルデータベース
- Amazon DocumentDB (MongoDB 互換)
  - ネイティブ JSON ドキュメントデータベース
  - MongoDB 互換
- Amazon DynamoDB
  - サーバーレス key-value NoSQL データベース
- Amazon DynamoDB Accelerator (DAX)
  - DynamoDB 用高可用性インメモリキャッシュサービス
- Amazon ElastiCache (Redis, Memcached)
  - キャッシングサービス
- （範囲外）Amazon MemoryDB for Redis
  - [Amazon MemoryDB for Redis【AWS Black Belt】](https://www.youtube.com/watch?v=d518N7kzSpE)
    - ElastiCache For Redis と比べるとクラスターが必須になっている
    - 耐久性に優れている
- Amazon Keyspaces (Apache Cassandra 向け)
  - サーバーレス Apache Cassandra 互換のデータベース
- Amazon Neptune
  - グラフデータベース
  - プロビジョンドとサーバーレスが提供される
- Amazon Quantum Ledger Database (Amazon QLDB)
  - 台帳管理専用データベース
- Amazon RDS (Oracle, PostgreSQL, MySQL, SQLServer, DB2(Nov 27, 2023))
  - リレーショナルデータベース
- Amazon Redshift
  - データウェアハウスサービス
- Amazon Timestream
  - サーバーレス時系列データベース

## 移行

- AWS Database Migration Service (AWS DMS)
- AWS DataSync
- AWS Schema Conversion Tool (AWS SCT)
- AWS Snow ファミリー

## 試験範囲

### 第 1 分野: ワークロード固有のデータベース設計 (採点対象コンテンツの 26%)

- RDS for Multi-AZ を設定し同期レプリケーションとスタンバイデータベースへの自動フェイルオーバー
  - フェイルオーバー時のパフォーマンスを安定させるためには、プロビジョニングされた IOPS 用に最適化されたデータベースインスタンスクラス
- ElastiCache for Memcached でクラスターノードを構成し、異なる AZ に SPOF 軽減
- ElastiCache 、DynamoDB アクセラレーター（DAX、インメモリキャッシュ、VPC 内に配置）で一時的な高レイテンシーや可用性への影響を軽減
- CW イベントでバックアップが完了するたびに Lambda をトリガー、バックアップを別リージョンにコピー
- [RDS と Aurora の比較](https://zenn.dev/issy/articles/zenn-rds-aurora-overview#rds-%E3%81%A8-aurora-%E3%81%AE%E6%AF%94%E8%BC%83%E3%82%B5%E3%83%9E%E3%83%AA)
- Aurora のベストプラクティス
  - [Amazon Aurora MySQL を使用する際のベストプラクティス](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.BestPractices.html)
  - [Amazon Aurora PostgreSQL を使用する際のベストプラクティス](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/AuroraPostgreSQL.BestPractices.html)
  -
- Aurora のフェイルオーバー、リストア、バックトラックなどの回復機能をテスト
  - [Aurora DB クラスターのバックトラック](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Managing.Backtrack.html)
    - MySQL 互換エディション では、データリストアではなく特定時刻まで「巻き戻し」できる機能がある
    - PostgreSQL ではできない
- Aurora のフェイルオーバーは 30 秒未満
- Amazon Aurora グローバルデータベースクラスターは、AWS リージョン間で一秒未満のレプリケーションを提供するシングルマスタークラスタ
- Amazon DynamoDB グローバルテーブルはグローバルに分散したユーザーを持つ大規模なスケールのアプリケーション向け
- Neptune は 3 つの AZ に 6 つのコピーを複製。耐障害性の自己修復ストレージを供えている
- データ駆動型のアプローチ
- パーティショニングやシャーディングはデータの増加に対応
  - ⇒ 複雑さが増す
- キャッシュは遅延を減らす
  - ⇒ 古いデータに関する戦略が必要
  - ElastiCache では書き込みスルーと TTL
- レプリケーション
  - 読み取りスループットを向上させる
  - ⇒ 一貫性については、「最終的」
- スケールアップ（垂直方向）またはスケールアウト（水平方向）
  - DynamoDB
    - ストレージとコンピューティングを個別に拡張
    - [DynamoDB Auto Scaling によるスループットキャパシティの自動管理](https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/AutoScaling.html)
    - [Amazon DocumentDB クラスターのスケーリング](https://docs.aws.amazon.com/ja_jp/documentdb/latest/developerguide/db-cluster-manage-performance.html)
    - セカンダリインデックスはストレージ消費。属性を制限することで削減可能
      - 存在しない属性へのクエリが発生したらテーブルへの追加フェッチとなりコスト発生、バランスを考慮
  - Redis
    - マネジメントコンソールで
    - [ElastiCache for Redis クラスターのスケーリング](https://docs.aws.amazon.com/ja_jp/AmazonElastiCache/latest/red-ug/Scaling.html)
    - [ElastiCache for Memcached クラスターのスケーリング](https://docs.aws.amazon.com/ja_jp/AmazonElastiCache/latest/mem-ug/Scaling.html)
  - Aurora サーバーレス
    - 自動的に拡張と縮小
    - [Aurora DB クラスターのパフォーマンスとスケーリングの管理](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Performance.html)
  - RDS
    - [リードレプリカの使用](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html)
  - Neptune
    - [Amazon Neptune でのパフォーマンスとスケーリング](https://docs.aws.amazon.com/ja_jp/neptune/latest/userguide/manage-console-performance-scaling.html)
  - QLDB
    - [概要](https://docs.aws.amazon.com/ja_jp/qldb/latest/developerguide/what-is.overview.html)
- コスト最適化サポートツール
  - Redshift Advisor
  - Performance Insights (RDS/Aurora)
  - Trusted Advisor
  - CloudWatch
  - Cost Explorer
  - 請求コンソール

### 第 2 分野: デプロイと移行 (採点対象コンテンツの 20%)

- [AWS re:Invent 2018: [REPEAT 1] Databases on AWS: The Right Tool for the Right Job (DAT205-R1)](https://youtu.be/-pb-DkD6cWg)
- AWS CloudFormation で自動化
  - [AWS CloudFormation ユーザーガイド： ベストプラクティス](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/best-practices.html)
- 移行
  - 移行の準備
  - 移行プロセス
    - [AWS スキーマ変換ツール（AWS SCT）](https://aws.amazon.com/dms/schema-conversion-tool/) を使用して、移行元スキーマオブジェクトを移行先オブジェクトに変換
      - クライアントにダウンロードして使用するツール
      - 変換できなかったものを手動で
    - AWS データベース移行サービス (AWS DMS) を使用して移行
      - SCT と同じようなスキーマ変換を行うマネージドサービスとして、Schema Conversion が含まれる。ただし、[サポートされる変換に制約あり](https://aws.amazon.com/jp/dms/schema-conversion-tool/)
      - 異機種間移行
        - データベースエンジンを変更する移行
          - e.g) Oracle -> Aurora PostgreSQL
        - 移行時の注意
          - データ型の変更されるケース
          - 空文字の扱い。NULL とするのかしないのか。Oracle ＝ NULL、PostgreSQL≠NULL
          - [Oracle、または Microsoft SQL サーバーから PostgreSQL に移行する際のコード変換の課題](https://aws.amazon.com/jp/blogs/database/code-conversion-challenges-while-migrating-from-oracle-or-microsoft-sql-server-to-postgresql/)
          - [アプリケーションをクラウドに移行するための 6 つの戦略](https://aws.amazon.com/jp/blogs/enterprise-strategy/6-strategies-for-migrating-applications-to-the-cloud/)
          - [Oracle から PostgreSQL への移行中に直面する一般的な課題の解決方法](https://aws.amazon.com/jp/blogs/database/how-to-solve-some-common-challenges-faced-while-migrating-from-oracle-to-postgresql/)
      - 同種移行
        - データベースエンジンを変更しない
    - [Best Practices for Database Migration to the Cloud | AWS@YouTube](https://youtu.be/asx_VOUTxaU)
    - スキーマオブジェクトの検証
  - ワークロードの適格化
    - AWS ワークロード認定フレームワーク (AWS WQF)
  - 移行の評価
    - パッケージの検証
    - テーブルの検証
      - データ型
    - ビューの検証
    - 配列の検証
    - トリガーの検証
    - 主キーの検証
    - インデックスの検証
    - チェック制約の検証
    - 外部キーの検証
    - [AWS SCT と AWS DMS を使用した移行後のデータベースオブジェクトの検証](https://aws.amazon.com/blogs/database/validating-database-objects-after-migration-using-aws-sct-and-aws-dms/)
- AWS DMS を使用してリージョン A から B に RDS for Oracle を移行したい
  - DMS はレプリケーションインスタンスを作成し、ソース DB とターゲット DB への接続を作成する
  - レプリケーションインスタンスはターゲットリージョンに作成するのを推奨
  - ソース DB には VPC ピアリング接続などを使用
- データ移行のあとに移行結果を検証したい
  - DMS データ検証を使ってレポートする
- RDS for MySQL や PostgreSQL を Aurora に移行したい（同種移行）
  - RDS インスタンスから Aurora のリードレプリカを作成
  - RDS インスタンスへのトランザクションが発生していないことを確認
  - Aurora のリードレプリカを昇格
  - アプリケーションのエンドポイントを変更
  - RDS インスタンスの停止、削除
- リードレプリカをもつ RDS を停止したい
  - マルチ AZ の RDS for SQL Server は停止できない。それ以外は下記の通り。
  - リードレプリカがある場合は、リードレプリカを削除してから、プライマリ DB を停止する。（リードレプリカは停止できない）[一時的に Amazon RDS DB インスタンスを停止する](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_StopInstance.html)
  - DB インスタンスは最大 7 日間連続して停止できるが、その後自動的に起動される
    - [Step Functions を使用して Amazon RDS インスタンスを 7 日以上停止する方法を教えてください | re:Post](https://repost.aws/ja/knowledge-center/rds-stop-seven-days-step-functions)
- [HIPAA](https://aws.amazon.com/jp/compliance/hipaa-compliance/) に準拠しているキャッシュ層
  - [ElastiCache for Redis](https://docs.aws.amazon.com/ja_jp/AmazonElastiCache/latest/red-ug/elasticache-compliance.html#elasticache-compliance-hipaa)
    - ElastiCache for Memcached は準拠していない
- Aurora クラスターに障害があったときの昇格
  - フェイルオーバの優先順位がある場合
    - 指定した優先度に従う。
  - インスタンスタイプが異なる場合
    - サイズの大きいものが優先される。
- RDS でパフォーマンス問題：データベースの待機イベントを調べたい
  - Performance Insights
- RDS でのパフォーマンス問題：CPU 使用率など
  - 拡張モニタリングを有効
  - Performance Insights
- RDS でデータが暗号化されていないインスタンスを暗号化したい
  - スナップショットを作成 - スナップショットをコピー時に暗号化（別アカウントにコピーするときはデフォルト KMS（aws/rds） ではなく CMK を）
    - 別リージョンにコピーするときは別リージョンの KMS キー
    - 別アカウントの場合は、スナップショットを共有する。暗号化の CMK キーはキーポリシーでコピー先アカウントにキーへのアクセスを許可
      - 共有先アカウントでは、共有スナップショットを自アカウントにコピーする
  - 暗号化したスナップショットを新しいインスタンスに復元
  - [Amazon Aurora の暗号化された DB クラスターの制限事項](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/Overview.Encryption.html#Overview.Encryption.Limitations)
  - 暗号化されていないクラスタ ⇒ 暗号化スナップショット、レプリカは作成できない
  - 暗号化されたクラスタ ⇒ 暗号化ＯＦＦはできない

### 第 3 分野: マネジメントとオペレーション (採点対象コンテンツの 18%)

- RDS / Aurora
  - RDS
    - セキュリティやインスタンスの安定性に関するパッチが必要ですが、他のパッチは無期限に延期可能
    - DB パラメータ
      - 静的パラメータ　 ⇒ 再起動必要、メンテナンスウィンドウか手動
      - 動的パラメータ　 ⇒ 即時反映
    - インスタンスの状態
      - 「FAILED」または「INCOMPATIBLE-NETWORK」の場合は、データベースが動作していない
        - エラーを解決しないといけない
      - describe-db-instances
    - 自動バックアップ
      - リードレプリカからバックアップを。
      - 保持期間は、～ 35 日、デフォルト 7 日
      - RDS や ElastiCache は 0 日＝自動バックアップ無効にできる
      - Aurora や Neptune は 1 日＝自動バックアップ無効不可
    - 手動バックアップ
      - 自動的に削除されない
      - 自動バックアップを保持期間を超えて保持したい場合、自動バックアップをコピーするのが手軽
    - RPO(目標復旧地点)
      - ポイントインタイムリカバリ (PITR)
    - RTO(目標復旧時間)
      - レプリカ
      - 2 分未満
  - Aurora
    - RPO(目標復旧地点)
      - ポイントインタイムリカバリ (PITR)
      - 1 秒
    - RTO(目標復旧時間)
      - 約 1 分
      - グローバル Aurora クラスター内のリージョン間での非同期データレプリケーション
  - スナップショットから復元時
    - [DB スナップショットからの復元](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_RestoreFromSnapshot.html)
    - セキュリティグループ
      - 明示的に指定しないと、デフォルトセキュリティグループ
      - CLI だと、`--vpc-security-group-ids`
    - パラメータグループ
      - 明示的に指定しないと、デフォルトになる
    - オプショングループ
      - スナップショット作成時のオプショングループを引き継ぐ
      - 同一 VPC 以外に復元する場合は、新しく作成しなければならない
- ElastiCache
  - 自動でバージョンアップされない
- DynamoDB
  - インストール、保守、運用するソフトウェアなし
  - [DynamoDB グローバルセカンダリインデックスを使用してクエリのパフォーマンスを向上させ、コストを削減する方法:](https://aws.amazon.com/blogs/database/how-to-use-dynamodb-global-secondary-indexes-to-improve-query-performance-and-reduce-costs/)
  - RPO(目標復旧地点)
    - 約 5 分
    - Amazon S3 へのレプリケーションログ配信のタイミング
  - RTO(目標復旧時間)
    - 長くなる可能性
- Neptune
  - RPO(目標復旧地点)
    - 自動継続バックアップ
  - RTO(目標復旧時間)
    - 5 分
- マルチ AZ の RDS
  - レプリケーションは同期的
  - 同一リージョンの複数 AZ に作成される
  - マイナーバージョンアップ（アップデート）
    - スタンバイインスタンスをアップデート
    - フェイルオーバー（最小のダウンタイム）
    - 旧プライマリインスタンスをアップデート
  - メジャーバージョンアップ（アップグレード）
    - プライマリ、セカンダリを同時にアップグレード
    - ダウンタイムあり
- RDS のリードレプリカ
  - レプリケーションは非同期的
  - AZ、リージョン選択可能
  - 5 個まで
  - フェイルオーバー不可、昇格するとスタンドアロンインスタンスとなり分離される。戻せない。
- RDS for MySQL のリードレプリカ
  - https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_MySQL.Replication.ReadReplicas.html
  - read_only =falase にすると書き込み可能なリードレプリカにできる
    - ただし、書き込みの影響を理解しないで実施すると不整合が発生し、レプリケーション障害になるので注意
  - カスケードリードレプリカ
    - https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_MySQL.Replication.ReadReplicas.html#USER_MySQL.Replication.ReadReplicas.Cascading
- RDS for PostgreSQL のリードレプリカ
  - https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_PostgreSQL.Replication.ReadReplicas.html
- RDS for MariaDB のリードレプリカ
  - https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_MariaDB.Replication.ReadReplicas.html
  - MySQL と同じく、read_only =falase にすると書き込み可能なリードレプリカにできる
- RDS for Oracle のリードレプリカ
  - https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/oracle-read-replicas.html
- RDS for SQL Server のリードレプリカ
  - https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/SQLServer.ReadReplicas.html
  - SQL Server Enterprise Edition (EE) エンジンでのみ
  - AlwaysOn 可用性グループ (AG) を持つマルチ AZ
- Aurora のリードレプリカ（＝リーダーインスタンス）
  - 15 個まで
  - ライターインスタンスと同じストレージクラスタのエンドポイントを参照
  - フェイルオーバー可能、優先順にづけ、同一優先順位の場合、サイズの大きいものを優先

### 第 4 分野: モニタリングとトラブルシューティング (採点対象コンテンツの 18%)

- RDS のフェイルオーバー
  - プライマリインスタンスのサブネットにスタンバイインスタンスのサブネットとは異なるルーティングを定義している場合
  - DB 接続問題が発生する可能性
  - サブネットグループ
- AWS Database Migration Service (AWS DMS) を使用したデータベースの移行中に一般的に遭遇する状況
  - [AWS Database Migration Service での移行タスクのトラブルシューティング](https://docs.aws.amazon.com/ja_jp/dms/latest/userguide/CHAP_Troubleshooting.html)
  - エラー: 識別子が長すぎます
    - オブジェクト名が長い
    - ターゲット DB にテーブルなどを予め作成
    - or [ターゲットテーブル準備モード] を [何もしない] または [切り捨てる] に設定したタスク
  - エラー: サポートされていない文字セットのため、フィールドデータ変換に失敗しました
    - サポートされていない文字セットが原因でフィールドデータの変換に失敗
    - UTF8MB4 エンコーディングを使用している とか。
  - エラー: コードページ 1252 から UTF8 [120112] フィールドデータの変換に失敗しました。
    - MySQL データベースに コードページ 1252 文字以外の文字がある場合
    - CharsetMapping 追加接続属性を使用して、文字セットのマッピングを指定
  - DMS を使用した移行で CDC のターゲットのレイテンシが増加する
    - https://repost.aws/ja/knowledge-center/dms-high-target-latency
    - ターゲット DB に十分なインデックスまたは主キーがない
    - インスタンスで CPU、メモリ、I/O などのリソースのボトルネックに
    - https://docs.aws.amazon.com/ja_jp/dms/latest/userguide/CHAP_BestPractices.html
    - アクセスパターンに基づいてテーブルを個別の DMS タスクに分散し並列処理
    - 複数のレプリケーションインスタンス
- Aurora データベースアクティビティストリーム
  - https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/DBActivityStreams.html
  - Amazon Kinesis データストリーム
  - 非同期モード
  - 同期モード
    - PostgreSQL のみ
  - [監査ログの内容と例](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/DBActivityStreams.Monitoring.html#DBActivityStreams.AuditLog)
- オンプレのデータ移動
  - 帯域幅と転送速度の制限で
    - Direct Connect
    - Snowball
    - Snowmobile
    - Storage Gateway
  - リアルタイムに
    - Kinesis Data Firehose
    - Kinesis Video Streams
    - Iot Core

### 第 5 分野: データベースセキュリティ (採点対象コンテンツの 18%)

- データベースの暗号化
  - 保管中
    - KMS
    - 認証情報は Secrets Management
    - RDS/Aurora
    - Redis / DocumentDB / Neptune / Redshift
      - オプション
    - DynamoDB / QLDB
      - 暗号化される
  - 転送中
    - TLS
- VPC 内サービス
  - Amazon、RDS; Amazon Aurora; Amazon DocumentDB; Amazon Neptune; Amazon ElastiCache; Amazon Redshift
  - セキュリティグループ
- VPC 外サービス
  - DynamoDB や Amazon QLDB
  - VPC エンドポイント
  - VPC エンドポイントポリシー
- RDS の IAM 認証

  - IAM ユーザまたは IAM ロールの作成

    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": ["rds-db:connect"],
          "Resource": [
            "arn:aws:rds-db:us-east-2:1234567890:dbuser:db-ABCDEFGHIJKL01234/db_user"
          ]
        }
      ]
    }
    ```

  - `CREATE USER Alice IDENTIFIED WITH AWSAuthenticationPlugin AS 'RDS';`
  - `generate-db-auth-token` で取得したトークンを password に指定する
  - [Use IAM authentication to connect with SQL Workbench/J to Amazon Aurora MySQL or Amazon RDS for MySQL](https://aws.amazon.com/jp/blogs/database/use-iam-authentication-to-connect-with-sql-workbenchj-to-amazon-aurora-mysql-or-amazon-rds-for-mysql/)
  - [Using IAM authentication to connect with pgAdmin Amazon Aurora PostgreSQL or Amazon RDS for PostgreSQL](https://aws.amazon.com/jp/blogs/database/using-iam-authentication-to-connect-with-pgadmin-amazon-aurora-postgresql-or-amazon-rds-for-postgresql/)
