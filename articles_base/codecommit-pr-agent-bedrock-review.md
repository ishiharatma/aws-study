# CodeCommit の PR レビューを Bedrock で自動化～効果測定<!-- omit in toc -->

## はじめに

CodeCommit は AWS 上で開発環境を完結させられるとても便利なサービスです。しかし、GitHub と比べると周辺のエコシステムは限定的です。PR-Agent には CodeCommit 向けの provider がありますが、機能は限定的で、CLI での利用が前提です。
そこで、CodeCommit の Pull Request(以下 PR)を Amazon Bedrock でレビューし、コメントとして投稿する仕組みを作りました。参考にした記事では「コメントを投稿したら終わり」というものが多かったのですが、運用を始めると次のことも可視化しなければなりません。

- 月にいくらかかっているのか
- 誰の PR で、どのモデルがどれだけトークンを使っているのか
- 指摘は実際に出ているのか、出ているならどの重要度が多いのか
- PR がマージされるまでの時間は変わったのか

本記事では、こうした数字の取得やレポート方法についても解説します。

## 全体像

![PR レビューの流れ](/images/codecommit-pr-agent/architecture.svg)

PR の作成・更新を EventBridge で受け、Lambda(Python)が差分を作って Bedrock に渡します。その結果を PR コメントとして CodeCommit に投稿します。

このプロジェクトで力を入れたのは、レビューと並行して 3 種類のデータを残す部分です。

![効果を測る 3 つの層](/images/codecommit-pr-agent/measurement-layers.svg)

| 層 | 分かること | 元データ | 保存先 |
| --- | --- | --- | --- |
| ① レビューの中身 | 指摘数(重要度別)、LGTM、複数モデルの一致、所要時間、エラー | Bedrock の構造化出力 | CloudWatch カスタムメトリクス |
| ② コストと利用状況 | リポジトリ別・PR 作成者別・モデル別のトークン数と概算コスト | Bedrock の呼び出しログ | CloudWatch Logs |
| ③ 開発の流れ | PR 作成からマージまでの時間 | PR のステータス変更イベント | S3 の JSON |

## PR レビューの概要

### 差分は blob から作る

CodeCommit の `GetDifferences` は、変更のあったファイルの一覧と blob ID を返しますが、差分のテキストは返しません。そのため、変更前後の blob を `GetBlob` で取得し、Python の `difflib` で unified diff を組み立てています。

### パスで処理を分ける

変更ファイルのパスで `code` / `document` / `skip` に分類します。コードとドキュメントは別々にレビューし、`skip` に当たるパスはレビューの対象から外します。パターンは `DOCUMENT_PATH_PATTERNS` と `SKIP_PATH_PATTERNS` で設定します。

### レビューをスキップする

PR のタイトルに `[skip-review]` を入れると、PR 全体のレビューを行わない機能も入れました。パスで対象外にする方法もありますが、タイトルに書くだけで即スキップできます。
今回のリポジトリでは MkDocs で HTML 化したドキュメントを生成していて、再生成したときに大量のファイルをレビューしなくて済みます。

### 複数モデルを Agents-as-Tools で束ねる

パラメータで、複数モデルを指定できるようにしました。レビュー用に複数モデルを指定した場合は、それらの結果をサマリするモデルも別に指定できます。例えば、レビューに Nova Pro と Claude Sonnet 4.6 の 2 モデルを使い、結果のサマリとして Claude Haiku 4.5 を使うようにもできます。

環境別のパラメータファイルで、`reviewMode` を `multi` にして、`multiModelConfig` にモデル ID を書きます。1 モデルだけで動かす場合は `reviewMode: "single"` と `singleModelConfig: { modelId }` を使います。

```typescript
reviewMode: "multi",
multiModelConfig: {
  modelIds: ["apac.amazon.nova-pro-v1:0", "jp.anthropic.claude-sonnet-4-6"],  // reviewers
  summaryModelId: "jp.anthropic.claude-haiku-4-5-20251001-v1:0",              // merges the results
},
```

レビュー担当のモデルを `@tool` にして、サマリエージェントから呼ばせます。最初はツールの引数に差分を渡していましたが、サマリエージェントが差分を出力トークンとして書き写してしまい、タイムアウトの主因になりました。今はツールを引数なしにして、プロンプト(差分入り)をクロージャで持たせています。

```python
def _make_reviewer(mid: str):
    @tool
    def reviewer_tool() -> str:  # no arguments: the diff never passes through the LLM
        if mid not in reviewer_results:  # each reviewer runs only once
            sub_agent = Agent(model=_build_bedrock_model(mid, repository_name, pr_author))
            reviewer_results[mid] = str(sub_agent(prompt_text))  # prompt_text holds the diff
        return reviewer_results[mid]
    return reviewer_tool
```

### コメントの上限は 10,240 バイト

CodeCommit のコメントには 10,240 バイトの[上限](https://docs.aws.amazon.com/ja_jp/codecommit/latest/userguide/limits.html)があります。コードレビューとドキュメントレビューは別のコメントとして投稿し、それでも超える場合は末尾を切り詰めて、省略した旨を付けます。

### 同じコミットへの二重投稿を避ける

投稿するコメントの末尾に、コミット ID 入りの HTML コメントを付けます。レビューの前に既存のコメントを読み、同じマーカーとコミット ID があればスキップします。

```python
suffix = f"\n\n<!-- commit:{commit_id} -->"  # appended to every review comment

# before reviewing: look through the existing comments on the PR
if DUPLICATE_MARKER in content and source_commit_id in content:
    return True  # already reviewed this commit, skip
```

## 効果計測

報告用にどんなメトリクスを取るかは、レビューの実装と並行して先に決めました。

### ① レビューの中身は自由文ではなく構造化データで受ける

サマリエージェントには、最後に `report_review_result` というツールを必ず呼ばせます。

```python
@tool
def report_review_result(
    summary_markdown: str,   # the PR comment body
    findings: list[dict],    # [{"severity": "critical|warning|info", "count": 2, "detected_by": ["nova", "sonnet"]}]
    lgtm: bool,
) -> str:
    """Report the final review result."""
```

コメント本文の Markdown から重要度を正規表現で取得する方法もありますが、本文の書式が少し変わるだけで取得できなくなります。ですが、ツールの引数で受ければ、指摘数と LGTM をそのまま数値として使えるようになります。

受け取った値は、`PutMetricData` で `PRAgent/Review` 名前空間に送ります。

```python
put_metric("FindingCount", count, dimensions={
    "Repository": repo, "ReviewGroup": group,
    "Severity": severity, "Environment": env,
})
```

送っている主なメトリクスは次の通りです。

| メトリクス | 内容 |
| --- | --- |
| FindingCount | 指摘数(リポジトリ・レビュー種別・重要度・環境別) |
| ReviewCount / ReviewLatencyMs | レビュー回数と所要時間 |
| ReviewWithinSLACount / ReviewExceededSLACount | 目標時間内かどうか |
| InputTokenCount / OutputTokenCount | トークン数 |
| MultiModelAgreementCount / MultiModelUniqueCount | 2 モデル以上が検出した指摘 / 1 モデルだけが検出した指摘 |
| ToolUseFallbackCount / KbFallbackCount / ErrorCount | フォールバックとエラー |
| ChangedFileCount / ChunkCount / SkipCount | PR の規模と分割数、スキップ数 |

`ENABLE_METRICS` で送信を切り替えられ、送信に失敗してもレビュー自体は失敗させず、ログに残すだけです。

#### 複数モデルの一致度

モデルを 2 つ使うと、「同じ指摘を両方が出したのか、片方だけなのか」が分かります。`detected_by` が 2 つ以上の指摘を一致、1 つの指摘を独自検出として数えています。一致率が高ければモデルを 1 つに減らしてコストを下げる根拠になり、低ければ 2 つ使う意味がある、という判断材料になります。ただし、「一致した指摘が正しい」とは限らない点には注意が必要です(後述の限界を参照)。

### ② コストと利用状況は呼び出しログにメタデータを付けて取る

Bedrock の Model invocation logging を有効にすると、呼び出しごとのトークン数がログに残ります。しかし、そのままでは「どのリポジトリの、誰の PR か」が分かりません。

Bedrock の `Converse` には `requestMetadata` があり、ここに入れた値が呼び出しログに出力されます。Strands の `BedrockModel` では、`additional_args` 経由で渡せます。

```python
BedrockModel(
    model_id=model_id,
    additional_args={"requestMetadata": {
        "repository": repo, "prAuthor": author, "environment": env,
    }},
)
```

レポート用の Lambda が、このログを Logs Insights で集計します。

```text
fields @timestamp
| filter ispresent(requestMetadata.repository)
| stats sum(input.inputTokenCount) as inTok, sum(output.outputTokenCount) as outTok
  by requestMetadata.repository, modelId
```

Logs Insights の `stats ... by` に指定できる項目には上限があるため、「リポジトリ × モデル」と「PR 作成者 × リポジトリ」は別のクエリに分けています。

コストは、集計したトークン数に設定した単価を掛けて概算します。単価はパラメータファイルの `modelPricing`(入力・出力それぞれの 1,000 トークンあたりの USD)で与えます。モデル ID は、最も長く部分一致したキーの単価を採用するので、`anthropic.claude-sonnet-4-6` と書けば `jp.anthropic.claude-sonnet-4-6` のような推論プロファイル ID にも当たります。

なお、これは概算ですので、正確な金額は Cost Explorer などで確認します。

### ③ 開発の流れはマージまでの時間を記録する

PR のステータス変更イベント(`pullRequestStatusChanged`)を受けて、別の Lambda がリードタイムを記録します。

注意点は、このイベントだけでは「マージされた」のか「マージせずに閉じた」のか区別できないことです。そのため、`GetPullRequest` を呼び、`pullRequestTargets[].mergeMetadata.isMerged` を確認します。マージされずに閉じた PR は記録しません。

記録は S3 に、日付でパーティションを切った JSON として保存します。

```text
reports/pr_lead_time/YYYY/MM/DD/<repository>_pr-<id>.json
```

```json
{
  "recordType": "pr_merge_lead_time",
  "repositoryName": "sample-repo",
  "pullRequestId": "123",
  "author": "alice",
  "mergeOption": "SQUASH_MERGE",
  "createdAt": "2026-01-01T00:00:00Z",
  "mergedAt": "2026-01-01T03:30:00Z",
  "leadTimeSeconds": 12600,
  "leadTimeHours": 3.5
}
```

## 可視化

集めた数字は次の 3 つの形で見られるようにしています。

### CloudWatch ダッシュボード

①のメトリクスを、リポジトリ別のレビュー回数、重要度別の指摘数、複数モデルの一致・独自検出、モデル別のトークン使用量などのグラフで表示します。リポジトリは増減するので、ウィジェットは `SEARCH` 式で組み、リポジトリ名を固定で書かないようにしています。

<!-- 画像: CloudWatch ダッシュボード(重要度別の指摘数、マルチモデル、トークン使用量が見えるもの)。ファイル名例: cloudwatch-dashboard.png -->

アラームは、レビューのエラー、SLA 超過、DLQ へのメッセージなどに付けています。

### 日次・週次・月次のレポート

レポート生成 Lambda が、スケジュール起動で Logs Insights を実行し、次のような JSON を S3 に保存します。

```text
reports/daily/YYYY/MM/DD/report.json
reports/weekly/YYYY/Www/report.json
reports/bedrock/...        # モデル別・PR 作成者別の Bedrock 利用状況
reports/monthly/...
```

この内容を SNS 経由で通知します。

<!-- 画像: 週次レポートの通知(メールまたは Slack)。ファイル名例: weekly-report.png -->
<!-- 画像: S3 の reports/ 配下のフォルダ構成と、report.json の中身。ファイル名例: s3-reports.png -->

### 利用状況ダッシュボード(オプション)

S3 の JSON を Web 画面で見たい場合のために、CloudFront + S3 の静的サイトと、Cognito の JWT 認証付き API Gateway(HTTP API)を用意しています。API は Lambda 経由で S3 のレポートを読み、全体の画面と PR 作成者別の画面の 2 つで表示します。

- 認証は Authorization Code + PKCE で、セルフサインアップは無効です
- 静的サイトは OAC で S3 に閉じ、CloudFront からのみアクセスできます

これは既定では無効で、オプションで有効化できます。

<!-- 画像: 利用状況ダッシュボードの実画面(全体・PR 作成者別)。ファイル名例: usage-dashboard.png -->

## コストの考え方

Lambda、EventBridge、SQS、S3 は、PR の数が月数百件程度なら、Bedrock に比べて小さくなります。主なコストは Bedrock のトークン代で、概算の式は次の通りです。

```text
月額 ≒ PR 数 × 1 PR あたりの回数 × (入力トークン × 入力単価 + 出力トークン × 出力単価) × モデル数
```

メトリクス収集の追加コストは、カスタムメトリクスの数(ディメンションの組み合わせごとに 1 つ)と `PutMetricData` の回数で決まります。リポジトリ・重要度・環境の組み合わせで増えていくので、リポジトリ数が多い場合は確認してください。単価は最新の CloudWatch 料金ページで確認してください。

## 運用実績

社内の開発チーム(6 人、リポジトリ 5 つ)の開発環境で、約 10 週間動かした結果です。数字は S3 のレポート JSON と Cost Explorer の請求額から取っています。構成は単一モデル(`reviewMode: "single"`)で、モデルは Claude Sonnet 4.6(クロスリージョン推論)です。複数モデルでの運用実績ではありません。

| 月 | レビュー回数 | 指摘(Critical / Warning / Info) | LGTM | 平均所要時間 | Bedrock 実請求額 |
| --- | ---: | --- | ---: | ---: | ---: |
| 7 月(23 日から) | 73 | 112 / 319 / 272 | 0 | 68 秒 | 20.94 ドル |
| 8 月 | 362 | 406 / 1,236 / 1,027 | 6 | 61 秒 | 54.65 ドル |
| 9 月 | 551 | 530 / 1,861 / 1,653 | 15 | 58 秒 | 105.00 ドル |
| 合計 | 986 | 1,048 / 3,416 / 2,952 | 21 | 約 60 秒 | 180.60 ドル |

9 月のレビュー回数は 29 日分まで、請求額は 28 日分までで、末尾の月は確定前の値です。

- 1 回のレビューで見るのは平均 12 ファイル・約 300 行で、指摘は Critical 1.1 件、Warning 3.5 件です。指摘なし(LGTM)は 986 回中 21 回(約 2%)で、ほとんどのレビューで何かしら指摘が出ています
- 所要時間は平均 1 分程度です。週次の p95 は 2〜3 分台で、最も遅かった週は約 5 分でした
- 作成者別に見ると、6 人のうち 2 人の PR で Bedrock 呼び出しの約 8 割を占めていました。PR を出す頻度の差がそのまま出ています

チームの修正記録と突き合わせると、次のような指摘が実際の修正につながっていました。

- ECS クラスターの Exec 設定で、CloudWatch Logs の暗号化設定と実際のロググループが食い違い、IAM 権限があってもセッションを張れない
- プレフィックスリストを参照するセキュリティグループのルールは、実際のエントリ数ではなく `MaxEntries` の分だけルールのクォータを消費する

### 概算と実額の比較

1 レビューあたり約 0.18 ドルでした。7 月から 9 月でレビュー回数は約 7.5 倍、請求額は約 5 倍になり、1 回あたりは 7 月 0.29 ドル、8 月 0.15 ドル、9 月 0.19 ドルでした。

トークン数から上の式で概算すると(入力 2,958 万、出力 433 万トークン、Sonnet の一般公開単価で約 154 ドル)、実請求額より 15% ほど低く出ました。金額は Cost Explorer の実額で見るのが確実です。

## 設計の判断

| 判断 | 選んだ方法 | 理由・トレードオフ |
| --- | --- | --- |
| 結果の受け取り | tool_use(構造化出力) | 本文の書式変更に強い。ただしモデルが自己申告した重要度をそのまま数えるので、正しさは保証されない |
| メトリクス送信 | `PutMetricData` を直接呼ぶ | 1 レビューで 10〜15 回程度の呼び出しで、EMF を入れるほどの量ではない(1,500 回で約 0.015 ドル/月の見積もり)。量が増えたら EMF を検討する |
| マージの判定 | `GetPullRequest` で確認 | イベントだけではマージと却下を区別できない。1 PR につき API を 1 回呼ぶ分のコストと引き換え |
| 呼び出しログへの付与 | `requestMetadata` | アプリ側でトークンを数え直さず、Bedrock 側の実測値を使える |

## 実装中に踏んだ点

- 複数モデルの構成で、指摘数と LGTM が常に 0 になりました。サマリエージェントに `report_review_result` を持たせていなかったのが原因です。さらに、`lgtm` が `None` のとき Python の `logging` は `extra` のフィールドを出力しないため、Logs Insights に項目自体が出ず、集計が空になっていました。今は常に bool で出力しています
- Lambda の非同期実行は、タイムアウトすると全体が再実行されます。同じコミットで `review_start` が複数回出ていて気づきました。リトライ回数は 1 にしています
- Bedrock の IAM は、プロンプト管理の `GetPrompt` が `bedrock:` ではなく `bedrock-agent:` で、リソース ARN にはバージョン付きの `:*` が必要でした。クロスリージョン推論プロファイルは、プロファイルの ARN だけでなく、ルーティング先の `foundation-model` の ARN も許可しないと `AccessDeniedException` になります

## セキュリティの考慮

- cdk-nag(`AwsSolutionsChecks`)をテストに組み込み、抑制する場合は理由を書いています。X-Ray を有効にすると `Resource: *` の権限が入って `AwsSolutions-IAM5` に引っかかるので、理由付きで抑制しています
- `prAuthor` を呼び出しログとレポートに残すので、個人ごとの利用状況が見えます。目的が個人の評価ではなく利用状況の把握であることを、運用の中で決めておく必要があります
- PR には、それを出した人が好きな文章を書けます。コメントなどに指示文を紛れ込ませて、レビュー結果を誘導される可能性(プロンプトインジェクション)があります

## 限界と今後の改善

- 指摘の正しさは測っていません。重要度はモデルの自己申告で、実際にバグだったか、修正されたかは分かりません。指摘数が減っても、コードの品質が上がったとは言えません
- リードタイムは JSON で保存しているだけで、集計や可視化(Athena や QuickSight など)は未実装です。レビュー導入前後の比較はできていません
- PR 作成者別の指摘数と LGTM 率は出せません。呼び出しログには `prAuthor` を付けているので、作成者別のトークン数は出せますが、指摘や LGTM のメトリクスには作成者を付けていません

## まとめ

レビューを行い、コメントを投稿するところまでは比較的簡単に作れます。ただ、効果を数字で見るには、構造化した受け取りと呼び出しログへのメタデータ付与が必要でした。これで、レビューの動きとコストは数字で見られます。一方で、指摘が正しかったかどうかと、導入前後でリードタイムがどう変わったかは、まだ測れていません。実測が 1 チーム分だけなので、ほかのチームでも運用しながら見直していきたいです。
