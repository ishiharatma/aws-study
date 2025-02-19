---
title: "【初心者向け】AWS Glue 入門！完全ガイド" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: false
---

# AWS Glue<!-- omit in toc -->

![icon](/images/icons/64/Arch_AWS-Glue_64.png)![icon](/images/icons/64/Arch_AWS-Glue_64.png)![icon](/images/icons/64/Arch_AWS-Glue_64.png)![icon](/images/icons/64/Arch_AWS-Glue_64.png)![icon](/images/icons/64/Arch_AWS-Glue_64.png)

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

- [1. AWS Glue とは](#1-aws-glue-とは)
  - [1.1. 公式ドキュメント](#11-公式ドキュメント)
  - [1.2. 学習リソース](#12-学習リソース)
  - [1.3. ワークショップ](#13-ワークショップ)
  - [1.4. Glue導入のメリット](#14-glue導入のメリット)
  - [1.4. 主なユースケース](#14-主なユースケース)
- [2. 基本機能](#2-基本機能)
  - [2.1. データカタログ](#21-データカタログ)
  - [2.2. クローラー](#22-クローラー)
  - [2.3. ETLジョブ](#23-etlジョブ)
    - [2.3.1. DPU とワーカー](#231-dpu-とワーカー)
  - [2.4. Glue Studio](#24-glue-studio)
  - [2.5. ワークフロー](#25-ワークフロー)
- [3. 発展的な機能](#3-発展的な機能)
  - [3.1. ブックマーク機能](#31-ブックマーク機能)
  - [3.2. Glue Streaming](#32-glue-streaming)
  - [3.3. Glue DataBrew](#33-glue-databrew)
  - [3.4. ゼロETL統合](#34-ゼロetl統合)
  - [3.5. Glue Data Quality](#35-glue-data-quality)
- [4. 運用のポイント](#4-運用のポイント)
  - [4.1. AWS Lake Formationとの連携](#41-aws-lake-formationとの連携)
  - [4.2. コスト管理](#42-コスト管理)
  - [4.3. モニタリング](#43-モニタリング)
  - [4.4. セキュリティ](#44-セキュリティ)
- [📖 まとめ](#-まとめ)

## 1. AWS Glue とは

抽出、変換、ロード (ETL) プロセスの検出、準備、統合、近代化（モダナイゼーション）を容易にするサーバーレスデータ統合サービスです。

近代化（モダナイゼーション）とは、単にツールを新しくするだけでなく、データ統合のプロセス全体をよりスケーラブルで、管理しやすく、コスト効率の良いものに変革することを意味し、AWS Glueは、これらの「近代化」を実現するためのマネージドサービスです。

![glue-concept](/images/glue/HowItWorks-overview.png)

（引用元：[AWS Glue の概念](https://docs.aws.amazon.com/ja_jp/glue/latest/dg/components-key-concepts.html)）

### 1.1. 公式ドキュメント

AWS Glueを理解する公式ドキュメントは次のとおりです。

[AWS Glue の開始方法](https://aws.amazon.com/jp/glue/getting-started/)

![getting-started](/images/glue//glue-getting-started.jpg)

[AWS Glue サービス概要](https://aws.amazon.com/jp/glue/)

[AWS Glue ドキュメント](https://docs.aws.amazon.com/ja_jp/glue/?id=docs_gateway)

[AWS Glue よくある質問](https://aws.amazon.com/jp/glue/faqs/)

[AWS Glue の料金](https://aws.amazon.com/jp/glue/pricing/)

### 1.2. 学習リソース

【AWS Black Belt Online Seminar】[AWS Glue(YouTube)](https://www.youtube.com/watch?v=px96mjFoZwM)(0:55:30)

![glue-1](/images/blackbelt/blackbelt-glue-1-320.jpg)

[AWS Glue【AWS Black Belt】](https://www.youtube.com/watch?v=5fbdx849AYw)(0:41:53)

![glue-2](/images/blackbelt/blackbelt-glue-2-320.jpg)

[[AWS Black Belt Online Seminar]猫でもわかる、AWS Glue ETLパフォーマンス・チューニング 基礎知識編](https://www.youtube.com/watch?v=k-qTKz0xG-0)(0:34:22)

![glue-3](/images/blackbelt/blackbelt-glue-3-320.jpg)

[[AWS Black Belt Online Seminar]猫でもわかる、AWS Glue ETLパフォーマンス・チューニング 後編](https://www.youtube.com/watch?v=0a1MA3rI3pY)(0:34:47)

![glue-4](/images/blackbelt/blackbelt-glue-4-320.jpg)

[【AWS Black Belt Online Seminar】AWS Glue -Glue Studioを使ったデータ変換のベストプラクティス-](https://www.youtube.com/watch?v=xRszN4Tb4uM)(0:57:13)

![glue-5](/images/blackbelt/blackbelt-glue-5-320.jpg)

[【AWS Black Belt Online Seminar】AWS Glue DataBrew](https://www.youtube.com/watch?v=jglmTz1yISc)(0:56:49)

![glue-6](/images/blackbelt/blackbelt-glue-6-320.jpg)

### 1.3. ワークショップ

- [AWS Glue DataBrew Immersion Day](https://catalog.us-east-1.prod.workshops.aws/workshops/ee59d21b-4cb8-4b3d-a629-24537cf37bb5/ja-JP)
- [Data Engineering Immersion Day](https://catalog.us-east-1.prod.workshops.aws/workshops/976050cc-0606-4b23-b49f-ca7b8ac4b153/ja-JP/600)
- [HOL-01：AWS ではじめるデータ分析〜データレイクハンズオン〜](https://resources.awscloud.com/aws-summit-online-japan-2020-on-demand-self-paced-hands-on-85234)
- [Amazon Personalize with Glue DataBrew](https://catalog.us-east-1.prod.workshops.aws/workshops/ed82a5d4-6630-41f0-a6a1-9345898fa6ec/en-US)

### 1.4. Glue導入のメリット

AWS Glueを導入する主なメリットは以下の3つです。

1. サーバーレス
   - インフラ構築・管理が不要
   - 必要な時に分析環境を使用可能
   - スケーラブルな処理基盤
2. 運用負荷の軽減
- ETLに必要な機能が標準機能を利用可能
- データ分析環境や処理の更新が容易
- 自動化による保守性の向上
3. ビジネス価値への集中
- ETLが自動化によりデータ分析に専念
- データサイエンティストの生産性向上

### 1.4. 主なユースケース

- データレイク構築
- データウェアハウス連携
- バッチ処理の自動化

## 2. 基本機能

Glueの主要な機能は次のとおりです。

- データカタログ
- クローラー
- ETLジョブ
- Glue Studio
- ワークフロー

### 2.1. データカタログ

データの場所やスキーマといったメタデータ管理する機能です。

データカタログは、データベースとテーブルというオブジェクトから構成されます。データベースは、データカタログを論理的にグループ化したものと言えます。
例えば、次のようなグループ化の方法があります。

1. データ環境別のグループ化
   - raw_database: 生データ
   - staging_database: 加工途中のデータ
   - analytics_database: 分析用に整形済み
2. ビジネス部門別のグループ化
   - sales_database: 営業部門のデータ
   - marketing_database: マーケティング部門のデータ
   - finance_database: 経理部門のデータ

テーブルは、データの場所やスキーマの情報が格納されています。
実際に格納されている情報はマネジメントコンソールで確認できます。
CloudTrailが出力したログのテーブルは次のようになっています。

![data-catalog-sample-00](/images/glue/data-catalog-sample-00.jpg)
![data-catalog-sample-01](/images/glue/data-catalog-sample-01.jpg)
![data-catalog-sample-02](/images/glue/data-catalog-sample-02.jpg)

テーブルはバージョン管理されていて、過去のバージョンとの比較もできます。

![data-catalog-sample-03](/images/glue/data-catalog-sample-03.jpg)

コンソールでのバージョン比較はこのように確認できます。

![data-catalog-compare-01](/images/glue/data-catalog-compare-01.jpg)

データカタログを利用できるAWSサービスは次のようなものがあります。

- Amazon Athena
  - [AWS Glue Data Catalog をクエリする](https://docs.aws.amazon.com/ja_jp/athena/latest/ug/querying-glue-catalog.html)
- Amazon Redshift Spectrum
  - [Amazon Redshift Spectrum 用の外部スキーマ](https://docs.aws.amazon.com/ja_jp/redshift/latest/dg/c-spectrum-external-schemas.html)
- Amazon EMR
  - [Amazon EMR AWS で Spark で Glue データカタログカタログを使用する](https://docs.aws.amazon.com/ja_jp/emr/latest/ReleaseGuide/emr-spark-glue.html)
- Apach Hiveメタストア
  - [AWS Glue データカタログを Hive のメタストアとして使用する](https://docs.aws.amazon.com/ja_jp/emr/latest/ReleaseGuide/emr-hive-metastore-glue.html)

データカタログの利用イメージ（引用：Blackbelt）

![catalog](/images/glue/data-catalog.jpg)

### 2.2. クローラー

メタデータをデータカタログに登録・更新する機能です。
定期的に実行することで、スキーマの自動更新が可能になります。

スケジュールは、オンデマンドで実行するか、定期的に実行するかを選択できます。
Hourlyなど簡単な設定方法や、cron形式で詳細な実行スケジュールを作成することもできます。

![crawler-schedule](/images/glue/crawler-schedule.jpg)

クローラーを定期的に実行させることで、新しいデータやスキーマの変更を検知できます。

クローラーが取得可能なデータソースは、[ドキュメント](https://docs.aws.amazon.com/ja_jp/glue/latest/dg/crawler-data-stores.html)によると次のようなものがあります。

- ネイティブクライアント
  - Amazon S3
  - Amazon DynamoDB
  - Delta Lake
  - Apache Iceerg
  - Apache Hudi
- JDBC
  - Amazon Redshift
  - Snowflake
  - Amazon Aurora
  - MariaDB
  - Microsoft SQL Server
  - MySQL
  - PostgreSQL
  - Oracle
- MongoDB クライアント
  - MongoDB
  - Amazon DucumentDB

![crawler-datasource](/images/glue/crawler-datasource.jpg)

標準でサポートしていないデータソースは、AWS Marketpkaceから取得するか、独自でカスタムコネクタを作成することができます。

### 2.3. ETLジョブ

ジョブとは、データソースに接続してデータターゲットに出力する処理を実行するものです。

ジョブの種類は以下のとおりです。

- [Sparkジョブ](https://docs.aws.amazon.com/ja_jp/glue/latest/dg/etl-jobs-section.html)
  - Apache Sparkを利用した大規模なバッチデータ処理向け
- [Pythonシェルジョブ](https://docs.aws.amazon.com/ja_jp/glue/latest/dg/add-job-python.html)
  - Pythonスクリプトを実行でき、分散処理を必要としない軽量な処理向け
- [ストリーミングETLジョブ](https://docs.aws.amazon.com/ja_jp/glue/latest/dg/add-job-streaming.html)
  - Amazon Kinesis Data StreamsやAmazon MSKなどのストリーミングソースから連続的に実行されるジョブ
- [Rayジョブ](https://docs.aws.amazon.com/ja_jp/glue/latest/dg/ray-jobs-section.html)
  - Pythonワークロードを実現可能なOSSのRayを用いたマルチノード環境で高速に処理できる
  - Sparkよりも低い学習コストで、既存のPythonコードを並列化することも容易

※15分以内に処理が完了でき、小規模な処理であればAWS Lambdaの利用も検討する。

#### 2.3.1. DPU とワーカー

ジョブには、DPU とワーカーというものがあります。

- DPU: Data Processing Unit
  - ジョブに割り当てる処理能力の単位で、１DPUにつき4vCPUと16GBのメモリ
  - １時間あたりに決められた料金が1秒単位で課金される
    - 1DPU = 0.44USD/時で、6DPUを15分利用した場合、6DPU×0.44×0.25時間＝0.66USD
  - ワーカータイプによって、１分or10分の最低料金がある
- ワーカー
  - SparkジョブとRayジョブで指定できる事前定義済みのワーカー
  - ワーカータイプ
    - G.025X=0.25DPU、標準＝1DPU、G.1X＝1DPU、G.2X＝2DPU、G.4X＝4DPU、G.8X=8DPU
    - 多くのメモリが必要なら大きいワーカータイプを選択する。 
  - ワーカー数
    - これを増やすと分散実行数が増える
    - １つのワーカー内には、Executorという処理を実行する１つ存在する
      - 標準タイプのワーカーには、Executorが２つ存在する。その分、１つのExecutorが利用できるメモリが減る
    - 並列性が求められる場合は、ワーカー数を増やす

### 2.4. Glue Studio

Glue Studioを使えば、GUIベースでETLジョブを構築することや、ジョブの実行、監視設定を行うことが可能です。

![studio](/images/glue/BDB-3601_20_Recipe.png)

### 2.5. ワークフロー

ETLジョブ、クローラーを自動化し、データカタログ出力までの一連の処理をGUIで管理する機能です。

![glue-workflow](/images/glue/glue-workflow.jpg)

AWSには、ワークフロー系のサービスはほかにもあります。

- AWS Glue Workflow
  - Glueワークフローは、基本的にデータの準備（ETL）を簡単に行うことを目的としたサーバーレスデータ統合サービスです。
  - データの準備に必要なデータソースへの接続などを備えています。
  - Glueジョブとの統合や連携のみの場合はこちらを選択するケースが考えられる
- AWS Step Functions
  - 複数のAWSサービスを組み合わせてワークフローを構築できるサーバーレスオーケストレーションサービス
  - ETLの処理も作成可能で、汎用性が高いワークフローを定義可能
  - AWSサービスとの統合や連携を行うならばこちらを選択するケースが考えられる
- Amazon MWAA（Managed Workflows for Apache Airflow）
  - OSSのApache Airflow
  - オンプレからの移行で、すでにApache Airflowを使っている場合や、AWS以外との連携もある場合に選択するケースが考えられる

## 3. 発展的な機能

### 3.1. ブックマーク機能

ETLジョブを実行する場合、処理済みデータを記録し、差分抽出を可能にする機能です。
`job.init()`でブックマークの情報を取得し、`job.commit()`が呼び出されたときに状態を記録します。
そのため、ジョブスクリプトから`job.commit()`が呼び出されていないと、ブックマーク機能を正常に利用できないことになります。

参考：エラー : [ジョブのブックマークが有効なときにジョブがデータを再処理しています](https://docs.aws.amazon.com/ja_jp/glue/latest/dg/glue-troubleshooting-errors.html#error-job-bookmarks-reprocess-data)

### 3.2. Glue Streaming

Glueはもともとバッチ処理に特化したETLサービスという特徴があります。ただ、Glue Streamingを使うことで、準リアルタイム処理が可能になります。

具体的なユースケースは次のとおりです。詳細については、[ドキュメント](https://docs.aws.amazon.com/ja_jp/glue/latest/dg/streaming-chapter.html)をご参照ください

- 不正検出
- ソーシャルメディア分析
- IoT分析
- ログの監視と分析
- レコメンデーションシステム

例えば、Amazon Kinesis Data StreamsとAWS Glue Streamingを連携することで準リアルタイムのデータ処理が実現できます。
Kinesis Data Streamsがデータソースとできるサービスと組み合わせることで、さまざまなユースケースに対応することができます。

### 3.3. Glue DataBrew

データのクリーニング、正規化、変換のためのフルマネージド型のビジュアルデータ準備サービスです。
null の削除、欠損値の置き換え、スキーマの不整合の修正、関数に基づく列の作成などが実施できます。

DataBrewは、S3に保存された以下のデータフォーマットをサポートしています。

- カンマ区切り値 (CSV)
- Microsoft Excel
- JSON
- ORC
- Parquet

### 3.4. ゼロETL統合

ETLのジョブやワークフローは大きな運用負荷が伴います。このようなものを極力抑えるようにできるのが、ゼロETL統合です。
ETLの要件によっては、完全になくすことができる可能性があります。

GlueのゼロETLのデータソースとして、主に次のようなものがあります。
参考：[ゼロ ETL 統合](https://docs.aws.amazon.com/ja_jp/glue/latest/dg/zero-etl-using.html)

- AWS
  - Amazon DynamoDB
- サードパーティー
  - Salesforce
  - Zendesk
  - ServiceNow など

GlueのゼロETLのデータターゲットとして、主に次のようなものがあります。

- Amazon SageMaker Lakehouse
- Amazon Redshift

### 3.5. Glue Data Quality

データレイクのデータに対して、ユーザーが定義したルールに従って品質を自動的に測定し、統計などを表示してくれるマネージドサービスです。
これによって、データの変化を監視し、予想外の値が入ってくることを検知できます。

![dataquality](/images/glue/BDB-3601_3_Loaded_project.png)

[AWS Glue Data Quality サービス概要](https://aws.amazon.com/jp/glue/features/data-quality/)

データ品質定義言語 (DQDL) を用いてカスタムルールを定義することによって、データの品質をチェックすることができます。

具体的には次のような記述を行うことでデータをチェックできます。詳細は、[データ品質定義言語 (DQDL) リファレンス](https://docs.aws.amazon.com/ja_jp/glue/latest/dg/dqdl.html)を参照してください。

```sh
Rules = [
   IsComplete "order-id",
   IsUnique "order-id"
]
```

以下の動画では、AWS Glue Data Qualityがどのようにデータ品質を管理するかについての基本的な説明や主要な機能について説明されています。
[Measure and Monitor Data Quality of your Datasets in AWS Glue Data Catalog(YouTube) | Amazon Web Services](https://www.youtube.com/watch?v=rK1NGQu4Sgg)

![data-quality](/images/glue/data-quality.jpg)

## 4. 運用のポイント

### 4.1. [AWS Lake Formationとの連携](https://docs.aws.amazon.com/ja_jp/lake-formation/latest/dg/glue-features-lf.html)

![glue-lake-formation](/images/glue/glue-with-lake-formation.jpg)

Lake Formationを利用すると、Glueが作成したデータカタログに対して詳細なアクセスコントロールを行うことができます。

具体的には、以下のアクセス管理を行うことができます。

- データベース、テーブルへのアクセス管理
- 列、行、または行列の組み合わせでのアクセス管理

アクセス管理の方法は、次の2つの方法があります。

- 名前付きリソースアクセスコントロール（NRAC）
- タグベースアクセスコントロール（TBAC）
  - NRACよりも管理する権限が少なく、リソースが増えた場合の運用負荷が低いため、推奨される

詳細については、[Lake Formation 許可の管理](https://docs.aws.amazon.com/ja_jp/lake-formation/latest/dg/managing-permissions.html)を参照してください。

### 4.2. コスト管理

コスト最適化については、スキャンするデータ量を最小限にすることと、処理時間に見合うサービス選択を意識することが重要であると考えます。
具体的には、以下のようなポイントを考慮します。

- ジョブブックマーク機能を用いて増分クロールを行い、処理時間を削減
- 必要なワーカータイプを選択しているか？過剰なDPUを割り当てていないか？
- 最小課金時間を下回る処理の場合、別の方法への変更を検討

また、コスト最適化については以下のAWSブログ記事をご参照ください

[AWS Glue for Apache Spark のコストのモニタリングと最適化](https://aws.amazon.com/jp/blogs/news/monitor-optimize-cost-glue-spark/)

### 4.3. モニタリング

[AWS Glue のモニタリング](https://docs.aws.amazon.com/ja_jp/glue/latest/dg/monitor-glue.html)は、以下のツールを利用することで実現できます。

- Amazon EventBridge
  - ETLジョブの成功や失敗のイベントによって、次の処理を実行したり、SNSによる通知を実現
  - `"detail-type":"Glue Job State Change"`のイベントが`SUCCEEDED、FAILED、TIMEOUT、STOPPED`に対して発生
- Amazon CloudWatch Logs
  - ログファイルのモニタリングによる監視・通知
- Amazon CloudWatch メトリクス
  - メトリクスによってジョブのリソース使用率（80％超）などを監視・通知
- AWS CloudTrail
  - APIレベルでの実行を監視・通知
  - 例えば、`DeleteCrawler`アクションが発生した場合に通知

### 4.4. セキュリティ

- アクセス管理
  - IAMによってアクセス管理を実施
- 保管中のデータの暗号化
  - AWS KMSを使用して以下を暗号化
    - データカタログ
    - ログ

## 📖 まとめ

AWS Glueは、モダンなデータ統合基盤として、以下の特徴を提供します。

- サーバーレスでの運用による管理負荷の軽減
- 豊富な統合機能による開発効率の向上
- データ品質管理の自動化によるガバナンスの強化

これらの機能により、より価値の高いデータ分析に注力できる環境を実現できます。

詳しい内容については、AWS公式ドキュメントやAWS Black Belt Online Seminarをご参照ください。