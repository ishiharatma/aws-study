---
title: "【初心者向け】Amazon CloudFront について改めて整理してみた" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: false
---

# Amazon CloudFront

## はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## Contents

- [Amazon CloudFront](#amazon-cloudfront)
  - [はじめに](#はじめに)
  - [Contents](#contents)
  - [Amazon CloudFront とは](#amazon-cloudfront-とは)
  - [CloudFront の基本](#cloudfront-の基本)
    - [ディストリビューション](#ディストリビューション)
    - [オリジン](#オリジン)
    - [エッジロケーション](#エッジロケーション)
    - [リージョン別エッジキャッシュ](#リージョン別エッジキャッシュ)
    - [ビヘイビア（Behavior）](#ビヘイビアbehavior)
    - [キャッシュ無効化（Invalidation）](#キャッシュ無効化invalidation)
    - [圧縮機能](#圧縮機能)
  - [料金クラス](#料金クラス)
  - [署名付き URL と署名付き Cookie](#署名付き-url-と署名付き-cookie)
  - [S3 オリジンへのアクセス制限](#s3-オリジンへのアクセス制限)
  - [ALB オリジンへのアクセス制限](#alb-オリジンへのアクセス制限)
  - [コンテンツを地理的に制限](#コンテンツを地理的に制限)
  - [AWS Shield](#aws-shield)
  - [AWS WAFによるアクセスコントロール](#aws-wafによるアクセスコントロール)
  - [CloudFront Origin Shield](#cloudfront-origin-shield)
  - [AWS Lambda@Edge](#aws-lambdaedge)
  - [ログ記録](#ログ記録)
  - [監視](#監視)
  - [Use CloudFront continuous deployment to safely validate CDN changes(New: 2022-11-18)](#use-cloudfront-continuous-deployment-to-safely-validate-cdn-changesnew-2022-11-18)
  - [まとめ](#まとめ)

## Amazon CloudFront とは

Duration: 2:26:37

CloudFront とは、大容量キャパシティを持つ地理的に分散したサーバー群（エッジロケーション）にコンテンツをキャッシュしたり、代理配信をするコンテンツ配信ネットワーク (CDN（Content Delivery Network）) サービスです。

CDN を導入することによって、ユーザーに一番近いエッジロケーションから配信することによる高速化と、エッジサーバーでコンテンツをキャッシュすることによるオリジンの負荷軽減ができるというメリットがあります。

CloudFront は従量課金のサービスであるため、使った分だけの支払でよいため安価に始められます。

【AWS Black Belt Online Seminar】[Amazon CloudFrontの概要(YouTube)](https://www.youtube.com/watch?v=mmRKzzOvJJY)(52:26)

![blackbelt-cloudfront_1](/images/cloudfront/blackbelt-cloudfront_1-320.jpg)

【AWS Black Belt Online Seminar】[Amazon CloudFront deep dive(YouTube)](https://www.youtube.com/watch?v=C9SnQibtY0A)(44:42)

![blackbelt-cloudfront_2](/images/cloudfront/blackbelt-cloudfront_2-320.jpg)

[AmazonCloudFrontのこの機能使えてますか(YouTube)](https://www.youtube.com/watch?v=-RldYeiMu2k)(27:31)

![blackbelt-cloudfront_3](/images/cloudfront/blackbelt-cloudfront_3-320.jpg)

[AWSで実践するCDNセキュリティ(YouTube)](https://www.youtube.com/watch?v=Ce4bEWDN5b0)(25:58)

![blackbelt-cloudfront_4](/images/cloudfront/blackbelt-cloudfront_4-320.jpg)

[Amazon CloudFront サービス概要](https://aws.amazon.com/jp/cloudfront/)

[Amazon CloudFront ドキュメント](https://docs.aws.amazon.com/ja_jp/cloudfront/?id=docs_gateway)

[Amazon CloudFront よくある質問](https://aws.amazon.com/jp/cloudfront/faqs/)

## CloudFront の基本

Duration: 0:00:30

### ディストリビューション

ドメイン毎に割り当てられる CloudFront の設定の単位です。デフォルトのドメイン名は「xxxx.cloudfront.net」となっていますが、CNAME エイリアスを利用することで、独自のドメインを割り当てることができます。

### オリジン

コンテンツのオリジナルを保持するサーバーのことです。EC2 や S3、オンプレミスのウェブサーバーなどが該当します。

### エッジロケーション

世界中に分散して配置されたサーバーでオリジンのデータをキャッシュします。ユーザーを最も近いエッジロケーションに誘導することで、高速に配信することができます。また、オリジンサーバへのアクセスを減らすことが出来るため、負荷軽減になります。

### リージョン別エッジキャッシュ

エッジロケーションとオリジンの中間のキャッシュ層です。
エッジロケーションにキャッシュがなければ、オリジンからコンテンツを取得する必要がありますが、ユーザーから遠いリージョンにオリジンがある場合はパフォーマンスの劣化が課題です。
この課題を解決するために導入されたのが、オリジンより近いリージョンの単位でキャッシュし、さらにエッジロケーションより大容量のキャッシュを保持する仕組みです。

### ビヘイビア（Behavior）

簡単にいうと、振り分けのルールです。URL のパスパターンでオリジンに振り分けることができます。パスパターンには優先度を付けることができます。
パスパターンには、「api/*」や「images/*.jpg」のようにファイルパターンまで限定したものも設定できます。
定義したパスパターンごとに以下を設定することが可能です。

- プロトコル
- 許可する HTTP メソッド
- キャッシュ
- TTL（Time To Live）
- 圧縮（gzip および Brotli）
- アクセス制限（署名付きURL、Cookie）

### キャッシュ無効化（Invalidation）

コンテンツの有効期限が切れる前に、エッジキャッシュからファイルを削除することが出来る機能です。

リリースした際にキャッシュを削除したい場合は手動で実施することができます。

全て消したい場合は、「/*」というパスにすることで一括で削除することができます。

![cloudfront-invalidation](/images/cloudfront/cloudfront-invalidation.png)

複数パスの指定も可能ですが、パスの単位でリクエストが発生することになります。

![cloudfront-invalidation-any](/images/cloudfront/cloudfront-invalidation-any.png)

1か月 1000 リクエストまでは無料ですが、それ以上は 0.005USD / リクエストで課金されますので頻繁に実施する場合は、注意が必要です。

### 圧縮機能

CloudFront エッジでコンテンツを gzip および Brotli 圧縮することで高速にコンテンツを配信することができる機能です。

![cloudfront-compress](/images/cloudfront/cloudfront-compress.png)

オリジンサーバが圧縮に対応していない場合でも、手軽に高速化を実現できます。

参考>[Brotli(Wikipedia)](https://ja.wikipedia.org/wiki/Brotli)

## 料金クラス

Duration: 0:01:30

[価格クラス](https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-specify.html#DownloadDistValuesPriceClass)

CloudFront はデフォルトでは世界中全てのエッジロケーションを利用し、クライアントのロケーションから最もレイテンシーが低いエッジロケーションから配信されます。

![cloudfront-priceclass](/images/cloudfront/cloudfront-priceclass.png)

コスト削減のため一部の地理的リージョンからのレイテンシーの増加を許容できる場合に次に示す料金クラスというものが選択できます。

- 料金クラス ALL（デフォルト）
- 料金クラス 200
- 料金クラス 100

高コストなエッジロケーションを使用しないようにすることで、コストを抑えることができます。
この料金クラスによって、ユーザーへの配信速度に影響がでる可能性があります。

この中で、日本が含まれるのは「料金クラス ALL」と「料金クラス 200」のみです。
日本リージョンの HTTPS リクエスト（1万件あたり）の料金は、0.0120 USD です。「料金クラス 100」を選択して北米リージョンに限定した場合の料金は、0.0100 USD となります。

高コストな南米やオーストラリアリージョンからのアクセスを想定しておらず、アクセスがあった場合でもレイテンシーの増加を許容できるならば、「料金クラス 200」を選択しておくとよいでしょう。

## 署名付き URL と署名付き Cookie

Duration: 0:01:30

[署名付き URL と署名付き Cookie を使用したプライベートコンテンツの提供](https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/PrivateContent.html)

プライベートコンテンツの配信に利用できる機能です。「ビューワーのアクセスを制限する」を有効にすることで利用できます。
CloudFront に登録したキーペアを利用して生成します。

![cloudfront-private-contents](/images/cloudfront/cloudfront-private-contents.png)


署名付き URL と署名付き Cookie の使い分けは次の通りです。

- 署名付き URL
  - 個別のファイルへのアクセス制限
  - ユーザーが Cookie をサポートしていないクライアント
- 署名付き Cookie
  - 複数のファイルへのアクセス制限
  - 現在の URL を変更したくない場合

## S3 オリジンへのアクセス制限

Duration: 0:00:30

[Amazon S3 オリジンへのアクセスの制限](https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)

S3 をオリジンに設定する場合、オリジンアクセスコントロール (OAC、旧オリジンアクセスアイデンティティ (OAI)) を設定することで、S3バケットをパブリックアクセス可能にすることなく、意図しない 別の CloudFront ディストリビューション経由のアクセスを制限することができます。

新しい OAC では、OAI で対応していなかった以下に対応できるようになっています。

- 細かなポリシー設定
- AWS Signature Version 4（SigV4） を必要とする AWS リージョンでの POST メソッド
- SSE-KMS を使用したバケット

OAI は引き続き使用することができますが、2022年12月以降に新たに作成されるリージョンでは、OAC のみのサポートとなります。

[Amazon CloudFront オリジンアクセスコントロール（OAC）のご紹介-2022/8/31](https://aws.amazon.com/jp/blogs/news/amazon-cloudfront-introduces-origin-access-control-oac/)

[オリジンアクセスアイデンティティ (OAI) からオリジンアクセスコントロール (OAC) への移行](https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html#migrate-from-oai-to-oac)

## ALB オリジンへのアクセス制限

Duration: 0:01:30

[Application Load Balancers へのアクセスを制限する](https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/restrict-access-to-load-balancer.html)

CloudFront のオリジンには ALB が設定できます。オリジンに設定するリソースは、パブリック IP によるアクセスができる必要があるため、ALBは インターネット向け（internet-facing）で作成します。

この状態ですと、CloudFront を経由しなくてもアクセスが可能になっています。これでは、CloudFront のメリットを生かすことができません。

ALB を CloudFront 経由のアクセスに限定することで、CloudFront のメリットを生かすことができるようになります。

※ ALB を Internal で構築した場合、オリジンに指定することはできますが、`403` エラーとなります。

## コンテンツを地理的に制限

Duration: 0:01:30

[コンテンツの地理的ディストリビューションの制限](https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/georestrictions.html)

指定した地域からのアクセスをブロックできる機能です。

![georestrictions](/images/cloudfront/cloudfront-georestrictions.png)

CloudFront は、サードパーティーのデータベースを使用して、ユーザーがいる場所を判別しており、IP アドレスと国のマッピングはリージョンによって異なるものの、正確性は 99.8% となっています。

ユーザーの場所が特定できなかったときはコンテンツが配信されます。

## AWS Shield

Duration: 0:00:30

CloudFront は、AWS Shield Standard によって追加料金なしで保護されています。

AWS Shield Advanced によってさらに高レベルの保護が可能になります。

ただし、1年のサブスクリプションで固定月額 3,000 USD と、さらにデータ転送量による課金が発生します。

この固定月額料金は、AWS Organizations を利用している場合は組織全体で共有され、アカウント単位で支払う必要はありません。ただし、データ転送量分はアカウント単位で支払う必要があります。

## AWS WAFによるアクセスコントロール

Duration: 0:00:30

[AWS WAF を使用してコンテンツへのアクセスの管理](https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/distribution-web-awswaf.html)

CDN は様々な脅威に晒されています。AWS WAF を利用して、それらのアクセスから保護することができます。

適用できるものは バージニア北部リージョンで作成した Web ACL のみです。

## CloudFront Origin Shield

Duration: 0:01:30

[Amazon CloudFront Origin Shield の使用](https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/origin-shield.html)

CloudFront は、クライアントからのリクエストをエッジロケーションで受け、エッジロケーションにキャッシュがない場合、リージョン別エッジキャッシュという中間層に送信します。

リージョン別エッジキャッシュにキャッシュがない場合は、オリジンにリクエストが送信されます。

![origin-shield-off](/images/cloudfront/cloudfront-origin-shield-off.png)

複数のリージョンで配信するサイトの場合、リージョン別エッジキャッシュからオリジンへのリクエストが重複して送信され、オリジンの負荷が上昇する可能性があります。

これを回避するために、リージョン別エッジキャッシュとオリジンの間の追加キャッシュレイヤーとして動作し、オリジンへの負荷を軽減します。

![origin-shield-on](/images/cloudfront/cloudfront-origin-shield-on.png)

デフォルトでは、「使用しない」となっています。使用する場合は追加コストが発生します。

## AWS Lambda@Edge

Duration: 0:01:30

[関数を使用してエッジでカスタマイズ](https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/edge-functions.html)

[Lambda@Edge 関数をトリガーできる CloudFront イベント](https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/lambda-cloudfront-trigger-events.html)

クライアントのロケーションに近い場所でコードを実行することができます。

![cloudfront-lambda@edge_1](/images/cloudfront/cloudfront-lambda-edge_1.png)

![cloudfront-lambda@edge_2](/images/cloudfront/cloudfront-lambda-edge_2.png)

ただし、以下のような制約が存在するので注意が必要です（2023年1月時点）。詳しくは、[Lambda@Edge に対する制限](https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/edge-functions-restrictions.html#lambda-at-edge-function-restrictions)を参照してください。

- 関数のバージョン指定に `$LATEST` が使用できず、バージョン番号を指定しなければならない
- Lambda@Edge に指定できる Lambda は北米リージョンで作成したもののみ
- Lambda 環境変数が利用できない
- AWS X-Ray 使用不可
- コンテナイメージの Lambda 使用不可
- arm64 アーキテクチャの Lambda 使用不可　など。

## ログ記録

Duration: 0:01:30

[標準ログ (アクセスログ) の設定および使用](https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/AccessLogs.html)

[リアルタイムログ](https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/real-time-logs.html)

ログは S3 へエクスポートすることができます（標準ログ）。ログはログ発生から 1時間以内にまたは、最大で 24時間遅延することがあります。

標準ログは追加料金が発生しませんが、S3 のアクセスと保管料金がかかります。

標準ログとは別に、リアルタイムログという機能があります。これは、Kinesis Data Streams を利用してログが配信されるようになる機能です。ただし、サポートするのは Kinesis Data Streams までですので、そこからログを取り出す Kiesis Data Firehose のようなコンシューマーが必要です。

Kiesis Data Firehose を使用した場合、インターバルが 60 ～900 秒ですので、リアルタイムといっても 最低 60秒は遅延します。これよりも短い間隔が必要な場合は独自のコンシューマーを構築する必要があります。

## 監視

Duration: 0:01:30

[Amazon CloudWatch による CloudFront メトリクスのモニタリング](https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/monitoring-using-cloudwatch.html)

CloudFront はデフォルトで記録されるメトリクスと、追加設定で記録されるメトリクスがあります。
追加メトリクスはメトリクスごとに料金がかかります。

- デフォルトメトリクス
  - ![cloudfront-metrics_1](/images/cloudfront/cloudfront-metrics_1.png)
- 追加メトリクス
  - ![cloudfront-metrics_2](/images/cloudfront/cloudfront-metrics_2.png)

## Use CloudFront continuous deployment to safely validate CDN changes(New: 2022-11-18)

Duration: 0:01:30

[Using CloudFront continuous deployment to safely test CDN configuration changes](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/continuous-deployment.html)（2023年1月時点で英語のみ）

現在の設定に影響を与えることなく、新しい設定のディストリビューションの動作確認を Staging で行うことができます。動作確認ができたら、Staging を昇格させて変更を適用します。

![cloudfront-cd_1](/images/cloudfront/cloudfront-cd_1.png)

![cloudfront-cd_2](/images/cloudfront/cloudfront-cd_2.png)

利用する場合は制約などをドキュメントで確認しておく必要があります。

[Quotas and other considerations for continuous deployment](https://docs.aws.amazon.com/en_us/AmazonCloudFront/latest/DeveloperGuide/continuous-deployment.html#continuous-deployment-quotas-considerations)

## まとめ

![cloudfront](/images/all/cloudfront.png)
