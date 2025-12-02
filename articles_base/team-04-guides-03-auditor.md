<!--# Temporary elevated access management (TEAM) for AWS IAM Identity Center <!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

本ガイドは、全6部構成となっています。

- [TEAM for AWS IAM Identity Center 導入ガイド ──(1/6) 概要](./team-01-overview.md)
- [TEAM for AWS IAM Identity Center 導入ガイド ──(2/6) デプロイ](./team-02-deployment-guide.md)
- [TEAM for AWS IAM Identity Center 導入ガイド ──(3/6) DeepDive](./team-03-deepdive.md)
- [TEAM for AWS IAM Identity Center 導入ガイド ──(5/6) ガイドライン(1)申請者/承認者向け](./team-04-guides-01-requestor-and-approver.md)
- [TEAM for AWS IAM Identity Center 導入ガイド ──(6/6) ガイドライン(2)管理者向け](./team-04-guides-02-administrator.md)
- [TEAM for AWS IAM Identity Center 導入ガイド ──(7/6) ガイドライン(3)監査者向け](./team-04-guides-03-auditor.md)
  
本ページでは、監査者向けのガイドラインを解説します。

**📌 対象読者**

- 監査者: TEAMアプリケーションのリクエスト履歴やアクセスログの確認・レビューを行うユーザー

## 👀 Contents<!-- omit in toc -->

<!-- Duration: 00:01:00 -->

- [1. はじめに](#1-はじめに)
- [2. TEAM用IAM Identity Centerグループ定義例](#2-team用iam-identity-centerグループ定義例)
- [3. 監査者向けガイド](#3-監査者向けガイド)
  - [承認履歴を閲覧する](#承認履歴を閲覧する)
  - [セッションアクティビティを確認する](#セッションアクティビティを確認する)
- [📖 まとめ](#-まとめ)
  - [参考リソース](#参考リソース)

## 1. はじめに

![TEAM](/images/team/home_page.png)

Temporary elevated access management (TEAM) for AWS IAM Identity Center とは、AWS が提供するオープンソースソリューションで、ユーザーに一時的な管理者権限を付与するための仕組みです。

![TEAM architecture](/images/team/archi.png)

** 画像は TEAM の GitHub より引用

## 2. TEAM用IAM Identity Centerグループ定義例

| 役割名 | 主な役割 | グループ名 |
| --- | --- | --- |
| 申請者 | TEAM アプリケーションで一時的なアクセス権限をリクエストするユーザーグループ(開発者やオペレーターなど) | TEAM-Users |
| 管理者 | TEAM アプリケーションの設定管理・ユーザー管理・グループ設定などを行うユーザーグループ | TEAM-Admins |
| 承認者 | TEAM アプリケーションで本番アカウントへのリクエストをレビュー・承認 / 拒否する権限を持つユーザーグループ。ただし、自身のリクエストは自身では承認できません | TEAM-Approvers-Production |
| 承認者 | TEAM アプリケーションで本番アカウント以外へのリクエストをレビュー・承認 / 拒否する権限を持つユーザーグループ。ただし、自身のリクエストは自身では承認できません | TEAM-Approvers-NonProduction |
| 監査者 | TEAMアプリケーションのリクエスト履歴やアクセスログの確認・レビューを行うユーザーグループ (読み取り専用) | TEAM-Auditors |

## 3. 監査者向けガイド

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

本記事では、TEAMの実際の運用方法について、設定例を交えながら解説しました。

**承認ポリシー**では、単独承認から複数段階承認まで柔軟な承認フローを定義できます。
**権限ポリシー**では、申請可能な権限セットやアカウントを制御し、セキュリティとガバナンスを両立します。
**監査機能**では、CloudTrail Lakeを活用して権限使用状況をリアルタイムで追跡できます。

TEAMを効果的に運用するためのポイントは以下のとおりです。

- 組織の承認フローに合わせた承認ポリシーの設計
- 職務分離を考慮した権限ポリシーの定義
- 定期的な監査ログの確認と異常検知
- MFAなどの追加セキュリティ制御の活

### 参考リソース

TEAMに関するさらに詳しい情報は、以下の公式リソースを参照してください。

- [TEAM 公式ドキュメント](https://aws-samples.github.io/iam-identity-center-team/)
- [GitHub リポジトリ](https://github.com/aws-samples/iam-identity-center-team/tree/main)
- [AWS Security Blog](https://aws.amazon.com/jp/blogs/security/temporary-elevated-access-management-with-iam-identity-center/)
- [builders.flash 記事（AWS Community Hero: 山口 正徳氏）](https://aws.amazon.com/jp/builders-flash/202505/temporary-elevated-access-management/)
