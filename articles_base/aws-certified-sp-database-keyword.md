# AWS Certified Security – Database 認定 (DBS-C01)

## ☘️ はじめに

本ページは、AWS 認定資格取得に向けて個人的に勉強した各サービスのキーワードを記載しております。AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

- [試験概要](https://aws.amazon.com/jp/certification/certified-database-specialty/?ch=tile&tile=getstarted)
- [試験ガイド](https://d1.awsstatic.com/ja_JP/training-and-certification/docs-database-specialty/AWS-Certified-Database-Specialty_Exam-Guide.pdf)
- [公式サンプル問題](https://d1.awsstatic.com/ja_JP/training-and-certification/docs-database-specialty/AWS-Certified-Database-Specialty_Sample-Questions.pdf)
- [Exam Readiness: AWS Certified Security - Database (Japanese)  | AWS Skill Builder](https://explore.skillbuilder.aws/learn/course/external/view/elearning/8832/exam-readiness-aws-certified-database-specialty-japanese)
- [AWS Certified Database - Specialty Official Practice Question Set (DBS-C01 - Japanese) | AWS Skill Builder](https://explore.skillbuilder.aws/learn/course/external/view/elearning/12511/aws-certified-database-specialty-official-practice-question-set-dbs-c01-japanese)

- [](https://www.youtube.com/watch?v=Y2KnmHhyvc0&t=1653s)
- [Build a Modern Application with Purpose-Built AWS Databases](https://aws.amazon.com/jp/blogs/database/building-a-modern-application-with-purpose-built-aws-databases/)

## 参考

- https://qiita.com/tags/dbs

## 試験範囲

- 第 1 分野: ワークロード固有のデータベース設計 (採点対象コンテンツの 26%)

  - RDS for Multi-AZを設定し同期レプリケーションとスタンバイデータベースへの自動フェイルオーバー
    - フェイルオーバー時のパフォーマンスを安定させるためには、プロビジョニングされた IOPS 用に最適化されたデータベースインスタンスクラス
  - ElastiCache for Memcachedでクラスターノードを構成し、異なるAZにSPOF軽減
  - ElastiCache 、DynamoDBアクセラレーター（DAX⇒VPC内）で一時的な高レイテンシーや可用性への影響を軽減
  - CW イベントでバックアップが完了するたびにLambdaをトリガー、バックアップを別リージョンにコピー
  - Aurora のフェイルオーバー、リストア、バックトラックなどの回復機能をテスト
  - Aurora のフェイルオーバーは30秒未満
  - Amazon Aurora グローバルデータベースクラスターは、AWS リージョン間で一秒未満のレプリケーションを提供するシングルマスタークラスタ
  - Amazon DynamoDB グローバルテーブルはグローバルに分散したユーザーを持つ大規模なスケールのアプリケーション向け
  - Neptune は3つのAZに6つのコピーを複製。耐障害性の自己修復ストレージを供えている

  - データ駆動型のアプローチ
  - パーティショニングやシャーディングはデータの増加に対応
    - ⇒複雑さが増す
  - キャッシュは遅延を減らす
    - ⇒古いデータに関する戦略が必要
    - ElastiCache では書き込みスルーとTTL
  - レプリケーション
    - 読み取りスループットを向上させる
    - ⇒一貫性については、「最終的」
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

- 第 2 分野: デプロイと移行 (採点対象コンテンツの 20%)

  - https://youtu.be/-pb-DkD6cWg
  - AWS CloudFormation で自動化
    - [AWS CloudFormation ユーザーガイド： ベストプラクティス](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/best-practices.html)
  - 移行
    - 移行の準備
    
    - 移行プロセス
      - [AWS スキーマ変換ツール（AWS SCT）](https://aws.amazon.com/dms/schema-conversion-tool/) を使用して、移行元スキーマオブジェクトを移行先オブジェクトに変換
      - 変換できなかったものを手動で
      - AWS データベース移行サービス (AWS DMS) を使用して移行
        - 異機種間移行
          - データベースエンジンを変更する
          - e.g) Oracle -> Aurora PostgreSQL
          - データ型の変更されるケース
          - 空文字の扱い。NULLとするのかしないのか。Oracle＝NULL、PostgreSQL≠NULL
          - [Oracle、または Microsoft SQL サーバーから PostgreSQL に移行する際のコード変換の課題](https://aws.amazon.com/jp/blogs/database/code-conversion-challenges-while-migrating-from-oracle-or-microsoft-sql-server-to-postgresql/)
          - [アプリケーションをクラウドに移行するための 6 つの戦略](https://aws.amazon.com/jp/blogs/enterprise-strategy/6-strategies-for-migrating-applications-to-the-cloud/)
          - [OracleからPostgreSQLへの移行中に直面する一般的な課題の解決方法](https://aws.amazon.com/jp/blogs/database/how-to-solve-some-common-challenges-faced-while-migrating-from-oracle-to-postgresql/)
        - 同種移行
          - データベースエンジンを変更しない
      - https://youtu.be/asx_VOUTxaU
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

- 第 3 分野: マネジメントとオペレーション (採点対象コンテンツの 18%)

  - RDS
    - セキュリティやインスタンスの安定性に関するパッチが必要ですが、他のパッチは無期限に延期可能
    - DBパラメータ
      - 静的パラメータ　⇒再起動必要、メンテナンスウィンドウか手動
      - 動的パラメータ　⇒即時反映
    - インスタンスの状態
      - 「FAILED」または「INCOMPATIBLE-NETWORK」の場合は、データベースが動作していない
        - エラーを解決しないといけない
      - describe-db-instances
    - 自動バックアップ
      - リードレプリカからバックアップを。
      - 保持期間は、～35日、デフォルト7日
      - RDSやElastiCacheは0日＝自動バックアップ無効にできる
      - AuroraやNeptuneは1日＝自動バックアップ無効不可
    - 手動バックアップ
      - 自動的に削除されない
    - RPO(目標復旧地点)
      - ポイントインタイムリカバリ (PITR)
    - RTO(目標復旧時間)
      - レプリカ
      - 2 分未満
    - スナップショットから復元したときの何も指定しない場合のセキュリティグループは？
      - デフォルトのセキュリティグループになる
      - [DB スナップショットからの復元](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_RestoreFromSnapshot.html)
      - CLIだと、`--vpc-security-group-ids`
  - Aurora
    - RPO(目標復旧地点)
      - ポイントインタイムリカバリ (PITR)
      - 1秒
    - RTO(目標復旧時間)
      - 約 1 分
      - グローバル Aurora クラスター内のリージョン間での非同期データレプリケーション

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


- 第 4 分野: モニタリングとトラブルシューティング (採点対象コンテンツの 18%)

  - RDS のフェイルオーバー
    - プライマリインスタンスのサブネットにスタンバイインスタンスのサブネットとは異なるルーティングを定義している場合
    - DB接続問題が発生する可能性
    - サブネットグループ
  - AWS Database Migration Service (AWS DMS) を使用したデータベースの移行中に一般的に遭遇する状況
    - [AWS Database Migration Service での移行タスクのトラブルシューティング](https://docs.aws.amazon.com/ja_jp/dms/latest/userguide/CHAP_Troubleshooting.html)
    - エラー: 識別子が長すぎます
      - オブジェクト名が長い
      - ターゲットDBにテーブルなどを予め作成
      - or [ターゲットテーブル準備モード] を [何もしない] または [切り捨てる] に設定したタスク
    - エラー: サポートされていない文字セットのため、フィールドデータ変換に失敗しました
      - サポートされていない文字セットが原因でフィールドデータの変換に失敗
      - UTF8MB4 エンコーディングを使用している とか。
    - エラー: コードページ 1252 から UTF8 [120112] フィールドデータの変換に失敗しました。
      - MySQL データベースに コードページ 1252 文字以外の文字がある場合
      - CharsetMapping 追加接続属性を使用して、文字セットのマッピングを指定
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
- 第 5 分野: データベースセキュリティ (採点対象コンテンツの 18%)
  - データベースの暗号化
    - 保管中
      - KMS
      - 認証情報は Secrets Managet
      - RDS/Aurora
        - 
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