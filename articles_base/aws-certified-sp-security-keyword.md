# AWS Certified Security – Specialty 認定 (SCS-C02)

## ☘️ はじめに

本ページは、AWS 認定資格取得に向けて個人的に勉強した各サービスのキーワードを記載しております。AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

- [試験概要](https://aws.amazon.com/jp/certification/certified-security-specialty/)
- [試験ガイド](https://d1.awsstatic.com/ja_JP/training-and-certification/docs-security-spec/AWS-Certified-Security-Specialty_Exam-Guide.pdf)
- [公式サンプル問題](https://d1.awsstatic.com/ja_JP/training-and-certification/docs-security-spec/AWS-Certified-Security-Speciality_Sample-Questions.pdf)
- [AWS セキュリティリソース](https://aws.amazon.com/jp/security/security-learning/?cards-top.sort-by=item.additionalFields.sortDate&cards-top.sort-order=desc&awsf.Types=*all)
- [AWS セキュリティブログ](https://aws.amazon.com/jp/blogs/news/tag/security-blog/)
- セキュリティ関連のセルフペースラボ
- [Exam Readiness: AWS Certified Security - Specialty (Japanese)  | AWS Skill Builder](https://explore.skillbuilder.aws/learn/course/external/view/elearning/762/exam-readiness-aws-certified-security-specialty-japanese-na-ri-ben-yu-shi-xie-ban)
- [AWS Certified Security - Specialty Official Practice Question Set (SCS-C02 - Japanese) | AWS Skill Builder](https://explore.skillbuilder.aws/learn/course/external/view/elearning/15232/aws-certified-security-specialty-official-practice-question-set-scs-c02-japanese)
- [AWS セキュリティドキュメント](https://docs.aws.amazon.com/ja_jp/security/)
- [Security Engineering on AWS](https://aws.amazon.com/jp/training/classroom/security-engineering-on-aws/)
- [セキュリティ](https://aws.amazon.com/jp/training/learn-about/security/)
  - [AWS Security Fundamentals (Second Edition)](https://www.classcentral.com/course/aws-security-fundamentals-second-edition-japanese-73823)
  - [AWS セキュリティ強化ガイドをダウンロードする](https://d1.awsstatic.com/ja_JP/training-and-certification/ramp-up_guides/Ramp-Up_Guide_Security.pdf)
- [AWS 暗号化の動画](https://www.youtube.com/user/AmazonWebServices/search?query=encryption)
- [クラウド固有のインシデント対応計画を作成する](https://aws.amazon.com/jp/blogs/publicsector/building-a-cloud-specific-incident-response-plan/)
- [AWS インシデント対応動画](https://www.youtube.com/user/AmazonWebServices/search?query=incident+response)
- [DDoS に対する AWS のベストプラクティス](https://docs.aws.amazon.com/ja_jp/whitepapers/latest/aws-best-practices-ddos-resiliency/aws-best-practices-ddos-resiliency.pdf)
- [AWS Well-Architected Tool の使用方法の実演動画](https://d3nn3d4w2aqyem.cloudfront.net/mp4/Getting_started_video.mp4)
- [AWS Well-Architected Tool を使用するために必要なステップ例を紹介する AWS ブログ](https://aws.amazon.com/blogs/aws/new-aws-well-architected-tool-review-workloads-against-best-practices/)

## 参考

- https://qiita.com/aminosan000/items/435fc411a4d10cf6ba43
- https://qiita.com/tags/scs

## 試験範囲

- 第 1 分野: 脅威検出とインシデント対応 (採点対象コンテンツの 14%)
  - 侵害された疑いのあるインスタンスまたはアクセスキーを特定
  - インシデント対応の AWS ツール
  - 対応実施
    - 認証情報を無効に
    - 特権アクセスを取り消す ⇒ 削除ではなく、IAM を拒否するポリシーをアタッチ
    - アクセスキーを無効化
    - 一時的なセキュリティ認証情報を無効化
      - 指定された日時に前に発行された一時的なセキュリティ資格情報へのすべてのアクセスを拒否するポリシーをアタッチ
      - "Condition": {"DateLessThan": {"aws:TokenIssueTime": "YYYY-MM-DDTHH:MI:SSZ"}}
    - アクセスキーのソースを特定（どのユーザ？）
    - CloudTrail や Config で変更を特定
      - 漏洩したが実害がないケースもある
      - Config ルール
        - マネージドルール
        - カスタムルール（Lambda 関数を使用）
    - 他のアクセスキーなどに問題がないかを確認
- 第 2 分野: セキュリティロギングとモニタリング (採点対象コンテンツの 18%)
- 第 3 分野: インフラストラクチャのセキュリティ (採点対象コンテンツの 20%)

  - オンプレから AWS に遅延を最小限に、トラフィックを暗号化して接続するには？
    - VPN と Direct Connect
  - VPN で独自の DNS を使用したい
    - DNS サーバの IP で新しい DHCP オプションセットを作成し、既存のオプションセットを置き換える
  - S3 オブジェクトが確実に暗号化される IAM ポリシー

    - 暗号化を指定しない場合の通信拒否(SSE-S3 以外拒否)

      ```json
      {
        "Version": "2012-10-17",
        "Id": "Encrypted Only",
        "Statement": [
          {
            "Sid": "Encrypted Only",
            "Effect": "Deny",
            "Principal": "*",
            "Action": "s3:PutObject",
            "Resource": "arn:aws:s3:::＜バケット名＞/*",
            "Condition": {
              "StringNotEquals": {
                "s3:x-amz-server-side-encryption": "AES256"
              }
            }
          }
        ]
      }
      ```

  - EC2 インスタンスで実行中のプロセスを検査したい
    - SSM Run コマンドで実行中のプロセス情報を取得
  - EC2 で SSM Run コマンドが実行できない
    - SSM エージェントが実行されているかチェック
    - `/var/log/amazon/ssm/errors.log` ファイルを確認

- 第 4 分野: Identity and Access Management (採点対象コンテンツの 16%)
- 第 5 分野: データ保護 (採点対象コンテンツの 18%)
- 第 6 分野: 管理とセキュリティガバナンス (採点対象コンテンツの 14%)

## キーワード

- フォレンジック(Forensics)

  - フォレンジック(Forensics)とは、犯罪の法的な証拠を見つけるための鑑識捜査を指す。
  - コンピュータやデジタル記録媒体の中に残された証拠を調査・解析する分野をデジタルフォレンジック

- インシデント発生時の対応

  - セキュリティグループでネットワークから切り離す
  - EBS スナップショットとメモリダンプを取得
    - [コマンドラインでの EC2Rescue for Windows Server の使用](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/WindowsGuide/ec2rw-cli.html)
    -
  - ASG の場合、ASG からデタッチして切り離す

- ルートユーザーの認証を強化
  - MFA を設定
  - ルートユーザーの権限を制御したい
    - AWS Organizations の SCP を作成し、運用アカウントの OU に適用する
- VPC フローログ
  - 送信元と送信先の IP アドレス、ポート、プロトコル、開始時刻と終了時刻、パケット数とバイト数、アクション
  - [VPC フローログを使用した IP トラフィックのログ記録](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/flow-logs.html)
  - 完全なパケット分析が必要な場合は、 AWS MarketPlace の AMI を利用し、トラフィックをインスタンスを経由するようにルーティングする
- CloudTrail
  - コンソールでは 90 日間、それ以上は S3 を調査
  - ログファイルを変更から保護するには
    - 専用のログアカウントに S3 バケット作成
    - 作成した S3 バケットに配信
    - 整合性検証を有効に
  - 暗号化したい
    - デフォルトで暗号化されているので対応不要
  - AWS Organization で CloudTrail を無効化されないように
    - SCP で `cloudtrail:StopLogging`を拒否する
- Config
  - リソースのリストを作成したい
  - IAM の権限変更を確認したい
  - ルールは、変更時または一定間隔でトリガーできる
  - カスタムルールを作成したい
    - [Lambda を作成する](https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/evaluate-config_develop-rules.html#evaluate-config_develop-rules-lambda)
    -
- Systems Manager Patch Manager
  - セキュリティパッチの適用状況を確認し、パッチを当てる
- GuardDuty
- ELB
  - [セキュリティポリシー](https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies)の変更
- オンプレから AWS への接続
  - トラフィックの暗号化と遅延を最小限
    - AWS VPM と AWS Direct Connect
- VPC の DNS を独自のものにするには、DHCP オプションセットを新規作成、既存と置き換え
- EBS の暗号化
  - 作成時に KMS を指定して暗号化（デフォルトは AWS 管理キー）
  - CMK も指定可能
  - あとから暗号化したい場合、EC2 停止、スナップショットを取得し、コピー時に暗号化、EBS 作成、既存を EC2 からデタッチ（その前に`/dev/xvda`のようなルートデバイスをメモ）、EC2 にアタッチ（ルートデバイスをさっきメモしたものと同じに設定）、EC2 起動
  - 暗号化の解除はできない。空の未暗号化 EBS に rsync などでコピーするしかない
  - アカウントの属性＞ EBS 暗号化で、常に暗号化をデフォルトにすることが可能
- EC2
  - ログインする安全な方法は？
    - キーペア
  - [SSH キーペア紛失した](https://repost.aws/ja/knowledge-center/user-data-replace-key-pair-ec2)
    - ① AMI を作成、AMI から新インスタンス作成時に新しいキーペア指定
    - ② インスタンスを停止、ユーザーデータに cloud-init
    - ③ AWS Systems Manager の使用
      - AWSSupport-ResetAccess ドキュメントを使用して、紛失したキーペアを回復（新しい SSH キーを生成）
    - ④ EC2 シリアルコンソールで接続
    - ⑤ Amazon EC2 Instance Connect
  - OpenSSL などで独自のキーペアを作成した
    - キーペアのインポートで公開鍵をインポートして使う
  - プライベートサブネットにある EC2 から AWS サービスにプライベートアクセスしたい。
    - VPC エンドポイント
  - ローカルのログをチェックしたい
    - CloudWatch エージェントをインストールして、CloudWatch Logs へ転送
    - アラートを出す
  - コンプライアンスに非準拠なインスタンスを終了したい
    - Config ルールで監視
    - EventBridge をトリガーに Lambda などで終了させる
- NACL
  - サブネットに付ける
  - ステートレスなので、インバウンドとアウトバウンドを設定しないと通信できない
  - アウトバウンドは 1024~65535 まで許可
- セキュリティグループ

  - インスタンス（厳密にはアタッチされているプライマリ ENI：Elastic Network Interface）につける
  - ステートフル

- Lambda
  - Lambda 関数に DynamoDB へのアクセスを与えたい
    -DynamoDB に書き込み権限をもつ IAM ロールを作成し、[Lambda に関連付け](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/lambda-permissions.html)
- DynamoDB
  - テーブル保存時に暗号化したい
    - デフォルトで暗号化されている
      - AWS 管理キーまたは CMK を使用できる
- S3

  - 暗号化キーが AWS マネージドキーの"aws/s3"であるとき
    - 自動ローテーションは 1 年
    - ローテーションを有効化無効化という制御はできない
  - [バケットポリシー](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/bucket-policies.html)
    - これ以外に、ユーザーには IAM ポリシーを付与しないと操作できない
  - [IAM ポリシー](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/access-policy-language-overview.html)

    - "arn:aws:s3:::bucketname"
      - バケットそのものに対するアクセスを定義するとき（バケットレベル）
      - 仮に"s3:*"を許可していたとしても、バケット内のオブジェクトに対する操作（"s3:*Object"）はできない。
      - オブジェクトレベル、バケットレベルのポリシーについては、[Amazon S3 のアクション](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/using-with-s3-actions.html)を参照
    - "arn:aws:s3:::bucketname/\*"
      - バケット内のオブジェクトに対するアクセスを定義するとき（オブジェクトレベル）
      - "arn:aws:s3:::bucketname\*" としても同じことが実現できるが、"bucketname"のほかに"bucketname2"というバケットがあった場合も適用されてしまうので注意

  - バージョン管理を有効化、[クロスリージョンレプリケーション](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/replication.html)
  - [クロスアカウントアクセス](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html)
    - サードパーティーが外部 ID（AWS アカウント 番号）を伝える
    - IAM ロールを作成
      - "Principal": {"AWS": "Example Corp's AWS アカウント ID"},
        "Condition": {"StringEquals": {"sts:ExternalId": "Unique ID Assigned by Example Corp"}}
    - IAM ロールの ARN を連絡
    - sts:AssumeRole
  - 機密データの分析なら Macie
  - MFA 認証されている場合のみバケットをリスト可能

    ```json
    {
      "Version": "2012-10-17",
      "Statement": {
        "Effect": "Allow",
        "Action": ["S3:ListAllMyBuckets", "S3:GetBucketLocation"],
        "Resource": "*",
        "Condition": {
          "Bool": { "aws:MultiFactorAuthPresent": true }
        }
      }
    }
    ```

- AWS Backup Vault
  - コンプライアンスモード
    - IAM 権限で削除可能
  - ガバナンスモード
    - 削除できない
- KMS

  - キー管理者
    - 管理だけできる。暗号化復号はできない
  - キーユーザー
  - [キーポリシー](https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/key-policies.html)
    - リソースベースのポリシー
    - IAM ポリシーとは違い、リージョナル
  - 4KB まで暗号化できる
    - それ以上のサイズの場合はエンベロープ暗号化
  - 暗号化、復号に必要なポリシーは？
    - kms:Encrypt
    - kms:ReEncrypt\*
    - kms:Decrypt
    - kms:GenerateDataKey\*
    - kms:DescribeKey
  - ローテーションを通知
    - EventBridge で"detail-type": "KMS CMK Rotation"を指定して SNS で通知
  - [kms:KeyOrigin](https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/conditions-kms.html#conditions-kms-key-origin)
  - インポートされたマテリアル
    - 独自に管理できる
    - 別にリージョンでも同じマテリアルが使える
    - 自動キーローテーション不可
    - ローテーションするには？
      - 新しいキーマテリアルで CMK 作成
      - キーエイリアスを新しい CMK に
  - [データキャッシュ](https://docs.aws.amazon.com/ja_jp/encryption-sdk/latest/developer-guide/implement-caching.html)
  - 使用できるサービスを限定したい

    - [キーポリシー](https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/policy-conditions.html)を設定する

      ```json
      "Condition" : {
        "ForAnyValue:StringEquals": {
          "kms:ViaService": [
            "<service>.<region>.amazonaws.com"
          ]
        }
      }
      ```

  - [AWS KMS と統合された AWS のサービスのみ](https://aws.amazon.com/jp/kms/features/#AWS_Service_Integration)

    - [GrantIsForAWSResource](https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/conditions-kms.html#conditions-kms-grant-is-for-aws-resource)

      ```json
      "Condition" : {
        "Bool": {
          "kms:GrantIsForAWSResource": true
        }
      }
      ```

  - キーの管理を排他的にしたい
    - [CloudHSM キーストアでの KMS キーの管理](https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/manage-cmk-keystore.html)
    - 内部的には、KMS も HSM を利用しているが、AWS 管理のサーバで共有されている。
    - CloudHSM を指定することで、専用ハードウェアで排他的に管理できるようになる。
  - [キーを削除したい](https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/deleting-keys.html)
    - まずは無効化
    - CloudTrail で使用状況を確認

- [AWS アカウント の認証情報レポートの取得](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_credentials_getting-report.html)
  - 含まれる
    - ユーザー作成日時
    - パスワード
      - 最終利用日時
      - 最終変更日時
    - MFA
    - アクセスキー
      - 最終利用日時
      - 最終変更日時
  - 含まれない
    - IAM ロール情報
- IAM ポリシー

  - S3 バケットポリシー
  - [Amazon S3 条件キーの例](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/amazon-s3-policy-keys.html)
  - HTTPS 通信以外拒否

    ```json
    {
      "Id": "HTTPS Only",
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "HTTPS only",
          "Action": "s3:*",
          "Effect": "Deny",
          "Resource": [
            "arn:aws:s3:::＜バケット名＞",
            "arn:aws:s3:::＜バケット名＞/*"
          ],
          "Condition": {
            "Bool": {
              "aws:SecureTransport": "false"
            }
          },
          "Principal": "*"
        }
      ]
    }
    ```

  - 暗号化を指定しない場合の通信拒否(SSE-S3 以外拒否)

    ```json
    {
      "Version": "2012-10-17",
      "Id": "Encrypted Only",
      "Statement": [
        {
          "Sid": "Encrypted Only",
          "Effect": "Deny",
          "Principal": "*",
          "Action": "s3:PutObject",
          "Resource": "arn:aws:s3:::＜バケット名＞/*",
          "Condition": {
            "StringNotEquals": {
              "s3:x-amz-server-side-encryption": "AES256"
            }
          }
        }
      ]
    }
    ```

  - MFA が必要

    ```json
    {
      "Version": "2012-10-17",
      "Id": "123",
      "Statement": [
        {
          "Sid": "",
          "Effect": "Deny",
          "Principal": "*",
          "Action": "s3:*",
          "Resource": "arn:aws:s3:::DOC-EXAMPLE-BUCKET/taxdocuments/*",
          "Condition": { "Null": { "aws:MultiFactorAuthAge": true } }
        }
      ]
    }
    ```

  - AWS Organizations 内のみアクセス ⇒ aws:PrincipalOrgID

    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "AllowGetObject",
          "Effect": "Allow",
          "Principal": {
            "AWS": [
              "arn:aws:iam::094697565664:user/Casey",
              "arn:aws:iam::094697565664:user/David",
              "arn:aws:iam::094697565664:user/Tom",
              "arn:aws:iam::094697565664:user/Michael",
              "arn:aws:iam::094697565664:user/Brenda",
              "arn:aws:iam::094697565664:user/Lisa",
              "arn:aws:iam::094697565664:user/Norman",
              "arn:aws:iam::094697565646:user/Steve",
              "arn:aws:iam::087695765465:user/Douglas",
              "arn:aws:iam::087695765465:user/Michelle"
            ]
          },
          "Action": "s3:GetObject",
          "Resource": "arn:aws:s3:::2018-Financial-Data/*",
          "Condition": {
            "StringEquals": { "aws:PrincipalOrgID": ["o-yyyyyyyyyy"] }
          }
        }
      ]
    }
    ```

- kinesis
  - プロデューサー
    - DescriveStream
    - PutRecord
  - コンシューマー
    - GetStream
    - GetRecords
- https://docs.aws.amazon.com/ja_jp/kinesisanalytics/latest/dev/iam-role.html
  - Kinesis ストリームを読み取るのに必要なポリシー
    - "kinesis:DescribeStream"
    - "kinesis:GetShardIterator"
    - "kinesis:GetRecords"
    - "kinesis:ListShards"
  - Kinesis Data Firehose 配信ストリームを読み取るためのアクセス権限ポリシー
    - "firehose:DescribeDeliveryStream"
    - "firehose:Get\*"
- KCL(Kinesis Cliend Library)を使用するには、DynamoDB（アプリケーション状態情報の追跡）と CloudWatch（KCL メトリクス送信）へのアクセス許可が必要
- [AWS Systems Manager のユースケース](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-best-practices.html)
- OIDC, SAML

```

```

- CloudFront

  - SQL インジェクションや XSS を防ぎたい
    - AWS WAF を利用する
  - S3 ホストに直接アクセスさせないようにしたい
    - OAI を設定する

- ACM プライベート CA
  - 高可用性だが、リージョン内だけ。冗長化と災害復旧のためには２つ以上のリージョンで作成。ただしアプリケーションには複数の証明書をインポートする必要あり
    - https://docs.aws.amazon.com/ja_jp/privateca/latest/userguide/disaster-recovery-resilience.html
  - １つのリージョンのルート CA を作成し他のリージョンに上位 CA をチェーンして下位の CA を作成。アプリケーションには１つの証明書でよいが、ルート CA に障害があると使えない
  - 使えるサービス
    - API Gateway
    - ALB
    - CloudFront
    - EB の ALB
  -
  - IAM ポリシー
    - https://docs.aws.amazon.com/ja_jp/privateca/latest/userguide/PcaWelcome.html
      - ListCertificateAuthorities
      - GetCertificate
      - DescribeCertificateAuthority
- AWS Artifact
  - 監査人からレポートを
    - SOC
    - ISO 認定
- Audit Manager

  - [AWS Audit Manager の概要](https://aws.amazon.com/jp/audit-manager/)
  - 【AWS Black Belt Online Seminar】[AWS Audit Manager(YouTube)](https://www.youtube.com/watch?v=sKaHZFewzbo)(1:00:17)[pdf](https://d1.awsstatic.com/webinars/jp/pdf/services/20210309_AWSblackbelt_AWSAuditManager.pdf)

    - AWS の使用状況を継続的に監査
    - 従来手動で行われていた証跡収集を自動化し作業コストを削減
    - 業界標準や認証など監査要求項目のテンプレートがある
    - 対応している業界標準は CIS AWS Foundation Benchmark, GDPR,PCI DSS など
    - AWS のプラットフォーム自体と同じくスケールする監査をサポートする
    - お客様にとってのメリット
      - 監査証跡の収集を手動で行う手間の削減
      - 内部監査、外部監査などの監査対応が必要な場合、Audit Manager を使用
      - ※ 監査対応を要件としてない場合には、発見的統制のソリューションである GuardDuty, Security Hub, AWS Config などの組み合わせで十分
      - 発見的統制とは、顕在化したリスク、例えば、不正や誤謬などを適時適切に是正する統制活動
      - 一方、予防的統制とは、潜在的なリスクを予見して統制をかけ、好ましくない事象の発見を遅らせたり防止したりする統制活動
    - 監査人が得るメリット
      - 監査証跡の収集を手動で行う手間の削減
      - 監査証跡の真正性が Audit Manager で担保される
      - リアルタイムに近い形で最新の証跡を取得出来る

  - [AWS Audit Manager のドキュメント](https://docs.aws.amazon.com/ja_jp/audit-manager/?id=docs_gateway)
  - [AWS Audit Manager の料金](https://aws.amazon.com/jp/audit-manager/pricing/)
  - 構成要素
  - [AWS Audit Manager のよくある質問](https://aws.amazon.com/jp/audit-manager/faqs/)
    - アセスメント/評価 ⇒ 証跡収集を実行するタスク定義
    - フレームワーク ⇒ 証跡収集をどのように行うかの定義
      - 標準フレームワーク
        - AWS Audit Manager サンプルフレームワーク
          - 検証用などでサンプルとして実行出来るフレームワーク
        - AWS Control Tower ガードレール
          - AWS Control Tower ガードレールで定義されているガイダンスを監査する
        - AWS License Manager
          - Microsoft, SAP, Oracle, IBM などのソフトウェアベンダーのソフトウェア・ライセンスを監査する
        - AWS 運用のベストプラクティス（OBP）
          - AWS のベストプラクティスに基づいた監査項目 52
        - CIS Amazon Web Services Foundations Benchmark v1.2.0, レベル 1 および 2 用の CIS ベンチマーク
          - Center of Internet Security が提唱する AWS 環境の基本的なチェック項目を監査する
        - CIS コントロール v7.1 実装グループ 1
          - Center of Internet Security が提唱する一般的な攻撃を緩和するためのベストプラクティスを監査する
        - FedRAMP Allgress による中程度のベースライン
          - 米国政府が展開しているクラウドサービス・プロバイダーのセキュリティ評価のチェック項目を監査する
        - GDPR
          - EU/EEA の個人情報保護に関するレギュレーションのチェック項目
        - GxP 21 CFR part 11
          - 消費者に対して食料と医薬品の安全を守るために生産時のデータ整合性を保証するレギュレーション
        - HIPAA
          - 米国の個人健康保険情報を保護する連邦法で規定されている項目の監査
        - HITRUST v9.4 レベル 1
          - HIPAA を含む各種コンプライアンス標準を満たすためのフレームワーク
        - PCI DSS v3.2.1
          - クレジットカード業界のセキュリティ標準で定められているコントロールを監査する
        - SOC 2
          - 米国公認会計士協会が定めているセキュリティや可用性に関する監査項目
      - カスタムフレームワーク
  - フロー
    - アセスメント作成
    - 証跡収集開始
    - 収集されたエビデンス確認
    - コントロールの状態を確認
    - エビデンスをレポートに追加
    - レポートを作成（zip ファイル）
  - 通知
    - Audit Manager から SNS を使う
  - 監査における役割
    - 監査業務そのものを代行するサービスではない
    - 証跡収集を自動化し、レポート作成まで実施することで、監査の手間を削減するもの
    - レポート作成後は、監査人による判断を行い、監査結果にする。
  - 外部監査人が監査する場合
    - パターン ①
      - レポートを S3 に配置
      - 監査人の AWS アカウントに参照を許可
    - パターン ② 　 AWS Organizations
      - メンバーアカウントを払い出す
      - 委譲アカウントにする
