---
title: "【アップデート】新しい CloudWatch メトリクス MetadataNoTokenRejected が利用できるようになりました" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
emoji: '🆕'
topics: ["aws", "study"]
published: true
---

# [アップデート：2024/3/25]デフォルト IMDS を設定できるようになりました

![icon](/images/icons/64/Arch_Amazon-EC2_64.png)

## アップデート内容

2024/3/25 のアップデートでリージョン毎にインスタンスメタデータサービス (IMDS) のデフォルトを設定可能になりました。さらに、**CloudWatch メトリクス `MetadataNoTokenRejected` によって拒否された IMDSv1 の呼び出しを確認できるようになりました。**

https://aws.amazon.com/jp/about-aws/whats-new/2024/03/set-imdsv2-default-new-instance-launches/

EC2 コンソールを使用するか、リージョンごとに API を使って IMDS のデフォルトを有効にすることができます。
EC2 コンソールの場合は、右側の部分「データ保護とセキュリティ」というメニューから設定することができます。

![setting1](/images/ec2-imdsv2-only/imdsv-setting-0.png)

[管理]をクリックします。
![setting2](/images/ec2-imdsv2-only/imdsv-setting-1.png)

[Metadata version]で「V2 only」とすることができます。

![setting3](/images/ec2-imdsv2-only/imdsv-setting-2.png)

ちなみに、[Metadata version]で「V1 and V2」とした場合は、EC2 インスタンス起動設定のメタデータバージョン初期値が変わっていました。

![ec2-default-v1-v2](/images/ec2-imdsv2-only/ec2-default.png)

## 「MetadataNoTokenRejected」メトリクス

[インスタンスメトリクス](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/viewing_metrics_with_cloudwatch.html#ec2-cloudwatch-metrics)

`MetadataNoTokenRejected`は、V1 が無効化されたインスタンスから V1 にアクセスしようとして拒否された場合に確認できるメトリクスです。

メトリクスを確認するために、メタデータのバージョンを 「V2 のみ」にした EC2 インスタンスを起動します。

![ec2-default-v2](/images/ec2-imdsv2-only/ec2-default-v2.png)

IMDSv1 にアクセスできない EC2 インスタンスから、v1 と v2 にアクセスすると次のようになります。v1 のほうが「401 Unauthorized」となっています。

- IMDSv1

```sh
curl http://169.254.169.254/latest/meta-data/
```

![imdsv1](/images/ec2-imdsv2-only/imdsv1.png)

- IMDSv2

```sh
TOKEN=curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"`
curl http://169.254.169.254/latest/meta-data/instance-id -H "X-aws-ec2-metadata-token: $TOKEN"
```

![imdsv2](/images/ec2-imdsv2-only/imdsv2.png)

10 秒おきに IMDSv1 にアクセスするようにすると、`MetadataNoTokenRejected` が増加するのが確認できました。

```sh
watch -n 10 curl http://169.254.169.254/latest/meta-data/
```

![MetadataNoTokenRejected](/images/ec2-imdsv2-only/metric-metadata-notoken-rejected.png)

ちなみに、メタデータバージョンを「V2 のみ」にしていない EC2 インスタンスで IMDSv1 にアクセスしている場合は、`MetadataNoToken` メトリクスを見ることで確認することができます。

![MetadataNoToken](/images/ec2-imdsv2-only/metric-metadata-notoken.png)

## まとめ

現在は、IMDSv2 のみとすることが推奨されています。

既存インスタンスを 「V2 のみ」に変更した後は、`MetadataNoTokenRejected` によって V1 にアクセスしようとしているインスタンスを発見することができそうですが、「V2 のみ」に変更する前に `MetadataNoToken` を調査するのがよいと思います。
その上で、見落としを検知するために `MetadataNoTokenRejected` でアラートが発生するようにしておくのがよいでしょう。