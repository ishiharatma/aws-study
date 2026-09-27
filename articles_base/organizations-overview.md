# AWS Organizations<!-- omit in toc -->

![icon](/images/icons/64/Arch_AWS-Organizations_64.png)

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

- [AWS Organizations とは](#aws-organizations-とは)
- [基本構成要素](#基本構成要素)
  - [管理アカウントとメンバーアカウント](#管理アカウントとメンバーアカウント)
  - [組織単位（OU）](#組織単位ou)
- [一括請求（Consolidated Billing）](#一括請求consolidated-billing)
- [サービスコントロールポリシー（SCP）](#サービスコントロールポリシーscp)
- [リソースコントロールポリシー（RCP）](#リソースコントロールポリシーrcp)
- [その他のポリシータイプ](#その他のポリシータイプ)
- [他サービスとの連携](#他サービスとの連携)
- [AWS Control Tower との関係](#aws-control-tower-との関係)
- [ユースケース](#ユースケース)
- [料金](#料金)
- [メリット](#メリット)
- [デメリット・注意点](#デメリット注意点)
- [📖 まとめ](#-まとめ)

## AWS Organizations とは

複数の AWS アカウントを 1 つの組織としてまとめ、一元的に管理するためのアカウント管理サービスです。アカウントごとの請求の集約、権限の一括統制、アカウント作成の標準化などを行えます。

[AWS Organizations サービス概要](https://aws.amazon.com/organizations/)

[AWS Organizations ドキュメント](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html)

[AWS Organizations よくある質問](https://aws.amazon.com/organizations/faqs/)

[AWS Organizations の料金](https://aws.amazon.com/organizations/pricing/)

単一の AWS アカウントで全てのワークロードを運用するのではなく、環境（本番／検証／開発）やチーム、セキュリティ境界ごとにアカウントを分割する「マルチアカウント戦略」を採用する際の基盤となるサービスです。

## 基本構成要素

### 管理アカウントとメンバーアカウント

組織を作成した際の最初のアカウントが「管理アカウント（旧称：マスターアカウント）」となり、組織全体の請求や統制の起点になります。それ以外の、組織に招待または新規作成されたアカウントが「メンバーアカウント」です。

### 組織単位（OU）

メンバーアカウントをグループ化するためのコンテナが「組織単位（Organizational Unit、OU）」です。OU は入れ子にして階層構造を作ることができ、例えば「本番環境 OU」の下に「アプリ A 用アカウント」「アプリ B 用アカウント」を配置する、といった構成が可能です。ポリシーは OU 単位で適用できるため、階層構造をうまく設計することで、アカウントが増えても統制ルールを一貫して適用できます。

## 一括請求（Consolidated Billing）

組織内の全メンバーアカウントの利用料金を、管理アカウントに集約して請求する機能です。アカウントをまたいで利用量を合算することで、EC2 の Savings Plans や S3 のボリュームディスカウントといった、利用量に応じた割引をより有利に受けられる場合があります。各メンバーアカウントの利用状況を横断的に可視化できる点も利点です。

## サービスコントロールポリシー（SCP）

アカウントや OU に対して設定できる「権限の上限（ガードレール）」を定義するポリシーです。IAM ポリシーが「何を許可するか」を積極的に定義するのに対し、SCP は「組織内のアカウントで、絶対に許可してはいけない操作」を制限する目的で使われることが多く、IAM ポリシーでどれだけ強い権限を付与していても、SCP で拒否されている操作は実行できません。

例えば、特定のリージョン以外でのリソース作成を禁止する、特定の高コストなインスタンスタイプの起動を禁止する、といった全社共通のガードレールを、管理アカウント側から一括して適用できます。

SCP は IAM ポリシーと同じく JSON で記述します。次の例は、組織のメンバーアカウントが `organizations:LeaveOrganization`（組織からの離脱）を実行できないようにする、代表的な SCP です。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyLeaveOrganization",
      "Effect": "Deny",
      "Action": "organizations:LeaveOrganization",
      "Resource": "*"
    }
  ]
}
```

次の例は、許可されたリージョン（東京・バージニア北部）以外でのリソース操作を禁止するリージョン制限の SCP です。IAM や Organizations 自体の操作、CloudFront のようにグローバルにしか存在しないサービスの操作まで巻き込んで拒否してしまわないよう、`NotAction` で除外リストを指定するのが典型的な書き方です。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyOutsideAllowedRegions",
      "Effect": "Deny",
      "NotAction": [
        "iam:*",
        "organizations:*",
        "route53:*",
        "cloudfront:*",
        "support:*"
      ],
      "Resource": "*",
      "Condition": {
        "StringNotEquals": {
          "aws:RequestedRegion": ["ap-northeast-1", "us-east-1"]
        }
      }
    }
  ]
}
```

SCP は「許可の上限（許可されうる最大値）」を定義するものであり、SCP に書いていない操作を許可する効果はありません。実際にその操作を行うには、IAM 側でも許可されている必要がある点に注意が必要です。

[Service control policy examples（AWS Organizations Developer Guide）](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps_examples.html)

## リソースコントロールポリシー（RCP）

SCP がアカウント内の IAM プリンシパル（ユーザーやロール）が実行できる操作を制限するのに対し、RCP はリソース側（S3 バケットや KMS キーなど）に対して、組織外からのアクセスを制限するなど、リソースを保護する観点でのガードレールを定義できるポリシーです。SCP と組み合わせることで、より網羅的なガードレールを構築できます。

次の例は、S3 や KMS、Secrets Manager などのリソースに対して、組織内（指定した組織 ID）のプリンシパルからのアクセスのみを許可し、それ以外（組織外のプリンシパル）からのアクセスを拒否する RCP です（AWS サービスプリンシパルからのアクセスは除外しています）。IAM ポリシーで誤って組織外のアカウントにリソースへのアクセスを許可してしまった場合でも、この RCP が最終的な防波堤として働きます。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "EnforceOrgIdentities",
      "Effect": "Deny",
      "Principal": "*",
      "Action": [
        "s3:*",
        "sqs:*",
        "kms:*",
        "secretsmanager:*"
      ],
      "Resource": "*",
      "Condition": {
        "StringNotEqualsIfExists": {
          "aws:PrincipalOrgID": "o-xxxxxxxxxx"
        },
        "BoolIfExists": {
          "aws:PrincipalIsAWSService": "false"
        }
      }
    }
  ]
}
```

RCP は SCP と異なり、対象となるリソース・サービスが限定されています（S3、KMS、SQS、Secrets Manager、STS など）。また RCP は IAM プリンシパルではなくリソースに対する「リソースベースポリシーが許可できる範囲の上限」を定義するものなので、`Principal` 要素を持つ点や、対象サービスが決まっている点が SCP との構文上の違いです。

[Resource control policy examples（AWS Organizations Developer Guide）](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_rcps_examples.html)

## その他のポリシータイプ

- タグポリシー：リソースに付与するタグの命名規則やキー・値の許可リストを統制する
- バックアップポリシー：AWS Backup のバックアッププランを組織内のアカウントに一括適用する
- AI サービスのオプトアウトポリシー：AI/ML サービスによるデータ利用のオプトアウト設定を組織単位で統制する

## 他サービスとの連携

Organizations は、多くの AWS サービスと連携して「組織全体への一括設定・委任管理」を実現します。

- IAM Identity Center：組織内の複数アカウントへの SSO アクセス権限を一元管理
- AWS Config／AWS CloudTrail／Security Hub／GuardDuty：組織全体のリソース設定・API 操作履歴・セキュリティ検出結果を、委任した管理者アカウントに集約
- AWS RAM（Resource Access Manager）：組織内アカウント間でのリソース共有

## AWS Control Tower との関係

AWS Control Tower は、Organizations、IAM Identity Center、Config、CloudTrail などを組み合わせて、ベストプラクティスに沿ったマルチアカウント環境（ランディングゾーン）を自動構築するサービスです。Organizations がマルチアカウント管理の基盤であるのに対し、Control Tower はその上に乗るガバナンスの自動化レイヤーという位置づけになります。

## ユースケース

- 本番・検証・開発環境をアカウントレベルで分離し、影響範囲を限定する
- 複数事業部・複数チームでのコスト管理と請求の一元化
- SCP による全社共通のセキュリティガードレール（禁止リージョン、禁止サービスなど）の適用
- 監査ログ（CloudTrail）やセキュリティ検出結果（GuardDuty、Security Hub）の集約管理
- 新規プロジェクト用アカウントの払い出しの標準化・自動化

## 料金

AWS Organizations 自体の利用に追加料金は発生しません。組織内の各アカウントで発生する AWS サービスの利用料金が、通常どおり請求される仕組みです。詳細は [AWS Organizations の料金ページ](https://aws.amazon.com/organizations/pricing/) を確認してください。

## メリット

- アカウントを分離しつつ、請求・権限統制・監査を一元管理できる
- SCP により、IAM ポリシーだけでは防ぎきれない「うっかり」を組織レベルで防止できる
- 一括請求による volume discount の恩恵を組織全体で受けられる
- Control Tower やセキュリティサービスとの委任管理により、大規模組織のガバナンスを効率化できる

## デメリット・注意点

- SCP は強力な分、設計を誤ると必要な操作までブロックしてしまうことがある（暗黙的な拒否の仕組みの理解が必須）
- OU 構成やポリシーの設計を後から大きく変更するのはコストがかかるため、初期設計が重要
- マルチアカウント自体の運用（アカウントのライフサイクル管理、IAM Identity Center との連携設定など）には一定の学習コストがかかる
- 管理アカウントは強い権限を持つため、管理アカウント自体のセキュリティ統制が組織全体のセキュリティレベルを左右する

## 📖 まとめ

AWS Organizations は、複数の AWS アカウントを束ねて一元的に統制するための基盤サービスです。一括請求による コスト最適化だけでなく、SCP や RCP による組織横断的なガードレールの適用、各種セキュリティサービスとの委任管理の起点としての役割も大きく、マルチアカウント戦略を取る組織にとって欠かせない存在です。AWS Control Tower と組み合わせることで、ガードレールの適用やアカウント払い出しをさらに自動化できます。
