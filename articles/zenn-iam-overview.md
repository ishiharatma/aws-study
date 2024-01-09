---
title: "【初心者向け】AWS IAM について改めて整理してみた" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: true
---

# AWS Identity and Access Management(IAM)

## ☘️ はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents

- [AWS Identity and Access Management(IAM)](#aws-identity-and-access-managementiam)
  - [☘️ はじめに](#️-はじめに)
  - [👀 Contents](#-contents)
  - [IAM とは](#iam-とは)
  - [認証・認可とは](#認証認可とは)
  - [IAM ユーザー](#iam-ユーザー)
    - [MFA](#mfa)
    - [アクセスキー](#アクセスキー)
    - [SSH 公開鍵](#ssh-公開鍵)
    - [Git 認証情報](#git-認証情報)
  - [IAM ポリシー](#iam-ポリシー)
    - [ポリシーの論理評価](#ポリシーの論理評価)
  - [IAM ロール](#iam-ロール)
  - [IAM Permissions boundary（アクセス権限の境界）](#iam-permissions-boundaryアクセス権限の境界)
  - [パスワードポリシー](#パスワードポリシー)
  - [IAM Policy Simulator](#iam-policy-simulator)
  - [IAM Access Advisor](#iam-access-advisor)
  - [IAM Access Analyzer](#iam-access-analyzer)
  - [ベストプラクティス](#ベストプラクティス)
  - [📖 まとめ](#-まとめ)

## IAM とは

Duration: 1:49:12

ID と AWS のサービスおよびリソースへのアクセスを安全に管理するサービスです。

【AWS Black Belt Online Seminar】[AWS Identity and Access Management (AWS IAM) Part1(YouTube)](https://www.youtube.com/watch?v=K7F5yTThynw&t=6s)(48:03)

![blackbelt-iam-part1](/images/iam/blackbelt-iam-part1-s.jpg)

【AWS Black Belt Online Seminar】[AWS Identity and Access Management (AWS IAM) Part2(YouTube)](https://www.youtube.com/watch?v=SJQSWeogUWs)(55:37)

![blackbelt-iam-part2](/images/iam/blackbelt-iam-part2-s.jpg)

[How to use IAM Access Analyzer policy generation | Amazon Web Services(YouTube)](https://www.youtube.com/watch?v=qrZKKF6V6Dc&t=8s)(5:32)

![how-to-use-iam-access-analyzer](/images/iam/iam-how2use-iam-access-analyzer-s.jpg)

[IAM サービス概要](https://aws.amazon.com/jp/iam/)

[IAM ドキュメント](https://docs.aws.amazon.com/ja_jp/iam/?id=docs_gateway)

[IAM よくある質問](https://aws.amazon.com/jp/iam/faqs/)

IAM の料金 はありません。

## 認証・認可とは

Duration: 0:01:30

IAM を理解する前に、「認証・認可」について把握しておく必要があります。

- 認証
  - 相手が誰（何）であるかを確認すること
  - [Wikipedia-認証 (セキュリティ)](<https://ja.wikipedia.org/wiki/%E8%AA%8D%E8%A8%BC#%E8%AA%8D%E8%A8%BC_(%E3%82%BB%E3%82%AD%E3%83%A5%E3%83%AA%E3%83%86%E3%82%A3)>)
- 認可
  - リソースアクセスの権限を与えること
  - [Wikipedia-認可 (セキュリティ)](<https://ja.wikipedia.org/wiki/%E8%AA%8D%E5%8F%AF_(%E3%82%BB%E3%82%AD%E3%83%A5%E3%83%AA%E3%83%86%E3%82%A3)>)

## IAM ユーザー

Duration: 0:05:00

AWS アカウントを利用するときに使用するユーザーです。ユーザーは、次のようなものを管理することができます。

### MFA

[AWS での多要素認証 (MFA) の使用](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_credentials_mfa.html)

![iam-user-mfa](/images/iam/iam-user-mfa-s.jpg)

ログインパスワードのほかに、仮想 MFA デバイスを有効化にして認証することで、セキュリティを高めることができます。
MFA は必ず設定するようにしましょう。

MFA を使用したログインを行っている場合のみ、IAM ロールを切り替えることができるという条件を付与することが可能です。

### アクセスキー

[IAM ユーザーのアクセスキーの管理](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_credentials_access-keys.html)

![iam-user-accesskey](/images/iam/iam-user-accesskey-s.jpg)

AWS CLI や API を利用する際に使用することができる認証情報です。
ベストプラクティスでは、アクセスキーの利用は避け、一時的なセキュリティ認証情報 (IAM ロール) を使用することが推奨されています。
EC2 などから CLI を利用する場合は、EC2 内にアクセスキーの情報を保持しない IAM ロールを使用するようにしましょう。
ローカル端末から AWS CLI で作業するには、アクセスキーが必要なので、アクセスキーを適切に管理しましょう。さらに、 MFA を利用したスイッチロールを行うようにして、認証直後に強い権限を保持している状態にしないようにしましょう。

完全にアクセスキーを使用しない方法としては、CloudShell、SSM を利用した管理用 EC2 などの方法も検討しましょう。

### SSH 公開鍵

[ユーザーのパブリック SSH キーを登録する](https://docs.aws.amazon.com/ja_jp/opsworks/latest/userguide/security-settingsshkey.html)

![iam-user-sshkey](/images/iam/iam-user-sshkey-s.jpg)

SSH 公開鍵を登録できます。ここで登録した SSH 公開鍵を利用すると、次のようなことができるようになります。

- CodeCommit への SSH 接続
  - CodeCommit へのアクセスは HTTPS もある。この場合、後述の `Git 認証情報` の方を利用します。
- EC2 の Linux ユーザ情報の管理
  - SSH 公開鍵と、[aws-ec2-ssh](https://github.com/widdix/aws-ec2-ssh) を利用することで、EC2 の Linux ユーザ情報を IAM と同期させることが出来ます。IAM のみで管理が完結できるようになります。

### Git 認証情報

![iam-user-git](/images/iam/iam-user-git-s.jpg)

CodeCommit に HTTPS 接続するための認証情報（ユーザー名とパスワード）を発行することができます。

[Git 認証情報を使用した HTTPS ユーザーのセットアップ](https://docs.aws.amazon.com/ja_jp/codecommit/latest/userguide/setting-up-gc.html)

CodeCommit には、Git 認証情報を使用しなくても接続できます。Git 認証情報を作成することがない代わりに、git-remote-codecommit をインストールする必要があります。

[git-remote-codecommit を使用して AWS CodeCommit への HTTPS 接続をセットアップする手順](https://docs.aws.amazon.com/ja_jp/codecommit/latest/userguide/setting-up-git-remote-codecommit.html)

## IAM ポリシー

Duration: 0:05:00

[IAM でのポリシーとアクセス許可](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/access_policies.html)

ポリシーとは、AWS リソースへのアクセス権限を定義した JSON ドキュメントです。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["ec2:AttachVolume", "ec2:DetachVolume"],
      "Resource": ["arn:aws:ec2:*:*:volume/*", "arn:aws:ec2:*:*:instance/*"],
      "Condition": {
        "ArnEquals": {
          "ec2:SourceInstanceARN": "arn:aws:ec2:*:*:instance/instance-id"
        }
      }
    }
  ]
}
```

ポリシーには次の３つがあります。

- AWS 管理ポリシー

  - AWS が提供しているポリシーです。各サービスを利用したり、職責のパターンで提供されています。
  - AWS 管理ポリシーには、次の２つがあります。

    - サービスの利用を想定した管理ポリシー

      - AmazonS3FullAccess や　 AmazonS3ReadOnlyAccess 　など

      ![iam-policy-aws](/images/iam/iam-policy-aws.png)

    - 職責を想定した管理ポリシー（ジョブ機能）

      - AdministratorAccess や PowerUserAccess など

      ![iam-policy-aws-job](/images/iam/iam-policy-aws-job.png)

  - AWS 管理ポリシーは非推奨になることがあります。
    - [非推奨の AWS 管理ポリシー](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/access_policies_managed-deprecated.html)
    - [Amazon Web Services ブログ - AWS Config の AWS 管理ポリシー AWSConfigRole に関する変更](https://aws.amazon.com/jp/blogs/news/service-notice-upcoming-changes-required-for-aws-config/) といったように事前に告知されます。

- カスタマー管理ポリシー
  - 独自に定義したポリシーです。実際の要件にあった細やかな制御を実装できます。
  - 最大５つまでの自動的にバージョン管理が行われます。
- インラインポリシー
  - ユーザーやロールに直接記述されるポリシーです。ここで記載したポリシーは他のリソースにアタッチすることが出来ません。
  - ポリシーのバージョン管理ができません。
  - 汎用性が不要な場合や、ポリシーの検証などの用途に適しています。

### ポリシーの論理評価

Duration: 0:03:00

[ポリシーの評価論理](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/reference_policies_evaluation-logic.html)

基本的には、次の優先度で判定されます。

- 「明示的な拒否」
  - ポリシー内に明示的に拒否（Deny）したものです。
- 「明示的な許可」
  - ポリシー内に明示的に許可（Allow）したものです。
  - Deny と Allow を両方記述した場合は、Deny になります。
- 「暗黙的な拒否」
  - 何も記載されていない操作は、暗黙的にすべてが拒否（Deny）されます。

拒否と許可は上記で示した優先度ですが、アクセス許可は様々なところで設定することができます。
それらの判断順序については、[アカウント内でのリクエストの許可または拒否の決定](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/reference_policies_evaluation-logic.html#policy-eval-denyallow) にポリシーの決定フローチャートがあります。

## IAM ロール

Duration: 0:03:00

[IAM ロール](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_roles.html)

ロールとは、ある用途や職責など目的のために１つ以上のポリシーをまとめたものです。
ロール自体はユーザーやグループなどに直接付与することができませんので、ロールを引き受けること（sts:AssumeRole アクション）を許可した IAM ポリシーを作成する必要があります。

```json
{
  "Version": "2012-10-17",
  "Statement": {
    "Effect": "Allow",
    "Action": "sts:AssumeRole",
    "Resource": "arn:aws:iam::account-id:role/Test*"
  }
}
```

ロールには、[セッション期間](https://docs.aws.amazon.com/ja_jp/singlesignon/latest/userguide/howtosessionduration.html)が設定できます。セッション期間に指定した時間が経過すると、セッションからサインアウトします。以前は 1 時間しか設定できませんでしたが、現在では 12 時間まで設定できます。あまり短くすると、マネジメントコンソールで作業していると、何度も「再ロード」画面がでますので作業内容を鑑みて設定しましょう。

マネジメントコンソールで変更する場合は、「1 時間 / 2 時間 / 4 時間 / 8 時間 / 12 時間 / カスタム期間」が選択できます。

![iam-role-sessionduration](/images/iam/iam-role-sessionduration.png)

カスタム期間では、秒数で 1 時間～ 12 時間を指定できます。AWS CLI を使った場合と同じです。
![iam-role-sessionduration-custom](/images/iam/iam-role-sessionduration-custom.png)

[update-role](https://docs.aws.amazon.com/cli/latest/reference/iam/update-role.html)

```sh
# 12時間にする場合
aws iam update-role --max-session-duration 43200
```

## IAM Permissions boundary（アクセス権限の境界）

Duration: 0:03:00

[IAM エンティティのアクセス許可境界](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/access_policies_boundaries.html)

IAM ユーザーもしくはロールに付与できる権限の境界を定義したものです。IAM ポリシーで強力な権限（AdministratorAccess）が付与されたとしても、Permissions boundary を超えた権限は許可されません。

IAM ポリシーと Permissions boundary は AND 条件で評価されます。

## パスワードポリシー

Duration: 0:01:30

[IAM ユーザー用のアカウントパスワードポリシーの設定](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/id_credentials_passwords_account-policy.html)

IAM ユーザーのパスワードポリシーを設定することができます。

![iam password policy](/images/iam/iam-account-password-policy.png)

[ZDNET Japan-よくあるパスワード、約半数が AI ツールで 1 分以内に解読可能](https://japan.zdnet.com/article/35202432/#:~:text=%E3%81%82%E3%82%89%E3%82%86%E3%82%8B%E6%96%87%E5%AD%97%E7%A8%AE%E3%82%92%E5%90%AB%E3%82%8010,%E3%81%AF600%E4%BA%AC%E5%B9%B4%E3%81%A0%E3%80%82&text=PassGAN%E3%81%AF%E3%81%AA%E3%81%9C%E3%83%91%E3%82%B9%E3%83%AF%E3%83%BC%E3%83%89%E3%81%AE,%E3%81%A6%E3%81%84%E3%82%8B%E3%81%AE%E3%81%A0%E3%82%8D%E3%81%86%E3%81%8B%E3%80%82) という記事に、パスワードポリシー別の解析時間が記載されています。

この記事の引用元である、[こちらのサイト](https://www.homesecurityheroes.com/ai-password-cracking/)では、パスワードの長さから解析にどれくらいかかるか判定してくれます。

画像は、 `password` と入れた例です。当然ですが、実際に使用しているパスワードを入れないようにしましょう。

![password policy](/images/iam/password-policy.png)

## IAM Policy Simulator

Duration: 0:01:30

[IAM Policy Simulator](https://policysim.aws.amazon.com/home/index.jsp?#)

![policy-simulator](/images/iam/iam-policy-simulator.png)

ユーザー、グループ、ロールに対して設定したポリシーが正しいかどうかをテストすることができます。

![policy-simulator-run](/images/iam/iam-policy-simulator-run-s.jpg)

各項目を展開することで、どこのポリシーで拒否されたかを確認することができます。
![policy-simulator-run](/images/iam/iam-policy-simulator-run-detail.jpg)

## IAM Access Advisor

Duration: 0:01:30

[最終アクセス情報を使用した AWS のアクセス許可の調整](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/access_policies_access-advisor.html?icmpid=docs_iam_console)

アクセス可能なサービスと最終アクセス日時が表示されるので、未使用の権限を特定し削除することが可能になります。

アクセスアドバイザーは、ユーザー/グループ/ロール/ポリシーで使用することができます。
グループの場合は、グループに所属するユーザーが最後に利用したものが表示されます。

![iam-access-advisor](/images/iam/iam-access-advisor.png)

## IAM Access Analyzer

Duration: 0:01:30

[AWS Identity and Access Management Access Analyzer を使用する](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/what-is-access-analyzer.html)

AWS リソースに紐付いているポリシーを検査し、他 AWS アカウントや外部のインターネット等からのアクセスを可能とするような設定がされているかどうかを検出および可視化してくれる機能です。

![iam-access-analyzer-result](/images/iam/iam-access-analyzer-result.png)

![iam-access-analyzer-result-detail](/images/iam/iam-access-analyzer-result-detail.png)

## ベストプラクティス

Duration: 0:01:30

https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/best-practices.html

- 最小特権アクセス許可を適用
- 多要素認証
- CloudTrail でモニタリング
- アクセスキーの利用は極力避ける
- ルートユーザーは使用しない
- 未使用のロールは定期的に棚卸を
- IAM Access Analyzer を活用しよう

## 📖 まとめ

![iam](/images/all/iam.png)
