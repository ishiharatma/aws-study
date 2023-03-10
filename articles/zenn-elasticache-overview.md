---
title: "【初心者向け】Amazon ElastiCache について改めて整理してみた" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: true
---

# Amazon ElastiCache

## はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## Contents

- [Amazon ElastiCache](#amazon-elasticache)
  - [はじめに](#はじめに)
  - [Contents](#contents)
  - [Amazon ElastiCache とは](#amazon-elasticache-とは)
    - [ハンズオン](#ハンズオン)
  - [Memcached と Redis の比較](#memcached-と-redis-の比較)
  - [どのように利用したらよいか？](#どのように利用したらよいか)
  - [DynamoDB で代用できる？](#dynamodb-で代用できる)
  - [Amazon ElastiCache for Memcached](#amazon-elasticache-for-memcached)
  - [Amazon ElastiCache for Redis](#amazon-elasticache-for-redis)
  - [自動フェイルオーバー](#自動フェイルオーバー)
  - [Amazon ElastiCache for Redis の Global Datastore](#amazon-elasticache-for-redis-の-global-datastore)
  - [まとめ](#まとめ)

## Amazon ElastiCache とは

Duration: 3:39:21

フルマネージドのインメモリキャッシングサービスで、Memcached または Redis プロトコルに互換性があります。

【AWS Black Belt Online Seminar】[Amazon ElastiCache(YouTube)](https://www.youtube.com/watch?v=-NU1U8_fxo4)(39:21)

![blackbelt-elasticache](/images/elasticache/blackbelt-elasticache-320.jpg)

古い資料（PDF）はこちら[【AWS Black Belt Online Seminar】
Amazon ElastiCache-2017.12.14](https://d1.awsstatic.com/webinars/jp/pdf/services/20171214_AWS-Blackbelt-ElastiCache.pdf)

![blackbelt-elasticache-2017-320.jpg](/images/elasticache/blackbelt-elasticache-2017-320.jpg)

[Amazon ElastiCache サービス概要](https://aws.amazon.com/jp/xx/)

[Amazon ElastiCache ドキュメント](https://docs.aws.amazon.com/ja_jp/elasticache/?icmpid=docs_homepage_databases)

[Amazon ElastiCache よくある質問](https://aws.amazon.com/jp/elasticache/faqs/)

[Amazon ElastiCache 料金](https://aws.amazon.com/jp/elasticache/pricing/)

[Redis](https://redis.io/)

レディス と読みます。

[Memcached](http://memcached.org/)

memory cache daemon の略でメムキャッシュディーと読みます｡

### ハンズオン

[Amazon Aurora Serverless と Amazon ElastiCache を使用してリアルタイムなリーダーボードをビルドする](https://aws.amazon.com/jp/getting-started/hands-on/real-time-leaderboard-amazon-aurora-serverless-elasticache/?trk=gs_card)

[Amazon ElastiCache for Redis を使い、オンラインアプリケーション用の高速セッションストアを構築する](https://aws.amazon.com/jp/getting-started/hands-on/building-fast-session-caching-with-amazon-elasticache-for-redis/)(※英語のみ)

[Amazon ElastiCache for Redis を使い、MySQL データベースのパフォーマンスを向上させる](https://aws.amazon.com/jp/getting-started/hands-on/boosting-mysql-database-performance-with-amazon-elasticache-for-redis/)(※英語のみ)

[ElastiCache のチュートリアルと動画](https://docs.aws.amazon.com/ja_jp/AmazonElastiCache/latest/red-ug/Tutorials.html#tutorial-videos)

## Memcached と Redis の比較

Duration: 0:01:30

https://docs.aws.amazon.com/ja_jp/AmazonElastiCache/latest/red-ug/SelectEngine.html

主な比較は次のとおりです。

| key                  | Memcached | Redis |
| -------------------- | --------- | ----- |
| マルチスレッド       | Yes       | No    |
| データ型             | シンプル  | 複雑  |
| 自動フェイルオーバー | No        | Yes   |
| レプリケーション     | No        | Yes   |
| バックアップと復元   | No        | Yes   |
| Pub/Sub              | No        | Yes   |

Memcached のほうが単純な Key-Value の処理だとパフォーマンスが優れるが、レプリケーション／自動フェイルオーバー／複雑な集計などが必要な場合は Redis を選択するケースが多くなると思います。

こちらにも詳しく記載があります。
https://aws.amazon.com/jp/elasticache/redis-vs-memcached/

## どのように利用したらよいか？

Duration: 0:01:30

- キャッシュは揮発性のあるデータであるため、消えて困るデータは保存しないほうがよいです。
-結果整合性（分散データベース環境でデータが更新された際に、一定時間経過後には最終的な一貫性が担保されること）を前提とした設計を行う必要があります。
- TTL（Time to Live, 有効期限）を設定しましょう。データを保存しすぎて、メモリが溢れてしまうといったことが発生します。TTL は長すぎても TTL が切れる前にメモリが溢れることにもなります。また、TTL が切れるタイミングが同じデータが多く存在すると、CPU 使用率が上昇することがあります。

## DynamoDB で代用できる？

Duration: 0:01:30

DynamoDB も Key-Value で低レイテンシーのサービスです。同じように代用もできるのではないかと考えます。
ただ、DynamoDB は可用性担保のため複数 AZ に保存しているので書き込みは遅くなります。また、DynamoDB はリクエスト数で課金されるため、頻繁に利用されるセッション情報などの場合はコストが急増したり、キャパシティが枯渇する可能性があります。DAX を利用することでこれらを回避することも出来ます。

つまり、基本的には永続化が不要であれば ElastiCache のほうがよいケースが多いと思われます。

## Amazon ElastiCache for Memcached

Duration: 0:01:30

構成イメージはこのようになります。クラスタ化されていますが、レプリケーションの機能はありません。
![Redis Cluster/Replication](/images/elasticache/elasticache-memcached-cluster.png)

## Amazon ElastiCache for Redis

Duration: 0:03:00

クラスタモード有効/無効　×　レプリケーション有/無のパターンがあります。
クラスタモードは複数のシャードにデータを分散させることが出来ます。クラスタモードが有効でもシャードを１つに設定することも可能です。

クラスタもレプリケーションもない単一の構成です。
![Redis NonCluster/NonReplication](/images/elasticache/elasticache-redis-nocluster-norep.png)

レプリケーションが有効な構成です。
![Redis NonCluster/Replication](/images/elasticache/elasticache-redis-nocluster-rep.png)

クラスタモードが有効ですが、レプリケーション無しの構成です。
![Redis Cluster/NonReplication](/images/elasticache/elasticache-redis-cluster-norep.png)

クラスタモードが有効でレプリケーション有りの構成です。
![Redis Cluster/Replication](/images/elasticache/elasticache-redis-cluster-rep.png)

## 自動フェイルオーバー

Duration: 0:00:30

https://docs.aws.amazon.com/ja_jp/AmazonElastiCache/latest/red-ug/AutoFailover.html

レプリケーションされている場合、自動的にフェイルオーバーが実行されます。

## Amazon ElastiCache for Redis の Global Datastore

Duration: 0:00:30

https://docs.aws.amazon.com/ja_jp/AmazonElastiCache/latest/red-ug/Redis-Global-Datastore.html

![globaldatastore](/images/elasticache/elasticache-redis-globaldatastore.png)

Global Datastore for Redis 機能を使用すると、AWS リージョン全体で完全マネージド型、高速、信頼性、安全なレプリケーションを実行できます。

## まとめ

![lambda](/images/all/elasticache.png)
