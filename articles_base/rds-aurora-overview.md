# RDS と Aurora の比較

## はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## Contents

Duration: 00:01:00

- [RDS と Aurora の比較](#rds-と-aurora-の比較)
  - [はじめに](#はじめに)
  - [Contents](#contents)
  - [RDS について知るには](#rds-について知るには)
  - [Aurora について知るには](#aurora-について知るには)
  - [RDS / Aurora について知るには(その他)](#rds--aurora-について知るにはその他)
  - [RDS と Aurora の比較サマリ](#rds-と-aurora-の比較サマリ)
  - [比較ポイント１：データベースエンジン](#比較ポイント１データベースエンジン)
  - [比較ポイント２：ストレージアーキテクチャと耐久性](#比較ポイント２ストレージアーキテクチャと耐久性)
  - [比較ポイント３：ストレージの容量拡張](#比較ポイント３ストレージの容量拡張)
  - [比較ポイント４：可用性](#比較ポイント４可用性)
  - [比較ポイント５：読み取りスループット向上](#比較ポイント５読み取りスループット向上)
  - [比較ポイント６：自動バックアップの保持期間](#比較ポイント６自動バックアップの保持期間)
  - [比較ポイント７：データの復元](#比較ポイント７データの復元)
  - [比較ポイント８：キャッシュ](#比較ポイント８キャッシュ)
  - [比較ポイント９：価格](#比較ポイント９価格)


## RDS について知るには

Duration: 00:52:48

【AWS Black Belt Online Seminar】[Amazon Relational Database Service (Amazon RDS)(YouTube)](https://youtu.be/nDme-ET-_EY)(52:48)

![blackbelt-rds](/images/rds-aurora/blackbelt-rds-320.jpg)

[Amazon RDS サービス概要](https://aws.amazon.com/jp/rds/)

[Amazon RDS ドキュメント](https://docs.aws.amazon.com/ja_jp/rds/?icmpid=docs_homepage_databases)

[Amazon RDS よくある質問](https://aws.amazon.com/jp/rds/faqs/)

## Aurora について知るには

Duration: 03:22:41

【AWS Black Belt Online Seminar】[Amazon Aurora MySQL(YouTube)](https://youtu.be/VerVNchaqVY)(55:41)

![blackbelt-aurora-mysql](/images/rds-aurora/blackbelt-aurora-mysql-320.jpg)

【AWS Black Belt Online Seminar】[Amazon Aurora MySQL Compatible Edition ユースケース毎のスケーリング手法](https://www.youtube.com/watch?v=9KQkskyP930)(55:41)

![blackbelt-aurora-mysql-usecase](/images/rds-aurora/blackbelt-aurora-mysql-usecase-320.jpg)

【AWS Black Belt Online Seminar】[Amazon Aurora with PostgreSQL Compatibility(YouTube)](https://youtu.be/oJqIzHIMh7Q)(1:03:46)

![blackbelt-aurora-postgresql](/images/rds-aurora/blackbelt-aurora-postgresql-320.jpg)

[RDS/Aurora Update | 2.5時間で学ぶ！ Amazon Aurora のいま(YouTube)](https://youtu.be/8uPU2T5Xj9E)(27:33)

![rds-aurora-updates](/images/rds-aurora/rds-aurora-updates-320.jpg)

[Amazon Aurora サービス概要](https://aws.amazon.com/jp/rds/aurora/)

[Amazon Aurora ドキュメント](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html)

[Amazon Aurora よくある質問](https://aws.amazon.com/jp/rds/aurora/faqs/)

## RDS / Aurora について知るには(その他)

Duration: 03:05:36

【AWS Summit Tokyo 2019】[AWS におけるデータベースの選択指針](https://www.youtube.com/watch?v=h1r8AzOdlqo)(39:25)

![aws-summit-2019-c2-03](/images/rds-aurora/aws-summit-2019-c2-03-320.jpg)

【AWS Summit Tokyo 2019】[Amazon RDS におけるパフォーマンス最適化とパフォーマンス管理](https://www.youtube.com/watch?v=3oMR2hglQR0)(41:33)

![aws-summit-2019-b3-04](/images/rds-aurora/aws-summit-2019-b3-04-320.jpg)

【AWS Summit Tokyo 2019】[Amazon Aurora with PostgreSQL Compatibility における運用設計のファーストステップ](https://www.youtube.com/watch?v=5McG3hJae9A)(39:53)

![aws-summit-2019-b3-05](/images/rds-aurora/aws-summit-2019-b3-05-320.jpg)

【AWS Summit Tokyo 2019】[Amazon Aurora storage demystified: How it all works (DAT309-R)](https://www.youtube.com/watch?v=DrtwAOND1Pc)(1:04:45)

![aws-summit-2019-dat309-r](/images/rds-aurora/aws-summit-2019-dat309-r-320.jpg)

## RDS と Aurora の比較サマリ

Duration: 00:10:00

比較のサマリは以下の通りです。

| 比較項目                     | RDS                                         | Aurora                                                           |
| ---------------------------- | ------------------------------------------- | ---------------------------------------------------------------- |
| データベースエンジン         | MySQL,PostgreSQL,MongoDB,Oracle,SQL Server  | MySQL(互換),PostgreSQL(互換)                                     |
| ストレージアーキテクチャ     | EBSがインスタンス付属                       | Aurora クラスター全体で共有                                      |
| ストレージの自動スケーリング | 設定可                                      | デフォルトで自動拡張                                             |
| 耐久性                       | インスタンス付属のミラーリング用EBSで複製   | 3AZ で6か所に複製                                                |
| 可用性                       | マルチAZのみ                                | Aurora レプリカ                                                  |
| 自動復旧時間                 | マルチAZ時60秒、シングルAZでは復旧不可      | 60秒~120秒、レプリカなしでもAZ障害以外は自動復旧可（10分以内）   |
| 読み取りスループット向上     | リードレプリカ最大5台                       | Aurora レプリカ最大15台                                          |
| スケーリング                 | なし                                        | 自動で Aurora レプリカを増減可能 |
| バックアップ保持期間         | 0～35日                                     | 1～35日                                                          |
| データの復元                 | ポイントインタイムリカバリで5分前まで秒単位 | ポイントインタイムリカバリで5分前まで秒単位                      |
| キャッシュ                   | 再起動で失われる                            | DBプロセスとキャッシュが別で管理、再起動後もキャッシュが利用可能 |
| 価格                         | 起動時間＋ストレージ料金                    | 起動時間＋ストレージ料金＋ストレージI/O                          |

## 比較ポイント１：データベースエンジン

Duration: 00:05:00

MySQL や PostgreSQL を選択する場合で、Aurora 制約事項（\*1、\*2）を許容できる場合は、Aurora が最適となるケースが多いです。

Aurora がサポートしないデータベースエンジンを使用したい場合は、RDS が最適となるケースが多いです。ただし、RDS にも制約事項(\*3)があるため、EC2 でインスタンスを構築するケースもあります。

| Engine     | RDS |   Aurora   |
|------------|:---:|:----------:|
| MySQL      |  ○  | ○(互換\*1) |
| PostgreSQL |  ○  | ○(互換\*1) |
| MariaDB    |  ○  |            |
| Oracle     |  ○  |            |
| SQL Server |  ○  |            |

*1 Aurora では、MySQLもPostgreSQLも互換であり、AWS によって Aurora のアーキテクチャに合うように改修を加えたものです。

*2 上記\*1 の影響もあり、最新バージョンへの対応は RDS より遅い傾向にあります。

*3 RDS では Oracle RAC がサポートされていません。SQL Server では、sysadminなどのサーバーレベルロールが使用できません。詳細は、「よくある質問」やドキュメントを参照してください。

## 比較ポイント２：ストレージアーキテクチャと耐久性

Duration: 00:05:00

RDS と Aurora の大きく異なる点といえば、ストレージのアーキテクチャです。

RDS の方は EC2 に MySQL や PostgreSQL をインストールする場合と同じように、インスタンスに EBS が紐づいており、マルチ AZ の場合もそれぞれに EBS を持っています。
ミラーリング用の EBS で耐久性を高めています。

![rds-architecture](/images/rds-aurora/rds-architecture.png)

https://www.youtube.com/watch?v=oJqIzHIMh7Q&t=24m24s

Aurora の方は、インスタンスとストレージが分離しています。さらに、3 AZ に6つのデータのコピーが作成され、耐久性が高められています。

![aurora-architecuture](/images/rds-aurora/aurora-architecture.png)

https://www.youtube.com/watch?v=oJqIzHIMh7Q&t=25m49s

## 比較ポイント３：ストレージの容量拡張

Duration: 00:10:00

RDS でストレージの自動スケーリングがサポート（[Jun 20, 2019 - Amazon RDS で Storage Auto Scaling のサポートを開始](https://aws.amazon.com/jp/about-aws/whats-new/2019/06/rds-storage-auto-scaling/)）されましたので、RDS も Aurora もストレージの自動拡張が可能ですが、RDS の自動スケーリングにはデメリットもあります。

| 項目           | RDS                                         | Aurora                         |
|----------------|---------------------------------------------|--------------------------------|
| サイズ            | 20 GiB～64 TiB                               | 10GiB～128TiB(*1)               |
| スケールアップ        | オートスケール設定可(\*2)、5GiBまたは割当サイズ10%の大きい方 | デフォルトで自動スケール(\*3,\*4)、10 GiB |
| スケールアップのダウンタイム | なし                                          | なし                             |
| スケールダウン        | 不可                                        | 可（データ削除で自動縮小）           |
| スケールダウンのダウンタイム | あり（インスタンス再作成）                            | なし                             |

*1 [Amazon Aurora サイズ制限](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/CHAP_Limits.html#RDS_Limits.FileSize.Aurora)

*2 [Amazon RDS ストレージの自動スケーリングによる容量の自動管理](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_PIOPS.StorageTypes.html#USER_PIOPS.Autoscaling)

- ストレージの自動スケーリングの発動条件
  - 空き容量が割り当てられたサイズの10 % 未満
  - 低ストレージ状態が5分以上継続
  - 最後のストレージ変更後から6時間経過
    - この制約があるため、RDS の自動スケーリングはストレージ不足状態を完全に防ぐことはできません。
    - 自動スケーリング後に大量のデータロードが発生した場合に数時間ストレージ容量不足状態になる可能性があります。
- 追加ストレージは以下のうち大きい方
  - 5 GiB
  - 割り当てられているサイズの 10 %
  - 直近 1 時間の FreeStorageSpace メトリクスの変動に基づいて予測される 7 時間のストレージの増分

*3 [Aurora ストレージのサイズを自動的に変更する方法](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.StorageReliability.html#aurora-storage-growth)

*4 [ストレージのスケーリング](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Performance.html#Aurora.Managing.Performance.StorageScaling)

- Aurora のストレージは1時間ごとに評価されます。

*5 [ストレージの自動スケーリングをオンにした後に、Amazon RDS の DB インスタンスの空きストレージ容量が少ない状態になったり、storage-full 状態になったりするのはなぜですか?](https://aws.amazon.com/jp/premiumsupport/knowledge-center/rds-autoscaling-low-free-storage/)

- RDS のストレージの自動スケーリングは有効にする前に、ドキュメントやよくある質問などをよく読み、利用するかどうかを慎重に検討する必要があります。

## 比較ポイント４：可用性

Duration: 00:05:00

RDS は マルチ AZ の場合のみ、スタンバイにフェールオーバーし、60秒で自動的に復旧します。
シングル AZ の場合、自動的に復旧できないので、スナップショットから手動復旧が必要になります。
マルチAZ は、プライマリインスタンスとスタンバイインスタンスで構成されます。プライマリインスタンスからスタンバイインスタンスには、同期的にレプリケーションされます。
通常、スタンバイインスタンスにはアクセスできません。

Aurora はレプリカが存在する場合は、レプリカにフェールオーバーし、60秒から120秒で復旧します。
レプリカが存在しない場合、同じ AZ 内に新規インスタンスが作成され、10分以内に復旧します。リージョン障害時にはフェールオーバーが失敗する可能性があります。

RDS / Aurora ともに、AWS マネジメントコンソール、AWS CLI から手動でフェールオーバーすることができます。

## 比較ポイント５：読み取りスループット向上

Duration: 00:05:00

プライマリインスタンスへの読み取りアクセスを分散することで、スループットを向上できます。

RDS ではリードレプリカを追加することができます。リードレプリカは、「インスタンス + EBS + ミラーリング EBS 」のセットが増えていきます。

Aurora ではレプリカを追加すると、「インスタンス」のみが増えていきます。

## 比較ポイント６：自動バックアップの保持期間

Duration: 00:05:00

RDS は 0～35日(デフォルトは 7日)で、Aurora は 1～35日(デフォルトは 1日)となっており、バックアップを無効にすることは出来ません。

RDS / Aurora を停止している時間は保持期間の計算に含まれないので、保持期間より多い日数のスナップショットが存在している場合もあります。

[RDS バックアップの保存期間](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html#USER_WorkingWithAutomatedBackups.BackupRetention)

また、手動で取得したバックアップ（スナップショット）は保持期間の影響を受けないため、手動で削除する必要があります。

自動バックアップは、インスタンスが起動している間のみ取得されますので、

## 比較ポイント７：データの復元

Duration: 00:05:00

RDS と Aurora のともにポイントインタイムリカバリとして、5分前まで秒単位で復元が可能です。

## 比較ポイント８：キャッシュ

Duration: 00:05:00

## 比較ポイント９：価格

Duration: 00:05:00

RDS では、リードレプリカもプライマリインスタンス同様に、ストレージ料金も必要になります。
Auroraは、ストレージ I/O の料金が追加で必要になります。ただし、Aurora のレプリカはストレージ料金がかかりません。

| データベース       | インスタンスの起動時間 | データベースのストレージ料金 | ストレージI/O |
|--------------|:---------------:|:----------------:|:--------:|
| RDS          |        ○        |        ○         |          |
| RDS（リードレプリカ） |        ○        |        ○         |          |
| Aurora       |        ○        |        ○         |    ○     |
| Aurora（レプリカ） |        ○        |                  |    ○     |

東京リージョンで、データベースエンジンが「MySQL」、インスタンスタイプ「db.r6g.large」、データベース容量が「1,000 GB」 、1秒当たり100ページを読み取る I/O （1か月辺り 3億 I/O）が発生する場合、次のようになります。

RDS（マルチAZ）は月額「748.30USD」、Aurora（+レプリカ）は月額「720.98USD」となり、今回のケースでは、Auroraのほうがコスト面で割安となりました。
ただし、Aurora はデータ I/O 次第で RDS を上回る可能性もあります。

| データベース       | インスタンスの起動時間            | データベースのストレージ料金              | ストレージI/O                               | 月額(USD) |
|--------------|:-------------------------|:------------------------------|:---------------------------------------|-----------|
| RDS（マルチAZ）   | 0.510USD×730時間=372.30USD | 0.276USD/GB×1,000GB=276.00USD | -                                      | 510.30USD |
| Aurora       | 0.313USDx730時間=228.49USD | 0.12USD/GBx1,000GB=120.00USD  | 0.24USD/100 万リクエストx3億/100万=72.00USD | 420.49USD |
| Aurora（レプリカ） | 0.313USDx730時間=228.49USD | -                             | 0.24USD/100 万リクエストx3億/100万=72.00USD | 300.49USD |

レプリカが必要になった場合でも、Aurora のほうが割安となりました。

| データベース       | インスタンスの起動時間            | データベースのストレージ料金              | ストレージI/O                               | 月額(USD) |
|--------------|:-------------------------|:------------------------------|:---------------------------------------|-----------|
| RDS（リードレプリカ） | 0.255USD×730時間=186.15USD | 0.138USD/GB×1,000GB=138.00USD | -                                      | 324.15USD |
| Aurora（レプリカ） | 0.313USDx730時間=228.49USD | -                             | 0.24USD/100 万リクエストx3億/100万=72.00USD | 300.49USD |


## 判断フロー

![rds-aurora-flow](/images/rds-aurora/rds-aurora-flow.png)