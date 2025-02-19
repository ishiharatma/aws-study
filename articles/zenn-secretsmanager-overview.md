---
title: "【初心者向け】AWS Secrets Manager 入門！完全ガイド" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: false
---

# AWS Secrets Manager<!-- omit in toc -->

![icon](/images/icons/64/Arch_AWS-Secrets-Manager_64.png)

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

<!-- Duration: 00:01:00 -->

- [AWS Secrets Manager とは](#aws-secrets-manager-とは)
- [Systems Manager の SSM Parameter Store とどちらを選択するか？](#systems-manager-の-ssm-parameter-store-とどちらを選択するか)
- [管理できるシークレットのタイプ](#管理できるシークレットのタイプ)
- [シークレットの階層化](#シークレットの階層化)
- [暗号化](#暗号化)
- [自動ローテーション](#自動ローテーション)
- [レプリケーション](#レプリケーション)
- [使用状況の監査](#使用状況の監査)
- [シークレットの削除](#シークレットの削除)
- [📖 まとめ](#-まとめ)

## AWS Secrets Manager とは

<!-- Duration: 0:34:51 -->

データベース認証情報、API キー、その他のシークレットのライフサイクルを通しての管理、取得、ローテーションできるサービスです。

【AWS Black Belt Online Seminar】[AWS Secrets Manager(YouTube)](https://youtu.be/r7JQSBaQwh4)(0:34:51)

![secrets-manager-blackbelt](/images/blackbelt/blackbelt-secretsmanager-320.jpg)

[Secrets Manager サービス概要](https://aws.amazon.com/jp/secrets-manager/)

[Secrets Manager ドキュメント](https://docs.aws.amazon.com/ja_jp/secretsmanager/?id=docs_gateway)

[Secrets Manager よくある質問](https://aws.amazon.com/jp/secrets-managerxx/faqs/)

[Secrets Manager の料金](https://aws.amazon.com/jp/secrets-manager/pricing/)

## Systems Manager の SSM Parameter Store とどちらを選択するか？

<!-- Duration: 0:01:30 -->

同様のサービスに [Systems Manager の Parameter Store](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-parameter-store.html) というものがあり、どちらを選択するか迷うことがあります。

いくつかの項目で比較したものは下記のとおりです。

| 項目               | Parameter Store        | Secrets Manager                            |
| ------------------ | ---------------------- | ------------------------------------------ |
| 料金               | 無料 👑                | 有料                                       |
| 可用性             | ×                      | マルチリージョンレプリケーション 👑        |
| 暗号化             | KMS                    | KMS                                        |
| 自動ローテーション | ×                      | 有 👑                                      |
| AWS サービス連携   | 多数                   | 管理できるシークレットのタイプ（後述）参照 |
| バージョニング     | ○                      | ○                                          |
| 監査・監視         | CloudTrail, CloudWatch | CloudTrail, CloudWatch                     |

この表で比較しても「結局どっち？」となるかもしれません。

個人的なユースケースとしては次のとおりだと考えており、「自動ローテーションが必要かどうか」が最初の判断基準だと考えてもよさそうです。

- Secrets Manager
  - 自動ローテーションが必要
  - 格納する情報
    - 機密情報、データベース接続情報
- SSM Parameter Store
  - 自動ローテーションが不要
  - 格納する情報
    - アプリケーションの環境変数
    - 機密情報、データベース接続情報

## 管理できるシークレットのタイプ

<!-- Duration: 0:01:00 -->

基本的にデータベースの接続情報が選択できます。

「その他のシークレットタイプ」を選択することでデータベース接続情報以外のデータをシークレットとして登録することも可能です。その場合、SSM の Parameter Store と比較検討したほうがよいでしょう。

![types](/images/secretsmanager/secrets-types.jpg)

## シークレットの階層化

<!-- Duration: 0:01:00 -->

名前に"/"を使うことで、疑似的に階層化の管理が可能です。

階層化を行うことで、次のように `project-x` 配下のシークレットに対して一括したアクセス制御を行うことができます。

```json
"Resource": "arn:aws:secretsmanager:ap-northeast-1:123456789012:secret:project-x/*"
```

## 暗号化

<!-- Duration: 0:01:00 -->

作成するシークレットは KMS を使った暗号化が可能です。デフォルトでは、`aws/secretsmanager` という AWS マネージド型キーが使用できます。

このほかに、[顧客管理のキー（CMK）](https://docs.aws.amazon.com/ja_jp/kms/latest/developerguide/concepts.html#customer-cmk)が指定できます。

## 自動ローテーション

<!-- Duration: 0:01:30 -->

自動的にパスワードを変更する[ローテーション](https://docs.aws.amazon.com/ja_jp/secretsmanager/latest/userguide/rotating-secrets.html)を設定することができます。

![rotation](/images/secretsmanager/secrets-rotation.jpg)

設定方法は簡単で、自動ローテーションを `ON` にして、スケジュールを設定するだけで、自動ローテーションを構成できます。

自動ローテーションを行う AWS Lambda 関数が CloudFormation によって自動デプロイされることで実現されています。

## レプリケーション

<!-- Duration: 0:01:30 -->

シークレットは、指定した AWS リージョンにのみ作成されますが、
[レプリケーション](https://docs.aws.amazon.com/ja_jp/secretsmanager/latest/userguide/create-manage-multi-region-secrets.html)することで複数のリージョンで同じ名前のシークレットを保持することが可能です。

![replication](/images/secretsmanager/secrets-replication.jpg)

レプリケーションを有効にした場合、レプリケーション元をプライマリシークレット、レプリケーション先をレプリカシークレットと呼び、自動ローテーションが有効な場合は、レプリカシークレットのほうにも反映されます。

ただし、次の点で注意が必要です。

- レプリカシークレットには料金が発生します
- 削除する場合は、先にレプリカを削除する必要があります。レプリカは即時削除されます。

## 使用状況の監査

<!-- Duration: 0:01:30 -->

「[AWS CloudTrail による AWS Secrets Manager イベントのログ記録](https://docs.aws.amazon.com/ja_jp/secretsmanager/latest/userguide/monitoring-cloudtrail.html)」や「[Amazon AWS Secrets Manager でのモニタリング CloudWatch](https://docs.aws.amazon.com/ja_jp/secretsmanager/latest/userguide/monitoring-cloudwatch.html)」 にも記載されているように API 実行の記録やメトリクスを把握することができます。

## シークレットの削除

<!-- Duration: 0:01:30 -->

シークレットを削除する場合、最短で 7 日間の猶予期間後に削除されるようにスケジュールされます。猶予期間の間はシークレットが利用不可になり、この間は料金が発生しません。

![remove](/images/secretsmanager/secrets-remove.png)

この猶予期間の間に、「[Amazon CloudWatch を使用して、削除予定の AWS Secrets Manager シークレットをモニタリングする](https://docs.aws.amazon.com/ja_jp/secretsmanager/latest/userguide/monitoring_cloudwatch_deleted-secrets.html)」にあるようにモニタリングすることで、利用有無を確認することができます。

猶予期間の間に削除をキャンセルすることで、シークレットを復元し利用可能に戻すことができます。

猶予期間が過ぎた場合は、復元することが不可能になります。

## 📖 まとめ

![overview](/images/all/secretsmanager.png)