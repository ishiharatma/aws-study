# AWS Systems Manager（SSM）

## はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## Systems Manager とは

AWS 上のリソースを表示したり、インスタンスを制御するために使用できる AWS のマネージドサービスです。「インスタンスのパッチ管理」「アンチウィルス定義の更新」「ソフトウェアのインストール状況確認」「運用タスクの自動化」等の機能があります。

【AWS Black Belt Online Seminar】[AWS Systems Manager(YouTube)](https://www.youtube.com/watch?v=g5ndLFklyb4)(38:57)

![black-belt-ssm](/images/ssm/black-belt-ssm-s.jpg)

[AWS Systems Manager サービス概要](https://aws.amazon.com/jp/systems-manager/)

[AWS Systems Manager ドキュメント](https://docs.aws.amazon.com/ja_jp/systems-manager/?id=docs_gateway)

[AWS Systems Manager よくある質問](https://aws.amazon.com/jp/systems-manager/faq/)

[AWS Systems Manager の料金](https://aws.amazon.com/jp/systems-manager/pricing/)

## SSM？

Duration: 0:00:30

Systems Manager の前身のサービス名である「Amazon Simple Systems Manager」の略称が `SSM` でしたので、それに由来しています。

これ以降、各機能の説明を行います。

## Session Manager

Duration: 0:05:00

EC2、エッジデバイス、オンプレ、仮想マシンを管理することができる機能です。この機能を利用することで、踏み台サーバを構築したり、SSHキーを管理したりといったことが不要になります。

セッションマネージャーの利用で最も簡単なのは、AWS マネジメントコンソールから利用することです。

![session-manager-console](/images/ssm/session-manager/session-manager-1.jpg)

Windows サーバーに接続した場合
![session-manager-2-windows](/images/ssm/session-manager/session-manager-2-windows.jpg)

Linux サーバーに接続した場合
![session-manager-3-linux](/images/ssm/session-manager/session-manager-3-linux.jpg)

もう一つの利用としては、ポート転送で接続する方法です。接続元のローカルポートへのアクセスをマネージドノードのポートの転送することでアクセスすることができます。
この方法を利用する場合は、接続する端末に、AWS CLI および CLI 用の Session Manager プラグインをインストールする必要があります。（参考＞[AWS CLI 用の Session Manager プラグインをインストールする](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html)）

どちらの方法を行った場合でも、CloudTrail にセッションの開始と終了のログが記録されます。

![session-manager-cloudtrail](/images/ssm/session-manager/session-manager-cloudtrail.png)

これ以外に、Fleet Manager を使った 接続も可能です。Windows サーバであれば、RDP 接続によって GUI 操作が可能になります。

### 前提条件

セッションマネージャーを利用するには、SSM Agent と以下に対する HTTPS アクセスが出来ることが必要です。

- ec2messages.region.amazonaws.com
- ssm.region.amazonaws.com
- ssmmessages.region.amazonaws.com

さらに、AWS 管理ポリシー `AmazonSSMManagedInstanceCore` を与えるか、同等の権限を付与する必要があります。

### SSM Agent の使用

[SSM Agent の使用](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/ssm-agent.html)

SSM Agent とは Systems Manager でこれらのリソースを更新、管理、設定できるようにするソフトウェアです。

SSM Agent は事前にプリインストールされているものがあります。事前にインストールされている場合は、適切なポリシーが付与されていればすぐに利用することができます。（参考＞[SSM Agent がプリインストールされた Amazon Machine Images (AMIs)](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/ami-preinstalled-agent.html)）

## Fleet Manager

マネジメントコンソールから、インスタンスを管理出来る機能です。

ログやパフォーマンスカウンタなどを取得したり、リモートデスクトップに接続できるようになります。

![fm-tool-menu](/images/ssm/fleet-manager/fm-tool-menu.png)

Ｗindows サーバのイベントログの表示例
![fm-windows-eventlog](/images/ssm/fleet-manager/fm-windows-eventlog.png)

ファイルシステムの表示例（WindowsサーバのCドライブ）
![fm-windows-fs](/images/ssm/fleet-manager/fm-windows-fs.png)

リモートデスクトップで接続した場合は、Session Manager の接続と同様に CloudTrail によってセッションの開始と終了が記録されます。

リモートデスクトップ接続の表示例
![fm-connect](/images/ssm/fleet-manager/fm-connect.png)

![fm-windows](/images/ssm/fleet-manager/fm-windows.jpg)

## パラメータストア

設定値やシークレットなどを安全に保存できる機能です。

![ps-1](/images/ssm/parameter-store/parameterstore-1.png)

パラメータストアには最大スループットという制限があります。

デフォルトのスループットは、毎秒 40 です。
高スループットの場合は、毎秒 10,000 です。高スループットにすると、追加料金が発生します。
詳しくは[Parameter Store 料金](https://aws.amazon.com/jp/systems-manager/pricing/)を確認してください。

高スループットにするには、設定より変更することができます。また、高スループットが不要になった場合は元に戻す（制限をリセットする）ことが可能です。

![ps-2](/images/ssm/parameter-store/parameterstore-2.png)

![ps-3](/images/ssm/parameter-store/parameterstore-3.png)

## Run Command

## ステートマネージャー

## オートメーション

## イベントリー

## パッチマネージャー

EC2 に対する　OS パッチ適用を自動化できる機能です。
サーバーを構築したはいいが、運用を行っていく上で必要だとはわかっていても後回しになりがちなパッチ適用を自動化できます。

### パッチポリシー

以前は、パッチベースライン と パッチグループといった設定が必要でしたが、簡素化されたパッチポリシーによって素早く利用を開始することができます。

「使用を開始」からいくつかの設定を選択するだけで簡単に作成できます。

![pm-1](/images/ssm/patch-manager/pm-1.png)

![pm-2](/images/ssm/patch-manager/pm-2.png)

![pm-3](/images/ssm/patch-manager/pm-3.png)

暫く待つ（10分程度？）とパッチポリシーが作成されます。

![pm-4](/images/ssm/patch-manager/pm-4.png)

![pm-5](/images/ssm/patch-manager/pm-5.png)



## メンテナンスウィンドウ

## コンプライアンス


## ドキュメント

## コンカレンシー

## セキュリティ
