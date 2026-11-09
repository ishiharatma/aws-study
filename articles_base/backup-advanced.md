# AWS Backup 応用<!-- omit in toc -->

![icon](/images/icons/64/Arch_AWS-Backup_64.png)

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

本ページは、複数の AWS アカウントを管理するプラットフォーム担当の方に向けた内容です。プラン、ボールト、PITR などの基本は [AWS Backup 概要](./backup-overview.md) を先に確認してください。

## 👀 Contents<!-- omit in toc -->

<!-- Duration: 00:01:00 -->

- [複数アカウントで起きる課題](#複数アカウントで起きる課題)
- [Fully managed とそれ以外の違い](#fully-managed-とそれ以外の違い)
- [バックアップポリシー](#バックアップポリシー)
- [クロスアカウントコピー](#クロスアカウントコピー)
- [Vault Lock](#vault-lock)
- [論理エアギャップボールト](#論理エアギャップボールト)
  - [対応リソース](#対応リソース)
  - [マルチパーティ承認](#マルチパーティ承認)
- [Audit Manager](#audit-manager)
- [実装例](#実装例)
- [📖 まとめ](#-まとめ)

## 複数アカウントで起きる課題

<!-- Duration: 00:02:00 -->

アカウントが増えると、各アカウントで個別にプランを作る運用は破綻しがちです。Black Belt では次の 3 つの課題と、対応する機能が整理されています。

| 課題 | 起きること | 対応する機能 |
| --- | --- | --- |
| 管理の複雑さ | アカウントごとに設定がばらつく | バックアップポリシー |
| データ保護の脆弱性 | アカウントが侵害されるとバックアップも一緒に失う | クロスアカウントコピー、論理エアギャップボールト |
| 可視性の不足 | 全体の準拠状況が見えない | Audit Manager |

AWS Backup の Organizations 機能は、管理アカウントのほか委任管理者のアカウントからも操作できるので、管理アカウントでの日常作業を減らせます。

## Fully managed とそれ以外の違い

<!-- Duration: 00:02:00 -->

本ページの機能の多くは、リソースが Fully managed（S3、EFS など）かどうかで動作が変わります。先に違いを押さえておくと、後の制約が理解しやすくなります。

| 項目 | Fully managed | それ以外（EBS、RDS など） |
| --- | --- | --- |
| 復旧ポイントの暗号化 | ボールトのキー | 元のリソースのキー |
| クロスアカウントコピーのキー | AWS マネージドキーも可 | CMK が必要 |
| コピーのデータ転送料金 | コピー元に課金 | コピー先に課金 |

## バックアップポリシー

<!-- Duration: 00:05:00 -->

バックアップポリシーは、Organizations の管理ポリシーの 1 つで、バックアッププランを JSON で定義して root、OU、アカウントにアタッチします。`Rules`、`Regions`、`Selections`（タグによる割り当て）などを記述し、コンソールではビジュアルエディタも使えます。

メンバーアカウントには ID が `orgs/` で始まるプランが作られ、変更できるのは管理アカウントと委任管理者だけです。アプリチームが誤ってプランを消す心配がなくなります。

```text
ポリシーで配布されるのはプランのみで、ボールトは作成されません。
参照するボールトは、CloudFormation などで事前に各アカウントへ配布しておきます。
```

## クロスアカウントコピー

<!-- Duration: 00:05:00 -->

設定の順序は次のとおりです。

1. 管理アカウントでクロスアカウントバックアップを有効にする
2. コピー先のボールトのアクセスポリシーで、コピー元のアカウントからの書き込みを許可する
3. コピー元のプラン、オンデマンド、またはバックアップポリシーの `copy_actions` でコピー先を指定する

コピー元とコピー先は同じ Organization に属している必要があります。増分コピーに対応しており、コピー先ではコピー先のボールトのキーで暗号化されます。ただし未暗号化の Aurora、DocumentDB、Neptune は暗号化されません。

⚠️ Redshift、Redshift Serverless、標準の DynamoDB はコピーに対応していません。同じアカウント、同じリージョンの別ボールトへのコピーも不可です。CloudFormation はクロスリージョンコピーのみ対応しており、クロスアカウントコピーはできません。

⚠️ コールドストレージにある復旧ポイントはコピーできません。

## Vault Lock

<!-- Duration: 00:03:00 -->

Vault Lock は、ボールト内の復旧ポイントを保持期間が終わるまで削除できないようにする機能です。追加料金はかかりません。

| モード | 解除 | 用途 |
| --- | --- | --- |
| ガバナンス | 十分な権限があれば解除可能 | 誤削除の防止、テスト運用 |
| コンプライアンス | 猶予期間（grace time、最小 3 日）の経過後は、AWS を含め誰も変更、削除できない | 規制対応、改ざん防止 |

保持期間は 1〜36,500 日の範囲で設定できます。コンプライアンスモードは SEC 17a-4、CFTC、FINRA の要件について Cohasset の評価を受けています。

⚠️ コンプライアンスモードは確定すると元に戻せません。最初はガバナンスモードか、十分な猶予期間で試してください。なお、アカウントを閉鎖すると Vault Lock があってもデータは削除されます。

## 論理エアギャップボールト

<!-- Duration: 00:08:00 -->

論理エアギャップ（Logically Air-Gapped）ボールトは、ランサムウェアやアカウント侵害に備える専用のボールトです。コンプライアンスモードの Vault Lock が自動で適用され、最小の保持期間は 7 日です。

暗号化は既定の AWS 所有キーが推奨です。CMK も使えますが、指定できるのはボールトの作成時だけです。

他のアカウントへは AWS RAM で共有します。共有先は閲覧と復元ができ、コピーはできません。データを複製せずに共有するため、別アカウントへ復元する場合の RTO を短くできます。

- 共有の単位はアカウント ID のみで、OU は指定できない
- 別の Organization のアカウントとも共有できる
- 所有アカウントの閉鎖後も、閉鎖後の期間内はアクセスできる

リージョン障害に備えるなら、クロスリージョンコピーとの併用が推奨されています。中国リージョンと GovCloud では利用できません。

### 対応リソース

EC2、S3、EBS、Aurora（継続的バックアップを除く）、Aurora DSQL、EFS、FSx（4 種類）、Storage Gateway、DocumentDB、Neptune（ジャカルタを除く）、DynamoDB（高度な機能を有効にした場合）、Timestream、VMware、Windows VSS、EKS（バーレーン、UAE を除く）に対応しています。

RDS、標準の DynamoDB、Redshift、Redshift Serverless、SAP HANA、CloudFormation、未暗号化の Aurora / DocumentDB / Neptune は対象外です。また Fully managed でないリソースには CMK が必要です。

### マルチパーティ承認

Multi-party approval（MPA）は、重要な操作に複数人の承認を必須にする機能です。攻撃者が管理アカウントへのアクセスを取得しても、一方的な変更や不正な操作を防げます。

IAM Identity Center の上に MPA チームを作り、RAM で共有して、あらかじめ論理エアギャップボールトに関連付けておきます。承認者の退職や異動でチームが機能しなくなると意味がないので、ベースライン機能で定期的に確認します。

## Audit Manager

<!-- Duration: 00:02:00 -->

AWS Backup Audit Manager は、バックアップがルールどおりに取得されているかを評価し、日次でレポートを生成します。料金は評価あたり $0.00125 と AWS Config の料金がかかります。

## 実装例

<!-- Duration: 00:01:00 -->

コピーの設定を CDK でどう書くかは、東京から大阪へコピーする [aws-backup-cross-region](https://github.com/ishiharatma/aws-cdk-reference-architectures/tree/main/infrastructure/workspaces/aws-backup-cross-region) が参考になります。単一アカウントの構成です。

## 📖 まとめ

<!-- Duration: 00:01:00 -->

複数アカウントの保護は、バックアップポリシーで標準を配り、別アカウントへのコピーや論理エアギャップボールトでアカウント侵害に備える、という順で組み立てると進めやすくなります。

一方で、Vault Lock のコンプライアンスモードや MPA は後から取り消しづらい設定です。対応リソースと承認者の運用を確認してから適用しましょう。

参考資料は次のとおりです。

【AWS Black Belt Online Seminar】[AWS Backup で考える DR 戦略 #3 AWS Organizations 活用編](https://pages.awscloud.com/rs/112-TZM-766/images/AWS-Black-Belt_2026_AWS-Backup-DR-3-AWS-Organizations_0713_v1.pdf)

[論理エアギャップボールト](https://docs.aws.amazon.com/ja_jp/aws-backup/latest/devguide/logicallyairgappedvault.html)

[AWS Backup Vault Lock](https://docs.aws.amazon.com/ja_jp/aws-backup/latest/devguide/vault-lock.html)
