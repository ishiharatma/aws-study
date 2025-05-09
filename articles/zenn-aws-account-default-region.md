---
title: "あれ？リソースがなくなっている！？とならないためにデフォルトリージョンを" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: true
---

<!--# デフォルトリージョンを東京にする<!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

※ 過去に記載したナレッジを一か所に集約する目的の記事投稿の場合もあります。

## 👀 Contents<!-- omit in toc -->

- [どういうときに便利か？](#どういうときに便利か)
- [URLで指定する場合](#urlで指定する場合)
- [マネジメントコンソールで設定する場合](#マネジメントコンソールで設定する場合)


## どういうときに便利か？

AWS マネジメントコンソールにログインしたとき、違うリージョンになっていることに気付かず「あれ？！インスタンスがない！」っていうことがあると思います。

慣れていても一瞬焦ったりします。そういう精神的なダメージを負わないためにも、よく使うリージョンがデフォルトになっていると便利です。

そのようなときに便利な方法です。

## URLで指定する場合

マネジメントコンソールのログインURLにパラメータを指定したものをお気に入りに登録しておくことで、初期リージョンを設定できます。

```
https://console.aws.amazon.com/console/home?ap-northeast-1
```

## マネジメントコンソールで設定する場合

アクセスするURLにリージョン指定し忘れてしまった場合でも「東京リージョン」にしたい！というときに実施する方法です。

[入門ガイド>リージョンを選択する](https://docs.aws.amazon.com/ja_jp/awsconsolehelpdocs/latest/gsg/select-region.html)

AWS マネジメントコンソールから「設定」を開きます。

![image.png](/images/aws-account-default-region/62fd8b7034f3d3003ac24f59.png)

右上の「編集」ボタンをクリックします。
![image.png](/images/aws-account-default-region/62fd8bcc34f3d3003ac24f5d.png)

「デフォルトのリージョン」は初期状態で「最後に使用したリージョン」となっています。
![image.png](/images/aws-account-default-region/62fd8ba534f3d3003ac24f5b.png)

ここを「東京リージョン」に変更し、「設定を保存」します。
![image.png](/images/aws-account-default-region/62fd8bb534f3d3003ac24f5c.png)

これで、デフォルトのリージョンが「東京」になります。
