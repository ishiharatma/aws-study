---
title: "【初心者向け】Amazon Relational Database Service(RDS) と Aurora について比較してみた" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: true
---

<!--# Amazon RDS と Amazon Aurora の比較<!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

<!-- Duration: 00:01:00 -->

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
- [📖 RDS と Aurora どっちを使うかフロー](#-rds-と-aurora-どっちを使うかフロー)

## RDS について知るには

<!-- Duration: 00:52:48 -->

【AWS Black Belt Online Seminar】[Amazon Relational Database Service (Amazon RDS)(YouTube)](https://youtu.be/nDme-ET-_EY)(52:48)

![blackbelt-rds](/images/rds/blackbelt-rds-320.jpg)

[Amazon RDS サービス概要](https://aws.amazon.com/jp/rds/)

[Amazon RDS ドキュメント](https://docs.aws.amazon.com/ja_jp/rds/?icmpid=docs_homepage_databases)

[Amazon RDS よくある質問](https://aws.amazon.com/jp/rds/faqs/)

## Aurora について知るには

<!-- Duration: 03:22:41 -->

【AWS Black Belt Online Seminar】[Amazon Aurora MySQL(YouTube)](https://youtu.be/VerVNchaqVY)(55:41)

![blackbelt-aurora-mysql](/images/aurora/blackbelt-aurora-mysql-320.jpg)

【AWS Black Belt Online Seminar】[Amazon Aurora MySQL Compatible Edition ユースケース毎のスケーリング手法](https://www.youtube.com/watch?v=9KQkskyP930)(55:41)

![blackbelt-aurora-mysql-usecase](/images/aurora/blackbelt-aurora-mysql-usecase-320.jpg)

【AWS Black Belt Online Seminar】[Amazon Aurora with PostgreSQL Compatibility(YouTube)](https://youtu.be/oJqIzHIMh7Q)(1:03:46)

![blackbelt-aurora-postgresql](/images/aurora/blackbelt-aurora-postgresql-320.jpg)

[RDS/Aurora Update | 2.5 時間で学ぶ！ Amazon Aurora のいま(YouTube)](https://youtu.be/8uPU2T5Xj9E)(27:33)

![rds-aurora-updates](/images/aurora/rds-aurora-updates-320.jpg)

[Amazon Aurora サービス概要](https://aws.amazon.com/jp/rds/aurora/)

[Amazon Aurora ドキュメント](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html)

[Amazon Aurora よくある質問](https://aws.amazon.com/jp/rds/aurora/faqs/)

## RDS / Aurora について知るには(その他)

<!-- Duration: 03:05:36 -->

【AWS Summit Tokyo 2019】[AWS におけるデータベースの選択指針](https://www.youtube.com/watch?v=h1r8AzOdlqo)(39:25)

![aws-summit-2019-c2-03](/images/rds-aurora/aws-summit-2019-c2-03-320.jpg)

【AWS Summit Tokyo 2019】[Amazon RDS におけるパフォーマンス最適化とパフォーマンス管理](https://www.youtube.com/watch?v=3oMR2hglQR0)(41:33)

![aws-summit-2019-b3-04](/images/rds-aurora/aws-summit-2019-b3-04-320.jpg)

【AWS Summit Tokyo 2019】[Amazon Aurora with PostgreSQL Compatibility における運用設計のファーストステップ](https://www.youtube.com/watch?v=5McG3hJae9A)(39:53)

![aws-summit-2019-b3-05](/images/rds-aurora/aws-summit-2019-b3-05-320.jpg)

【AWS Summit Tokyo 2019】[Amazon Aurora storage demystified: How it all works (DAT309-R)](https://www.youtube.com/watch?v=DrtwAOND1Pc)(1:04:45)

![aws-summit-2019-dat309-r](/images/rds-aurora/aws-summit-2019-dat309-r-320.jpg)

## RDS と Aurora の比較サマリ

<!-- Duration: 00:05:00 -->

比較のサマリは以下の通りです。

| 比較項目                     | RDS                                           | Aurora                                                              |
| ---------------------------- | --------------------------------------------- | ------------------------------------------------------------------- |
| データベースエンジン         | MySQL,PostgreSQL,MongoDB,Oracle,SQL Server    | MySQL(互換),PostgreSQL(互換)                                        |
| ストレージアーキテクチャ     | EBS がインスタンス付属                        | Aurora クラスター全体で共有                                         |
| ストレージの自動スケーリング | 設定可                                        | デフォルトで自動拡張                                                |
| 耐久性                       | インスタンス付属のミラーリング用 EBS で複製   | 3AZ で 6 か所に複製                                                 |
| 可用性                       | マルチ AZ のみ                                | Aurora レプリカ                                                     |
| 自動復旧時間                 | マルチ AZ 時 60 秒、シングル AZ では復旧不可  | 60 秒~120 秒、レプリカなしでも AZ 障害以外は自動復旧可（10 分以内） |
| 読み取りスループット向上     | リードレプリカ最大 5 台                       | Aurora レプリカ最大 15 台                                           |
| スケーリング                 | なし                                          | 自動で Aurora レプリカを増減可能                                    |
| バックアップ保持期間         | 0 ～ 35 日                                    | 1 ～ 35 日                                                          |
| データの復元                 | ポイントインタイムリカバリで 5 分前まで秒単位 | ポイントインタイムリカバリで 5 分前まで秒単位                       |
| キャッシュ                   | 再起動で失われる                              | DB プロセスとキャッシュが別で管理、再起動後もキャッシュが利用可能   |
| 価格                         | 起動時間＋ストレージ料金                      | 起動時間＋ストレージ料金＋ストレージ I/O                            |

## 比較ポイント１：データベースエンジン

<!-- Duration: 00:05:00 -->

MySQL や PostgreSQL を選択する場合で、Aurora 制約事項（\*1、\*2）を許容できる場合は、Aurora が最適となるケースが多いです。

Aurora がサポートしないデータベースエンジンを使用したい場合は、RDS が最適となるケースが多いです。ただし、RDS にも制約事項(\*3)があるため、EC2 でインスタンスを構築するケースもあります。

| Engine     | RDS |   Aurora   |
| ---------- | :-: | :--------: |
| MySQL      |  ○  | ○(互換\*1) |
| PostgreSQL |  ○  | ○(互換\*1) |
| MariaDB    |  ○  |            |
| Oracle     |  ○  |            |
| SQL Server |  ○  |            |

\*1 Aurora では、MySQL も PostgreSQL も互換であり、AWS によって Aurora のアーキテクチャに合うように改修を加えたものです。

\*2 上記\*1 の影響もあり、最新バージョンへの対応は RDS より遅い傾向にあります。

\*3 RDS では Oracle RAC がサポートされていません。SQL Server では、sysadmin などのサーバーレベルロールが使用できません。詳細は、「よくある質問」やドキュメントを参照してください。

## 比較ポイント２：ストレージアーキテクチャと耐久性

<!-- Duration: 00:05:00 -->

RDS と Aurora の大きく異なる点といえば、ストレージのアーキテクチャです。

RDS の方は EC2 に MySQL や PostgreSQL をインストールする場合と同じように、インスタンスに EBS が紐づいており、マルチ AZ の場合もそれぞれに EBS を持っています。
ミラーリング用の EBS で耐久性を高めています。

![rds-architecture](/images/rds/rds-architecture.png)

https://www.youtube.com/watch?v=oJqIzHIMh7Q&t=24m24s

Aurora の方は、インスタンスとストレージが分離しています。さらに、3 AZ に 6 つのデータのコピーが作成され、耐久性が高められています。

![aurora-architecuture](/images/aurora/aurora-architecture.png)

https://www.youtube.com/watch?v=oJqIzHIMh7Q&t=25m49s

## 比較ポイント３：ストレージの容量拡張

<!-- Duration: 00:10:00 -->

RDS でストレージの自動スケーリングがサポート（[Jun 20, 2019 - Amazon RDS で Storage Auto Scaling のサポートを開始](https://aws.amazon.com/jp/about-aws/whats-new/2019/06/rds-storage-auto-scaling/)）されましたので、RDS も Aurora もストレージの自動拡張が可能ですが、RDS の自動スケーリングにはデメリットもあります。

| 項目                         | RDS                                                            | Aurora                                    |
| ---------------------------- | -------------------------------------------------------------- | ----------------------------------------- |
| サイズ                       | 20 GiB ～ 64 TiB                                               | 10GiB ～ 128TiB(\*1)                      |
| スケールアップ               | オートスケール設定可(\*2)、5GiB または割当サイズ 10%の大きい方 | デフォルトで自動スケール(\*3,\*4)、10 GiB |
| スケールアップのダウンタイム | なし                                                           | なし                                      |
| スケールダウン               | 不可                                                           | 可（データ削除で自動縮小）                |
| スケールダウンのダウンタイム | あり（インスタンス再作成）                                     | なし                                      |

\*1 [Amazon Aurora サイズ制限](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/CHAP_Limits.html#RDS_Limits.FileSize.Aurora)

\*2 [Amazon RDS ストレージの自動スケーリングによる容量の自動管理](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_PIOPS.StorageTypes.html#USER_PIOPS.Autoscaling)

- ストレージの自動スケーリングの発動条件
  - 空き容量が割り当てられたサイズの 10 % 未満
  - 低ストレージ状態が 5 分以上継続
  - 最後のストレージ変更後から 6 時間経過
    - この制約があるため、RDS の自動スケーリングはストレージ不足状態を完全に防ぐことはできません。
    - 自動スケーリング後に大量のデータロードが発生した場合に数時間ストレージ容量不足状態になる可能性があります。
- 追加ストレージは以下のうち大きい方
  - 5 GiB
  - 割り当てられているサイズの 10 %
  - 直近 1 時間の FreeStorageSpace メトリクスの変動に基づいて予測される 7 時間のストレージの増分

\*3 [Aurora ストレージのサイズを自動的に変更する方法](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.StorageReliability.html#aurora-storage-growth)

\*4 [ストレージのスケーリング](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Performance.html#Aurora.Managing.Performance.StorageScaling)

- Aurora のストレージは 1 時間ごとに評価されます。

\*5 [ストレージの自動スケーリングをオンにした後に、Amazon RDS の DB インスタンスの空きストレージ容量が少ない状態になったり、storage-full 状態になったりするのはなぜですか?](https://aws.amazon.com/jp/premiumsupport/knowledge-center/rds-autoscaling-low-free-storage/)

- RDS のストレージの自動スケーリングは有効にする前に、ドキュメントやよくある質問などをよく読み、利用するかどうかを慎重に検討する必要があります。

## 比較ポイント４：可用性

<!-- Duration: 00:05:00 -->

RDS は マルチ AZ の場合のみ、スタンバイにフェールオーバーし、60 秒で自動的に復旧します。
シングル AZ の場合、自動的に復旧できないので、スナップショットから手動復旧が必要になります。
マルチ AZ は、プライマリインスタンスとスタンバイインスタンスで構成されます。プライマリインスタンスからスタンバイインスタンスには、同期的にレプリケーションされます。
通常、スタンバイインスタンスにはアクセスできません。

Aurora はレプリカが存在する場合は、レプリカにフェールオーバーし、60 秒から 120 秒で復旧します。
レプリカが存在しない場合、同じ AZ 内に新規インスタンスが作成され、10 分以内に復旧します。AZ 障害時にはフェールオーバーが失敗する可能性があります。

Aurora レプリカのフェールオーバーは優先順位を設定することが可能です。

たとえば、バッチ処理やデータのエクスポートなど負荷の高い処理に使用しているレプリカの優先順位を下げておくといったことが可能です。

[Aurora DB クラスターの耐障害性](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/Concepts.AuroraHighAvailability.html#Aurora.Managing.FaultTolerance)

RDS / Aurora ともに、AWS マネジメントコンソール、AWS CLI から手動でフェールオーバーすることができます。

## 比較ポイント５：読み取りスループット向上

<!-- Duration: 00:05:00 -->

プライマリインスタンスへの読み取りアクセスを分散することで、スループットを向上できます。

RDS ではリードレプリカを追加することができます。リードレプリカは、「インスタンス + EBS + ミラーリング EBS 」のセットが増えていきます。

Aurora ではレプリカを追加すると、「インスタンス」のみが増えていきます。

Aurora のレプリカは、オートスケーリングによってスケールアップ／ダウンが可能です。

[Aurora レプリカでの Amazon Aurora Auto Scaling の使用](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/Aurora.Integrating.AutoScaling.html)

## 比較ポイント６：自動バックアップの保持期間

<!-- Duration: 00:05:00 -->

RDS は 0 ～ 35 日(デフォルトは 7 日)で、0 日にすることでバックアップを無効化できます。

Aurora は 1 ～ 35 日(デフォルトは 1 日)となっており、0 日に設定できないため、バックアップを無効にすることは出来ません。

自動バックアップは、インスタンスが起動している間のみ取得されます。ドキュメントには以下の記述があります。

```text
自動バックアップを行うには、DB インスタンスが AVAILABLE 状態になっている必要があります。
DB インスタンスが AVAILABLEなどの STORAGE_FULL 以外の状態にある間は、自動バックアップは行われません。
```

[バックアップの使用](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html)

また、よくある質問には以下の記述があります。

```text
>自動化された DB スナップショットの数が、DB インスタンスに対するリテンション期間の日数よりも多いのはなぜですか?

リテンション期間の日数よりも 1 日か 2 日自動化 DB のスナップショットの日数が多いのは正常です。
自動化スナップショットは 1 日余計にとられていて、リテンション期間中のいつにでも復帰できる時点を設けています。

例えば、バックアップウィンドウが 1 日に設定されている場合、自動化スナップショットは 2 つ必要で、
これで過去 24 時間中の任意の時点への復帰をサポートしています。
また、さらに多くの自動化スナップショットがある場合もありますが、これは新たな自動化スナップショットが、
最も古い自動化スナップショットを削除する前に常に生成されるためです。。
```

[よくある質問](https://aws.amazon.com/jp/rds/faqs/)

RDS / Aurora を停止している時間は保持期間の計算に含まれないので、保持期間より多い日数のスナップショットが存在している場合もあります。

ドキュメントには以下の記述があります。

7 日分保持する設定にしていた場合、24 時間 × 7 日 = 168 時間になりますが、RDS を夜間に 12 時間停止していた場合、168 / 12 = 14 日となるということでしょうか。

```text
DB インスタンスが停止している場合、バックアップ保持期間より長くバックアップを保持できます。
RDSには、バックアップ保存期間の計算時にstopped状態にあった時間は含まれません。
```

[RDS バックアップの保存期間](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html#USER_WorkingWithAutomatedBackups.BackupRetention)

また、手動で取得したバックアップ（スナップショット）は保持期間の影響を受けないため、手動で削除する必要があります。

## 比較ポイント７：データの復元

<!-- Duration: 00:05:00 -->

RDS と Aurora のともにポイントインタイムリカバリとして、5 分前まで秒単位で復元が可能です。

復元といっても「特定地点のデータ状態のデータベースクラスタを再作成する機能」ですので注意が必要です。

データベースクラスタ内でデータのみをリカバリするわけではありません。

## 比較ポイント８：キャッシュ

<!-- Duration: 00:05:00 -->

RDS ではデータベースインスタンス内にキャッシュを持つが、Aurora では、データベースとは分離して管理しています。

Aurora PostgreSQL は、クラスタキャッシュ管理という仕組みで、プライマリインスタンスが持っているキャシュを特定のレプリカと共有することで、フェールオーバー時にキャッシュが失われて、処理性能が低下することを抑えることが可能になっています。

[Aurora PostgreSQL のクラスターキャッシュ管理によるフェイルオーバー後の高速リカバリ](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/AuroraPostgreSQL.cluster-cache-mgmt.html#AuroraPostgreSQL.cluster-cache-mgmt.Configure)

## 比較ポイント９：価格

<!-- Duration: 00:05:00 -->

RDS では、リードレプリカもプライマリインスタンス同様に、ストレージ料金も必要になります。
Aurora は、ストレージ I/O の料金が追加で必要になります。ただし、Aurora のレプリカはストレージ料金がかかりません。

| データベース          | インスタンスの起動時間 | データベースのストレージ料金 | ストレージ I/O |
| --------------------- | :--------------------: | :--------------------------: | :------------: |
| RDS                   |           ○            |              ○               |                |
| RDS（リードレプリカ） |           ○            |              ○               |                |
| Aurora                |           ○            |              ○               |       ○        |
| Aurora（レプリカ）    |           ○            |                              |       ○        |

東京リージョンで、データベースエンジンが「MySQL」、インスタンスタイプ「db.r6g.large」、データベース容量が「1,000 GB」 、1 秒当たり 100 ページを読み取る I/O （1 か月辺り 3 億 I/O）が発生する場合、次のようになります。

RDS（マルチ AZ）は月額「748.30USD」、Aurora（+レプリカ）は月額「720.98USD」となり、今回のケースでは、Aurora のほうがコスト面で割安となりました。
ただし、Aurora はデータ I/O 次第で RDS を上回る可能性もあります。

| データベース       | インスタンスの起動時間      | データベースのストレージ料金  | ストレージ I/O                                 | 月額(USD) |
| ------------------ | :-------------------------- | :---------------------------- | :--------------------------------------------- | --------- |
| RDS（マルチ AZ）   | 0.510USD×730 時間=372.30USD | 0.276USD/GB×1,000GB=276.00USD | -                                              | 510.30USD |
| Aurora             | 0.313USDx730 時間=228.49USD | 0.12USD/GBx1,000GB=120.00USD  | 0.24USD/100 万リクエスト x3 億/100 万=72.00USD | 420.49USD |
| Aurora（レプリカ） | 0.313USDx730 時間=228.49USD | -                             | 0.24USD/100 万リクエスト x3 億/100 万=72.00USD | 300.49USD |

レプリカが必要になった場合でも、Aurora のほうが割安となりました。

| データベース          | インスタンスの起動時間      | データベースのストレージ料金  | ストレージ I/O                                 | 月額(USD) |
| --------------------- | :-------------------------- | :---------------------------- | :--------------------------------------------- | --------- |
| RDS（リードレプリカ） | 0.255USD×730 時間=186.15USD | 0.138USD/GB×1,000GB=138.00USD | -                                              | 324.15USD |
| Aurora（レプリカ）    | 0.313USDx730 時間=228.49USD | -                             | 0.24USD/100 万リクエスト x3 億/100 万=72.00USD | 300.49USD |

## 📖 RDS と Aurora どっちを使うかフロー

![rds-aurora-flow](/images/rds-aurora/rds-aurora-flow.png)
