---
title: "【初心者向け】AWS IAM Identiry Center 入門！完全ガイド" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: false
---

# AWS IAM Identity Center<!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

- [AWS IAM Identity Center とは](#aws-iam-identity-center-とは)
- [主要機能](#主要機能)
- [AWS SSO と AWS Identity Center で変わっていないこと](#aws-sso-と-aws-identity-center-で変わっていないこと)
- [IAM Identity Center の利用手順](#iam-identity-center-の利用手順)
- [IAM Identity Center](#iam-identity-center)
  - [ユーザーとグループ](#ユーザーとグループ)
  - [アクセス権限セット](#アクセス権限セット)
  - [AWS アカウント](#aws-アカウント)
- [委任管理の方法](#委任管理の方法)
  - [アカウントベースモデル](#アカウントベースモデル)
  - [許可ベースのモデル](#許可ベースのモデル)
  - [タグベースモデル](#タグベースモデル)
- [委任管理のベストプラクティス](#委任管理のベストプラクティス)
- [📖 まとめ](#-まとめ)

## AWS IAM Identity Center とは

<!-- Duration: 1:49:12 -->

クラウド環境におけるアイデンティティとアクセス管理は、セキュリティと効率性の両面で重要な課題です。
この課題に対応するために AWS Identity Center を提供しています。
AWS Identity Center は、AWS アカウント、クラウドアプリケーション、およびオンプレミスアプリケーションへのシングルサインオン（SSO）アクセスを一元管理するサービスです。

以前は AWS Single Sign-On (AWS SSO)でしたが、機能拡張に伴い に名称が変更されました。（[Jul 26, 2022](https://aws.amazon.com/jp/about-aws/whats-new/2022/07/aws-single-sign-on-aws-sso-now-aws-iam-identity-center/)）

【AWS Black Belt Online Seminar】[AWS アカウント シングルサインオンの設計と運用(YouTube)](https://www.youtube.com/watch?v=ZzD9-5XZgRE)(53:24)

![blackbelt-iam-idc-part1](/images/iam/blackbelt-iam-part1-s.jpg)

[AWS IAM Identity Center サービス概要](https://aws.amazon.com/jp/iam/identity-center/)

[AWS IAM Identity Center ドキュメント](https://docs.aws.amazon.com/ja_jp/singlesignon/?id=docs_gateway)

[AWS IAM Identity Center よくある質問](https://aws.amazon.com/jp/iam/identity-center/faqs/)

IAM の料金 はありません。

## 主要機能

1. 中央集権的なアクセス管理
   - マルチアカウント権限管理
   - きめ細かなアクセス制御を実現する権限セットの定義と割り当て
2. ID プロバイダー（IdP）の連携
   - 複数の IdP サポート
     - AWS Managed Microsoft AD、オンプレミスの Active Directory、外部の IdP との連携
     - SAML 2.0 準拠の IdP との互換性
3. セキュリティ強化
   - 複数の MFA 方式をサポート（ハードウェアトークン、ソフトウェアトークン、SMS）
   - セッションの有効期限設定、強制ログアウト機能
4. 監査とコンプライアンス
   - AWS CloudTrail との統合によるユーザーアクティビティの追跡
   - アクセス権限レポート、使用状況レポートの生成

## AWS SSO と AWS Identity Center で変わっていないこと

サービス名が変更されただけで、技術的な機能や API（sso, sso-directory, and identitystore）は下位互換維持のため変更されていません。

## IAM Identity Center の利用手順

1. IAM Identity Center の有効化
2. 多要素認証の設定
3. ユーザーとグループの作成
4. 許可セットの作成
5. AWS アカウントとの紐づけ
6. MFA デバイスの登録

## IAM Identity Center

### ユーザーとグループ

IAM ユーザーと IAM グループとは異なります。

### アクセス権限セット

### AWS アカウント

## 委任管理の方法

https://aws.amazon.com/jp/blogs/security/delegating-permission-set-management-and-account-assignment-in-aws-iam-identity-center/

### アカウントベースモデル

### 許可ベースのモデル

### タグベースモデル

## 委任管理のベストプラクティス

## 📖 まとめ

![iam-idc](/images/all/iam-idc.png)
