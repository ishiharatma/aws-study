---
title: "【初心者向け】AWS Direct Connect について改めて整理してみた" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: false
---

# AWS Direct Connect<!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

Duration: 00:01:00

- [AWS Direct Connect とは](#aws-direct-connect-とは)
- [AWS への接続方法](#aws-への接続方法)
- [Direct Connect を使うメリットとデメリット](#direct-connect-を使うメリットとデメリット)
- [利用開始方法](#利用開始方法)
- [APN パートナーとは](#apn-パートナーとは)
- [回復性モデル](#回復性モデル)
- [Direct Connect のバックアップとしての AWS Site to Site VPN 接続](#direct-connect-のバックアップとしての-aws-site-to-site-vpn-接続)
- [接続方法](#接続方法)
- [仮想インターフェース（VIF）](#仮想インターフェースvif)
- [Link Aggregation Group (LAG)](#link-aggregation-group-lag)
- [設定方法](#設定方法)
- [Direct Connect Gateway](#direct-connect-gateway)
- [Transit Gateway 接続パターン](#transit-gateway-接続パターン)
- [AWS 専用線アクセス体験ラボトレーニング](#aws-専用線アクセス体験ラボトレーニング)
- [📖 まとめ](#-まとめ)

## AWS Direct Connect とは

Duration: 01:00:21

AWS Direct Connect は、企業や組織が AWS クラウドへの高速かつ安定したプライベートネットワーク接続を確立するためのサービスです。通常のインターネット接続よりも安定性が高く、大容量のデータ転送が可能なため、企業のクリティカルなワークロードやデータの移動に適しています。

企業がデータセンターと AWS にシステムを持っているハイブリットアーキテクチャの場合、両方のサーバとの通信には通信距離というコストが発生します。さらに、インターネット経由の場合、ISP の回線が十分ではなかった場合にはさらなる遅延が発生します。
このような課題を解決するために、AWS Direct Connect というサービスが提供されました。

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
  - Direct Connect は、「①AWS ⇔ ②Direct Connect ロケーション ⇔ ③ ユーザー拠点」という接続になり、①-② 間は AWS が提供しますが、②-③ 間はユーザーが用意しなければならず、契約と初期設定のリードタイムがかかる。
  - 単一回線では AWS メンテナンス時に通信できなくなるので、回線の冗長化が必須となる。

## 利用開始方法

Duration: 0:00:30

- AWS に 直接申し込む
  - 申し込みとそれに伴うやりとり、自拠点のネットワーク機器設定など全て実施することになる
  - 選択プランが少なくコストが高額になる
- APN パートナーと契約する
  - AWS に直接申し込む際のデメリットを解消することができる。

## APN パートナーとは

Duration: 0:00:30

AWS が提供するのは Direct Connect ロケーション内の接続ポイントまでなので、それ以外については利用者が準備しなければなりません。

主に次のようなことを検討・準備しなければならないため、負担が大きいです。

- 回線を引き込むためのデータセンター契約
- 事業者の比較との回線契約
- 工事手続
- 拠点への接続機器導入
- 各種支払手続き
- など・・・

APN パートナーと契約すると、これらの対応が不要になり、回線や機器の保守を一任でき、短期間で構築できるようになります。

![directconnect-setup](/images/directconnect/directconnect-setup.png)

## 回復性モデル

Duration: 0:03:00

- ![resiliency_01](/images/directconnect/resiliency_01.png)

  - クリティカルなワークロードの場合に使用します。

- ![resiliency_02](/images/directconnect/resiliency_02.png)

  - クリティカルなワークロードの場合に使用します。

- ![resiliency_03](/images/directconnect/resiliency_03.png)

  - 非クリティカルなワークロードの場合に使用します。

## Direct Connect のバックアップとしての AWS Site to Site VPN 接続

Duration: 0:01:30

高い回復性と通信の安定性を求めるのであれば、Direct Connect を複数接続する冗長化が望ましいです。

![directconnect-double](/images/directconnect/directconnect-double.png)

ただ、そこまでのコストを掛けられないが冗長化したい場合があります。そのような場合には、Site-to-Site VPN を利用した方法もあります。
最大帯域幅が 1.25 Gbps なので、フェイルオーバー時にパフォーマンスが低下する可能性があります。

![directconnect-vpn](/images/directconnect/directconnect-vpn.png)

## 接続方法

Duration: 0:01:30

接続方法は次の２つがあります。物理ポートを全て専有する専用接続と、物理ポートを共有し、仮想インターフェースによって接続するホスト型接続です。

- [専用接続](https://docs.aws.amazon.com/ja_jp/directconnect/latest/UserGuide/dedicated_connection.html)

  - 1 Gbps、10 Gbps または 100 Gbps

    ![dedicated_connection](/images/directconnect/dedicated_connection.png)

- [ホスト型接続](https://docs.aws.amazon.com/ja_jp/directconnect/latest/UserGuide/hosted_connection.html)

  - 50 Mbps から 10 Gbp の範囲で決められた通信速度を選択可能
  - 50／100／200／300／400／500 Mbps, 1／2／5／10 Gbps

    ![hosted_connection](/images/directconnect/hosted_connection.png)

  - 仮想インターフェースの作成と速度の設定は、APN パートナーのみが実施できます。

## 仮想インターフェース（VIF）

Duration: 0:00:30

- パブリック VIF
  - パブリック IP アドレスを使用してアクセスする。
  - S3 などにもアクセスできる
- プライベート VIF
  - プライベート IP アドレスを使用してアクセスする
  - S3 などにアクセスする場合は VPN エンドポイントを使う
- トランジット VIF
  - Transit Gateway にアクセスする

## Link Aggregation Group (LAG)

Duration: 0:00:30

専用接続の場合に設定できます。ポートスピードが 1 Gbps、10 Gbps または 100 Gbps であることが必要です。
また、同じ帯域を使用する必要があります。「1 Gbps + 10 Gbps」という設定は不可。
100 Gbps の場合は最大２つの接続、100Gbps 未満の場合は最大で４つの接続となります。

1Gbps のポートの場合、最大で 1 Gbps × 4 = 4 Gbps
50Gbps のポートの場合、最大で 50 Gbps × 4 = 200 Gbps
100Gbps のポートの場合、最大で 100 Gbps × 2 = 200 Gbps

![lag](/images/directconnect/directconnect-lag.png)

## 設定方法

Duration: 0:00:30

個人では検証する敷居が高いため、Direct Connect を提供している事業者のマニュアルなどを参照すると理解しやすいかと思います。

[Flexible InterConnect 基本構築ガイド>1.6. AWS 作業（仮想プライベートゲートウェイ,Direct Connect ゲートウェイの作成）|NTT コミュニケーションズ](https://sdpf.ntt.com/docs/quick-start-guide/fic/rsts/quickstartguide_aws.html#id9)

## Direct Connect Gateway

Duration: 0:00:30

Direct Connect の仮想インターフェース（VIF）は 1 本で１つの VPC にしか接続できません。複数の VPC に接続したい場合は、VIF を複数用意しなければなりません。
この問題を解決してくれるのが、[Direct Connect ゲートウェイ](https://docs.aws.amazon.com/ja_jp/directconnect/latest/UserGuide/direct-connect-gateways-intro.html)です。
Direct Connect ゲートウェイを使用することで、複数の異なるリージョンや AWS アカウントにまたがる VPC への接続を可能にします。

しかし、Direct Connect ゲートウェイにも制約があります。

- 最大で 20 個までの VPC しか接続できません。
- Direct Connect ゲートウェイで接続した VPC 同士は相互に接続できません。

## Transit Gateway 接続パターン

Duration: 0:00:30

20 を超える VPC を接続したい、VPC 間も接続したいといった場合、Transit Gateway を接続する方法があります。

次のようなパターンをまとめてみました。

| 接続パターン                                       | 複数 VPC | VPC 間接続 | その他                                   |
| -------------------------------------------------- | -------- | ---------- | ---------------------------------------- |
| ① 直接接続パターン                                 | 複数 VIF | ×          | VIF が増えると物理ポートの帯域を分け合う |
| ②VPC Peering パターン                              | 1 VIF    | ×          | ③④ に比べて低コスト                      |
| ③Direct Connect Gateway パターン                   | 1 VIF    | ×          |                                          |
| ④Direct Connect Gateway + Transit Gateway パターン | 1 VIF    | ○          |                                          |

![directconnect-pattern](/images/directconnect/directconnect-pattern.png)

ただし、Direct Connect に接続できる Transit Gateway は 6 個までとなります。
また、VPC の CIDR は重複しないように注意してください。

## AWS 専用線アクセス体験ラボトレーニング

こういうのもあります。

[https://aws.amazon.com/jp/dx_labo/](https://aws.amazon.com/jp/dx_labo/)

![dx_labo](https://d1.awsstatic.com/webinars/jp/pdf/services/images/20201119_dx_labo_main4.27c08b26ef6e1a116feba269dc78587a169b9b5a.png)

## 📖 まとめ

![directconnect-overview](/images/all/directconnect.png)
