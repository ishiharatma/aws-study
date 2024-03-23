---
title: "【実例】Amazon API Gateway を S3 プロキシにして簡易スタブ API でテスト効率化！" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: true
---

# 【実例】Amazon API Gateway を S3 プロキシにして簡易スタブ API でテスト効率化！<!-- omit in toc -->

## ☘️ スタブ作成の経緯<!-- omit in toc -->

ある LMS（Learning Management System）と学習データを連携しているシステムで、大量の学習データをテストすることが必要になりました。
データ連携している LMS から提供されている API では、ユーザーは増やせても、学習履歴やテストの成績データなどを捏造・・大量生成することができませんでした。

なるべく簡単に、素早く、開発者が簡単な手順でデータを入れ替えできる必要がありました。

そこで、S3 にレスポンスの JSON ファイルを格納して、それをそのまま返却できるように API Gateway を S3 のプロキシとする方法を採用しました。
これによって、S3 上のレスポンス JSON ファイルを変更すれば簡単にテストデータを返すことができます。

公式な手順は以下になります。

[チュートリアル: API Gateway で REST API を Amazon S3 のプロキシとして作成する](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/integrating-api-with-aws-services-s3.html)

## 👀 Contents<!-- omit in toc -->

- [全体構成](#全体構成)
- [手順](#手順)
  - [1. S3 バケットを作成します](#1-s3-バケットを作成します)
  - [2. IAM ロールを作成します](#2-iam-ロールを作成します)
  - [3. API リソースを作成します](#3-api-リソースを作成します)
    - [3.1. リソースを作成します](#31-リソースを作成します)
    - [3.2. メソッドを作成します](#32-メソッドを作成します)
      - [3.2.1. アクションタイプ](#321-アクションタイプ)
      - [3.2.2. パスオーバーライド](#322-パスオーバーライド)
      - [3.2.3. 実行ロール](#323-実行ロール)
    - [3.3. 統合リクエストの URL パスパラメータ](#33-統合リクエストの-url-パスパラメータ)
  - [4. 動作確認](#4-動作確認)
- [【おまけ】レスポンスの形式を変更したいとき](#おまけレスポンスの形式を変更したいとき)
  - [入力データ](#入力データ)
  - [例１．必要な情報だけに絞りたい](#例１必要な情報だけに絞りたい)
  - [例２．foreach を利用して要素を順番に ①](#例２foreach-を利用して要素を順番に-)
  - [例３．foreach を利用して要素を順番に ②](#例３foreach-を利用して要素を順番に-)
  - [例４．レイアウトを変更したい](#例４レイアウトを変更したい)
  - [例５．件数などの情報を付加したい](#例５件数などの情報を付加したい)
  - [例６．レスポンスヘッダーに件数を追加したい](#例６レスポンスヘッダーに件数を追加したい)
  - [例７．特定の項目だけ書き換えたい](#例７特定の項目だけ書き換えたい)
  - [例８．要素を追加したい](#例８要素を追加したい)
  - [例９．整数を計算したい](#例９整数を計算したい)
  - [例１０．小数を計算したい](#例１０小数を計算したい)
  - [例１１．小数を計算したい(丸め誤差対応できる？)](#例１１小数を計算したい丸め誤差対応できる)

## 全体構成

PetStore の API を例にして説明します。

![overview](/images/apigw-s3/apige-s3-overview.png)

API のメソッドが特定のバケット内の対応する result.json を読み込んでレスポンスとして返却します。

GET も POST も S3 に格納された結果をそのまま返すようにします。

## 手順

主な手順は次のとおりです。

1. S3 バケット作成
2. IAM ロール作成
3. API リソース作成
4. 動作確認

### 1. S3 バケットを作成します

レスポンス結果を格納するためのバケットを作成します。

S3 に配置する API リクエストに対するレスポンス JSON ファイル名は、メソッドタイプを付与した `get_result.json` と `post_result.json` で固定にします。

PetStore の API を例にすると次のような S3 構成になることを想定しています。

```text
S3
  ├ [pets]
      ├ get_result.json
  ├ [pet]
      ├ post_result.json
      ├ put_result.json
      ├ [{petId}]
          ├ get_result.json
      ├ [findByStatus]
          ├ get_result.json
      ├ [findByTags]
          ├ get_result.json
  ├ [store]
      ├ [inventory]
          ├ get_result.json
      ├ [order]
          ├ post_result.json
  ├ [user]
      ├ [login]
          ├ get_result.json
      ├ [logout]
          ├ get_result.json

```

### 2. IAM ロールを作成します

S3 にアクセスできるように IAM ロールを作成します。

信頼されたエンティティタイプでは、「AWS のサービス」を選択し、は `API Gateway` を指定します。

![apigw-s3_05](/images/apigw-s3/apigw-s3_05.png)

`AmazonAPIGatewayPushToCloudWatchLogs` となっている状態で、次に進みます。

![apigw-s3_04](/images/apigw-s3/apigw-s3_04.png)

ロール名を入力して、「ロールを作成」を行います。

![apigw-s3_06](/images/apigw-s3/apigw-s3_06.png)

作成されたロールを開き、「許可」タブから、「許可を追加＞インラインポリシーを作成」を選択します。

![apigw-s3_07](/images/apigw-s3/apigw-s3_07.png)

インラインポリシーは以下のようにします。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::バケット名/*"
    }
  ]
}
```

ロールの ARN をメモしておくか、ブラウザのタブを閉じずに残したままにします。

### 3. API リソースを作成します

IAM ロールの ARN はあとで必要になるので、APIGateway を別のタブで開きます。

「API を作成」をクリックし、REST API を「構築」します。

![apigw-s3_08](/images/apigw-s3/apigw-s3_08.png)

「新しい API」を選択して、API の名前（例：api-stub）を入力し、「API を作成」をクリックします。

![apigw-s3_09](/images/apigw-s3/apigw-s3_09.png)

#### 3.1. リソースを作成します

リソース名を `{folder}` として作成します。
さらにその下の階層に `{item}` も作成します。
最終的には次のような構成になります。

![apigw-s3_13](/images/apigw-s3/apigw-s3_13.png)

#### 3.2. メソッドを作成します

`{folder}`と`{item}`のそれぞれに、`GET`と`POST`のメソッドを作成します。その他、必要に応じて `PUT` なども作成します。

![apigw-s3_24](/images/apigw-s3/apigw-s3_24.png)

- GET メソッド

メソッドタイプに`GET`を指定し、HTTP メソッドも`GET`とします。

![apigw-s3_11](/images/apigw-s3/apigw-s3_11.png)

この後、アクションタイプを設定するのですが、GET も POST も共通なので、後述します。

- POST メソッド

今回は、POST メソッドも S3 にあるファイルの内容を取得するため、メソッドタイプは`POST`ですが、S3 に
アクセスするときの HTTP メソッドは`GET`を指定します。

![apigw-s3_15](/images/apigw-s3/apigw-s3_15.png)

この後、アクションタイプを設定するのですが、GET も POST も共通なので、後述します。

##### 3.2.1. アクションタイプ

アクションタイプは、「パスオーバーライドを使用」を選択します。デフォルト選択の `アクション名を使用` のままにしていると、後で実施するテストでエラーになります。

![apigw-s3_14a](/images/apigw-s3/apigw-s3_14a.png)

##### 3.2.2. パスオーバーライド

パスオーバーライドには、次のように設定します。

| パス             | メソッドタイプ | パスオーバーライド                             |
| ---------------- | -------------- | ---------------------------------------------- |
| /{folder}        | GET            | S3 バケット名/{folder}/get_result.json         |
| /{folder}        | POST           | S3 バケット名/{folder}/post_result.json        |
| /{folder}/{item} | GET            | S3 バケット名/{folder}/{item}/get_result.json  |
| /{folder}/{item} | POST           | S3 バケット名/{folder}/{item}/post_result.json |

- GET メソッド
  ![apigw-s3_14b](/images/apigw-s3/apigw-s3_14b.png)
- POST メソッド
  ![apigw-s3_18](/images/apigw-s3/apigw-s3_18.png)

##### 3.2.3. 実行ロール

実行ロールは、「2. IAM ロール」で作成したロールの ARN を貼り付けます。
![apigw-s3_14c](/images/apigw-s3/apigw-s3_14c.png)

#### 3.3. 統合リクエストの URL パスパラメータ

メソッドの作成後、作成したメソッドを選択し、「統合リクエスト」タブを開き、「編集」をクリックします。
画面をスクロールし、「URL パスパラメータ」を展開します。

![apigw-s3_19](/images/apigw-s3/apigw-s3_19.png)

「パスパラメータの追加」をクリックし、先ほどのパスオーバーライドで使用した `folder` という部分を URL パスパラメータとマッピングします。

定義は次のようにします。`item` についてはパスが `/{folder}/{item}` のメソッドの場合のみ追加します。

| 名前   | マッピング先               | キャッシュ |
| ------ | -------------------------- | ---------- |
| folder | method.request.path.folder | 未選択     |
| item   | method.request.path.item   | 未選択     |

### 4. 動作確認

テストタブで動作確認を行います。

`pets` の API をテストします。

![apigw-s3_01](/images/apigw-s3/apigw-s3_20.png)

「テスト」をクリックすると、正しく設定できていればレスポンスが返ってきます。

![apigw-s3_21](/images/apigw-s3/apigw-s3_21.png)

もう一つ、`pet/findByStatus`もテストしてみます。

![apigw-s3_25](/images/apigw-s3/apigw-s3_25.png)

正しくレスポンスが返ってきました。

![apigw-s3_01](/images/apigw-s3/apigw-s3_01.png)

## 【おまけ】レスポンスの形式を変更したいとき

統合レスポンスのマッピングテンプレートで編集することができます。
マッピングテンプレートについてついては、ドキュメントの[マッピングテンプレートについて](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/apigateway-override-request-response-parameters.html)を参照してください。

[Velocity Template Language (VTL)](https://velocity.apache.org/engine/devel/vtl-reference.html) で表現されるスクリプトです。

よく使うものは次のとおりです。

- #if #elif #else #end
  - 分岐に使用します
  - `#if($foo == $bar)it's true!#{else}it's not!#end`
- #set
  - 変数に代入するときに使用します
  - `#set($body = $input.path('$'))`
- #foreach

  - 要素を順番に処理する場合に使用します
  - `#foreach($item in $body)　～ #end` と書きます
  - `#if($foreach.hasNext),#end` とすると次が存在するときにカンマを付与することができます
  - `#break` で抜けることができます
  - `$foreach.index` で現在処理中要素のインデックスが取得できます
  - その他
    - $foreach.count ⇒1 から始まるカウンタ
    - $foreach.first ⇒ 最初だったら true
    - $foreach.last ⇒ 最後だったら true
    - $foreach.stop()

- \## foo bar
  - 単一行コメント
- \#_ ～ _#
  - 複数行コメント
- parseInt

  - 文字列を数値に変換する。ただし事前に整数を１つ宣言する必要があります

  ```text
  #set($Integer = 0)
  #set($result = $Integer.parseInt($NumberString))
  ```

### 入力データ

これ以降、次のような入力データに対して編集する例を説明します。

```json
[
  {
    "id": 1,
    "type": "dog",
    "price": 249.99
  },
  {
    "id": 2,
    "type": "cat",
    "price": 124.99
  },
  {
    "id": 3,
    "type": "fish",
    "price": 0.99
  }
]
```

### 例１．必要な情報だけに絞りたい

レスポンスに id 列は不要なので除去します。

```text
#set($body = $input.path('$'))
[
#foreach($item in $body)
  {
    "type": "$item.type",
    "price": $item.price
  }#if($foreach.hasNext),#end
#end
]
```

結果は次のようになります。

```json
[
  {
    "type": "dog",
    "price": 249.99
  },
  {
    "type": "cat",
    "price": 124.99
  },
  {
    "type": "fish",
    "price": 0.99
  }
]
```

### 例２．foreach を利用して要素を順番に ①

foreach を利用することで、要素を順番に処理することができます。

```text
#set($body = $input.path('$'))
[
#foreach($item in $body) ## ① 各レコードを順番に処理します
  {
    #foreach($key in $item.keySet()) ## ② 各レコードの要素を順番に処理します
        "$key" : "$item.get($key)"
    #if($foreach.hasNext),#end ## ③ 次の要素があったらカンマを付けます
    #end
  }#if($foreach.hasNext),#end ## ③ 次のレコードがあったらカンマを付けます
#end
]
```

結果は次のようになります。
この方法だと、一律ダブルクォーテーションでくくるのでもともと数値だった項目も括られます。

```json
[
  {
    "id": "1",
    "type": "dog",
    "price": "249.99"
  },
  {
    "id": "2",
    "type": "cat",
    "price": "124.99"
  },
  {
    "id": "3",
    "type": "fish",
    "price": "0.99"
  }
]
```

### 例３．foreach を利用して要素を順番に ②

先ほどの例から、id と price はダブルクォーテーションで括らないようにしたいと思います。

```text
#set($body = $input.path('$'))
[
#foreach($item in $body)
  {
    #foreach($key in $item.keySet())
        "$key" :
        #if ($key=="id" or $key=="price") ## ① キーが id か price だったら
        $item.get($key)
        #else ## ② それ以外は括ります
        "$item.get($key)"
        #end
    #if($foreach.hasNext),#end
    #end
  }#if($foreach.hasNext),#end
#end
]
```

結果は次のようになります。

```json
[
  {
    "id": 1,
    "type": "dog",
    "price": 249.99
  },
  {
    "id": 2,
    "type": "cat",
    "price": 124.99
  },
  {
    "id": 3,
    "type": "fish",
    "price": 0.99
  }
]
```

### 例４．レイアウトを変更したい

データは、`results` にまとめます。

```text
#set($body = $input.path('$'))
{
  "results":[
#foreach($item in $body)
  {
    "id": $item.id,
    "type": "$item.type",
    "price": $item.price
  }#if($foreach.hasNext),#end
#end
  ]
}
```

結果は次のようになります。

```json
{
  "results": [
    {
      "id": 1,
      "type": "dog",
      "price": 249.99
    },
    {
      "id": 2,
      "type": "cat",
      "price": 124.99
    },
    {
      "id": 3,
      "type": "fish",
      "price": 0.99
    }
  ]
}
```

### 例５．件数などの情報を付加したい

`meta` で情報を追加します。

```text
#set($body = $input.path('$'))
#set($results = $body.size())
#set($result_id = $context.requestId)
#set($timestamp = $context.requestTimeEpoch)
{
  "results":[
#foreach($item in $body)
  {
    "id": $item.id,
    "type": "$item.type",
    "price": $item.price
  }#if($foreach.hasNext),#end
#end
  ],
    "meta": {
        "total": $results,
        "timestamp": $timestamp,
        "result_id": "$result_id"
    }
}
```

結果は次のようになります。

```json
{
  "results": [
    {
      "id": 1,
      "type": "dog",
      "price": 249.99
    },
    {
      "id": 2,
      "type": "cat",
      "price": 124.99
    },
    {
      "id": 3,
      "type": "fish",
      "price": 0.99
    }
  ],
  "meta": {
    "total": 3,
    "timestamp": 1706860280008,
    "result_id": "9f4093ae-bee2-4c60-a677-1a0b43d1b473"
  }
}
```

### 例６．レスポンスヘッダーに件数を追加したい

`$context.responseOverride.header.count` を設定することで追加できます。

```text
#set($body = $input.path('$'))
#set($results = $body.size())
#set($context.responseOverride.header.count = "$results")
```

結果は次のようになります。

```json
{
  "Content-Type": "application/json",
  "X-Amzn-Trace-Id": "Root=1-65bcaa96-e526bc0acbec62008db0b328",
  "count": "3"
}
```

### 例７．特定の項目だけ書き換えたい

```text
#set($body = $input.path('$'))
#foreach($item in $body)
  #set($item.id="ZZZ$item.id")
#end
$input.json('$')
```

参照渡しになっているので、$input も書き換わっています。

```json
[
  {
    "id": "ZZZ1",
    "type": "dog",
    "price": 249.99
  },
  {
    "id": "ZZZ2",
    "type": "cat",
    "price": 124.99
  },
  {
    "id": "ZZZ3",
    "type": "fish",
    "price": 0.99
  }
]
```

### 例８．要素を追加したい

```text
#set($body = $input.path('$'))
#foreach($item in $body)
  #set($item.id2="ZZZ$item.id")
#end
$input.json('$')
```

参照渡しになっているので、$input も書き換わっています。

```json
[
  {
    "id": 1,
    "type": "dog",
    "price": 249.99,
    "id": "ZZZ1"
  },
  {
    "id": 2,
    "type": "cat",
    "price": 124.99,
    "id": "ZZZ2"
  },
  {
    "id": 3,
    "type": "fish",
    "price": 0.99,
    "id": "ZZZ3"
  }
]
```

### 例９．整数を計算したい

```text
#set($body = $input.path('$'))
#foreach($item in $body)
  #set($item.id=$item.id*2)
#end
$input.json('$')
```

結果は次のようになります。
id = 1,2,3 が id = 2,4,6 の 2 倍になっています。

```json
[
  {
    "id": 2,
    "type": "dog",
    "price": 249.99
  },
  {
    "id": 4,
    "type": "cat",
    "price": 124.99
  },
  {
    "id": 6,
    "type": "fish",
    "price": 0.99
  }
]
```

### 例１０．小数を計算したい

整数 × 整数の計算は単純にできるので、小数を計算します。
price を 1.1 倍に変更しましょう。

```text
#set($body = $input.path('$'))
#foreach($item in $body)
  #set($item.price=$item.price * 1.1)
#end
$input.json('$')
```

単純に計算すると、丸め誤差が発生しています。
id=1 の price が 249.99 \* 1.1 = 274.989 になっていません。

```json
[
  {
    "id": 1,
    "type": "dog",
    "price": 274.98900000000003
  },
  {
    "id": 2,
    "type": "cat",
    "price": 137.489
  },
  {
    "id": 3,
    "type": "fish",
    "price": 1.089
  }
]
```

### 例１１．小数を計算したい(丸め誤差対応できる？)

// TODO
こんな感じで出来るのかと思いましたが、だめでした。

```text
#set($body = $input.path('$'))
#foreach($item in $body)
  #set($originalPrice = $item.price)
  #set($decimalMultiplier = 1.1)
  #set($result = $decimalMultiplier.multiply($originalPrice)) ## ※ ここがNG
  #set($item.price = $result.doubleValue())
#end
$input.json('$')
```

上記、”※”のところで計算できていないので、price がなくなっています。

```json
[
  {
    "id": 1,
    "type": "dog",
    "price": ""
  },
  {
    "id": 2,
    "type": "cat",
    "price": ""
  },
  {
    "id": 3,
    "type": "fish",
    "price": ""
  }
]
```
