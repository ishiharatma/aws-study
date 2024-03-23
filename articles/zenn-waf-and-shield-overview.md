---
title: "【初心者向け】AWS WAF & Shield 入門！完全ガイド" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: true
---

# AWS WAF & Shield

## ☘️ はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents

Duration: 00:01:00

- [AWS WAF \& Shield](#aws-waf--shield)
  - [☘️ はじめに](#️-はじめに)
  - [👀 Contents](#-contents)
  - [OSI モデルとは](#osi-モデルとは)
  - [AWS Shield とは](#aws-shield-とは)
  - [AWS WAF とは](#aws-waf-とは)
  - [AWS Shield の機能](#aws-shield-の機能)
    - [Global threat dashboard](#global-threat-dashboard)
  - [📖 AWS Shield のまとめ](#-aws-shield-のまとめ)
  - [AWS WAF の機能](#aws-waf-の機能)
    - [なぜ Web Application Firewall が必要か](#なぜ-web-application-firewall-が必要か)
    - [Web ACL](#web-acl)
    - [WCU(web ACL Capacity Units)](#wcuweb-acl-capacity-units)
    - [ルールとルールグループ](#ルールとルールグループ)
      - [ルール](#ルール)
        - [アクション](#アクション)
      - [AWS マネージドルールグループ](#aws-マネージドルールグループ)
        - [AWS マネージドルールグループの適用例](#aws-マネージドルールグループの適用例)
      - [AWS Marketplace マネージドルールグループ](#aws-marketplace-マネージドルールグループ)
      - [独自のルールグループ](#独自のルールグループ)
    - [ログ](#ログ)
      - [ログ出力](#ログ出力)
      - [ログフィールド](#ログフィールド)
      - [ログの分析](#ログの分析)
  - [📖 AWS WAF のまとめ](#-aws-waf-のまとめ)

## OSI モデルとは

Duration: 0:1:00

| 層  | 名称                 | プロトコル            |
| --- | -------------------- | --------------------- |
| 7   | アプリケーション層   | HTTP/HTTPS,FTP,DNS..  |
| 6   | プレゼンテーション層 | TLS,SSL,FTP(Ascii)... |
| 5   | セッション層         | TLS,NetBIOS...        |
| 4   | トランスポート層     | TCP,UDP...            |
| 3   | ネットワーク層       | IP,ICMP,ARP,RARP...   |
| 2   | データリンク層       | PPP,Ethernet          |
| 1   | 物理層               | RS-232,UTP,無線       |

詳しくは、[OSI 参照モデル(Wikipedia)](https://ja.wikipedia.org/wiki/OSI%E5%8F%82%E7%85%A7%E3%83%A2%E3%83%87%E3%83%AB)

## AWS Shield とは

Duration: 1:00:33

AWS Shield は、AWS リソースを DDoS（分散型サービス拒否,[DDoS 攻撃（Distributed Denial of Service attack）とは(Wikipedia)](https://ja.wikipedia.org/wiki/DoS%E6%94%BB%E6%92%83)）攻撃から保護するためのサービスです。 Shield は、レイヤー 3 およびレイヤー 4(OSI モデルの項を参照)の攻撃（IP、TCP、UDP レベルでの攻撃）を自動的に検出および防止し、AWS のグローバルネットワークに統合されており、ネットワークレベルの保護を提供します。これには、TCP SYN Flood、UDP Flood、ICMP Flood などが含まれます。

【AWS Black Belt Online Seminar】[AWS Shield Advanced(YouTube)](https://youtu.be/qKNsYWHWOiYxx)(1:00:33)

![blackbelt-shield](/images/blackbelt/blackbelt-shield-320.jpg)

[AWS Shield サービス概要](https://aws.amazon.com/jp/shield/)

[AWS Shield ドキュメント](https://docs.aws.amazon.com/ja_jp/shield/?id=docs_gateway)

[AWS Shield よくある質問](https://aws.amazon.com/jp/shield/faqs/)

[AWS Shield 料金](https://aws.amazon.com/jp/shield/pricing/)

## AWS WAF とは

Duration: 1:58:37

AWS WAF（Web Application Firewall） とは、Web アプリケーションの脆弱性や攻撃から保護するためのセキュリティサービスです。 WAF は、HTTP / HTTPS リクエストを監視し、指定されたルールに基づいてトラフィックを許可またはブロックします。WAF は、XSS（クロスサイトスクリプティング）、SQL インジェクション、CSRF（クロスサイトリクエストフォージェリ）などの Web アプリケーション攻撃を検出および防止するための機能を提供します。

【AWS Black Belt Online Seminar】[AWS Managed Rules for AWS WAF の活用(YouTube)](https://youtu.be/ceQ7eU_jkD4)(0:32:28)

![blackbelt-waf-rule](/images/blackbelt/blackbelt-waf-rule-320.jpg)

【AWS Black Belt Online Seminar】[AWS WAF アップデート(YouTube)](https://youtu.be/4KbCJAjiA3A)(1:01:15)

![blackbelt-waf-update](/images/blackbelt/blackbelt-waf-update-320.jpg)

【AWS Black Belt Online Seminar】[AWS WAF でできる Bot 対策(YouTube)](https://youtu.be/x11kHIESSGA)(0:24:54)

![blackbelt-waf-bot](/images/blackbelt/blackbelt-waf-bot-320.jpg)

[AWS WAF サービス概要](https://aws.amazon.com/jp/waf/)

[AWS WAF ドキュメント](https://docs.aws.amazon.com/ja_jp/waf/?id=docs_gateway)

[AWS WAF よくある質問](https://aws.amazon.com/jp/waf/faqs/)

[AWS WAF 料金](https://aws.amazon.com/jp/waf/pricing/)

## AWS Shield の機能

Duration: 0:05:00

AWS Shield は、 Standard と Advanced の２つがあります。
Standard はデフォルトで有効になっており、追加料金なしで利用できます。
Elastic Load Balancing (ELB)、Application Load Balancer、Amazon CloudFront、Amazon Route 53 を利用する際には効果を発揮します。

Advanced は有料サービスで、有効化すると月額 3,000 USD です。

主な違いは次のとおりです。

| 項目               | Standard                  | Advanced                                          |
| ------------------ | ------------------------- | ------------------------------------------------- |
| 料金               | 無料                      | 有料                                              |
| 保護レイヤー       | L3/4                      | L3/4/7                                            |
| 保護可能 DDoS 攻撃 | 一般的な                  | 大規模                                            |
| DDoS コスト保護    | 無                        | オートスケール発動のコスト還元あり                |
| 異常検知           | 無                        | 統計情報から異常検知                              |
| レポート           | 無                        | 攻撃をリアルタイムで通知、過去 13 カ月の履歴保持  |
| サポート           | 無                        | 専門家（SRT）による 24 時間 365 日。英語          |
| その他             | 無                        | AWS WAF の一部が無料利用可                        |
| 適用サービス       | CloudFront, Route 53 など | CloudFront,Route53,ELB,ALB,Global Accelerator,EC2 |

### Global threat dashboard

Duration: 0:01:00

全ての AWS アカウントで観測された DDoS イベントを表示するダッシュボードです。これを見ることで、個別に攻撃を受けたのか、大規模な攻撃が発生しているのかが分かります。

![shield-console-global-activity](/images/shield/shield-console-global-activity.png)

## 📖 AWS Shield のまとめ

![shield](/images/all/shield.png)

## AWS WAF の機能

Duration: 0:15:00

### なぜ Web Application Firewall が必要か

OSI モデルのレイヤー３，４については Shield のようなファイアウォールによって悪意のあるトラフィックを遮断することができます。
しかし、アプリケーションの HTTP リクエストに発生する SQL インジェクションやクロスサイトスクリプティングのようなものはどうでしょうか。
これらはレイヤー７で動作するため、パケットの中身を読み取ることができず、遮断することが出来ません。
この部分には様々な情報を含むことができるため、攻撃手段も多様です。
そのため、レイヤー７で動作する内容を読み取り、攻撃からアプリケーションを保護するファイアウォールが必要になりました。

攻撃によって Web アプリケーションが受けるセキュリティに関する最も重大な 10 のリスクについては下記サイトを参考にしてください。

[OWASP Top Ten Project](https://owasp.org/www-project-top-ten/)

### Web ACL

AWS WAF の利用を開始するときに最初に作成するのが、Web ACL(ウェブアクセスコントロールリスト：web access control list)です。 Web ACL は同一の制御ルールを含んだ論理的なグループのことです。
Web ACL は作成した直後から課金対象となります。
料金は月額固定で、１か月に満たない場合は案分されます。

![webacl](/images/waf/waf-webacl.jpg)

WebACL には複数の制御ルールを設定し、通信を許可したり、拒否したりすることができます。
すべてのルールが通った場合のデフォルトの動作（許可か拒否）を指定することができます。

![waf-rules](/images/waf/waf-rules.jpg)

![default-action](/images/waf/waf-webacl-default-action.jpg)

### WCU(web ACL Capacity Units)

WebACL に設定できるルールやルールグループにはそれぞれ WCU(web ACL Capacity Units) という処理コストの定義があり、複雑なルールほど WCU が多くなっています。
１つの WebACL に設定できる WCU に上限をつけることで、適用できるルール数を制限しています。

![waf-wcu](/images/waf/waf-wcu.jpg)

下記アップデート以前は、最大 1,500 WCU となっており、これを超える場合は上限緩和申請が必要でしたが、アップデートにより 5,000 WCU まで上限緩和申請なしで使用できるようになりました。
ただし、1,500 WCU を超えると 500 WCU 単位でリクエスト 100 万件あたりに追加料金が発生するようになります。
[AWS WAF でウェブ ACL の容量ユニット制限を引き上げ(Apr 11, 2023)](https://aws.amazon.com/jp/about-aws/whats-new/2023/04/aws-waf-web-acl-capacity-units-limits/)

### ルールとルールグループ

#### ルール

リクエストに対する検査基準(ステートメント：Statement)と、検査基準に一致した場合のアクション(Action)を定義したものです。

![waf-rule](/images/waf/waf-rule.jpg)

いろいろな検査基準を作成できますが、処理が複雑になると WCU も増加していきます。

WCU の加算ルールは下記を参照してください。

[一致ルールステートメント](https://docs.aws.amazon.com/ja_jp/waf/latest/developerguide/waf-rule-statements-match.html)

[論理ルールステートメント](https://docs.aws.amazon.com/ja_jp/waf/latest/developerguide/waf-rule-statements-logical.html)

[レートベースのルールステートメント](https://docs.aws.amazon.com/ja_jp/waf/latest/developerguide/waf-rule-statement-type-rate-based.html)

##### アクション

アクションには、終了アクションと非終了アクションがあります。
終了アクションは、残りのルールがあったとしてもそこで検査を中断するアクションです。非終了アクションは、残りのルールによる検査を継続します。

ルールのアクションは次のとおりです。

- ALLOW
  - リクエストの転送を許可します。
  - 終了アクション
- BLOCK
  - リクエストの転送を拒否します。HTTP 403 (Forbidden) ステータスコードで応答します。
  - 終了アクション
- COUNT
  - リクエストがあったことを記録（カウント）しますが、なんのアクションも実施しません。残りのルールがある場合は継続します。
  - 非終了アクション
- CAPTCHA および Challenge
  - CAPTCHA パズルおよびサイレントチャレンジを使用して、ボットかどうかを判定します。
  - 要するに「私はロボットではありません」を実装してくれるもの。
  - 判定結果によって、終了アクションか非終了アクションとなります。

#### AWS マネージドルールグループ

AWS が用意しているいくつかのルールをまとめて用途ごとに定義したものです。
WordPress や PHP など特定タイプのアプリケーションを保護するように設計されたものもあります。

ほとんどが無料で利用できますが、一部有料なルールグループも存在します。

![managed-paid](/images/waf/waf-managedrules-paid.jpg)

![managed-free](/images/waf/waf-managedrules-free.jpg)

マネージドルールは、AWS によって随時アップデートされ、バージョンが上がっていきます。
マネージドルールを使用する際は、バージョン固定で利用するか、推奨されてるバージョンに自動的にアップデートするかを選択できます。

![managed-version](/images/waf/waf-managedrules-version.jpg)

推奨されているバージョンに自動的にアップデートする場合、運用コストは下がりますが、アップデートにより予期せぬブロックが発生するリスクがあります。

バージョンを固定する場合、新しいバージョンを検証し適用する運用コストが上がりますが、予期せぬブロックが発生するリスクは回避できます。
どちらが適しているかはしっかり検討するのがよいでしょう。

ルールグループがアップデートされることを検知するには、[マネージドルールグループに対する新しいバージョンと更新の通知を受け取る](https://docs.aws.amazon.com/ja_jp/waf/latest/developerguide/waf-using-managed-rule-groups-sns-topic.html)を参考にします。

![managed-versionup](/images/waf/waf-managedrules-verup.jpg)

##### AWS マネージドルールグループの適用例

- 推奨ルールのみ（◎ のみ）：1,175 / 1,500 WCU 　残り：325 WCU

  | ルール名                  | キャパシティ |
  | ------------------------- | ------------ |
  | Core rule set             | 700          |
  | Know bad inputs           | 200          |
  | SQL database              | 200          |
  | Amazon IP reputation list | 25           |
  | Anonymous IP list         | 50           |

- Linux サーバ：1,375 / 1,500 WCU 　残り：125 WCU

  | ルール名               | キャパシティ |
  | ---------------------- | ------------ |
  | 推奨ルール             | 1,175        |
  | Linux operating system | 200          |

分類の記号の意味は次のとおりです。

- ◎：導入を推奨
- △：OS の種類によって導入を検討
- ▲：アプリケーションの性質によって導入を検討

| ルール名                                   | キャパシティ | ルール説明                                                                                                                                                                                                                                                                                                                                        | 分類 |
| ------------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| Core rule set                              | 700          | OWASP(Open Web Application Security Project \*1) で公開されている Web サイトを狙った攻撃に対して作られたルールで、多くのインジェクション関係の基本的なルールが含まれているため、Web サイトを保護するための基本ルールとして導入することを推奨します。                                                                                              | ◎    |
| Admin protection                           | 100          | 管理画面へのアクセスを制御するためのルールで、公開された管理ページへの外部アクセスをブロックできるルールが含まれています。アプリケーションの性質から導入を検討します。                                                                                                                                                                            | ▲    |
| Know bad inputs                            | 200          | 既知の脆弱性の悪用または発見に関連付けられている要求パターンをブロックできるルールです。悪意のある攻撃者が脆弱なアプリケーションを発見するリスクを減らすことができるため、Web サイトを保護するための基本ルールとして導入することを推奨します。                                                                                                    | ◎    |
| SQL database                               | 200          | SQL インジェクションなど SQL データベースに対する脆弱性からアプリケーションを保護するために準備されたルールです。データベースを利用する環境では基本ルールとして導入することを推奨します。                                                                                                                                                         | ◎    |
| Linux operating system                     | 200          | ローカルファイルインクルージョンなど Linux の環境に絞り込んだルールです。Linux の環境でサーバ上で Web アプリケーションを稼働している場合は導入を検討します。                                                                                                                                                                                      | △    |
| POSIX operating system                     | 100          | ローカルファイルインクルージョンなど POSIX 系の OS 向け構成したルールです。Web アプリケーションを稼働している場合、導入を検討します。                                                                                                                                                                                                             | △    |
| Windows operating system                   | 200          | Powershell コマンドを利用したコマンドインジェクション攻撃や Windows OS に関連する脆弱性からアプリケーションを保護するために構成されたルールで、Windows OS でアプリケーションを構成している環境では導入を推奨します。                                                                                                                              | △    |
| PHP application                            | 100          | PHP に対する脆弱性や攻撃を検知する目的で作られたルールで、アプリケーションの性質から導入を検討します。                                                                                                                                                                                                                                            | ▲    |
| Wordpress application                      | 100          | Wordpress に関連する脆弱性に対応したルールです。Web アプリケーションを WordPress で構築している環境においては実装することを推奨します。                                                                                                                                                                                                           | ▲    |
| Amazon IP reputation list                  | 25           | AWS が収集した脅威 IP アドレスのリストで、悪質なボットなどを防ぐことができるルールです。Web サイトを保護するための基本ルールとして導入することを推奨します。                                                                                                                                                                                      | ◎    |
| Anonymous IP list                          | 50           | Tor や匿名でアクセスするためのプロキシーサービスの IP リストによる攻撃を防ぐことができるルールです。これらの IP リストからのアクセスは攻撃の可能性が高いですが、攻撃を目的としたものではなく、プライバシー保護を目的として利用するユーザーがいる場合もありますので、不特定対数のユーザーがアクセスするサイトでは利用するか検討した方が良い。(\*2) | ◎    |
| Bot Control                                | 50           | このルールは有償です。サイトに合わせて許可するボット、拒否するボットをコントロールすることができます。                                                                                                                                                                                                                                            | -    |
| Account Takeover Prevention(ATP)\*3        | 50           | このルールは有償です。クレデンシャルスタッフィング攻撃、ブルートフォース試行、その他の異常ログインアクティビティからアプリケーションのログインページを保護することができます。                                                                                                                                                                    | -    |
| Account Creation Fraud Prevention(ACFP)\*4 | 50           | このルールは有償です。偽アカウントや不正アカウントの作成を防ぐことができます。                                                                                                                                                                                                                                                                    | -    |

\*1 [OWASP Top Ten Project](https://owasp.org/www-project-top-ten/)

\*2 Anonymous IP list を利用すると、その中に含まれる[HostingProviderIPList]というルールによって AWS 内からのアクセスも遮断されます（それ以外も悪用されやすい GCP などのクラウドサービスの IP からも遮断している可能性もあります）。セキュリティテストなどで AWS インスタンスからアクセスさせたい場合、Anonymous IP list のスコープダウンに「ホワイトリストに一致しない場合」というのを付与して除外するとよい。

\*3 [Account Takeover Prevention(ATP)(Feb 14, 2022)](https://aws.amazon.com/jp/about-aws/whats-new/2022/02/aws-waf-fraud-control-login-credential-attacks/)

\*4 [Account Creation Fraud Prevention(ACFP)(Jun 13, 2023)](https://aws.amazon.com/jp/about-aws/whats-new/2023/06/aws-waf-fraud-control-account-creation-prevention-pricing/)

#### AWS Marketplace マネージドルールグループ

セキュリティベンダーが提供するルールセットです。それぞれのルールセットごとに料金が異なります。

![waf-marketplace-rules-1](/images/waf/waf-marketplace-rules-1.jpg)

![waf-marketplace-rules-2](/images/waf/waf-marketplace-rules-2.jpg)

#### 独自のルールグループ

独自のルールをまとめて名前を付けておくことで、再利用可能にしたものです。
作成するルールグループには、WebACL と同様の WCU の上限があります。

### ログ

Duration: 0:05:00

#### ログ出力

ログ記録を有効にすることで、CloudWatch Logs ロググループ、S3、 Kinesis Data Firehose に送信することができます。

#### ログフィールド

[ログフィールド](https://docs.aws.amazon.com/ja_jp/waf/latest/developerguide/logging-fields.html)

出力されるログフィールドの主なものは次のとおりです。

- action
  - 終了アクション
- terminatingRule
  - リクエストを終了したルール。追加情報によって、どういう理由で Block されたのかが分かる。
    - ruleMatchDetails
- terminatingRuleMatchDetails
  - リクエストに一致した終了ルールに関する詳細情報

#### ログの分析

WAF のログは Athena を使うことで分析がしやすくなります。

[AWS WAF ログのクエリ](https://docs.aws.amazon.com/ja_jp/athena/latest/ug/waf-logs.html)

次のようなクエリを実行することでデータを抽出することができます。

- BLOCK されたアクセスを検索する

```sql
SELECT from_unixtime(timestamp/1000) as date, *
FROM waf_logs_partitioned
WHERE action = 'BLOCK'
ORDER BY timestamp desc
```

- 期間を限定して検索する

```sql
SELECT from_unixtime(timestamp/1000) as date, *
FROM waf_logs_partitioned
WHERE action = 'BLOCK'
  AND from_unixtime(timestamp/1000)
     BETWEEN parse_datetime('2022-06-22-02:00:00','yyyy-MM-dd-HH:mm:ss')
     AND parse_datetime('2022-06-22-02:59:59','yyyy-MM-dd-HH:mm:ss')
ORDER BY timestamp desc
```

## 📖 AWS WAF のまとめ

![waf](/images/all/waf.png)
