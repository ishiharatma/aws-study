---
title: "【初心者向け】Amazon Aurora について改めて整理してみた" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: false
---

# Aurora

## はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## Contents

Duration: 00:01:00

- [Aurora](#aurora)
  - [はじめに](#はじめに)
  - [Contents](#contents)
  - [Aurora について知るには](#aurora-について知るには)
  - [Aurora について知るには(その他)](#aurora-について知るにはその他)
  - [Aurora の概要](#aurora-の概要)
    - [Aurora のクロスリージョンレプリケーション](#aurora-のクロスリージョンレプリケーション)

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

## Aurora の概要

Duration: 00:30:00

![aurora](/images/rds-aurora/aurora.png)

### Aurora のクロスリージョンレプリケーション

RDS のクロスリージョンレプリケーションとは違い、Aurora ではストレージのみがレプリケーションされます。
