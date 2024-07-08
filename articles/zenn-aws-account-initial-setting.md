---
title: "やっていないと危険かも！？AWSアカウント作成後にやるX個のこと！" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: true
---
# これをやっておけば大丈夫！AWS アカウント作成後にやる X 個のこと！<!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

Duration: 00:00:10

AWS アカウントは簡単に作成でき、手軽に利用できます。しかし、初期設定ではセキュリティ設定が弱いため、第三者に悪用される危険があります。

安全に利用するために、適切な設定を実施しましょう。

## 👀 Contents<!-- omit in toc -->

- [１．ルートユーザーは封印する](#１ルートユーザーは封印する)
- [２．ルートユーザーに多要素認証（MFA）を設定する](#２ルートユーザーに多要素認証mfaを設定する)
- [３．AWS アカウントの代替の連絡先を設定する](#３aws-アカウントの代替の連絡先を設定する)
- [４．ルートユーザーの連絡先に設定した電話番号に「国際電話識別番号」が設定してあるかを確認する](#４ルートユーザーの連絡先に設定した電話番号に国際電話識別番号が設定してあるかを確認する)
- [５．予算アラートを設定する](#５予算アラートを設定する)
- [６．コスト異常検知](#６コスト異常検知)
- [７．CloudTrail のログ記録を有効にする](#７cloudtrail-のログ記録を有効にする)
- [８．CloudTrail のログを監視する](#８cloudtrail-のログを監視する)
- [９．Personal Service Dashboard のイベント検知を設定する](#９personal-service-dashboard-のイベント検知を設定する)
- [１０．IAM パスワードポリシーを変更する](#１０iam-パスワードポリシーを変更する)
  - [マネジメントコンソール](#マネジメントコンソール)
  - [AWS CLI](#aws-cli)
- [１１．ルートユーザーの代わりになる IAM ユーザとグループを作成する](#１１ルートユーザーの代わりになる-iam-ユーザとグループを作成する)
- [１２．全リージョンの EBS 暗号化をデフォルトで有効にする](#１２全リージョンの-ebs-暗号化をデフォルトで有効にする)
  - [マネジメントコンソール](#マネジメントコンソール-1)
  - [AWS CLI](#aws-cli-1)
- [１３．アカウントレベルの S3 公開防止設定](#１３アカウントレベルの-s3-公開防止設定)
  - [マネジメントコンソール](#マネジメントコンソール-2)
  - [AWS CLI](#aws-cli-2)
- [１４．全リージョンのデフォルト VPC 削除](#１４全リージョンのデフォルト-vpc-削除)
  - [復元したい場合](#復元したい場合)
- [１５．IAM Access Analyzer の全リージョン有効化](#１５iam-access-analyzer-の全リージョン有効化)
- [１６．全リージョンで GuardDuty 有効化](#１６全リージョンで-guardduty-有効化)
- [１７．Config 有効化](#１７config-有効化)
- [１８．全リージョンで SecurityHub 有効化](#１８全リージョンで-securityhub-有効化)
- [不要になったもの](#不要になったもの)
  - [AWS Artifact にアクセスして、「日本準拠法」に変更する](#aws-artifact-にアクセスして日本準拠法に変更する)
  - [\[2024 年 1 月 5 日廃止\]AWS アカウントの秘密の質問を設定する](#2024-年-1-月-5-日廃止aws-アカウントの秘密の質問を設定する)

## １．ルートユーザーは封印する

Duration: 00:00:30

ルートユーザーの権限は強力であるため、初期設定を行ったあとは可能な限り利用しないようにしましょう。

ルートユーザーでしか出来ない作業が必要になった場合のみ利用するようにしましょう。

- 請求情報とコスト管理コンソールへの IAM アクセスを有効にする
- AWS サポートプランの変更
- 支払オプションの変更、削除
- AWS アカウントの解約

詳しくは、以下の URL を参照してください。

<https://docs.aws.amazon.com/accounts/latest/reference/root-user-tasks.html>

## ２．ルートユーザーに多要素認証（MFA）を設定する

Duration: 00:03:00

ルートユーザーの乗っ取りを防止する意味でも アカウントを作成したらすぐにでも MFA を設定しましょう。
ただし、MFA の管理は厳重かつ、紛失に注意してください。可能であれば、2 つ以上を設定してください。（[最大 8 つまで設定可能です](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_credentials_mfa.html)）
これを行っておけば、[アカウント回復](https://repost.aws/ja/knowledge-center/forgot-aws-sign-in-credentials)を回避できます。

## ３．AWS アカウントの代替の連絡先を設定する

Duration: 00:01:00

AWS アカウント登録時の連絡先以外にも連絡してくれるようになります。

請求、オペレーション、セキュリティの３つに対して代替の連絡先を指定できます。必要に応じて設定しましょう。

<設定方法>

1. アカウント設定を開きます
   - <https://console.aws.amazon.com/billing/home#/account>
2. 「代替の連絡先」の横にある「編集」リンクをクリックして連絡先を設定します
   - ![alternate_contacts](/images/aws-account-Initial-setting/alternate_contacts.png)

<https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-update-contact-alternate.html>

## ４．ルートユーザーの連絡先に設定した電話番号に「国際電話識別番号」が設定してあるかを確認する

Duration: 00:01:00

MFA デバイスの紛失時などに電話番号認証を行う場合、国際電話識別番号が設定していないと AWS からの国際電話が着信しません。（03-1234-5678 の場合、+81 3-1234-5678）
国際電話が着信しないと、カスタマーサポートに連絡することになり、時間外などはすぐに対応してもらえない場合があります。

<設定方法>

1. アカウント設定を開きます
   - <https://console.aws.amazon.com/billing/home#/account>
2. 「連絡先情報」の横にある「編集」リンクをクリックして連絡先を設定します
   - ![contact](/images/aws-account-Initial-setting/contact.png)

## ５．予算アラートを設定する

Duration: 00:03:00

アカウントの乗っ取りや誤ったインスタンスタイプの起動など、予期しない請求を早期に検知できるので設定しましょう。

<設定方法>

1. Billing コンソールの予算を開きます
   - <https://console.aws.amazon.com/billing/home#/budgets/overview>
2. 「予讃を作成」ボタンをクリックして予算アラートを設定します
   - ![budgets_alert](/images/aws-account-Initial-setting/budgets_alert.png)

<https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-create.html>

## ６．コスト異常検知

Duration: 00:01:00

予算アラートは、設定した予算額に対してある敷居値を超えるときに通知するサービスでした。実際に超過しなければ通知されないため、異常な兆候は検出できません。

コスト異常検知は、コストを継続的にモニタリングし、機械学習モデルを利用して異常な AWS コストの発生を検出することができるサービスです。
AWS コスト異常検出を使うことで、想定外のコストが発生することを減らすことができ、アラートを受信することができます。

<https://docs.aws.amazon.com/cost-management/latest/userguide/getting-started-ad.html>

## ７．CloudTrail のログ記録を有効にする

Duration: 00:00:30

アカウント内で不正な操作を記録、検知するためにも有効にしましょう。
CloudTrail のログ保存先の S3 は、ライフサイクルルールも設定しましょう。
後述するログ監視を実施するために、CloudWatch Logs にも配信しましょう。CloudWatch のロググループには適切な保持期限を設定しましょう。

<設定方法>

1. CloudTrail コンソールを開きます
   - <https://console.aws.amazon.com/cloudtrail/>
2. [証跡の作成]ボタンをクリックします

<https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html>

## ８．CloudTrail のログを監視する

Duration: 01:00:00

CloudTrail のログを監視し、少なくとも以下を監視してアラートされるようにしましょう。

- ルートアカウントの使用を監視
- コンソールへの認証失敗を監視

その他に監視しておくとよいのは以下です。

- 他要素認証 (MFA) を使用していないコンソールサインインを監視
- ネットワークアクセスコントロールリスト (ACL) の変更を監視
- Amazon Virtual Private Cloud (VPC) の変更を監視
- ネットワークゲートウェイの変更を監視
- セキュリティグループへの変更を監視
- IAM ポリシーへの変更を監視
- IAM ロールの変更を監視
- IAM ユーザの作成を監視
- IAM アクセスキーの作成を監視
- CloudTrail の変更を監視
- SwitchRole エラーの連続発生を監視
- S3 バケットポリシーへの変更を監視
- KMS キーの無効またはスケジュールされた削除の発生を監視
- 無効または削除された KMS のキー使用時のエラー発生を監視
- 不正な API 呼び出しの発生を監視

<https://docs.aws.amazon.com/awscloudtrail/latest/userguide/monitor-cloudtrail-log-files-with-cloudwatch-logs.html>

## ９．Personal Service Dashboard のイベント検知を設定する

Duration: 00:10:00

[Personal Health Dashboard](https://phd.aws.amazon.com/phd/home) で随時確認し、監視してもよいですが、[Amazon EventBridge コンソール](https://ap-northeast-1.console.aws.amazon.com/events/home?region=ap-northeast-1#/) でイベントパターン{"source": ["aws.health"]}を監視して自動化しよう。
通知する場合は、入力トランスフォーマーを使い、メッセージを読みやすいように整形しましょう。

<設定方法>

1. EventBridge コンソールを開きます
   - <https://console.aws.amazon.com/events/>
2. ナビゲーションペインで [ルール]を選択します。
3. [ルールを作成] を選択します。

入力トランスフォーマーの設定例

```text
{"eventDescription":"$.detail.eventDescription[0].latestDescription","eventTypeCode":"$.detail.eventTypeCode","region":"$.region","service":"$.detail.service","startTime":"$.detail.startTime","type":"$.detail-type"}
```

```text
"AWSにてメンテナンス通知が発行されました。"
"type: <type>"
"eventStartTime: <startTime>"
"service: <service>"
"region: <region>"
"eventTypeCode: <eventTypeCode>"
"eventDescription: <eventDescription>"
"詳細は Personal Health Dashboard を確認してください。"
"https://phd.aws.amazon.com/phd/home#/dashboard/open-issues"
```

<https://docs.aws.amazon.com/ja_jp/health/latest/ug/cloudwatch-events-health.html>

## １０．IAM パスワードポリシーを変更する

Duration: 00:03:00

デフォルトの IAM ユーザーのパスワードポリシーは脆弱です。そのため、アカウントを作成したら忘れないうちに強力なポリシーに変更しましょう。

推奨は、以下です。

```text
- パスワードの最小長「12」以上
- 少なくとも１つの大文字が必要
- 少なくとも１つの小文字が必要
- 少なくとも１つの数字が必要
- 少なくとも１つの英数字以外の文字が必要
```

MFA を利用しない場合は、以下の追加も検討しましょう。

```text
- パスワードの失効を許可「180日」
- パスワードの再利用を禁止「5回」
```

### マネジメントコンソール

<設定方法>

1. IAM コンソールを開きます
   - <https://console.aws.amazon.com/iam/home#/account_settings>
2. ナビゲーションペインで [アカウント設定]を選択します
3. [Change]ボタンをクリックして変更します
   - ![iam_password_policy](/images/aws-account-Initial-setting/iam_password_policy.png)

<https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_passwords_account-policy.html>

### AWS CLI

現在の設定を確認

[CLI>get-account-password-policy](https://docs.aws.amazon.com/cli/latest/reference/iam/get-account-password-policy.html?highlight=account%20password%20policy)

```sh
aws iam get-account-password-policy
```

設定

[CLI>update-account-password-policy](https://docs.aws.amazon.com/cli/latest/reference/iam/update-account-password-policy.html)

```sh
aws iam update-account-password-policy \
  --minimum-password-length 12 \
  --require-uppercase-characters \
  --require-lowercase-characters \
  --require-numbers \
  --require-symbols \
```

## １１．ルートユーザーの代わりになる IAM ユーザとグループを作成する

Duration: 00:05:00

ルートユーザーは強力な権限を有しています。乗っ取られてしまった場合に無効化することが出来ません。
そのため、日常的な管理作業はルートユーザーではなく IAM ユーザーと IAM グループを使うことを推奨します。

作成した管理用グループに IAM ユーザーを追加します。

次に、AdministratorAccess の権限のロールとスイッチングロールを許可したポリシーを作成し、作成したグループに付与します。安全のために、ロール切り替え時には MFA が有効になっていることを条件としましょう。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "BoolIfExists": {
          "aws:MultiFactorAuthPresent": "true"
        }
      }
    }
  ]
}
```

作成した IAM ユーザには [MFA を設定](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_credentials_mfa.html)しましょう。

## １２．全リージョンの EBS 暗号化をデフォルトで有効にする

Duration: 00:01:00

この設定を行うことで、新しいボリュームを作成する際にデフォルトで暗号化が設定されるようになります。
暗号化設定を忘れてしまうことを回避でき、データの機密性の確保および、コンプライアンス要件を満たすことができます。この作業はアカウント開設直後に設定をすることを推奨します。

### マネジメントコンソール

<[設定方法](https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/work-with-ebs-encr.html#encryption-by-default)>

1. EC2 コンソールを開きます
   - <https://console.aws.amazon.com/ec2/>
2. ナビゲーションペインで最後までスクロールして [設定]を選択します
3. [データ保護とセキュリティ]タブにある[EBS 暗号化]の[管理]をクリックします
4. 「常に新しい EBS ボリュームを暗号化」の[有効化]のチェックボックスを`ON`にします
5. [EBS 暗号化を更新する]をクリックして設定を保存します
6. これを全てのリージョンで実施します

### AWS CLI

現在の設定を確認

[CLI>get-ebs-encryption-by-default](https://docs.aws.amazon.com/cli/latest/reference/ec2/enable-ebs-encryption-by-default.html)

```sh
### Get ebs encryption by default
aws ec2 describe-regions --query "Regions[].[RegionName]" --output text |sort \
| while read region; do
  default_enc=$(aws ec2 get-ebs-encryption-by-default --region ${region}  --output text)
  echo -e "${region}\t> ${default_enc}"
done
```

有効化を設定

[CLI>enable-ebs-encryption-by-default](https://docs.aws.amazon.com/cli/latest/reference/ec2/enable-ebs-encryption-by-default.html)

```sh
aws ec2 describe-regions --query "Regions[].[RegionName]" --output text |sort\
| while read region; do
  echo "### Enable ebs encryption by default in ${region}"
  aws ec2 enable-ebs-encryption-by-default --region ${region}
done
```

## １３．アカウントレベルの S3 公開防止設定

Duration: 00:01:00

この設定によって、S3 バケットを作成したときに誤って公開してしまうことを防止できます。ただし、アカウントレベルでパブリックアクセスを無効化してしまうと、バケットレベルで公開することができなくなります。（[ここを参照](https://aws.amazon.com/jp/s3/features/block-public-access/?nc1=h_ls)）

バケットの公開が必要なユースケースによっては、アカウントレベルのブロックパブリックアクセスをオフのままにすることもできます。

### マネジメントコンソール

<[設定方法](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/configuring-block-public-access-account.html>

1. EC2 コンソールを開きます
   - <https://console.aws.amazon.com/s3/>
2. ナビゲーションペインで[Block Public Access settings for this account (このアカウントのブロックパブリックアクセスの設定)] を選択します
3. [Edit] (編集) を選択して、AWS アカウント のすべてのバケットに対するブロックパブリックアクセス設定を変更します。
4. 変更する設定を選択して、[Save changes (変更の保存)] を選択します
5. 確認を求められたら、「confirm」と入力します。次に、[確認] を選択して変更を保存します

### AWS CLI

バケットレベルでは、`s3api`だが、アカウントレベルでは`s3control`になります。

現在の設定を確認

[CLI>get-public-access-block](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3control/get-public-access-block.html)

```sh
aws s3control get-public-access-block --account-id $(aws --output text sts get-caller-identity --query 'Account')

### 未設定の場合
### An error occurred (NoSuchPublicAccessBlockConfiguration) when calling the GetPublicAccessBlock operation: The public access block configuration was not found
```

設定

[CLI>put-public-access-block](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3control/put-public-access-block.html)

```sh
aws s3control put-public-access-block --account-id $(aws --output text sts get-caller-identity --query 'Account') --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

## １４．全リージョンのデフォルト VPC 削除

Duration: 00:05:00

アカウント作成時には、全リージョンにデフォルト VPC というものが存在します。すぐ使うには便利なデフォルト VPC ですが、セキュリティ的にはインバウンドとアウトバウンドがすべて許可されていたりと、危ういです。

というわけで、基本的にはデフォルト VPC は削除してしまって、必要に応じて作成することを推奨します。

[Amazon VPC 内で、デフォルト VPC を作成、削除、または復元する場合、どのような方法がありますか？](https://repost.aws/ja/knowledge-center/deleted-default-vpc)

現在の存在確認

[CLI>describe-vpcs](https://docs.aws.amazon.com/cli/latest/reference/ec2/describe-vpcs.html)

```sh
aws --output text ec2 describe-regions --query "Regions[].[RegionName]" |sort \
| while read region; do
   aws --output text --region ${region} ec2 describe-vpcs --query "Vpcs[?IsDefault].[VpcId]" | while read vpc; do
      echo -e "# ${region}\tdefault vpc: ${vpc}"
   done
done
```

削除実行

[CLI>delete-vpc](https://docs.aws.amazon.com/cli/latest/reference/ec2/delete-vpc.html)

[依存関係が存在すると消せません](https://repost.aws/ja/knowledge-center/troubleshoot-dependency-error-delete-vpc)ので順番に削除していきます。
下記コマンドの中の`--dry-run`は実行時には削除してください。

```sh
aws --output text ec2 describe-regions --query "Regions[].[RegionName]" |sort \
| while read region; do
   aws --output text --region ${region} ec2 describe-vpcs --query "Vpcs[?IsDefault].[VpcId]" | while read vpc; do
    ### InternetGateWay
    aws --region ${region} --output text \
      ec2 describe-internet-gateways --filters Name=attachment.vpc-id,Values=${vpc} \
      --query "InternetGateways[].[InternetGatewayId]" \
    | while read igw; do
      echo "## deleting InternetGateWay: ${igw} in ${vpc}, ${region}"
      echo "--> detatching"
      aws --region ${region} --output json \
        ec2 detach-internet-gateway --internet-gateway-id ${igw} --vpc-id ${vpc} --dry-run
      echo "--> deleteing"
      aws --region ${region} --output json \
        ec2 delete-internet-gateway --internet-gateway-id ${igw} --dry-run
    done

    ### Subnet
    aws --region ${region} --output text \
      ec2 describe-subnets  --filters Name=vpc-id,Values=${vpc} \
      --query "Subnets[].[SubnetId]" \
    | while read subnet; do
      echo "## deleting subnet: ${subnet} in ${vpc}, ${region}"
      aws --region ${region} --output json \
        ec2 delete-subnet --subnet-id ${subnet} --dry-run
    done

    ### VPC
    echo "## deleting vpc: ${vpc} in ${region}"
    aws --region ${region} --output json \
      ec2 delete-vpc --vpc-id ${vpc} --dry-run
   done
done
```

### 復元したい場合

```sh
aws --output text ec2 describe-regions --query "Regions[].[RegionName]" |sort \
| while read region; do
  echo "creating default VPC in ${region}"
  aws --region ${region} ec2 create-default-vpc --dry-run
done
```

## １５．IAM Access Analyzer の全リージョン有効化

[IAM Access Analyzer](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/what-is-access-analyzer.html) は、外部公開できるサービスが不要に外部に公開されていないかモニタリングできるサービスです。

追加料金なしで利用でき、自力で調査する必要もなく、継続的にモニタリングしてくれるため、有効にしておきましょう。

ただし、リージョンサービスなので、全リージョンでは AWS CLI を使うことを推奨します。

[CLI>create-analyzer](https://docs.aws.amazon.com/cli/latest/reference/accessanalyzer/create-analyzer.html)

```sh
analyzer_name="my-access-analyzer"
aws --output text ec2 describe-regions --query "Regions[].[RegionName]" |sort \
| while read region; do
  echo "# create IAM Access Analyzer in ${region}"
  aws accessanalyzer create-analyzer --analyzer-name ${analyzer_name}  --type 'ACCOUNT' --region ${region}
done
```

[CLI>get-analyzer](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/accessanalyzer/get-analyzer.html)

```sh
analyzer_name="my-access-analyzer"
aws --output text ec2 describe-regions --query "Regions[].[RegionName]" |sort \
| while read region; do
  echo "# IAM Access Analyzer in ${region}"
  aws accessanalyzer get-analyzer --analyzer-name ${analyzer_name} --region ${region} --query "analyzer.[name,createdAt]" --output text
done
```

## １６．全リージョンで GuardDuty 有効化

[Amazon GuardDuty](https://aws.amazon.com/jp/guardduty/) は、AWS アカウントや AWS 環境に対する脅威を検知する、セキュリティモニタリングサービスです。

対応している各種ログを継続的に取得し、機械学習によって不正なアクションなどを検知してくれます。簡単にセキュリティを強化できるため有効化しておくことを推奨します。

## １７．Config 有効化

[AWS Config](https://docs.aws.amazon.com/ja_jp/config/latest/developerguide/gs-console.html)は、AWS 上で稼働するリソースの状態を監視し、変更履歴を追跡するためのサービスです。

これによって、リソースの構成や状態の変更に関する詳細な情報を把握することができます。

次に示す、SecurityHub を有効化する場合には Config の有効化は必須となっておりますので、有効化しておくことを推奨します。

変更頻度が高いリソースがある場合は記録設定を`日次記録`にすることも検討する。これによりコストを大幅に削減できる可能性があります。

例

- AWS EC2 VPC
- AWS EC2 Subnet
- AWS EC2 SecurityGroup
- AWS EC2 NetworkInterface

## １８．全リージョンで SecurityHub 有効化

- 検出結果はメインリージョンに集約
- [AWS Foundational Security Best Practices (FSBP) 標準](https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/fsbp-standard.html)の有効化
  - 以下を無効化
    - [[CloudTrail.5] CloudTrail 証跡は Amazon CloudWatch Logs と統合する必要があります](https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/cloudtrail-controls.html#cloudtrail-5)
    - [[IAM.6] ルートユーザーに対してハードウェア MFA を有効にする必要があります](https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/iam-controls.html#iam-6)
    - [[EC2.8] EC2 インスタンスは、インスタンスメタデータサービスバージョン 2 (IMDSv2) を使用することをお勧めします](https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/ec2-controls.html#ec2-8)
    - メインリージョン以外[[Config.1] AWS Config を有効にする必要があります](https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/config-controls.html#config-1)

## 不要になったもの

### [AWS Artifact](https://console.aws.amazon.com/artifact/home) にアクセスして、「日本準拠法」に変更する

Duration: 00:00:30

※ 2022 年 2 月以降に作成した AWS アカウントでは、最初から「日本準拠法」になっているので本手順は不要になりました。

AWS アカウントの開設直後に設定されている準拠法は米国ワシントン州法となっています。ワシントン州法への準拠および英語での法務対応が困難な場合は、準拠法を日本法、紛争に関する第一審裁判所を東京地方裁判所に変更しましょう。

### [2024 年 1 月 5 日廃止]AWS アカウントの秘密の質問を設定する

Duration: 00:00:30

[AWS アカウントはセキュリティチャレンジ質問の使用を中止します](https://aws.amazon.com/jp/about-aws/whats-new/2024/01/aws-accounts-discontinues-security-challenge-questions/)

ルートユーザーの多要素認証の解除など、カスタマーサービスに問い合わせを行うときに AWS アカウントの所有者であることを確認するために使うことができ、本人確認をする手間が楽になります。
ただし、一度設定すると変更は可能ですが削除することはできません。

秘密の質問は、設定した本人が忘れることが多いので、安易に設定するのはお勧めしません。設定する場合はよく検討しましょう。（参考記事: <https://japan.zdnet.com/article/35065000/>）

<設定方法>

1. アカウント設定を開きます
   - <https://console.aws.amazon.com/billing/home#/account>
2. 「秘密の質問の設定」の横にある「編集」リンクをクリックして連絡先を設定します
   - ![security_challenge_questions](/images/aws-account-Initial-setting/security_challenge_questions.png)

<https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-security-challenge.html>
