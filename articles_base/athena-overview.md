# Amazon Athena<!-- omit in toc -->

![icon](/images/icons/64/Arch_Amazon-Athena_64.png)![icon](/images/icons/64/Arch_Amazon-Athena_64.png)![icon](/images/icons/64/Arch_Amazon-Athena_64.png)![icon](/images/icons/64/Arch_Amazon-Athena_64.png)![icon](/images/icons/64/Arch_Amazon-Athena_64.png)

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

<!-- Duration: 00:01:00 -->

- [1. Amazon Athena とは](#1-amazon-athena-とは)
  - [1.1. 公式ドキュメント](#11-公式ドキュメント)
  - [1.2. 学習リソース](#12-学習リソース)
  - [1.3. ワークショップ](#13-ワークショップ)
  - [1.4. 導入のメリット](#14-導入のメリット)
  - [1.4. 主なユースケース](#14-主なユースケース)
- [2. 基本機能](#2-基本機能)
  - [2.1. クエリエディタの画面構成](#21-クエリエディタの画面構成)
  - [2.2. データソース](#22-データソース)
  - [2.4. パーティション管理](#24-パーティション管理)
  - [2.5. テンプレートとビュー](#25-テンプレートとビュー)
- [3. 発展的な機能](#3-発展的な機能)
  - [3.1. フェデレーテッドクエリ](#31-フェデレーテッドクエリ)
  - [3.2. CTAS](#32-ctas)
  - [3.3. 機械学習との統合](#33-機械学習との統合)
  - [3.4. UDF（ユーザー定義関数）](#34-udfユーザー定義関数)
  - [3.5. ワークグループ](#35-ワークグループ)
  - [3.6. 地理空間データの分析](#36-地理空間データの分析)
- [4. 運用のポイント](#4-運用のポイント)
  - [4.1. パフォーマンス](#41-パフォーマンス)
  - [4.2. モニタリング](#42-モニタリング)
  - [4.3. セキュリティ](#43-セキュリティ)
- [📖 まとめ](#-まとめ)

## 1. Amazon Athena とは

標準的な SQL を使用して Amazon Simple Storage Service (Amazon S3) 内のデータを直接分析することを容易にするインタラクティブなクエリサービスです。

### 1.1. 公式ドキュメント

Amazon Athenaを理解する公式ドキュメントは次のとおりです。

[Amazon Athena サービス概要](https://aws.amazon.com/jp/athena/)

[Amazon Athena ドキュメント](https://docs.aws.amazon.com/ja_jp/athena/?id=docs_gateway)

[Amazon Athena よくある質問](https://aws.amazon.com/jp/athena/faqs/)

[Amazon Athena の料金](https://aws.amazon.com/jp/athena/pricing/)

### 1.2. 学習リソース

【AWS Black Belt Online Seminar】[Amazon Athena(YouTube)](https://www.youtube.com/watch?v=6FLkOE60Pfs)(1:00:43)

![athena-01](/images/blackbelt/blackbelt-athena-01-320.jpg)

[第二十回 ちょっぴりDD -Amazon Athena であっちこっちのデータを一括分析しよう](https://www.youtube.com/watch?v=_mGvfwRoWYQ)

![athena-01](/images/blackbelt/blackbelt-athena-03-320.jpg)

[第三十二回 ちょっぴりDD - Amazon Athena (Iceberg) x dbt ではじめるデータ分析！](https://www.youtube.com/watch?v=XyrccCDbKu0)

![athena-02](/images/blackbelt/blackbelt-athena-02-320.jpg)

### 1.3. ワークショップ

[Amazon Athena Workshop](https://catalog.us-east-1.prod.workshops.aws/workshops/9981f1a1-abdc-49b5-8387-cb01d238bb78/en-US)

[Amazon Athena Federated Query 経由で Amazon DynamoDB のデータを Amazon QuickSight で可視化するハンズオン](https://aws.amazon.com/jp/blogs/news/athena-federated-query-dynamodb-quicksight/)

[Amazon Athena ACID transaction workshop](https://github.com/harunobukameda/Amazon-Athena-ACID-transcation/blob/main/Amazon%20Athena%20ACID%20transaction%20workshop.pdf)

[CloudFront ハンズオン>Athena でのログ集計](https://catalog.us-east-1.prod.workshops.aws/workshops/fe68adc5-7b3a-4f08-93c9-45993d85cfe1/ja-JP/10-athena)

[AWS WAF を使って Web アプリケーションの防御を強化する>AWS WAF ログを調査する](https://catalog.us-east-1.prod.workshops.aws/workshops/81e94a4b-b47f-4acc-a284-914c4514d50f/ja-JP/4-monitor/1-investigate-logs)

### 1.4. 導入のメリット

Amazon Athenaを導入する主なメリットは以下の３つです。

- 標準SQLによる分析
  - 既存のSQL知識を利用可能
- コスト最適化
  - インフラ構築不要のサーバーレスサービス
  - スキャンしたデータに応じた従量課金
  - S3にあるデータを事前にロードする必要なく手軽に分析可能
- 大規模データに対しても高速なクエリを実施可能

### 1.4. 主なユースケース

- ログ分析
  - CloudFrontのアクセスログ分析
  - WAFのセキュリティ分析
  - VPCフローログの通信分析
- データレイク分析

## 2. 基本機能

### 2.1. クエリエディタの画面構成

![athena-query-editor](/images/athena/athena-query-editor-resize.jpg)

### 2.2. データソース

基本となるデータソースは次の２つです。

- S3
  - Athenaと異なるリージョンでも利用可能
  - ただし、リージョン間の転送となるため、クエリパフォーマンスやコストに影響がある
    - 異なるリージョンにするのは、リージョン間で移動できない理由がある場合のみを推奨
- AWS Glue Data Calalog
  - Glueで作成されたデータカタログを使用可能

そのほかのデータソースコネクタを使用することで、次のようなものも接続できます。

- フェデレーテッドクエリを使用した外部データソース
- 外部の Hive メタストア

### 2.4. パーティション管理

Athenaはクエリでスキャンしたデータ量による従量課金であるため、データをパーティション化し、スキャンするデータ量を制限できるようにすることは、コスト最適化の点で重要です。

```sql
  CREATE EXTERNAL TABLE my_ingested_data2 (
   ...
  )
  ...
  PARTITIONED BY (
   day STRING,
   hour INT
  )
  LOCATION "s3://amzn-s3-demo-bucket/prefix/"
  TBLPROPERTIES (
   "projection.enabled" = "true",
   "projection.day.type" = "date",
   "projection.day.format" = "yyyy/MM/dd",
   "projection.day.range" = "2021/01/01,NOW",
   "projection.day.interval" = "1",
   "projection.day.interval.unit" = "DAYS",
   "projection.hour.type" = "integer",
   "projection.hour.range" = "0,23",
   "projection.hour.digits" = "2",
   "storage.location.template" = "s3://amzn-s3-demo-bucket/prefix/${day}/${hour}/"
  )
```

### 2.5. テンプレートとビュー

過去に実行したクエリをテンプレートとして再利用可能な形で保存することができます。クエリエディタで実行したクエリ似たしいて、「名前をつけて保存」ができます。

詳細は、「[保存されたクエリを使用する](https://docs.aws.amazon.com/ja_jp/athena/latest/ug/saved-queries.html)」を参照してください。

テンプレートは保存したクエリをそのまま実行する用途なのに対して、ビューはさらにデータの絞り込みや必要な項目のみにしたい場合に有効です。

作成するには、`CREATE VIEW`を使用します。

```sql
CREATE VIEW name_salary AS
SELECT
 employees.name, 
 salaries.salary 
FROM employees, salaries 
WHERE employees.id = salaries.id
```

詳細は、「[ビューを使用する](https://docs.aws.amazon.com/ja_jp/athena/latest/ug/views.html)」を参照してください。

## 3. 発展的な機能

### 3.1. フェデレーテッドクエリ

S3以外にあるデータソースに対してもクエリが実行でき、横断的に分析ができるようになります。

主なデータソースは次のとおりです。詳細はドキュメント「[使用可能なデータソースコネクタ](https://docs.aws.amazon.com/ja_jp/athena/latest/ug/connectors-available.html)」を参照してください

- Amazon CloudWatch Logs
- Amazon DynamoDB
- Amazon DucumentDB
- Amazon RDS

動画：「[Amazon Athena Federated Query](https://www.youtube.com/watch?v=tZia_5qxPkY)」

動画: [Amazon QuickSight で Amazon Athena フェデレーティッドクエリの結果を分析する](https://youtu.be/HyM5d0TmwAQ)

### 3.2. CTAS

CTASは、「シータス」と読みます。（AWS Black Belt Online Seminarより）

CREATE TABLE AS SELECT (CTAS) クエリは、SELECTステートメントの結果から、Athenaで新しいテーブルを作成します。作成されたテーブルのデータはS3に保存されます。

CTASを使うユースケースとしては次のようなものがあります

- 必要なデータのみが含まれるテーブルを作成
- クエリ結果を変換し、他のテーブル形式（Parquet、ORCなど）に移行してパフォーマンス向上

CTASの例

```sql
CREATE TABLE new_table
WITH (
      format = 'Parquet',
      write_compression = 'SNAPPY')
AS SELECT * 
FROM old_table 
WHERE condition;
```

### 3.3. 機械学習との統合

Amazon SageMaker AI を使用して Machine Learning (ML) 推論を実行する SQL ステートメントの記述に Athena を使用できます。

```sql
USING EXTERNAL FUNCTION ml_function_name (variable1 data_type[, variable2 data_type][,...])
RETURNS data_type 
SAGEMAKER 'sagemaker_endpoint'
SELECT ml_function_name()
```

### 3.4. UDF（ユーザー定義関数）

レコードまたはレコードのグループを処理するためのカスタム関数を作成できます。

```sql
USING EXTERNAL FUNCTION UDF_name(variable1 data_type[, variable2 data_type][,...])
RETURNS data_type
LAMBDA 'lambda_function_name_or_ARN'
[, EXTERNAL FUNCTION UDF_name2(variable1 data_type[, variable2 data_type][,...]) 
RETURNS data_type 
LAMBDA 'lambda_function_name_or_ARN'[,...]]
SELECT  [...] UDF_name(expression) [, UDF_name2(expression)] [...]
```

### 3.5. ワークグループ

ワークグループとは、ユーザーやチームでクエリの実行やクエリ実行履歴の保存環境を分離できる仮想的なグループです。

ワークグループを使用すると、以下の管理ができます。

- IAMによるアクセス許可
- ワークグループごとのメトリクス管理
  - データスキャン量やクエリ数をワークグループごとに把握可能
- ワークグループ単位でクエリ結果を保存するS3バケットの分離
- ワークグループごとにクエリ結果の暗号化を設定
- 同時に実行できるクエリの数やスキャン量の管理
  - 指定したサイズ以上のデータスキャンをさせないようにできる
  - 上限に達したことをSNS通知によって、想定外のコストが発生を検知可能
- ワークグループごとに分析エンジンタイプを指定
  - Athena SQLかApache Sparkを指定し、制限可能

### 3.6. 地理空間データの分析

Athenaでは、ESRIの Java Geometry Libraryをサポートしています。

詳細は、「[地理空間データをクエリする](https://docs.aws.amazon.com/ja_jp/athena/latest/ug/querying-geospatial-data.html)」、「[例: 地理空間クエリ](https://docs.aws.amazon.com/ja_jp/athena/latest/ug/geospatial-example-queries.html)」を参照してください。

## 4. 運用のポイント

### 4.1. パフォーマンス

- スキャンデータ量を減らす
  - 列指向フォーマットを利用
  - データを圧縮
  - パーティショニング
- ファイルサイズを一定以上にする
  - 小さいファイルた大量にある場合はファイル操作のオーバーヘッドが発生するので、128MB以上にまとめる
- テーブルの結合を最適化
  - 結合する場合は、大きいテーブルを左、小さいテーブルを右に記述する

Athenaでのパフォーマンスチューニングの詳細については、「[Athena のパフォーマンスを最適化する](https://docs.aws.amazon.com/ja_jp/athena/latest/ug/performance-tuning.html)」や「[追加リソース](https://docs.aws.amazon.com/ja_jp/athena/latest/ug/performance-tuning-additional-resources.html)」を参照してください。


### 4.2. モニタリング

- Amazon CloudWatch メトリクス
  - [CloudWatch による Athena クエリメトリクスのモニタリング](https://docs.aws.amazon.com/ja_jp/athena/latest/ug/query-metrics-viewing.html)
  - [CloudWatch による Athena 使用状況メトリクスのモニタリング](https://docs.aws.amazon.com/ja_jp/athena/latest/ug/monitoring-athena-usage-metrics.html)
- AWS CloudTrail

### 4.3. セキュリティ

- データ保護
  - AWS KMSによって暗号化
- アクセス管理
  - AWS IAMによってアクセス制御を行います。
  - 詳細は「[Athena でのアイデンティティとアクセス権の管理](https://docs.aws.amazon.com/ja_jp/athena/latest/ug/security-iam-athena.html)」を参照してください
- データアクセス管理
  - Lake Formationでデータへの詳細なアクセス管理が実施可能

## 📖 まとめ