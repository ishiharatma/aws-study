---
title: "【初心者向け】Amazon Route 53 入門！完全ガイド" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: true
---

# Amazon Route 53<!-- omit in toc -->

![icon](/images/icons/64/Arch_Amazon-Route-53_64.png)![icon](/images/icons/64/Arch_Amazon-Route-53_64.png)![icon](/images/icons/64/Arch_Amazon-Route-53_64.png)![icon](/images/icons/64/Arch_Amazon-Route-53_64.png)![icon](/images/icons/64/Arch_Amazon-Route-53_64.png)

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

- [Amazon Route 53 とは](#amazon-route-53-とは)
- [ドメインの新規登録](#ドメインの新規登録)
- [ドメインの移管](#ドメインの移管)
- [Route 53 を構成する要素](#route-53-を構成する要素)
- [ホストゾーン](#ホストゾーン)
- [DNS レコードタイプ](#dns-レコードタイプ)
- [DNS ルーティング](#dns-ルーティング)
- [Route 53 Resolver](#route-53-resolver)
- [Route 53 Resolver for Hybrid Clouds](#route-53-resolver-for-hybrid-clouds)
- [DNS ヘルスチェック](#dns-ヘルスチェック)
- [Amazon Route 53 の料金](#amazon-route-53-の料金)
- [Route 53 のクォータ](#route-53-のクォータ)
- [Amazon Route 53 が DNS リソースレコードセットに対するアクセス許可をサポート（2022-9-21）](#amazon-route-53-が-dns-リソースレコードセットに対するアクセス許可をサポート2022-9-21)
- [📖 まとめ](#-まとめ)

## Amazon Route 53 とは

<!-- Duration: 1:53:43 -->

可用性と拡張性に優れたクラウドのドメインネームシステム (DNS) ウェブサービスです。AWS のサービスの中で唯一 SLA が 100 % のサービスです。

ルートフィフティスリーと読みます。

なぜ 53 が付くのかというと、DNS が使用するポート番号が 53 番だからです。

DNS ？？という人は、[DNS とは](https://aws.amazon.com/jp/route53/what-is-dns/) を参照するとよいでしょう。

【AWS Black Belt Online Seminar】[Amazon Route 53 Hosted Zone(YouTube)](https://www.youtube.com/watch?v=jFQswFqA9mA)(59:25)

![route53_2](/images/route53/route53_1-320.jpg)

【AWS Black Belt Online Seminar】[Amazon Route 53 Resolver(YouTube)](https://www.youtube.com/watch?v=bax2ZksBzck)(54:18)

![route53_2](/images/route53/route53_2-320.jpg)

[Amazon Route 53 サービス概要](https://aws.amazon.com/jp/route53/)

[Amazon Route 53 ドキュメント](https://docs.aws.amazon.com/ja_jp/route53/?id=docs_gateway)

[Amazon Route 53 よくある質問](https://aws.amazon.com/jp/route53/faqs/)

[Amazon Route 53 料金](https://aws.amazon.com/jp/route53/pricing/)

## ドメインの新規登録

<!-- Duration: 0:00:30 -->

AWS では　 Route53 にて新規ドメインを取得することができます。

[Amazon Route 53 に登録できる最上位ドメイン](https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/registrar-tld-list.html)

## ドメインの移管

<!-- Duration: 0:00:30 -->

[ドメインの移管](https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/domain-transfer.html)

以下の移管が可能です。

- 他のレジストラ ⇒ Route 53
  - [ドメイン登録の Amazon Route 53 への移管](https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/domain-transfer-to-route-53.html)
  - 他のレジストラからの移管は別途料金が発生します。最上位ドメインによって料金が異なります。
- AWS アカウント ⇒ 別の AWS アカウント
  - [異なる AWS アカウントへのドメインの移管](https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/domain-transfer-between-aws-accounts.html)
  - AWS アカウント間のドメイン移管は料金が発生しません。
- Route 53 ⇒ 他のレジストラ
  - [Amazon Route 53 から別のレジストラにドメインを移行する](https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/domain-transfer-from-route-53.html)
  - 他のレジストラへの移管は別途料金が発生します。最上位ドメインによって料金が異なります。

## Route 53 を構成する要素

以下で構成されます。

- ホストゾーン
  - ドメインおよびサブドメインのトラフィックをルーティングするための管理単位（コンテナ）です。
- DNS レコード
  - ホストゾーン内でドメイン名に対応するリソースへルーティングするための紐付けです。

## ホストゾーン

<!-- Duration: 0:00:30 -->

ホストゾーンは次の 2 種類があります。

![route53_hostedzone](/images/route53/route53_hostedzone-320.jpg)

- パブリックホストゾーン
  - インターネット上に公開された DNS ドメインのレコードを管理するコンテナ
- プライベートホストゾーン
  - VPC に閉じたプライベートネットワーク内の DNS ドメインのレコードを管理するコンテナ

ホストゾーンを削除するには、SOA レコードおよび NS レコードを除くすべてのレコードを予め削除しておく必要があります。

## DNS レコードタイプ

<!-- Duration: 0:05:00 -->

![route53_hostedzone_record](/images/route53/route53_hostedzone_record-320.jpg)

主なレコードタイプは次の通りです。

詳細については、[サポートされる DNS レコードタイプ](https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/ResourceRecordTypes.html) を参照してください。

ホストゾーンを作成する自動的に作成されるレコード

- SOA レコード
  - Start of Authority (SOA) のレコード
  - ドメインおよび対応する Amazon Route 53 のホストゾーンに関する重要な情報（管理者のメールアドレス、リフレッシュサーバーの時間枠、ドメインの更新履歴など）を提供します
  - ホストゾーンを作成すると自動的に作成され、ホストゾーンに１つだけ存在します
  - このレコードは削除できません
- NS レコード
  - ゾーン情報を管理するネームサーバ
  - ４つのネームサーバが割り当てられます
  - このレコードは削除できません

システムに応じて、ユーザーが追加するレコード

- A レコード
  - ドメイン名と IPv4 の対応
  - example.com → 192.0.2.1
- AAAA レコード
  - ドメイン名と IPv6 の対応
  - example.com → 2001:db8::1
- CNAME レコード

  - ドメインを別のドメインに紐づける
  - `sub1.example.com. IN CNAME sub2.example.com.` とすると、`sub1` を `sub2` に読み替えてくれます。
  - 以下のような同じ定義は NG です。(sub1 を２つのドメインに紐づけている)
    - **sub1.example.com.** IN CNAME sub2.example.com.
    - **sub1.example.com.** IN CNAME www.example.com.
    - 詳細は [RFC1912](https://www.ietf.org/rfc/rfc1912.txt) `A CNAME record is not allowed to coexist with any other data.`
  - 別のタイプのレコードを追加することも出来ません。

    - **sub1.example.com.** IN CNAME sub2.example.com.
    - **sub1.example.com.** IN A 192.0.2.1

  - Zone Apex とよばれる DNS 名前空間の最上位ノード（この場合、example.com）に対して CNAME は作成できません。
    - `example.com. IN CNAME sub1.example.com.` とするのは NG です
    - Zone Apex には NS レコードが必須であり、CNAME は別のレコードタイプと共存できないという点が矛盾するから。
    - 詳細は [RFC1912](https://www.ietf.org/rfc/rfc1912.txt)

- Alias レコード
  - AWS リソースの FQDN(Fully Qualified Domain Name) を指定できる Route 53 固有の機能
  - CNAME では利用できなかった Zone Apex のレコードを追加することが可能です。
  - CloudFront, Elastic Beanstalk ,ELB, API Gateway, VPC インターフェースエンドポイント, Global Accelerator, S3 の静的ホスティングなど
- MX レコード
  - メールサーバ

## DNS ルーティング

<!-- Duration: 0:10:00 -->

- シンプルルーティング
  - レコードセットに事前設定された値のみに基づいて DNS クエリに応答する方式
  - デフォルトのルーティングです
    ![simple_routing](/images/route53/route53_simple.png)
- 位置情報ルーティング
  - ユーザーの位置情報（DNS クエリの発信位置）に基づいて DNS クエリに応答する方式
  - デフォルトのルーティングを指定しておかないと、設定した地域以外からは名前解決できないので注意が必要です。（日本と米国のみ定義した場合、それ以外の地域からはアクセスできなくなります）
    ![geolocation_routing](/images/route53/route53_geolocation.png)
- 地理的近接性ルーティング
  - ユーザーの位置情報（DNS クエリの発信位置）とサーバが分散配置されている場合、最も近いところに応答する方式
    ![geoproximity_routing](/images/route53/route53_geoproximity.png)
  - 「位置情報ルーティング」との違いが分かり難い
- レイテンシールーティング
  - サーバが分散配置されている場合、最もレイテンシーが低いところに応答する方式
    ![latency_routing](/images/route53/route53_latency.png)
- 加重ルーティング
  - 複数のエンドポイントに重みを設定して、重みに応じて DNS クエリに応答する方式
    ![weighted_routing](/images/route53/route53_weighted.png)
- フェイルオーバールーティング
  - ヘルスチェックに基づいて、利用可能なリソースに DNS クエリを応答する方式
    ![failover_routing](/images/route53/route53_failover.png)
  - このルーティングを用いることで、マルチリージョンでのフェイルオーバーを構成できます
    ![multi_region_failover_routing](/images/route53/route53_multi_region_failover.png)
- 複数値回答ルーティング
  - ランダムに選ばれた最大８つの正常なレコードに IP アドレスを設定して、複数の値を応答する方式
  - ≒ELB（ELB に代わるものではないが近い機能）
    ![multivalue_routing](/images/route53/route53_multivalue.png)
- IP ベースルーティング
  - アクセス元の IP アドレス CIDR を元にルーティングする方式
  - IPv4 は /0 ～/24、IPv6 は /0 ～/48 を指定できます
  - 2022-06-01 に利用可能になったものです。[Amazon Route 53 が DNS クエリの IP ベースのルーティングを発表](https://aws.amazon.com/jp/about-aws/whats-new/2022/06/amazon-route-53-ip-based-routing-dns-queries/)
    ![ip_base_routing](/images/route53/route53_ipbase.png)

## Route 53 Resolver

<!-- Duration: 0:00:30 -->

VPC に標準で配備されている DNS サーバー（フォワーダー＋フルサービスリゾルバ）のことで、以前は、「.2 Resolver」や「Amazon Provided DNS」と呼ばれていたものです。

![route53_resolver](/images/route53/route53_resolver.png)

一般的に、リゾルバ（Resolver）とは、DNS サーバへドメイン名を照会して対応する IP アドレスを調べたり、その逆（IP アドレス → ドメイン名）を調べたりするソフトウェアのことを言います。

フォワーダーとは、自身では DNS 非再帰的問い合わせを行わず、別のフルサービスリゾルバーに転送する DNS サーバーのことです。

フルサービスリゾルバとは、非再帰的問い合わせを行い、名前解決を行う DNS サーバーのことです。

非再帰的問い合わせとは、知っている情報のみを回答してもらうリクエストです。再帰的問い合わせは、答えが分かるまで繰り返して問い合わせを行わせるリクエストです。

クライアントからは、`再帰的問い合わせ` が行われ、フルサービスリゾルバから権威 DNS サーバには `非再帰的問い合わせ` が行われます。権威 DNS サーバは自身が管理している情報のみを回答するのが役割です。

## Route 53 Resolver for Hybrid Clouds

<!-- Duration: 0:00:30 -->

オンプレミスとクラウドのリソースによって構成された環境での名前解決を一元化するための Amazon Route53 Resolver の機能拡張です。

実体は、ENI（Elastic Network Interface）なので、セキュリティグループによるアクセス制御が可能です。

![route53_resolver_hybrid](/images/route53/route53_resolver_hybrid.png)

## DNS ヘルスチェック

<!-- Duration: 0:00:30 -->

Route53 ヘルスチェックには、エンドポイント、他のヘルスチェックのステータス、CloudWatch アラーム等があります。

[Amazon Route 53 ヘルスチェックの種類](https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/health-checks-types.html)

エンドポイントのヘルスチェックを使用することで、特定の URL へのウェブページのリクエストなどの正常性を確認できます。ヘルスチェック対象のウェブページは、HTTP ステータスコード 2xx または 3xx で応答する必要があります。

ヘルスチェックには別途料金が発生します。

## Amazon Route 53 の料金

<!-- Duration: 0:00:30 -->

[Amazon Route 53 料金表](https://aws.amazon.com/jp/route53/pricing/)

ホストゾーン、レコード数、処理されたクエリ数で課金されます。

ホストゾーンの料金は、1 か月未満でも日割り計算されませんので注意が必要です

テスト目的として利用できるように、作成後 12 時間以内に削除された場合は無料となります。ただし、クエリ数での課金は発生します。

- 無料枠
  - 作成後 12 時間以内に削除されたホストゾーン

## Route 53 のクォータ

<!-- Duration: 0:00:30 -->

主なクォーターは次の通りです。

| 項目         | Quota               | 引き上げ              |
| ------------ | ------------------- | --------------------- |
| ドメイン数   | 20 個               | Yes                   |
| ホストゾーン | 500 個              | Yes                   |
| レコード数   | 10,000/ホストゾーン | Yes（ただし追加料金） |

それ以外については、ドキュメントを参照してください。

[Amazon Route 53>クォータ](https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/DNSLimitations.html)

## Amazon Route 53 が DNS リソースレコードセットに対するアクセス許可をサポート（2022-9-21）

<!-- Duration: 00:01:00 -->

[Amazon Route 53 が DNS リソースレコードセットに対するアクセス許可をサポート](https://aws.amazon.com/jp/about-aws/whats-new/2022/09/amazon-route-53-support-dns-resource-record-set-permissions/)

今までは、IAM ポリシーで Route 53 のホストゾーンに対するレコード操作を制限することができましたが、特定のレコードだけという制限は出来ませんでした。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "route53:ChangeResourceRecordSets",
      "Resource": "arn:aws:route53:::hostedzone/Z11111112222222333333"
    }
  ]
}
```

アップデートにより、特定の名前の DNS レコードへのアクセス制限ができるようになりました。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "route53:ChangeResourceRecordSets",
      "Resource": "arn:aws:route53:::hostedzone/Z11111112222222333333",
      "Condition": {
        "ForAllValues:StringEquals": {
          "route53:ChangeResourceRecordSetsNormalizedRecordNames": [
            "example.com",
            "marketing.example.com"
          ]
        }
      }
    }
  ]
}
```

特定のサフィックスに対して制御する場合は次のようになります。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "route53:ChangeResourceRecordSets",
      "Resource": "arn:aws:route53:::hostedzone/Z11111112222222333333",
      "Condition": {
        "ForAllValues:StringLike": {
          "route53:ChangeResourceRecordSetsNormalizedRecordNames": [
            "*-beta.example.com"
          ]
        }
      }
    }
  ]
}
```

詳細については、ドキュメントを参照してください。

[きめ細かなアクセスコントロールのための IAM ポリシー条件を使用してリソースレコードセットを管理する](https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/specifying-rrset-conditions.html#route53_rrset_conditionkeys-examples)

## 📖 まとめ

<!-- Duration: 00:01:00 -->

![route53](/images/all/route53.png)