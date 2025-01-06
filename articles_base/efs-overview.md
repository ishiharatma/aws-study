# Amazon Elastic File System (Amazon EFS) <!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

<!-- Duration: 00:01:00 -->

- [xx とは](#xx-とは)
- [xx の基本](#xx-の基本)
- [📖 まとめ](#-まとめ)

## EFS とは

【AWS Black Belt Online Seminar】[Amazon Elastic File System (Amazon EFS)(YouTube)](https://www.youtube.com/watch?v=srLHV0ualZs)(0:40:25)

【AWS Black Belt Online Seminar】[Amazon Elastic File System (Amazon EFS)(YouTube)](https://www.youtube.com/watch?v=swoxicPWPHE)(0:35:25)


![xx](/images/xx/)

[EFS サービス概要](https://aws.amazon.com/jp/efs/)

[EFS ドキュメント](https://docs.aws.amazon.com/ja_jp/efs/?id=docs_gateway)

[EFS よくある質問](https://aws.amazon.com/jp/efs/)

[EFS の料金](https://aws.amazon.com/jp/efs/pricing/)

## xx の基本

<!-- Duration: 0:01:30 -->

## ファイルシステムのタイプ

1. **リージョン**
   - 頻繁にアクセスされるデータ向け
   - 3つのアベイラビリティゾーンにデータを複製
   - 99.999999999%（11ナイン）の耐久性

2. **1ゾーン ストレージクラス**
   - 単一AZでの運用によるコスト最適化
   - 開発環境やバックアップなどに最適
   - 99.999999999%（11ナイン）の耐久性

## ストレージクラス

1. **標準**
  - SSD
  - 頻繁にアクセスされるデータ

2. **低頻度アクセス (IA,Infrequent Access) **
  - アクセス頻度の低いデータ向け
  - 四半期ごとに数回しかアクセスされないデータ

3. ** EFS アーカイブ**
  - 1 年に数回しかアクセスされないデータ

## 📖 まとめ