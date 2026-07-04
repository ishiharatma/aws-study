---
title: "【初心者向け】Amazon VPC 入門！完全ガイド" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: false
emoji: "🕸️"
---

# Amazon Virtual Private Cloud（VPC）<!-- omit in toc -->

![icon](/images/icons/64/Arch_Amazon-Virtual-Private-Cloud_64.png)

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

<!-- Duration: 00:01:00 -->

- [VPC とは](#vpc-とは)
  - [AWS ドキュメント](#aws-ドキュメント)
  - [学習リソース](#学習リソース)
- [VPC の基本](#vpc-の基本)
  - [VPC を構成する要素](#vpc-を構成する要素)
- [CIDR 設計](#cidr-設計)
  - [セカンダリ CIDR の追加](#セカンダリ-cidr-の追加)
- [DHCP オプションセット](#dhcp-オプションセット)
  - [デフォルトの設定](#デフォルトの設定)
  - [カスタム DHCP オプションセットが必要なケース](#カスタム-dhcp-オプションセットが必要なケース)
  - [インターネットゲートウェイ](#インターネットゲートウェイ)
  - [NATゲートウェイ](#natゲートウェイ)
    - [リージョナル NAT ゲートウェイ（2025年11月〜）](#リージョナル-nat-ゲートウェイ2025年11月)
    - [NAT インスタンス](#nat-インスタンス)
  - [サブネット](#サブネット)
  - [サブネットの種別](#サブネットの種別)
    - [AWSが予約する5つのIPアドレス](#awsが予約する5つのipアドレス)
    - [サブネット構成例](#サブネット構成例)
  - [ルートテーブル](#ルートテーブル)
  - [ルートテーブルの例](#ルートテーブルの例)
- [セキュリティグループ（SG）](#セキュリティグループsg)
  - [ステートフルとは](#ステートフルとは)
- [ネットワーク ACL（NACL）](#ネットワーク-aclnacl)
  - [ステートレスとは](#ステートレスとは)
- [セキュリティグループと NACL の比較](#セキュリティグループと-nacl-の比較)
- [VPC エンドポイント](#vpc-エンドポイント)
- [VPC フローログ](#vpc-フローログ)
  - [フローログの主なフィールド（v2）](#フローログの主なフィールドv2)
- [📖 まとめ](#-まとめ)

## VPC とは

VPCとは、Virtual Private Cloudの略で、AWSアカウント内に専用の仮想ネットワーク空間を構築できるサービスです。

オンプレミスにおいて、このようなネットワーク環境を構築するには、主に以下のものが必要になります。

- データセンター
- 電源
- ラック
- サーバ
- 空調
- 回線
- ストレージ　など

物理的な機器をそろえるには、労力と手間、初期コストがかかります。これらの手間やコストを抑えてネットワークが構築できる点が、このVPCの最大のメリットです。

### AWS ドキュメント

[VPC サービス概要](https://aws.amazon.com/jp/vpc/)

[VPC ドキュメント](https://docs.aws.amazon.com/ja_jp/vpc/?id=docs_gateway)

[vpc よくある質問](https://aws.amazon.com/jp/vpc/faqs/)

[vpc の料金](https://aws.amazon.com/jp/vpc/pricing/)

### 学習リソース

【AWS Black Belt Online Seminar】[Amazon VPC(YouTube)](https://www.youtube.com/watch?v=JAzsGRS_o4c)(0:53:33)

![blackbelt-vpc](/images/blackbelt/blackbelt-vpc-320.jpg)

【AWS Black Belt Online Seminar】[Amazon VPC Advanced(YouTube)](https://www.youtube.com/watch?v=WCq_2-zkV44)(0:46:32)

![blackbelt-vpc-advanced](/images/blackbelt/blackbelt-vpc-advanced-320.jpg)

## VPC の基本

### VPC を構成する要素

VPC は以下のコンポーネントで構成されます。

| 要素 | 役割 |
|------|------|
| サブネット | VPC の IP アドレス範囲を分割する単位 |
| ルートテーブル | サブネットのアウトバウンド経路を定義 |
| インターネットゲートウェイ（IGW） | VPC とインターネット間の双方向通信を担う |
| NAT ゲートウェイ（NAT GW） | プライベートサブネットからのアウトバウンドのみ許可 |
| セキュリティグループ（SG） | ENI 単位のステートフルなトラフィック制御 |
| ネットワーク ACL（NACL） | サブネット単位のステートレスなトラフィック制御 |
| VPC Router | 各サブネットの `.1` に暗黙的に存在する仮想ルーター |
| DHCP オプションセット | DNS・NTP 設定を VPC 内リソースに配布 |

![vpc-overview.png](/images/vpc/vpc-overview.png)

## CIDR 設計

VPC を作成する際に、VPC 全体の IP アドレス範囲を CIDR ブロックで指定します。

- 指定できる範囲は `/16`（65,536 アドレス）〜 `/28`（16 アドレス）
- [RFC 1918](http://www.faqs.org/rfcs/rfc1918.html) のプライベートアドレス帯（`10.0.0.0/8`、`172.16.0.0/12`、`192.168.0.0/16`）を使うのが一般的
- **VPC 作成後に既存の CIDR を変更・削除することはできない**

:::message alert
オンプレミスや他の VPC と CIDR が重複すると、VPC Peering や Transit Gateway での接続ができなくなります。マルチアカウント・ハイブリッド環境を想定する場合は、アドレス帯を事前に整理してから設計してください。
:::

[VPC CIDR ブロック（公式）](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-cidr-blocks.html)

### セカンダリ CIDR の追加

VPC 作成後に、セカンダリ CIDR ブロックを追加することができます。IP アドレスが枯渇してきた場合や、用途別にアドレス帯を分けたい場合に利用します。

```
プライマリ CIDR  : 10.0.0.0/16（作成時に設定）
セカンダリ CIDR  : 10.1.0.0/16（後から追加可能）
```

ただし、以下の制約があります。

- 1 つの VPC に追加できる CIDR ブロックは最大 **5 つ**（デフォルト）
  - 参考：[VPCクォータ](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/amazon-vpc-limits.html)
- 既存の CIDR と重複するアドレス帯は追加できない
- 追加した CIDR の削除は可能だが、そのアドレス帯を使用中のサブネットがある場合は削除できない

## DHCP オプションセット

DHCP オプションセットは、VPC 内のリソースに対して DNS サーバーや NTP サーバーなどのネットワーク設定を自動配布する仕組みです。VPC 作成時にデフォルトの DHCP オプションセットが自動的に関連付けられます。

### デフォルトの設定

| オプション | デフォルト値 | 説明 |
|-----------|------------|------|
| domain-name-servers | AmazonProvidedDNS | VPC の DNS リゾルバー（ベースアドレス +2）を使用 |
| domain-name | リージョンによる（例：`ap-northeast-1.compute.internal`） | EC2 インスタンスのデフォルトドメイン名 |

`AmazonProvidedDNS` は各サブネットの CIDR ベースアドレス +2 の IP（例：`10.0.0.2`）で動作する AWS 提供の DNS サーバーです。

:::message
**Route 53 Resolver との関係**

`AmazonProvidedDNS` の実体は **Route 53 Resolver** です。VPC 内のリソースが `amazonaws.com` などの AWS サービスや、Route 53 で管理するプライベートホストゾーンの名前解決を行う際に使われます。オンプレミスとのハイブリッド環境では、Route 53 Resolver のインバウンド／アウトバウンドエンドポイントを使って、VPC とオンプレミス間の DNS 解決を双方向に構成できます。
:::

### カスタム DHCP オプションセットが必要なケース

- オンプレミスの DNS サーバーを使わせたい場合
- NTP サーバーを独自に指定したい場合

:::message alert
DHCP オプションセットは**作成後に変更できません。** VPC の設定を変えたい場合は、新しい DHCP オプションセットを作成して VPC に関連付け直す必要があります。

また、VPC に新しい DHCP オプションセットを関連付けた後、インスタンスの**再起動は不要**です。DHCP リースが更新されるタイミング（数時間以内）で自動的に反映されます。即時反映したい場合は OS 側でリース更新を実行してください。
:::

[DHCP オプションセット（公式）](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/DHCPOptionSet.html)

### インターネットゲートウェイ

IGW は、VPC 内のリソースとインターネット間の双方向通信を可能にするコンポーネントです。

- VPC に 1 つアタッチする（AZ をまたいで利用可能）
- AWS 側で冗長化・高可用性が担保されている
- IGW 自体の料金は無料（データ転送料金は別途発生）

パブリックサブネットのリソース（ALB、NAT GW、EIP を持つ EC2 など）が、インターネットと通信する際に使用します。

### NATゲートウェイ

NAT GW は、プライベートサブネット内のリソースがインターネットへアウトバウンド通信をする際に使用します。インターネット側からの接続開始（インバウンド）はできません。

- **パブリックサブネット**に配置する
- AZ ごとに配置することで冗長性を確保する
- データ処理量とアイドル時間で課金が発生する

:::message
コスト最適化として、S3 や DynamoDB へのアクセスは NAT GW を経由させず、**VPC エンドポイント（Gateway 型、無料）** を使うことを推奨します。
:::

#### リージョナル NAT ゲートウェイ（2025年11月〜）

[2025年11月19日のアップデート](https://aws.amazon.com/jp/about-aws/whats-new/2025/11/aws-nat-gateway-regional-availability/)で、**リージョナル NAT ゲートウェイ**が利用可能になりました。

従来の NAT GW（ゾーナル NAT GW）は AZ 単位で固定されていたため、マルチ AZ 環境では以下の作業が必要でした。

- AZ ごとに NAT GW を作成する
- AZ ごとにパブリックサブネットを用意する
- 新しい AZ にワークロードを追加するたびにルートテーブルを手動更新する

リージョナル NAT GW では、これらが不要になります。

| 観点 | ゾーナル NAT GW（従来） | リージョナル NAT GW（新） |
|------|----------------------|------------------------|
| 配置単位 | AZ 単位 | リージョン単位 |
| パブリックサブネット | AZ ごとに必要 | 不要 |
| マルチ AZ 対応 | 手動で AZ 数分作成 | 自動でスケール |
| ルートテーブル | AZ ごとに設定 | 単一の NAT GW ID に集約可 |
| プライベート NAT | ✅ 対応 | ❌ 非対応 |

[リージョン NAT ゲートウェイ（公式）](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/nat-gateways-regional.html)

#### NAT インスタンス

[NAT インスタンス](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/VPC_NAT_Instance.html)は、EC2 インスタンスに NAT 機能を持たせることで、NAT GW の代替とする方法です。

:::message alert
これまでは、AWS が公式に提供していた NAT 専用 AMI(Amazon Linux 2) がありましたが、すでに廃止されており、**NAT GW への移行を推奨**しています。要件によってNATインスタンスが必要な場合は、Amazon Linux 2023 などから[自前でセットアップ](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/work-with-nat-instances.html#create-nat-ami)する必要があります。
:::

NAT インスタンスが選択肢に上がるのは、主に**開発・検証環境のコスト削減**が目的の場合です。EC2 料金のみで安価で利用できるのはもちろんのこと、NATゲートウェイでは簡単に実現できなかった一時的に停止することが可能です。

| 観点 | NAT GW | NAT インスタンス |
|------|--------|----------------|
| 管理 | AWS マネージド | 自己管理（OS パッチ等） |
| 可用性 | AWS が担保 | 自前で冗長化が必要 |
| コスト | 比較的高め | EC2 料金のみで安価 |
| 帯域 | 自動スケール | インスタンスタイプに依存 |
| 推奨環境 | 本番環境 | 開発・検証環境のみ |

NAT インスタンスを使う場合は、以下の設定が必須です。

```bash
# ソース/デスティネーションチェックの無効化（必須）
aws ec2 modify-instance-attribute \
  --instance-id i-xxxxxxxxxx \
  --no-source-dest-check

# OS側のIPフォワード有効化（必須）
sudo sysctl -w net.ipv4.ip_forward=1
```

AWS CDK の `NatInstanceProviderV2` を使うことで、NAT インスタンスを手軽に利用することもできます。この L2 コンストラクトでは、以下の[ユーザーデータ](https://github.com/aws/aws-cdk/blob/v2.261.0/packages/aws-cdk-lib/aws-ec2/lib/nat.ts#L486)を実行しています。

```typescript
  public static readonly DEFAULT_USER_DATA_COMMANDS = [
    'yum install iptables-services -y',
    'systemctl enable iptables',
    'systemctl start iptables',
    'echo "net.ipv4.ip_forward=1" > /etc/sysctl.d/custom-ip-forwarding.conf',
    'sudo sysctl -p /etc/sysctl.d/custom-ip-forwarding.conf',
    "sudo /sbin/iptables -t nat -A POSTROUTING -o $(route | awk '/^default/{print $NF}') -j MASQUERADE",
    'sudo /sbin/iptables -F FORWARD',
    'sudo service iptables save',
  ];
```

### サブネット

サブネットとは、VPCで利用可能なIPアドレスの範囲を分割したものです。サブネットはかならず単一のAZ単位に属します。

```text
Region (ap-northeast-1)
└── VPC (10.0.0.0/16)
    ├── Subnet-Public-A   (10.0.0.0/24)  ← AZ: ap-northeast-1a
    ├── Subnet-Private-A  (10.0.10.0/23) ← AZ: ap-northeast-1a
    ├── Subnet-Public-C   (10.0.1.0/24)  ← AZ: ap-northeast-1c
    └── Subnet-Private-C  (10.0.11.0/23) ← AZ: ap-northeast-1c
```

![subnet-diagram.png](/images/vpc/subnet-diagram.png)

### サブネットの種別

[AWS 公式ドキュメント](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/configure-subnets.html#subnet-types)ではサブネットを以下の 5 種に分類しています。
サブネット定義にこのような設定があるのではなく、後述するルートテーブルで定義されるルートによってそのような役割で呼んでいるだけとなります。プライベートサブネットのつもりでも、IGWのルートをもてば事実上のパブリックサブネットとなってしまいます。

| 種別 | 説明 | 用途例 |
|------|------|--------|
| パブリックサブネット | ルートテーブルに IGW へのルートが存在する | ALB、NAT GW、踏み台 EC2 |
| プライベートサブネット | IGW へのルートがない（NAT 経由でアウトバウンドのみ可） | アプリ層、コンテナ |
| VPN-only サブネット | VGW へのルートのみ存在する | Direct Connect 延伸環境 |
| Isolated サブネット | VPC 外へのルートが一切ない | DB 層、高セキュリティ要件 |
| EVS サブネット | Amazon EVS を使用して作成 | Amazon EVS を使用して作成 |

#### AWSが予約する5つのIPアドレス

サブネットに指定した CIDR ブロックで、先頭 4 つと末尾 1 つは AWS に[予約](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/subnet-sizing.html)されています。

例：`10.0.0.0/24` の場合

| アドレス | 用途 |
|---------|------|
| 10.0.0.0 | ネットワークアドレス |
| 10.0.0.1 | VPC ルーター |
| 10.0.0.2 | DNS サーバー（VPC ベース +2） |
| 10.0.0.3 | AWS 将来利用予約 |
| 10.0.0.255 | ブロードキャスト（VPC では未使用だが予約） |

`/24`（256 アドレス）で実際に使えるのは **251 個**です。設計時に必ずこの 5 つを差し引いて計算してください。
このような予約アドレスが存在するため、サブネットを細かくすると利用できないIPアドレスが多くなります。
サブネットは多すぎず、少なすぎず適切な単位で分けることを検討してください。

また、AWSリソースによっては、推奨するサブネットマスクのサイズが記載されているものもありますのでサブネット設計時には利用するサービスのドキュメントを把握しておきましょう。

AWSドキュメント＞[ロードバランサーのサブネット](https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/application/application-load-balancers.html#subnets-load-balancer)

```text
ロードバランサーが正しくスケールできるように、ロードバランサーのアベイラビリティーゾーンサブネットごとに
 CIDR ブロックを最低でも /27 ビットマスク (例: 10.0.0.0/27) にし、
 少なくとも各サブネットにつき 8 個の空き IP アドレスを用意してください。
```

#### サブネット構成例

![subet-example.png](/images/vpc/subet-example.png)

アプリケーション用サブネットからアドレス範囲を割り当てています。`/24`のほうから割り当てると、パブリックサブネットとデータレイヤー用の `/26` が `10.0.2.x` 台に収まります。
これをパブリックサブネットから割り当てると、パブリックサブネット `/26` とアプリケーション用サブネット `/24` の間に `10.0.0.128–10.0.0.255` 、つまり `10.0.0.128/25` という分割しにくい空アドレス空間が発生してしまうためです。

| 項目 | CIDR | ネットワーク範囲 | 総ホスト数 |
| --- | --- | --- | --- |
| VPC | 10.0.0.0/22 | 10.0.0.0 - 10.0.3.255 | 1,024 |
| パブリックサブネット① | 10.0.2.0/26 | 10.0.2.0 - 10.0.2.63 | 64 |
| パブリックサブネット① | 10.0.2.64/26 | 10.0.2.64 - 10.0.2.127 | 64 |
| プライベートサブネット(アプリケーション用①) | 10.0.0.0/24 | 10.0.0.0 - 10.0.0.255 | 256 |
| プライベートサブネット(アプリケーション用②) | 10.0.1.0/24 | 10.0.1.0 - 10.0.1.255 | 256 |
| プライベートサブネット(データレイヤー用①)| 10.0.2.128/26 | 10.0.2.128 - 10.0.2.191 | 64 |
| プライベートサブネット(データレイヤー用②)| 10.0.2.192/26 | 10.0.2.192 - 10.0.2.255 | 64 |
| 空き(15.6%) | 10.0.3.0/25, 10.0.3.128/27  | 10.0.3.0-10.0.3.159 | 160 |
| プライベートサブネット(VPCエンドポイント用①)| 10.0.3.160/27 | 10.0.3.160 - 10.0.3.191 | 32 |
| プライベートサブネット(VPCエンドポイント用②)| 10.0.3.192/27 | 10.0.3.192 - 10.0.3.223 | 32 |
| プライベートサブネット(Transit Gateway用①)| 10.0.3.224/28 | 10.0.3.224 - 10.0.3.239 | 16 |
| プライベートサブネット(Transit Gateway用②)| 10.0.3.240/28 | 10.0.3.240 - 10.0.3.255  | 16 |

### ルートテーブル

ルートテーブルは、サブネットから出るトラフィックがどこに向かうかを定義します。各サブネットは必ず 1 つのルートテーブルに関連付けします。

### ルートテーブルの例

| Destination | Target | 説明 |
|------------|--------|------|
| 10.0.0.0/16 | local | VPC 内部通信（自動生成・削除不可） |
| 0.0.0.0/0 | igw-xxxx | インターネット宛て（パブリックサブネット用） |
| 0.0.0.0/0 | nat-xxxx | インターネット宛て（プライベートサブネット用） |
| 10.1.0.0/16 | tgw-xxxx | オンプレや別 VPC 宛て（TGW 経由） |

:::message alert
プライベートサブネットのルートテーブルに誤って IGW へのルートを追加してしまうと、そのサブネットは事実上パブリックになります。セキュリティグループでインバウンドを制限していても、**ルートテーブルレベルで IGW ルートがある = パブリックサブネット**です。
:::

## セキュリティグループ（SG）

セキュリティグループは、ENI（Elastic Network Interface）単位でトラフィックを制御する**ステートフル**なファイアウォールです。

EC2 インスタンスへ適用しているように見えますが、実際には EC2 に紐づく ENI に対してセキュリティグループが関連付けられています。

- インバウンドとアウトバウンドのルールを個別に定義する
- **Allow ルールのみ**設定可能（Deny ルールは設定できない）
- ステートフルのため、許可したインバウンドへの戻りトラフィックは自動的に許可される
- デフォルトでは全インバウンド拒否・全アウトバウンド許可

### ステートフルとは

ステートフルとは、**通信の状態を追跡する**ことを意味します。

SG はステートフルなため、インバウンドで許可した通信の戻りトラフィック（レスポンス）は、
アウトバウンドルールに記載がなくても自動的に許可されます。

例：クライアントから EC2 の TCP 443 へのリクエストを許可した場合
- インバウンド：TCP 443 を許可 → ✅ 通信が届く
- アウトバウンド：設定不要 → ✅ レスポンスが自動的に返る

## ネットワーク ACL（NACL）

ネットワーク ACL は、**サブネット単位**でトラフィックを制御する**ステートレス**なファイアウォールです。

- インバウンドとアウトバウンドのルールを個別に定義する
- **Allow と Deny の両方**を設定できる
- ステートレスのため、インバウンドを許可しても、戻りトラフィック用のアウトバウンドルールを別途設定する必要がある
- ルール番号の昇順で評価され、最初にマッチしたルールが適用される
- デフォルトでは全トラフィック許可

:::message alert
NACL で Deny ルールを設定する場合、**エフェメラルポート（1024〜65535）のアウトバウンドを開けているか**を確認してください。ステートレスのため戻りパケットが弾かれ、「つながらない」というトラブルが発生します。
:::

### ステートレスとは

ステートレスとは、**通信の状態を追跡しない**ことを意味します。

NACL はステートレスなため、インバウンドを許可しても戻りトラフィックは自動許可されません。インバウンドとアウトバウンドを**それぞれ個別に**設定する必要があります。

例：クライアントから EC2 の TCP 443 へのリクエストを許可した場合
- インバウンド：TCP 443 を許可 → ✅ 通信が届く
- アウトバウンド：エフェメラルポート（1024〜65535）を許可 → ✅ レスポンスが返る
  - ※ 設定しないと ❌ レスポンスが弾かれる

## セキュリティグループと NACL の比較

| 観点 | セキュリティグループ（SG） | ネットワーク ACL（NACL） |
|------|--------------------------|------------------------|
| 適用単位 | ENI（リソース）単位 | サブネット単位 |
| ステートフル | ✅ Yes | ❌ No |
| Allow / Deny | Allow のみ | Allow と Deny 両方 |
| ルール評価 | 全ルールを評価 | 番号順（最初にマッチで終了） |
| デフォルト状態 | 全インバウンド拒否 | 全トラフィック許可 |

使い分けの指針は以下のとおりです。

- **基本はセキュリティグループ**でリソース単位の制御を行う
- **NACL は補助的**に使う（特定 IP からの通信を一括 Deny したいときなど）

[セキュリティグループとネットワーク ACL を比較する（公式）](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/infrastructure-security.html#VPC_Security_Comparison)

## VPC エンドポイント

VPC エンドポイントは、インターネットを経由せずに AWS サービスへ接続するための仕組みです。

| 種類 | 仕組み | 対応サービス例 | 料金 |
|------|--------|--------------|------|
| **Gateway エンドポイント** | ルートテーブルにエントリを追加 | S3、DynamoDB | **無料** |
| **Interface エンドポイント** | サブネット内に ENI として配置（PrivateLink） | ほぼ全 AWS サービス | 有料 |

:::message
S3 と DynamoDB は必ず **Gateway エンドポイント**を使いましょう。設定するだけで NAT GW 経由のデータ転送料金を削減できます。
:::

## VPC フローログ

VPC フローログは、VPC 内の ENI を通過する IP トラフィックのメタデータを記録する機能です。

- 出力先は、CloudWatch Logs / S3 / Kinesis Data Firehose です
- パケットの中身（ペイロード）は記録しない
- `action` フィールドが `REJECT` のレコードを確認することで、SG や NACL に弾かれた通信を特定できる

### フローログの主なフィールド（v2）

```
version  account-id  interface-id  srcaddr  dstaddr  srcport  dstport  protocol  packets  bytes  start  end  action  log-status
```

| フィールド | 説明 |
|-----------|------|
| srcaddr / dstaddr | 送信元・送信先 IP アドレス |
| srcport / dstport | 送信元・送信先ポート番号 |
| action | ACCEPT または REJECT |
| log-status | OK / NODATA / SKIPDATA |

[VPC フローログ（公式）](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/flow-logs.html)

## 📖 まとめ

![vpc-summary.png](/images/vpc/vpc-summary-320.jpg)