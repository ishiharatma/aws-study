---
title: "【初心者向け】Amazon Simple Queue Service (SQS) 入門！完全ガイド" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: true
emoji : "🎱"
---

# Amazon Simple Queue Service (SQS)<!-- omit in toc -->

![icon](/images/icons/64/Arch_Amazon-Simple-Queue-Service_64.png)

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

- [SQS とは](#sqs-とは)
- [SQS 構成要素](#sqs-構成要素)
- [キュータイプ](#キュータイプ)
- [メッセージグループ ID](#メッセージグループ-id)
- [メッセージ重複排除](#メッセージ重複排除)
- [可視性タイムアウト](#可視性タイムアウト)
- [配信遅延（遅延キュー）](#配信遅延遅延キュー)
  - [メッセージタイマー](#メッセージタイマー)
- [メッセージ受信待機時間](#メッセージ受信待機時間)
  - [ショートポーリングとロングポーリング](#ショートポーリングとロングポーリング)
- [メッセージ保持期間](#メッセージ保持期間)
- [最大メッセージサイズ](#最大メッセージサイズ)
- [デッドレターキュー](#デッドレターキュー)
- [暗号化](#暗号化)
- [📖 まとめ](#-まとめ)

## SQS とは

<!-- Duration: 0:58:54 -->

フルマネージドのキューイングサービスです。

【AWS Black Belt Online Seminar】[Amazon Simple Queue Service(YouTube)](https://www.youtube.com/watch?v=avfc0gQ7X0A)(58:54)

![sqs](/images/sqs/blackbelt-sqs-320.jpg)

[SQS サービス概要](https://aws.amazon.com/jp/sqs/)

[SQS ドキュメント](https://docs.aws.amazon.com/ja_jp/sqs/?id=docs_gateway)

[SQS よくある質問](https://aws.amazon.com/jp/sqs/faqs/)

[SQS の料金](https://aws.amazon.com/jp/sqs/pricing/)

## SQS 構成要素

<!-- Duration: 0:01:00 -->

- プロデューサー（Producer）
  - メッセージを SQS に送信するアプリケーション
- コンシューマー（Consumer）
  - SQS からメッセージを取り出すアプリケーション
  - Pull 型（コンシューマー側から一定間隔でデータ有無を確認する）
- メッセージ（Message）
  - 送受信されるデータ
- キュー（Queue）
  - メッセージをためておく場所

![sqs-queue](/images/sqs/sqs-queue.png)

## キュータイプ

<!-- Duration: 0:01:00 -->

- 標準キュー
- FIFO キュー

違いは、[アプリケーション間連携を疎結合で実現。「Amazon SQS」をグラレコで解説](https://aws.amazon.com/jp/builders-flash/202105/awsgeek-sqs/?awsf.filter-name=*all) の図が分かりやすいです。

![sns-queuetype](/images/sqs/sqs-queuetype.png)

## メッセージグループ ID

<!-- Duration: 0:01:00 -->

[メッセージグループ ID の使用](https://docs.aws.amazon.comja_jp/AWSSimpleQueueService/latest/SQSDeveloperGuide/using-messagegroupid-property.html)

メッセージ送信時に `MessageGroupId` を指定することで、メッセージをグループ化できます。

FIFO キューでは、グループ単位で順序が保証されますが、異なるグループ間では順序は守られません。

```sh
aws sqs send-message \
    --queue-url ${QUEUE_URL} \
    --message-body '{"message": "test"}' \
    --message-group-id Group1 \
```

## メッセージ重複排除

<!-- Duration: 0:01:00 -->

[メッセージ重複排除 ID の使用](https://docs.aws.amazon.com/ja_jp/AWSSimpleQueueService/latest/SQSDeveloperGuide/using-messagededuplicationid-property.html)

FIFO キューで指定することで、`5分間` は同一の重複排除 ID
ID のメッセージが受け付けられないようになるという機能です。

```sh
aws sqs send-message \
    --queue-url ${QUEUE_URL} \
    --message-body '{"message": "test"}' \
    --message-group-id Group1 \
    --message-deduplication-id "Deduplication${i}"
```

キューの属性で、`コンテンツに基づく重複排除` のオプションを ON にした場合は、重複排除 ID の事前指定は不要になります。

![sqs-duplicate-contents](/images/sqs/sqs-duplicate-contents.png)

## 可視性タイムアウト

<!-- Duration: 0:01:00 -->

[可視性タイムアウト](https://docs.aws.amazon.com/ja_jp/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html)

![sqs-visibilitytimeout](/images/sqs/sqs-visibilitytimeout.png)

SQS ではメッセージを取得しても自動で削除されることはありません。コンシューマー側が処理済みとして削除するか、メッセージの保持期間が過ぎて削除されるかです。
複数のコンシューマーがメッセージを読み取った場合、重複して処理されてしまう可能性があるため、可視性タイムアウトという処理中のメッセージが他のコンシューマーからは取得できなくする機能があります。0 秒から 12 時間が指定できます。デフォルト値は 30 秒です。
コンシューマーは、可視性タイムアウトの時間に取得したメッセージを削除する必要があります。可視性タイムアウトの時間が過ぎると、メッセージを削除できなくなり、他のコンシューマーが取得できる状態になります。

メッセージの処理時間が不明な場合、可視性タイムアウトを 1 分毎に 2 分間延長することもできます。
[タイムリーな方法でのメッセージの処理](https://docs.aws.amazon.com/ja_jp/AWSSimpleQueueService/latest/SQSDeveloperGuide/working-with-messages.html#processing-messages-timely-manner)
[メッセージの可視性タイムアウトの変更](https://docs.aws.amazon.com/ja_jp/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html#changing-message-visibility-timeout)

標準キューの場合は、メッセージの順序保証がないキューのため、他のコンシューマーがアクセスした場合、次のキューを取り出すことができます。
FIFO キューの場合は、メッセージの順序が重要であるため、可視性タイムアウト時間が過ぎるか、メッセージが削除されるまで、次のキューを取得することが出来ません。ただし、他のメッセージグループからはメッセージを取得することが出来ます。

## 配信遅延（遅延キュー）

<!-- Duration: 0:01:30 -->

[遅延キュー](https://docs.aws.amazon.com/ja_jp/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-delay-queues.html)

プロデューサー側からキューに新しいメッセージが送信された後に、指定した時間が経過してからコンシューマー側にメッセージが表示されるようにする設定です。0 秒から 15 分までの間を指定できます。

![sqs-delay](/images/sqs/sqs-delay.png)

### メッセージタイマー

[メッセージタイマー](https://docs.aws.amazon.com/ja_jp/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-message-timers.html)

キュー全体に指定する遅延キュー以外に、メッセージ個別に設定できるメッセージタイマーという機能があります。遅延キューと同時に指定された場合、メッセージに設定されたメッセージタイマーのほうが優先されます。0 秒から 15 分までの間を指定できます。

```sh
aws sqs send-message \
    --queue-url ${QUEUE_URL} \
    --message-body '{"message": "test"}' \
    --delay-seconds 900
```

## メッセージ受信待機時間

<!-- Duration: 0:01:30 -->

メッセージ取得までの待機時間です。0 秒から 20 秒まで指定することができます。0 秒を指定すると、ショートポーリングになります。

![sqs-waitseconts](/images/sqs/sqs-waitseconts.png)

### ショートポーリングとロングポーリング

[ショートポーリングとロングポーリング](https://docs.aws.amazon.com/ja_jp/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html)

- ロングポーリング
  - 通常はこちらを利用する。単一のキューをポーリングする多くのケースで有効。
  - メッセージが空だった場合、最大 20 秒の間待機してメッセージの受領を待つ。それでも空だった場合に「空」応答を返す。
  - ショートポーリングに比べて API コール数が減る（コストダウン）
- ショートポーリング
  - メッセージがなかったら、即座に「空」応答を返す。
  - 主に、複数のキューをポーリングする場合に即時空応答が返ってくるほうが良い場合に。
  - ロングポーリングに比べて API コール数が増える（コストアップ）

## メッセージ保持期間

<!-- Duration: 0:01:00 -->

キューに登録されたメッセージは明示的に削除処理を行われない限りデフォルトで 4 日間保持、1 分から 14 日設定できます。

![sqs-message-retention](/images/sqs/sqs-message-retention.png)

コンシューマーアプリケーションに障害があった場合、この保持期間内に復旧できれば、キューに貯まったメッセージを処理することができます。しかし、期間を過ぎてしまうと処理することが出来なくなってしまうので注意が必要です。

## 最大メッセージサイズ

<!-- Duration: 0:01:00 -->

キューのメッセージサイズで、1KB から 256KB の範囲を指定できます。デフォルト値は 256 KB です。

![sqs-maxsize](/images/sqs/sqs-maxsize.png)

256 KB を超えるメッセージを送信したい場合、「Java 用 SQS 拡張ライブラリ」と「S3」を利用します。これによって「2 GB」までのメッセージを扱えるようになります。

[Amazon S3 を使用した大量の Amazon SQS メッセージの管理](https://docs.aws.amazon.com/ja_jp/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-s3-messages.html)

## デッドレターキュー

<!-- Duration: 0:01:00 -->

[デッドレターキュー](https://docs.aws.amazon.com/ja_jp/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html)

メッセージの受信者に正常に配信できなかった場合に格納する SQS のキューを指定できます。
これにより、エラーの分析や、再処理などを行うことができます。

![sqs-dlq](/images/sqs/sqs-dlq.png)

## 暗号化

<!-- Duration: 0:01:00 -->

AWS KMS を利用して、トピック内のメッセージを暗号化することができます（サーバ側の暗号化（SSE））
暗号化されたメッセージは、配信時に自動的に復号されて配信されます。

指定できるキーは、デフォルトの `alias/aws/sqs` と 作成済みの CMK を指定できます。

![sqs-sse](/images/sqs/sqs-sse.png)

## 📖 まとめ

![sqs-overview](/images/all/sqs.png)