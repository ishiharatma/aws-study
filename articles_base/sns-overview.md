# Amazon Simple Notification Service (SNS)<!-- omit in toc -->

![icon](/images/icons/64/Arch_Amazon-Simple-Notification-Service_64.png)

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

- [Amazon Simple Notification Service (SNS) とは](#amazon-simple-notification-service-sns-とは)
- [SQS とは違うの？](#sqs-とは違うの)
- [SNS 構成要素](#sns-構成要素)
  - [トピック](#トピック)
  - [パブリッシュ](#パブリッシュ)
  - [サブスクリプション](#サブスクリプション)
- [サブスクリプションに E メールを登録した場合](#サブスクリプションに-e-メールを登録した場合)
- [サブスクリプションフィルター](#サブスクリプションフィルター)
- [デッドレターキュー](#デッドレターキュー)
- [暗号化](#暗号化)
- [📖 まとめ](#-まとめ)

## Amazon Simple Notification Service (SNS) とは

<!-- Duration: 0:48:02 -->

A2A および A2P メッセージング用のフルマネージド Pub/Sub サービスです。

- Pub / Sub メッセージング
  - メッセージを配信する側（パブリッシャー）とメッセージの受信者（サブスクライバー）が非同期でメッセージをやり取りできるようになります。

【AWS Black Belt Online Seminar】[Amazon Simple Notification Service (SNS)(YouTube)](https://www.youtube.com/watch?v=bPCjOG_jQlc)(48:02)

![sns](/images/sns/blackbelt-sns-320.jpg)

[SNS サービス概要](https://aws.amazon.com/jp/sns/)

[SNS ドキュメント](https://docs.aws.amazon.com/ja_jp/sns/?id=docs_gateway)

[SNS よくある質問](https://aws.amazon.com/jp/sns/faqs/)

[SNS の料金](https://aws.amazon.com/jp/sns/pricing/)

## SQS とは違うの？

<!-- Duration: 0:00:10 -->

SQS は名前に Q (Queue) とあるように、キューイングサービスです。受け取り側はキューをある間隔でポーリングして監視したり、好きなタイミングで一気に取得したりすることができます。（プル式）

SNS はメッセージングサービスで、メッセージが配信されたら受信者へ送信するプッシュ式です。イベント駆動アーキテクチャを構築できます。

## SNS 構成要素

<!-- Duration: 0:01:00 -->

- トピック
- パブリッシュ
- サブスクリプション

### トピック

通信チャネルとして機能する論理アクセスポイントです。

- FIFO トピック
  - メッセージがトピックに発行されるのとまったく同じ順序で配信されます。
  - 配信メッセージが重複しません。
  - Amazon SQS FIFO キューのみにメッセージを配信します。
  - [https://docs.aws.amazon.com/ja_jp/sns/latest/dg/fifo-topic-message-ordering.html]
- 標準
  - 順番は保証されません。
  - 重複して配信される可能性があります。

### パブリッシュ

メッセージをトピックに発行することです。

### サブスクリプション

トピックに発行されたメッセージの受信者（サブスクライバー）を複数登録できます。
サブスクライバーへの配信はデフォルトで 3 回再試行されます。配信に失敗したメッセージは、後述のデッドレターキューが設定されていない場合は破棄されます。

サブスクライバーに指定できるものは以下となります。

- Kinesis Data Firehose
- SQS
- Lambda
- HTTP / HTTPS
  - AWS Chatbot と連携する場合に エンドポイントとして `HTTPS` が利用されます。
- メール
- SMS
  - 指定した電話番号にメッセージを送信できます。
  - [https://docs.aws.amazon.com/ja_jp/sns/latest/dg/sns-mobile-phone-number-as-subscriber.html]
  - [SMS サンドボックス](https://docs.aws.amazon.com/ja_jp/sns/latest/dg/sns-sms-sandbox.html)
    - 追加済みの電話番号宛のみで、10 個まで。
    - [SMS サンドボックス外への移動](https://docs.aws.amazon.com/ja_jp/sns/latest/dg/sns-sms-sandbox-moving-to-production.html)
- プラットフォームアプリケーションのエンドポイント
  - モバイル PUSH 通知が出来ます
  - [https://docs.aws.amazon.com/ja_jp/sns/latest/dg/mobile-platform-endpoint.html]

## サブスクリプションに E メールを登録した場合

<!-- Duration: 0:01:00 -->

サブスクリプションに E メールを登録した場合、指定した E メールアドレスに [サブスクリプションの確認] メールが送信されます。

![sns-confirmation](/images/sns/sns-confirmation.png)

メール本文にある `Confirm subscription` の URL をクリックすることで、メッセージの受信を開始することができます。誤ってクリックしてしまった場合は、`click here to unsubscribe` をクリックします。

![sns-confirmed](/images/sns/sns-confirmed.png)

メール配信開始後に中止したい場合は、通知メール下部にある `please click or visit the link below to unsubscribe:` の URL をクリックすることで受信を解除できます。

![sns-unsubscribe](/images/sns/sns-unsubscribe.png)

このように簡単に受信の開始と解除ができるのですが、システム管理者用のメーリングリストなどを登録している場合、この手軽さが困るケースが出てきます。

例えば、

1. メーリングリストに登録されている受信者の一人が誤って URL をクリックしてしまい、通知が解除される。
2. それに気づかないまま放置する
3. それ以降通知が行われず障害を見逃してしまう

といったことが予想されます。
これを防ぐには、次の２つのうちいずれかで、受信開始操作を行うことで勝手に解除されないようにすることができます。

- AWS マネジメントコンソール
- AWS CLI

どちらの方法を選択する場合でもまずは、[サブスクリプションの確認] メールの`Confirm subscription` の URL をクリックではなく、右クリックして URL をコピーする必要があります。（ここでクリックしてしまった場合は、サブスクリプションの削除 → 作成からやり直しです。）

![sns-confirmation](/images/sns/sns-confirmation.png)

コピーした URL は次のような構造になっています。

```text
https://sns.ap-northeast-1.amazonaws.com/confirmation.html?TopicArn=arn:aws:sns:ap-northeast-1:123456789012:トピック名&Token=トークン&Endpoint=メールアドレス
```

- AWS マネジメントコンソールを利用する場合

  - SNS コンソールを開きます
  - サブスクリプションを開き、ステータスが [保留中の確認] を選択します
  - [サブスクリプションの確認] をクリックします
  - コピーした URL を貼り付けて、[サブスクリプションの確認] をクリックします

  ![sns-confirmation-console](/images/sns/sns-confirmation-console.png)

  - これで、メール本文から解除できない状態になります。マネジメントコンソールから実行すると、`ConfirmationWasAuthenticated` という属性が [true] になるので、サブスクリプションの解除ができなくなります。

- AWS CLI を利用する場合

  - コピーした URL のパラメータを分解すると、次の３つになります。

    - TopicArn
    - Token
    - Endpoint

  - 次のコマンドを実行します。`authenticate-on-unsubscribe true` を付けるのがポイントです。

    ```sh
    aws sns confirm-subscription \
    > --topic-arn <TopicArnのパラメータ値を指定します> \
    > --token <Tokenのパラメータ値を指定します> \
    > --authenticate-on-unsubscribe true \
    > --region <Topicのリージョンを指定します>

    {
        "SubscriptionArn": "arn:aws:sns:ap-northeast-1:123456789012:トピック名:12345678-1234-1234-1234-123456789012"
    }
    ```

解除するには、登録時と同じように AWS マネジメントコンソールか AWS CLI を使います。

## サブスクリプションフィルター

<!-- Duration: 0:01:00 -->

JSON で定義したポリシーでメッセージの配信を制御できます。

[https://docs.aws.amazon.com/ja_jp/sns/latest/dg/sns-subscription-filter-policies.html]

ポリシーのスコープは次の２つのどちらかを選択できます。

- メッセージ属性（デフォルト）
- メッセージ本文

メッセージ属性を選択する場合は、メッセージを SNS トピックに発行する際、`MessageAttributes` というフィールドを追加する必要があります。

MessageAttributes には 次のように Key-Value 形式で登録します。

```json
"MessageAttributes": {
  "key1": {
      "Type": "String",
      "Value": "\"Value1\""
  },
  "key2": {
      "Type": "String",
      "Value": "[\"Value2\", \"Value3\"]"
  }
}
```

例えば、デベロッパーガイドにあるメッセージ属性を指定した場合にメッセージを拒否するサブスクリプションフィルターは以下のようになります。

```json
   "MessageAttributes": {
      "customer_interests": {
         "Type": "String.Array",
         "Value": "[\"soccer\", \"rugby\", \"hockey\"]"
      },
      "store": {
         "Type": "String",
         "Value":"example_corp"
      },
      "event": {
         "Type": "String",
         "Value": "order_placed"
      },
      "price_usd": {
         "Type": "Number",
         "Value": "210.75"
      }
   }
```

```json
{
  "store": ["example_corp"],
  "event": ["order_cancelled"],
  "encrypted": [false],
  "customer_interests": ["basketball", "baseball"]
}
```

この例の場合、"MessageAttributes" 内に "encrypted" プロパティが存在していないため、その他の値に関わらず拒否されるポリシーとなっています。
存在しないポリシーを指定して、一時的に配信を止める場合に利用することもできます。

## デッドレターキュー

<!-- Duration: 0:01:00 -->

メッセージの受信者に正常に配信できなかった場合に格納する SQS のキューを指定できます。
これにより、エラーの分析や、再処理などを行うことができます。

[https://docs.aws.amazon.com/ja_jp/sns/latest/dg/sns-dead-letter-queues.html]

## 暗号化

<!-- Duration: 0:01:00 -->

AWS KMS を利用して、トピック内のメッセージを暗号化することができます（サーバ側の暗号化（SSE））
暗号化されたメッセージは、配信時に自動的に復号されて配信されます。

指定できるキーは、デフォルトの `alias/aws/sns` と 作成済みの CMK を指定できます。

ただし、暗号化を行う場合は使用する暗号化キーに対する「kms:Decrypt」と「kms:GenerateDataKey」を適切に許可することが必要です。
これを行わなかった場合に、次のように配信されないことがあります。

- [CloudWatch アラームトリガーの SNS 通知を受信しなかったのはなぜですか?](https://repost.aws/ja/knowledge-center/cloudwatch-receive-sns-for-alarm-trigger)
- [【Amazon EventBridge】ルールは実行されるが、Amazon SNS トピックにいずれのメッセージもパブリッシュされない](https://docs.aws.amazon.com/ja_jp/eventbridge/latest/userguide/eb-troubleshooting.html#eb-no-messages-published-sns)

## 📖 まとめ

![sns-overview](/images/all/sns.png)