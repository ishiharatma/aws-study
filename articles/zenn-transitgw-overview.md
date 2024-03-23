---
title: "【初心者向け】AWS Transit Gateway 入門！完全ガイド" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: false
---

# AWS Transit Gateway<!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

Duration: 00:01:00

- [AWS Transit Gateway とは](#aws-transit-gateway-とは)
- [メリット](#メリット)
- [Transit Gateway の構造](#transit-gateway-の構造)
- [Transit Gateway のユースケース例](#transit-gateway-のユースケース例)
- [ハンズオン](#ハンズオン)
- [ベストプラクティス](#ベストプラクティス)
- [構成のサンプル](#構成のサンプル)
- [📖 まとめ](#-まとめ)

## AWS Transit Gateway とは

Duration: 00:55:33

クラウドネットワークを管理するための重要なサービスの一つです。企業が複数の VPC（Virtual Private Cloud）やオンプレミスのネットワークを統合し、効率的かつセキュアな通信を確立するのに役立ちます。

【AWS Black Belt Online Seminar】[AWS Transit Gateway(YouTube)](https://youtu.be/Yhe2jYzFmfs)(0:55:33)

![blackbelt-transitgw](/images/blackbelt/blackbelt-transitgw-320.jpg)

[AWS Transit Gateway サービス概要](https://aws.amazon.com/jp/transit-gateway/)

[AWS Transit Gateway ドキュメント](https://docs.aws.amazon.com/ja_jp/vpc/#aws-transit-gateway)

[AWS Transit Gateway よくある質問](https://aws.amazon.com/jp/transit-gateway/faqs/)

[AWS Transit Gateway の料金](https://aws.amazon.com/jp/transit-gateway/pricing/)

## メリット

Duration: 0:01:30

```text
AWS Transit Gateway は、クラウドルーターとして機能することで、大規模な
ネットワークの設計と実装を支援します。ネットワークが拡大しても、増分接続
の管理が複雑であることが原因で速度が低下する可能性があります。
AWS Transit Gateway は、中央ハブを介して VPC とオンプレミスネットワーク
を接続します。
```

[https://aws.amazon.com/jp/transit-gateway/?whats-new-cards.sort-by=item.additionalFields.postDateTime&whats-new-cards.sort-order=desc](https://aws.amazon.com/jp/transit-gateway/?whats-new-cards.sort-by=item.additionalFields.postDateTime&whats-new-cards.sort-order=desc)

次のような集約が可能になります。集約以外にも、Transit Gateway を介してそれぞれが通信できようになるメリットもあります。

- VPC ピアリングを集約できる
  ![merit-vpc-peering](/images/transitgw/merit-vpc-peering-320.jpg)

- VPN 接続を集約できる
  ![merit-site2site-vpn](/images/transitgw/merit-site2site-vpn-320.jpg)

- Direct Connect Gateway との接続を集約できる
  ![merit-directconnect](/images/transitgw/merit-directconnect-320.jpg)

## Transit Gateway の構造

Duration: 00:03:00

[Transit Gateway の概念](https://docs.aws.amazon.com/ja_jp/vpc/latest/tgw/what-is-transit-gateway.html#concepts)

Transit Gateway は主に次の要素から構成されています。

![transitgateway-concepts](/images/transitgw/transitgw-concepts.png)

- アタッチメント
  - Transit Gateway と接続する先
    - VPC/Direct Connect Gateway/Site-to-Site VPN
  - サブネットに紐づけて、ENI が割り当てられる
- Transit Gateway ルートテーブル
  - 紐づけたネットワークのルートを管理する
- アソシエーション
  - アタッチメントと Transit Gateway ルートテーブルを関連付ける
- プロパゲーション
  - Transit Gateway ルートテーブルにルートを動的伝達する

## Transit Gateway のユースケース例

Duration: 00:03:00

[ユースケース例](https://docs.aws.amazon.com/ja_jp/vpc/latest/tgw/TGW_Scenarios.html)では次のようなものが記載されています。

- 集中型ルーター
  - ![transit-gateway-three-vpcs](/images/transitgw/transit-gateway-three-vpcs.png)
- 分離された VPC
  - ![transit-gateway-isolated](/images/transitgw/transit-gateway-isolated.png)
- 共有サービスによる分離された VPC
  - ![transit-gateway-isolated_shared](/images/transitgw/transit-gateway-isolated_shared.png)
- ピア接続
  - ![transit-gateway-peering](/images/transitgw/transit-gateway-peering.png)
- 一元的な発信ルーティング
  - ![tgw-centralized-nat-igw](/images/transitgw/tgw-centralized-nat-igw.png)
- アプライアンス VPC
  - ![transit-gateway-appliance](/images/transitgw/transit-gateway-appliance.png)

## ハンズオン

Duration: 00:30:00

[TransitGateway ハンズオン](https://develop.d1xrg9ubdspdie.amplifyapp.com/)があります。
実際に操作をしてみると理解が深まると思います。

ハンズオンでは次のような構成を構築します。

![Chapter1_1.png](/images/transitgw/Chapter1_1.png)

## ベストプラクティス

Duration: 00:05:00

[Transit Gateway 設計のベストプラクティス](https://docs.aws.amazon.com/ja_jp/vpc/latest/tgw/tgw-best-design-practices.html)

```text
各 Transit Gateway VPC アタッチメントに個別のサブネットを使用します。
各サブネットに対して、小さな CIDR (/28 など) を使用して、EC2 リソースの
アドレスが増えるようにします。
```

アタッチメントをサブネットに作成すると ENI が作成されます。同じサブネット内に EC2 リソースが存在するとアタッチメントの ENI の通信と、サブネット内の EC2 リソースの通信が意図しないものにならないよう専用のサブネットに配置するのが良さそうです。

```text
ネットワーク ACL を 1 つ作成し、Transit Gateway に関連付けられたすべての
サブネットに関連付けます。ネットワーク ACL は、インバウンド方向とアウトバウンド
方向の両方で開いたままにします。
```

アタッチメントと EC2 リソースは通信が必要なので、ネットワーク ACL で通信先の CIDR
のみ許可していると Transit Gateway 経由で疎通が行えないようになります。

## 構成のサンプル

Duration: 00:01:00

ハンズオンの構成よりもベストプラクティスにもあるように、Transit Gateway のアタッチメントに個別のサブネットを作成したサンプル構成です。

![transitgateway-sample](/images/transitgw/transitgw-sample.png)

## 📖 まとめ

![transitgateway-overview](/images/all/transitgateway.png)
