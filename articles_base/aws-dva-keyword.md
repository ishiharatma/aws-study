# DVA

## Lambda

- Java、Go、PowerShell、Node.js、C#、Python、Ruby
- C言語の場合は、カスタムランタイムでレイヤーを作成
- 環境変数の暗号化
  - [保管データ暗号化](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/security-dataprotection.html)
  - 保管時はデフォルトで KMS キーによって暗号化されている
- [転送時の暗号化](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/security-dataprotection.html#security-privacy-intransit)
  - 環境変数を使用する場合、コンソール暗号化ヘルパーを有効にして、クライアント側の暗号化で転送中の環境変数を保護
- 一時ファイルは、`/tmp`
  - 最大容量は、10GB
- デッドレターキュー
  - 非同期呼び出し処理の試みが 3 回 とも失敗
  - SQS との連携で複数回失敗した場合に失敗したキューを別のキューに入れて再処理する
  - DeadLetterConfig で設定
- 同時実行制御
  - 同時実行=（1秒あたりの呼び出し数）x（平均実行時間（秒））
    - 関数が平均10秒かかり、1秒あたり100個のイベントを発行⇒同時実行1000
- エイリアス
- ベストプラクティス
  - Lambda ハンドラーをコアロジックから分離
  - ランタイムを必要最低限にしてサイズを小さく
  - レイヤー使う
  - 再帰呼び出ししない
  - 環境変数を使う
  - 冪等性のコード

## API Gateway

- API 統合タイプ
  - AWS
    - Lambda統合
    - デフォルトでは、クライアントから連携されたリクエストが Lambda に渡されない。
    - マッピングテンプレートでリクエストのパラメータのどれを何という名前で Lambda に渡すかを定義しなければならない
  - AWS_PROXY
    - Lambdaプロキシ統合ともいう
    - クライアントから連携されたリクエストを Lambda に渡す
    - Lambda からは決められたレスポンス形式を返却する必要がある。
    - 形式が間違っていると、`502: Internal server error` となる
  - HTTP
    - バックエンドが HTTP エンドポイントとなる
    - Lambda ではない点以外は、統合タイプ:AWS と同じ
  - HTTP_PROXY
    - バックエンドが HTTP エンドポイントとなる
    - Lambda ではない点以外は、統合タイプ:AWS_PROXY と同じ
  - MOCK
    - API のテスト
    - バックエンドにリクエストを送信せずにレスポンスを返す
- CORS
- メトリクス
  - IntegrationLatency: バックエンドの処理時間
  - Latency: API 全体
- 504: Gateway Timeoutエラーが発生する
  - Lambda の実行時間 29秒を超えていないか
- オーソライザー
  - Lambda
    - Lambda 関数を使用してアクセス制御を行う
    - リクエストパラメータベース
  - Cognito
    - Cognito ユーザープールを使用してアクセス制御を行う
- 使用量プラン
  - 外部との連携などで、リクエスト可能な回数を設定できる

## Cognito

- ユーザープール
  - MFA の設定
  - ID トークンの発行（JWT：JSON Web Token）
- ID プール
  - ゲストユーザー (未認証) と認証してトークンを受け取ったユーザーに一時的な AWS 認証情報（AWS STS）を提供
  - GetSessionToken
- Cognito Sync
  - WEBアプリとモバイルデバイスを同期
  - デバイスがオフライン時でもローカルにデータキャッシュできる
  - AppSync が後継サービス

## S3

- SSE-S3
  - S3 デフォルト
  - リクエストヘッダー
    - `x-amz-server-side-encryption: AES256`
- SSE-KMS
  - KMS のキーを使う
  - リクエストヘッダー
    - `x-amz-server-side-encryption: aws:kms`
    - `x-amz-server-side-encryption-aws-kms-key-id: arn:aws:....`
- SSE-C
  - 独自の暗号化キー
  - リクエストヘッダー
    - x-amz-server-side-encryption-customer-algorithm
    - x-amz-server-side-encryption-customer-key
    - x-amz-server-side-encryption-customer-key-MD5
- サーバーアクセスログ
  - アクセス数に比例してストレージ容量Up
- IAM ユーザーに S3 の個人スペースを提供する
  - IAM グループに 動的変数で IAM ポリシーを

## ECS

- タスク配置戦略
  - binpack
    - EC2インスタンス数が最小となるように配置
  - random
    - ランダムで
  - spread
    - インスタンス、AZに均等に配置
    - "field": "attribute:ecs.availability-zone"
    - "field": "instanceId"
- ECS タスクに IAM ロールを付与するには、`ECS_ENABLE_TASK_IAM_ROLE =True`

## X-Ray

- トレース
  - 一連のリクエストの単位
- セグメント
  - X-Ray データを送信するサービスや、SDKやX-Rayデーモンを利用した場合に作成される情報の単位
- サブセグメント
  - 独自で X-Ray データを送信できないサービス（DynamoDB）などを呼び出した際に、作成される情報の単位
- 注釈（Annotations）
  - フィルタするときに使うインデックスで、Key-Value形式
  - １つのトレースで50個まで
  - 自動的に追加されるが、SDK利用時には独自に作成可能
- メタデータ
  - 追加情報
  - インデックスは作成されないので、フィルタに使うことはできない
- X-Ray のトレースデータ送信に必要なアクセス権限は
  - `AWSXrayWriteOnlyAccess`
  - `AWSXRayDaemonWriteAccess`
    - サンプリングルールの使用も含まれる
- Lambda
  - コンソールで X-Ray アクティブトレースをオン
  - 実行ロールでトレースデータ送信の権限付与
  - デバッグに必要な環境変数
    - _X_AMZN_TRACE_ID
    - AWS_XRAY_CONTEXT_MISSING
      - 例外のスロー
    - AWS_XRAY_DAEMON_ADDRESS
      - X-Ray デーモンリスナーのホストとポートを設定
- その他環境変数
  - AWS_XRAY_LOG_LEVEL
  - AWS_XRAY_TRACING_NAME
- ECS
  - サイドカーで X-Ray デーモンを実行。公式のイメージあり。
  - タスクロールで、トレースデータ送信の権限付与
- EC2
  - X-Ray デーモンをインストール
  - 起動時にインストールされるようにするには、ユーザーデータにスクリプト記述
  - インスタンスプロファイルでトレースデータ送信の権限付与
- API Gateway
  - 「X-Rayトレースを有効にする」にチェック
  - 権限などの設定は不要

## CloudFormation

- テンプレート構成要素
  - Parameters
    - 任意
    - 実行時にテンプレートに渡すパラメータ
  - Conditions
    - 任意
    - 条件判定に使う変数を作成する
  - Mappings
    - 任意
    - Key-Value の名前付き
    - マッピングから値を取り出すには、`Fn::FindInMap: [ MapName, TopLevelKey, SecondLevelKey ]`
  - Resource
    - 必須
    - リソースの定義
    - 作成したリソースの属性を取得するときは、`Fn::GetAtt`
    - アカウントID を参照したいときは、`AWS::AccountId`
    - Lambda を記述したい場合
      - コードに依存関係がない場合は直接コードを記述
        - Code: ZipFile: |　～
      - zip にして S3 にアップロード
        - Code: S3Bucket: 、 S3Key:
        - PackageType: Zip
      - コンテナイメージ
        - Code: ImageUri:～
  - Outputs
    - 任意
    - 他のテンプレートで使用するために Key-Value 形式でエクスポート
    - 使用するには、`Fn::ImportValue`
- StackSet
  - 複数アカウントに同じ設定を実行したいとき

## SAM

- テンプレート
  - Transform: AWS::Serverless-2016-10-31
  - AWS::Serverless::Function
  - AWS::Serverless::Api
  - AWS::Serverless::SimpleTable
- sam package
  - アプリケーションをパッケージ化、zip にして S3 にアップロード
- sam deploy
  - アプリケーションをデプロイ
- 以前は、sam package ⇒ sam deploy が必要だったが、sam deploy 一発でデプロイが可能

## CodePipeline

- CodeCommitにコミット後、デプロイ前にコードレビューが必要なとき
  - パイプラインに承認ステージを追加し、SNSで通知

## CodeBuild

- buildspec.yml
- ビルド出力アーティファクトを暗号化するには、
- ECR にプッシュ失敗するときは、CodeBuild サービスロール（IAMロール）を見直し
- timeoutInMinutesOverride
  - ビルドをキューに入れてからタイムアウトするまでの時間
  - ビルドが長すぎる場合
- buildspec.ymlのエラーを確認したい場合、ローカル実行
  - [AWS CodeBuild エージェントを使用してビルドをローカルで実行](https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/use-codebuild-agent.html)
  - Docker が必要

## CodeDeploy

- appspec.yml
- インプレイスデプロイ
  - EC2, オンプレのみ
  - デプロイフックの実行順序(⇒[デプロイでのフックの実行順](https://docs.aws.amazon.com/ja_jp/codedeploy/latest/userguide/reference-appspec-file-structure-hooks.html#reference-appspec-file-structure-hooks-run-order))
    - ApplicationStop
    - BeforeInstall
    - AfterInstall
    - ApplicationStart
    - ValidateService
    - BeforeAllowTraffic
    - AllowTraffic
    - AfterAllowTraffic
- Lambda のデプロイ時
  - BeforeAllowTraffic
    - デプロイされたLambda関数バージョンに移行する前
    - 新バージョンにシフトする前に SNS 通知が欲しい場合、このイベントを使う
  - AllowTraffic: 移行実施
  - AfterAllowTraffic: デプロイされたLambda関数バージョンに移行した後
- デプロイグループ
  - デプロイ先のインスタンスの集合とデプロイの設定をまとめたもの
- デプロイ失敗例
  - [エラーコード](https://docs.aws.amazon.com/ja_jp/codedeploy/latest/userguide/error-codes.html)
- 自動ロールバック失敗
  - [CodeDeploy を使用してデプロイを再デプロイしてロールバックする](https://docs.aws.amazon.com/ja_jp/codedeploy/latest/userguide/deployments-rollback-and-redeploy.html)
  - ロールバックする場合、新しいデプロイとして以前のバージョンに戻す
  - デプロイ ID は新しくなる

## DynamoDB

- パーティションキー
  - 分散して配置するためのキー
  - テーブルに１つ
  - カーディナリティの高い属性を選ぶ
- ソートキー
  - 範囲の指定やソートを行うため
- プライマリキー
  - 「パーティションキー」または、「パーティションキーとソートキーの複合キー」
- GSI（グローバルセカンダリインデックス）
  - プライマリキーとは異なる属性で作成する
  - あとから追加できる
- LSI（ローカルセカンダリインデックス）
  - パーティションキーは同じでソートキーが異なるもの
  - テーブル作成時のみ
- キャパシティ
  - 1 RCU
    - 4 KBの項目に対して、結果整合性のある読み取りの場合 2回/秒、強い整合性のある読み取りの場合 1回/秒
  - 1 WCU
    - 最大 1KB の項目に対して、1回/秒の書き込み
- オンデマンドとプロビジョニング済み
  - オンデマンド
    - アクセスが読めない、RCU と WCU の見積が困難
    - アクセス数でコスト増大する
  - プロビジョニング済み
    - 予め RCU と WCU を見積もれる、安定したアクセス
    - 予め決めたキャパシティを超えるとスロットリング（一時的なキャパシティ不足）が発生
    - Auto Scaling を設定することで回避できるが、即応性はない
- クエリとスキャン
  - `Scan` は全件走査なので RCU への影響が大きい
  - プライマリキーに基づいて検索する `GetItem`, `BatchGetItem` への変更も検討する
  - `BatchGetItem` は大量に取得する際のパフォーマンス向上に
  - `Scan` でパフォーマンスアップしたい場合は、並列スキャン
  - 特定の属性のみを取得したい場合は、`--projection-expression`
- 書き込みスルー
  - データベースに値が書き込まれるときに最新化する
  - 使われないデータもキャッシュ
- 遅延読み込み
  - リクエストされたデータだけキャッシュされる
  - キャッシュには最低限
- ProvisionedThroughputExceededExceptionが発生した
  - アプリケーションからのリクエストでExponential Backoffを使用
  - Exponential Backoff（エクスポネンシャルバックオフ）とは、連続した衝突を防ぐためにジッター (ランダム化された遅延) を使用する
    - 通信装置には古くからあるアルゴリズムでデータ送信時のコリジョン（衝突）を検知したら一定時間待機して再送に使われる
- TTL
  - 有効期限
- アトミックカウンター
  - UpdateItem
  - 訪問者数をカウントするケースなど

## ElastiCache

- Redis
  - シングルスレッド
  - 複雑な集計もできる
  - レプリケーションや自動フェールオーバー
  - [Redis AUTH](https://docs.aws.amazon.com/ja_jp/AmazonElastiCache/latest/red-ug/auth.html)
- Memcached
  - マルチスレッド

## SQS

- FIFO キュー
  - 順番に処理したい場合
- 可視性タイムアウト
  - キューから処理された後、一定時間非表示にできる
  - 他のコンシューマーから読み取れない
    - メッセージ処理に失敗した後、他のコンシューマーから読み取れないときの対処は？と聞かれたら可視性タイムアウトの時間を調整
  - デフォルト 30秒
  - 0秒 ～ 12時間
- 保持期間
  - キューにメッセージが保存されている期間
  - デフォルト 4日
  - 1分～14日
- 遅延キュー
  - キューが追加された直後、一定時間非表示にできる
  - キューに配信されてからすぐに処理したくない場合
  - コンシューマー側で待機処理をしなくてもよい
- ロングポーリング
  - 最大で 20秒間待機する
  - 0件多発するような場合、ロングポーリングでコスト削減
- ショートポーリング
  - ポーリングしたタイミングでデータがなければ終了
  - ポーリング回数が増えるのでコスト増、0件多発ならロングポーリングを検討
- メッセージ重複削除ID
  - 5分以内は同じIDが入らなくなる
- 一度に10件まで取得
- メッセージは 256KB
  - サイズの大きいメッセージは、SQS 拡張クライアントライブラリ

## Kinesis Data Streams

- ストリーミングデータを収集されて70〜200ミリ秒以内に、配信できる
- シャード
  - ストリーム内のデータレコードの一意に識別されたグループ
  - 配信データが多い場合はシャードを増やす
  - 少ない場合は減らす
- ストリームデータの暗号化
  - KMS による保存データの暗号化
  - HTTPS エンドポイント
- プロデューサーから二重送信
  - レコード内に主キーを
  - [プロデューサーの再試行](https://docs.aws.amazon.com/ja_jp/streams/latest/dev/kinesis-record-processor-duplicates.html#kinesis-record-processor-duplicates-producer)
- AWS Application Auto Scaling
  - シャードを自動的に追加・削除するスケーリングポリシーを定義
- ProvisionedThroughputExceededException
  - シャードあたりの書き込み制限に引っかかっていないか
    - 1000 records/second
    - 1 MB/second
    - レコードの制限
      - 1 MB/record(base64エンコード前)
      - 5 MB/transaction(PutRecords の場合)
      - 500 records/transaction(PutRecords の場合)
    - `PutRecords` でまとめて送信で回避できないか
  - シャードあたりの読み込み制限に引っかかっていないか
    - 2 MB/second
    - レコードの制限
      - 1 MB/record
      - 10000 records/transaction
      - 10 MB/transaction
  - [Kinesis Data Streams の ReadProvisionedThroughputExceeded 例外を検出してトラブルシューティングするにはどうすればよいですか?](https://aws.amazon.com/jp/premiumsupport/knowledge-center/kinesis-readprovisionedthroughputexceeded/)

## Kinesis Data Firehose

- リアルタイムのストリーミングデータをS3やRedShift、Elasticsearchなどのデータストア、分析ツールに配信する

## Kinesis Data Analytics

- Kinesis Data Streams, Amazon Kinesis Data Firehose ストリーミングソースからのデータ取り込み、標準SQLでストリーミングデータの処理、分析が可能

## Elastic Beanstalk

- Java,PHP,Ruby,Python,Node.js,.NET,Docker,Goなどに対応
- アプリケーション
  - 最上位の構成単位
- バージョン
  - デプロイ可能なコード
- 環境
  - env.yaml
  - cron.yaml
    - 定期的なジョブ定義
- 環境設定
  - .ebextensionsディレクトリに、xxx.conf を配置
- デプロイメント
  - Rolling Deploy
    - ダウンタイムあり
      - All at once
        - 全部一気に入れ替える
        - 展開までに一番時間がかからない
      - Rolling
        - 新旧インスタンスが混在
        - 一定数量のインスタンスにデプロイ...を繰り返す
    - ダウンタイムなし：インスタンスの実行数(総容量)を維持したまま
      - Rolling with additional batch
        - 新旧インスタンスが混在
        - 新インスタンスにデプロイ
        - 一定数量のインスタンスにデプロイ...を繰り返す
      - Immutable
        - 新旧インスタンスが混在
        - 新インスタンスにデプロイ後、テスト
      - Taffic splitting
        - カナリアデプロイ
  - Blue/Green Deployment
- X-Ray 使う
  - Elastic Beanstalk コンソールで　`X-Ray デーモン` を有効に設定
  - .ebextensionsディレクトリに、xxx.conf を配置

## AWS Systems Manager

- パラメータストア
  - 設定データ管理とシークレット管理のための安全な階層型ストレージ
  - 無料
  - デフォルトのスループット: 40/秒（引き上げ可⇒引き上げ中は課金）
  - [AWS Systems Manager クォータ](https://docs.aws.amazon.com/ja_jp/general/latest/gr/ssm.html#limits_ssm)
  - ローテーションが不要で無料範囲のスループットで良い場合は、シークレットよりパラメータストアのほうがコスパがよい。

## AWS Secrets Manager

- シークレット
  - データベースの認証情報、API キー、その他のシークレットをそのライフサイクルを通して容易にローテーション、管理、取得
  - ローテーションが必要ならパラメータストアより、シークレット。
  - デフォルトのスループット:10,000/秒（引き上げ不可）
  - [Secrets Manager のクォータ](https://docs.aws.amazon.com/ja_jp/secretsmanager/latest/userguide/reference_limits.html#quotas)

## Perfect Forward Secrecy (PFS)

- CloudFront と ELB
