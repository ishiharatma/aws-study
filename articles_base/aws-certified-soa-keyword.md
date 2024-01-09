# AWS Certified SysOps Administrator - Associate 認定 (SOA-C02)

## ☘️ はじめに

本ページは、AWS 認定資格取得に向けて個人的に勉強した各サービスのキーワードを記載しております。AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

- [試験概要](https://aws.amazon.com/jp/certification/certified-sysops-admin-associate/)
- [試験ガイド](https://d1.awsstatic.com/ja_JP/training-and-certification/docs-sysops-associate/AWS-Certified-SysOps-Administrator-Associate_Exam-Guide.pdf)
- [サンプル問題](https://d1.awsstatic.com/ja_JP/training-and-certification/docs-sysops-associate/AWS-Certified-SysOps-Administrator-Associate_Sample-Questions.pdf)

## VPC

- ルートテーブルで `blackhole`
  - NAT インスタンスまたは NAT ゲートウェイが削除された
- VPC フローログ

  - ソース IP、ソースポート、宛先 IP、宛先ポート、アクション (accept、reject) 、ステータス
  - １つめ（172.178.45.11→10.0.1.110 0 ACCEPT）、２つめ（10.0.1.110→172.178.45.11：REJECT）→ 返信が REJECT→ アウトバンドが許可されていない

    ```text
    ・2 178982904800 eni-1267b8ca 172.178.45.11 10.0.1.110 0 0 1 4 336 389850083 3898500832 ACCEPT OK
    ・2 178982904800 eni-1267b8ca  10.0.1.110 172.178.45.11 0 0 1 4 336 389850083 3898500832 REJECT OK
    ```

## EC2

- CLI
  - aws ec2 run-instances --image-id ami-xxxxxxxx --count 1 --instance-type t2.micro --security-group-ids sg-xxxxxxaa sg-xxxxxxbb --subnet-id subnet-xxxxxxxx --region ap-northeast-1
  - aws ec2 stop-instances --instance-ids i-xxxxa i-xxxxb
  - aws ec2 start-instances --instance-ids i-xxxxa i-xxxxb
  - aws ec2 terminate-instances --instance-ids i-xxxxa i-xxxxb
  - aws ec2 describe-instances --filter "Name=instance-state-name,Values=running"
- InsufficientInstanceCapacity
  - リクエストを完了するための十分なオンデマンド容量が AWS にない場合
    - 数分間待ってから、インスタンスの開始を実行する。
    - アベイラビリティゾーンを変更して、インスタンスの開始を実行する。
    - インスタンスタイプを変更して、インスタンスの開始を実行する。
    - 一度に起動するインスタンス数を減らして、インスタンスの開始を実行する。
    - リザーブドインスタンスのゾーン RI を購入する。
    - オンデマンドキャパシティ予約を設定する。
- 1 分間隔のモニタリング
  - 詳細モニタリングを有効化
- CPU クレジットがゼロ
  - t 系の Unlimited モード
  - インスタンスタイプを上げる
- EC2 に SSH
  - パブリックサブネットの場合
    - パブリック IP を割当
    - Elastic IP を割当
    - セキュリティグループのインバウンドで SSH 許可
  - プライベートサブネットの場合
    - NAT インスタンスでセッションマネージャー
      - EC2 に AmazonSSMManagedInstanceCore ポリシー
    - VPC エンドポイントでセッションマネージャー
      - EC2 に AmazonSSMManagedInstanceCore ポリシー
      - 以下の VPC エンドポイント
        - com.amazonaws.ap-northeast-1.ssm
        - com.amazonaws.ap-northeast-1.ssmmessages
        - com.amazonaws.ap-northeast-1.ec2messages
- リザーブドインスタンス
  - スタンダード
  - コンバーティブル
    - インスタンスタイプなどを交換する場合
  - スケジュール
- Oracle RAC
  - EBS と EC2
  - EBS と EC2 の詳細モニタリング有効
  - プロビジョンド IOPS SSD
    - RDS で読み書き多い場合に
      - スループット最適化 HDD の EBS
        - 転送するデータ量が多い場合。ビッグデータ。DWH など。
- 拡張ネットワーク
  - 高い帯域幅でインスタンス間で低レイテンシー
- プレイスメントグループ
  - インスタンスを論理的にグループ化
  - インスタンス間で低レイテンシー
  - クラスター＞パーティション＞スプレッド
- EBS 最適化インスタンス
  - EBS のパフォーマンスを最適化するための EC2
- 再起動後すぐに保留状態から終了状態に移行してしまうトラブル
  - EBS の容量制限超過。
  - EBS スナップショットの破損（再起動処理時にスナップショットを利用した場合）
  - ルート EBS ボリュームは暗号化されており、復号化のために KMS キーにアクセスする権限がない。
  - インスタンスを起動するために使用したインスタンスストアバックアップ AMI に必要な部分（image.part.xx ファイル）がない。
- AWS 責任共有モデル
  - ユーザー側
    - OS やミドルウェアの脆弱性対応
    - 適切なネットワーク設定
    - アプリケーションデータの暗号化
    - ネットワークトラフィック保護
    - パスワードルールの設定
- 新しい EBS
  - https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/ebs-initialize.html
  - 空の EBS の場合は、作成後最大のパフォーマンスを発揮できる
  - スナップショットから作成された EBS の場合、ブロックにアクセスする前に初期化する必要（S3 に取りに行く。その後はボリューム内にデータがあるので高速）
    - このアクションには時間がかかるため、I/O 操作のレイテンシが大幅に増加する可能性
    - このスナップショットからの復元後の初回アクセス時の性能低下のことを
      - 初回アクセス遅延
      - ファーストタッチペナルティ
      - ファーストタッチレイテンシー
    - 全てのブロックから 1 回読み取ると回避できる
      - [ec2-user ~]$ sudo dd if=/dev/xvdf of=/dev/null bs=1M
      - または、システムに fio がインストールされている場合（こっちのほうが高速）
      - [ec2-user ~]$ sudo fio --filename=/dev/xvdf --rw=read --bs=128k --iodepth=32 --ioengine=libaio --direct=1 --name=volume-initialize
    - Fast Snapshot Restore（FSR）
      - 完全に初期化（事前ウォーミング）された状態でボリューム作成
      - 便利だけどコスト注意（FSR が有効化された AZ で毎秒）
        - つまり、リストアが完了したら FSR を無効化に。
        - いつリストアするか分からないならば、コマンドで初期化しても問題ない設計のほうがコスト的にも良い
      - FSR を有効化するのには時間がかかるので注意。リストアのサイズによっては、すぐには使えない。TiB あたり 60 分

## RDS

- 十分なメモリがあるのにスワップメモリ発生
  - https://repost.aws/ja/knowledge-center/troubleshoot-rds-swap-memory
  - FreeableMemory と SwapUsage を CW で監視
  - Performance Insights でイベントを把握
- RDS Oracle で別リージョンにリードレプリカ
  - Oracle Data Guard でレプリケーション
- メトリクス
  - DB インスタンスへの接続の数
  - DB インスタンスへの読み書きオペレーションの量
  - DB インスタンスが現在利用しているストレージの量
  - DB インスタンスのために利用されるメモリおよび CPU の量
  - DB インスタンスとの間で送受信されるネットワークトラフィックの量

## S3

- バケット作成
  - aws s3 mb s3://bucket-name
  - aws s3api create-bucket --bucket bucketname --create-bucket-configuration "LocationConstraint=ap-northeast-1"
- オブジェクトのコピー
  - aws s3 cp localfile s3://bucketname
- バージョニングを設定
  - aws s3api put-bucket-versioing --bucket bucketname --versioing-configuration Status=Enabled
  - aws s3api get-bucket-versioning --bucket bucketname
  - ファイルのバージョンを確認
    - aws s3api list-object-versions --bucket bucketname --prefix test.txt
  - ファイルを戻す
    - aws s3api delete-object --bucket bucketname --key test.txt --version-id N3a0VLfBZRMXDAand3KSErfLFwFuOcOF
- ACL
  - READ はユーザーがバケット内のオブジェクトをリストできるようにします。
  - WRITE はユーザーがバケット内のオブジェクトを作成、上書き、削除できるようにします
  - READ_ACP はユーザーがバケット ACL を読み取ることができます。
  - WRITE_ACP はユーザーが該当するバケットの ACL を書き込むことができます。
  - FULL_CONTROL はユーザーにバケットの READ、WRITE、READ_ACP、および WRITE_ACP 権限を許可します。
- SSE-C による暗号化時に指定するヘッダー
  - https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/ServerSideEncryptionCustomerKeys.html
  - x-amz-server-side-encryption--customer-algorithm
  - x-amz-server-side-encryption--customer-key
  - x-amz-server-side-encryption-customer-key-MD5
- ストレージクラス分析
  - ストレージアクセスパターンを分析し、適切なデータを、適切な時期に適切なストレージクラスに移行すべきかを判断できます
  - https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/analytics-storage-class.html
- S3 Access Analyzer
  - インターネットの任意のユーザーや他の AWS アカウント (組織外の AWS アカウントを含む) にアクセスを許可するように設定されている S3 バケットに関して警告
  - https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/access-analyzer.html
- S3 インベントリツール
  - https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/storage-inventory.html
  - オブジェクトのレプリケーションと暗号化のステータスを監査し、レポート

## ELB

- ロードバランサーの証明書を新しく

  ```sh
  aws elb describe-load-balancers \
      | jq -r '.LoadBalancerDescriptions[] | select(.ListenerDescriptions[].Listener.SSLCertificateId == "<更新前サーバ証明書のARN>") | .LoadBalancerName'

  aws elb set-load-balancer-listener-ssl-certificate \
        --load-balancer-name <ロードバランサ名> \
        --load-balancer-port 443 \
        --ssl-certificate-id <更新後サーバ証明書のARN>
  ```

- IAM へアップロード

  ```sh
  aws iam upload-server-certificate\
    --server-certificate-name chibayuki-oreore\
    --certificate-body file://server.crt\
    --private-key file://server.key
  {
      "ServerCertificateMetadata": {
          "Path": "/",
          "ServerCertificateName": "chibayuki-oreore",
          "ServerCertificateId": "ASCAQ3BIIH73R7DU7WLHE",
          "Arn": "arn:aws:iam::012345678910:server-certificate/chibayuki-oreore",
          "UploadDate": "2022-11-05T13:42:07+00:00",
          "Expiration": "2032-11-02T13:19:52+00:00"
      }
  }
  ```

- メトリクス
  - Classic Load Balancer のキャパシティーの問題
    - https://repost.aws/ja/knowledge-center/elb-capacity-troubleshooting
    - SurgeQueueLength 　 → 　リクエストの総数
    - SpilloverCount 　 → 　拒否されたリクエスト
- 新しいインスタンスに均等に分散されていない
  - スティッキーセッションで古いインスタンスに送信している
- ELB のセキュリティポリシー
  - https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies
  - ELBSecurityPolicy-TLS13-1-2-2021-06
    - TLS のサポート
    - Perfect Forward Secrecy (PFS) のサポート
    - Server Order Preference
- X-Forwarded-For
- NLB の場合、Pre-warming 申請が不要

## Auto Scaling

- Auto Scaling グループサイズを更新せずに、インスタンスを終了するコマンド
  - terminate-instance-in-auto-scaling-group --instance-id xxxx --no-should-decrement-desired-capacity
- スケーリングオプション
  - 動的スケーリング
    - https://docs.aws.amazon.com/ja_jp/autoscaling/ec2/userguide/as-scaling-simple-step.html
    - 簡易スケーリングポリシー
      - CPU 使用率が 50%超えたら XX
      - クールダウン期間
        - インスタンスの起動を待っている時間。この時間は次のオートスケーリングはストップ
        - この期間がないと、インスタンス起動待ちで次々にオートスケーリングが発動するといったことが発生する
        - デフォルトは 300 秒
    - ステップスケーリングポリシー
      - 簡易スケーリングポリシーの上位互換
        - 50% < CPU 利用率 < 70% ならインスタンスを 1 追加
        - 70% < CPU 利用率 < 90% なら 3 追加
      - DefaultInstanceWarmup
        - 指定したウォームアップ期間までメトリクス情報にカウントされない
        - ウォームアップ期間にスケールアウトするときは差分だけインスタンスが増える
        - デフォルトは 300 秒
        - 例）CPU の利用率が 50%の時に 1 台追加、70%の時に 2 台追加
          - 50％の時に 1 台追加
          - ウォームアップ期間に 70%のアラートが発動　 → 　 2 台ー 50%の 1 台＝ 1 台のみ追加
          - ウォームアップ期間外に 70％のアラートが発動　 → 　 2 台追加
  - 手動スケーリング
  - スケジュールされたスケーリング
    - x 月 xx 日になったら、インスタンスを増やす
    - 午前 6 時にインスタンスを 2 台増やす

## ACM

- ACM for Nitro Enclaves
  - AWS Nitro Enclaves を使って Amazon EC2 インスタンスで実行されているウェブアプリケーションおよびサーバーで、パブリックおよびプライベート SSL/TLS 証明書を使用できるようにする Enclaves アプリケーション
  - Linux インスタンスのみ
  - Nginx のみサポート
  - インスタンス起動時に “–enclave-options” オプションを指定して有効化
  - https://docs.aws.amazon.com/ja_jp/enclaves/latest/user/nitro-enclave-refapp.html
  - 使いかた
    - １．ACM で証明書を作成
    - ２．EC2 インスタンスを起動
    - ３．IAM ロールを作成
      - 証明書への関連付け
      - ポリシーの適用
    - ４．IAM ロールを EC2 にアタッチ
    - ５．Nginx を設定

## SQS

- sqs list-queues
- sqs create-queue --queue-name my-queue
- sqs get-queue-attributes
  - ApproximateNumberOfMessages

## Route53

- 本番用とテスト用のアプリケーションでトラフィックを調整
  - 加重ルーティング
- HTTP / HTTPS ヘルスチェック
  - 2xx または 3xx で応答

## IAM

- ユーザーの資格情報レポート
  - https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_credentials_getting-report.html
  - 取得方法
    - IAM API
    - IAM コンソール
  - 必要な権限
    - iam:GenerateCredentialReport → レポート生成
    - iam:GetCredentialReport 　 → 　レポートダウンロード
- 管理者権限を付与したユーザーの作成
  - aws iam create-user --user-name "User$i" --permissions-boundary arn:aws:iam::aws:policy/AdministratorAccess

## CloudFormation

- ドリフト
- 変更セット
- 前提となるリソースがある
  - DependsOn
  - 前提側で待機条件をつける（ソフトウェアパッケージのインストールや bootstrap 処理など）
    - CreationPolicy
      - https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/aws-attribute-creationpolicy.html
      - スタックリソースのステータスが作成完了または作成失敗になるまでの待機時間
      - ResourceSignal>Timeout>PT15M
    - UpdatePolicy
      - https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/aws-attribute-updatepolicy.html
      - StopBeforeUpdate、StartAfterUpdate
      - AutoScaling など特定リソースに対してローリングアップデートなどを指定する
    - DeletionPolicy
      - スタック削除時に、リソースを削除・保持・スナップショット取得を指定する
    - UpdateReplacePolicy
      - リソース置換時に、リソースを削除・保持・スナップショット取得を指定する
- 失敗した場合にロールバック
  -
- cfn-signal
  - https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/cfn-signal.html

## CloudWatch

- CloudWatch エージェント
  - CloudWatch Logs エージェントは古いバージョン
- クロスアカウントクロスリージョンダッシュボード
  - リージョンを跨いだ表示
  - リソース全体における統計の集計
    - https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/GetSingleMetricAllDimensions.html
    - Metric Math を使用する
- AWS cloudwatch put-metric-data --metric-name PageViewCount --namespace MyService --value 2 --timestamp 2016-10-14T12：00：00.000Z
- CloudWatch ダッシュボードの共有
  - AWS アカウントに直接アクセスできないユーザにダッシュボードを共有できる
  - https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch-dashboard-sharing.html
  - 指定したメールアドレスと共有
  - ダッシュボードにアクセスする URL が払い出される

## CloudFront

- CloudFront 使用状況レポート - Amazon CloudFront
  - https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/usage-charts.html
- CloudFront キャッシュ統計レポート - Amazon CloudFront
  - https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/cache-statistics.html
- CloudFront ビューワーレポート - Amazon CloudFront
  - https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/viewers-reports.html

## KMS

## AWS CloudHSM

- RSA 非対称暗号化アルゴリズムを使用し、FIPS 140-2 に準拠してた暗号化キー

## VPN

- デフォルトで 2 つの VPN トンネルによる冗長化

## 監査

- IT 監査人のアカウント
  - クロスアカウント用の IAM ロール作成
  - 必要なポリシー割り当て

## 請求

- ルートユーザーで「請求ダッシュボード＞設定＞請求アラートを受け取る」
  - その後、CloudWatch アラーム
- ルートユーザーで「請求ダッシュボード＞設定＞請求レポートを受け取る＞ S3 バケット」
- コストと使用状況レポート
  - [Cost & Usage Reports] (コストと使用状況レポート) ＞レポートを作成＞ S3 バケット
  - https://docs.aws.amazon.com/ja_jp/cur/latest/userguide/cur-create.html

## AWS Trusted Advisor

「コスト最適化」、「パフォーマンス」、「セキュリティ」、「フォールトトレーランス」の 4 つの観点

- 無料で使えるが、「ビジネスサポート以上」でないと、すべてのチェックが実施できない。
- お知らせ方法
  - ダッシュボード
  - メール通知
    - 「通知設定」から設定すると通知される。週１配信（木曜と金曜）
    - 「アカウント設定＞代替の連絡先」の請求、オペレーション、セキュリティの中から 1 つ以上を選択可能
  - AWS Support API

## Organizations

- メンバーアカウント削除で「アクセスが拒否されました」というメッセージが表示
  - 請求設定がされていない
  - スタンドアロンアカウントとして動作するために必要な情報（住所など）を持っていない。

## クラウドのセキュリティ設計の７原則

- https://docs.aws.amazon.com/ja_jp/wellarchitected/latest/framework/sec-design.html
  - 強力なアイデンティティ基盤を実装する
    - 最小特権の原則
  - トレーサビリティの実現
  - 全レイヤーでセキュリティを適用する
  - セキュリティのベストプラクティスを自動化する
  - 伝送中および保管中のデータを保護する:
  - データに人の手を入れない
  - セキュリティイベントに備える

## xx

Direct Connect
Auto Scaling
・Amazon CloudWatch/CloudTrail
サービスのモニタリングや問題発生時、サービスを用いてどんな原因が考えられるかを理解する
・AWS CloudFormation
・AWS Service Catalog
・AWS Systems Manager
・AWS Organizations
アカウントをまたぐサービス参照やコスト管理について理解する

Artifact ★☆☆☆☆
Backup ★☆☆☆☆
CFn ★★★★☆
CloudFront ★★★★☆
CloudWatch ★★★★★
Directory Service ★☆☆☆☆
EB ★★★☆☆
EC2 ★★★★★
EFS ★★☆☆☆
IAM ★★★★★
OpsWorks ★★★☆☆
Organizations ★★★★☆
RDS ★★★☆☆
Route 53 ★★★★☆
S3 ★★★★☆
Server Migration Service ★☆☆☆☆
Service Catalog ★☆☆☆☆
Snow Family ★★☆☆☆
Step Functions ★☆☆☆☆
Storage Gateway ★★☆☆☆
Systems Manager ★★★★☆
VPC ★★★★☆

## 試験ラボ対策

### Amazon VPC

ハンズオン
https://catalog.us-east-1.prod.workshops.aws/workshops/47782ec0-8e8c-41e8-b873-9da91e822b36/ja-JP/hands-on/phase1

- 標準的な VPC（マルチ AZ、複数プライベートサブネット、複数パブリックサブネット）の作成
- VPC フローログの設定
- VPC エンドポイント

①VPC 作成
② 別 AZ にパブリックサブネット作成 x2
③ インターネットゲートウェイ作成 →VPC にアタッチ
④② のルートテーブルにインターネットゲートウェイ追加
⑤ 別 AZ にプライベートゲートウェイ作成
⑥ フローログを許可する IAM ポリシー作成　 CloudWatch 系の許可
⑦⑥ で IAM ロールを作成　信頼関係を vpc-flow-logs.amazonaws.com に設定
⑧CloudWatch からロググループの作成
⑨ 該当 VPC からフローログ作成　 ⑦ と ⑧ を使う

ハンズオン
https://catalog.us-east-1.prod.workshops.aws/workshops/47782ec0-8e8c-41e8-b873-9da91e822b36/ja-JP/hands-on/phase1

Network 編#1 AWS 上にセキュアなプライベートネットワーク空間を作成する
https://pages.awscloud.com/JAPAN-event-OE-Hands-on-for-Beginners-Network1-2020-reg-event-LP.html?trk=aws_introduction_page

### RDS

https://catalog.us-east-1.prod.workshops.aws/workshops/47782ec0-8e8c-41e8-b873-9da91e822b36/ja-JP/hands-on/phase3

### Redshift

- マルチ AZ 構成によるフェールオーバー機能がない
  - クロスリージョンスナップショット
- AWS re:Invent 2022 で、Multi-AZ（プレビュー）が発表された
- Cross-AZ cluster recovery
  - データの損失やアプリケーションの変更なしに、クラスターを別のアベイラビリティーゾーン（AZ）に移動できる機能

### Amazon S3

- バケットのバージョニングの設定

  - https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/Versioning.html
  - aws s3api put-bucket-versioning --bucket bucket1 --versioing-configuration Status=Enabled

- デフォルトの暗号化の設定

  - https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/default-bucket-encryption.html
  - aws s3api put-bucket-encryption --bucket bucket-name \
  - --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"aws:kms","KMSMasterKeyID":"0f26e7f4-5bc5-4b39-a3e0-*************"},"BucketKeyEnabled":true}]}'
  - --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'

- イベント通知の設定

  - https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/enable-event-notifications.html
  - aws s3api put-bucket-notification-configuration --bucket bucket-name --notification-configuration file://config.json

  ```json
  {
    "LambdaFunctionConfigurations": [
      {
        "Id": "s3:ObjectCreated-lambda",
        "LambdaFunctionArn": "arn:aws:lambda:ap-northeast-1:************:function:functionname",
        "Events": ["s3:ObjectCreated:*"],
        "Filter": {
          "Key": {
            "FilterRules": [
              {
                "Name": "suffix",
                "Value": ".mp3"
              }
            ]
          }
        }
      }
    ]
  }
  ```

- ライフサイクルルールの設定

  - https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/object-lifecycle-mgmt.html
  - 設定を確認
  - aws s3api get-bucket-lifecycle --bucket BUCKET_NAME
    - 設定されていない場合「NoSuchLifecycleConfiguration」となる
  - aws s3api put-bucket-lifecycle-configuration --bucket BUCKET_NAME --lifecycle-configuration file://lifecycle.json

    ```json
    {
      "Rules": [
        {
          "Filter": { "Prefix": "documents/" },
          "Status": "Enabled",
          "Transitions": [
            {
              "Days": 365,
              "StorageClass": "GLACIER"
            }
          ],
          "Expiration": {
            "Days": 3650
          },
          "ID": "hogehoge"
        }
      ]
    }
    ```

  - 削除
    - aws s3api delete-bucket-lifecycle --bucket BUCKET_NAME

- レプリケーションルールの設定

  - https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/replication-add-config.html
  - 1. 既存の S3 バケットのバージョニングを有効にします。
    - aws s3api put-bucket-versioning --bucket bucket1 --versioing-configuration Status=Enabled
  - 2. 新規にバージニア北部を指定してレプリケーション先となる S3 バケットを作成し、バージョニングを有効にします。
    - aws s3api create-bucket --bucket bucket2 --region us-east-1 --create-bucket-configuration LocationConstraint=us-east-1
    - aws s3api put-bucket-versioning --bucket bucket2 --versioing-configuration Status=Enabled
  - 3. レプリケーション元となる既存の S3 バケットに対して、バージニア北部の S3 バケットをターゲットにしてレプリケーションの設定をします。

    - aws s3api put-bucket-replication --bucket bucket1 --replication-configuration file://replication.json

      ```json
      {
        "Role": "arn:xxxx"
        "Rules": [
          {
            "Status": "Enabled",
            "Destination": {
              "Bucket": "arn:aws:s3:::bucket2"
            }
          }
        ]
      }
      ```

  - 4. 既存の S3 バケットにオブジェクト（Sample）を追加します。
    - aws s3 cp Sample s3://bucket1
  - 5.  バージニア北部の S3 バケットにオブジェクト（Sample）が追加されていることを確認し、レプリケーションが有効になっていることを確認します。
    - aws s3 ls s3://bucket3

### S3 / クロスリージョンレプリケーション / ライフサイクルポリシー 設定

① リージョン ① にバケット作成 / バージョニングを有効
② リージョン ② にバケット作成 / バージョニングを有効
③ リージョン ① バケットで管理 → レプケショーンルール作成 → バケット全体+新しいロール
④ 管理 → ライフサイクルルール → ライフサイクルルールのアクションで指定の設定

### AWS CloudFormation

- テンプレートファイルのアップロードによるスタックの更新

インスタンスタイプ、SG、ロールの変更

AWS 環境のコード管理 AWS CloudFormation で Web システムを構築する
https://pages.awscloud.com/JAPAN-event-OE-Hands-on-for-Beginners-cfn-2022-reg-event.html?trk=aws_introduction_page

### Amazon CloudWatch ＋ Amazon SNS

- メトリクスフィルターの作成
- メトリクスフィルターを基にしたアラームの作成
- アラーム状態の変化によって通知を送信する SNS トピックの作成
- 出力確認としてコンソールに入り「sudo ifdown eth0」

①SNS でトピック作成（スタンダードにして Email）→ 認証する
② インスタンス → ステータスチェック → アラート作成
③① で作った ARN をいれてアラートを作成（CloudAatchAlarm）
④ 出力確認としてコンソールに入り「sudo ifdown eth0」

### AWS Lambda ＋ Amazon EventBridge

- EventBridge ルールによる Lambda 関数の呼び出し

### Amazon EC2 ＋ AWS Auto Scaling ＋ Elastic Load Balancing

上記構成の作成

https://catalog.us-east-1.prod.workshops.aws/workshops/47782ec0-8e8c-41e8-b873-9da91e822b36/ja-JP/advanced/autoscaling/autoscaling-imp

### AWS Code サービス群を活用して CI/CD

https://pages.awscloud.com/JAPAN-event-OE-Hands-on-for-Beginners-cicd-2022-reg-event.html?trk=aws_introduction_page

## デザインパターン

https://aws.amazon.com/jp/serverless/patterns/serverless-pattern/

## AWS Organizations において新規の組織を構成

https://docs.aws.amazon.com/ja_jp/organizations/latest/userguide/orgs_tutorials_basic.html

- AWS Organizations コンソールを開きます。
- [Create an organization] (組織を作成する)
