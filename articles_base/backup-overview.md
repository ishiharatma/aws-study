# AWS Backup<!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

<!-- Duration: 00:01:00 -->

- [AWS Backup とは](#aws-backup-とは)
- [サポートされているサービス](#サポートされているサービス)
- [AWS Backup の基本](#aws-backup-の基本)
- [📖 まとめ](#-まとめ)

## AWS Backup とは

[AWS Backup サービス概要](https://aws.amazon.com/jp/backup/)

[AWS Backup ドキュメント](https://docs.aws.amazon.com/ja_jp/aws-backup/?id=docs_gateway)

[AWS Backup よくある質問](https://aws.amazon.com/jp/backup/faqs/)

[AWS Backup の料金](https://aws.amazon.com/jp/backup/pricing/)

## [サポートされているサービス](https://docs.aws.amazon.com/ja_jp/aws-backup/latest/devguide/working-with-supported-services.html)

- コンピューティング
  - EC2
- ストレージ
  - S3
  - EBS
  - EFS
  - FSx
- データベース
  - RDS, Aurora
  - DynamoDB
  - DocumentDB
  - Neptune
  - Timestream
  - Redshift

## AWS Backup の基本

<!-- Duration: 0:01:30 -->

- バックアッププラン
  - バックアップ対象とバックアップするタイミングなどを定義したもの
- バックアップボールト
  - バックアップを格納するコンテナ
  - KMS で暗号化

## 📖 まとめ
