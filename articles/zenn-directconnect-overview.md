---
title: "【初心者向け】AWS Direct Connect について改めて整理してみた" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: false
---

# AWS Direct Connect

## ☘️ はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents

Duration: 00:01:00

- [AWS Direct Connect](#aws-direct-connect)
  - [☘️ はじめに](#️-はじめに)
  - [👀 Contents](#-contents)
  - [AWS Direct Connect とは](#aws-direct-connect-とは)
  - [AWS への接続方法](#aws-への接続方法)
  - [Direct Connect を使うメリットとデメリット](#direct-connect-を使うメリットとデメリット)
  - [APN パートナーと契約するメリット](#apn-パートナーと契約するメリット)
  - [利用開始方法](#利用開始方法)
  - [接続方法](#接続方法)
  - [](#)
  - [📖 まとめ](#-まとめ)

## AWS Direct Connect とは

AWS Direct Connect は、企業や組織が AWS クラウドへの高速かつ安定したプライベートネットワーク接続を確立するためのサービスです。通常のインターネット接続よりも安定性が高く、大容量のデータ転送が可能なため、企業のクリティカルなワークロードやデータの移動に適しています。

【AWS Black Belt Online Seminar】[AWS Direct Connect(YouTube)](https://youtu.be/mEtluVrgXlk)(1:00:21)

![blackbelt-directconnect](/images/blackbelt/blackbelt-directconnect-320.jpg)

[AWS Direct Connect サービス概要](https://aws.amazon.com/jp/directconnect/)

[AWS Direct Connect ドキュメント](https://docs.aws.amazon.com/ja_jp/directconnect/?icmpid=docs_homepage_networking)

[AWS Direct Connect よくある質問](https://aws.amazon.com/jp/directconnect/faqs/)

[AWS Direct Connect の料金](https://aws.amazon.com/jp/directconnect/pricing/)

## AWS への接続方法

Duration: 0:00:30

AWS へ接続するには主に次のような方法があります

- インターネット回線を使った接続
  - リモートアクセス VPN
    - [AWS Client VPN](https://docs.aws.amazon.com/ja_jp/vpn/latest/clientvpn-admin/what-is.html)
  - 拠点間 VPN 接続（仮想的な専用線）
    - [AWS Site-to-Site VPN](https://docs.aws.amazon.com/ja_jp/vpn/latest/s2svpn/VPC_VPN.html)
- 専用線接続
  - AWS Direct Connect

## Direct Connect を使うメリットとデメリット

Duration: 0:01:30

- メリット
  - インターネット回線を使用せず、専用のプライベートなネットワークで接続するためセキュリティが高い
  - 専用線のため帯域幅が確保され、安定した通信速度で接続できる
  - AWS からのデータ送信料金が VPN に比べて 50％ほど割安である
- デメリット
  - Direct Connect は、「①AWS <> ②Direct Connect ロケーション <> ③ ユーザー拠点」という接続になり、①-② 間は AWS が提供しますが、②-③ 間はユーザーが用意しなければならず、契約と初期設定のリードタイムがかかる。
  - 単一回線では AWS メンテナンス時に通信できなくなるので、回線の冗長化が必須となる。

## APN パートナーと契約するメリット

AWS が提供するのは Direct Connect ロケーション内の接続ポイントまでなので、それ以外については利用者が準備しなければなりません。

主に次のようなことを検討・準備しなければならないため、負担が大きいです。

- 回線を引き込むためのデータセンター契約
- 事業者の比較との回線契約
- 工事手続
- 拠点への接続機器導入
- 各種支払手続き
- など・・・

APN パートナーと契約すると、これらの対応が不要になり、回線や機器の保守を一任でき、短期間で構築できるようになります。

## 利用開始方法

- AWS に 直接申し込む
  - 申し込みとそれに伴うやりとり、自拠点のネットワーク機器設定など全て実施することになる
  - 選択プランが少なくコストが高額になる
- APN パートナーと契約する
  - AWS に直接申し込む際のデメリットを解消することができる。

## 接続方法

- 専用線
  - 1 Gbps、10 Gbps または 100 Gbps
- ホスト型接続
  - 50 Mbps から 10 Gbp

##

https://sdpf.ntt.com/docs/quick-start-guide/fic/rsts/quickstartguide_aws.html#id10

## 📖 まとめ
