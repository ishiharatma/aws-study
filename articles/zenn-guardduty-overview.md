---
title: "【初心者向け】Aamazon GuardDuty について改めて整理してみた" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: false
---

# Amazon GuardDuty

## はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## Contents

Duration: 00:01:00

- [Amazon GuardDuty](#amazon-guardduty)
  - [はじめに](#はじめに)
  - [Contents](#contents)
  - [GuardDuty とは](#guardduty-とは)
  - [GuardDuty が必要な理由](#guardduty-が必要な理由)
  - [特徴](#特徴)
  - [全リージョンで有効化するには](#全リージョンで有効化するには)
  - [脅威検出](#脅威検出)
  - [検出結果タイプ](#検出結果タイプ)
    - [信頼および脅威 IP アドレスリスト](#信頼および脅威-ip-アドレスリスト)
  - [マルウェア検知](#マルウェア検知)
    - [注意事項](#注意事項)
  - [検出結果通知](#検出結果通知)
  - [検出結果の確認](#検出結果の確認)
  - [複数アカウントの管理](#複数アカウントの管理)
  - [まとめ](#まとめ)

## GuardDuty とは

Duration: 0:46:52

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

Duration: 0:00:30

- 30 日間は無料
- AWS アカウントレベルで検出
- GuardDuty はリージョンサービス
- 全てのリージョンで有効化することを推奨
  - 全リージョンで有効化するには、CLI や CDK などで効率化する

## 全リージョンで有効化するには

AWS CLI を使う場合

```sh
#!/usr/bin/sh
# リージョン一覧の取得
REGIONS=$( \
    aws ec2 describe-regions \
        --all-regions \
        --query "Regions[].RegionName" \
        --output text \
        --profile ${profileName} \
    )
for region in ${REGIONS[@]}; do
  # 有効化の確認
  DETECTOR=$( ¥
        aws guardduty list-detectors \
        --region "${REGION}" \
        --query DetectorIds \
        --output text \
        )
  if [ "${#DETECTOR}" -ne "0" ] ; then
      # 既に有効化されている
      echo "GuardDuty is already enabled. ${REGION}:${DETECTOR}"
  else
      # finding-publishing-frequency は指定しないとデフォルト 6h
      aws guardduty create-detector \
        --region "${REGION}" \
        --finding-publishing-frequency FIFTEEN_MINUTES \
        --enable \
        --profile ${profileName}
  fi
done
```

AWS CDK を使う場合

```ts
# YAML のパラメータファイルに以下を定義
# import * as yaml from 'js-yaml'; で読み込んでいます。
# ---------
# ForceEnabled : true # それぞれの設定に関係なく強制的に有効化する場合 true
# RegionConfigs :
#  -  { Region: 'us-east-1' , isEnabled: false } # 米国東部（バージニア北部）
#  -  { Region: 'us-east-2' , isEnabled: false } # 米国東部 (オハイオ)
#  -  { Region: 'us-west-1' , isEnabled: false } # 米国西部 (北カリフォルニア)
#  :

RegionConfigs.forEach((x) => {
  if (x.isEnabled || isForceEnabled) {
    new GuardDutyStack(app, `GuardDutyStack${x.Region}`, {
      :
      :
      env : {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: x.Region,
      }
    }
  }
}
```

## 脅威検出

Duration: 0:01:00

ログなどから脅威を検出する機能です。検出する機能なので、通知するには EventBridge と SNS を利用する必要があります。（[GuardDuty の検出結果を通知する CloudWatch Events ルールの作成](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_findings_cloudwatch.html#guardduty_cloudwatch_severity_notification)）

検出結果
![result](/images/guardduty/result.png)
![result-detail](/images/guardduty/result-detail.png)

EventBridge のイベントパターン指定例
![event-pattern](/images/guardduty/event-pattern.png)

## 検出結果タイプ

Duration: 0:01:30

GuardDuty を有効化したときにデフォルトで次のログを検査します。CloudTrail の有効化や VPC Flow logs や DNS ログの設定がされていなくても GuardDuty によって個別に取得されます。
ただし、調査などの理由から各サービスのログも有効化しておくのを推奨します。

- [AWS CloudTrail イベントログ](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_data-sources.html#guardduty_cloudtrail)
- [AWS CloudTrail 管理イベント](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_data-sources.html#guardduty_controlplane)
- [VPC Flow Logs](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_data-sources.html#guardduty_vpc)
- [DNS ログ](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_data-sources.html#guardduty_dns)

これ以外に、個別のサービスに対するモニタリングを有効／無効にすることができます。詳細は [検出結果タイプ](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_finding-types-active.html) を参照してください。

- EKS Protection
- Lambda Protection
- RDS Protection
- S3 Protection

![plan](/images/guardduty/plan.png)

### 信頼および脅威 IP アドレスリスト

[信頼できる IP リストと 脅威リストの使用](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_upload-lists.html)

IP アドレスまたは CIDR によって脅威の検出を制御できます。

- 信頼されている IP リスト(Trusted IP lists)
  - このリストに指定したものを脅威として検出しなくなります。セキュリティテストを行うサーバの IP を指定しておくといったケースが考えられます。
- 脅威 IP リスト(Threat IP lists)
  - 既にある AWS の脅威リストを補完するもので、ユーザーが個別に指定できます。

![ip-list](/images/guardduty/ip-list.png)

信頼と脅威に同じものを指定した場合は、信頼リストのほうの判定が優先され、脅威対象と見なされなくなるので注意が必要です。

## マルウェア検知

Duration: 0:03:00

インスタンスで動作しているマルウェアを検出できます。
通常、サードパーティ製のマルウェア検知ソフトの場合、インスタンスにエージェントをインストールしなければならないが、GuardDuty を使えばエージェントレスでマルウェアを検知できます。
チェック対象の EC2 にアタッチされた EBS はスナップショットが取得され、そのスナップショットから、DuardDuty が動作する 別の AWS アカウントに EBS が複製され、チェックを実行する　 EC2 にアタッチされて検査されます。

![malware-scan](/images/guardduty/malware-scan.png)

このため、チェック対象のインスタンスにエージェントのインストールが不要になります。

スキャンの方法は 2 種類あります。

- [実行型マルウェアスキャン](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/gdu-initiated-malware-scan.html)
  - GuardDuty の脅威検出でマルウェアの動作を検知した後にスキャンが実行されます。
    - [GuardDuty 実行型マルウェアスキャンを起動する検出結果](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/gd-findings-initiate-malware-protection-scan.html)
    - 上記を検出後、前回から 24 時間に 1 回実行されます。
- [オンデマンドスキャン](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/on-demand-malware-scan.html)
  - GuardDuty の結果に関係なくスキャンを実行できます。
  - 前回実行から 1 時間経過している必要があります。
  - ただし、無料期間中は実施できません。

### 注意事項

- 現時点では「スキャンはするが保護、隔離などは実施しない」ので、簡易的なチェックです。Deep Security や Cloud One などのように予防的な対策を行ってくれるものではありません。
- スキャン実施時に、一時的とはいえ別の AWS アカウントに EBS が複製されます。スキャン対象の EBS に機密データが含まれるような場合、利用可否をしっかり検討してください。

## 検出結果通知

Duration: 0:05:00

検出結果通知は、GuardDuty から Amazon EventBridge に発信されるイベントを検出し、SNS と連携することで実現できます。

GuardDuty から 発信される [検出結果の詳細](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_findings-summary.html) は次のようになります。

```json
        {
         "version": "0",
         "id": "cd2d702e-ab31-411b-9344-793ce56b1bc7",
         "detail-type": "GuardDuty Finding",
         "source": "aws.guardduty",
         "account": "111122223333",
         "time": "1970-01-01T00:00:00Z",
         "region": "us-east-1",
         "resources": [],
         "detail": {GUARDDUTY_FINDING_JSON_OBJECT}
        }
```

上記のようなイベントを検出できるように、EventBridge の[イベントパターン](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_findings_cloudwatch.html#guardduty_findings_cloudwatch_format)を定義します。定義の雛形は次のとおりです。

```json
{
  "source": [
    "aws.guardduty"
  ],
  "detail-type": [
    "GuardDuty Finding"
  ],
  "detail": {
    "severity": [
      :
    ]
  }
}
```

通知対象を限定せずに設定を行うと大量のメールが送信される可能性があるため注意が必要です。

[Medium] (中)〜[High] (高) を検出するイベントパターンの例は次のとおりです。

```json
{
  "source": ["aws.guardduty"],
  "detail-type": ["GuardDuty Finding"],
  "detail": {
    "severity": [
      4, 4.0, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5, 5.0, 5.1, 5.2,
      5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 6, 6.0, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6,
      6.7, 6.8, 6.9, 7, 7.0, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 8,
      8.0, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9
    ]
  }
}
```

severity は GuardDuty で定義されている重要度レベルを示しており、数値と重要度は以下の通りです。

- 高： 7.0〜8.9 の範囲
- 中： 4.0〜6.9 の範囲
- 低： 0.1〜3.9 の範囲

または、次のようにも定義できます。

```json
{
  "source": ["aws.guardduty"],
  "detail-type": ["GuardDuty Finding"],
  "detail": {
    "severity": [{ "numeric": [">=", 4] }]
  }
}
```

このまま通知すると、JSON 形式の可読性の低いものになりますので、[インプットトランスフォーマー](https://docs.aws.amazon.com/ja_jp/eventbridge/latest/userguide/eb-transform-target-input.html)機能をつかって、整形します。

![transform-target-input](/images/securityhub/transform-target-input.png)

”入力パス” で定義する項目は、次を参考にします。

- [AWS Security Finding 形式](https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/securityhub-findings-format-syntax.html)
- [必須属性](https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/asff-required-attributes.html)
- [オプションの最上位属性](https://docs.aws.amazon.com/ja_jp/securityhub/latest/userguide/asff-top-level-attributes.html)

入力パス

```json
{
  "severity": "$.detail.severity",
  "Account_ID": "$.detail.accountId",
  "Finding_ID": "$.detail.id",
  "Finding_Type": "$.detail.type",
  "region": "$.region",
  "Finding_description": "$.detail.description"
}
```

入力テンプレート

```text
"AWS <Account_ID> has a severity <severity> GuardDuty finding type <Finding_Type> in the <region> region."
"Finding Description:"
"<Finding_description>. "
"For more details open the GuardDuty console at https://console.aws.amazon.com/guardduty/home?region=<region>#/findings?search=id%3D<Finding_ID>"
```

## 検出結果の確認

通知のテストを行うために、サンプルイベントの発行機能があります。GuardDuty のコンソールから実行することでサンプルイベントを発行できます。

[GuardDuty のサンプルの検出結果生成](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/sample_findings.html)

![result-sample](/images/guardduty/result-sample.png)

## 複数アカウントの管理

Duration: 0:01:30

[Amazon GuardDuty での複数のアカウントの管理](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_accounts.html)

結果を集約したい管理者アカウントでメンバーアカウントを招待することで、権威結果を表示することができます。

メンバーアカウントの管理は次の２つがあります。

- [招待による GuardDuty アカウントの管理](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_invitations.html)
- [AWS Organizations を使用した GuardDuty アカウントの管理](https://docs.aws.amazon.com/ja_jp/guardduty/latest/ug/guardduty_organizations.html)

![account](/images/guardduty/account.png)

メンバーアカウントを追加した場合、EventBridge が次のような設定だと管理者アカウントとメンバーアカウントの両方の検出結果が通知されます。

```json
{
  "source": ["aws.guardduty"],
  "detail-type": ["GuardDuty Finding"],
  "detail": {
    "severity": [{ "numeric": [">=", 4] }]
  }
}
```

メンバーアカウントのアカウント ID を追加することでフィルタリングすることができます。

```json
{
  "source": ["aws.guardduty"],
  "detail-type": ["GuardDuty Finding"],
  "detail": {
    "accountId": ["123456789012"],
    "severity": [{ "numeric": [">=", 4] }]
  }
}
```

## まとめ

![guardduty](/images/all/guardduty.png)
