---
title: "【初心者向け】Amazon DynamoDB について改めて整理してみた" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: false
---

# Amazon DynamoDB

## はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## Contents

- [Amazon DynamoDB](#amazon-dynamodb)
  - [はじめに](#はじめに)
  - [Contents](#contents)
  - [Amazon DynamoDB とは](#amazon-dynamodb-とは)
  - [Amazon DynamoDB の基本](#amazon-dynamodb-の基本)
  - [Amazon DynamoDB のストレージ](#amazon-dynamodb-のストレージ)
  - [Amazon DynamoDB の耐久性](#amazon-dynamodb-の耐久性)
  - [Amazon DynamoDB の読み込み整合性](#amazon-dynamodb-の読み込み整合性)
  - [Amazon DynamoDB のパフォーマンス](#amazon-dynamodb-のパフォーマンス)
  - [Amazon DynamoDB のユースケース](#amazon-dynamodb-のユースケース)
  - [Amazon DynamoDB の料金](#amazon-dynamodb-の料金)
  - [TTL](#ttl)
  - [DynamoDB ストリーム](#dynamodb-ストリーム)
  - [グローバルテーブル](#グローバルテーブル)
  - [DynamoDB Accelerator (DAX)](#dynamodb-accelerator-dax)
  - [条件付き書き込み](#条件付き書き込み)
  - [アトミックカウンター](#アトミックカウンター)
  - [設計](#設計)


## Amazon DynamoDB とは

Duration: 1:31:15

1桁ミリ秒単位で規模に応じたパフォーマンスを実現する高速で柔軟な NoSQL データベースのフルマネージドサービスです。

CAP定理という、「一貫性（Consistency）」「可用性（Availability）」「ネットワーク分断耐性（Partition-tolerance）」をすべて達成することはできない、という決まりがあります。

DynamoDB は、「可用性（Availability）」「ネットワーク分断耐性（Partition-tolerance）」を重視して開発されています。

DynamoDB は、「値」とそれを取得するための「キー」だけを格納するというシンプルな機能を持った「キーバリュー型」の形式でデータを格納します。


【AWS Black Belt Online Seminar】[Amazon DocumentDB (with MongoDB Compatibility)(YouTube)]([xxx](https://www.youtube.com/watch?v=RTfCVlo1EoA))(41:38)

![xx](/images/xx/)

【AWS Black Belt Online Seminar】[Amazon DynamoDB Advanced Design Pattern(YouTube)](https://www.youtube.com/watch?v=Wd5gbLQ2a1E)(49:37)

![xx](/images/xx/)

[【AWS Tech 再演】AWS の NoSQL 入門 〜Amazon ElastiCache, Amazon DynamoDB〜｜AWS Summit Tokyo 2017](https://www.youtube.com/watch?v=cEl4TMM9oYw)(40:01)

[xx サービス概要](https://aws.amazon.com/jp/dynamodb/)

[xx ドキュメント](https://docs.aws.amazon.com/ja_jp/dynamodb/?id=docs_gateway)

[xx よくある質問](https://aws.amazon.com/jp/dynamodb/faqs/)

## Amazon DynamoDB の基本

Duration: 0:05:00

- パーティションキー
  - キーに設定した属性のハッシュ値によって、テーブルの Item はパーティションと呼ばれる領域に分散して配置されます
  - [パーティションとデータ分散](https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/HowItWorks.Partitions.html)
  - テーブルに１つしか設定できません
  - 各パーティションへのアクセスが均一になるような設計を行う
  - [パーティションキーを効率的に設計し、使用するためのベストプラクティス](https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/bp-partition-key-design.html)
  - 偏った状態では、「ホットパーティション問題」が発生します。DynamoDBでは、スループットはテーブル全体の設定でパーティションごとに均等に割り当てられる。パーティションに偏りがある場合、アクセスが集中しているパーティションのスループットが枯渇してしまいます。
- ソートキー
  - 範囲の指定やソートを行うために必要なキー
  - パーティション内でソートされ物理的に近い位置に配置されます
  - 指定は任意です
  - [ソートキーを使用してデータを整理するためのベストプラクティス](https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/bp-sort-keys.html)
- プライマリキー
  - 「パーティションキー」または、「パーティションキーとソートキーの複合キー」のこと。
- グローバルセカンダリインデックス（GSI）
  - テーブルとパーティションキーまたはパーティション/ソートキーが異なるインデックスです。
  - 例えば、プライマリパーティションキーがCustomerID で、GSI のパーティションキーが郵便番号 
  - 1 テーブルあたり最大で 5つの GSI を作成できます。
  - スループットやストレージ容量を追加で必要となります。インデックスが増えると書き込みコストが上がります。
  - GSI に依存するテーブル設計であれば、RDS の利用も検討したほうがよい。
  - [DynamoDB でセカンダリインデックスを使用するためのベストプラクティス](https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/bp-indexes.html)
- ローカルセカンダリインデックス（LSI）
  - テーブルとパーティションキーは同じですが、ソートキーが異なるインデックスです。
  - 1 テーブルあたり最大で 5つの LSI を作成できます。
  - スループットやストレージ容量を追加で必要となります。インデックスが増えると書き込みコストが上がります。
  - [セカンダリインデックスを使用したデータアクセス性の向上](https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/SecondaryIndexes.html)

## Amazon DynamoDB のストレージ

Duration: 0:01:30

DynamoDB のストレージは、容量制限がありません。自動的に拡張していきます。1GB 単位で課金されていきます。

東京リージョンでは、0.285 USD/GB （標準ストレージクラス）です。

同じデータベースサービスである Aurora は 0.11 USD/GB ですので、2倍です。

S3（Standard） は、0.025 USD/GB ですので 10倍となります。

ストレージ料金としては、決して安くないサービスであるので大容量のデータ保管には向いていないと言えます。

ただ、ストレージクラスは以下の２つが選択できますので、利用用途によってはかなり料金を抑えられる可能性があります。

- 標準（Standard）
  - 従来からあるストレージクラス
- 標準 - 低頻度アクセス（Standard - IA）
  - アクセス頻度が低いデータの保存に適したストレージクラス
  - 標準より コストを 60 % 削減できる

[2021-12-1 Amazon DynamoDB が、DynamoDB コストを最大 60% 削減するのに役立つ新しい Amazon DynamoDB Standard-Infrequent Access テーブルクラスを発表](https://aws.amazon.com/jp/about-aws/whats-new/2021/12/amazon-dynamodb-standard-infrequent-access-table-class/)

## Amazon DynamoDB の耐久性

Duration: 0:00:30

3 つの AZ にデータがレプリケートされることで冗長化されます。書き込みについては、少なくとも 2AZ に書き込みが完了した時点で、応答（Ack）が返却されます。

最終的に、全てのAZに反映されます。

## Amazon DynamoDB の読み込み整合性

Duration: 0:01:30

先に述べたように、DynamoDBは CAP定理「一貫性（Consistency）」「可用性（Availability）」「ネットワーク分断耐性（Partition-tolerance）」のうち、「可用性（Availability）」「ネットワーク分断耐性（Partition-tolerance）」を重視した設計となっているため、リレーショナルデータベースのような「一貫性」は保証されておらず、データはいつか必ず書き込まれる（通常は 1秒以内）という動作になります。

そのため、デフォルトでは `結果整合性のある読み込み` となります。この読み取りでは、最新の書き込み結果が反映されていない場合がある読み込みです。

もう一つの読み込みとして、`強い整合性のある読み込み` があります。Consistent Readオプションを付けたリクエストでは、この読み込みが行われ、リクエストを受け取る前までの最新のデータを読み取ることができます。Consistent Readオプションを付けられるのは、「GetItem, Query, Scan」です。

また、`強い整合性のある読み込み` は、`結果整合性のある読み込み` に比べてスループットキャパシティ（後述）の消費が大きくなります。

## Amazon DynamoDB のパフォーマンス

Duration: 0:03:00

スループットキャパシティといった、読み取り、書き込みに必要なスループットキャパシティをテーブル単位で割り当てることができます。

テーブルにパーティションがある場合は、読み取り、書き込みはパーティションごとに均等に割り当てられます。

読み取りのスループットは、RCU(Read Capacity Unit)という単位で割り当てます。1 RCU は、4 KBの項目に対して、結果整合性のある読み取りの場合 2回/秒、強い整合性のある読み取りの場合 1回/秒、といった読み取り性能を表す単位です。

書き込みのスループットは、WCU(Write Capacity Unit)という単位で割り当てます。1 WCU は、最大 1KB の項目に対して、1回/秒の書き込み性能を表す単位です。

DynamoDB を利用する場合は、テーブルごとに RCU と WCU を設計する必要があります。ただし、どれだけ必要か事前に見積もることが困難な場合が多いです。

そのような用途のために、「オンデマンド」と「プロビジョニング済み」という 2 種類のキャパシティーモードがあります。

キャパシティモードは24時間に1回だけ相互に変更することができます。

「プロビジョニング済み」から「オンデマンド」に変更すると、Auto Scaling の設定が削除されるので、もう一度「プロビジョニング済み」に戻す場合は注意が必要です。

- オンデマンドキャパシティモード
  - アクセスのピークが予測困難な場合に適したモードで、事前のキャパシティの設定が不要です
  - 使用したユニット数に応じた従量課金となるため、要求が多いとコストが増加します
  - 自動的にキャパシティが調整されますが、一度キャパシティが自動調整されたのち、30分以内に前回のピークの2倍を超えるトラフィックが発生するとスロットリング（一時的なキャパシティ不足）が発生します
- プロビジョニング済みキャパシティーモード
  - 安定したアクセスが見込まれる場合に適したモードで、事前に予想されるキャパシティを設定しておきます
  - 設定したキャパシティを超えた場合は、スロットリングが発生します
  - Auto Scaling を使用することで利用率に応じてキャパシティを自動調整でき、スロットリングの発生を回避できます。ただし、即応性はないので急激な負荷には対応できない場合もあります

## Amazon DynamoDB のユースケース

Duration: 0:01:30

- ユーザー情報
- 広告やゲームなどのユーザー行動履歴
- モバイルアプリのバックエンド
- クリックストリーム
- IoTデータの蓄積
- RDB のキャッシュ

よくある構成は、「API Gateway / Lambda / DynamoDB」の組み合わせです。

結合や集計処理や大量データの読み書きが必要なユースケースの場合には RDB の利用を検討します。

## Amazon DynamoDB の料金

Duration: 0:00:30

[Amazon DynamoDB 料金](https://aws.amazon.com/jp/dynamodb/pricing/)

「データストレージ」「読み込み/書き込み要求」によって課金されます。その他、使用したオプション機能によって追加で課金が発生します。

また、「オンデマンド」と「プロビジョニング済み」のキャパシティーモードそれぞれで料金体系が異なります。

詳しくは、料金表を参照してください。

## TTL

Duration: 0:01:30

テーブルのレコードの有効期限を設定でき、有効期限が過ぎるとレコードが自動的に削除されます。

削除処理はバックグラウンドで動き、通常のトラフィックに影響を与えません。またデータは48時間以内に削除されます。

TTLとして指定する属性は、Number型のUnixtime（ミリ秒無し）である必要があります。

## DynamoDB ストリーム

Duration: 0:01:30

テーブルの変更履歴を記録するフローで、変更の順番は厳密に記録されます。この情報は最大 24時間保存されます。

DynamoDB ストリームを利用することで、イベントドリブンなアプリケーションを実装することができます。

DynamoDB ストリームから「Lambda」や「Kinesis Firehose」を呼び出したりする用途が考えられます。

## グローバルテーブル

Duration: 0:01:30

指定したリージョンに DynamoDB テーブルを自動的にレプリケートする機能です。

## DynamoDB Accelerator (DAX)

Duration: 0:01:30

DynamoDB と互換性のある高可用性インメモリキャッシュを提供するフルマネージドサービスです。

レスポンスをミリ秒単位からマイクロ秒単位まで高速化することが可能になります。

## 条件付き書き込み

Duration: 0:01:30

デフォルトの DynamoDB の書き込み（PutItem、UpdateItem、DeleteItem）は無条件であるため、指定したプライマリキーをもつ項目が上書きされます。

これは複数人でデータを更新するような処理（たとえば、商品の在庫を減らす、訪問者数のカウンタなど）では、前の更新内容が失われてしまう場合が発生します。

それを防ぐために、条件付き書き込みという機能を利用します。簡単にいうと楽観的排他制御（楽観ロック）です。

下記のように、「update-expression」の更新が「condition-expression」の条件を満たす場合のみ実行されるようになります。

```sh
aws dynamodb update-item \
    --table-name ProductCatalog \
    --key '{"Id":{"N":"1"}}' \
    --update-expression "SET Price = :newval" \
    --condition-expression "Price = :currval" \
    --expression-attribute-values file://values.json
```

```json
{
    ":newval":{"N":"8"},
    ":currval":{"N":"10"}
}
```

[条件式](https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html)

[条件付きの書き込み](https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/WorkingWithItems.html#WorkingWithItems.ConditionalUpdate)

## アトミックカウンター

Duration: 0:01:30

条件付き書き込みとは別に、アトミックカウンターというものが利用できます。この機能は、「UpdateItem」を利用して実現されます。インクリメントの他、デクリメントも可能です。

ただし、「UpdateItem」は失敗すると再試行する仕様であるため、二重実行される可能性があります。そのため、訪問者数のカウンタなど誤差が許容できるような場合にのみ使用し、厳密な数値が必要な場合には利用しないほうがよいです。

下記例の場合、「:incr」で指定した値を金額に加算していくものです。この更新処理は冪等ではありません。つまり、実行するたびに加算されていきます。

```sh
aws dynamodb update-item \
    --table-name ProductCatalog \
    --key '{"Id": { "N": "601" }}' \
    --update-expression "SET Price = Price + :incr" \
    --expression-attribute-values '{":incr":{"N":"5"}}' \
    --return-values UPDATED_NEW
```

[アトミックカウンター](https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/WorkingWithItems.html#WorkingWithItems.AtomicCounters)

## 設計

Duration: 0:01:30

リレーショナルデータベースと比べると様々な相違点があります。それらを考慮した上で、適切な設計を行わないと、DynamoDB の能力を発揮できません。

ベストプラクティスのドキュメントを読み、 NoSQL に最適な設計をしましょう。

[DynamoDB を使用した設計とアーキテクチャの設計に関するベストプラクティス](https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/best-practices.html)
