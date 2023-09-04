---
title: "【初心者向け】Systems Manager（SSM） について改めて整理してみた③（アプリケーション管理機能編）" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: false
---

# AWS Systems Manager（SSM）:アプリケーション管理

## はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## Contents

Duration: 00:01:00

- [AWS Systems Manager（SSM）:アプリケーション管理](#aws-systems-managerssmアプリケーション管理)
  - [はじめに](#はじめに)
  - [Contents](#contents)
  - [アプリケーション管理の機能](#アプリケーション管理の機能)
  - [パラメータストア](#パラメータストア)
  - [アプリケーションマネージャー](#アプリケーションマネージャー)
  - [AppConfig](#appconfig)

## アプリケーション管理の機能

- アプリケーション管理
  - アプリケーションマネージャー
  - AppConfig
  - パラメータストア

よく使う機能から順番に解説します。

## パラメータストア

設定値やシークレットなどを安全に保存できる機能です。

![ps-1](/images/ssm/parameter-store/parameterstore-1.png)

パラメータストアには最大スループットという制限があります。

デフォルトのスループットは、毎秒 40 です。
高スループットの場合は、毎秒 10,000 です。高スループットにすると、追加料金が発生します。
詳しくは [Parameter Store 料金](https://aws.amazon.com/jp/systems-manager/pricing/)を確認してください。

高スループットにするには、設定より変更することができます。また、高スループットが不要になった場合は元に戻す（制限をリセットする）ことが可能です。

![ps-2](/images/ssm/parameter-store/parameterstore-2.png)

![ps-3](/images/ssm/parameter-store/parameterstore-3.png)

## アプリケーションマネージャー

## AppConfig
