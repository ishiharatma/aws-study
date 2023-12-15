# Aamazon GuardDuty

## はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## Contents

Duration: 00:01:00

- [Aamazon GuardDuty](#aamazon-guardduty)
  - [はじめに](#はじめに)
  - [Contents](#contents)
  - [GuardDuty とは](#guardduty-とは)
  - [GuardDuty が必要な理由](#guardduty-が必要な理由)
  - [特徴](#特徴)
  - [脅威検出](#脅威検出)
    - [信頼および脅威IPアドレスリスト](#信頼および脅威ipアドレスリスト)
  - [マルウェア検知](#マルウェア検知)
  - [複数アカウントの管理](#複数アカウントの管理)

## GuardDuty とは

AWS 環境のセキュリティを継続的にチェックしてくれるサービスです。

【AWS Black Belt Online Seminar】[Amazon GuardDuty(YouTube)](https://youtu.be/Tb2Uw4B_Ihw)(0:46:52)

![blackbelt-guardduty](/images/blackbelt/blackbelt-guardduty-320.jpg)

【AWS Black Belt Online Seminar】[Amazon GuardDuty Malware Protection(YouTube)](https://youtu.be/GwzBiO1jBvU)(0:43:53)

![blackbelt-guardduty-malware](/images/blackbelt/blackbelt-guardduty-malware-320.jpg)

[Amazon GuardDuty サービス概要](https://aws.amazon.com/jp/guardduty/)

[Amazon GuardDuty ドキュメント](https://docs.aws.amazon.com/ja_jp/guardduty/?id=docs_gateway)

[Amazon GuardDuty よくある質問](https://aws.amazon.com/jp/guardduty/faqs/)

[Amazon GuardDuty の料金](https://aws.amazon.com/jp/guardduty/pricing/)

## GuardDuty が必要な理由

Duration: 0:01:30

Well-Architected フレームワークという考え方のうち、「[セキュリティの柱](https://docs.aws.amazon.com/ja_jp/wellarchitected/latest/framework/security.html)」に、「[発見的統制](https://docs.aws.amazon.com/ja_jp/wellarchitected/latest/framework/sec-detection.html)」というものがあります。

これは、セキュリティインシデントが発生しても通知するようにしておき対応する、というものです。

自力で検知を組み込むのは大変な事ですが、これを自動的に検知して通知してくれるのが Amazon GuardDuty ですので、有効化しておくとよいです。

## 特徴

- 30日間は無料
- AWS アカウントレベルで検出
- 全てのリージョンで有効化することを推奨
  - ただし、リージョン１つずつ実施するのでCDKなどで自動化

## 脅威検出

ログなどから脅威を検出する機能です。検出する機能なので、通知するには EventBridge と SNS を利用する必要があります。（[GuardDuty の検出結果を通知する CloudWatch Events ルールの作成](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_findings_cloudwatch.html#guardduty_cloudwatch_severity_notification)）

![]()

[検出結果タイプ](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_finding-types-active.html)

GuardDuty を有効化したときにデフォルトで次のログを検査します。

- [AWS CloudTrail イベントログ](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_data-sources.html#guardduty_cloudtrail)
- [AWS CloudTrail 管理イベント](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_data-sources.html#guardduty_controlplane)
- [VPC Flow Logs](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_data-sources.html#guardduty_vpc)
- [DNS ログ](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_data-sources.html#guardduty_dns)

CloudTrail の設定が有効化されていなくても GuardDuty によって個別に取得されます。
VPC Flow logs や DNS ログも同様です。
ただし、調査などの理由から各サービスのログも有効化しておくのを推奨します。

これ以外に、個別のサービスに対するモニタリングを有効／無効にすることができます。

- EKS Protection
- Lambda Protection
- RDS Protection
- S3 Protection

![]()

### 信頼および脅威IPアドレスリスト

[信頼できる IP リストと 脅威リストの使用](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_upload-lists.html)

IP アドレスまたは CIDR によって脅威の検出を制御できます。

信頼されている IP リスト(Trusted IP lists)に指定したものを脅威として検出しなくなります。
脅威 IPリスト(Threat IP lists)は、既にある AWS の脅威リストを補完するもので、ユーザーが個別に指定できます。

![]()

信頼と脅威に同じものを指定した場合は、信頼リストのほうの判定が優先され、脅威対象と見なされなくなるので注意が必要です。

## マルウェア検知

インスタンスで動作しているマルウェアを検出できます。
通常、サードパーティ製のマルウェア検知ソフトの場合、インスタンスにエージェントをインストールしなければならないが、GuardDuty を使えばエージェントレスでマルウェアを検知できます。
チェック対象の EC2 にアタッチされた EBS はスナップショットが取得され、そのスナップショットから、DuardDuty が動作する 別の AWS アカウントに EBS が複製され、チェックを実行する　EC2 にアタッチされて検査されます。

![]()

このため、チェック対象のインスタンスにエージェントのインストールが不要になります。

スキャンの方法は2種類あります。

- [実行型マルウェアスキャン](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/gdu-initiated-malware-scan.html)
  - GuardDuty の脅威検出でマルウェアの動作を検知した後にスキャンが実行されます。
    - [GuardDuty 実行型マルウェアスキャンを起動する検出結果](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/gd-findings-initiate-malware-protection-scan.html)
    - 上記を検出後、前回から24時間に1回実行されます。
- [オンデマンドスキャン](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/on-demand-malware-scan.html)
  - GuardDuty の結果に関係なくスキャンを実行できます。
  - 前回実行から1時間経過している必要があります。
  - ただし、無料期間中は実施できません。


現時点では「スキャンはするが保護、隔離などは実施しない」ので、簡易的なチェックです。
Deep Security やCloud Oneなどのように予防的な対策を行ってくれるものではありません。
また、スキャン対象の EBS に機密データが含まれるような場合、一時的とはいえ別の AWS アカウントに複製されることが許容できない場合は利用できなくなります。

## 複数アカウントの管理

[Amazon GuardDuty での複数のアカウントの管理](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_accounts.html)

結果を集約したい管理者アカウントでメンバーアカウントを招待することで、権威結果を表示することができます。

メンバーアカウントの管理は次の２つがあります。

- [招待による GuardDuty アカウントの管理](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_invitations.html)
- [AWS Organizations を使用した GuardDuty アカウントの管理](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_organizations.html)