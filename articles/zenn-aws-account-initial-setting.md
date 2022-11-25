---
title: "AWSアカウント作成後に行うべき設定事項" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: true
---

# AWSアカウント作成後に行うべき設定事項

## はじめに

Duration: 00:10

AWS アカウントは簡単に作成でき、手軽に利用できます。しかし、初期設定ではセキュリティ設定が弱いため、第三者に悪用される危険があります。

安全に利用するために、適切な設定を実施しましょう。

## ルートユーザーに多要素認証（MFA）を設定する

Duration: 00:30

ルートユーザーの乗っ取りを防止する意味でも MFA を設定しましょう。

## AWS アカウントの代替の連絡先を設定する

Duration: 00:30

AWS アカウント登録時の連絡先以外にも連絡してくれるようになります。

請求、オペレーション、セキュリティの３つに対して代替の連絡先を指定できます。必要に応じて設定しましょう。

<設定方法>

1. アカウント設定を開きます
    - <https://console.aws.amazon.com/billing/home#/account>
2. 「代替の連絡先」の横にある「編集」リンクをクリックして連絡先を設定します
    - ![alternate_contacts](/images/aws-account-Initial-setting/alternate_contacts.png)


<https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-update-contact-alternate.html>

## AWS アカウントの秘密の質問を設定する

Duration: 00:30

ルートユーザーの多要素認証の解除など、カスタマーサービスに問い合わせを行うときに AWS アカウントの所有者であることを確認するために使うことができ、本人確認をする手間が楽になります。
ただし、一度設定すると変更は可能ですが削除することはできません。

<設定方法>

1. アカウント設定を開きます
    - <https://console.aws.amazon.com/billing/home#/account>
2. 「秘密の質問の設定」の横にある「編集」リンクをクリックして連絡先を設定します
    - ![security_challenge_questions](/images/aws-account-Initial-setting/security_challenge_questions.png)

<https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-security-challenge.html>

## ルートユーザーの連絡先に設定した電話番号に「国際電話識別番号」が設定してあるかを確認する

Duration: 00:30

MFA デバイスの紛失時などに電話番号認証を行う場合、国際電話識別番号が設定していないと AWS からの国際電話が着信しません。（03-1234-5678の場合、+81 3-1234-5678）
国際電話が着信しないと、カスタマーサポートに連絡することになり、時間外などはすぐに対応してもらえない場合があります。

<設定方法>

1. アカウント設定を開きます
    - <https://console.aws.amazon.com/billing/home#/account>
2. 「連絡先情報」の横にある「編集」リンクをクリックして連絡先を設定します
    - ![contact](/images/aws-account-Initial-setting/contact.png)

## [AWS Artifact](https://console.aws.amazon.com/artifact/home) にアクセスして、「日本準拠法」に変更する

Duration: 00:30

※ 2022年 2月以降に作成した AWS アカウントでは、最初から「日本準拠法」になっているので本手順は不要になりました。

AWS アカウントの開設直後に設定されている準拠法は米国ワシントン州法となっています。ワシントン州法への準拠および英語での法務対応が困難な場合は、準拠法を日本法、紛争に関する第一審裁判所を東京地方裁判所に変更しましょう。

## 予算アラートを設定する

Duration: 00:30

アカウントの乗っ取りや誤ったインスタンスタイプの起動など、予期しない請求を早期に検知できるので設定しましょう。

<設定方法>

1. Billing コンソールの予算を開きます
    - <https://console.aws.amazon.com/billing/home#/budgets/overview>
2. 「予讃を作成」ボタンをクリックして予算アラートを設定します
    - ![budgets_alert](/images/aws-account-Initial-setting/budgets_alert.png)


<https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-create.html>

## コスト異常検知

Duration: 00:30

予算アラートは、設定した予算額に対してある敷居値を超えるときに通知するサービスでした。実際に超過しなければ通知されないため、異常な兆候は検出できません。

コスト異常検知は、コストを継続的にモニタリングし、機械学習モデルを利用して異常なAWSコストの発生を検出することができるサービスです。
AWSコスト異常検出を使うことで、想定外のコストが発生することを減らすことができ、アラートを受信することができます。

<https://docs.aws.amazon.com/cost-management/latest/userguide/getting-started-ad.html>

## CloudTrail のログ記録を有効にする

Duration: 00:30

アカウント内で不正な操作を記録、検知するためにも有効にしましょう。
CloudTrail のログ保存先の S3 は、ライフサイクルルールも設定しましょう。
後述するログ監視を実施するために、CloudWatch Logs にも配信しましょう。CloudWatch のロググループには適切な保持期限を設定しましょう。

<設定方法>

1. CloudTrail コンソールを開きます
    - <https://console.aws.amazon.com/cloudtrail/>
2. [証跡の作成]ボタンをクリックします

<https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html>

## CloudTrail のログを監視する

Duration: 00:30

CloudTrail のログを監視し、少なくとも以下を監視してアラートされるようにしましょう。

- ルートアカウントの使用を監視
- コンソールへの認証失敗を監視

その他に監視しておくとよいのは以下です。

- 他要素認証 (MFA) を使用していないコンソールサインインを監視
- ネットワークアクセスコントロールリスト (ACL) の変更を監視
- Amazon Virtual Private Cloud (VPC) の変更を監視
- ネットワークゲートウェイの変更を監視
- セキュリティグループへの変更を監視
- IAMポリシーへの変更を監視
- IAMロールの変更を監視
- IAMユーザの作成を監視
- IAMアクセスキーの作成を監視
- CloudTrailの変更を監視
- SwitchRoleエラーの連続発生を監視
- S3バケットポリシーへの変更を監視
- KMSキーの無効またはスケジュールされた削除の発生を監視
- 無効または削除されたKMSのキー使用時のエラー発生を監視
- 不正な API 呼び出しの発生を監視

<https://docs.aws.amazon.com/awscloudtrail/latest/userguide/monitor-cloudtrail-log-files-with-cloudwatch-logs.html>

## Personal Service Dashboard のイベント検知を設定する

Duration: 00:30

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


## IAM パスワードポリシーを変更する

Duration: 00:30

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

<設定方法>

1. IAM コンソールを開きます
    - <https://console.aws.amazon.com/iam/home#/account_settings>
2. ナビゲーションペインで [アカウント設定]を選択します
3. [Change]ボタンをクリックして変更します
    - ![iam_password_policy](/images/aws-account-Initial-setting/iam_password_policy.png)

<https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_passwords_account-policy.html>

## ルートユーザーの代わりになる IAM ユーザとグループを作成する

Duration: 00:30

AdministratorAccess の権限を付与したグループを作成します。IAM ユーザーを作成し、グループに登録します。
作成した IAM ユーザには MFA を設定しましょう。

## ルートユーザーは封印する

Duration: 00:30

ルートユーザーの権限は強力であるため、初期設定を行ったあとは可能な限り利用しないようにしましょう。

ルートユーザーでしか出来ない作業が必要になった場合のみ利用するようにしましょう。

- 請求情報とコスト管理コンソールへの IAM アクセスを有効にする
- AWS サポートプランの変更
- 支払オプションの変更、削除
- AWS アカウントの解約

詳しくは、以下の URL を参照してください。

<https://docs.aws.amazon.com/accounts/latest/reference/root-user-tasks.html>
