<!--# Temporary elevated access management (TEAM) for AWS IAM Identity Center <!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

<!-- Duration: 00:01:00 -->

- [1. TEAM for AWS IAM Identity Center とは](#1-team-for-aws-iam-identity-center-とは)
  - [1.1. 公式ドキュメント](#11-公式ドキュメント)
  - [1.2. 導入のメリット](#12-導入のメリット)
  - [1.3. 主なユースケース](#13-主なユースケース)
- [2. 基本機能](#2-基本機能)
  - [2.1. 権限申請機能](#21-権限申請機能)
  - [2.2. 承認ワークフロー](#22-承認ワークフロー)
  - [2.3. 一時権限の自動付与・削除](#23-一時権限の自動付与削除)
  - [2.4. 通知機能](#24-通知機能)
  - [2.5. 監査とコンプライアンス](#25-監査とコンプライアンス)
  - [2.6. ポリシー管理](#26-ポリシー管理)
- [3. 運用のポイント](#3-運用のポイント)
  - [3.1. コスト管理](#31-コスト管理)
  - [3.2. モニタリング](#32-モニタリング)
  - [3.3. セキュリティ](#33-セキュリティ)
    - [1. 最小権限の原則](#1-最小権限の原則)
    - [2. 承認プロセスの設計](#2-承認プロセスの設計)
    - [3. 監査とレビュー](#3-監査とレビュー)
    - [4. 設定の定期的な見直し](#4-設定の定期的な見直し)
    - [5. バックアップと災害対策](#5-バックアップと災害対策)
    - [6. 通信のセキュリティ](#6-通信のセキュリティ)
- [4. デプロイ方法](#4-デプロイ方法)
  - [デプロイの流れ](#デプロイの流れ)
  - [デプロイ前準備](#デプロイ前準備)
    - [ステップ１： AWS IAM Identity Centerの管理アカウントからTEAM管理アカウントへの権限委任](#ステップ１-aws-iam-identity-centerの管理アカウントからteam管理アカウントへの権限委任)
    - [ステップ２：personal access token (classic) の作成とAWS Secrets Managerへの登録](#ステップ２personal-access-token-classic-の作成とaws-secrets-managerへの登録)
    - [ステップ３：TEAMで利用する IAM Identity Center グループの作成](#ステップ３teamで利用する-iam-identity-center-グループの作成)
    - [ステップ４：CloudTrail Lake EventDataStoreの作成](#ステップ４cloudtrail-lake-eventdatastoreの作成)
  - [デプロイ](#デプロイ)
    - [ステップ１：GitHubリポジトリのクローン](#ステップ１githubリポジトリのクローン)
    - [ステップ２：デプロイ用パラメータの作成](#ステップ２デプロイ用パラメータの作成)
    - [ステップ３：デプロイ実行](#ステップ３デプロイ実行)
    - [ステップ４：IAM Identity Center SAML Integrationの設定](#ステップ４iam-identity-center-saml-integrationの設定)
    - [ステップ５：Amazon Cognitoの設定](#ステップ５amazon-cognitoの設定)
    - [ステップ６：Amazon SESの設定](#ステップ６amazon-sesの設定)
- [5. デプロイ後のステップ](#5-デプロイ後のステップ)
- [6. アンインストール](#6-アンインストール)
    - [ステップ１：アンインストール](#ステップ１アンインストール)
    - [ステップ２：S3バケットの削除](#ステップ２s3バケットの削除)
    - [ステップ３：IAM Identity Center から TEAM アプリの削除](#ステップ３iam-identity-center-から-team-アプリの削除)
    - [ステップ４：TEAMで利用していた IAM Identity Center グループの削除](#ステップ４teamで利用していた-iam-identity-center-グループの削除)
  - [TEAM用IAM Identity Centerグループ定義例](#team用iam-identity-centerグループ定義例)
- [7. 利用者向けガイド](#7-利用者向けガイド)
  - [TEAMアプリケーションにログインする](#teamアプリケーションにログインする)
  - [一時アクセス許可の申請を行う](#一時アクセス許可の申請を行う)
  - [申請のステータスを確認する](#申請のステータスを確認する)
  - [申請をキャンセルする](#申請をキャンセルする)
- [8. 管理者向けガイド](#8-管理者向けガイド)
  - [TEAMアプリケーション管理者を追加または削除する](#teamアプリケーション管理者を追加または削除する)
  - [TEAMアプリケーション監査者を追加または削除する](#teamアプリケーション監査者を追加または削除する)
  - [申請者管理](#申請者管理)
    - [TEAMアプリケーションを使って申請できる人を追加または削除する](#teamアプリケーションを使って申請できる人を追加または削除する)
    - [TEAMアプリケーションの申請者グループを追加、削除する](#teamアプリケーションの申請者グループを追加削除する)
    - [申請者ポリシーを管理する](#申請者ポリシーを管理する)
  - [承認管理](#承認管理)
    - [承認ポリシーを管理する](#承認ポリシーを管理する)
    - [その他設定](#その他設定)
      - [申請に対する承認を有効または無効に変更する](#申請に対する承認を有効または無効に変更する)
      - [申請時のコメント入力を必須または任意に変更する](#申請時のコメント入力を必須または任意に変更する)
      - [申請時のチケット番号入力を必須または任意に変更する](#申請時のチケット番号入力を必須または任意に変更する)
      - [一時権限の最大利用可能時間を設定する](#一時権限の最大利用可能時間を設定する)
      - [未承認リクエストの期限切れとなる時間を設定する](#未承認リクエストの期限切れとなる時間を設定する)
      - [Eメールによる申請通知を有効にする](#eメールによる申請通知を有効にする)
      - [SNSによる申請通知を有効にする](#snsによる申請通知を有効にする)
      - [Slackによる申請通知を有効にする](#slackによる申請通知を有効にする)
- [9. 承認者向けガイド](#9-承認者向けガイド)
  - [申請を承認する](#申請を承認する)
  - [申請を否認する](#申請を否認する)
  - [自身が実施した承認履歴を確認する](#自身が実施した承認履歴を確認する)
- [10. 監査者向けガイド](#10-監査者向けガイド)
  - [承認履歴を閲覧する](#承認履歴を閲覧する)
  - [セッションアクティビティを確認する](#セッションアクティビティを確認する)
- [📖 まとめ](#-まとめ)
  - [TEAMの主な特徴](#teamの主な特徴)
  - [導入効果](#導入効果)
  - [導入時の検討ポイント](#導入時の検討ポイント)
  - [次のステップ](#次のステップ)
  - [参考リソース](#参考リソース)

## 1. TEAM for AWS IAM Identity Center とは

![TEAM](/images/team/home_page.png)

Temporary elevated access management (TEAM) for AWS IAM Identity Center とは、AWS が提供するオープンソースソリューションで、ユーザーに一時的な管理者権限を付与するための仕組みです。

![TEAM architecture](/images/team/archi.png)

** 画像は TEAM の GitHub より引用

### 1.1. 公式ドキュメント

TEAMを理解する公式ドキュメントは次のとおりです。

[Temporary elevated access management (TEAM)](https://aws-samples.github.io/iam-identity-center-team/)

[GitHub](https://github.com/aws-samples/iam-identity-center-team/tree/main)

[AWS Security Blog on 08 JUN 2023](https://aws.amazon.com/jp/blogs/security/temporary-elevated-access-management-with-iam-identity-center/)

[builders.flash on 2025-05-01 | AWS Community Hero: 山口 正徳氏)](https://aws.amazon.com/jp/builders-flash/202505/temporary-elevated-access-management/)

### 1.2. 導入のメリット

TEAMを導入する主なメリットは以下の5つです。

- 常時管理者権限の排除
  - 常設の管理者権限を削減し、必要な時だけ一時的に権限を付与することで、セキュリティリスクを最小化できます
- 承認ワークフローの実装
  - 申請・承認プロセスを通じて、権限付与の透明性と説明責任を確保できます
- 監査証跡の自動記録
  - すべての権限申請、承認、アクセスログが自動的に記録され、コンプライアンス要件に対応できます
- 柔軟なポリシー設定
  - グループ、アカウント、OU単位で細かく権限申請のルールを設定でき、組織の要件に合わせた運用が可能です
- 運用コストの削減
  - IAM Identity Centerと統合されているため、既存のユーザー管理基盤をそのまま活用でき、追加の認証基盤が不要です

### 1.3. 主なユースケース

- 本番環境へのアクセス管理
  - 開発者やオペレーターが本番環境で作業する際に、一時的な管理者権限を申請・承認フローを通じて付与
- 緊急対応時の権限付与
  - インシデント対応やトラブルシューティング時に、迅速かつ記録可能な形で必要な権限を付与
- コンプライアンス対応
  - SOC2、ISO27001などの監査要件に対応するため、すべての特権アクセスの記録と承認証跡を保持
- 職務分離の実現
  - 申請者と承認者を分離し、自己承認を防止することで、内部統制を強化
- マルチアカウント環境での権限管理
  - AWS Organizationsと連携し、複数のAWSアカウントに対する一時権限を一元管理

## 2. 基本機能

<!-- Duration: 0:01:30 -->

TEAMは以下の主要な機能を提供します。

### 2.1. 権限申請機能

利用者（申請者）は、Webベースのダッシュボードから一時的な管理者権限を申請できます。

申請時に指定可能な項目は次のようなものがあります。

- 対象のAWSアカウント
- 付与する権限（IAM Identity Centerの許可セット）
- アクセス開始時刻
- アクセス期間（時間単位）
- 作業理由（Justification）
- チケット番号（任意、または必須に設定可能）

申請後、設定された承認ポリシーに従って承認者に通知が送信されます。

### 2.2. 承認ワークフロー

承認者は申請内容を確認し、承認または拒否を判断します。

承認ワークフローの特徴は次のとおりです。

- 承認者は申請内容の詳細（誰が、どのアカウントに、何の権限を、いつまで、なぜ必要か）を確認可能
- 自己承認の防止: 承認者権限を持っていても、自分自身の申請は承認できない仕組み
- 承認ポリシーは、アカウントまたはOU単位で設定可能
- 承認が不要な設定も可能（開発環境など、リスクの低い環境向け）

### 2.3. 一時権限の自動付与・削除

承認された申請は、指定された開始時刻に自動的にIAM Identity Centerで権限が付与されます。

TEAMはサーバーレスアーキテクチャで構築されており、以下のAWSサービスが連携して一時権限のライフサイクルを自動管理します。

**実装の仕組み:**

1. **申請データの保存**
   - 承認された申請情報（開始時刻、終了時刻、対象アカウント、権限など）はAmazon DynamoDBに保存されます

2. **権限の自動付与**
   - Amazon EventBridgeがスケジュール実行を管理し、指定された開始時刻にAWS Lambdaをトリガーします
   - Lambda関数がIAM Identity Center APIを呼び出し、対象ユーザーに対してアサインメント（Account Assignment）を作成します
   - ユーザーはAWSアクセスポータルにログインすると、付与された権限で対象アカウントにアクセスできるようになります

3. **権限の自動削除**
   - EventBridgeが定期的にDynamoDBの申請データをチェックし、終了時刻を過ぎたアクセスを検出します
   - Lambda関数がIAM Identity Center APIを呼び出し、該当するアサインメントを自動的に削除します
   - これにより、アクセス期間が終了すると自動的に権限が取り消されます

4. **ワークフローの調整**
   - AWS Step Functionsが申請から承認、通知、権限付与までの一連のワークフローを統合的に管理します
   - Amazon API Gateway + Lambdaがフロントエンド（Amplifyアプリ）からのリクエストを処理します

5. **監査ログの記録**
   - すべての権限付与・削除操作はAWS CloudTrailに記録され、監査証跡として保持されます
   - CloudTrail Lakeと統合することで、一時権限を使用したユーザーの操作履歴も追跡可能です

この自動化により、手動での権限管理が不要になり、人的ミス（権限の付けっぱなしなど）を防止できます。

### 2.4. 通知機能

申請や承認のステータス変化を、複数のチャネルで通知できます。

サポートされる通知方法は次のとおりです。

- Eメール通知: Amazon SESを利用した電子メール通知
- SNS通知: Amazon SNSトピックへの発行（Emailサブスクリプションやその他の統合が可能）
- Slack通知: Slackチャンネルへのリアルタイム通知

通知は申請者、承認者の両方に送信され、承認待ちや承認完了などのステータスをタイムリーに把握できます。

### 2.5. 監査とコンプライアンス

すべてのアクセス履歴と操作ログが記録され、監査に対応できます。

監査機能は次のとおりです。

- 承認履歴の閲覧: すべての申請と承認/拒否の履歴を確認可能
- セッションアクティビティログ: CloudTrail Lakeと統合し、一時権限でアクセスしたユーザーがどのAWSサービスにアクセスしたかを追跡
- CSVエクスポート: 監査レポート作成のため、履歴データをCSV形式でダウンロード可能
- 読み取り専用の監査者ロール: 監査者は履歴を閲覧できるが、設定変更や承認操作はできない

### 2.6. ポリシー管理

管理者は柔軟にポリシーを設定し、組織のセキュリティ要件に合わせた運用が可能です。

- 申請者ポリシー（Eligibility Policy）
  - 誰が（ユーザーまたはグループ）
  - どのアカウント/OUに対して
  - どの許可セットを
  - 何時間まで申請可能か
  - 承認が必要かどうか

- 承認者ポリシー（Approver Policy）
  - どのアカウント/OUに対する申請を
  - どの承認者グループが承認できるか

これらのポリシーにより、例えば「開発環境は承認不要で最大8時間」「本番環境は承認必須で最大4時間」といった柔軟な設定が可能です。

## 3. 運用のポイント

TEAMを効果的に運用するためのベストプラクティスと注意点を解説します。

### 3.1. コスト管理

TEAMアプリケーションの運用にかかる主なコストは以下の通りです。

**主なコスト要素:**
- **AWS Amplify**: Webアプリケーションのホスティング費用（ビルド時間とデータ転送量に応じた従量課金）
- **Amazon Cognito**: ユーザー認証の月間アクティブユーザー数に応じた課金
- **Amazon DynamoDB**: 申請・承認データの保存（オンデマンドモードの読み書き料金）
- **AWS Lambda**: 申請処理、承認処理、権限付与・削除処理の実行時間に応じた課金
- **CloudTrail Lake**: セッションアクティビティログの保存（データ取り込みと保存期間に応じた課金）
- **Amazon SES**: メール通知を利用する場合の送信料金

**コスト最適化のポイント:**
- CloudTrail Lake EventDataStoreの保持期間を適切に設定（365日が推奨ですが、要件に応じて調整可能）
- 不要な通知チャネルは無効化し、必要なもののみ有効化する
- 開発環境など頻繁にアクセスする環境は、承認不要で直接付与する設定を検討する（申請・承認のオーバーヘッドを削減）

💡 一般的な中小規模の組織（ユーザー数50名程度、月間申請数100件程度）であれば、月額コストは数十ドル程度に収まります。

### 3.2. モニタリング

TEAMアプリケーションの健全性と利用状況を継続的に監視することが重要です。

**監視すべき項目:**

**1. アプリケーションの可用性**
- AWS Amplifyのビルド状態とデプロイ状況を確認
- Lambda関数のエラー率と実行時間をCloudWatch メトリクスで監視
- DynamoDBのスロットリングエラーが発生していないか確認

**2. 利用状況の把握**
- 月間の申請件数と承認率の推移
- 承認待ち時間の平均値（承認プロセスのボトルネック検出）
- アカウント別、ユーザー別の申請頻度

**3. セキュリティイベントの監視**
- 拒否された申請の傾向（不正な申請の兆候）
- 期限切れになった申請の数（承認プロセスの遅延検出）
- キャンセルされた申請の理由

**推奨する監視方法:**
- CloudWatch ダッシュボードを作成し、Lambda関数のエラー、DynamoDBのメトリクス、Amplifyのビルド状況を可視化
- TEAMの監査者機能を活用し、定期的に承認履歴とセッションアクティビティをレビュー
- SNS通知を有効化し、管理者がリアルタイムで申請状況を把握できるようにする

### 3.3. セキュリティ

TEAMを安全に運用するためのセキュリティベストプラクティスです。


#### 1. 最小権限の原則

- 申請者ポリシーでは、必要最小限のアカウントと許可セットのみを申請可能にする
- 本番環境へのアクセスは必ず承認必須とし、非本番環境でも適切なポリシーを設定する
- 「AdministratorAccess」のような強力な権限は、真に必要な場合のみ申請可能にする

#### 2. 承認プロセスの設計

- 本番環境の承認者は、技術とビジネスの両面から判断できる経験豊富なメンバーを選定する
- 承認者グループは複数名で構成し、単一障害点を避ける（一人が不在でも承認できる体制）
- 緊急時の対応手順を事前に定義し、承認者に周知しておく

#### 3. 監査とレビュー

- 定期的（月次または四半期ごと）に承認履歴とセッションアクティビティを監査者がレビューする
- 異常なパターン（深夜の申請、長時間のアクセス、頻繁な申請）を検出し、必要に応じて調査する
- CloudTrail Lakeのクエリを活用し、一時権限で実行された操作を詳細に追跡する

#### 4. 設定の定期的な見直し

- 申請者ポリシーと承認者ポリシーを定期的に見直し、組織の変更に合わせて更新する
- 退職者や異動者のグループメンバーシップを迅速に削除する
- 最大申請期間の設定が適切か（長すぎないか）を定期的に確認する

#### 5. バックアップと災害対策

- TEAM管理アカウントのCloudFormationテンプレートとパラメータファイルをバージョン管理システムで管理する
- DynamoDBのバックアップを有効化し、データ損失に備える
- GitHub Personal Access Tokenは定期的にローテーションし、AWS Secrets Managerで安全に管理する

#### 6. 通信のセキュリティ

- TEAMアプリケーションはHTTPSで保護されており、IAM Identity Centerのフェデレーション認証を使用
- Cognitoユーザープールは外部からの直接アクセスを防ぎ、IAM Identity CenterのSAML統合のみを許可する
- 必要に応じて、AWS WAFをAmplifyアプリケーションに適用し、不正アクセスから保護する

💡 セキュリティインシデントが発生した場合は、TEAMアプリケーションの監査ログとCloudTrail Lakeを活用し、影響範囲を迅速に特定できます。

## 4. デプロイ方法

TEAMアプリケーションをTEAM管理用のAWSアカウントへデプロイするまでを解説します。

### デプロイの流れ

本ガイドで説明するデプロイの主な流れは以下の通りです。

1. デプロイ前準備
    1. IAM Identity Centerの管理アカウントからTEAM管理アカウントへ管理の委任を行う
    2. TEAMのGitリポジトリをCloneし、リポジトリにアクセスするためのpersonal access token (classic)を発行する
    3. TEAMで使用するIAM Identity Centerのグループを作成する
2. デプロイ実施
    1. デプロイ用のシェルを実行し、デプロイを行う
3. （Nextアクション ※本ガイド対象外）「02. Administrator Guide」に従い、設定を行う

### デプロイ前準備

#### ステップ１： AWS IAM Identity Centerの管理アカウントからTEAM管理アカウントへの権限委任

see: [TEAM Deployment guide](https://aws-samples.github.io/iam-identity-center-team/docs/deployment/prerequisites.html#dedicated-team-account)

**IAM Identity Centerの管理アカウントから、**以下の委任を実行します。

CloudShellや、ローカルからコマンドで実行が可能です。
ローカルから実行する場合は、コマンドの最後に、`--profile xxxxx` として管理アカウントのプロファイル名を指定します。

- IAM Identity Center

```bash
aws organizations register-delegated-administrator \
  --account-id 111122223333 \
  --service-principal sso.amazonaws.com
```

```bash
# 無効化する場合
aws organizations deregister-delegated-administrator \
  --account-id 111122223333 \
  --service-principal sso.amazonaws.com
```

- CloudTrail Lake

```bash
aws organizations register-delegated-administrator \
  --account-id 111122223333 \
  --service-principal cloudtrail.amazonaws.com
```

```bash
# 無効化する場合
aws organizations deregister-delegated-administrator \
  --account-id 111122223333 \
  --service-principal cloudtrail.amazonaws.com
```

- Account management

```bash
aws organizations enable-aws-service-access \
  --service-principal account.amazonaws.com

aws organizations register-delegated-administrator \
  --account-id 111122223333 \
  --service-principal account.amazonaws.com
```

```bash
# 無効化する場合（有効化したときと逆の順番で無効化します）
aws organizations deregister-delegated-administrator \
  --account-id 111122223333 \
  --service-principal account.amazonaws.com

aws organizations disable-aws-service-access \
  --service-principal account.amazonaws.com
```

委任状況は以下のコマンドで確認します。

```bash
aws organizations list-delegated-services-for-account \
  --account-id 111122223333 \
  --output text
```

以下のように出力されます。

```bash
#DELEGATEDSERVICES       2023-06-29T14:17:46.624000+00:00        account.amazonaws.com
#DELEGATEDSERVICES       2023-06-25T15:11:09.553000+00:00        cloudtrail.amazonaws.com
#DELEGATEDSERVICES       2023-06-25T14:56:02.172000+00:00        sso.amazonaws.com
```

#### ステップ２：personal access token (classic) の作成とAWS Secrets Managerへの登録

see: [TEAM Deployment guide](https://aws-samples.github.io/iam-identity-center-team/docs/deployment/prerequisites.html#aws-secrets-manager)

このTEAMアプリケーションをデプロイするフローの中で、GitHubリポジトリのソースを取得する必要があります。そのためのアクセストークンを発行します。

発行手順は、GitHub Docsの[ここ](https://docs.github.com/ja/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#personal-access-token-classic-%E3%81%AE%E4%BD%9C%E6%88%90)を参照してください。

権限は以下のように、[repo]をすべて指定します。

![WS000930.jpg](/images/team/deploy/WS000930.jpg)

⚠️　現状は、personal access token (classic)しか対応していません。そのため、アクセストークンは個人ユーザー管理になっています。（下記Issue参照）

Why classic GitHub tokens are required?
https://github.com/aws-samples/iam-identity-center-team/issues/401

発行したアクセストークンを**TEAM管理アカウントの**シークレットマネージャーに登録します。

```bash
# 新規作成
SECRET_NAME="TEAM-IDC-APP"
aws secretsmanager create-secret \
    --name "$SECRET_NAME" \
    --description "GitHub repository credentials for TEAM application" \
    --secret-string '{"url": "https://github.com/your-repository-name/iam-identity-center-team.git", "AccessToken": "xxxxxxx"}' \
    --tags Key=Project,Value=YOUR_PROJECT_NAME Key=Env,Value="YOUR_ENV" \
    --region "ap-northeast-1"
```

```bash
# 更新する場合
aws secretsmanager update-secret \
    --secret-id "$SECRET_NAME" \
    --description "GitHub repository credentials for TEAM application" \
    --secret-string '{"url": "https://github.com/your-repository-name/iam-identity-center-team.git","AccessToken": "xxxxxxx"}' \
    --tags Key=Project,Value=YOUR_PROJECT_NAME Key=Env,Value="YOUR_ENV" \
    --region "ap-northeast-1"
```

#### ステップ３：TEAMで利用する IAM Identity Center グループの作成

**TEAM管理アカウント**のCloudShellまたは、プロファイル名を指定してローカルからAWS CLIにて実行します。

```bash
STORE_ID=$(aws sso-admin list-instances --query "Instances[0].IdentityStoreId" --output text --no-paginate)

aws identitystore create-group --output yaml \\
  --identity-store-id "${STORE_ID}" \\
  --display-name "TEAM-Users" \\
  --description "TEAM アプリケーションで一時的なアクセス権限をリクエストするユーザーグループ(開発者やオペレーターなど)"

aws identitystore create-group --output yaml \\
  --identity-store-id "${STORE_ID}" \\
  --display-name "TEAM-Approvers-Production" \\
  --description "TEAM アプリケーションで本番アカウントへのリクエストをレビュー・承認 / 拒否する権限を持つユーザーグループ。ただし、自身のリクエストは自身では承認できません"

aws identitystore create-group --output yaml \\
  --identity-store-id "${STORE_ID}" \\
  --display-name "TEAM-Approvers-NonProduction" \\
  --description "TEAM アプリケーションで本番アカウント以外へのリクエストをレビュー・承認 / 拒否する権限を持つユーザーグループ。ただし、自身のリクエストは自身では承認できません"

aws identitystore create-group --output yaml \\
  --identity-store-id "${STORE_ID}" \\
  --display-name "TEAM-Admins" \\
  --description "TEAM アプリケーションの設定管理・ユーザー管理・グループ設定などを行うユーザーグループ"

aws identitystore create-group --output yaml \\
  --identity-store-id "${STORE_ID}" \\
  --display-name "TEAM-Auditors" \\
  --description "TEAMアプリケーションのリクエスト履歴やアクセスログの確認・レビューを行うユーザーグループ (読み取り専用)"
```

作成したグループは以下のコマンドで確認できます。

```bash
aws identitystore list-groups --output table \\
  --identity-store-id "${STORE_ID}" \\
  --query "Groups[?starts_with(DisplayName, 'TEAM')].[DisplayName,GroupId,Description]"
```

以下のように表示されます

```bash
#-------------------------------------------------------------------------------------------------
#|ListGroups                          |
#+------------------------------+---------------------------------------+------------------------+
#|  TEAM-Approvers-Production   |  0744ba98-8031-70a4-061a-ada3cf44ca14 |  xxxxx       |||
#|  TEAM-Auditors               |  37549a08-5081-702d-0063-15540c1d1abe |  xxxxx       ||
#|  TEAM-Users                  |  4754aa28-9041-7094-5ccc-3f27cacb7e2e |  xxxxx       |||
#|  TEAM-Admins                 |  6774ea58-2061-7071-b591-8b4d3fd32f0a |  xxxxx       ||
#|  TEAM-Approvers-NonProduction|  f7e44ab8-6091-704c-4461-e6f241837f74 |  xxxxx       |||
#+------------------------------+---------------------------------------+-----------------------+
```

#### ステップ４：CloudTrail Lake EventDataStoreの作成

**TEAM管理アカウント**のCloudShellまたは、プロファイル名を指定してローカルからAWS CLIにて実行します。

```bash
EDS_NAME="TEAM-audit-logs"

aws cloudtrail create-event-data-store \
    --name "$EDS_NAME" \
    --multi-region-enabled \
    --organization-enabled \
    --retention-period 365 \
    --no-termination-protection-enabled \
    --tags-list Key=Project,Value=YOUR_PROJECT_NAME Key=Env,Value=YOUR_ENV \
    --region "ap-northeast-1"
```

削除するときは以下のコマンドを使用します。

```bash
aws cloudtrail delete-event-data-store \
    --event-data-store "$EDS_NAME" \
    --region "ap-northeast-1"
```

### デプロイ

#### ステップ１：GitHubリポジトリのクローン

```bash
git clone https://github.com/aws-samples/iam-identity-center-team.git
```

#### ステップ２：デプロイ用パラメータの作成

すでにデプロイ用パラメータが作成済みの場合は本手順をスキップします。

```bash
cd deployment
cp -n parameters-dev.sh parameters_YOUR_ENV.sh
```

コピーしたデプロイ用パラメータファイルを修正します。

#### ステップ３：デプロイ実行

作成したデプロイ用パラメータファイルを使用してデプロイを実行します。

```bash
PARAMETERS_FILE=./parameters_YOUR_ENV.sh ./deploy_custom.sh
```

![WS000938.jpg](/images/team/deploy/WS000938.jpg)

このデプロイを実行すると、下記２つのCloudFormationスタックが作成されます。「amplify-teamidcapp-main」スタックは「TEAM-IDC-APP」作成後、5分程度時間が経ってから作成されます。また、複数のスタックをネストしており、すべてのスタックが完了するまで15分くらいかかります。

- TEAM-IDC-APP
- amplify-teamidcapp-main-xxxxx

#### ステップ４：IAM Identity Center SAML Integrationの設定

see: [TEAM Deployment guide](https://aws-samples.github.io/iam-identity-center-team/docs/deployment/configuration/idc.html)

ステップ３ですべてのスタックが「CREATE_COMPLETE」になっていることを確認してから実行します。

![WS000982.jpg](/images/team/deploy/WS000982.jpg)

以下のコマンドを実行します。

```bash
PARAMETERS_FILE=./parameters_YOUR_ENV.sh ./integration_custom.sh
```

![WS000936.jpg](/images/team/deploy/WS000936.jpg)

実行すると、以下のURLが払い出されます。この値は次の手順で使用しますので、メモしておきます。

```bash
applicationStartURL: https://xxxxxx-main.auth.amazoncognito.com/authorize?client_id=xxxxxx&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=https://main.d1s8z5724fsfj7-.amplifyapp.com/&idp_identifier=team
applicationACSURL: https://xxxxxx-main.auth.amazoncognito.com/saml2/idpresponse
applicationSAMLAudience: urn:amazon:cognito:sp:us-east-1_xxxxxx
```

**TEAM管理アカウント**のAWSマネジメントコンソールから、[AWS IAM Identity Center console > Application assignment > Applications > Add application] を開きます。

- [設定するアプリケーションがある > SAML 2.0] を選択し、[次へ]をクリックします
- 以下を設定します。
    - 表示名: `TEAM IDC APP`
    - 説明: `Temporary elevated access management (TEAM) for AWS IAM Identity Center`
- 「IAM Identity Center メタデータ」の`IAM Identity Center SAML メタデータファイル`のURLはAmazon Cognitoの設定で必要ですので、メモしておきます。
    - IAM Identity Center SAML メタデータファイル: `https://portal.sso.ap-northeast-1.amazonaws.com/saml/metadata/xxxxxxxx`
- [Application start URL]に先ほどシェルの実行で表示された`applicationStartURL`の値を入力します。
- [Application Metadata]では、`applicationACSURL`と`applicationSAMLAudience`の値を入力します。
    - applicationACSURL: `https://xxxxxx-main.auth.ap-northeast-1.amazoncognito.com/saml2/idpresponse`
    - applicationSAMLAudience: `urn:amazon:cognito:sp:ap-northeast-1_xxxxxx`
- 作成したアプリケーションを開きます。
- [アクション＞属性マッピング]を開きます。
    - `Subject`と`Email`を設定します。
        
        ![WS000946.jpg](/images/team/deploy/WS000946.jpg)
        
        - 参考: https://aws-samples.github.io/iam-identity-center-team/docs/deployment/configuration/idc.html#configure-attribute-mapping
        - Subject - ${user:subject} - persistent
        - Email - ${user:email} - basic
    - [変更の保存]をクリックし、保存します。
- [割り当てられたユーザーとグループ]にTEAM用のグループ(`TEAM-`で始まるグループ名)をすべて割り当てます。
    
    ![WS000939.jpg](/images/team/deploy/WS000939.jpg)
    
    ![WS000940.jpg](/images/team/deploy/WS000940.jpg)
    
    - ⚠️ アプリケーションにグループを割り当ててもグループのメンバーとして登録されていなければ、アプリケーションを利用できません。「02. Administrator Guide」を参照し、グループにメンバーを割り当ててください。
    - ⚠️ グループに割り当てても、AWS access portalをログアウトしてから再ログインするまで、アプリケーションが表示されない場合があります。表示されない場合は、ログアウトしてください。

#### ステップ５：Amazon Cognitoの設定

see: [TEAM Deployment guide](https://aws-samples.github.io/iam-identity-center-team/docs/deployment/configuration/cognito.html)

以下のコマンドでコピーしたJSONファイルを開き、`MetadataURL`に`IAM Identity Center SAML メタデータファイル`のURLを記載します。
すでにファイルが存在する場合は、そのまま編集してください。

```bash
cd deployment
cp -n details_dev.json details_YOUR_ENV.json
```

JSONファイルは以下のようになっています。

```json
{
    "MetadataURL": "https://portal.sso.ap-northeast-1.amazonaws.com/saml/metadata/xxxxxxxxxxxxxxxx"
}
```

以下のコマンドで設定を実行します。

```bash
PARAMETERS_FILE=./parameters_YOUR_ENV.sh ./cognito_custom.sh
```

画面出力が複数行でますので、コンソール画面では`q`を押して表示を終了させます。

![WS000937.jpg](/images/team/deploy/WS000937.jpg)

#### ステップ６：Amazon SESの設定

see: TEAM Deployment guide

see: https://aws-samples.github.io/iam-identity-center-team/docs/deployment/configuration/notifications.html#email-notification-via-amazon-ses

**TEAM管理アカウント**のAWSマネジメントコンソールから、[Amazon SES > 設定: ID]を開きます。

- [IDの作成]
- [ドメイン]を選択し、ドメイン名に`example.cloud`を入力します。
- `Easy DKIM`を選択し、キーの長さを`RSA_2048_BIT`に指定します。
- [DNS レコードの発行]の3レコードをRoute 53のホストゾーンへ設定します。
- [ID ステータス]が`検証保留中`から`検証済み`になるまで待機します。
    
    ![WS000974.jpg](/images/team/deploy/WS000974.jpg)
    
    ![WS000977.jpg](/images/team/deploy/WS000977.jpg)
    

## 5. デプロイ後のステップ

「02. Administrator Guide」に従い、設定を行います。

## 6. アンインストール

TEAMアプリケーションをアンインストールする手順です。`destroy_custom.sh` を実行することでデプロイ時に作成したスタックが削除されます。

ただし、Amplify デプロイメントの S3 バケットが削除されないため、手動での削除が必要です。s3バケット名の形式はamplify-teamidcapp-main-xxxx-deploymentです。

see: [TEAM Deployment guide](https://aws-samples.github.io/iam-identity-center-team/docs/deployment/uninstall.html)

#### ステップ１：アンインストール

カレントディレクトリが`deployment` ではない場合は移動します。

```bash
cd deployment
```

以下のコマンドでアンインストールを実行します。

```bash
PARAMETERS_FILE=./parameters_YOUR_ENV.sh ./destroy_custom.sh
```

![deployimage02](/images/team/deploy/image_02.png)

：

![deployimage03](/images/team/deploy/image_03.png)

AWSマネジメントコンソールで、[CloudFormation]にアクセスすると、「DELETE_IN_PROGRESS」となり、削除が実施されます。

![deployimage04](/images/team/deploy/image_04.png)

⚠️アンインストール前に、権限委任の解除が実施されていると「CloudTrail Lake EventDataStore」の削除が権限不足で失敗し、スタックの削除にも失敗します。この場合、リソースは残したうえでスタックの強制削除を行ってください。残ってしまった「CloudTrail Lake EventDataStore」は、IAM Identity Centerの管理アカウント上から手動で削除します。

#### ステップ２：S3バケットの削除

S3バケットを削除します。

![deployimage05](/images/team/deploy/image_05.png)

**TEAM管理アカウント**のCloudShell上に貼り付けて実行します。

```bash
aws s3api list-buckets \
  --query "Buckets[?starts_with(Name, 'amplify-teamidcapp-main-')].Name" \
  --output text | \
tr '\t' '\n' | \
while read -r BUCKET_NAME; do
  echo "バケットを削除中: ${BUCKET_NAME}"
  # 1. 通常のオブジェクトを削除
  echo "  - オブジェクトを削除中..."
  aws s3 rm "s3://${BUCKET_NAME}" --recursive > /dev/null 2>&1
  
  # 2. すべてのバージョンと削除マーカーを削除
  echo "  - すべてのバージョンを削除中..."
  aws s3api list-object-versions \
    --bucket "${BUCKET_NAME}" \
    --output json \
    --query '{Objects: Versions[].{Key:Key,VersionId:VersionId}}' 2>/dev/null | \
  jq -c 'if .Objects then . else empty end' | \
  while read -r DELETE_JSON; do
    if [ "$DELETE_JSON" != "" ] && [ "$DELETE_JSON" != '{"Objects":null}' ]; then
      aws s3api delete-objects \
        --bucket "${BUCKET_NAME}" \
        --delete "$DELETE_JSON" > /dev/null
    fi
  done
  
  # 3. 削除マーカーを削除
  echo "  - 削除マーカーを削除中..."
  aws s3api list-object-versions \
    --bucket "${BUCKET_NAME}" \
    --output json \
    --query '{Objects: DeleteMarkers[].{Key:Key,VersionId:VersionId}}' 2>/dev/null | \
  jq -c 'if .Objects then . else empty end' | \
  while read -r DELETE_JSON; do
    if [ "$DELETE_JSON" != "" ] && [ "$DELETE_JSON" != '{"Objects":null}' ]; then
      aws s3api delete-objects \
        --bucket "${BUCKET_NAME}" \
        --delete "$DELETE_JSON" > /dev/null
    fi
  done
  
  # 4. バケット自体を削除
  echo "  - バケットを削除中..."
  aws s3api delete-bucket --bucket "${BUCKET_NAME}"
  
  if [ $? -eq 0 ]; then
    echo "✓ 削除成功: ${BUCKET_NAME}"
  else
    echo "✗ 削除失敗: ${BUCKET_NAME}"
  fi
done
```

![image06](/images/team/deploy/image_06.png)

#### ステップ３：IAM Identity Center から TEAM アプリの削除

1. **TEAM管理アカウント**のAWSマネジメントコンソールを開きます
2. IAM Identity Centerコンソールにアクセスします
3. 左ペインから、[アプリケーションの割り当て＞アプリケーション]を選択します
    
    ![deployimage07](/images/team/deploy/image_07.png)
    
4. [カスタマー管理]タブを開きます
    
    ![deployimage08](/images/team/deploy/image_08.png)
    
5. 削除したいアプリケーションを選択し、右上の[アクション > 削除]を選択します
    
    ![deployimage09](/images/team/deploy/image_09.png)
    
6. 削除確認を行い、削除を実行します
    
    ![deployimage10](/images/team/deploy/image_10.png)
    

⚠️　ステップ４を先に実行した場合はエラーになります。このエラーは、グループとの紐づけ情報が不正になっているためですので、「割り当てられたユーザーとグループ」をすべて削除することで、削除できるようになります。

#### ステップ４：TEAMで利用していた IAM Identity Center グループの削除

**TEAM管理アカウント**のCloudShell上に貼り付けて実行します。

```sh
STORE_ID=$(aws sso-admin list-instances --query "Instances[0].IdentityStoreId" --output text --no-paginate)

# 各グループを削除
aws identitystore list-groups \
  --identity-store-id "${STORE_ID}" \
  --output json | \
jq -r '.Groups[] | select(.DisplayName | startswith("TEAM-")) | "\(.GroupId)\t\(.DisplayName)"' | \
while IFS=$'\t' read -r GROUP_ID GROUP_NAME; do
  echo "グループを削除中: ${GROUP_NAME} (ID: ${GROUP_ID})"
  aws identitystore delete-group \
    --identity-store-id "${STORE_ID}" \
    --group-id "${GROUP_ID}"
  
  if [ $? -eq 0 ]; then
    echo "✓ 削除成功: ${GROUP_NAME}"
  else
    echo "✗ 削除失敗: ${GROUP_NAME}"
  fi
done
```

![deployimage11](/images/team/deploy/image_11.png)

### TEAM用IAM Identity Centerグループ定義例

| 役割名 | 主な役割 | グループ名 |
| --- | --- | --- |
| 申請者 | TEAM アプリケーションで一時的なアクセス権限をリクエストするユーザーグループ(開発者やオペレーターなど) | TEAM-Users |
| 承認者 | TEAM アプリケーションで本番アカウントへのリクエストをレビュー・承認 / 拒否する権限を持つユーザーグループ。ただし、自身のリクエストは自身では承認できません | TEAM-Approvers-Production |
| 承認者 | TEAM アプリケーションで本番アカウント以外へのリクエストをレビュー・承認 / 拒否する権限を持つユーザーグループ。ただし、自身のリクエストは自身では承認できません | TEAM-Approvers-NonProduction |
| 管理者 | TEAM アプリケーションの設定管理・ユーザー管理・グループ設定などを行うユーザーグループ | TEAM-Admins |
| 監査者 | TEAMアプリケーションのリクエスト履歴やアクセスログの確認・レビューを行うユーザーグループ (読み取り専用) | TEAM-Auditors |

## 7. 利用者向けガイド

TEAMアプリケーションを利用したAWSアカウントへの一時アクセス許可申請を行う方法を説明します。

### TEAMアプリケーションにログインする

1. AWSアクセスポータルを開きます
   ![image02](/images/team/requestor/image_02.png)
2. アプリケーションタブを開きます
   ![image03](/images/team/requestor/image_03.png)
3. 「TEAM IDC APP」のアプリケーションが表示されていることを確認し、クリックします
   ⚠️　「TEAM IDC APP」が表示されていない場合は、TEAM管理者に連絡し、アクセス権限を付与してもらってください。
4. [Federated Sign In] ボタンをクリックします
   ![image04](/images/team/requestor/image_04.png)
5. [IDC]ボタンをクリックします。AWSマネジメントコンソールにログインするユーザーで認証が行われます
   ![image05](/images/team/requestor/image_05.png)
6. TEAMアプリケーションのトップページが表示されます
   ![image06](/images/team/requestor/image_06.png)

### 一時アクセス許可の申請を行う

see: [TEAM Requestor guide](https://aws-samples.github.io/iam-identity-center-team/docs/guides/user.html#request-elevated-access)

1. TEAMアプリケーションのトップページにある[TEAM Requests]からActions[Create TEAM request]または、左ペインの[Requests]から[Create request]を選択します
   ![image07](/images/team/requestor/image_07.png)
   ![image08](/images/team/requestor/image_08.png)
2. リクエストフォームが表示されます
   ![image09](/images/team/requestor/image_09.png)
3. 以下の項目を入力します
    - 【変更不可】 Email：ログインしているユーザーのメールアドレスが表示されています
    - 【必須】 Account：一時アクセスを申請したいAWSアカウントをリストから選択します
    - 【必須】 Role：一時アクセスのロールをリストから選択します
    - 【必須】 Start time：一時アクセスを開始する日時を指定します。デフォルトは現在日時となっていますので、忘れずに変更してください
    - 【必須】 Duration：一時アクセスが許可される時間を数字で指定します。上記[Start time]から何時間作業する予定なのか入力します。
        - ⚠️　TEAM管理者によって最大作業時間が指定されています。最大9時間が指定されている場合、「10」と入れようとすると「0」が入力できずにエラーになります。設定された最大作業時間を超える申請が必要な場合は、TEAM管理者に連絡してください。す
        ![image10](/images/team/requestor/image_10.png)
    - 【任意】Ticket no：今回の申請に関係するチケット番号を入力します
    - 【必須】Justification：今回の申請に関する理由を入力します。できるだけ明確に理由を入力してください
4. [Submit]ボタンをクリックし、申請を実施します
5. 申請の状況を確認する場合は、次の手順「申請のステータスを確認する」を実施します

### 申請のステータスを確認する

see: [TEAM Requestor guide](https://aws-samples.github.io/iam-identity-center-team/docs/guides/user.html#review-elevated-access-requests)

1. 左ペインの[Requests]から[My requests]を選択します
   ![image11](/images/team/requestor/image_11.png)
2. 申請の一覧を確認します。ステータスが「pending」になっているものは承認待ちです。承認が完了すると「approved」になります。す
   ![image12](/images/team/requestor/image_12.png)
   - pending：申請は承認待ちです
   - approved：申請が許可されました
   - rejected：申請が拒否された
   - cancelled：申請をキャンセルされました
3. 詳細を確認したい場合は、確認したい申請を選択し、[View details]をクリックします

💡　申請ステータスが「approved」になっている場合、申請時に指定した[Start time]以降にAWSアクセスポータルを表示すると、申請したAWSアカウントが表示されるようになります。表示されない場合は、TEAM管理者に連絡してください。

⚠️　アクセス有無にかかわらず、申請した作業時間が過ぎた場合は自動的にアクセス許可が削除されます。

### 申請をキャンセルする

see: [TEAM Requestor guide](https://aws-samples.github.io/iam-identity-center-team/docs/guides/user.html#cancel-elevated-access-request)

1. 「申請のステータスを確認する」の手順で、申請の一覧を表示します
2. キャンセルしたい申請をクリックし、[View details]をクリックします
3. [Cancel request]ボタンをクリックしますす
   ![image13](/images/team/requestor/image_13.png)

⚠️　一度キャンセルした申請は、もとに戻すことはできません。再度申請を行ってください。

## 8. 管理者向けガイド

### TEAMアプリケーション管理者を追加または削除する

初期構築時点では、IAM Identity Centerで定義されている「TEAM-Admins」グループに登録されている人が、TEAMアプリケーションを管理できます。

TEAMアプリケーション管理者はAdministrationメニューにある以下のことが実施できます。

   ![image02](/images/team/administrator/image_02.png)

- Approver policy
    - 承認者ポリシーの管理
- Eligibility policy
    - 申請者ポリシーの管理
- Settings
    - TEAMアプリケーションの全般的な設定の管理

⚠️　「管理者グループ」に所属するメンバーであっても、「承認者グループ」に割り当てない限り、申請承認の操作を行うことはできません。

1. 「TEAM管理用AWSアカウント」で、AWSマネジメントコンソールを開きます
2. 最近アクセスしたサービスまたは、検索から[IAM Identity Center]コンソールを開きます

    ![image03](/images/team/administrator/image_03.png)

3. 左ペインから、[グループ]を選択します

    ![image04](/images/team/administrator/image_04.png)

4. 「TEAM-Admins」のグループを検索してクリックし、グループの詳細を開きます
    
    ![image05](/images/team/administrator/image_05.png)
    
5. [ユーザーをグループに追加]から、ユーザーを追加または削除します
    
    ![image06](/images/team/administrator/image_06.png)
    

⚠️　グループにユーザーを追加した直後は、AWSアクセスポータルの画面にTEAMアプリケーションが表示されないことがあります。その場合は、AWSアクセスポータルの画面でログオフし、再度ログインを行ってください。

### TEAMアプリケーション監査者を追加または削除する

初期構築時点では、IAM Identity Centerで定義されている「TEAM-Auditors」グループに登録されている人が、TEAMアプリケーションでの申請承認履歴やアクティビティを参照できます。

TEAMアプリケーション管理者はAuditメニューにある以下のことが実施できます。

![image07](/images/team/administrator/image_07.png)

- Approvals
- Elevated access

TEAMアプリケーション監査者を追加する手順は、「TEAMアプリケーション管理者」と同様となりますのでそちらを参照してください。「TEAM-Auditors」に対してユーザーを追加または削除します。

![image08](/images/team/administrator/image_08.png)

### 申請者管理

#### TEAMアプリケーションを使って申請できる人を追加または削除する

初期構築時点では、IAM Identity Centerで定義されている「TEAM-Users」グループに登録されている人が、TEAMアプリケーションを利用できます。

TEAMアプリケーションの利用可否を制御するには、このグループにメンバーを追加または削除します。

TEAMアプリケーション監査者を追加する手順は、「TEAMアプリケーション管理者」と同様となりますのでそちらを参照してください。「TEAM-Users」に対してユーザーを追加または削除します。

![image09](/images/team/administrator/image_09.png)

#### TEAMアプリケーションの申請者グループを追加、削除する

次の手順「申請者ポリシーを管理する」にあるように申請者グループに対して、アカウントやOUの単位で、どの許可セットが申請可能か、といった細かい制御が可能です。

複数の申請者グループで管理を細分化したい場合は、IAM Identity Centerでグループを作成してください。

#### 申請者ポリシーを管理する

see: [TEAM Administrator guide](https://aws-samples.github.io/iam-identity-center-team/docs/guides/admin.html#configure-eligibility-policy)

申請者のグループごとにAWSアカウントまたは、OU単位で、申請時に選択可能な権限（許可セット）や承認フローが必須かどうかを設定できます。

初期構築時点では、「TEAM-Users」のグループが[アカウント指定＋許可セット＋承認必須]という定義になっています。

⚠️　対象アカウントを指定しているので、AWSアカウントを追加した場合は、修正が必要です。

💡　OU単位でのポリシーを作成すると、AWSアカウントの増減に対するメンテナンスは必要なくなりますが、広い範囲での申請が可能になってしまいます。

1. 左ペインの[Administration]から[Eligibility policy]を選択します
    
    ![image10](/images/team/administrator/image_10.png)
    
2. [Add approvers]ボタンまたは、既存のポリシーを選択し[Actions]から[Edit]を選択します
    
    ![image11](/images/team/administrator/image_11.png)
    
3. 以下を設定します
    - Entity type：UserかGroupをリストから選択します。ユーザー単位でも定義できますが、グループ単位での管理を推奨します。
    - Ticket No：作業を紐づけるチケット番号がある場合は入力します
    - Accounts：申請可能なAWSアカウントをリストから選択します。複数選択が可能です
    - OUs：OU単位で許可する場合は、許可するOUを選択します。複数選択が可能です
    - Permission：許可セットをリストから選択します。複数選択が可能です
    - Max duration：一時アクセスの作業時間を数字で指定します
        - 💡　[Administration>Settings]で「Maximum request duration」 を超える値の設定が可能です
    - Approval required：申請の承認が必須かどうかを選択します
        - ⚠️　[Administration>Settings]で「Approval workflow」 を `Not required`にした場合は、この設定に関係なく承認不要になります。
4. [Add eligibility policy]をクリックして保存します

### 承認管理

#### 承認ポリシーを管理する

see: [TEAM Administrator guide](https://aws-samples.github.io/iam-identity-center-team/docs/guides/admin.html#configure-approver-policy)

see: https://aws-samples.github.io/iam-identity-center-team/docs/guides/admin.html#configure-approver-policy

1. 左ペインの[Administration]から[Approver policy]を選択します
    
    ![image12](/images/team/administrator/image_12.png)
    
2. [Add approvers]ボタンまたは、既存のポリシーを選択し[Actions]から[Edit]を選択します
    
    ![image13](/images/team/administrator/image_13.png)
    
3. 以下を設定します
    - Entity type：[Organizational Unit]か[Account]をリストから選択します。
    - Accounts：「Entity type」に[Account]を選択した場合に表示されます。申請可能なAWSアカウントをリストから選択します。複数選択が可能です
    - OUs：「Entity type」に[Organizational Unit]を選択した場合に表示されます。OU単位で許可する場合は、許可するOUを選択します。複数選択が可能です
    - Ticket No：作業を紐づけるチケット番号がある場合は入力します
    - Approver Groups：承認者グループをリストから選択します。複数選択が可能です
4. [Add approvers]をクリックして保存します

⚠️　複数アカウント×複数承認グループを設定すると、ポリシーはそれぞれの組み合わせごとに分割されます。修正する場合は、個別に実施する必要があります。

![image14](/images/team/administrator/image_14.png)

#### その他設定

see: [TEAM Administrator guide](https://aws-samples.github.io/iam-identity-center-team/docs/guides/admin.html#configure-team-settings)

see: https://aws-samples.github.io/iam-identity-center-team/docs/guides/admin.html#configure-team-settings

1. 左ペインの[Administration]から[Settings]を選択します
    
    ![image15](/images/team/administrator/image_15.png)
    
2. 設定画面が開きます
    
    ![image16](/images/team/administrator/image_16.png)
    
3. [Edit]ボタンをクリックします
4. 必要箇所を変更します（変更箇所は後述の手順に従います）

##### 申請に対する承認を有効または無効に変更する

ここで申請承認を無効にすると、TEAMアプリケーション全体で承認が不要になります。

申請承認を有効にすると、申請者ポリシーで指定した動作に従って承認の有無が判断されます。

1. 「Approval workflow」 を`Required`か`Not required`に変更します
    
    ![image17](/images/team/administrator/image_17.png)
    
    ![image18](/images/team/administrator/image_18.png)
    
2. [Submit]ボタンをクリックして保存します

##### 申請時のコメント入力を必須または任意に変更する

1. 「Comments」を`Required`か`Not required`に変更します
    
    ![image19](/images/team/administrator/image_19.png)
    
    ![image20](/images/team/administrator/image_20.png)
    
2. [Submit]ボタンをクリックして保存します

##### 申請時のチケット番号入力を必須または任意に変更する

1. 「Require ticket number」を`Required`か`Not required`に変更します
    
    ![image21](/images/team/administrator/image_21.png)
    
    ![image22](/images/team/administrator/image_22.png)
    
2. [Submit]ボタンをクリックして保存します

##### 一時権限の最大利用可能時間を設定する

ここで指定した時間を超える利用時間で申請ができなくなります。

1. `Maximum request duration`に期限切れとなる[時間]を数字で入力します
    
    ![image23](/images/team/administrator/image_23.png)
    
2. [Submit]ボタンをクリックして保存します

##### 未承認リクエストの期限切れとなる時間を設定する

未承認リクエストは指定した時間を過ぎると期限切れとなり、再申請が必要になります。

1. 「Request expiry timeout」に期限切れとなる[時間]を数字で入力します
    
    ![image24](/images/team/administrator/image_24.png)
    
2. [Submit]ボタンをクリックして保存します

##### Eメールによる申請通知を有効にする

1. 「Send Email notifications」を`ON`に変更します
    
    ![image25](/images/team/administrator/image_25.png)
    
    ![image26](/images/team/administrator/image_26.png)
    
2. `Source email`を入力します
    
    ![image27](/images/team/administrator/image_27.png)
    
3. [Submit]ボタンをクリックして保存します

##### SNSによる申請通知を有効にする

1. 「Send SNS notifications」を`ON`に変更します
    
    ![image28](/images/team/administrator/image_28.png)
    
    ![image29](/images/team/administrator/image_29.png)
    
2. [Submit]ボタンをクリックして保存します

⚠️　SNSはTEAMアプリケーションデプロイ時に作成されています。通知を受信するにはTEAM管理用AWSアカウントのマネジメントコンソールから、「Simple Notification Service」を開き `TeamNotifications-main` のトピックへのサブスクリプション登録を行ってください。

##### Slackによる申請通知を有効にする

1. 「Send Slack notifications」を`ON`に変更します
    
    ![image30](/images/team/administrator/image_30.png)
    
    ![image31](/images/team/administrator/image_31.png)
    
2. あらかじめSlack通知用のアプリケーションを作成しておく必要があります
    
    ![image32](/images/team/administrator/image_32.png)
    
3. `Slack OAuth token`と`Slack Audit Channel`を入力します
4. [Submit]ボタンをクリックして保存します

## 9. 承認者向けガイド

### 申請を承認する

1. 左ペインの[Approvals]から[Approve requests]を選択します
2. 自身が承認しなければならない申請の一覧が表示されます
   ⚠️　自分で行った申請は、承認者権限があったとしても一覧に表示されません
3. 申請内容を確認する場合は、申請を選択し[View details]をクリックします
4. 申請を承認する場合は、申請を選択し、[Actions]から[Approve]を選択します
5. コメントを入力し、[Confirm]ボタンをクリックします
6. 承認した履歴を確認する場合は、「自身が実施した承認履歴を確認する」を参照してください

### 申請を否認する

「申請を承認する」の手順と同様ですが、手順4で[Actions]から[Reject]を選択します。

### 自身が実施した承認履歴を確認する

1. 左ペインの[Approvals]から[My approvals]を選択します
2. 承認を行った履歴が表示されます
3. 承認の内容を確認したい場合は、確認したい承認を選択し、[View details]ボタンをクリックします
4. 承認履歴をダウンロードしたい場合は、[Download]ボタンをクリックすることでCSVファイルがダウンロードできます

## 10. 監査者向けガイド

TEAMアプリケーションの申請やセッションのアクティビティ等の監査を行う方法を説明します。

### 承認履歴を閲覧する

see: [TEAM Auditor guide](https://aws-samples.github.io/iam-identity-center-team/docs/guides/auditor.html#inspect-approval-history)

1. [Adit]メニューより、[Approvals]を選択します
    ![image02](/images/team/auditor/image_02.png)
2. 承認一覧が表示されているので確認します
    ![image03](/images/team/auditor/image_03.png)
3. 詳細を確認したい場合は、確認したい履歴を選択し、[View Details]ボタンをクリックします
    ![image04](/images/team/auditor/image_04.png)
4. 表示数や項目を変更したい場合は、⚙アイコンをクリックして変更します
    ![image05](/images/team/auditor/image_05.png)
5. 必要に応じて、[Download]ボタンからCSVファイルをダウンロードして確認します
    ![image06](/images/team/auditor/image_06.png)

### セッションアクティビティを確認する

see: [TEAM Auditor guide](https://aws-samples.github.io/iam-identity-center-team/docs/guides/auditor.html#inspect-session-activity-log)

1. [Audit]メニューより、[Elevated access]を選択します
    ![image07](/images/team/auditor/image_07.png)
2. セッションの一覧が表示されます
    ![image08](/images/team/auditor/image_08.png)
3. 詳細を確認したい申請を選択し、[View Details]ボタンをクリックします
    ![image09](/images/team/auditor/image_09.png)
4. [Session Logs]を展開すると、接続したセッションの一覧を表示できます。どのサービスにアクセスしたのかといったレベルで確認することができます。
    ![image10](/images/team/auditor/image_10.png)
5. 必要に応じて、[Download]ボタンからCSVファイルをダウンロードして確認します

## 📖 まとめ

本記事では、AWS IAM Identity Center向けの一時的な権限昇格管理ソリューション「TEAM（Temporary Elevated Access Management）」について、導入から運用までを包括的に解説しました。

### TEAMの主な特徴

TEAMは、AWSが提供するオープンソースソリューションとして、以下の特徴を備えています。

- **ゼロスタンディング特権の実現**: 常設の管理者権限を排除し、必要な時だけ一時的に権限を付与することで、セキュリティリスクを最小化
- **承認ワークフローの統合**: 申請・承認プロセスを通じて、すべての特権アクセスに説明責任と透明性を確保
- **完全な監査証跡**: すべての申請、承認、アクセスログが自動的に記録され、コンプライアンス要件に対応
- **IAM Identity Centerとのシームレスな統合**: 既存のユーザー管理基盤をそのまま活用でき、追加の認証基盤が不要

### 導入効果

TEAMを導入することで、以下のような効果が期待できます。

**セキュリティの向上:**
- 常時付与された強力な権限が減少し、攻撃者に悪用されるリスクが低下
- すべての特権アクセスに承認と記録が伴うため、内部不正の抑止効果
- 権限の有効期限が自動的に管理され、権限の付けっぱなしを防止

**コンプライアンス対応:**
- SOC2、ISO27001、PCIDSSなどの監査基準に対応した特権アクセス管理の実現
- すべてのアクセスに対する「誰が、いつ、なぜ、何をしたか」の完全な記録
- CloudTrail Lakeとの統合により、特権アクセス時の操作を詳細に追跡可能

**運用効率の向上:**
- Webベースのダッシュボードにより、申請から承認までをスムーズに処理
- IAM Identity Centerとの統合により、既存のユーザー管理プロセスをそのまま活用
- 自動化された権限付与・削除により、手動作業のミスと負荷を削減

### 導入時の検討ポイント

TEAMを導入する際は、以下の点を考慮してください。

**1. 組織のポリシー設計**
- どのアカウント/環境で承認を必須とするか（本番環境は必須、開発環境は任意など）
- 承認者をどのように配置するか（本番と非本番で承認者グループを分けるなど）
- 最大申請期間をどの程度に設定するか（セキュリティと利便性のバランス）

**2. 運用体制の整備**
- 承認者の選定と教育（承認基準、緊急時の対応手順など）
- 監査者の配置と定期的なレビュープロセスの確立
- ユーザーへの利用ガイドの提供と教育

**3. 既存システムとの統合**
- 既存のチケットシステムとの連携（チケット番号の必須化など）
- Slackなどのコラボレーションツールとの通知連携
- 監視・アラートシステムとの統合

### 次のステップ

TEAMを導入した後は、以下のステップで継続的に改善していくことをお勧めします。

1. **初期運用の観察**: 導入後1〜3ヶ月は、申請・承認の頻度やパターンを観察し、ポリシーが適切か確認する
2. **ユーザーフィードバックの収集**: 申請者と承認者からフィードバックを集め、運用上の課題を特定する
3. **ポリシーの最適化**: 観察結果に基づいて、申請者ポリシーと承認者ポリシーを調整する
4. **監査プロセスの確立**: 定期的な監査レビューのプロセスを確立し、異常なアクセスパターンを検出する
5. **自動化の拡大**: 必要に応じて、承認プロセスの一部自動化や、他のシステムとの連携を検討する

### 参考リソース

TEAMに関するさらに詳しい情報は、以下の公式リソースを参照してください。

- [TEAM 公式ドキュメント](https://aws-samples.github.io/iam-identity-center-team/)
- [GitHub リポジトリ](https://github.com/aws-samples/iam-identity-center-team/tree/main)
- [AWS Security Blog](https://aws.amazon.com/jp/blogs/security/temporary-elevated-access-management-with-iam-identity-center/)
- [builders.flash 記事（AWS Community Hero: 山口 正徳氏）](https://aws.amazon.com/jp/builders-flash/202505/temporary-elevated-access-management/)

TEAMは、AWS環境におけるゼロスタンディング特権の実現と、特権アクセス管理の自動化・可視化を実現する強力なソリューションです。本記事が、皆様のセキュリティ向上とコンプライアンス対応の一助となれば幸いです。