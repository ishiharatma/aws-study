# Amazon Q Developer<!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

- [1. Amazon Q Developer とは](#1-amazon-q-developer-とは)
  - [1.1. 公式ドキュメント](#11-公式ドキュメント)
  - [1.2. 学習リソース](#12-学習リソース)
  - [1.3. ワークショップ](#13-ワークショップ)
  - [1.4. 日本語対応状況](#14-日本語対応状況)
  - [1.5. 利用時の注意事項](#15-利用時の注意事項)
- [2. 料金体系](#2-料金体系)
  - [2.1. 無料利用枠（Free Tier）](#21-無料利用枠free-tier)
  - [2.2. Amazon Q Developer Pro](#22-amazon-q-developer-pro)
- [3. Amazon Q Developer を安全に使うためのオプトアウト](#3-amazon-q-developer-を安全に使うためのオプトアウト)
  - [3.1. VS Codeでの設定例](#31-vs-codeでの設定例)
    - [テレメトリの共有からオプトアウト](#テレメトリの共有からオプトアウト)
    - [コンテンツの共有からのオプトアウト](#コンテンツの共有からのオプトアウト)
  - [3.2. AWS CLI](#32-aws-cli)
    - [テレメトリの共有からオプトアウト](#テレメトリの共有からオプトアウト-1)
    - [コンテンツの共有からのオプトアウト](#コンテンツの共有からのオプトアウト-1)
- [4. 主な機能](#4-主な機能)
  - [4.1. チャット](#41-チャット)
  - [4.2. インラインコード補完](#42-インラインコード補完)
  - [4.3 コード変換・アップグレード（/transform）](#43-コード変換アップグレードtransform)
  - [4.4. 機能開発（/dev）](#44-機能開発dev)
  - [4.5. ユニットテスト作成（/test）](#45-ユニットテスト作成test)
  - [4.6. コードレビュー（/review）](#46-コードレビューreview)
  - [4.7. ドキュメントの生成（/doc）](#47-ドキュメントの生成doc)
- [5. Q CLI](#5-q-cli)
  - [5.1. コンテキスト管理](#51-コンテキスト管理)
  - [5.2. MCPサーバ管理](#52-mcpサーバ管理)
  - [5.3. カスタムエージェント](#53-カスタムエージェント)
    - [カスタムエージェントの作成方法](#カスタムエージェントの作成方法)
  - [参考: Build Games with Amazon Q CLI and score a T shirt 🏆👕](#参考-build-games-with-amazon-q-cli-and-score-a-t-shirt-)
- [7. 他のサービスとの連携](#7-他のサービスとの連携)
  - [7.1. Microsoft Teams / Slack との連携](#71-microsoft-teams--slack-との連携)
  - [7.2. GitHub との連携](#72-github-との連携)
  - [7.3. GitLab との連携](#73-gitlab-との連携)
- [8. Amazon Q Developerを活用するためのヒント](#8-amazon-q-developerを活用するためのヒント)
  - [明確な指示を与える](#明確な指示を与える)
  - [対話を重ねる](#対話を重ねる)
  - [段階的に指示を与える](#段階的に指示を与える)
  - [コード改善のためのレビュー](#コード改善のためのレビュー)
  - [設計ドキュメントの作成](#設計ドキュメントの作成)
- [📖 まとめ](#-まとめ)


## 1. Amazon Q Developer とは

生成AIを活用した会話型アシスタントです。 AWS re:Invent 2023で発表されました。
Amazon Q には大きく分けて2つの種類があります。

- Amazon Q Developer
  - 主に開発者向けのサービスで、以下のような用途で活用されます。
    - ソフトウェア開発タスクの支援
    - AWS インフラストラクチャの管理
    - 技術的な問題解決
    - コードの生成・レビュー・最適化
- Amazon Q Business
  - ビジネスユーザー向けのサービスで、企業の内部データを活用した質問応答システムの構築が可能です。
    - 社内のQ&Aチャットボット
    - タスク自動化のアプリケーション
    - コンテンツ生成
    - 要約
  - Amazon Q Developer とは料金も異なります。
    - [Amazon Q Business の料金](https://aws.amazon.com/jp/q/business/pricing/)

Amazon Q Developerは、従来のCodeWhispererから発展した形で提供されており、単なるコード補完ツールではなく、AWS環境全体での開発・運用業務を支援する包括的なAIアシスタントとして位置づけられています。2024年4月30日より、Amazon CodeWhispererはAmazon Q Developerに統合されました。

参考: [Amazon Q Developer と Amazon CodeWhisperer](https://docs.aws.amazon.com/ja_jp/toolkit-for-vscode/latest/userguide/amazonq.html)

本記事では、主に Amazon Q Developer について詳しく解説していきます。

### 1.1. 公式ドキュメント

Amazon Q Developerを理解する公式ドキュメントは次のとおりです。

[Amazon Q Developer サービス概要](https://aws.amazon.com/jp/q/developer/)

[Amazon Q Developer ドキュメント](https://docs.aws.amazon.com/ja_jp/amazonq/#amazon-q-developer)

[Amazon Q Developer の料金](https://aws.amazon.com/jp/q/developer/pricing/)

### 1.2. 学習リソース

[Getting started with Amazon Q Developer - Part 1(Youtube)](https://www.youtube.com/watch?v=booI_HvuCiQ)(0:19:07)

[Getting started with Amazon Q Developer - Part 2| Amazon Web Services(Youtube)](https://www.youtube.com/watch?v=nqfLFxOnVuM)(0:23:19)

[デモで学ぶ！Amazon Q Developer エージェントで実現する開発効率化（AWS-27）(Youtube)](https://www.youtube.com/watch?v=hkZf_h-SeL4)(0:41:00)

### 1.3. ワークショップ

[Amazon Q Developer Workshop - Building the Q-Words App](https://catalog.workshops.aws/qwords/en-US)

[Amazon Q CLI セルフサービスワークショップ](https://github.com/094459/aqd-cli-workshop)

### 1.4. 日本語対応状況

2025年4月より、Amazon Q Developer で日本語サポートが開始されました。これにより、さらに使いやすくなりました。

参考: AWSブログ＞[Amazon Q Developer の言語サポートが拡大 (日本語を含む)](https://aws.amazon.com/jp/blogs/news/amazon-q-developer-global-capabilities/)

### 1.5. 利用時の注意事項

Amazon Qは便利なサービスですが、生成AIを利用する上で、以下の点には気を付けてください。

- 所属組織のセキュリティポリシー: 業務利用する場合には、所属する組織のセキュリティポリシーに違反しないかを確認しましょう。
- 機密情報の扱い: 入力した内容や出力された内容が学習に使われることがあります。本記事の「3. Amazon Q Developer を安全に使うためのオプトアウト」を参照し、必要に応じて送信されないようにしましょう。
- 情報の鮮度: 生成AIの学習に使用したデータによっては最新ではない可能性があるので、重要な情報は必ず公式情報を参照するようにしましょう。
- 回答の正確性: 生成AIの回答には事実とは異なる内容（ハルシネーション）が含まれることがありますので、確認が必要です。

## 2. 料金体系

まずは、Builder IDを取得して使い始めるのがおすすめです。

### 2.1. 無料利用枠（Free Tier）

- 料金: 無料
- チャット: 月50回まで
- コード生成: 月5回まで
- コード変換: 月1,000行まで
- データ収集: オプトアウト可能
- 認証: AWS Builder ID

### 2.2. Amazon Q Developer Pro

- 料金: 月額19USD / ユーザー
- チャット: 無制限
- コード生成: 無制限
- コード変換: アカウントレベルで 1 ユーザーあたり毎月 4,000 行
- データ収集: 自動的にオプトアウト
- 高度な機能: カスタマイズ、セキュリティスキャン強化など
- 認証: IAM Identity Center

## 3. Amazon Q Developer を安全に使うためのオプトアウト

Amazon Q Developerで送信されるデータには2種類あります。

- テレメトリ: サービスの利用状況を数値化・定量化したデータのことです。実際のコードやプロンプトのテキストは含まれません。
  - どのようなデータが共有されるかは、[GitHubリポジトリ](https://github.com/aws/aws-toolkit-common/blob/main/telemetry/definitions/commonDefinitions.json)で確認できます。
- コンテンツ: ユーザが Amazon Q に入力した情報や、Amazon Q が生成した情報

Amazon Q Developerの無料利用枠（Free Tier）では、デフォルトでオプトアウトされていませんので、データが送信されます。

### 3.1. VS Codeでの設定例

#### テレメトリの共有からオプトアウト

1. VS Code で [設定] を開きます。
2. VS Code ワークスペースを使用している場合は、[ワークスペース] サブタブに切り替えます。VS Code では、ワークスペース設定がユーザー設定より優先されます。
3. 以下を検索し、チェックボックスをオフにします。
   - 「Amazon Q: Telemetry」

![vscode-telemetry](/images/q/vscode-telemetry.jpg)

または、settings.json に以下の設定を追加してください。


```json
{
    "amazonQ.telemetry": false
}
```

※ (参考)settings.jsonの場所

```text
Windows: %APPDATA%\Code\User\settings.json
        ( C:\Users\<ユーザー名>\AppData\Roaming\Code\User\settings.json)
Linux: $HOME/.config/Code/User/settings.json
macOS: $HOME/Library/Application Support/Code/User/settings.json
```

#### コンテンツの共有からのオプトアウト

1. VS Code で [設定] を開きます。
2. [ユーザー] サブタブに切り替えます。
3. 以下を検索し、チェックボックスをオフにします。
   - 「Amazon Q: Share Content」

![vscode-share-content](/images/q/vscode-share-content.jpg)

または、settings.json に以下の設定を追加してください。

```json
{
    "amazonQ.shareContentWithAWS": false
}
```

その他IDEについては、[AWSドキュメント](https://docs.aws.amazon.com/ja_jp/amazonq/latest/qdeveloper-ug/opt-out-IDE.html)を参照してください。

### 3.2. AWS CLI

#### テレメトリの共有からオプトアウト

```sh
# 現在のステータスを確認します
q telemetry status
# Telemetry status: enabled

# 無効化します
q telemetry disable
# ステータスを確認します
q telemetry status
#Telemetry status: disabled
```

#### コンテンツの共有からのオプトアウト

```sh
# 無効化します
q settings codeWhisperer.shareCodeWhispererContentWithAWS false
# 設定を確認します
q settings all
#codeWhisperer.shareCodeWhispererContentWithAWS = false
```

## 4. 主な機能

### 4.1. チャット

自然言語での質問に対して、AWSのベストプラクティスや実装方法を回答してもらうことができます。

主なユースケースは以下の通りです。

- AWSアーキテクチャの相談
- AWSリソースの使い方
- トラブルシューティングなどにおける運用調査支援
- ドキュメントの参照

IDE上にインストールした拡張機能や、AWSマネジメントコンソールでも質問ができます。

AWSマネジメントコンソールでは右上のアイコンからチャットを始めることができます。

![console-amazonq](/images/q/console-amazonq.jpg)

Lambda関数作成の例：

![chat-lambda-create-function-01](/images/q/chat-01-lambda-create-function-01.jpg)

読み取り専用アクセスのみしかないため、さすがに直接書き込んではくれないようです。

![chat-lambda-create-function-02](/images/q/chat-01-lambda-create-function-02.jpg)

トラブルシューティングの例：

![chat-troubleshooting](/images/q/chat-02-troubleshooting.jpg)

### 4.2. インラインコード補完

IDE上でリアルタイムにコード補完や提案を行ってくれます。コメントや関数宣言をもとに、適切なコードスニペットや関数本体を生成してくれます。

VSCodeでのコード補完例：

![inline-suggestions-vscode](/images/q/inline-suggestions-vscode.jpg)

AWSマネジメントコンソール上のLambdaでもAmazon Q によるコード補完を利用することができます。
コード補完が動いていなかったら、左下にある「|| Amazon Q」をクリックして「Resume Auto-Suggestions...」からコード補完を再開できます。再開していれば、左下の表示も「▷Amazon Q」となっています。

![lambda-amazonq](/images/q/lambda-amazonq.jpg)

Lambdaでのコード補完例：

![inline-suggestions-lambda-01](/images/q/inline-suggestions-lamnda-01.jpg)

Lambdaコンソールでは、1行ずつ出るようです。

![inline-suggestions-lambda-02](/images/q/inline-suggestions-lamnda-02.jpg)

### 4.3 コード変換・アップグレード（/transform）

既存のコードを新しいバージョンや別の言語に変換できます。特に以下の変換に対応しています。

- Java 8/11/17 から Java 17/21 への自動アップグレード（詳細は[こちら](https://docs.aws.amazon.com/ja_jp/amazonq/latest/qdeveloper-ug/code-transformation.html)）
  - Java 21へのアップグレードは、2025年2月14日にサポートされました。（詳細は[こちら](https://aws.amazon.com/jp/about-aws/whats-new/2025/02/amazon-q-developer-upgrade-java-21/)）
  - Java 8 から Java 17へアップグレードした事例は、「AWSブログ: [Amazon Q Developer による Java アプリケーションのモダナイゼーションhttps://aws.amazon.com/jp/blogs/news/modernize-your-java-application-with-amazon-q-developer/](https://aws.amazon.com/jp/blogs/news/modernize-your-java-application-with-amazon-q-developer/)」を参照してください。
- .NET の Windows から Linux への移植（詳細は[こちら](https://docs.aws.amazon.com/ja_jp/amazonq/latest/qdeveloper-ug/transform-dotnet-IDE.html)）

### 4.4. 機能開発（/dev）

[Amazon Q Developer を使用した機能の開発](https://docs.aws.amazon.com/ja_jp/amazonq/latest/qdeveloper-ug/software-dev.html)

`/dev` コマンドを使用することで、自然言語での指示から新機能の実装を支援してもらえます。
単純なコード生成だけでなく、複数ファイルにまたがる機能開発も可能です。

ただし、`/dev`と入力すると以下のように表示されるので、不要かもしれません。

![amazonq-dev](/images/q/amazonq-dev.jpg)

```sh
/dev DynamoDBとAPIGatewayを使ったユーザー管理APIを作成してください
```

![amazonq-dev-01](/images/q/amazonq-dev-01.jpg)

このように作成されます。

![amazonq-dev-03](/images/q/amazonq-dev-03.jpg)
![amazonq-dev-02](/images/q/amazonq-dev-02.jpg)

### 4.5. ユニットテスト作成（/test）

[Amazon Q を使用したユニットテストの生成](http://docs.aws.amazon.com/ja_jp/amazonq/latest/qdeveloper-ug/test-generation.html)

表示しているファイルか、選択したファイルのソースコードに対して、ユニットテストを作成してくれる機能です。
具体的には、以下の作業を行ってくれます。

- テストケースの識別
- モックとスタブの作成
- テストコードの生成

![unit-test](/images/q/unit-test.jpg)

作成されたテストを実行してみます。

```sh
coverage run -m unittest test_fizzbuzz_v2.py
```

![unit-test-run](/images/q/unit-test-coverage-run.jpg)

カバレッジレポートを出力すると、`69%`でした。

```sh
coverage report
```

![unit-test-coverage-report](/images/q/unit-test-coverage-report.jpg)

### 4.6. コードレビュー（/review）

[Amazon Q Developer でコードを確認する](https://docs.aws.amazon.com/ja_jp/amazonq/latest/qdeveloper-ug/code-reviews.html)

コードのレビューを実施してくれる機能です。`/review`で実行できます。
日本語で回答してほしい場合は、あらかじめ「日本語で対応してください」としておくとよいです。

![review-01](/images/q/review-01.jpg)

![review-02](/images/q/review-02.jpg)

### 4.7. ドキュメントの生成（/doc）

[Amazon Q Developer を使用したドキュメントの生成](https://docs.aws.amazon.com/ja_jp/amazonq/latest/qdeveloper-ug/doc-generation.html)

ワークスペースで実行することで、READMEなどを作成してもらえる機能です。

`/doc`と入れると、どんな種類のドキュメントを作成するか聞かれますので、ほしいドキュメントを回答します。

- API Documentation - Document APIs, endpoints, and integration guides
- README Files - Project overviews, setup instructions, and quick starts
- User Guides - Step-by-step instructions for end users
- Developer Guides - Technical implementation details and code examples
- Configuration Guides - Setup and configuration instructions
- Architecture Documentation - System design and component overviews

例えば、以下のリポジトリの内容で`Developer Guides`を作成してもらうとこのようなものが出力されます。

```sh
git clone https://github.com/aws-samples/amazon-bedrock-workshop.git
```

こちらもあらかじめ「日本語で対応してください」としておくと日本語で出力してくれます。

![doc](/images/q/doc.jpg)

## 5. Q CLI

コマンドライン用のAmazon Qを利用できます。
2025年9月時点でサポートされているOSは、`macOS`と`Linux`です。WindowsでもWSLを使うことでインストールすることができます。

VSCodeのDev Containerでも利用することもできます。以下のリポジトリにソースコードがおいてありますので参考にしてください。

https://github.com/ishiharatma/devcontainer-amazon-q-cli

インストールに成功すると、次のような画面から利用することができます。

![q-chat-start](/images/q/q-chat-start.jpg)

終了するには、次のコマンドを入力します。

```sh
/quit
```

### 5.1. コンテキスト管理

他のAIコーディングエージェントと同様に特定のファイルにコンテキストを書いておくことで、Amazon Qが読み取り、書かれた内容に従った動作を行ってくれるものです。

- README.md: プロジェクトの説明や仕様が書いてあることを想定しています
- AmazonQ.md: Q CLI の動作全般にかかわることを記述するファイルです
- .amazonq/rules/*.md: 各言語など細かいコンテキストを記述するファイルです

次のコマンドを入力すると読み込まれているコンテキストファイルを表示することができます。

```sh
/context show
```

### 5.2. MCPサーバ管理

JSONファイルに指定しておくことで、Q CLIがMCPサーバを利用できるようになります。

- .amazonq/mcp.json

```json
{
  "mcpServers": {
    "mcp-server-fetch": {
      "command": "uvx",
      "args": [
        "mcp-server-fetch"
      ]
    },
    "AWS Core MCP Server": {
      "command": "uvx",
      "timeout": 60000,
      "args": [
        "awslabs.core-mcp-server@latest"
      ],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR"
      },
      "autoApprove": [],
      "disabled": false
    },
    :
  }
}
```

### 5.3. カスタムエージェント

[Amazon Q Developer CLI がカスタムエージェントを発表](https://aws.amazon.com/jp/about-aws/whats-new/2025/07/amazon-q-developer-cli-custom-agents/)

2025年7月31日に発表された、Q CLIで独自のエージェントを作成できる機能です。カスタムエージェントとは、特定のユースケースやワークフローに合わせて設定できるAIアシスタントです。

JSONファイルでエージェントの動作が指定可能です。JSONファイルは、`.aws/amazonq/cli-agents`の中に格納されます。

設定されているエージェントのリストは以下のコマンドで確認できます。(最初は何も登録されていないので、一覧に表示されませ)

```sh
/agent list
```

![agent-list-00](/images/q/q-cli-custom-agent-list-00.jpg)


エージェントの構成要素は、[Gitリポジトリ](https://raw.githubusercontent.com/aws/amazon-q-developer-cli/refs/heads/main/schemas/agent-v1.json)か、以下のコマンドで確認します。

```sh
/agent schema
```

![custom-agent-schema](/images/q/q-cli-custom-agent-schema.jpg)

#### カスタムエージェントの作成方法

Q CLIでチャット（q chat）を開いてから、以下のコマンドを実行します。

```sh
/agent create --name example-agent
```

エディタが開きますので、必要事項を設定し、ファイルを保存します。
ファイルは、`~/.aws/amazonq/cli-agents/example-agent.json`として保存されます。

ここでカスタムエージェントの一覧を表示すると作成したカスタムエージェントが確認できます。

![agent-list-01](/images/q/q-cli-custom-agent-list-01.jpg)

一度、チャットを終了（/quit）します。

カスタムエージェントを指定して、チャットを起動します。

```sh
q chat --agent example-agent
```

![custom-agent](/images/q/q-cli-custom-agent-run.jpg)

詳しくは、[こちら](https://aws.amazon.com/jp/blogs/devops/overcome-development-disarray-with-amazon-q-developer-cli-custom-agents/)のAWSブログか、[Amazon Q Developer ドキュメント](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/command-line-custom-agents.html)を参照してください。

### 参考: Build Games with Amazon Q CLI and score a T shirt 🏆👕

2025年5月20日から6月20日までで開催されたAmazon Q CLIを使ってゲームを開発することで、特製Tシャツが貰えるというキャンペーンです。最終的に、キャンペーン期間は2025年6月30日まで延長されました。

https://builder.aws.com/content/2xIoduO0xhkhUApQpVUIqBFGmAc/ended-build-games-with-amazon-q-cli-and-score-a-t-shirt

どのようにゲームを作ったかについては、以下の記事を参考にしてください。ゲーム作成を通して、Q CLIの使い方や指示の方法が学べます。

https://qiita.com/issy929/items/9562187de4f93999e8d4

## 7. 他のサービスとの連携

### 7.1. Microsoft Teams / Slack との連携

チャットアプリケーション内でAmazon Q を活用し、運用イベントの監視やトラブルシューティングが可能です。

Amazon Q Developer in chat applications(旧称: AWS ChatBot)を利用することで、指定したチャネルに通知し、Amazon Q Developerとチャットを行った情報の取得やAWS CLIの実行などができます。
実行できる権限は、IAMロールで制御します。

参考: [Tutorial: Get started with Microsoft Teams](https://docs.aws.amazon.com/chatbot/latest/adminguide/teams-setup.html)

参考: [Tutorial: Get started with Slack](https://docs.aws.amazon.com/chatbot/latest/adminguide/slack-setup.html)

### 7.2. GitHub との連携

AWSブログ: [2025年5月5日 Amazon Q Developer in GitHub (プレビュー) がコード生成を加速](https://aws.amazon.com/jp/blogs/news/amazon-q-developer-in-github-now-in-preview-with-code-generation-review-and-legacy-transformation-capabilities/)

Amazon Q Developer for GitHubを使うと、GitHubのIssueに「Amazon Q Developer agent」ラベルを付けるだけで、新機能の開発から自動コードレビューまでをAIが支援してくれます。

![amazonq-github](/images/q/amazonq-github.jpg)

### 7.3. GitLab との連携

[GitLab Duo Amazon Q](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/gitlab-with-amazon-q.html)

[2025年4月17日 GitLab Duo with Amazon Q の一般提供開始のお知らせ](https://aws.amazon.com/jp/blogs/devops/announcing-general-availability-of-gitlab-duo-with-amazon-q/)

GitLab の DevSecOps プラットフォームに Amazon Q エージェント機能を直接組み込み、ソフトウェア開発ライフサイクル全体でAmazon Qの機能を活用できます。

ただし、以下の利用条件があります。

- GitLab 17.11.0 以降のセルフマネージドインスタンス
- GitLab Ultimateプラン

## 8. Amazon Q Developerを活用するためのヒント

Amazon Q Developerを効率的に活用するためのヒントをいくつか紹介します。

### 明確な指示を与える

具体的で明確な指示を与えることで、より正確な回答やコード生成が期待できます。
生成AIは少ない指示でもそれなりのものを作成するため、生成AIに慣れてくると曖昧な指示を行ってしまうことがあります。これが思わぬところで大きな手戻りとなってしまうことがあるため、常に明確な指示を心がけましょう。

### 対話を重ねる

１回の質問で終わらず、追加の質問を行なうことで、より深く、正確な情報が得られます。最初の回答をベースに、「この実装でエラーハンドリングはどう追加すれば良いですか？」といったフォローアップ質問が効果的です。

### 段階的に指示を与える

1回の指示で大量の情報を与えず、段階的に指示することで、より理解しやすく実装しやすいコードが得られます。大きな機能は小さなコンポーネントに分けて、順次実装を依頼しましょう。

### コード改善のためのレビュー

作成したソースコードのレビューを実施してもらうことで、より効率的な記述方法を学ぶことができます。パフォーマンス改善や、セキュリティなどのベストプラクティスを学べます。

### 設計ドキュメントの作成

`/doc`コマンドを使ってドキュメント生成機能を活用することで、既存のコードベースから自動的にドキュメントを生成でき、コードの理解および、設計書作成の時間短縮にもなります。

## 📖 まとめ

Amazon Q Developer は、AWS での開発・運用業務を大幅に効率化できる強力なAIアシスタントです。日本語への対応がされたことで、利用する機会が増えてくると思います。開発での利用も効果的ですが、個人的には運用業務におけるログ調査やメトリクスからの洞察を得るといった点において、非常に強力だと感じています。