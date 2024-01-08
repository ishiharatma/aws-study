# AWS Certified Security – Specialty 認定 (SCS-C02)

## はじめに

本ページは、AWS 認定資格取得に向けて個人的に勉強した各サービスのキーワードを記載しております。AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

- [試験概要](https://aws.amazon.com/jp/certification/certified-security-specialty/)
- [試験ガイド](https://d1.awsstatic.com/ja_JP/training-and-certification/docs-security-spec/AWS-Certified-Security-Specialty_Exam-Guide.pdf)
- [サンプル問題](https://d1.awsstatic.com/ja_JP/training-and-certification/docs-security-spec/AWS-Certified-Security-Speciality_Sample-Questions.pdf)
- [AWS セキュリティリソース](https://aws.amazon.com/jp/security/security-learning/?cards-top.sort-by=item.additionalFields.sortDate&cards-top.sort-order=desc&awsf.Types=*all)
- [AWS セキュリティブログ](https://aws.amazon.com/jp/blogs/news/tag/security-blog/)
- セキュリティ関連のセルフペースラボ
- [Exam Readiness: AWS Certified Security - Specialty (Japanese) ](https://explore.skillbuilder.aws/learn/course/external/view/elearning/762/exam-readiness-aws-certified-security-specialty-japanese)

## 試験範囲

- 第 1 分野: 脅威検出とインシデント対応 (採点対象コンテンツの 14%)
  - 侵害された疑いのあるインスタンスまたはアクセスキーを特定
  - インシデント対応の AWS ツール
  - 対応実施
    - 認証情報を無効に
    - 特権アクセスを取り消す⇒削除ではなく、IAMを拒否するポリシーをアタッチ
    - アクセスキーを無効化
    - 一時的なセキュリティ認証情報を無効化
      - 指定された日時に前に発行された一時的なセキュリティ資格情報へのすべてのアクセスを拒否するポリシーをアタッチ
      - "Condition": {"DateLessThan": {"aws:TokenIssueTime": "YYYY-MM-DDTHH:MI:SSZ"}}
    - アクセスキーのソースを特定（どのユーザ？）
    - CloudTtailやConfigで変更を特定
      - 漏洩したが実害がないケースもある
      - Configルール
        - マネージドルール
        - カスタムルール（Lambda関数を使用）
    - 他のアクセスキーなどに問題がないかを確認
- 第 2 分野: セキュリティロギングとモニタリング (採点対象コンテンツの 18%)
- 第 3 分野: インフラストラクチャのセキュリティ (採点対象コンテンツの 20%)
- 第 4 分野: Identity and Access Management (採点対象コンテンツの 16%)
- 第 5 分野: データ保護 (採点対象コンテンツの 18%)
- 第 6 分野: 管理とセキュリティガバナンス (採点対象コンテンツの 14%)

## キーワード

- フォレンジック(Forensics)
  - フォレンジック(Forensics)とは、犯罪の法的な証拠を見つけるための鑑識捜査を指す。
  - コンピュータやデジタル記録媒体の中に残された証拠を調査・解析する分野をデジタルフォレンジック

- インシデント発生時の対応
  - セキュリティグループでネットワークから切り離す
  - EBSスナップショットとメモリダンプを取得
    - [コマンドラインでの EC2Rescue for Windows Server の使用](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/WindowsGuide/ec2rw-cli.html)
    - 
  - ASGの場合、ASGからデタッチして切り離す

- VPC フローログ　
  - 送信元と送信先の IP アドレス、ポート、プロトコル、開始時刻と終了時刻、パケット数とバイト数、アクション
  - [VPC フローログを使用した IP トラフィックのログ記録](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/flow-logs.html)
  - 完全なパケット分析が必要な場合は、 AWS MarketPlace の AMI を利用し、トラフィックをインスタンスを経由するようにルーティングする
- Config
- GuardDuty
- ELB
  - [セキュリティポリシー](https://docs.aws.amazon.com/ja_jp/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies)の変更
- オンプレからAWSへの接続
  - トラフィックの暗号化と遅延を最小限
    - AWS VPM と AWS Direct Connect
- VPC の　DNS を独自のものにするには、DHCP オプションセットを新規作成、既存と置き換え
- S3
  - バージョン管理を有効化、[クロスリージョンレプリケーション](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/replication.html)
  - [クロスアカウントアクセス](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html)
    - サードパーティーが外部 ID（AWS アカウント 番号）を伝える
    - IAM ロールを作成
      - "Principal": {"AWS": "Example Corp's AWS アカウント ID"},
    "Condition": {"StringEquals": {"sts:ExternalId": "Unique ID Assigned by Example Corp"}}
    - IAM ロールの ARN を連絡
    - sts:AssumeRole
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

  - 暗号化を指定しない場合の通信拒否(SSE-S3以外拒否)

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
            "Condition": { "Null": { "aws:MultiFactorAuthAge": true }}
          }
        ]
    }
    ```

  - aaa
- KCL(Kinesis Cliend Library)を使用するには、DynamoDB（アプリケーション状態情報の追跡）とCloudWatch（KCLメトリクス送信）へのアクセス許可が必要
- 