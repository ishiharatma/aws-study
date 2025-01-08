---
title: "【初心者向け】Amazon EFS 入門！完全ガイド" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: false
---

# Amazon Elastic File System (Amazon EFS) <!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

<!-- Duration: 00:01:00 -->
- [EFS とは](#efs-とは)
- [EFS の基本構成](#efs-の基本構成)
- [ファイルシステムのタイプ](#ファイルシステムのタイプ)
- [ストレージクラス](#ストレージクラス)
- [ライフサイクルポリシー](#ライフサイクルポリシー)
- [バックアップ](#バックアップ)
- [EC2での利用](#ec2での利用)
- [モニタリングとトラブルシューティング](#モニタリングとトラブルシューティング)
- [コスト削減のベストプラクティス](#コスト削減のベストプラクティス)
- [📖 まとめ](#-まとめ)

## EFS とは

フルマネージド型ファイルストレージサービスで、複数のEC2インスタンスで利用する共有ファイルシステムなどによく利用されます。

ネットワークファイルシステムバージョン 4 (NFSv4.1 および NFSv4.0) プロトコルを使用し、Linuxワークロード向けに設計されています。
Windows Serverの場合は、Amazon FSx for Windows File Serverを利用します。

【AWS Black Belt Online Seminar】[Amazon Elastic File System (Amazon EFS)(YouTube)](https://www.youtube.com/watch?v=srLHV0ualZs)(0:40:25)

![01](/images/blackbelt/blackbelt-efs-01-320.jpg)

【AWS Black Belt Online Seminar】[Amazon Elastic File System (Amazon EFS)(YouTube)](https://www.youtube.com/watch?v=swoxicPWPHE)(0:35:25)

![02](/images/blackbelt/blackbelt-efs-02-320.jpg)

[EFS サービス概要](https://aws.amazon.com/jp/efs/)

[EFS ドキュメント](https://docs.aws.amazon.com/ja_jp/efs/?id=docs_gateway)

[EFS よくある質問](https://aws.amazon.com/jp/efs/)

[EFS の料金](https://aws.amazon.com/jp/efs/pricing/)

## EFS の基本構成

<!-- Duration: 0:01:30 -->

![efs](/images/efs/efs.png)

- マウントターゲット
  - EC2から接続するエンドポイントのことで、実体はENIであり、プライベートIPアドレスが割り当てられます。
  - AZに１つだけ作成できます。
  - セキュリティグループでアクセス制御を行います。
- DNS名
  - EC2から接続する場合はDNS名を指定します。
  - DNS名は２種類あります。
    - ファイルシステム： `file-system-id.efs.aws-region.amazonaws.com`
      - 同一AZのマウントターゲットのIPを返す。別AZのIPは返さない。
    - マウントターゲット： `availability-zone.file-system-id.efs.aws-region.amazonaws.com`
      - 別AZからでも参照可能
- 別のVPCから接続したい場合は、VPCピアリングやTransitGatewayなどで接続しておく。

## ファイルシステムのタイプ

![efs-filesystem-type](/images/efs/efs-filesystem-type.jpg)

1. **リージョン**
     - 3つのアベイラビリティゾーンにデータを複製
     - 99.999999999%（11ナイン）の耐久性
     - 頻繁にアクセスされるデータ向け

2. **1ゾーン ストレージクラス**
     - 単一AZでの運用によるコスト最適化
     - 99.999999999%（11ナイン）の耐久性
     - 開発環境やバックアップなどに最適

## ストレージクラス

1. **標準**
    - SSD
    - 頻繁にアクセスされるデータ

2. **低頻度アクセス (IA,Infrequent Access)**
    - アクセス頻度の低いデータ向け
    - 四半期ごとに数回しかアクセスされないデータ

3. **EFS アーカイブ**
    - 1 年に数回しかアクセスされないデータ

## ライフサイクルポリシー

![efs-lifecycle-settings](/images/efs/efs-lifecycle-settings.jpg)

S3バケットのライフサイクルと同様に低頻度アクセスのデータを低コストのストレージクラスに移動させることでコストを最適化することができます。
さらに、EFSでは標準ストレージクラスに戻すことが可能です（デフォルトでは戻さない）。

![efs-lifecycle](/images/efs/efs-lifecycle.jpg)

## バックアップ

AWS Backupによって自動バックアップが可能です。

## EC2での利用

EFSマウントヘルパーを使用します。

```sh
# マウントするディレクトリを作成します
sudo mkdir efs

# ファイルシステムIDを指定してマウントします
sudo mount -t efs file-system-id マウントするディレクトリ/

# ファイルシステム DNS 名を使用してマウントする場合
sudo mount -t efs -o tls file-system-dns-name マウントするディレクトリ/
```

## モニタリングとトラブルシューティング

主要なCloudWatchメトリクスは次のとおりです。

- PercentIOLimit
  - ファイルシステムが汎用パフォーマンス モードの I/O 制限にどれだけ近づいているか
- BurstCreditBalance
  - ファイルシステムのバーストクレジットの数
- StorageBytes
  - EFS ストレージクラスに保存されているデータの量を含む、ファイルシステムのサイズ (バイト単位)

## コスト削減のベストプラクティス

- IAストレージクラスの活用
- 適切なパフォーマンスモードの選択
- 不要なプロビジョンドスループットの見直し

## 📖 まとめ

- Amazon EFSは、柔軟でスケーラブルなファイルストレージソリューションを提供
- 適切な設計と運用管理により、高可用性とコスト効率の両立が可能
- 定期的なパフォーマンス評価とコスト分析を行い、必要に応じて設定を調整することで、最適なストレージ環境を維持