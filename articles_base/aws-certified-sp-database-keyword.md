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

## 詳細

### Amazon Aurora (PostgreSQL, MySQL, Serverless)

MySQL や PostgreSQL と互換性のあるリレーショナルデータベース

フェイルオーバーしたときアプリケーション側の TTL で古いエンドポイントに接続する問題

Serverless v1 の Data API
[Data API (AWS PrivateLink) 用に Amazon VPC エンドポイントを作成する](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/data-api.html#data-api.vpc-endpoint)

[Aurora クラスターの削除保護](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/USER_DeleteCluster.html#USER_DeletionProtection)

[Amazon Aurora での機械学習機能の使用](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/aurora-ml.html)

Aurora DB クラスターを Amazon Comprehend または Amazon SageMaker、あるいはその両方と統合

- SageMaker は多くの機械学習機能を提供するサービスなの特定の用途では過剰になるケースもある。例えば、勘定分析のような場合は、Comprehend で十分

- IAM 認証

  - `generate-db-auth-token`

- [Aurora Database Activity Streams](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/DBActivityStreams.html)
  - コンプライアンスおよび規制要件を満たすため。
  - アクティビティをほぼリアルタイムで Amazon Kinesis データストリームにプッシュ
  - これ自体は無料だが、Kinesis の処理は課金対象
  - 非同期モード、同期モード（MySQL だけ。DB のパフォーマンスに影響あり）
  - KMS で常に暗号化されている
  - [監査ログ](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/DBActivityStreams.Monitoring.html#DBActivityStreams.AuditLog)

### PostgreSQL

- [Babelfish for Aurora PostgreSQL](https://aws.amazon.com/jp/rds/aurora/babelfish/)
  - Aurora が Microsoft SQL Server 用に作成されたアプリケーションからのコマンドをそのまま利用できるようになる変換レイヤー

[障害挿入クエリを使用した Amazon Aurora PostgreSQL のテスト](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/AuroraPostgreSQL.Managing.FaultInjectionQueries.html)

- インスタンスのクラッシュのテスト
  - SELECT aurora_inject_crash ('instance' | 'dispatcher' | 'node');
    - instance
      - インスタンスの障害
    - dispatcher
      - ライターインスタンスのディスパッチャーの障害
    - node
      - INSTANCE と DISPATCHER の両方
  - フェイルオーバーが発生しない
- Aurora レプリカの障害のテスト
  - SELECT aurora_inject_replica_failure()
  - フェイルオーバーが発生しない
- ディスクの障害のテスト
  - SELECT aurora_inject_disk_failure()
  - フェイルオーバーが発生する
- ディスクの輻輳のテスト

  - SELECT aurora_inject_disk_congestion()

## オンプレ PostgreSQL からの移行

### MySQL

- InnoDB
- [障害挿入クエリを使用した Amazon Aurora MySQL のテスト](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Managing.FaultInjectionQueries.html)

  - インスタンスのクラッシュのテスト
    - ALTER SYSTEM CRASH [ INSTANCE | DISPATCHER | NODE ];
      - INSTANCE
        - インスタンスの障害
      - DISPATCHER
        - ライターインスタンスのディスパッチャーの障害
      - NODE
        - INSTANCE と DISPATCHER の両方
    - フェイルオーバーが発生しない
  - Aurora レプリカの障害のテスト
    - ALTER SYSTEM SIMULATE READ REPLICA FAILURE
    - フェイルオーバーが発生しない
  - ディスクの障害のテスト
    - ALTER SYSTEM SIMULATE DISK FAILURE
    - フェイルオーバーが発生する
  - ディスクの輻輳のテスト
    - ALTER SYSTEM SIMULATE DISK CONGESTION

- [Amazon Aurora が MySQL 5.6 から 5.7 へのインプレースアップグレードをサポート](https://aws.amazon.com/jp/about-aws/whats-new/2021/01/amazon-aurora-supports-in-place-upgrades-mysql-5-6-to-5-7/?nc1=h_ls)

- オンプレ MySQL からの移行

  - [外部の MySQL データベースから Amazon Aurora MySQL DB クラスターへのデータ移行](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Migrating.ExtMySQL.html)
    - [mysqldump を使用した MySQL から Amazon Aurora MySQL への論理的移行](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Migrating.ExtMySQL.mysqldump.html)
      - 手軽
    - [Percona XtraBackup と Amazon S3 を使用した MySQL からの物理的な移行](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Migrating.ExtMySQL.S3.html)
      - mysqldump より早くロードできる
    - [ダウンタイムを短縮して Amazon RDS MariaDB または MySQL データベースにデータをインポートする](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/MySQL.Procedural.Importing.NonRDSRepl.html)

- [Amazon Aurora MySQL DB クラスターでのアドバンストな監査の使用](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Auditing.html)
  - server_audit_logging
  - server_audit_events
  - server_audit_incl_users
  - server_audit_excl_users

### Amazon DocumentDB (MongoDB 互換)

ネイティブ JSON ドキュメントデータベース,MongoDB 互換

クエリの実行速度が予想よりも遅い理由を判断するには、[Explain()](https://docs.aws.amazon.com/ja_jp/documentdb/latest/developerguide/querying.html#querying.queryplan)を使う

変更の管理 ⇒AWS CloudTrail 、イベント サブスクリプション

[Amazon DocumentDB 高可用性とレプリケーション](https://docs.aws.amazon.com/ja_jp/documentdb/latest/developerguide/replication.html)

[読み込み設定のオプション](https://docs.aws.amazon.com/ja_jp/documentdb/latest/developerguide/how-it-works.html#durability-consistency-isolation)

- secondary - secondary 読み取り設定を指定すると、読み取りはレプリカのみにルーティングされ、プライマリインスタンスにルーティングされることはありません。

DocumentDB クラスターの配置を自動検出するには、レプリカ セット モードでクラスター エンドポイント

1 ～ 35 日間、継続的にバックアップで PITR

AWS KMS キーを指定することで、暗号化されていないスナップショットを暗号化されたクラスターに復元可能

転送中の暗号化は、tls パラメータ

[監査ログを有効にするには](https://docs.aws.amazon.com/ja_jp/documentdb/latest/developerguide/event-auditing.html)

- audit_logs
  - enabled か ddl、dml_read、dml_write
- Amazon CloudWatch Logs のエクスポートを有効

[プロファイラー ログ](https://docs.aws.amazon.com/ja_jp/documentdb/latest/developerguide/profiling.html)

- クラスターで実行されたオペレーションの実行時間と詳細をログに記録することができる。 -　使用可能なカスタムクラスターパラメータグループを使用して、profiler、profiler_threshold_ms および profiler_sampling_rate のパラメータを変更
- CloudWatch Logs への profiler ログのエクスポートを有効

### Amazon DynamoDB

サーバーレス key-value NoSQL データベース

VPC エンドポイントで内部接続に。

- バックアップ

  - オンデマンドバックアップ機能
    - 別リージョン、別アカウントにコピーはできない
    - 自動では行われない
  - AWS Backup
    - [アドバンスト DynamoDB バックアップ](https://docs.aws.amazon.com/ja_jp/aws-backup/latest/devguide/advanced-ddb-backup.html)
      - リージョン間、アカウント間コピー

- S3 に日時でバックアップ
  - [How to export an Amazon DynamoDB table to Amazon S3 using AWS Step Functions and AWS Glue](https://aws.amazon.com/jp/blogs/big-data/how-to-export-an-amazon-dynamodb-table-to-amazon-s3-using-aws-step-functions-and-aws-glue/)
- S3 にリアルタイムで
  - DynamoDB Streams ⇒ Kinesis Firehose
- [保管時の DAX 暗号化](https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/DAXEncryptionAtRest.html)

- [PITR](https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/PointInTimeRecovery_Howitworks.html#howitworks_restoring)
  - 選択した日時で新しいテーブルを作成する
  - 別リージョンにも可能
  - 復元したテーブルは以下を手動で
    - Auto Scaling ポリシー
    - AWS Identity and Access Management (IAM) ポリシー
    - Amazon CloudWatch メトリクスおよびアラーム
    - タグ
    - ストリーム設定
    - 有効期限 (TTL) 設定
    - ポイントインタイムリカバリ設定
  - PITR が有効なテーブルを削除すると自動的にシステムバックアップというスナップショットを作成する
    - 35 日間保持するので復元可能
    - ただし、削除時点まで。それ以前への PITR は不可
- クエリ
  - パーティションキーが必要
    - パーティションキーのデータが読み取られる
  - フィルターで絞り込み
    - その後フィルタ
- スキャン
  - パーティションキーなしで OK
    - テーブルまたはセカンダリインデックス全体を読み取る
  - フィルターで絞り込み
- GetItem
  - パーティションキーのみ
- BatchGetItem

### Amazon DynamoDB Accelerator (DAX)

DynamoDB 用高可用性インメモリキャッシュサービス

### Amazon ElastiCache (Redis, Memcached)

キャッシングサービス

[Redis レプリケーションについて](https://docs.aws.amazon.com/ja_jp/AmazonElastiCache/latest/red-ug/Replication.Redis.Groups.html)

クラスタモードが無効
シャードが１つ ⇒0~5 個のレプリカノード
耐障害性を向上 ⇒ [レプリカをマルチ AZ にする](https://docs.aws.amazon.com/ja_jp/AmazonElastiCache/latest/red-ug/AutoFailover.html)。同一リージョンのみ。
レプリカが自動でフェイルオーバーする

クラスタモードが有効
シャードが複数 ⇒0~5 個のレプリカノード
耐障害性を向上 ⇒ レプリカをマルチ AZ にする。同一リージョンのみ。
レプリカはプライマリノードになれない。

[Global Datastore を使用した AWS リージョン間のレプリケーション](https://docs.aws.amazon.com/ja_jp/AmazonElastiCache/latest/red-ug/Redis-Global-Datastore.html)

- プライマリクラスター　ー　セカンダリクラスター

### （範囲外）Amazon MemoryDB for Redis

[Amazon MemoryDB for Redis【AWS Black Belt】](https://www.youtube.com/watch?v=d518N7kzSpE)

- ElastiCache For Redis と比べるとクラスターが必須になっている
- 耐久性に優れている

### Amazon Keyspaces (Apache Cassandra 向け)

サーバーレス Apache Cassandra 互換のデータベース

[PITR](https://docs.aws.amazon.com/ja_jp/keyspaces/latest/devguide/PointInTimeRecovery.html)で過去 35 日以内の任意の時点の状態にテーブルデータを復元することができる。

[Amazon Keyspaces の有効期限 (TTL) を使用してデータを期限切れにする](https://docs.aws.amazon.com/ja_jp/keyspaces/latest/devguide/TTL.html)

### Amazon Neptune

グラフデータベース,プロビジョンドとサーバーレスが提供される

- 基本的なアーキテクチャは Aurora と同じ。リーダ・ライター・ストレージ
  - Aurora にあるバックトラックはない
- グローバルデータベースも Aurora と同じ機能
  - ただし、書き込みスルーはできない。
  - 5 つのセカンダリ DB クラスタと、クラスタごとにリーダーインスタンスを 16 個
- ポートは 8182
- [Neptune ワークベンチでのグラフの視覚化](https://docs.aws.amazon.com/ja_jp/neptune/latest/userguide/notebooks-visualization.html)
  - クエリ結果の視覚図を作成し、また表形式にして返す
  - 実体は同じ VPC 内の EC2
- [Amazon Neptune にデータをロードする](https://docs.aws.amazon.com/ja_jp/neptune/latest/userguide/load-data.html)
  - [Neptune Bulk Loader（Amazon Neptune 一括ローダ）](https://docs.aws.amazon.com/ja_jp/neptune/latest/userguide/bulk-load.html)
    - [前提条件: IAM ロールと Amazon S3 アクセス](https://docs.aws.amazon.com/ja_jp/neptune/latest/userguide/bulk-load-tutorial-IAM.html)
    - Gremlin ロード形式
    - openCypher データロード形式
- クエリ
  - クエリはキューイングされて実行される。メトリクスで数を調べられる。
  - [SPARQL](https://docs.aws.amazon.com/ja_jp/neptune/latest/userguide/access-graph-sparql.html)
    - ウェブ用に設計されたグラフデータ形式であるリソース記述フレームワーク (RDF) のためのクエリ言語
    - SPARQL UPDATE INSERT は小さなデータセットに対しては有効だが、大量データをロードするときは、Neptune Bulk Loader を使う
  - [Gremlin クエリ](https://docs.aws.amazon.com/ja_jp/neptune/latest/userguide/access-graph-gremlin.html)
    - グラフ DB の操作を統一的に行えるようにする仕組み
    - 財務書類などの膨大な量の非構造化データ間の関係を効率的に判断して視覚化
- [Neptune Streams](https://docs.aws.amazon.com/ja_jp/neptune/latest/userguide/streams.html)
  - DynamoDB Streams みたいなもの。変更をストリームする
  - DR 対策で、別リージョンのクラスタにストリーミング可能
    - VPC ピアリング
- [Amazon Neptune DB クラスターのバックアップと復元](https://docs.aws.amazon.com/ja_jp/neptune/latest/userguide/backup-restore.html)
  - 自動バックアップ
    - 1 日～ 35 日
    - クラスター削除時には削除される
    - PITR に使える
      - RPO ＝ 5 分
  - 手動スナップショット
  - リストアは新規クラスタ
    - 暗号化されていないスナップショットはリストア時に暗号化してリストアできる
  - スナップショットのコピー
    - 同じリージョン、リージョン間でコピー可能
    - 別リージョンコピーだとフルスナップショットになるので転送コスト注意
      - DR 対策でも
    - 暗号化スナップショットを非暗号化スナップショットにはできない
  - スナップショットの共有
    - 共有されるスナップショットはフルスナップショットとなる。
    - 共有されてスナップショットをコピーしてリストア
    - 共有されたスナップショットから直接リストア
    - 自動スナップショットは、手動スナップショットにコピーしてから共有
    - デフォルト暗号化のスナップショットは共有できない
- [Amazon Neptune リソースのモニタリング](https://docs.aws.amazon.com/ja_jp/neptune/latest/userguide/monitoring.html)
  - CloudWatch メトリクス
  - 監査ログ
    - パラメータ：neptune_enable_audit_log =1(有効)
    - 再起動必要
  - CloudWatch Logs
  - CloudTrail
  - イベント通知
- ノートブック

### Amazon Quantum Ledger Database (Amazon QLDB)

台帳管理専用データベース

### Amazon RDS (Oracle, PostgreSQL, MySQL, SQLServer, DB2(Nov 27, 2023))

リレーショナルデータベース

ストレージを減らすには ⇒ 新しい DB インスタンスを小さいサイズで作成し、そちらにデータを移行
イベント中のメンテナンスを回避するには ⇒[DB インスタンスの適切なメンテナンスウィンドウの調整](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.Maintenance.html#AdjustingTheMaintenanceWindow)

- [RDS のストレージタイプ](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/CHAP_Storage.html)
- 汎用 SSD
  - gp3 を IOPS に変更可能
    - [汎用 SSD (gp3) ストレージの設定変更](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_PIOPS.StorageTypes.html#USER_PIOPS.gp3)
- プロビジョンド IOPS
  - マルチ AZ の場合推奨
  - [プロビジョンド IOPS SSD ストレージの設定を変更する](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_PIOPS.StorageTypes.html#User_PIOPS.Increase)
    - 増減させることができる
    - 最適化に最大 6 時間かかる
- マグネティックストレージ

- [Amazon RDS API とインターフェイス VPC エンドポイント (AWS PrivateLink)](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/vpc-interface-endpoints.html)

- 異なる地理的リージョン間で高可用性を確保するには、リードレプリカを実装する必要

  - [クロスリージョンリードレプリカ](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/Concepts.RDS_Fea_Regions_DB-eng.Feature.CrossRegionReadReplicas.html)

- [RDS for PostgreSQL のリードレプリカ](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_PostgreSQL.Replication.ReadReplicas.html)

  - PostgreSQL のネイティブ レプリケーションを使用している

- [Amazon RDS での MySQL のレプリケーションの使用](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_MySQL.Replication.html)

  - [PITR で復元後、エラーになる場合](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/CHAP_Troubleshooting.html#CHAP_Troubleshooting.MySQL.PITR)
    - 一時テーブルを含む DB インスタンスの復元
      - binlog 内の一時テーブル情報は信頼できない場合があり、PITR の障害の原因となる可能性
    - メモリ内テーブルを含む DB インスタンスの復元
      - 再起動後にリードレプリカを再作成する
  - [RDS for MySQL でのカスケードリードレプリカの使用](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_MySQL.Replication.ReadReplicas.html#USER_MySQL.Replication.ReadReplicas.Cascading)

- [Amazon RDS for MySQL でレプリカラグが大きい場合のトラブルシューティング方法を教えてください。](https://repost.aws/ja/knowledge-center/rds-mysql-high-replica-lag)

  - ReplicaLag メトリック

- [validate_password プラグインを使用して、Amazon RDS for MySQL DB インスタンスのセキュリティを向上させるにはどうすればよいですか?](https://repost.aws/ja/knowledge-center/rds-mysql-validate-password-plugin)

### RDS Proxy

[Amazon RDS Proxy の使用](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/rds-proxy.html)

- [IdleClientTimeout](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/rds-proxy-managing.html#rds-proxy-connection-pooling-tuning)
  - プロキシがクライアント接続を閉じるまでの間、接続がアイドル状態を継続できる時間を指定できます。デフォルトは 1,800 秒 (30 分)

### Amazon Redshift

データウェアハウスサービス

[ワークロード管理 (WLM)](https://docs.aws.amazon.com/ja_jp/redshift/latest/dg/cm-c-wlm-queue-assignment-rules.html)

- キューの優先度
- [同時実行スケーリング](https://docs.aws.amazon.com/ja_jp/redshift/latest/dg/concurrency-scaling.html)

[クエリのトラブルシューティング](https://docs.aws.amazon.com/ja_jp/redshift/latest/dg/queries-troubleshooting.html)

- クエリに時間がかかりすぎる

  - VACUUM
    - データを再編成し、並び替え順序を維持し、パフォーマンスを回復する
  - ANALYZE

- Redshift 監査ログ

  - 接続ログ、ユーザー ログ、ユーザー アクティビティ ログ

- [メンテナンスを遅らせるには](https://docs.aws.amazon.com/ja_jp/redshift/latest/mgmt/working-with-clusters.html#rs-mgmt-defer-maintenance)
- CLI の場合 `aws redshift modify-cluster-maintenance  --defer-maintenance`
- 遅延の無効化は `--no-defer-maintenance` オプション

### Amazon Timestream

サーバーレス時系列データベース

[初めての Amazon Timestream 入門](https://aws.amazon.com/jp/blogs/news/getting-started-with-timestream/)

[Amazon Timestream](https://aws.amazon.com/jp/timestream/)

データライフサイクル
メモリストア ⇒（保持期限 1 時間～ 12 か月）⇒ マグネティックストア ⇒（保持期限 1 日～ 200 年）⇒ 削除

- メモリストア
  - 新しいデータを保存するためのストレージ
  - ある時点のデータを高速に抽出するようなクエリに最適化されている
- 将来的にはこの 2 つの中間に位置する SSD ストアの追加が予定
- マグネティックストア
  - データを長期間保存するためのストレージ
  - 分析クエリをサポートするように最適化されている

DynamoDB に比べると集計処理や検索、時系列が得意
ただし、レコードの削除が主動では行えず、データライフサイクルのみ
エクスポートできない
バックアップリストアできない
過去データ投入不可
トランザクションがない
データ型が少ない
東京リージョン不可 ⇒https://aws.amazon.com/jp/about-aws/whats-new/2022/08/amazon-timestream-available-asia-pacific-sydney-tokyo-regions/

### AWS Database Migration Service (AWS DMS)

AWS データベース移行サービス

- modify-replication-instance
- DMS Schema Conversion
- AWS Schema Conversion Tool (AWS SCT)
  - [データベース移行評価レポートの作成](https://docs.aws.amazon.com/ja_jp/SchemaConversionTool/latest/userguide/CHAP_AssessmentReport.Multiserver.html)
    - データベース移行に関する概要をまとめた評価レポートを作成
    - 移行するデータベースエンジンを評価できる
  - ソース DB に接続する DB ドライバーは別途インストール
- データレプリケーションのレイテンシーを最小限にするには
  - ワークロードを効率的に分散。アクセスパターンに基づいてテーブルを個別の DMS タスクに分散に並列処理
  - レプリケーションインスタンスを複数

[AWS DMS 移行のパフォーマンスの向上](https://docs.aws.amazon.com/ja_jp/dms/latest/userguide/CHAP_BestPractices.html#CHAP_BestPractices.Performance)

### CloudFormation

データベースが変更されないようにするには
UpdateReplacePolicy:Retain ⇒ 削除されずに保持、新しいインスタンス作成
UpdateReplacePolicy:Snapshot ⇒ スナップショットを取得して削除、置き換え
データベースが削除されないようにするには、`DeletionPolicy: Retain`
データベースを削除前にバックアップするには、`DeletionPolicy: Snapshot`、これがデフォルト

スタックポリシー

- Update:Modify 　 ⇒ リソースで中断が発生しない更新アクションまたはなんらかの中断が発生する更新アクション
- Update:Replace ⇒ リソースが再作成される更新アクション
- Update:Delete 　 ⇒ リソースが削除される更新アクション

- DB シークレットを SecretManager

  - {{resolve:secretsmanager:secret-id:SecretString :json-key:version-stage:version-id}}

  ```yaml
  MyRDSInstance:
  Type: "AWS::RDS::DBInstance"
  Properties:
    DBName: MyRDSInstance
    AllocatedStorage: "20"
    DBInstanceClass: db.t2.micro
    Engine: mysql
    MasterUsername: "{{resolve:secretsmanager:MyRDSSecret:SecretString:username}}"
    MasterUserPassword: "{{resolve:secretsmanager:MyRDSSecret:SecretString:password}}"
  ```

  ```yaml
  Resources:
    CloudFormationCreatedSecret:
      Type: "AWS::SecretsManager::Secret"
      Properties:
        Description: Simple secret created by AWS CloudFormation.
        GenerateSecretString:
          SecretStringTemplate: '{"username": "alice"}'
          GenerateStringKey: password
          PasswordLength: 32
  ```

- パラメータストア

  ```yaml
  Resources:
    RDSDBCluster:
      Type: "AWS::RDS::DBCluster"
      Properties:
        MasterUserPassword: "{{resolve:ssm-secure:rds-master-user-password:1}}"
  ```

## AWS Snowmobile

大量データを転送できるサービス。車両当たり最大 100P まで。

## EC2 の EBS の IOPS

- gp2
  - 16,000
- gp3
  - 16,000
- io1
  - 64,000
- io2
  - 256,000
- st1
  - 500
- sc1
  - 250
