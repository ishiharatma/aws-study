# xx（xx）

## はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## xx とは

【AWS Black Belt Online Seminar】[xx(YouTube)](xxx)(1:00:33)

![xx](/images/xx/)

[xx サービス概要](https://aws.amazon.com/jp/xx/)

[xx ドキュメント](https://docs.aws.amazon.com/ja_jp/xx/?id=docs_gateway)

[xx よくある質問](https://aws.amazon.com/jp/xx/faqs/)

## xx の基本

Duration: 0:01:30


## 試験ラボ対策

### Amazon VPC

- 標準的なVPC（マルチAZ、複数プライベートサブネット、複数パブリックサブネット）の作成
- VPCフローログの設定
- VPC エンドポイント

①VPC作成
②別AZにパブリックサブネット作成x2
③インターネットゲートウェイ作成→VPCにアタッチ
④②のルートテーブルにインターネットゲートウェイ追加
⑤別AZにプライベートゲートウェイ作成
⑥フローログを許可するIAMポリシー作成　CloudWatch系の許可
⑦⑥でIAMロールを作成　信頼関係をvpc-flow-logs.amazonaws.comに設定
⑧CloudWatchからロググループの作成
⑨該当VPCからフローログ作成　⑦と⑧を使う

ハンズオン
https://catalog.us-east-1.prod.workshops.aws/workshops/47782ec0-8e8c-41e8-b873-9da91e822b36/ja-JP/hands-on/phase1

Network編#1 AWS上にセキュアなプライベートネットワーク空間を作成する
https://pages.awscloud.com/JAPAN-event-OE-Hands-on-for-Beginners-Network1-2020-reg-event-LP.html?trk=aws_introduction_page
### Amazon S3

- バケットのバージョニングの設定
- デフォルトの暗号化の設定
- イベント通知の設定
- ライフサイクルルールの設定
- レプリケーションルールの設定

### S3 / クロスリージョンレプリケーション / ライフサイクルポリシー 設定
①リージョン①にバケット作成 / バージョニングを有効
②リージョン②にバケット作成 / バージョニングを有効
③リージョン①バケットで管理→レプケショーンルール作成→バケット全体+新しいロール
④管理→ライフサイクルルール→ライフサイクルルールのアクションで指定の設定

### AWS CloudFormation
- テンプレートファイルのアップロードによるスタックの更新

インスタンスタイプ、SG、ロールの変更

AWS 環境のコード管理 AWS CloudFormationで Web システムを構築する
https://pages.awscloud.com/JAPAN-event-OE-Hands-on-for-Beginners-cfn-2020-reg-event-LP.html?trk=aws_introduction_page

### Amazon CloudWatch＋Amazon SNS
- メトリクスフィルターの作成
- メトリクスフィルターを基にしたアラームの作成
- アラーム状態の変化によって通知を送信するSNSトピックの作成
- 出力確認としてコンソールに入り「sudo ifdown eth0」

①SNSでトピック作成（スタンダードにしてEmail）→認証する
②インスタンス→ステータスチェック→アラート作成
③①で作ったARNをいれてアラートを作成（CloudAatchAlarm）
④出力確認としてコンソールに入り「sudo ifdown eth0」

### AWS Lambda＋Amazon EventBridge

- EventBridgeルールによるLambda関数の呼び出し

### Amazon EC2＋AWS Auto Scaling＋Elastic Load Balancing

上記構成の作成