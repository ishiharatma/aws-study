<!--# Temporary elevated access management (TEAM) for AWS IAM Identity Center <!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

![TEAM](/images/team/home_page.png)

本ガイドは、全6部構成となっています。

- [TEAM for AWS IAM Identity Center 導入ガイド ──(1/6) 概要](./zenn-team-01-overview.md)
- [TEAM for AWS IAM Identity Center 導入ガイド ──(2/6) デプロイ](./zenn-team-02-deployment-guide.md)
- [TEAM for AWS IAM Identity Center 導入ガイド ──(3/6) DeepDive](./zenn-team-03-deepdive.md)
- [TEAM for AWS IAM Identity Center 導入ガイド ──(4/6) 申請者/承認者向けガイド](./zenn-team-04-guides-01-requestor-and-approver.md)
- [TEAM for AWS IAM Identity Center 導入ガイド ──(5/6) 管理者向けガイド](./zenn-team-04-guides-02-administrator.md)
- [TEAM for AWS IAM Identity Center 導入ガイド ──(6/6) 監査者向けガイド](./zenn-team-04-guides-03-auditor.md)

本ページでは、TEAMのデプロイ方法について解説します。

**📌 対象読者**

- TEAM導入担当者: TEAMアプリケーションを初めて導入する方
- AWSインフラ担当者: AWS CDKを使用してデプロイを行う技術者

## 👀 Contents<!-- omit in toc -->

<!-- Duration: 00:01:00 -->

- [1. デプロイ方法](#1-デプロイ方法)
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
- [2. デプロイ後のステップ](#2-デプロイ後のステップ)
- [3. アンインストール](#3-アンインストール)
    - [ステップ１：アンインストール](#ステップ１アンインストール)
    - [ステップ２：S3バケットの削除](#ステップ２s3バケットの削除)
    - [ステップ３：IAM Identity Center から TEAM アプリの削除](#ステップ３iam-identity-center-から-team-アプリの削除)
    - [ステップ４：TEAMで利用していた IAM Identity Center グループの削除](#ステップ４teamで利用していた-iam-identity-center-グループの削除)
- [📖 まとめ](#-まとめ)
  - [デプロイの流れ](#デプロイの流れ-1)
  - [次のステップ](#次のステップ)
  - [参考リソース](#参考リソース)

## 1. デプロイ方法

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
- [ドメイン]を選択し、ドメイン名に`example.com`を入力します。
- `Easy DKIM`を選択し、キーの長さを`RSA_2048_BIT`に指定します。
- [DNS レコードの発行]の3レコードをRoute 53のホストゾーンへ設定します。
- [ID ステータス]が`検証保留中`から`検証済み`になるまで待機します。
    
    ![WS000974.jpg](/images/team/deploy/WS000974.jpg)
    
    ![WS000977.jpg](/images/team/deploy/WS000977.jpg)
    

## 2. デプロイ後のステップ

[TEAM for AWS IAM Identity Center 導入ガイド ──(5/6) 管理者向けガイド](./zenn-team-04-guides-02-administrator.md)に従い、設定を行います。

## 3. アンインストール

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

## 📖 まとめ

本記事では、AWS IAM Identity Center向けの一時的な権限昇格管理ソリューション「TEAM（Temporary Elevated Access Management）」について、デプロイ方法について解説しました。

### デプロイの流れ

TEAMのデプロイは以下の手順で行います。

1. 前提条件の確認
   - AWS Organizationsの有効化
   - IAM Identity Centerの有効化（委任された管理者アカウントに設定）
   - Node.js、AWS CLI、AWS CDKのインストール

2. 環境のセットアップ
   - GitHubリポジトリのクローン
   - 依存パッケージのインストール
   - 設定ファイル（config.json）の編集

3. CDKによるデプロイ
   - `cdk bootstrap`でCDK環境の初期化
   - `cdk deploy`でAWSリソースの作成
   - CloudTrail Lakeの有効化とSESメール送信設定

ただし、デプロイ前に以下の点に注意してください。

- **委任された管理者アカウント**へのデプロイが必須
- **CloudTrail Lakeの有効化**には追加コストが発生
- **SESの本番環境利用**にはサンドボックス解除申請が必要

### 次のステップ

次の記事「TEAM導入ガイド(3/6) Deep Dive編」では、Step Functionsによる権限ライフサイクル管理やDynamoDBのテーブル設計など、TEAMの内部実装を詳しく解説します。

また、すぐに運用を開始したい方は、以下のガイド記事から役割に応じた記事を参照してください。

- [TEAM for AWS IAM Identity Center 導入ガイド ──(4/6) 申請者/承認者向けガイド](./zenn-team-04-guides-01-requestor-and-approver.md)
- [TEAM for AWS IAM Identity Center 導入ガイド ──(5/6) 管理者向けガイド](./zenn-team-04-guides-02-administrator.md)
- [TEAM for AWS IAM Identity Center 導入ガイド ──(6/6) 監査者向けガイド](./zenn-team-04-guides-03-auditor.md)

### 参考リソース

TEAMに関するさらに詳しい情報は、以下の公式リソースを参照してください。

- [TEAM 公式ドキュメント](https://aws-samples.github.io/iam-identity-center-team/)
- [GitHub リポジトリ](https://github.com/aws-samples/iam-identity-center-team/tree/main)
- [AWS Security Blog](https://aws.amazon.com/jp/blogs/security/temporary-elevated-access-management-with-iam-identity-center/)
- [builders.flash 記事（AWS Community Hero: 山口 正徳氏）](https://aws.amazon.com/jp/builders-flash/202505/temporary-elevated-access-management/)
