---
title: "ECS Fargate CI/CDにAmazon Bedrockの並列コードレビューゲートを組み込む"
emoji: "🚦"
type: "tech"
topics: ["aws", "cdk", "bedrock", "codepipeline", "ecs"]
published: false
---

## はじめに

本記事は、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しております。記載の誤り等が含まれる場合がございますので、最新情報は AWS 公式ドキュメントをご参照ください。

![Level 300](https://img.shields.io/badge/Level-300-orange?style=flat-square)

CodeCommit → CodePipeline で ECS Fargate にデプロイする一般的な CI/CD に、Amazon Bedrock による「エージェント風」コードレビューをゲートとして挟んだリファレンス実装です。security・infra/ops・code quality・cost の4観点で push ごとの `git diff` を並列レビューし、集約したリスクが高ければパイプラインをそこで止めます。

📁 コードは [ecspresso-bedrock-review](https://github.com/ishiharatma/aws-cdk-reference-architectures/tree/main/infrastructure/workspaces/ecspresso-bedrock-review) に置いています（[AWS CDK Reference Architectures](https://github.com/ishiharatma/aws-cdk-reference-architectures) の一部です）。

この記事では設計の要点と、検証中に見つかった知見を中心にまとめます。

## 全体像

パイプラインの流れは次の通りです。

![ecspresso-bedrock-review アーキテクチャ概要](https://raw.githubusercontent.com/ishiharatma/aws-cdk-reference-architectures/main/infrastructure/workspaces/ecspresso-bedrock-review/overview.png)

Test で通常のユニットテストを済ませた後、Build では Docker イメージのビルドに続けて Trivy による脆弱性スキャンを実行し、HIGH/CRITICAL が見つかった時点で ECR への push 自体をブロックします。検知結果はオプションで AWS Security Hub にも取り込むことができます。

Deploy の手前に挟む AgenticReview ステージでは、security・infra/ops・code quality・cost の4つの観点から Bedrock を並列に呼び出します。
それぞれ `riskLevel` と `findings` を返すので、最も高い `riskLevel` を全体の判定として採用します。設定した閾値（既定は high）以上であればビルドを失敗させ、デプロイに進ませません。Trivy が拾うのは CVE データベースに載っている既知の脆弱性ですが、Bedrock のレビューは「この変更の設計や実装判断として妥当か」というコードの中身そのものを見ます。片方がもう片方の代わりになるわけではなく、性質の異なる2段のチェックを両方通した変更だけがデプロイまで進む構成です。

サンプルアプリは [ecspresso](https://github.com/kayac/ecspresso) と jsonnet でデプロイします。このワークスペースには対応する ECS クラスタが無いため、Deploy ステージは AWS API を呼ばない `ecspresso render` までに留めています。実クラスタに接続する手順は README にまとめています。

## 設計のポイント

### CodeCommitのスナップショットには履歴が残らない

`CodeCommitSourceAction` がパイプラインに渡すのは、その時点のスナップショットだけです。チェックアウトした先には比較対象になる親コミットが存在しないため、AgenticReview ステージは自前でリポジトリをもう一度 `codecommit::` プロトコルで、今度は履歴付きで clone し、`HEAD` と `HEAD~1` の差分を取り直しています。Source ステージで一度チェックアウトしているのに、もう一度 clone するのは無駄に見えますが、本物の `git diff` を計算するにはこの手順が必要です。

### ゲートの正体はCodeBuildの終了コードだけ

リスク判定の結果、閾値を超えていた場合にやっていることは、レビュー用スクリプトの中で非ゼロの終了コードを返すだけです。カスタムの CodePipeline アクションも、判定用の Lambda も挟んでいません。CodeBuild が非ゼロ終了をアクションの失敗として報告し、CodePipeline がそこで実行を止める、というごく普通の CI/CD の仕組みに乗せているだけです。レビューに使う Bedrock のモデルは環境変数で切り替えられるので、別世代の Claude やクロスリージョン推論プロファイルを試す際もコード変更は要りません。

### レビュー結果はどこに残るか

手動承認アクションの補足情報欄は CloudFormation テンプレートに焼き込まれる静的な文字列で、実行のたびに変わる値を渡せません。そのため、レビュー結果は CodeBuild のログ、`agentic-review-report.json` として出力するパイプラインアーティファクト、そしてオプトインの SNS 通知という3箇所に分けて残す設計にしています。承認者が判断前にレビュー内容を確認できるのは、実質的に SNS 通知だけです。

## 実機デプロイで見えた3つの知見

実装してテストを通すところまでは想定通りでしたが、実際にアカウントへデプロイし、CodeCommit へ push してパイプラインを最後まで動かしてみると、テストだけでは見えない問題がいくつか出てきました。ここでは汎用性が高い3点に絞って紹介します。

### 1. クロスリージョン推論プロファイルはIAMリソースのリージョンを固定してはいけない

最初に `global.anthropic.claude-*` のようなクロスリージョン推論プロファイルで `bedrock:InvokeModel` を呼んだところ、権限不足で失敗しました。IAM ポリシーはスタックのリージョン（`ap-northeast-1`）に対する `foundation-model` ARN だけを許可していたのですが、推論プロファイルの一覧を確認すると、`global.*` プロファイルの実体は**リージョン部分が空の** ARN（`arn:aws:bedrock:::foundation-model/...`）に解決されていました。

空リージョンを許可するよう直したところ、今度は `jp.*` プロファイルで別のリージョン（`ap-northeast-3`、大阪）を指す ARN に対する拒否が出ました。つまりクロスリージョン推論プロファイルは、呼び出すたびに実際のルーティング先が変わり得るということです。特定のリージョンを列挙する形では対応しきれないため、最終的に `foundation-model` リソースのリージョン部分は `*` でワイルドカード化し、モデル ID の部分でスコープを絞る形に落ち着きました。推論プロファイル自体（`inference-profile` リソース）はスタックのリージョンに限定したままにしています。

### 2. デフォルトのトリガーと自作のEventBridgeルールが二重に発火していた

CodeCommit へ1回 push しただけなのに、パイプラインの実行履歴を確認すると、トリガーによる実行がほぼ同時刻に2件作成されていました。Bedrock の呼び出し回数がそのまま倍になるため、気づかずに放置するとコストが無駄に積み上がります。

原因は単純で、`CodeCommitSourceAction` は trigger を指定しないと既定で EVENTS になり、push を検知する EventBridge ルールをアクション自身が自動生成します。今回はそれとは別に、同じ参照更新イベントを拾う EventBridge ルールを CDK 側で明示的に作っていたため、同じ push に対して2つのルールが同時に反応していました。アクション側のトリガーを NONE にして、自作したルールだけをトリガー源にすることで解消しています。CodePipeline を独自の EventBridge ルールで起動する構成にしている場合は、アクション側のデフォルトトリガーが生きたままになっていないか確認する価値があります。

### 3. レビューが自分自身のバグを検出した

検証の途中で、`ecspresso` のインストール処理に別のバグ（GitHub の最新リリースアセット名が実際にはバージョン番号を含むのに、それを無視した固定 URL からダウンロードしていた）を見つけて修正コミットを push しました。この commit を AgenticReview ステージ自身がレビューし、ダウンロードしたバイナリにチェックサム検証が無いこと、GitHub API 呼び出しが未認証でレート制限に弱いこと、API 呼び出し失敗時のエラーハンドリングが無いことを、いずれも medium 判定で指摘してきました。

3点とも的確な指摘だったので、`set -e` と空タグ時のガード、チェックサムによる検証を追加してから再度パイプラインを通し、問題なく動くことを確認しました。あらかじめ仕込んだデモ用の不具合ではなく、検証中にたまたま紛れ込んだバグを AgenticReview 自身が検知しました。狙って用意したわけではなかっただけに、このパターンがきちんと機能していることを実感できた出来事でした。

## コスト感

| 項目 | コストドライバー | 備考 |
| --- | --- | --- |
| Bedrock `InvokeModel` | パイプライン1回あたり4呼び出し × 入出力トークン | diff のサイズとモデル選択に比例。Haiku 系のモデルはこの用途では Sonnet/Opus 系より大幅に安い |
| CodeBuild | Test + Build + AgenticReview + Deploy の実行時間 | Docker ビルド以外は SMALL コンピュートタイプで足りる |
| CodeCommit / CodePipeline / SNS / EventBridge / SSM | デモ規模ではほぼ無視できる水準 | 標準的な低ボリューム料金 |

常駐する EC2 や RDS、NAT ゲートウェイが無い構成なので、コストは固定インフラよりも Bedrock の呼び出し回数とトークン量に左右されます。金額は必ず [AWS Pricing Calculator](https://calculator.aws/) と [Amazon Bedrock の料金ページ](https://aws.amazon.com/bedrock/pricing/) で見積もってください。

## まとめ

疑似マルチエージェントレビューの正体は、独立した Bedrock 呼び出しを並列実行して、リスクレベルの順位付けで集約するだけのシンプルな仕組みでした。ブロッキングゲートも、CodeBuild の終了コードという CI/CD の中で一番素朴なプリミティブに乗せています。凝った仕組みを積み上げなくても、レビューという判断のプロセスさえ用意すれば、既存の CI/CD の枠組みでブロッキングは実現できます。

一方で、クロスリージョン推論プロファイルの IAM リソース設計や、CodeCommit のトリガー重複のように、実際にアカウントへデプロイして動かして初めて見える問題も複数ありました。スナップショットテストやコードレビューだけでは拾いきれない部分なので、この規模のパイプラインでも一度は実機で push から Deploy まで通しておく価値はあると感じています。

## 参考リンク

- [AWS CodePipeline User Guide](https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html)
- [AWS CodeBuild User Guide](https://docs.aws.amazon.com/codebuild/latest/userguide/welcome.html)
- [Amazon Bedrock Runtime - Converse API](https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html)
- [Trivy と AWS Security Hub を使ったコンテナ脆弱性スキャン CI/CD パイプラインの構築方法](https://aws.amazon.com/jp/blogs/security/how-to-build-ci-cd-pipeline-container-vulnerability-scanning-trivy-and-aws-security-hub/)
- [ecspresso](https://github.com/kayac/ecspresso)
- [ソースコード（GitHub）](https://github.com/ishiharatma/aws-cdk-reference-architectures/tree/main/infrastructure/workspaces/ecspresso-bedrock-review)
