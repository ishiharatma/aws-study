---
title: "【初心者向け】AWS Certificate Manager(ACM) 入門！完全ガイド" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: true
---

# AWS Certificate Manager (ACM)<!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

Duration: 00:01:00

- [AWS Certificate Manager とは](#aws-certificate-manager-とは)
- [リージョナルサービスであること](#リージョナルサービスであること)
- [使用可能なサービス](#使用可能なサービス)
- [パブリック証明書とプライベート証明書](#パブリック証明書とプライベート証明書)
- [インポートされた証明書](#インポートされた証明書)
- [📖 まとめ](#-まとめ)

## AWS Certificate Manager とは

Duration: 00:57:12

AWS Certificate Manager (ACM) を使用して、AWS サービスと内部接続リソースで使用するパブリックおよびプライベート SSL/TLS 証明書をプロビジョニング、管理するサービスです。

【AWS Black Belt Online Seminar】[AWS Certificate Manager(YouTube)](https://youtu.be/d-zsi1ZRwLs)(0:57:12)

![blackbelt-acm](/images/blackbelt/blackbelt-acm-320.jpg)

[AWS Certificate Manager サービス概要](https://aws.amazon.com/jp/certificate-manager/)

[AWS Certificate Manager ドキュメント](https://docs.aws.amazon.com/ja_jp/acm/?id=docs_gateway)

[AWS Certificate Manager よくある質問](https://aws.amazon.com/jp/certificate-manager/faqs/)

[AWS Certificate Manager の料金](https://aws.amazon.com/jp/certificate-manager/pricing/)

## リージョナルサービスであること

Duration: 00:01:00

ACM はリージョンごとのサービスであるということを意識する必要があります。
他の AWS サービスで利用する場合は、リージョンの関係を意識しないといけません。

特に、CloudFront で利用する場合は、`バージニア北部リージョン` で証明書を発行する必要があります。

[サポートされるリージョン](https://docs.aws.amazon.com/ja_jp/acm/latest/userguide/acm-regions.html)

> Amazon CloudFront で ACM 証明書を使用するには、米国東部 (バージニア北部) リージョン の証明書をリクエスト (またはインポート) していることを確認します。

ALB に使用する場合は、ALB のリージョンで発行します。

> Elastic Load Balancing で証明書を使用するには...(略)...リージョンごとに証明書の各ドメイン名を取得する必要があることを意味します。リージョン間で証明書をコピーすることはできません。

## 使用可能なサービス

Duration: 00:01:00

Elastic Load Balancing、CloudFront、Cognito、Elastic Beanstalk、App Runner、API Gateway、CloudFormation などで利用できます。

詳細は、[サービスと AWS Certificate Manager の統合](https://docs.aws.amazon.com/ja_jp/acm/latest/userguide/acm-services.html) を参照します。

## パブリック証明書とプライベート証明書

Duration: 0:01:30

FAQ の [Q: パブリック証明書とプライベート証明書の違いは何ですか?](https://aws.amazon.com/jp/certificate-manager/faqs/) に記載があります。

パブリック証明書は厳しい審査をクリアしているパブリック認証局から発行しているのに対し、プライベート証明書は審査を受けていない認証局から発行するもので、ざっくりいうと、インターネットからアクセスするようなサービスの場合は、パブリック証明書で、組織内などのプライベートネットワークの場合は、プライベート証明書という使い分けです。

パブリック証明書とプライベート証明書は有効期限が近づくと、自動更新されます。

## インポートされた証明書

Duration: 00:01:00

サードパーティーの証明書を使う場合はインポートすることで、CloudFront、ELB、API Gateway で利用することができます。
ただし、自動更新は行われないため、証明書が切れる前に手動でインポートする必要があります。
自動更新は行われませんが、[ACM CloudWatch メトリクス](https://docs.amazonaws.cn/en_us/acm/latest/userguide/cloudwatch-metrics.html)で証明書の有効期限を監視することはできます。

`DaysToExpiry` は証明書が切れるまでの残り日数になっているので、このように減少していきます。

![DaysToExpiry](/images/acm/acm-cw-daytoexpiry.jpg)

## 📖 まとめ

![acm](/images/all/acm.png)
