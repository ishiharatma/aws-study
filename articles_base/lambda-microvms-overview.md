# AWS Lambda MicroVMs<!-- omit in toc -->

![icon](/images/icons/64/Arch_AWS-Lambda_64.png)

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

- [AWS Lambda MicroVMs とは](#aws-lambda-microvms-とは)
- [Event Functions の実行環境との違い](#event-functions-の実行環境との違い)
- [基盤技術：Firecracker](#基盤技術firecracker)
- [主な特徴](#主な特徴)
  - [VM レベルの分離](#vm-レベルの分離)
  - [スナップショットベースの高速起動](#スナップショットベースの高速起動)
  - [状態の保持とサスペンド／レジューム](#状態の保持とサスペンドレジューム)
  - [ネットワーク制御](#ネットワーク制御)
- [作成から接続までの流れ](#作成から接続までの流れ)
- [Amazon Bedrock AgentCore との違い](#amazon-bedrock-agentcore-との違い)
- [ユースケース](#ユースケース)
- [実装例](#実装例)
- [料金](#料金)
- [利用可能リージョン](#利用可能リージョン)
- [メリット](#メリット)
- [デメリット・注意点](#デメリット注意点)
- [📖 まとめ](#-まとめ)

## AWS Lambda MicroVMs とは

2026 年 6 月に発表された、Lambda の新しいコンピュートプリミティブです。ユーザーが実行するコードや AI エージェントが生成したコードなど、信頼できないコードを安全に隔離して実行するためのサンドボックス環境を、インフラ管理なしで提供します。2026 年 10 月に Web Functions が加わり、Lambda のプリミティブは Event Functions、Web Functions、MicroVMs の 3 種類になりました。違いは [AWS Lambda の 3 つのコンピュートプリミティブ比較](./lambda-event-vs-web-vs-microvms.md) にまとめています。

[AWS Lambda MicroVMs サービス概要](https://aws.amazon.com/lambda/lambda-microvms/)

[AWS Lambda MicroVMs ドキュメント](https://docs.aws.amazon.com/lambda/latest/dg/lambda-microvms-guide.html)

[Announcing Lambda MicroVMs（AWS Compute Blog）](https://aws.amazon.com/blogs/compute/announcing-lambda-microvms-serverless-compute-environments-with-vm-level-isolation-and-near-instant-startup/)

[Run isolated sandboxes with full lifecycle control（AWS News Blog）](https://aws.amazon.com/blogs/aws/run-isolated-sandboxes-with-full-lifecycle-control-aws-lambda-introduces-microvms/)

背景には、生成 AI エージェントが自律的にコードを生成・実行するユースケースの急増があります。AI が書いたコードをそのまま実行するには、予期しない挙動、プロンプトインジェクション、依存関係やサプライチェーンのリスク、過剰な IAM 権限などへの対策が必要になり、コンテナの名前空間分離だけでは不十分だと考えるケースが増えてきました。Lambda MicroVMs は、関数ごとに使い捨てのサンドボックスを用意するのではなく、ユーザーやセッションごとに専用の VM を割り当て、状態を保持したまま何度もやり取りできる点に主眼を置いています。

## Event Functions の実行環境との違い

Event Functions（従来の Lambda 関数）は、リクエスト・レスポンス型の呼び出しモデルです。実行環境（Firecracker microVM）は同一関数の複数回の呼び出しで再利用されることがありますが、これはあくまで内部的な最適化であり、アプリケーション側が状態の保持をあてにできる設計にはなっていません。関数は基本的にステートレスなものとして書くべきものです。

これに対して Lambda MicroVMs は、そもそもリクエスト・レスポンス型ではありません。ユーザー（あるいはセッション）ごとに 1 つの永続的な VM を起動し、その VM には専用の HTTPS エンドポイントが割り当てられます。アイドルポリシーを設定しておくと、アイドル状態が続いたときに自動でサスペンドされ、次のアクセス時にはメモリとディスクの状態を保持したまま高速に再開（レジューム）します。つまり、「関数を呼び出す」のではなく「セッション用の VM を持ち続ける」という発想の製品です。

両者はいずれも Firecracker という同じ仮想化基盤を使っていますが、公開される API・ライフサイクル・利用シーンはまったく異なるため、別のサービス（プリミティブ）として提供されています。

## 基盤技術：Firecracker

Firecracker は AWS が開発した OSS の仮想化技術（VMM: Virtual Machine Monitor）で、Rust で実装されています。Linux の KVM を利用しつつ、BIOS エミュレーションやレガシーデバイスサポート、GUI サブシステムなど不要な機能を削ぎ落とし、ゲストカーネルとは virtio ベースの最小限のデバイスだけで通信します。

- 起動時間は 125 ミリ秒未満
- microVM あたりのメモリオーバーヘッドは 5 MiB 未満
- 1 台のホストで毎秒最大 150 個の microVM を作成可能
- コンテナのような名前空間・cgroups による分離ではなく、VM ごとに専用のカーネルを持つため、あるカーネルの脆弱性が他のテナントに波及しない

[Firecracker（公式サイト）](https://firecracker-microvm.github.io/)

[How AWS's Firecracker virtual machines work（Amazon Science）](https://www.amazon.science/blog/how-awss-firecracker-virtual-machines-work)

Lambda MicroVMs は、この Firecracker の隔離性の強さと起動の速さを、通常の関数実行とは異なる「セッション型」の用途向けに再構成したものと理解すると分かりやすいです。

## 主な特徴

### VM レベルの分離

コンテナ実行エンジンのようにホストカーネルを共有しません。セッションごとに専用のカーネル、ファイルシステム、ネットワーク名前空間を持つため、あるセッション内でコンテナエスケープのような攻撃が成立しても、他のセッションやホスト自体には到達できません。

### スナップショットベースの高速起動

利用者は Dockerfile とアプリケーションコードを ZIP にまとめて Amazon S3 にアップロードし、Lambda の API でイメージを作成します。Lambda 側で Dockerfile を実行してアプリケーションを起動した状態のスナップショットを取得しておくため、実際に MicroVM を起動する際には、この初期化済みスナップショットから復元するだけで済み、ゼロから OS やアプリを起動するよりもはるかに高速に利用可能な状態になります。

### 状態の保持とサスペンド／レジューム

起動した MicroVM は、メモリとディスクの状態を保持したまま最大 8 時間維持できます。この 8 時間（`maximumDurationInSeconds` の上限 28,800 秒）は実行中とサスペンド中を合わせた時間です。

アイドルポリシーを設定しておくと、アイドル状態が続いたときに自動でサスペンドされ、コンピュート課金が停止します（メモリ・ディスクのスナップショットは保持されます）。再度アクセスがあった際は、保持された状態から再開します。[検証環境](https://github.com/ishiharatma/aws-cdk-reference-architectures/tree/main/infrastructure/workspaces/code-server-ec2-vs-lambda-microvms)ではサスペンド後の最初のリクエストが 0.65 秒で返りました。この特性により、対話型の AI コーディングツールやノートブック環境のように、セッションをまたいで作業状態を維持したいユースケースに向いています。

1 つの MicroVM で使えるリソースは最大 16 vCPU、32 GB メモリ、32 GB ディスクで、アーキテクチャは ARM64 です。ベースラインは既定で 1 vCPU / 2 GB、最大 4 vCPU / 8 GB まで設定でき、ピーク時はベースラインの最大 4 倍まで使えます。

### ネットワーク制御

イングレス側では、ポート単位のアクセス制御に加えて HTTP/2、gRPC、WebSocket をサポートしており、対話的なプロトコルをそのまま利用できます。エグレス側では、デフォルトでパブリックインターネットへの通信が可能で、VPC 内のプライベートリソースへアクセスしたい場合は Lambda Network Connector（LNC）を利用します。

接続時には CLI の `create-microvm-auth-token`（API は `CreateMicrovmAuthToken`）で有効期限（最大 60 分）やアクセス可能なポートを指定した認証トークンを発行し、`X-aws-proxy-auth` ヘッダーに載せて MicroVM 専用の HTTPS エンドポイント（`https://<microvm-id>.lambda-microvm.<region>.on.aws/`）へリクエストします。ロードバランサーや自前のイングレス基盤を用意する必要はありません。

## 作成から接続までの流れ

1. アプリケーションコードと Dockerfile を ZIP にまとめ、S3 にアップロードする
2. Lambda の API（イメージ作成用オペレーション）を呼び出し、Dockerfile の実行・アプリケーションの起動・初期化済み状態のスナップショット取得までを行わせる
3. 作成された MicroVM イメージから、必要なタイミングで MicroVM を起動する
4. 認証トークンを発行し、専用の HTTPS エンドポイントに対してリクエストを送る
5. アイドルポリシーを設定していれば、アイドル時に自動サスペンド、再アクセスで自動レジュームされる

[Create your first Lambda MicroVM](https://docs.aws.amazon.com/lambda/latest/dg/microvms-getting-started.html)

## Amazon Bedrock AgentCore との違い

生成 AI エージェント文脈で比較されることが多いのが Amazon Bedrock AgentCore Runtime です。

- AgentCore Runtime は、エージェントのデプロイ・セッションルーティング・スケーリング・通信プロトコル・認証などをマネージドで提供する、エージェント実行に特化したプラットフォームです。
- Lambda MicroVMs は、あくまで「VM そのもの」を提供する、より低レイヤーなコンピュートプリミティブです。どのユーザーにどの VM を割り当てるか、ライフサイクル管理、ルーティングなどは利用者側で実装する必要があります。その代わり VM 内で何を動かすかについての自由度が高く、任意のランタイムやツールチェーンを持ち込めます。

「エージェントの推論・オーケストレーションは AgentCore Runtime に任せ、生成されたコードの実行サンドボックスとして Lambda MicroVMs を使う」という組み合わせ方も考えられます。

## ユースケース

- AI コーディングアシスタントが生成したコードを、ユーザーごとに隔離された環境で安全に実行する
- 対話型の AI ノートブック（コードセルを何度も実行し、変数や中間データを保持したい）
- マルチテナント SaaS における、テナントごと・ユーザーごとの実行サンドボックス
- 脆弱性スキャナーなど、信頼できない入力（アップロードされたファイルや外部コード）を解析するワークロード
- ブラウザ操作エージェントなど、長時間セッションを維持する必要があるワークロード

## 実装例

code-server（ブラウザで動く VS Code）を題材にした CDK 実装があります。

- [code-server-ec2-vs-lambda-microvms](https://github.com/ishiharatma/aws-cdk-reference-architectures/tree/main/infrastructure/workspaces/code-server-ec2-vs-lambda-microvms): 同じ code-server を EC2 と MicroVMs の両方で動かして比較する
- [code-server-session-control-plane](https://github.com/ishiharatma/aws-cdk-reference-architectures/tree/main/infrastructure/workspaces/code-server-session-control-plane): Cognito と CloudFront でサインインし、ユーザーごとのセッションをブラウザだけで使えるようにする

## 料金

課金はコンピュート、スナップショット、データ転送の 3 つで構成されます。

コンピュートはベースラインのリソースが稼働している間、秒単位で発生します。ベースラインを超えて使用した場合は、超過分についてのみ、実際に使用した時間分の料金が加算されます。

スナップショットには、サスペンド時の書き込み、起動・レジューム時の読み込み、保管の料金がかかります。サスペンド中はコンピュート課金が止まりますが、保管料金は続きます。データ転送は標準のデータ転送料金です。

発表時の例示単価は次のとおりです。

- コンピュート: vCPU $0.0000276944 / 秒、メモリ $0.0000036667 / GB 秒
- スナップショット: 書き込み $0.0038 / GB、読み込み $0.00155 / GB、保管 $0.08 / GB-月

コンピュートの単価自体は Fargate と比較すると高めですが、アイドル時間が長いワークロードほど、サスペンドによる課金停止の恩恵が大きくなり、実効コストの差は縮まります。「ステートフルであること」と「アイドル時間が発生すること」の両方が揃うワークロードで最もコストメリットが出やすい、という指摘があります。正確な料金は必ず [AWS Lambda 料金ページ](https://aws.amazon.com/lambda/pricing/) で確認してください。

## 利用可能リージョン

2026 年 6 月の発表時点で、以下のリージョンから利用できます。

- 米国東部（バージニア北部）
- 米国東部（オハイオ）
- 米国西部（オレゴン）
- 欧州（アイルランド）
- アジアパシフィック（東京）

対応リージョンは今後拡大される可能性があるため、最新情報は AWS 公式ドキュメントで確認してください。

## メリット

- コンテナよりも強固な VM レベルの分離を、インフラ管理なしで利用できる
- スナップショットからの復元により、フル VM でありながら起動が高速
- セッション単位の状態保持により、対話的・継続的なワークロードに適している
- 専用エンドポイントとポート単位の制御により、WebSocket や gRPC のような双方向通信をそのまま扱える
- サスペンド中はコンピュート課金が止まるため、常時起動の専用インスタンスより効率的な場合がある

## デメリット・注意点

- Event Functions のようなシンプルな request/response モデルではなく、VM のライフサイクル（起動・サスペンド・レジューム・破棄）を利用者側で設計・管理する必要がある
- コンピュート単価自体は Fargate 等より高く、常時稼働に近いワークロードではコストメリットが出にくい
- 利用可能リージョンが 2026 年 6 月時点でまだ限定的
- 新しいサービスであるため、大規模運用における実績やベストプラクティスの蓄積がこれから進んでいく段階
- VPC 内リソースへのアクセスには Lambda Network Connector の設定が別途必要
- 認証トークンの有効期限は最大 60 分のため、長時間接続するクライアントでは再発行の仕組みが要る

## 📖 まとめ

Lambda MicroVMs は、「関数を素早く呼び出す」という従来の Lambda の得意分野とは異なり、「信頼できないコードを、状態を保ちながら安全に、かつ高速に動かし続ける」というニーズに応える新しいプリミティブです。AI エージェントが生成したコードの実行基盤として設計されていますが、マルチテナント SaaS のユーザーサンドボックスなど、より広いユースケースにも応用できます。Event Functions、Web Functions、Fargate、AgentCore Runtime とは役割が異なるため、ワークロードの性質（ステートの有無、アイドル時間、必要な分離レベル）に応じて使い分けることが重要です。
