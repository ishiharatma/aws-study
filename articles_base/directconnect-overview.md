# AWS Direct Connect<!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

<!-- Duration: 00:01:00 -->

- [AWS Direct Connect とは](#aws-direct-connect-とは)
- [AWS への接続方法](#aws-への接続方法)
- [Direct Connect を使うメリットとデメリット](#direct-connect-を使うメリットとデメリット)
  - [転送中の暗号化](#転送中の暗号化)
- [利用開始方法](#利用開始方法)
- [APN パートナーとは](#apn-パートナーとは)
- [接続方法](#接続方法)
- [仮想インターフェース（VIF）](#仮想インターフェースvif)
- [Link Aggregation Group (LAG)](#link-aggregation-group-lag)
- [設定方法](#設定方法)
- [回復性モデル](#回復性モデル)
  - [最大の回復性](#最大の回復性)
  - [高い回復性](#高い回復性)
  - [開発とテスト](#開発とテスト)
- [Direct Connect のバックアップとしての AWS Site to Site VPN 接続](#direct-connect-のバックアップとしての-aws-site-to-site-vpn-接続)
- [Direct Connect Gateway](#direct-connect-gateway)
- [接続パターン](#接続パターン)
- [AWS 専用線アクセス体験ラボトレーニング](#aws-専用線アクセス体験ラボトレーニング)
- [MTU とジャンボフレーム](#mtu-とジャンボフレーム)
- [BFD（Bidirectional Forwarding Detection 　＝双方向フォワーディング検出）](#bfdbidirectional-forwarding-detection-双方向フォワーディング検出)
- [📖 まとめ](#-まとめ)

## AWS Direct Connect とは

<!-- Duration: 01:00:21 -->

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

<!-- Duration: 0:00:30 -->

AWS へ接続するには主に次のような方法があります

- インターネット回線を使った接続
  - リモートアクセス VPN
    - [AWS Client VPN](https://docs.aws.amazon.com/ja_jp/vpn/latest/clientvpn-admin/what-is.html)
  - 拠点間 VPN 接続（仮想的な専用線）
    - [AWS Site-to-Site VPN](https://docs.aws.amazon.com/ja_jp/vpn/latest/s2svpn/VPC_VPN.html)
- 専用線接続
  - AWS Direct Connect

## Direct Connect を使うメリットとデメリット

<!-- Duration: 0:01:30 -->

- メリット
  - インターネット回線を使用せず、専用のプライベートなネットワークで接続するためセキュリティが高い
  - 専用線のため帯域幅が確保され、安定した通信速度で接続できます
  - AWS からのデータ送信料金が VPN に比べて 50％ほど割安です
- デメリット
  - Direct Connect は、「①AWS ⇔ ②Direct Connect ロケーション ⇔ ③ ユーザー拠点」という接続になり、①-② 間は AWS が提供しますが、②-③ 間はユーザーが用意しなければならず、契約と初期設定のリードタイムがかかります
  - 単一回線では AWS メンテナンス時に通信できなくなるので、回線の冗長化が必須となります
  - デメリットというわけではないが、VPN 接続と違い Direct Connect 接続は転送中の暗号化は行われていません。そのため、転送中に何らかの暗号化を行う必要があります。

### 転送中の暗号化

[AWS Direct Connect での暗号化](https://docs.aws.amazon.com/ja_jp/directconnect/latest/UserGuide/encryption-in-transit.html)

- レイヤー 3
  - IPsec（Security Architecture for Internet Protocol）
- レイヤー 2
  - MACsec（MAC Security）

## 利用開始方法

<!-- Duration: 0:00:30 -->

- AWS に 直接申し込む
  - 申し込みとそれに伴うやりとり、自拠点のネットワーク機器設定など全て実施することになります
  - 選択プランが少なくコストが高額になります
- APN パートナーと契約する
  - AWS に直接申し込む際のデメリットを解消することができます

## APN パートナーとは

<!-- Duration: 0:00:30 -->

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

## 接続方法

<!-- Duration: 0:01:30 -->

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

<!-- Duration: 0:00:30 -->

- パブリック VIF
  - パブリック IP アドレスを使用してアクセスする。
  - S3 などにもアクセスできる
- プライベート VIF
  - プライベート IP アドレスを使用してアクセスする
  - S3 などにアクセスする場合は インターフェース VPC エンドポイントを使う
  - ※ゲートウェイ VPC エンドポイントには接続できないので注意
- トランジット VIF
  - Transit Gateway と接続するときに使います

![dx_vif](/images/directconnect/dx_vif.png)

## Link Aggregation Group (LAG)

<!-- Duration: 0:00:30 -->

専用接続の場合に設定できます。ポートスピードが 1 Gbps、10 Gbps または 100 Gbps であることが必要です。
また、同じ帯域を使用する必要があります。「1 Gbps + 10 Gbps」という設定は不可となります。
100 Gbps の場合は最大２つの接続、100Gbps 未満の場合は最大で４つの接続となります。

1Gbps のポートの場合、最大で 1 Gbps × 4 = 4 Gbps
50Gbps のポートの場合、最大で 50 Gbps × 4 = 200 Gbps
100Gbps のポートの場合、最大で 100 Gbps × 2 = 200 Gbps

![lag](/images/directconnect/directconnect-lag.png)

## 設定方法

<!-- Duration: 0:00:30 -->

個人では検証する敷居が高いため、Direct Connect を提供している事業者のマニュアルなどを参照すると理解しやすいかと思います。

[Flexible InterConnect 基本構築ガイド>1.6. AWS 作業（仮想プライベートゲートウェイ,Direct Connect ゲートウェイの作成）|NTT コミュニケーションズ](https://sdpf.ntt.com/docs/quick-start-guide/fic/rsts/quickstartguide_aws.html#id9)

## 回復性モデル

<!-- Duration: 0:03:00 -->

要件に応じた回復性の高いネットワーク接続を実現できます。
[AWS Direct Connect Resiliency Toolkit を使用した使用の開始](https://docs.aws.amazon.com/ja_jp/directconnect/latest/UserGuide/resiliency_toolkit.html)

### 最大の回復性

クリティカルなワークロードの場合に使用します。

![resiliency_01](/images/directconnect/resiliency_01.png)

- ![](/images/directconnect/icon-ok.png)接続、デバイスの障害があっても回復できる
- ![](/images/directconnect/icon-ok.png)ロケーション障害があっても回復できる
- ![](/images/directconnect/icon-ok.png)ロケーション障害でも、冗長性が保たれる

### 高い回復性

クリティカルなワークロードの場合に使用します。

![resiliency_02](/images/directconnect/resiliency_02.png)

- ![](/images/directconnect/icon-ok.png)接続、デバイスの障害があっても回復できる
- ![](/images/directconnect/icon-ok.png)ロケーション障害があっても回復できる
- ![](/images/directconnect/icon-mid.png)ロケーション障害で、冗長性が失われる

### 開発とテスト

非クリティカルなワークロードの場合に使用します。

![resiliency_03](/images/directconnect/resiliency_03.png)

- ![](/images/directconnect/icon-ok.png)接続、デバイスの障害があっても回復できる
- ![](/images/directconnect/icon-ng.png)ロケーション障害で、接続できない

## Direct Connect のバックアップとしての AWS Site to Site VPN 接続

<!-- Duration: 0:01:30 -->

高い回復性と通信の安定性を求めるのであれば、Direct Connect を複数接続する冗長化が望ましいです。

![directconnect-double](/images/directconnect/directconnect-double.png)

ただ、そこまでのコストを掛けられないが冗長化したい場合があります。そのような場合には、Site-to-Site VPN を利用した方法もあります。
最大帯域幅が 1.25 Gbps なので、フェイルオーバー時にパフォーマンスが低下する可能性があります。

![directconnect-vpn](/images/directconnect/directconnect-vpn.png)

## Direct Connect Gateway

<!-- Duration: 0:00:30 -->

Direct Connect の仮想インターフェース（VIF）は 1 本で１つの VPC にしか接続できません。複数の VPC に接続したい場合は、VIF を複数用意しなければなりません。また、他のリージョンには接続することができません。

![direct-connect-gw-1](/images/directconnect/direct-connect-gw-1.png)

この問題を解決してくれるのが、[Direct Connect ゲートウェイ](https://docs.aws.amazon.com/ja_jp/directconnect/latest/UserGuide/direct-connect-gateways-intro.html)です。
Direct Connect ゲートウェイを使用することで、複数の異なるリージョンや AWS アカウントにまたがる VPC への接続を可能にします。

![direct-connect-gw-2](/images/directconnect/direct-connect-gw-2.png)

しかし、Direct Connect ゲートウェイにも制約があります。

- 最大で 20 個までの VPC しか接続できません。
- Direct Connect ゲートウェイで接続した VPC 同士は相互に接続できません。

Direct Connect ゲートウェイに接続する VPC の数を制限したい場合は次のように VIF を 2 つ使用するアーキテクチャも有効です。

![direct-connect-gw-3](/images/directconnect/direct-connect-gw-3.png)

## 接続パターン

<!-- Duration: 0:00:30 -->

次のようなパターンをまとめてみました。
多数の VPC を接続したい、VPC 間も接続したい、今後も VPC が追加される予定があるといった場合は、Transit Gateway との接続を採用したほうシンプルになります。
ただし、Direct Connect に接続できる Transit Gateway は 6 個までとなります。
また、VPC の CIDR は重複しないように注意してください。

逆に、VPC 数が限られており、今後も増える予定がないといった場合、②VPC Peering パターンで構築するほうが良いということもあります。
今後の拡張性を十分に考慮して接続パターンを選択します。

| 接続パターン                                       | 複数 VPC | VPC 間接続 | その他                                   |
| -------------------------------------------------- | -------- | ---------- | ---------------------------------------- |
| ① 直接接続パターン                                 | 複数 VIF | ×          | VIF が増えると物理ポートの帯域を分け合う |
| ②VPC Peering パターン                              | 1 VIF    | ×          | ③④ に比べて低コスト                      |
| ③Direct Connect Gateway パターン                   | 1 VIF    | ×          |                                          |
| ④Direct Connect Gateway + Transit Gateway パターン | 1 VIF    | ○          |                                          |

![directconnect-pattern](/images/directconnect/directconnect-pattern.png)

## AWS 専用線アクセス体験ラボトレーニング

こういうのもあります。

[https://aws.amazon.com/jp/dx_labo/](https://aws.amazon.com/jp/dx_labo/)

![dx_labo](/images/directconnect/dx_lab.png)

## MTU とジャンボフレーム

MTU とは、Maximum Transmission Unit の略で、ネットワークで一回に送信できる最大のデータサイズ（バイト）のことです。
イーサネットでは、最大フレームサイズが 1518 バイトとなっており、これには、イーサネットヘッダ（14 バイト）と FCS（4 バイト）が含まれるので、MTU=1500 となっています。

ジャンボフレームとはイーサネットの MTU を超えるサイズのことで、一般的には 9000 バイトとなっているが、これ以下、以上も存在するので注意が必要である。

```text
AWS Direct Connect は 1522 バイトまたは 9023 バイトのイーサーネットフレームサイズ
(14 バイトイーサーネットヘッダー + 4 バイト VLAN タグ + IP データグラム用バイト + 4 バイト FCS) を
リンクレイヤーでサポートします。
```

[プライベート仮想インターフェイスまたはトランジット仮想インターフェイスのネットワーク MTU の設定](https://docs.aws.amazon.com/ja_jp/directconnect/latest/UserGuide/set-jumbo-frames-vif.html)

- パブリック VIF
  - MTU 1500
  - ジャンボフレーム ×
- プライベート VIF
  - MTU 1500 or 9001
- トランジット VIF
  - MTU 1500 or 8500

## BFD（Bidirectional Forwarding Detection 　＝双方向フォワーディング検出）

2 台の隣接するルータ間でヘルスチェックを行い高速に障害を検知してルーティングプロトコルに通知する機能です。これを使うには、BFD 対応ルータを用意することが必要になります。
BFD を使わない場合、BGP が接続障害を検知するのには最大で 90 秒かかります。
そのため、冗長接続の場合は BFD 対応ルータを用意することはフェイルオーバー時間を短縮するのに効果的です。最短で 1 秒（300 ミリ秒間隔のチェック 3 回で検出）まで短縮が可能になります。

## 📖 まとめ

![directconnect-overview](/images/all/directconnect.png)