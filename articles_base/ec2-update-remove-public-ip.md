# [アップデート：2024/4/25]自動的に割り当てられたパブリック IPv4 アドレスの動的な削除と追加をサポート

## アップデート内容

EC2 インスタンスに自動的に割り当てられるパブリック IPv4 アドレスを **動的に削除および追加することができる** ようになりました。

https://aws.amazon.com/jp/about-aws/whats-new/2024/04/removing-adding-auto-assigned-public-ipv4-address/

```text
Amazon VPC は、EC2 インスタンスに自動的に割り当てられるパブリック IPv4 アドレスを
動的に削除および追加するためのネットワークインターフェイス設定を発表しました。
この機能により、EC2 インスタンスに自動的に割り当てられるパブリック IPv4 アドレスが不要になった場合、
ネットワークインターフェイスのパブリック IP 設定を変更することで、パブリック IPv4 アドレスを削除したり、
必要に応じて新しいパブリック IPv4 アドレスを割り当て直したりすることができます。
これまでは、EC2 インスタンスに自動的に割り当てられたパブリック IPv4 アドレスを削除することはできませんでした。
このアドレスは、EC2 インスタンスの存続期間中、ネットワークインターフェイス上に残っていました。
ネットワークインターフェイスのパブリック IP 設定により、パブリック IPv4 をより効率的に利用することができ、
パブリック IPv4 のコストを削減することができます。自動的に割り当てられるパブリック IPv4 が不要になったお客様や
EC2 Instance Connect Endpoint を使用して SSH でプライベート IPv4 アドレスを使用するように移行するお客様は、
自動的に割り当てられたパブリック IPv4 アドレスを単純に削除することができ、
自動的に割り当てられたパブリック IPv4 アドレスを持たない新しい EC2 インスタンスでアプリケーションを再作成する必要がなくなりました。

この機能は、すべての AWS 商用リージョンおよび AWS GovCloud (米国) リージョンでご利用いただけます。
追加コストはかかりません。詳細については、VPC のユーザーガイドをご覧ください。
```

## これまで

EC2 に割り当てられたプライマリネットワークインターフェースのパブリックIPアドレスは、起動時に割り当てた場合は削除することができませんでした。

無理やり割り当てを解除する場合は、下記制約事項を使い、ネットワークインターフェースを複数アタッチする方法がありますが手順が煩雑でした。

```text
VPC 内のインスタンスのパブリック IP アドレスが既にリリースされている場合には、
複数のネットワークインターフェイスがインスタンスにアタッチされていると、
インスタンスに新しいパブリック IP アドレスは送信されません。
```
引用：https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/using-instance-addressing.html#concepts-public-addresses


## これから何が嬉しいか

セキュリティのベストプラクティスにおいてもパブリックIPv4アドレスを割り当てないことが推奨されています。

構築時にパブリックIPv4アドレスを割り当てていたが、あとから修正したい場合に楽になりました。

```text
[EC2.9] EC2インスタンスはパブリックIPv4アドレスを持つべきではない
```
引用：https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/ec2-controls.html#ec2-9

## 操作方法

実際に「マネジメントコンソール」と「AWS CLI」で確認してみます。

検証前にパブリック IP の自動割り当てを「有効化」でインスタンスを作成しておきます。

![1](/images/ec2-remove-pubipadr/1.jpg)

### マネジメントコンソール

右上の「アクション」またはインスタンスの右クリックメニューから「ネットワーキング」をクリックし、「IPアドレスの管理」を開きます。

![2](/images/ec2-remove-pubipadr/2.jpg)

ネットワークインターフェースの▼を展開し、「Auto-Assign Public IP」をオフにします。

![3](/images/ec2-remove-pubipadr/3.jpg)

内容を確認し、[確認]ボタンをクリックします。

![4](/images/ec2-remove-pubipadr/4.jpg)

パブリックIPv4アドレス割り当てが解除されました。

![5](/images/ec2-remove-pubipadr/5.jpg)

もとに戻したい場合は、「IPアドレスの管理」から「Auto-Assign Public IP」をオンにすることで、パブリックIPv4アドレスの再割り当てが実行されます。

![6](/images/ec2-remove-pubipadr/6.jpg)

### AWS CLI

※必要に応じて、「--profile」オプションを指定してください

まずネットワークインターフェースのIDを取得します。

参考：[describe-network-interfaces |AWS CLI Command Reference](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-network-interfaces.html)

```sh
## 対象のインスタンスIDを設定します
instance_id=i-058d940bf4ce340af
## プライマリネットワークインターフェースIDを取得します
eni_id=$(aws ec2 describe-network-interfaces --filters "Name=attachment.instance-id,Values=$instance_id" \
--query "NetworkInterfaces[0].NetworkInterfaceId" --output text)
```

自動割り当てを無効にします。

参考：[modify-network-interface-attribute |AWS CLI Command Reference](https://docs.aws.amazon.com/cli/latest/reference/ec2/modify-network-interface-attribute.html)

```sh
aws ec2 modify-network-interface-attribute --network-interface-id $eni_id \
--no-associate-public-ip-address
```

パブリックIPv4アドレスの割り当てが解除されていることを確認します。

```sh
aws ec2 describe-network-interfaces --filters "Name=attachment.instance-id,Values=$instance_id" \
--query "NetworkInterfaces[0].Association.PublicIp" --output text
## ”None”と出力されます
```

自動割り当てを有効にします。

```sh
aws ec2 modify-network-interface-attribute --network-interface-id $eni_id \
--associate-public-ip-address
```

パブリックIPv4アドレスの割り当てがされてることを確認します。

```sh
aws ec2 describe-network-interfaces --filters "Name=attachment.instance-id,Values=$instance_id" \
--query "NetworkInterfaces[0].Association.PublicIp" --output text
## 割り当てられているIPアドレスが出力されます
## xx.xx.xx.xx
```

## まとめ

今回のアップデートで、EC2インスタンスに自動割り当てされたパブリックIPv4アドレスをコンソールまたは、AWS CLIで簡単に追加・削除できることを確認できました。
