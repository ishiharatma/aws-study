---
title: "【初心者向け】Amazon Relational Database Service(RDS) について改めて整理してみた" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: false
---

# RDS

## はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## Contents

Duration: 00:01:00

- [RDS](#rds)
  - [はじめに](#はじめに)
  - [Contents](#contents)
  - [RDS について知るには](#rds-について知るには)
  - [RDS について知るには(その他)](#rds-について知るにはその他)
  - [可用性](#可用性)
    - [シングル AZ](#シングル-az)
    - [マルチ AZ](#マルチ-az)
    - [マルチ AZ（２つの読み取り可能なスタンバイ）](#マルチ-az２つの読み取り可能なスタンバイ)
    - [RDS のクロスリージョンレプリケーション](#rds-のクロスリージョンレプリケーション)


## RDS について知るには

Duration: 00:52:48

【AWS Black Belt Online Seminar】[Amazon Relational Database Service (Amazon RDS)(YouTube)](https://youtu.be/nDme-ET-_EY)(52:48)

![blackbelt-rds](/images/rds-aurora/blackbelt-rds-320.jpg)

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

## 可用性

Duration: 00:30:00

### シングル AZ

![rds-single-az](/images/rds-aurora/rds-single-az.png)

１つの AZ に RDS インスタンスを構築した最小構成です。
AZ 障害時にはインスタンスが利用できなくなります。

開発環境や、可用性を求められない場合にコストを低く抑えることが出来る構成です。ただし、自動バックアップ時には、I/O が数秒～数分のごく短時間中断されることがあります。インスタンスタイプによってこの時間は異なります。

読み取りスループットを向上させたい場合は、リードレプリカを追加します。

シングル AZ で構成された RDS を後からマルチ AZ に変更することも可能です。ダウンタイムは発生しません。マルチ AZ 変更後は、シングル AZ に比べてトランザクションスループットは若干低下します。これは同期的レプリケーションが行われるようになるからです。

>シングル AZ Amazon RDS インスタンスをマルチ AZ インスタンス、またはその逆に変換すると、どのような影響がありますか?
[https://aws.amazon.com/jp/premiumsupport/knowledge-center/rds-convert-single-az-multi-az/](https://aws.amazon.com/jp/premiumsupport/knowledge-center/rds-convert-single-az-multi-az/)

### マルチ AZ

![rds-multi-az-1](/images/rds-aurora/rds-multi-az-1.png)

２つの AZ に プライマリインスタンスとスタンバイインスタンスを構築し、プライマリからスタンバイに同期的にレプリケーションされています。
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

![rds-multi-az-2](/images/rds-aurora/rds-multi-az-2.png)

以前からあるマルチ AZ を拡張したもので、スタンバイインスタンスは読み取りアクセスが可能となります。そのため、「従来のマルチ AZ + リードレプリカ」構成よりも読み取りスループット向上できます。

自動フェールオーバーは 従来のマルチ AZ より早い、35秒となっています。トランザクションスループットも従来のマルチ AZ と比べて最大で2倍高速となっています。

従来のマルチ AZ にリードレプリカを1台以上追加する場合は、こちらのマルチ AZを利用するほうがよいです。

また、３つの AZ で構成されるため、AZ 障害にも強い構成と言えます。２つの AZ が同時に障害になっても継続できます。

ただし、利用可能なデータベースエンジンは、2022年12月現在では MySQL と PostgreSQL のみとなっていますので注意が必要です。

[https://aws.amazon.com/blogs/database/readable-standby-instances-in-amazon-rds-multi-az-deployments-a-new-high-availability-option/](https://aws.amazon.com/blogs/database/readable-standby-instances-in-amazon-rds-multi-az-deployments-a-new-high-availability-option/)

さらに読み取りスループットを向上させたい場合は、リードレプリカを追加します。

### RDS のクロスリージョンレプリケーション

RDS のクロスリージョンレプリケーションは、レプリケーション先のリージョンにもう１つ RDS インスタンスが構築されてレプリケーションされます。
