---
title: "ECS Fargate CI/CDにAmazon Bedrockの並列コードレビューゲートを組み込む"
emoji: "🚦"
type: "tech"
topics: ["aws", "cdk", "bedrock", "codepipeline", "ecs"]
published: false
---# AWS CodePipeline に Agentic Code Reviewを組み込む<!-- omit in toc -->

## はじめに

CodeCommit → CodePipeline で ECS Fargate にデプロイする一般的な CI/CD に、Amazon Bedrock による「エージェント風」コードレビューを組み込んだ実装パターンです。security・infra/ops・code quality・cost の4観点で push ごとの `git diff` を並列レビューし、集約したリスクが高ければパイプラインを終了させます。

📁 コードは [ecspresso-bedrock-review](https://github.com/ishiharatma/aws-cdk-reference-architectures/tree/main/infrastructure/workspaces/ecspresso-bedrock-review) に置いています（[AWS CDK Reference Architectures](https://github.com/ishiharatma/aws-cdk-reference-architectures) の一部です）。

## 全体像

パイプラインの流れは次の通りです。

![ecspresso-bedrock-review アーキテクチャ概要](https://raw.githubusercontent.com/ishiharatma/aws-cdk-reference-architectures/main/infrastructure/workspaces/ecspresso-bedrock-review/overview.png)

`Test` ステージでユニットテストを済ませた後、`Build` ステージでは Docker イメージのビルドと Trivy による脆弱性スキャンを実行します。ここで、HIGH/CRITICAL が見つかった場合は、ECR への push 自体をブロックします。検知結果はオプションで AWS Security Hub にも取り込むことができます。

`Deploy` ステージの手前にある `AgenticReview` ステージで、security・infra/ops・code quality・cost の4つの観点から Bedrock を並列に呼び出しレビューを実施します。
それぞれ `riskLevel` と `findings` を返すので、最も `riskLevel` が高いものを全体の判定として採用します。

設定したしきい値（既定は high）以上であればビルドを失敗させ、デプロイに進めなくなります。Trivy で検出するのは CVE データベースに載っている既知の脆弱性ですが、Bedrock のレビューでは「この変更の設計や実装判断として妥当か」という観点でコードを見ます。性質の異なる2つのチェックを両方通過した場合だけデプロイが実行されます。

サンプルアプリは [ecspresso](https://github.com/kayac/ecspresso) と jsonnet を使用しています。ただ、今回の実装例では ECS クラスタへのデプロイまでは行いません。そのため、AWS API を呼ばない `ecspresso render` を実施して、`Deploy` ステージを完了します。

## 実際の動き

`develop` ブランチでパイプラインを動かした結果です。

- モデル: `global.anthropic.claude-sonnet-4-6`（クロスリージョン推論プロファイル）
- レビュー出力: 日本語（`REVIEW_LANGUAGE=ja`）
- しきい値: `high`、手動承認あり、SNS 通知あり

### 全体リスクがLOWの場合

`/api/v1/version` を返すエンドポイントを7行追加しただけのコミットです。全体リスクは LOW で、AgenticReview を通過しました。LOW でも Node.js のバージョン露出、バージョン文字列のハードコード、テスト不足などの指摘があがっています。

![LOW 判定時の CodeBuild ログ](/images/cicd-ecspresso-bedrock-review/d9480cae-log-low.png)
*CodeBuild ログ（LOW）*

![LOW 判定時の SNS 通知メール](/images/cicd-ecspresso-bedrock-review/d9480cae-mail-low.png)
*SNS 通知メール（LOW）。承認者は Approve の前にこの内容を確認できます*

### 判定がCRITICALの場合

検知デモ用のコード（[demo/inject-risky-change.js](https://github.com/ishiharatma/aws-cdk-reference-architectures/tree/main/backend/ecspresso-bedrock-review-app/demo)）で、次のような変更を混ぜたコミットを登録しました。

- AWS 認証情報と DB パスワードのハードコード
- 認証なしで、ユーザー入力をそのまま `exec()` に渡すエンドポイント
- 文字列連結で組み立てた SQL と、そのパスワード込みのログ出力
- 1リクエストで外部 HTTP を5,000回実行するエンドポイント

観点ごとの判定は次の通りです。

| 観点 | 判定 | 指摘の要点 |
| --- | --- | --- |
| セキュリティ | CRITICAL | 認証情報のハードコード、コマンドインジェクション、SQL インジェクション、認証の欠落、パスワードのログ出力 |
| インフラ/運用 | MEDIUM | レビュー呼び出しの失敗（「改善点」を参照） |
| コード品質 | CRITICAL | 上記に加えて、空の `catch` とレスポンスの二重送信、到達不能な分岐、テスト不足 |
| コスト | CRITICAL | 1リクエストで最大5,000回の逐次外部 HTTP、上限なし、結果をメモリに蓄積 |

最も高い CRITICAL が全体の判定になり、しきい値の `high` を超えたため、CodeBuild は `exit status 1` で失敗して Deploy に進みません。

![AgenticReview で失敗したパイプライン](/images/cicd-ecspresso-bedrock-review/9ebb6616-overview.png)
*AgenticReview が失敗し、Approve と Deploy は実行されない*

![CRITICAL 判定時の CodeBuild ログ](/images/cicd-ecspresso-bedrock-review/9ebb6616-log-high.png)
*CodeBuild ログ（CRITICAL）*

![CRITICAL 判定時の SNS 通知メール](/images/cicd-ecspresso-bedrock-review/9ebb6616-mail-high.png)
*SNS 通知メール（CRITICAL）*

### 承認後にデプロイ

全体リスクが LOW の場合は `Approve` ステージで待機し、承認すると `Deploy` ステージまで進みます。このワークスペースには ECS クラスタが無いため、Deploy は `ecspresso render` でタスク定義を表示するだけとなります。

![Approve で待機している実行](/images/cicd-ecspresso-bedrock-review/d9480cae-overview-1.png)
*Approve で手動承認を待つ*

![承認画面](/images/cicd-ecspresso-bedrock-review/d9480cae-approve.png)
*承認画面*

![Deploy まで完走した実行](/images/cicd-ecspresso-bedrock-review/d9480cae-overview-3.png)
*承認後、Deploy まで完走*

![ecspresso render の出力](/images/cicd-ecspresso-bedrock-review/d9480cae-deploy-log.png)
*Deploy ステージの `ecspresso render` の出力*

## メリット

### 人が読む前に一次レビューが行われる

承認者は、通知メールで「何が危ないか」「どの観点か」を把握できます。レビュー結果は CodeBuild のログ、`agentic-review-report.json` として出力するパイプラインアーティファクトに保存されます。

Trivy は CVE データベースに載っている既知の脆弱性を検知しますが、Bedrock のレビューは、`exec()` に未検証の入力を渡す、認証がない、5,000回のループが上限なしで回る、といった「実装」を指摘します。さらに、CRITICALではないがバージョン文字列のハードコードやテスト不足といった改善点が LOW で付くので、通常のレビューとしても使えます。

### 何が問題か一目で分かる

観点ごとに並列でレビューを行うため、「セキュリティは CRITICAL、コストも CRITICAL」のように、どの観点に問題があるか把握することができます。観点は `agentic-review.js` の `PERSPECTIVES` 配列を編集すれば追加・削除・文言変更ができ、レビュー出力の言語は `REVIEW_LANGUAGE`（`en` | `ja`）で切り替えが可能になっています。

### CodeBuild の終了コードで判定

リスク判定の結果、しきい値を超えていた場合はレビュー用スクリプトの中でゼロ以外の終了コードを返します。判定用 Lambda などでカスタマイズするのではなくシンプルに戻り値で判定します。

### 効果を把握する機能

`agentic-review.js` は実行されると CloudWatch メトリクスを発行します。`PipelineStack` で作成した CloudWatch ダッシュボードで効果を把握することができます。「AI レビューを入れた」だけでなく、どれくらいの頻度／何に対して／どれだけのコストで発動しているかを見ることができます。

今回作成したダッシュボードには、以下の6つを表示しました。

- 全体のリスクレベルの分布
- ブロックした回数
- 観点ごとの呼び出しエラー
- 観点ごとのレイテンシ
- 観点ごとの入力トークン数
- 観点ごとの出力トークン数

動作確認で実施した3回分の実行（MEDIUM、LOW、CRITICAL）が反映されています。

![AgenticReview のダッシュボード](/images/cicd-ecspresso-bedrock-review/drillexercises-dev-agentic-review.png)
*ウィジェット名の「daily」は既定の集計期間で、この画像は3回分が見えるよう期間を5分に変えて表示しています*

今回の実装例には組み込んでいませんが、指摘の件数、金額への換算のメトリクスも収集できます。
レビュー結果には 重要度 `findings` が入っているので、`agentic-review.js` の `buildMetricData` に、重要度別の指摘件数メトリクスを発行させれば「観点ごとの CRITICAL が何件出たか」を可視化できます。さらに、トークン数にモデルの単価を掛ければ、1回あたりの概算コストも出せます。まずは最小限のメトリクスで動かし、必要になった指標を後から足していく進め方ができます。

### 実例: レビューが自分自身のバグを見つけた

検証の途中で、`ecspresso` のインストール処理に別のバグ（GitHub の最新リリースアセット名が実際にはバージョン番号を含むのに、それを無視した固定 URL からダウンロードしていた）を検知しました。さらに、ダウンロードしたバイナリにチェックサム検証が無いこと、GitHub API 呼び出しが未認証でレート制限に弱いこと、API 呼び出し失敗時のエラーハンドリングが無いことなどを、MEDIUM 判定で指摘しました。

動作検証用に仕込んだバグ以外も発見することができました。

## PR 時のレビューとの違い

Bedrock によるコードレビューは、Pull Request に対して行う構成も取れます。
私自身、CodeCommit を使うプロジェクトにおいては、こちらの方式を使うことが多いです。PR 作成・更新をトリガーに、EventBridge と Lambda、Bedrock で PR に対して、レビューコメントを投稿する仕組みです。

| | PR 時のレビュー | パイプライン内のレビュー（本記事） |
| --- | --- | --- |
| タイミング | マージ前。人のレビューと並行して進む | デプロイの直前。コミットがパイプラインの対象ブランチに入った後 |
| 主な役割 | 早期のフィードバック。直しやすい段階で気づける | バグや脆弱性混入防止の最後の砦。デプロイを止める |
| トリガー | PR の作成・更新（EventBridge） | ブランチへの push（EventBridge → CodePipeline） |
| 実行基盤 | Lambda。起動が速く、人が待つ用途に向く | CodeBuild。パイプラインの1ステージとして動く |
| 差分の取り方 | `GetDifferences` API で PR の差分取得。clone は不要 | 履歴付きで clone し直し、`git diff` で差分取得 |
| レビュー対象 | PR 全体の差分 | 1コミットの差分（`HEAD~1` と `HEAD` の差分） |
| PR ではない変更 | 対象外（直接 push、緊急の修正など） | デプロイされるものは、すべて対象 |
| 判定と強制力 | コメントを投稿するだけ。止める仕組みは持たない | リスクレベルを判定し、終了コードでデプロイを止める |
| レビューの視点 | 複数モデル、複数観点（セキュリティ・インフラ/運用・コード品質・コスト）を並列に判定。変更パスによるコード/ドキュメントの振り分け、Knowledge Base で仕様書や ADR を参照 | 複数観点（セキュリティ・インフラ/運用・コード品質・コスト）を並列に判定。参照するのは差分のみ |
| 結果の出し方 | PR へのコメント（重要度と LGTM） | CodeBuild ログ、アーティファクト、SNS 通知 |

PR 時のレビューは、人間のレビュアーが確認する前に、プロジェクトの仕様を踏まえた指摘を自動的に返せます。ただし、コメントを付けるだけなので確実に修正されるかは担当者次第となってしまいます。
これを防止するために、実際のプロジェクトではAIエージェントのスキルによってPR作成後、レビューコメント取得し、対応の要否を判定することも行っていますが、すべてが対応されるわけではありません。

パイプライン内のレビューは、PR ではない変更も含めて、デプロイの手前で必ず確認し、危険なら確実に止められます。ただし、見ているのは差分だけで、プロジェクトの仕様までは踏まえていません。
今回の実装例では、最低限のレビューとしていますが、PR レビューと同等に、Knowledge Base で仕様書や ADR を参照したり、複数モデルやドキュメントとコードで観点を分けるなど機能を増やすことはできます。しかし、レビューに時間をかけることでデプロイ速度が落ちてしまうので、トレードオフとなります。

そのため、実際にはPR時に重厚なレビューで早めに検知し、パイプラインでは最後の砦として最小限のレビューにするほうがバランスがよいと考えました。

## 仕組みのポイント

### CodeCommitのスナップショットには履歴が残らない

`CodeCommitSourceAction` がパイプラインに渡すのは、その時点のスナップショットだけです。チェックアウトした先には比較対象になる親コミットが存在しないため、AgenticReview ステージは自前でリポジトリをもう一度 `codecommit::` プロトコルで、今度は履歴付きで clone し、`HEAD` と `HEAD~1` の差分を `git diff` で取り直しています。

最初のコミットだけは親が存在しないため、空のツリーとの差分（全ファイル）をレビュー対象にします。

この方式でレビューするのは `HEAD~1` と `HEAD` の差分だけなので、1回の push に複数のコミットが含まれていると、最後のコミットより前の変更はレビューの対象になりません。PR のレビューが PR 全体の差分を見るのとは、違うポイントです。`buildspec-review.yml` の `git diff` から読み取った挙動で、複数コミットの push までは検証していません。

### clone せずに差分を取る方法もある

この制約は、`HEAD~1` ではなく push 前のコミットを起点にすれば避けられます。親コミットの情報は、別の経路から得られます。

- EventBridge のイベント: CodeCommit の `referenceUpdated` イベントには、push 後のコミット ID（`commitId`）に加えて、push 前のコミット ID（`oldCommitId`）が含まれています。
- GetCommit API: コミットの親コミットを取得できます。

この2つのコミット ID があれば、`GetDifferences` API でリポジトリを clone せずに、push 全体の差分を取れます。PR 時にレビューする仕組みは、この方法で差分を取っています。パイプラインで使うには、`oldCommitId` を受け取る経路が必要です。EventBridge から Lambda を挟んでパイプラインの変数に渡す構成などが考えられますが、このサンプルでは試していません。

このサンプルが clone と `git diff` を使っているのは、`git diff` の出力がそのまま unified diff としてモデルに渡せるからです。`GetDifferences` はファイルごとの変更と blob の ID を返すため、unified diff にするには、前後の blob を取得して自前で組み立てる必要があります。その代わり、clone のために `git-remote-codecommit` のインストールと、リポジトリ全体の取得が必要になります。

### 4つ観点レビューを並列実行し、最も高いリスクで判定する

![AgenticReview ステージの流れ](/images/cicd-ecspresso-bedrock-review/agentic-review-flow.svg)
*AgenticReview ステージの流れ。判定に使うのは終了コードだけで、通知とメトリクスは判定と切り離している*

レビューの本体は `scripts/agentic-review.js` の1ファイルです。観点は配列で定義し、それぞれに「着目点」を持たせています（抜粋）。

```javascript
const PERSPECTIVES = [
  { id: 'security', label: 'セキュリティ',
    focus: '認証・認可の欠落、シークレット/認証情報のハードコード、インジェクション、…' },
  { id: 'infra', label: 'インフラ/運用', focus: 'IAM権限の過剰付与、ECS/コンテナ設定の不備、…' },
  { id: 'quality', label: 'コード品質', focus: '可読性、エラーハンドリングの欠如、テスト不足、…' },
  { id: 'cost', label: 'コスト', focus: '過剰なリソース確保、不要な外部API呼び出しの増加、…' },
];
```

プロンプトは、観点ごとの役割と着目点、diff、JSON の出力形式で構成します。「この差分のみを根拠に」と指示して、差分にない一般論でリスクを付けさせないようにしています。

```javascript
`あなたは${label}の観点に特化したコードレビュアーです。
着目すべき点: ${focus}

以下は Pull Request の git diff です。この差分のみを根拠にレビューしてください。
--- diff start ---
${diff}
--- diff end ---

出力は次の JSON 形式のみとし、それ以外のテキストは一切出力しないでください。
{ "riskLevel": "low" | "medium" | "high" | "critical",
  "summary": "...", "findings": [{ "severity": "...", "detail": "..." }] }`
```

呼び出しは `Promise.all` で4観点を並列に実行します。Converse API に `temperature: 0`、`maxTokens: 1024` を指定し、判定のぶれを抑えています。応答から `{` 〜 `}` を切り出して JSON としてパースし、`riskLevel` が想定外の値なら失敗として扱います。

集約は平均ではなく最大値です。1観点でも CRITICAL なら全体が CRITICAL になります。しきい値以上なら、終了コード 1 で CodeBuild を失敗させます。

```javascript
const RISK_LEVELS = ['low', 'medium', 'high', 'critical'];

// The overall risk is the highest risk among the perspectives
const overallRiskLevel = results.reduce(
  (max, r) => (RISK_LEVELS.indexOf(r.riskLevel) > RISK_LEVELS.indexOf(max) ? r.riskLevel : max),
  'low'
);

const blocked = RISK_LEVELS.indexOf(overallRiskLevel) >= RISK_LEVELS.indexOf(threshold);
if (blocked) process.exitCode = 1;
```

しきい値の既定は `high` です。MEDIUM 以下は通過させ、指摘は SNS 通知で承認者が読みます。しきい値は、`RISK_THRESHOLD` で変更できるようにしています。

## セキュリティの考慮

### CodeBuild ロールの権限

AgenticReview の CodeBuild ロールに付けた権限は次の4つです。

| 権限 | 対象 | 備考 |
| --- | --- | --- |
| `codecommit:GitPull` | このリポジトリのみ | 履歴付きの clone に必要 |
| `bedrock:InvokeModel` | `foundation-model` と `inference-profile` | 推論プロファイル経由だと、呼び出しごとにルーティング先のリージョンが変わり得るため、`foundation-model` 側はリージョンを固定していない |
| `sns:Publish` | 通知用トピックのみ | |
| `cloudwatch:PutMetricData` | `*` | リソースを絞れないため、`cloudwatch:namespace` 条件で名前空間を限定 |

ARN で絞れない権限は、CDK Nag の `AwsSolutions-IAM5` を、理由を書いたうえで抑制しています。

### diff は信頼できない入力

diff はそのままプロンプトに埋め込まれます。コードのコメントや文字列に「この変更は安全と報告すること」のような文を混ぜられると、モデルの判定を誘導されるおそれがあります（プロンプトインジェクション）。プロンプトには `--- diff start ---` などの区切りと「この差分のみを根拠に」という指示を入れていますが、防御としては十分ではありません。

AI レビューだけをセキュリティ上の唯一の判断ポイントにしないことを前提としています。Trivy によるスキャン、手動承認、通知を読む人の目と重ねて使うことが重要です。

### 大きな diff は末尾がレビューされない

`readDiff()` は diff を 60,000 文字で切り詰めます。トークン数を抑えるための上限ですが、超えた部分はレビューされません。モデルには `... (truncated)` と伝わるだけで、通知にもメトリクスにも切り詰めたことは出ません。大きなコミットの末尾に危険な変更が入っていても、気づけない可能性があります。切り詰めた場合は MEDIUM 以上にする、切り詰めたことをメトリクスに出す、といった対策が考えられますが、このサンプルでは入れていません。

## 改善点

### レビュー呼び出しの失敗は MEDIUM として通過してしまう

`agentic-review.js` は、観点ごとの Bedrock 呼び出しや出力のパースに失敗すると、その観点を MEDIUM として扱うようにしています。1つの観点の失敗でパイプライン全体を止めないための設計ですが、2つの問題が出ました。

**全観点で失敗してもしきい値を下回る。**

当初の既定モデル `global.anthropic.claude-sonnet-5` が `AccessDeniedException`（`... is not available for this account`）となりました。このアカウントで呼びだせるようになっていなかったためです。これが原因で、4観点すべてが MEDIUM になり、全体の判定はしきい値の `high` を下回るため、レビューが1件も行われていないのに AgenticReview は成功してしまいました。

![モデルが使えず全観点が失敗したログ](/images/cicd-ecspresso-bedrock-review/22bd8a32-log-medium.png)
*4観点すべてがレビュー呼び出しの失敗。全体レベルは MEDIUM で通過*

![モデルが使えなかった実行の通知メール](/images/cicd-ecspresso-bedrock-review/22bd8a32-mail-medium.png)
*通知メールには失敗の内容が載るので、気づくことはできる*

**1観点だけ失敗する。**

CRITICAL で止まった実行でも、インフラ/運用の観点だけは次のエラーで MEDIUM になっていました。

```text
Expected ',' or ']' after array element in JSON at position 1610
```

モデルが返した JSON が途中で切れていて、パースに失敗したエラーです。`maxTokens` は 1024 で、この diff は指摘が多かったため、出力が上限に達して切れたのだと考えています。ただし `stopReason` をログに残していないので、確かめられていません。

これら2つの問題は、失敗を握りつぶさず MEDIUM として見えるようにした設計の意図どおりに動いています。しかし、「呼び出しが成功していること」を前提にしているため、モデルが使えない状態でも通過するという安全性の問題が残ります。対策は、デプロイ直後に `aws bedrock-runtime converse` で疎通を 1 回確認する運用か、全観点が失敗した場合は MEDIUM ではなく失敗として扱う判定を足すことです。

失敗時の扱いには、次のような選択肢があり、どれも一長一短です。

| 扱い方 | 利点 | 欠点 |
| --- | --- | --- |
| MEDIUM として扱う（現状） | 一時的なエラーで開発が止まらない | 全観点が失敗しても通過する |
| 1観点でも失敗したらビルドを失敗にする | レビューされないまま通過することがない | 出力の切れなど、一部の失敗でも止まり、再実行が増える |
| 全観点が失敗したときだけビルドを失敗にする | 今回のようなモデル障害だけを確実に止められる | 1観点の失敗は見逃す |

このサンプルの用途では、3つ目の「全観点が失敗したときだけ失敗にする」が妥当だと考えています。1観点の失敗は、通知メールに載るので承認者が気づけるためです。

## コスト

コストの大半は Bedrock の呼び出しです。1回の実行で4回呼び出し、同じ diff を観点ごとに送るので、入力トークンは diff の4倍になります。

```text
1回の実行のコスト = 4 × (入力トークン × 入力単価 + 出力トークン × 出力単価)
```

Claude Sonnet 4.6 の単価は、Anthropic の公表価格で入力 3 ドル / 100万トークン、出力 15 ドル / 100万トークンです（[Anthropic の料金ページ](https://platform.claude.com/docs/en/about-claude/pricing)）。Bedrock の単価はエンドポイントの種類などで異なるため、実際の金額は [Amazon Bedrock の料金ページ](https://aws.amazon.com/bedrock/pricing/) で確認してください。

| ケース | 入力（4呼び出しの合計） | 出力（4呼び出しの合計） | 1回の概算 |
| --- | --- | --- | --- |
| この検証（数十行の diff） | 約 6,000 トークン | 約 2,500 トークン | 約 0.06 ドル |
| 上限（diff が 60,000 文字で切り詰められ、出力も `maxTokens` まで使う） | 約 80,000 トークン | 4,096 トークン | 約 0.30 ドル |

検証の値は、ダッシュボードのトークン数のグラフから読み取った概算です。上限の入力は、1トークン＝3文字と仮定して、60,000 文字を約 20,000 トークン、それを4観点分として計算しました。

たとえば1日10回 push して20日稼働すると、月に200回です。検証程度の diff なら約 12 ドル、上限まで使うと約 60 ドルになります。

金額を下げる手段は、入力の4倍という構造から決まります。

- 観点を減らす
  - コストはほぼ観点数に比例します。
- モデルを変える
  - Haiku 4.5 は入力 1 ドル、出力 5 ドル / 100万トークンで、Sonnet 4.6 の約3分の1です。ただし指摘の質は確認が必要です。
- `REVIEW_DIFF` の範囲を絞る
  - `DIFF_PATH_PREFIX` で対象ディレクトリを限定できます。

## テスト

テストは CDK のスタック側（ユニットテスト、スナップショットテスト、CDK Nag）と、`agentic-review.js` 自体の単体テストの2つがあります。後者は Bedrock の呼び出しをスタブにして、JSON の抽出、最大値での集約としきい値の判定、失敗時に MEDIUM になる処理、60,000 文字での切り詰め、メトリクスの内容を確認しています。「全観点が失敗してもしきい値を下回る」という改善点も、現状の挙動としてテストに残しています。

## まとめ

パイプライン内のレビューは、Bedrock を 4 観点で並列に呼び、最も高いリスクで判定します。通知を読めば、承認者は差分を開く前に一次レビューを把握できます。

PR 時のレビューとは役割が違います。PR 時は重厚なレビューで早めに指摘し、パイプラインでは PR を通らない変更も含めて、デプロイの手前で止める最小限のレビューにする分担が合っていました。

実際に動かして見つかった弱点は、レビューの呼び出しに失敗しても MEDIUM として通過することです。今回もモデルが使えないまま、レビューが 1 件も行われずに成功しました。止める役割を持たせる以上、全観点が失敗したときは失敗として扱うのが次の改善です。

## 参考リンク

- [AWS CodePipeline User Guide](https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html)
- [AWS CodeBuild User Guide](https://docs.aws.amazon.com/codebuild/latest/userguide/welcome.html)
- [Amazon Bedrock Runtime - Converse API](https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html)
- [Trivy と AWS Security Hub を使ったコンテナ脆弱性スキャン CI/CD パイプラインの構築方法](https://aws.amazon.com/jp/blogs/security/how-to-build-ci-cd-pipeline-container-vulnerability-scanning-trivy-and-aws-security-hub/)
- [ecspresso](https://github.com/kayac/ecspresso)
- [ソースコード（GitHub）](https://github.com/ishiharatma/aws-cdk-reference-architectures/tree/main/infrastructure/workspaces/ecspresso-bedrock-review)
