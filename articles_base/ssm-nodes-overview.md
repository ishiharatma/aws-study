# AWS Systems Manager（SSM）:ノード管理

## ☘️ はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents

Duration: 00:01:00

- [AWS Systems Manager（SSM）:ノード管理](#aws-systems-managerssmノード管理)
  - [☘️ はじめに](#️-はじめに)
  - [👀 Contents](#-contents)
  - [ノード管理の機能](#ノード管理の機能)
  - [セッションマネージャー](#セッションマネージャー)
    - [セッションマネージャーの料金](#セッションマネージャーの料金)
  - [フリートマネージャー](#フリートマネージャー)
    - [フリートマネージャーの料金](#フリートマネージャーの料金)
  - [Run Command](#run-command)
    - [Run Command の料金](#run-command-の料金)
  - [ステートマネージャー](#ステートマネージャー)
    - [ステートマネージャーの料金](#ステートマネージャーの料金)
  - [パッチマネージャー](#パッチマネージャー)
    - [パッチポリシー](#パッチポリシー)
    - [パッチマネージャーの料金](#パッチマネージャーの料金)
  - [ハイブリッドアクティベーション](#ハイブリッドアクティベーション)
    - [ハイブリッドアクティベーションの料金](#ハイブリッドアクティベーションの料金)
  - [ディストリビューター](#ディストリビューター)
    - [ディストリビューターの料金](#ディストリビューターの料金)
  - [コンプライアンス](#コンプライアンス)
    - [コンプライアンスの料金](#コンプライアンスの料金)
  - [イベントリ](#イベントリ)
    - [インベントリの料金](#インベントリの料金)
  - [📖 まとめ](#-まとめ)

## ノード管理の機能

- ノード管理
  - セッションマネージャー
  - フリートマネージャー
  - Run Command
  - ステートマネージャー
  - パッチマネージャー
  - ハイブリッドアクティベーション
  - ディストリビューター
  - コンプライアンス
  - インベントリ

【AWS Black Belt Online Seminar】[AWS Systems Manager State Manager(YouTube)](https://www.youtube.com/watch?v=vSAbhWZFtKU)(29:24)

![black-belt-ssm-state-manager](/images/ssm/black-belt-ssm-state-manager-s.jpg)

【AWS Black Belt Online Seminar】[AWS Systems Manager Hybrid Activations 編(YouTube)](https://www.youtube.com/watch?v=LUdXlWW5F9I)(24:19)

![black-belt-ssm-hybrid-activations](/images/ssm/black-belt-ssm-hybrid-activations-s.jpg)

【AWS Black Belt Online Seminar】[AWS Systems Manager Inventory 編(YouTube)](https://www.youtube.com/watch?v=2_6YcNmNFcg)(20:14)

![black-belt-ssm-inventory](/images/ssm/black-belt-ssm-inventory-s.jpg)

## セッションマネージャー

Duration: 0:05:00

EC2、エッジデバイス、オンプレ、仮想マシンを管理することができる機能です。この機能を利用することで、踏み台サーバを構築したり、SSH キーを管理したりといったことが不要になります。

セッションマネージャーの利用で最も簡単なのは、AWS マネジメントコンソールから利用することです。

![session-manager-console](/images/ssm/session-manager/session-manager-1.jpg)

Windows サーバーに接続した場合（CUI のみ）

![session-manager-2-windows](/images/ssm/session-manager/session-manager-2-windows.jpg)

Linux サーバーに接続した場合

![session-manager-3-linux](/images/ssm/session-manager/session-manager-3-linux.jpg)

もう一つの利用としては、ポート転送で接続する方法です。接続元のローカルポートへのアクセスをマネージドノードのポートの転送することでアクセスすることができます。
この方法を利用する場合は、接続する端末に、AWS CLI および CLI 用の Session Manager プラグインをインストールする必要があります。（参考＞[AWS CLI 用の Session Manager プラグインをインストールする](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html)）

例えば、Windows サーバに接続する際には次のようなバッチファイルを用意しておくとメンバーへの展開も容易になります。

Windows ノードにリモートデスクトッププロトコル (RDP) を使用して接続するため、`SERVER_PORT_NO` に `3389` を指定し、トラフィックのリダイレクト先となるクライアントのローカルポート `LOCAL_PORT_NO` に任意のポート番号を指定します。ここでは、`33890` を指定しています。

```bat
@echo off
REM セッションマネージャー接続バッチ

SET SERVER_NAME=hogehoge
SET INSTANCE_ID=i-xxxxxxxxxxx
SET SERVER_PORT_NO=3389
SET LOCAL_PORT_NO=33890

echo.
echo ****************************************************
echo セッションマネージャー接続バッチ（%SERVER_NAME%）
echo ****************************************************
echo.
echo EC2 へセッションマネージャー経由で接続します。
echo 本バッチファイルを実行するには、「%HOMEDRIVE%%HOMEPATH%\.aws\credentials」に設定が必要です。
echo.
echo 接続後、リモートデスクトップクライアントを利用し、以下のホストに接続してください。
echo localhost:%LOCAL_PORT_NO%
echo.
echo 本バッチを切断する場合は、コマンドプロンプトを閉じるか、Ctrl + C で切断してください。
echo.
echo.

aws ssm start-session --profile profilename ^
--target %INSTANCE_ID% ^
--document-name AWS-StartPortForwardingSession ^
--parameters "portNumber=%SERVER_PORT_NO%,localPortNumber=%LOCAL_PORT_NO%"

echo .
echo 切断しました。
echo .

pause

exit /b 0
echo .
```

接続するとこのように表示されます。

![ssm-bat](/images/ssm/session-manager/ssm-bat.png)

AWS マネジメントコンソールまたは AWS CLI で接続を行った場合には、CloudTrail にセッションの開始と終了のログが記録されます。

![session-manager-cloudtrail](/images/ssm/session-manager/session-manager-cloudtrail.png)

これ以外に、フリートマネージャーを使った 接続も可能です。Windows サーバであれば、RDP 接続によって GUI 操作が可能になります。

### セッションマネージャーの料金

無料で利用できます。

[セッションマネージャーの料金](https://aws.amazon.com/jp/systems-manager/pricing/#Session_Manager)

## フリートマネージャー

マネジメントコンソールから、インスタンスを管理出来る機能です。

ログやパフォーマンスカウンタなどを取得したり、リモートデスクトップに接続できるようになります。

![fm-tool-menu](/images/ssm/fleet-manager/fm-tool-menu.png)

Ｗ indows サーバのイベントログの表示例

![fm-windows-eventlog](/images/ssm/fleet-manager/fm-windows-eventlog.png)

ファイルシステムの表示例（Windows サーバの C ドライブ）

![fm-windows-fs](/images/ssm/fleet-manager/fm-windows-fs.png)

リモートデスクトップで接続した場合は、Session Manager の接続と同様に CloudTrail によってセッションの開始と終了が記録されます。

リモートデスクトップ接続の表示例

![fm-connect](/images/ssm/fleet-manager/fm-connect.png)

![fm-windows](/images/ssm/fleet-manager/fm-windows.jpg)

### フリートマネージャーの料金

無料で利用できます。

[フリートマネージャーの料金](https://aws.amazon.com/jp/systems-manager/pricing/#Fleet_Manager)

## Run Command

マネジメントコンソール上から各種コマンドをインスタンスに接続することなく実行できる機能です。

![rc-1](/images/ssm/run-command/run-command-1.png)

SSM 　 Agent のアップデートを行ったり、CloudWatch エージェントのインストールと設定を行ったりできます。

参考：[Run Command を使用して SSM Agent を更新する](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/run-command-tutorial-update-software.html)

参考：[AWS Systems Manager を使用した CloudWatch エージェントのインストール](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/installing-cloudwatch-agent-ssm.html)

実行したコマンドは実行履歴として残っているので、一回実行したコマンドを再実行することも可能です。
コマンドが実行履歴として残りますので、例えば サーバーのユーザー作成などを Run Command から実行した場合、ユーザーのパスフレーズも履歴に残ってしまいます。これを避けるには、パラメータストアを利用することで、実行履歴に残らないようにすることもできます。
Run Command から使用するには、`{{ssm:parameter-name}}` と指定します。

### Run Command の料金

無料で利用できます。

[Run Command の料金](https://aws.amazon.com/jp/systems-manager/pricing/#Run_Command)

## ステートマネージャー

ステートマネージャーは設定管理の機能で、定期的に Run Command や Automation を実行することで、インスタンスの状態をあるべき状態にすることができます。

例えば・・・

- SSM Agent などを更新する
- パッチを適用する
- スクリプトを実行する

同様の機能は、メンテナンスウィンドウでも実現することができますが、メンテナンスウィンドウは指定した期間中に実行する場合に選択するとよいでしょう。
ステートマネージャーでは、`インスタンスが起動したタイミングに1回だけ` といったことができます。

どちらを選択するかは、AWS ドキュメント [State Manager または Maintenance Windows の選択](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/state-manager-vs-maintenance-windows.html) を参考にします。

### ステートマネージャーの料金

無料で利用できます。

[ステートマネージャーの料金](https://aws.amazon.com/jp/systems-manager/pricing/#State_Manager)

## パッチマネージャー

EC2 に対する　 OS パッチ適用を自動化できる機能です。
サーバーを構築したはいいが、運用を行っていく上で必要だとはわかっていても後回しになりがちなパッチ適用を自動化できます。

### パッチポリシー

以前は、パッチベースライン と パッチグループといった設定が必要でしたが、簡素化されたパッチポリシーによって素早く利用を開始することができます。

「使用を開始」からいくつかの設定を選択するだけで簡単に作成できます。

![pm-1](/images/ssm/patch-manager/pm-1.png)

![pm-2](/images/ssm/patch-manager/pm-2.png)

![pm-3](/images/ssm/patch-manager/pm-3.png)

暫く待つ（10 分程度？）とパッチポリシーが作成されます。

![pm-4](/images/ssm/patch-manager/pm-4.png)

![pm-5](/images/ssm/patch-manager/pm-5.png)

実行されると、状況を確認できます。

![pm-6](/images/ssm/patch-manager/pm-6.jpg)

インスタンス別に欠落してるパッチの数を確認できます。

![pm-7](/images/ssm/patch-manager/pm-7.jpg)

さらに、どのパッチが適用されていないかを確認することができます。

![pm-8](/images/ssm/patch-manager/pm-8.jpg)

### パッチマネージャーの料金

無料で利用できます。

[パッチマネージャーの料金](https://aws.amazon.com/jp/systems-manager/pricing/#Patch_Manager)

## ハイブリッドアクティベーション

異なる AWS アカウントの EC2 、AWS 以外のクラウドのサーバ、オンプレの仮想マシンを管理対象として登録できる機能です。

### ハイブリッドアクティベーションの料金

アクティベーション自体に料金はかかりません。

[オンプレミスインスタンス管理](https://aws.amazon.com/jp/systems-manager/pricing/#On-Premises_Instance_Management)

## ディストリビューター

ソフトウェアパッケージを作成および配信する機能です。ソフトウェアパッケージをインストールするには、 Run Command とステートマネージャーを使用します。

### ディストリビューターの料金

[ディストリビューターの料金](https://aws.amazon.com/jp/systems-manager/pricing/#Distributor)

## コンプライアンス

マネージドインスタンスがパッチマネージャーのパッチ適用のステータスや、ステートマネージャーの関連付けのステータスなどの情報をもとに、準拠または非準拠をレポートします。
これらの情報を確認し、Run Command などを使用して問題を解決します。

![Compliance](/images/ssm/compliance-1.png)

### コンプライアンスの料金

無料で利用できます。

[コンプライアンスの料金](https://aws.amazon.com/jp/systems-manager/pricing/#Compliance)

## イベントリ

マネージドインスタンスから、OS やアプリケーション、ネットワーク設定などの情報を定期的に取得ができる機能です。定期的に取得するのは、ステートマネージャーによって実行されます。

![inventory](/images/ssm/inventory/inventory-1.png)

### インベントリの料金

無料で利用できます。

[インベントリの料金](https://aws.amazon.com/jp/systems-manager/pricing/#Inventory)

## 📖 まとめ

![ssm-nodes-overview](/images/all/ssm-nodes.png)
