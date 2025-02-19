# Amazon FSx<!-- omit in toc -->

![icon](/images/icons/64/Arch_Amazon-FSx_64.png)

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

<!-- Duration: 00:01:00 -->

- [FSx とは](#fsx-とは)
- [1. FSxファミリーの概要](#1-fsxファミリーの概要)
- [2. 主要機能と特徴](#2-主要機能と特徴)
  - [2.1 FSx for Windows File Server](#21-fsx-for-windows-file-server)
  - [2.2 FSx for Lustre](#22-fsx-for-lustre)
  - [2.3 FSx for NetApp ONTAP](#23-fsx-for-netapp-ontap)
  - [2.4 FSx for OpenZFS](#24-fsx-for-openzfs)
- [3. 実装のベストプラクティス](#3-実装のベストプラクティス)
  - [3.1 セキュリティ](#31-セキュリティ)
  - [3.2 パフォーマンス最適化](#32-パフォーマンス最適化)
  - [3.3 コスト最適化](#33-コスト最適化)
- [4. 一般的なユースケース](#4-一般的なユースケース)
  - [4.1 エンタープライズアプリケーション](#41-エンタープライズアプリケーション)
  - [4.2 HPC/分析ワークロード](#42-hpc分析ワークロード)
  - [4.3 バックアップと災害対策](#43-バックアップと災害対策)
  - [4.4 S3 vs EFS vs FSx vs EBS](#44-s3-vs-efs-vs-fsx-vs-ebs)
- [5. モニタリングとメンテナンス](#5-モニタリングとメンテナンス)
  - [5.1 主要メトリクス](#51-主要メトリクス)
  - [5.2 メンテナンスタスク](#52-メンテナンスタスク)
- [📖 まとめ](#-まとめ)


## FSx とは

Amazon FSxは、ファイルシステムを実行するためのフルマネージドサービスです。

[FSx サービス概要](https://aws.amazon.com/jp/fsx/)

[EFS ドキュメント](https://docs.aws.amazon.com/ja_jp/fsx/?id=docs_gateway)

- Amazon FSx for Windows File Server
  - 【AWS Black Belt Online Seminar】[Amazon FSx for Windows Server&Lustre(YouTube)](https://www.youtube.com/watch?v=74rdt--zb-c)(0:24:22)
    - ![blackbelt-windows](/images/blackbelt/blackbelt-fsx-windows-320.jpg)
  - [Amazon FSx for Windows File Server よくある質問](https://aws.amazon.com/jp/fsx/windows/faqs/)
  - [Amazon FSx for Windows File Server の料金](https://aws.amazon.com/jp/fsx/windows/pricing/)
- FSx for Lustre
  - 【AWS Black Belt Online Seminar】[Amazon FSx for Windows Server&Lustre(YouTube)](https://www.youtube.com/watch?v=74rdt--zb-c)(0:24:22)
    - ![blackbelt-lustre](/images/blackbelt/blackbelt-fsx-lustre-320.jpg)
  - [Amazon FSx for Lustre よくある質問](https://aws.amazon.com/jp/fsx/lustre/faqs/)
  - [Amazon FSx for Lustre の料金](https://aws.amazon.com/jp/fsx/lustre/pricing/)
- FSx for NetApp ONTAP
  - 【AWS Black Belt Online Seminar】[Amazon FSx for NetApp ONTAP(YouTube)](https://www.youtube.com/watch?v=KjZLgJ2AnKQ)(1:08:33)
    - ![blackbelt-netapp-ontap](/images/blackbelt/blackbelt-fsx-netapp-ontap-320.jpg)
  - [Amazon FSx for NetApp ONTAP よくある質問](https://aws.amazon.com/jp/fsx/netapp-ontap/faqs/)
  - [Amazon FSx for NetApp ONTAP の料金](https://aws.amazon.com/jp/fsx/netapp-ontap/pricing/)
- FSx for OpenZFS
  - 【AWS Black Belt Online Seminar】[Amazon FSx for OpenZFS(YouTube)](https://www.youtube.com/watch?v=iDItcfeG2iU)(1:01:50)
    - ![blackbelt-openzfs](/images/blackbelt/blackbelt-fsx-openzfs-320.jpg)
  - [Amazon FSx for OpenZFS よくある質問](https://aws.amazon.com/jp/fsx/openzfs/faqs/)
  - [Amazon FSx for OpenZFS の料金](https://aws.amazon.com/jp/fsx/openzfs/pricing/)

## 1. FSxファミリーの概要

Amazon FSxは以下の4つのファイルシステムをサポートしています：

- **FSx for Windows File Server**：Active Directory統合されたWindowsファイル共有
- **FSx for Lustre**：高性能コンピューティング(HPC)向けの並列ファイルシステム
- **FSx for NetApp ONTAP**：NetApp ONTAPの機能をフルマネージドで提供
- **FSx for OpenZFS**：ZFSベースの高性能ファイルシステム

## 2. 主要機能と特徴

### 2.1 FSx for Windows File Server

- Windows互換のSMBプロトコルサポート
- Active Directory統合によるきめ細かなアクセス制御
- DFSネームスペースとDFSレプリケーションのサポート
- シャドウコピー（VSS）によるバックアップ
- データ重複除外とファイル圧縮機能
- 最大64 TiB

### 2.2 FSx for Lustre

- 最大数百GBpsのスループットと数百万IOPSを実現
- S3との透過的な統合→参考：[Amazon FSx for Lustre – Amazon S3 統合の強化](https://aws.amazon.com/jp/blogs/news/enhanced-amazon-s3-integration-for-amazon-fsx-for-lustre/)
- 自動バックアップと高可用性オプション
- スクラッチまたは永続ファイルシステムの選択が可能
- Lustreはスパコン「富岳」でも使われている高性能な並列ファイルシステム

### 2.3 FSx for NetApp ONTAP

- NetApp ONTAP（オンタップ）は、NetAppのストレージOSです。FAS（Fabric Attached Storage）、AFF（All-Flash FAS）に搭載され、最⼩限の処理や負荷によって最⼤限の拡張性と管理性を提供
- NFSv3、NFSv4.1、SMB v3.0、iSCSIプロトコルをサポート
- NetAppのSnapshotやFlexClone機能
- マルチプロトコルアクセス
- 容量プール型ストレージによるコスト最適化
- 最大512 TiB

### 2.4 FSx for OpenZFS

- サン・マイクロシステムズによって開発されたファイルシステム・ZFSのオープンソース実装「[OpenZFS](https://openzfs.org/wiki/Main_Page)」
- NFSv3、NFSv4.0、NFSv4.1プロトコルサポート
- スナップショットとクローン機能
- 圧縮による容量効率化
- 低レイテンシーと高いIOPS
- 最大512 TiB

## 3. 実装のベストプラクティス

### 3.1 セキュリティ

- VPC内での展開を推奨
- セキュリティグループによるアクセス制御の実装
- 暗号化の有効化（保存時および転送時）
- 最小権限の原則に基づくIAMポリシーの設定

### 3.2 パフォーマンス最適化

- ワークロードに適したストレージ容量とスループット容量の選択
- 適切なバックアップウィンドウの設定
- マルチAZ展開による可用性の確保
- モニタリングとアラートの設定

### 3.3 コスト最適化

- 自動バックアップの保持期間の適切な設定
- 使用率に基づいたストレージ容量の調整
- スループット容量の定期的な見直し
- 未使用のスナップショットの定期的なクリーンアップ

## 4. 一般的なユースケース

### 4.1 エンタープライズアプリケーション

- Windows共有ファイルサーバーの移行
- ホームディレクトリの提供
- アプリケーションデータの共有ストレージ

### 4.2 HPC/分析ワークロード

- 機械学習トレーニングデータの格納
- ゲノム解析
- 金融モデリング
- メディアレンダリング

### 4.3 バックアップと災害対策

- クロスリージョンバックアップ
- データレプリケーション
- ポイントインタイムリカバリ

### 4.4 S3 vs EFS vs FSx vs EBS

- オブジェクトストレージ： S3
- ブロックストレージ：EBS
- ファイルストレージ：EFS, FSx

- S3: データ分析、大量データ、データレイク
- EFS:複数のEC2インスタンス（Linux）でファイル共有
- FSx:WindowsServerでのファイル共有、分析ワークロードでのファイル共有など
- EBS: EC2やRDSなど高速読み書きが必要なケース

## 5. モニタリングとメンテナンス

### 5.1 主要メトリクス

- ストレージ容量使用率
- IOPSとスループット
- レイテンシー
- クライアント接続数

### 5.2 メンテナンスタスク

- 定期的なバックアップの検証
- パフォーマンスメトリクスの確認
- セキュリティグループルールの見直し
- パッチ適用状況の確認

## 📖 まとめ

- Amazon FSxは、エンタープライズグレードのファイルシステムをマネージドサービスとして提供し、様々なワークロードに対応できる柔軟性を備えています。
- 適切な設計と運用管理により、高可用性、高性能、そしてセキュアなファイルストレージソリューションを実現

- 各ワークロードの要件に応じて適切なFSxファイルシステムを選択し、ベストプラクティスに従った実装を行うことで、効率的なファイルストレージ環境を構築することができます。

