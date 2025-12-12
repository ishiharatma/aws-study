<!--# Temporary elevated access management (TEAM) for AWS IAM Identity Center <!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。
手順画像などの一部は公式ドキュメントの画像を流用しております。

![TEAM](/images/team/home_page.png)

本ページでは、監査者向けのガイドラインを解説します。

**📌 対象読者**

- 監査者: TEAMアプリケーションのリクエスト履歴やアクセスログの確認・レビューを行うユーザー

## 👀 Contents<!-- omit in toc -->

- [1. 監査者向けガイド](#1-監査者向けガイド)
  - [承認履歴を閲覧する](#承認履歴を閲覧する)
  - [セッションアクティビティを確認する](#セッションアクティビティを確認する)
- [📖 まとめ](#-まとめ)
  - [参考リソース](#参考リソース)

## 1. 監査者向けガイド

TEAMアプリケーションの申請やセッションのアクティビティ等の監査を行う方法を説明します。

### 承認履歴を閲覧する

see: [TEAM Auditor guide](https://aws-samples.github.io/iam-identity-center-team/docs/guides/auditor.html#inspect-approval-history)

1. [Audit]メニューより、[Approvals]を選択します
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

本記事では、TEAM監査者が行うべき監査方法について解説しました。

**承認履歴**では、以下を確認できます。

- 誰が（Who）: 申請者と承認者
- いつ（When）: 申請日時と承認日時
- 何を（What）: アカウントとロール
- なぜ（Why）: Justification（申請理由）

**セッションアクティビティ**では、CloudTrail Lakeと連携して以下を追跡できます。

- 権限付与期間中のAWSサービスへのアクセス
- どのAPIが呼び出されたか
- 異常なアクティビティの検知

監査の重要なポイントは次のとおりです。

- 定期的な承認履歴のレビュー
- 長時間権限保持や頻繁な申請の確認
- コンプライアンス要件への対応（SOX、ISO 27001等）
- CSVエクスポート機能を活用した経営層への報告

### 参考リソース

TEAMに関するさらに詳しい情報は、以下の公式リソースを参照してください。

- [TEAM 公式ドキュメント](https://aws-samples.github.io/iam-identity-center-team/)
- [GitHub リポジトリ](https://github.com/aws-samples/iam-identity-center-team/tree/main)
- [AWS Security Blog](https://aws.amazon.com/jp/blogs/security/temporary-elevated-access-management-with-iam-identity-center/)
- [builders.flash 記事（AWS Community Hero: 山口 正徳氏）](https://aws.amazon.com/jp/builders-flash/202505/temporary-elevated-access-management/)
