summary: Summary
id: elb-overview
categories: AWS
tags: AWS ELB
status: Published
authors: ishr
Feedback Link: 

# Elastic Load Balancing(ELB)

## Contents

- ELB とは
- ELB の基本
- ELB の種類
- サブネットに必要な CIDR
- スティッキーセッション
- クロスゾーン負荷分散
- Connection Draining
- アクセスログ
- 他のサービスとの連携

## ELB とは
Duration: 01:00

![](../articles_images/elb/files/elb.png)

Elastic Load Balancing は、受信したトラフィックを複数のアベイラビリティーゾーンの複数のターゲット (EC2 インスタンス、コンテナ、IP アドレスなど) に自動的に分散させます。さらに、登録されているターゲットの状態をモニタリングし、正常なターゲットにのみトラフィックをルーティングします。

【AWS Black Belt Online Seminar】[Elastic Load Balancing (ELB)(YouTube)](https://www.youtube.com/watch?v=4laAoK-zXko)

![](articles_images/elb/files/blackbelt_elb.jpg)

【AWS Black Belt Online Seminar】[Gateway Load Balancer(YouTube)](https://www.youtube.com/watch?v=tiwgoSNvh3k)

![](articles_images/elb/files/blackbelt_glb.jpg)


[Elastic Load Balancing 概要](https://aws.amazon.com/jp/s3/)

[Elastic Load Balancing ドキュメント](https://docs.aws.amazon.com/ja_jp/s3/?id=docs_gateway)

[Elastic Load Balancing のよくある質問](https://aws.amazon.com/jp/elasticloadbalancing/faqs/)



## ELB の基本
Duration: 02:00

- Internet-Facing（インターネットからアクセス可）とInternal（VPC内など）の2種類がある
    - Internet-Facing はパブリックサブネットのみ配置可
    - Internal はプライベートサブネットにも配置可
    - ![](articles_images/elb/files/create_elb.png)
- 上記どちらもデフォルトでは、「xxxxxx.ap-northeast-1.elb.amazonaws.com」といった DNS 名が付与されます。
    - ![](articles_images/elb/files/elb_dns.png)
- 独自ドメイン（例：www.example.com）が使用したい場合は、Route 53 のエイリアスレコードに登録することで利用可能です。
- 負荷の状態に応じて自動的にスケーリングを行うため、管理者が手動で ELB の台数を増やしたり（スケールアウト）、スペックを上げたり（スケールアップ）する必要がありません。
    - 構成図ではこのように書くことが多いが・・
        - ![](articles_images/elb/files/elb_scale_1.png)
    - 実際にはこのようにスケールアウトしています（クロスゾーン負荷分散が有効な場合の例）
        - ![](articles_images/elb/files/elb_scale_2.png)
    - ELBが拡張されたり縮小すると応答するIPアドレスの数が変わります。
    - ただし、負荷のスパイク（負荷急増）が発生すると自動スケーリングが間に合わず `503` を返す可能性があります。
    - その場合、暖機運転申請（Pre-Warming ※サポートプランがBussiness以上必要）か自前で段階的に負荷をあげていく仕組みを構築する必要があります。
- ELB で SSL 終端することができます。つまり、クライアント⇔ELB間はSSL通信で、ELB⇔バックエンド間はSSLなしの通信ができます。これにより、バックエンド側での SSL 処理の負荷を軽減できます。
    - ![](articles_images/elb/files/elb_ssl.png)
- 起動している時間（1時間単位）＋LCU（ロードバランサーキャパシティーユニット）で課金されます。
    - 東京リージョンだと最低でも月額 $ 25程度は必要になります。

## ELB の種類
Duration: 05:00

### CLB:Classic Load Balancer
AWS ドキュメント > [Classic Load Balancer とは?](https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/classic/introduction.html)

- L4/L7 で負荷分散
- クロスゾーン負荷分散がデフォルトで有効
- スティッキーセッション（sticky session）
- 対応できるプロトコルは多いが複雑な設定ができないため、通常は、ALB や NLB を使用する。
- 旧タイプのロードバランサ、<font color="red">現在は非推奨</font>となっています。
- MTU=9,001(ジャンボフレーム)、変更不可

### ALB:Application Load Balancer

AWS ドキュメント > [Application Load Balancer とは?](https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/application/introduction.html)

- ALB の概要と関連するサービス
    - ![](articles_images/elb/files/alb_overview.png)
- L7(アプリケーション層) で負荷分散（URL や HTTP ヘッダーで負荷分散が可能）
- クライアントと ALB 間は、HTTP/2 に対応していましたが、暫くの間は ALB とターゲット間の通信は、HTTP/1.1 に変換されていました。現在は、「HTTP/1.1」「HTTP/2」「gRPC」に対応
    - ※ gRPC とは、RPC (Remote Procedure Call) を実現するためにGoogleが開発したプロトコルの1つです。RPCを使うことでリモート（Remote）にある関数/手続き（Procedure）を呼ぶ（Call）ことができます。
    - https://ja.wikipedia.org/wiki/GRPC
- 利用するには、2 AZ 以上が必要（1 AZ では起動できない）、3 AZ 構成が望ましい。選択する AZ 数は ALB 自体のコストに影響ありません。ただし、AZ 数が増えるということは、ロードバランサー配下のノード数も増えるので、その分のコストは発生します。
- IP固定不可
    - 固定したい場合は、NLBやAWS Global Acceleratorを前段に配置する
- Web アプリケーションを実行するサーバでは最も利用されているロードバランサーです
- ターゲットは、インスタンスID、IPアドレス、Lambda
- URL、リクエストヘッダー、リクエスト元IPでターゲットグループで振り分け可能
- ルーティングアルゴリズムは、ラウンドロビン
- クロスゾーン負荷分散がデフォルトで有効
- スティッキーセッション（sticky session）
    - 同一クライアントからのリクエストを同一のターゲットにルーティング可
- セキュリティグループでアクセスを制御します
- AWS WAF を関連付けて、Webアプリケーションの脆弱性を保護することができます。
- MTU=9,001(ジャンボフレーム)、変更不可

### NLB:Network Load Balancer

AWS ドキュメント > [Network Load Balancer とは?](https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/network/introduction.html)

- NLB の概要と関連するサービス
    - ![](articles_images/elb/files/nlb_overview.png)
- L4（トランスポート層） で負荷分散（IPアドレスとポート番号による負荷分散が可能）
- HTTP(S) 以外、TCP、UDP
- 1AZ以上
- IP固定可
- 超低遅延で高スループットを維持しながら、秒間何百万リクエストをさばける様に設計
- 大量のアクセスがあり、非常に高度なパフォーマンスが要求されるサーバーや、アプリケーションで静的IPが必要な場合に向いているロードバランサー
- ターゲットは、インスタンスID、IPアドレス
- ルーティングアルゴリズムは、フローハッシュアルゴリズム
- ALB とは違い、クロスゾーン負荷分散はデフォルトで無効
- スティッキーセッション（sticky session）
- セキュリティグループが設定できない
    - バックエンドのインスタンスに関連付けしたセキュリティグループで制御
- MTU=9,001(ジャンボフレーム)、変更不可

### GLB:Gateway Load Balancer

AWS ドキュメント > [Gateway Load Balancer とは?](https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/gateway/introduction.html)

- GLB 概要
    - ![](articles_images/elb/files/glb.jpg)
- 2021年に発表された、セキュリティアプライアンス（ファイアウォールなど）をデプロイしたり、スケール、管理ができるようにするサービス
- 従来、トラフィックの監査を行う場合、EC2 上にサードパーティ製の仮想アプライアンスを構築する必要があり、それに対して冗長化は大変だったが、この課題を解消することができるサービス
- L3（ネットワーク層）で負荷分散
- クロスゾーン負荷分散はデフォルトで無効
- MTU=8,500、変更不可


## サブネットに必要な CIDR
Duration: 01:00

AWS ドキュメント > Elastic Load Balancing > [ロードバランサーのサブネット](https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/application/application-load-balancers.html#subnets-load-balancer)

ELB を配置するサブネットの CIDR は最小で 「27」が必要であり、8個以上の IP アドレスの空きが必要です。



![](articles_images/elb/files/ELB_CIDR.png)

## スティッキーセッション
Duration: 01:00

AWS ドキュメント > [Application Load Balancer のスティッキーセッション](https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/application/sticky-sessions.html)

AWS ドキュメント > Network Load Balancer > [スティッキーセッション](https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/network/load-balancer-target-groups.html#sticky-sessions)

ロードバランサーが生成した Cookie（AWSALB）を使用して同じターゲットにルーティングする機能です。クロスオリジンリソース共有 (CORS) リクエストの場合、「AWSALBCORS」を生成します。
ロードバランサーが生成する AWSALB は、ローテーションキーを使用して暗号化されており、復号することは出来ません。また、中身が同じ内容なのかも分かりません。

ロードバランサーが生成する Cookie の他に、アプリケーションによって生成する Cookie を指定することも可能です。Cookie 名は自由に指定することができますが、ロードバランサーが予約している名称は使用できません（AWSALB、AWSALBAPP、または AWSALBTGなど）

可能であれば、セッション管理などは、Amazon ElastiCache や Amazon Aurora などのデータベースで保持しておくほうが ELB が振り分けるノードに障害があった場合にも影響を受けにくくなります。

## クロスゾーン負荷分散
Duration: 05:00

複数 AZ に跨るノードに対しても均等にトラフィックを分散するようにできるオプションです。

どういうことかというと、
ELB が２つの AZ に配置されている場合は、ラウンドロビンルーティングによって、それぞれの ELB に 50%のトラフィックが分散されます。
次のようにノードが等しくなるような構成の場合、それぞれのノードは 25%のトラフィックを処理します。

![](../articles_images/elb/files/elb_normal.png)

ELB 配下にあるノードが異なっている場合には以下のようにトラフィックが偏ります。
この例の場合は、1台のノードが50%のトラフィックを処理している状態になります。

![](../articles_images/elb/files/xz_off_1.png)

実際は、各 AZ に1台ずつ ELB が存在し、ELB に対してはラウンドロビンルーティングによって、50％ずつに振り分けられます。ELB は、自身と同じ AZ に存在するノードのみに振り分けを行うことからこのような偏りが発生します。

![](../articles_images/elb/files/xz_off_2.png)

これを解消し、以下のように均等にトラフィックを分散させるためのオプションが、<font color="red">クロースゾーン負荷分散</font>です。クロースゾーン負荷分散が有効になっている場合、全てのノードの数に応じて均等に分散されます。ALB ではデフォルトで有効になっているため、意識しないで利用しています。

![](../articles_images/elb/files/xz_on_1.png)

実際は、以下のようになっており、各 ELB がAZ を跨いだノードに対して分散させるためトラフィックが均等になります。

![](../articles_images/elb/files/xz_on_2.png)

ただし、<font color="red">赤色の線は、AZ を跨いだ通信となっており、データ容量で課金される部分です。</font>
この課金有無は、ELB の種類で異なっています。
「よくある質問」にも以下のように記載があり、ALB のみ課金されません。

![](../articles_images/elb/files/xz_faq.png)

## Connection Draining
Duration: 01:00

ELB の配下のノードを切り離す場合、いきなり切り離されると、ノードで実行中だった場合にアプリケーション側でエラーが出てしまいます。
そのため、切り離し対象のノードへのリクエストが終わるまで一定時間切り離しを待機してくれる機能です。
この機能は、デフォルトで有効化されています。
待機時間のデフォルトで 300秒となっており、最大で 3,600 秒まで設定できます。
指定された待機時間に達した場合は、強制的に切り離しが実施されます。

## アクセスログ
Duration: 02:00

ELB のアクセスログは、S3に出力することができます。アクセスログは5分ごとに出力されます。

出力されるログファイルのキーは、次のようになっています。

```
bucket[/prefix]/AWSLogs/aws-account-id/elasticloadbalancing/region/yyyy/mm/dd/aws-account-id_elasticloadbalancing_region_app.load-balancer-id_end-time_ip-address_random-string.log.gz
```

ロードバランサーのアクセスログを出力する AWS アカウントIDはリージョンで異なるため、S3 バケットのバケットポリシーを設定する場合は注意が必要です。
リージョンとアカウント ID の対応は次のドキュメントを参照します。

東京リージョンの場合は、アカウントID「582318560864」を指定して、次のように記述します。

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::582318560864:root"
      },
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::bucket-name/prefix/AWSLogs/your-aws-account-id/*"
    }
  ]
}
```

AWS ドキュメント > [S3 バケットにポリシーをアタッチする](https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/application/enable-access-logging.html#attach-bucket-policy)

出力されたアクセスログは、Amazon Athena を利用することで簡単に分析することができます。

分析のためのテーブル作成やクエリについては、下記ドキュメントで説明があります。

AWS ドキュメント > [Application Load Balancer ログのクエリ](https://docs.aws.amazon.com/ja_jp/athena/latest/ug/application-load-balancer-logs.html)

AWS ドキュメント > [Network Load Balancer のログのクエリ](https://docs.aws.amazon.com/ja_jp/athena/latest/ug/networkloadbalancer-classic-logs.html)

AWS ドキュメント > [Classic Load Balancer ログのクエリ](https://docs.aws.amazon.com/ja_jp/athena/latest/ug/elasticloadbalancer-classic-logs.html)

## 他のサービスとの連携
Duration: 01:00

- 独自ドメインを使いたい
    - Amazon Route 53
- CDN
    - Amazon CloudFront
- バックエンドノードの可用性を高めたい
    - AWS Auto Scaling
- SQL インジェクションや XSS などの脆弱性から保護したい
    - AWS WAF
- ALB で IP アドレスを固定したい
    - AWS Global Accelerator

=== 以上 ===