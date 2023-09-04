---
title: "【初心者向け】Systems Manager（SSM） について改めて整理してみた①（概要編）" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: true
---

# AWS Systems Manager（SSM）

## はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## Contents

Duration: 00:01:00

- [AWS Systems Manager（SSM）](#aws-systems-managerssm)
  - [はじめに](#はじめに)
  - [Contents](#contents)
  - [Systems Manager とは](#systems-manager-とは)
  - [SSM？](#ssm)
    - [前提条件](#前提条件)
    - [SSM Agent の使用](#ssm-agent-の使用)
  - [機能分類](#機能分類)

## Systems Manager とは

AWS 上のリソースを表示したり、インスタンスを制御するために使用できる AWS のマネージドサービスです。「インスタンスのパッチ管理」「アンチウィルス定義の更新」「ソフトウェアのインストール状況確認」「運用タスクの自動化」等の機能があります。

【AWS Black Belt Online Seminar】[AWS Systems Manager(YouTube)](https://www.youtube.com/watch?v=g5ndLFklyb4)(38:57)

![black-belt-ssm](/images/ssm/black-belt-ssm-s.jpg)

[AWS Systems Manager サービス概要](https://aws.amazon.com/jp/systems-manager/)

[AWS Systems Manager ドキュメント](https://docs.aws.amazon.com/ja_jp/systems-manager/?id=docs_gateway)

[AWS Systems Manager よくある質問](https://aws.amazon.com/jp/systems-manager/faq/)

[AWS Systems Manager の料金](https://aws.amazon.com/jp/systems-manager/pricing/)

## SSM？

Duration: 0:01:30

Systems Manager の前身のサービス名である「Amazon Simple Systems Manager」の略称が `SSM` でしたので、それに由来しています。

### 前提条件

Systems Manager を使ってサーバーを管理するには、マネージドノード（または、マネージドインスタンス）となっている必要があります。
マネージドノードとは・・・

1. SSM Agent が導入されていること。
  オンプレミスサーバにも導入できます。

2. インスタンスのアウトバンドが確保されていること。具体的には、以下のエンドポイントに対して HTTPS 通信が行える必要があります。

   - ec2messages.region.amazonaws.com
   - ssm.region.amazonaws.com
   - ssmmessages.region.amazonaws.com

3. AWS 管理ポリシー `AmazonSSMManagedInstanceCore` を与えるか、同等の権限を付与する必要があります。

### SSM Agent の使用

[SSM Agent の使用](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/ssm-agent.html)

SSM Agent とは Systems Manager でこれらのリソースを更新、管理、設定できるようにするソフトウェアです。

SSM Agent は事前にプリインストールされているものがあります。事前にインストールされている場合は、適切なポリシーが付与されていればすぐに利用することができます。（参考＞[SSM Agent がプリインストールされた Amazon Machine Images (AMIs)](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/ami-preinstalled-agent.html)）

## 機能分類

運用管理、アプリケーション管理、変更管理、ノード管理の４つの機能があります。

- 運用管理
  - エクスプローラー
  - OpsCenter
  - インシデントマネージャー
- アプリケーション管理
  - アプリケーションマネージャー
  - AppConfig
  - パラメータストア
- 変更管理
  - Change Manager
  - オートメーション
  - Change Calendar
  - メンテナンスウィンドウ
- ノード管理
  - フリートマネージャー
  - コンプライアンス
  - インベントリ
  - ハイブリッドアクティベーション
  - セッションマネージャー
  - Run Command
  - ステートマネージャー
  - パッチマネージャー
  - ディストリビューター
