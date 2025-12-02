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

本ページでは、申請者および承認者向けのガイドラインを解説します。

**📌 対象読者**

- 申請者: TEAM アプリケーションを使用して一時的なアクセス権限をリクエストするユーザー
- 承認者: TEAM アプリケーションでリクエストをレビュー・承認 / 拒否するユーザー

## 👀 Contents<!-- omit in toc -->

<!-- Duration: 00:01:00 -->

- [1. はじめに](#1-はじめに)
- [2. TEAM用IAM Identity Centerグループ定義例](#2-team用iam-identity-centerグループ定義例)
- [3. 申請者向けガイド](#3-申請者向けガイド)
  - [TEAMアプリケーションにログインする](#teamアプリケーションにログインする)
  - [一時アクセス許可の申請を行う](#一時アクセス許可の申請を行う)
  - [申請のステータスを確認する](#申請のステータスを確認する)
  - [申請をキャンセルする](#申請をキャンセルする)
- [4. 承認者向けガイド](#4-承認者向けガイド)
  - [申請を承認する](#申請を承認する)
  - [申請を否認する](#申請を否認する)
  - [自身が実施した承認履歴を確認する](#自身が実施した承認履歴を確認する)
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

## 3. 申請者向けガイド

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

## 4. 承認者向けガイド

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
