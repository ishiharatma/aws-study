# Amazon Route 53

## はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## Contents

- [Amazon Route 53](#amazon-route-53)
  - [はじめに](#はじめに)
  - [Contents](#contents)
  - [Amazon Route 53 とは](#amazon-route-53-とは)
  - [Amazon Route 53 の基本](#amazon-route-53-の基本)
  - [Route 53 のクォータ](#route-53-のクォータ)
  - [ドメイン登録](#ドメイン登録)
  - [ドメインの移管](#ドメインの移管)
  - [ホストゾーン](#ホストゾーン)
  - [DNS レコードタイプ](#dns-レコードタイプ)
  - [DNS ルーティング](#dns-ルーティング)
  - [DNS ヘルスチェック](#dns-ヘルスチェック)
  - [Amazon Route 53 が DNS リソースレコードセットに対するアクセス許可をサポート（2022-9-21）](#amazon-route-53-が-dns-リソースレコードセットに対するアクセス許可をサポート2022-9-21)

## Amazon Route 53 とは

可用性と拡張性に優れたクラウドのドメインネームシステム (DNS) ウェブサービスです。AWS のサービスの中で唯一 SLA が 100 % のサービスです。

なぜ 53 が付くのかというと、DNS が使用するポート番号が 53 番だからです。

ルートフィフティスリーと読みます。

DNS ？？という人は、はじめに [DNS とは](https://aws.amazon.com/jp/route53/what-is-dns/) を参照するとよいでしょう。

【AWS Black Belt Online Seminar】[Amazon Route 53 Hosted Zone(YouTube)](https://www.youtube.com/watch?v=jFQswFqA9mA)(59:25)

![](/images/route53)

【AWS Black Belt Online Seminar】[Amazon Route 53 Resolver(YouTube)](https://www.youtube.com/watch?v=bax2ZksBzck)(54:18)

![](/images/route53)

[Amazon Route 53 サービス概要](https://aws.amazon.com/jp/route53/)

[Amazon Route 53 ドキュメント](https://docs.aws.amazon.com/ja_jp/route53/?id=docs_gateway)

[Amazon Route 53 よくある質問](https://aws.amazon.com/jp/route53/faqs/)

## Amazon Route 53 の基本

Duration: 0:01:30

## Route 53 のクォータ

主なクォーターは次の通りです。

| 項目         | Quota               | 引き上げ              |
| ------------ | ------------------- | --------------------- |
| ドメイン数   | 20個                | Yes                   |
| ホストゾーン | 500個               | Yes                   |
| レコード数   | 10,000/ホストゾーン | Yes（ただし追加料金） |

それ以外については、ドキュメントを参照してください。

[Amazon Route 53>クォータ](https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/DNSLimitations.html)

## ドメイン登録

AWS では

参考:>[Amazon Route 53 に登録できる最上位ドメイン](https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/registrar-tld-list.html)

## ドメインの移管

他のレジストラで管理しているドメインまたは、AWS アカウント間でドメイン移管することが可能です。

AWS アカウント間のドメイン移管は料金が発生しません。

他のレジストラからの移管は別途料金が発生します。

## ホストゾーン

ホストゾーンは次の2種類があります。

- パブリックホストゾーン
  - インターネット上に公開された DNS ドメインのレコードを管理するコンテナ
- プライベートホストゾーン
  - VPC に閉じたプライベートネットワーク内の DNS ドメインのレコードを管理するコンテナ

ホストゾーンは作成後12時間以内に削除された場合は無料です。

それ以降は ホストゾーン１つあたり 月額 0.50USD かかります。この料金は日割されませんので注意が必要です。

ホストゾーンを削除するには、SOA レコードおよび NS レコードを除くすべてのレコードを予め削除しておく必要があります。

## DNS レコードタイプ

主なレコードタイプは次の通りです。

詳細については、[サポートされる DNS レコードタイプ](https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/ResourceRecordTypes.html) を参照してください。

- SOA レコード
  - Start of Authority (SOA) のレコード
  - ドメインおよび対応する Amazon Route 53 のホストゾーンに関する重要な情報（管理者のメールアドレス、リフレッシュサーバーの時間枠、ドメインの更新履歴など）を提供します
  - ホストゾーンを作成すると自動的に作成され、ホストゾーンに１つだけ存在します
  - このレコードは削除できません
- NS レコード
  - ゾーン情報を管理するネームサーバ
  - ４つのネームサーバが割り当てられます
  - このレコードは削除できません
- A レコード
  - ドメイン名と IPv4 の対応
  - example.com → 1.1.1.1
- AAAA レコード
  - ドメイン名と IPv6 の対応
  - example.com → 2001:db8::1
- CNAME レコード
  - ドメインを別のドメインに紐づける
  - `sub1.example.com. IN CNAME sub2.example.com.` とすると、`sub1` を `sub2` に読み替えてくれます。
  - **sub1.example.com.** IN CNAME sub2.example.com.、**sub1.example.com.** IN CNAME www.example.com. のような同じ定義は NG です
    - 詳細は [RFC1912](https://www.ietf.org/rfc/rfc1912.txt) `A CNAME record is not allowed to coexist with any other data.`
  - Zone Apex とよばれる DNS 名前空間の最上位ノード（この場合、example.com）に対して CNAME は作成できません。
    - `sub1.example.com. IN CNAME example.com.` とするのは NG です
    - 詳細は [RFC1912](https://www.ietf.org/rfc/rfc1912.txt)
- Alias レコード
  - AWS リソースの FQDN(Fully Qualified Domain Name) を指定
  - CloudFront, Elastic Beanstalk ,ELB, API Gateway, VPC インターフェースエンドポイント, Global Accelerator, S3の静的ホスティングなど
- MX レコード
  - メールサーバ

## DNS ルーティング

- シンプルルーティング
  - レコードセットに事前設定された値のみに基づいてDNSクエリに応答する方式
- 位置情報ルーティング
  - ユーザーの位置情報（DNSクエリの発信位置）に基づいてルーティング
- 地理的近接性ルーティング
  - サーバが分散配置されている場合、最も近いところにアクセス
- レイテンシールーティング
  - サーバが分散配置されている場合、最もレイテンシーが低いところにアクセス
- 加重ルーティング
  - 複数のエンドポイントに重みを設定して、重みに応じてDNSクエリに応答する方式
- フェイルオーバールーティング
  - ヘルスチェックに基づいて、利用可能なリソースにDNSクエリを応答する方式
- 複数値回答ルーティング
  - ランダムに選ばれた最大８つの別ベルのレコードにIPアドレスを設定して、複数の値を応答する方式
  - ≒ELB（ELBに代わるものではないが近い機能）

## DNS ヘルスチェック

## Amazon Route 53 が DNS リソースレコードセットに対するアクセス許可をサポート（2022-9-21）

[Amazon Route 53 が DNS リソースレコードセットに対するアクセス許可をサポート](https://aws.amazon.com/jp/about-aws/whats-new/2022/09/amazon-route-53-support-dns-resource-record-set-permissions/)

今までは、IAM ポリシーでRoute 53のホストゾーンに対するレコード操作を制限することができましたが、特定のレコードだけという制限は出来ませんでした。

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
                "ForAllValues:StringEquals":{
                    "route53:ChangeResourceRecordSetsNormalizedRecordNames": ["example.com", "marketing.example.com"]
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
                "ForAllValues:StringLike":{
                     "route53:ChangeResourceRecordSetsNormalizedRecordNames": ["*-beta.example.com"]
                }
            }
          }
        ]
}
```

詳細については、ドキュメントを参照してください。

[きめ細かなアクセスコントロールのための IAM ポリシー条件を使用してリソースレコードセットを管理する](https://docs.aws.amazon.com/ja_jp/Route53/latest/DeveloperGuide/specifying-rrset-conditions.html#route53_rrset_conditionkeys-examples)
