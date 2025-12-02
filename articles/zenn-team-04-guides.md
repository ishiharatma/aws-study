---
title: "TEAM for AWS IAM Identity Center 導入ガイド ──(4/4) ガイドライン" # 記事のタイトル
emoji: "🫂"
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: false
---

<!--# Temporary elevated access management (TEAM) for AWS IAM Identity Center <!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

<!-- Duration: 00:01:00 -->

- [1. はじめに](#1-はじめに)
- [1. TEAM用IAM Identity Centerグループ定義例](#1-team用iam-identity-centerグループ定義例)
- [2. 申請者向けガイド](#2-申請者向けガイド)
  - [TEAMアプリケーションにログインする](#teamアプリケーションにログインする)
  - [一時アクセス許可の申請を行う](#一時アクセス許可の申請を行う)
  - [申請のステータスを確認する](#申請のステータスを確認する)
  - [申請をキャンセルする](#申請をキャンセルする)
- [3. 管理者向けガイド](#3-管理者向けガイド)
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
- [4. 承認者向けガイド](#4-承認者向けガイド)
  - [申請を承認する](#申請を承認する)
  - [申請を否認する](#申請を否認する)
  - [自身が実施した承認履歴を確認する](#自身が実施した承認履歴を確認する)
- [5. 監査者向けガイド](#5-監査者向けガイド)
  - [承認履歴を閲覧する](#承認履歴を閲覧する)
  - [セッションアクティビティを確認する](#セッションアクティビティを確認する)
- [📖 まとめ](#-まとめ)
  - [参考リソース](#参考リソース)

## 1. はじめに

![TEAM](/images/team/home_page.png)

Temporary elevated access management (TEAM) for AWS IAM Identity Center とは、AWS が提供するオープンソースソリューションで、ユーザーに一時的な管理者権限を付与するための仕組みです。

![TEAM architecture](/images/team/archi.png)

** 画像は TEAM の GitHub より引用

本ページでは、役割別のガイドラインを解説します。

## 1. TEAM用IAM Identity Centerグループ定義例

| 役割名 | 主な役割 | グループ名 |
| --- | --- | --- |
| 申請者 | TEAM アプリケーションで一時的なアクセス権限をリクエストするユーザーグループ(開発者やオペレーターなど) | TEAM-Users |
| 管理者 | TEAM アプリケーションの設定管理・ユーザー管理・グループ設定などを行うユーザーグループ | TEAM-Admins |
| 承認者 | TEAM アプリケーションで本番アカウントへのリクエストをレビュー・承認 / 拒否する権限を持つユーザーグループ。ただし、自身のリクエストは自身では承認できません | TEAM-Approvers-Production |
| 承認者 | TEAM アプリケーションで本番アカウント以外へのリクエストをレビュー・承認 / 拒否する権限を持つユーザーグループ。ただし、自身のリクエストは自身では承認できません | TEAM-Approvers-NonProduction |
| 監査者 | TEAMアプリケーションのリクエスト履歴やアクセスログの確認・レビューを行うユーザーグループ (読み取り専用) | TEAM-Auditors |

## 2. 申請者向けガイド

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

## 3. 管理者向けガイド

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

## 5. 監査者向けガイド

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

TEAMは、AWS環境におけるゼロスタンディング特権の実現と、特権アクセス管理の自動化・可視化を実現する強力なソリューションです。本記事が、皆様のセキュリティ向上とコンプライアンス対応の一助となれば幸いです。