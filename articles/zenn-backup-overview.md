---
title: "AWS Backup 概要（基本と DR 戦略、PITR）" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study", "backup"]
published: false
emoji: "💾"
---


# AWS Backup 概要<!-- omit in toc -->

![icon](/images/icons/64/Arch_AWS-Backup_64.png)

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

本ページは 1 つの AWS アカウントで AWS Backup を使い始めるための内容です。Organizations を使った複数アカウントの保護やランサムウェア対策は [AWS Backup 応用](./backup-advanced.md) で解説します。

## 👀 Contents<!-- omit in toc -->

<!-- Duration: 00:01:00 -->

- [AWS Backup とは](#aws-backup-とは)
- [サポートされているサービス](#サポートされているサービス)
- [DR 戦略の基本](#dr-戦略の基本)
  - [DR と高可用性の違い](#dr-と高可用性の違い)
  - [RPO と RTO](#rpo-と-rto)
  - [4 つのシナリオ](#4-つのシナリオ)
- [AWS Backup の基本](#aws-backup-の基本)
  - [バックアッププラン](#バックアッププラン)
  - [バックアップボールトと暗号化](#バックアップボールトと暗号化)
  - [ライフサイクルとコールドストレージ](#ライフサイクルとコールドストレージ)
  - [リージョン間コピー](#リージョン間コピー)
  - [復元と復元テスト](#復元と復元テスト)
  - [監視と検索](#監視と検索)
- [PITR（継続的バックアップ）](#pitr継続的バックアップ)
  - [共通の制約](#共通の制約)
  - [S3 と RDS、Aurora の違い](#s3-と-rdsaurora-の違い)
  - [定期バックアップとの併用](#定期バックアップとの併用)
- [料金](#料金)
- [実装例](#実装例)
- [📖 まとめ](#-まとめ)

## AWS Backup とは

<!-- Duration: 00:02:00 -->

[AWS Backup サービス概要](https://aws.amazon.com/jp/backup/)

[AWS Backup ドキュメント](https://docs.aws.amazon.com/ja_jp/aws-backup/?id=docs_gateway)

[AWS Backup よくある質問](https://aws.amazon.com/jp/backup/faqs/)

[AWS Backup の料金](https://aws.amazon.com/jp/backup/pricing/)

AWS Backup は、AWS の各サービスのバックアップを一元管理するフルマネージドサービスです。これまでサービスごとに設定していたスケジュール、保持期間、別リージョンへのコピーを、1 つのプランにまとめて定義できます。

```text
AWS Backup で守れるのは主にデータです。
VPC や IAM ロールなどは、CloudFormation や CDK で復旧先にデプロイできるように別途準備しておく必要があります。
```

## [サポートされているサービス](https://docs.aws.amazon.com/ja_jp/aws-backup/latest/devguide/working-with-supported-services.html)

<!-- Duration: 00:02:00 -->

- コンピューティング
  - EC2、EKS（クラスタの状態と永続ボリューム）、VMware、Windows VSS
- ストレージ
  - S3、EBS、EFS、FSx（4 種類）、Storage Gateway（Volume Gateway）
- データベース
  - RDS、Aurora、Aurora DSQL、DynamoDB、DocumentDB、Neptune、Redshift、Redshift Serverless、Timestream for LiveAnalytics
- その他
  - CloudFormation スタック、SAP HANA on EC2

コピーやコールドストレージなどの対応状況はリソースごとに異なります。設計時は [リソース別の機能の可用性](https://docs.aws.amazon.com/ja_jp/aws-backup/latest/devguide/backup-feature-availability.html) を確認してください。

対応リソースは、AWS Backup が完全に管理するもの（Fully managed。S3、EFS など）と、そうでないもの（EBS、RDS など）に分かれます。暗号化キーやコピー時の課金先の扱いがこの区分で変わります。

## DR 戦略の基本

<!-- Duration: 00:05:00 -->

バックアップの設計は「どの災害から、どこまで戻すか」を決めるところから始まります。AWS Black Belt の DR 戦略シリーズの流れに沿って整理します。

### DR と高可用性の違い

高可用性（HA）は AZ 以下の障害を対象に、サービスを止めない設計を可用性のメトリクスで評価します。一方 DR（Disaster Recovery）はリージョン単位の災害を対象に、RPO と RTO で評価します。

マルチ AZ 構成で HA を確保していても、誤操作で消したデータやリージョン全体の障害からは復旧できません。バックアップは HA の代わりではなく、別の障害に備えるものです。

### RPO と RTO

- RPO（Recovery Point Objective）
  - どの時点のデータまで戻せればよいか。許容できるデータ損失の量
- RTO（Recovery Time Objective）
  - 復旧にどれだけ時間をかけてよいか。許容できる停止時間

どちらも短くするほどコストが増えるので、業務側と合意して決めます。

### 4 つのシナリオ

| シナリオ | RPO / RTO の目安 | コスト | 復旧先の状態 |
| --- | --- | --- | --- |
| バックアップ&リストア | 数時間 | $ | データのコピーのみ。インフラは復旧時に作成 |
| パイロットライト | 数十分 | $$ | データは同期し、コンピュートは停止または未作成 |
| ウォームスタンバイ | 数分 | $$$ | 縮小した構成で常時稼働 |
| マルチサイト アクティブ/アクティブ | リアルタイム | $$$$ | 全リージョンで本番同等に稼働 |

AWS Backup が直接担うのは、バックアップ&リストアのシナリオです。進め方は「設計、保護、自動化、復旧」の順になります。リージョン障害時に手順書どおり動くかは、データだけでなくインフラのデプロイまで含めて試さないとわかりません。

東京と大阪で 4 戦略を実装して計測した例では、切り替え完了までの時間は次のようになりました。[multi-region-dr-strategies](https://github.com/ishiharatma/aws-cdk-reference-architectures/tree/main/infrastructure/workspaces/multi-region-dr-strategies) の実測値で、構成によって変わります。

- アクティブ/アクティブ: 約 34 秒
- ウォームスタンバイ: 約 36 秒
- パイロットライト: 約 84 秒
- バックアップ&リストア: 6 分以上

## AWS Backup の基本

<!-- Duration: 00:10:00 -->

- バックアッププラン
  - いつ、どのリソースを、どのボールトに、どれだけの期間保持するかの定義
- バックアップボールト
  - 復旧ポイントを格納するコンテナ。KMS で暗号化される
- 復旧ポイント
  - バックアップされた 1 回分のデータ
- オンデマンドバックアップ
  - プランを介さず、その場で 1 回取得するバックアップ

### バックアッププラン

プランは「ルール」と「リソースの割り当て」で構成されます。

ルールにはスケジュール、バックアップウィンドウ、保持期間、ライフサイクル、コピー先を指定します。スケジュールの最短間隔は、スナップショットで 1 時間です。保持は日数で指定し、世代数の指定はありません。

リソースの割り当ては、リソースタイプ、リソース ID、タグで指定します。タグで割り当てておくと、新しく作ったリソースもタグを付けるだけで保護の対象になります。

### バックアップボールトと暗号化

既定では `aws/backup` の AWS マネージドキーが使われ、カスタマーマネージドキー（CMK）も指定できます。

```text
ボールトのキーが適用されるのは Fully managed のリソースのみです。
それ以外のリソースは、元のリソースの暗号化キーを引き継ぎます。
```

ボールトにはアクセスポリシーを設定できます。次の例では、特定のロール以外による復旧ポイントの削除を拒否します。

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": "backup:DeleteRecoveryPoint",
      "Resource": "*",
      "Condition": {
        "ArnNotEquals": {
          "aws:PrincipalArn": "arn:aws:iam::111122223333:role/BackupAdmin"
        }
      }
    }
  ]
}
```

### ライフサイクルとコールドストレージ

一定期間が過ぎた復旧ポイントは、低コストのコールドストレージへ移行できます。ただしコールドへ移行すると最低 90 日は保持する必要があるので、保持期間は移行日数に 90 日を足した値以上にします。

料金ページでコールドストレージの単価が示されているのは EBS、EFS、DynamoDB、Timestream、SAP HANA on EC2、VMware です。

### リージョン間コピー

バックアップルールにコピー先のリージョンとボールトを指定すると、バックアップのたびに別リージョンへコピーされます。コピー先のボールトは事前に作成しておきます。

### 復元と復元テスト

復元は既存のリソースを上書きせず、新しいリソースを作成します。接続先の切り替えは別途必要です。

復元テストを使うと、プランに沿って定期的に復元し、所要時間を計測して、終わったら自動で削除できます。EventBridge と Lambda を組み合わせれば、復元したデータの中身も検証できます。

- 対象
  - Aurora、DocumentDB、DynamoDB、EBS、EC2、EFS、FSx、Neptune、RDS、Redshift、S3
- 検証用リソースの保持
  - 1〜168 時間
- 開始ウィンドウ
  - 1〜168 時間

### 監視と検索

ジョブの状態は EventBridge、SNS、CloudWatch で監視し、API の呼び出しは CloudTrail に記録されます。失敗に気づけないバックアップは、取っていないのと同じなので、少なくとも失敗の通知は設定しておきましょう。

Backup search を使うと、S3 と EBS の復旧ポイントの中からファイルやオブジェクトを探せます。インデックス作成のオプトインが必要で、インデックスの作成、保管、検索に課金されます。

## PITR（継続的バックアップ）

<!-- Duration: 00:08:00 -->

継続的バックアップを有効にすると、保持期間内の任意の時点に 1 秒の精度で復元できます。誤更新の直前に戻したいケースで効果があります。対応しているのは S3、RDS（マルチ AZ DB クラスターを除く）、Aurora、SAP HANA on EC2 です。

ルールの設定で有効にします（CLI では `EnableContinuousBackup`）。作られる復旧ポイントは 1 つで、ID が `continuous` で始まり、タイプは「連続」と表示されます。PITR に対応しないリソースで有効にしても、通常のスナップショットとして動作します。

### 共通の制約

- 保持期間は最大 35 日
- 1 つのリソースに継続的バックアップは 1 つだけ
- オンデマンドでは取得できず、コールドストレージへの移行もできない

PITR 自体はコピーできません。コピーのオプションを有効にすると、スナップショットがコピーされます。つまりコピー先のリージョンでは任意の時点には戻せず、RPO はスナップショットの取得間隔で決まります。

### S3 と RDS、Aurora の違い

| 項目 | S3 | RDS | Aurora |
| --- | --- | --- | --- |
| 復元できる最新時点 | 直近 15 分まで | 直近 5 分まで | 直近 5 分まで |
| 前提 | バージョニングの有効化 | RDS の自動バックアップ機能を利用 | 同左 |
| 対象外 | Glacier Flexible Retrieval、Deep Archive | RDS Custom | なし |
| 復元の結果 | 復元先に同じ名前のオブジェクトがあればスキップ | 新しい DB インスタンスを作成 | 新しいクラスターのみ作成。インスタンスは手動で作成 |
| 復旧ポイントの削除 | 「保持をやめる」を選ぶと継続は停止し、期限までは復元可能 | 完全に削除すると自動バックアップも無効 | Aurora 側に残り、保持期間は 1 日に |

⚠️ S3 は EventBridge でオブジェクトの変更を追跡しています。バケットの EventBridge 通知を無効にするとバックアップが止まるので注意が必要です。バケットの設定自体はバックアップの対象外です。

⚠️ RDS と Aurora では、継続的バックアップを有効にすると AWS Backup が自動バックアップを管理するため、バックアップウィンドウを手動で設定できなくなります。

### 定期バックアップとの併用

S3 では、定期バックアップのたびにバケット全体をスキャンして各オブジェクトの ACL とタグを取得します。オブジェクト数が多いとリクエスト料金に効いてきますが、継続的バックアップと組み合わせるとこのスキャンが発生しません。

直近は PITR で細かく戻し、長期保管やコピーは定期のスナップショットに任せる構成が扱いやすいです。

## 料金

<!-- Duration: 00:02:00 -->

[AWS Backup の料金](https://aws.amazon.com/jp/backup/pricing/) は次の要素で決まります。単価はリソースとリージョンで異なるので、料金ページで確認してください。

- バックアップストレージ（ウォーム、コールド）
- リージョン間のデータ転送
- 復元したデータの量
- 復元テスト、Backup search、Audit Manager（使った場合）

## 実装例

<!-- Duration: 00:01:00 -->

[aws-backup-cross-region](https://github.com/ishiharatma/aws-cdk-reference-architectures/tree/main/infrastructure/workspaces/aws-backup-cross-region) は、東京から大阪へのコピーを CDK で実装したものです。単一のタグベースの割り当てで EC2、RDS、S3、CloudFormation スタックを保護し、プライマリで 35 日、セカンダリで 90 日保持します。

[multi-region-dr-strategies](https://github.com/ishiharatma/aws-cdk-reference-architectures/tree/main/infrastructure/workspaces/multi-region-dr-strategies) は、DR の 4 戦略を東京と大阪で実装した構成です。

## 📖 まとめ

<!-- Duration: 00:01:00 -->

バックアップの設計は RPO と RTO を決めるところから始め、AWS Backup のプランとタグで対象を揃えます。直近の誤操作には PITR、リージョン障害にはコピーと、失敗のパターンごとに手段を分けて考えると整理しやすくなります。

取得できていても、戻せなければ意味がありません。復元テストを運用に組み込むところまでが設計です。

参考資料は次のとおりです。

【AWS Black Belt Online Seminar】[AWS Backup で考える DR 戦略 #1 基本編](https://pages.awscloud.com/rs/112-TZM-766/images/AWS-Black-Belt_2025_AWS-Backup-DR-Strategy-Basic_0430_v1.pdf)

【AWS Black Belt Online Seminar】[AWS Backup で考える DR 戦略 #2 PITR 編](https://pages.awscloud.com/rs/112-TZM-766/images/AWS-Black-Belt_2025_AWS-Backup-DR-Strategy-PITR_1130_v1.pdf)
