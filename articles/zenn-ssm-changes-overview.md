---
title: "【初心者向け】Systems Manager（SSM） について改めて整理してみた⑤（変更管理機能編）" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: false
---

# AWS Systems Manager（SSM）:変更管理

## はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## Contents

Duration: 00:01:00

- [AWS Systems Manager（SSM）:変更管理](#aws-systems-managerssm変更管理)
  - [はじめに](#はじめに)
  - [Contents](#contents)
  - [変更管理の機能](#変更管理の機能)
  - [Change Manager](#change-manager)
  - [オートメーション](#オートメーション)
  - [メンテナンスウィンドウ](#メンテナンスウィンドウ)
  - [変更カレンダー](#変更カレンダー)

## 変更管理の機能

- 変更管理
  - Change Manager
  - オートメーション
  - Change Calendar
  - メンテナンスウィンドウ

## Change Manager

[AWS Systems Manager Change Manager](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/change-manager.html)

## オートメーション

[AWS Systems Manager Automation](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-automation.html)

インスタンス上でリモートコマンドを実行できるようにしたものです。
自動化ではリモート命令以外にも、例えば実行の一部としてAWSのAPIを利用することができます。
SSM自動化タイプのドキュメントを利用することで、多くの段階を組み合わせて複雑なタスクを完了させることもあります。
なお、SSMサービス上で動作する自動ドキュメントの最大実行時間 AWSアカウントとAWSリージョンあたり、1,000,000秒となります。

## メンテナンスウィンドウ

[AWS Systems Manager Maintenance Windows](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-maintenance.html)

パッチ適用やソフトウェアのインストール、OSのアップグレードなどの一連のタスクをスケジュール実行できる機能です。

## 変更カレンダー

[AWS Systems Manager Change Calendar](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-change-calendar.html)

重要なイベントや負荷が集中する時間帯、バッチ処理が行われる時間帯などを設定することで、定期実行処理を回避することができます。
