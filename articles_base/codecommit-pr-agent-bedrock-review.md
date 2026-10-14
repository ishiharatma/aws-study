<!-- # Amazon Bedrock で CodeCommit の PR レビューを自動化実装～効果測定まで<!-- omit in toc -->

## 結論

- 5 人のチームが、1 つの CDK インフラリポジトリで約 10 週間、986 回のレビューを実行しました。1 回あたり平均約 60 秒、Bedrock の実請求額は合計 180.60 ドル(1 回あたり約 0.18 ドル)でした
- レビューの件数・コスト・所要時間は数字で見られるようになりましたが、指摘が正しかったかどうかと、導入前後のリードタイムの変化はまだ測れていません

## 目次<!-- omit in toc -->

- [はじめに](#はじめに)
- [全体像](#全体像)
- [PR レビューの概要](#pr-レビューの概要)
- [効果計測](#効果計測)
- [可視化](#可視化)
- [コストの考え方](#コストの考え方)
- [運用実績](#運用実績)
- [設計の判断](#設計の判断)
- [限界と今後の改善](#限界と今後の改善)
- [まとめ](#まとめ)

## はじめに

CodeCommit は AWS 上で開発環境を完結させられるとても便利なサービスです。しかし、GitHub と比べると周辺のエコシステムは限定的です。[Qodo AIのPR-AgentのようなOSS](https://github.com/The-PR-Agent/pr-agent) には CodeCommit 向けの provider がありますが、機能は限定的で CLI での利用が前提です。
そこで、CodeCommit の Pull Request(以下 PR)を Amazon Bedrock でレビューし、コメントとして投稿する仕組みを作りました。この OSS の PR-Agent は使わず、EventBridge と Lambda で PR の作成・更新時に自動で動くよう独自に作っています。参考にした記事では「コメントを投稿したら終わり」というものが多かったのですが、運用を考えると次のことも可視化しなければいけません。

- 月にいくらかかっているのか
- 誰の PR で、どのモデルがどれだけトークンを使っているのか
- 指摘は実際に出ているのか、出ているならどの重要度が多いのか
- PR がマージされるまでの時間は変わったのか

本記事では、こうした数字の取得やレポート方法についても解説します。

## 全体像

全体構成は次のようになっています。

![構成図(レビュー・ナレッジベース・レポート生成)](/images/codecommit-pr-agent/review-bot-architecture-core.png)

:::details 全体の構成図(CDK テスト CI・利用状況ダッシュボード・Slack/Teams 通知を含む)
![全体の構成図](/images/codecommit-pr-agent/review-bot-architecture.png)
:::

PRを行ったあとのレビューの流れはこのようになっています。

![PR レビューの流れ](/images/codecommit-pr-agent/architecture.png)

PR の作成・更新を EventBridge で受け、Lambda(Python)が差分を作って Bedrock に渡します。その結果を PR コメントとして CodeCommit に投稿します。投稿されるコメントは次のようになります(冒頭部分のみ抜粋)。コードとドキュメントは、別々のコメントとして投稿されます。

![codeレビュー](/images/codecommit-pr-agent/pragent-code-summary.png)
*codeレビュー*

![docレビュー](/images/codecommit-pr-agent/pragent-doc-summary.png)
*docレビュー*

この仕組みで力を入れたのは、可視化に必要な 3 種類のデータを残す部分です。

![効果を測る 3 つの層](/images/codecommit-pr-agent/measurement-layers.png)

| 層 | 分かること | 元データ | 保存先 |
| --- | --- | --- | --- |
| ① レビューの中身 | 指摘数(重要度別)、LGTM、複数モデルの一致、所要時間、エラー | Bedrock の構造化出力 | CloudWatch カスタムメトリクス |
| ② コストと利用状況 | リポジトリ別・PR 作成者別・モデル別のトークン数と概算コスト | Bedrock の呼び出しログ | CloudWatch Logs |
| ③ 開発の流れ | PR 作成からマージまでの時間 | PR のステータス変更イベント | S3 の JSON |

## PR レビューの概要

### 差分は blob から作る

CodeCommit の `GetDifferences` は、変更のあったファイルの一覧と blob ID を返しますが、差分のテキストは返しません。そのため、変更前後の blob を `GetBlob` で取得し、Python の `difflib` で unified diff を組み立てています。

```python
diff_lines = list(difflib.unified_diff(
    before_content.splitlines(),
    after_content.splitlines(),
    fromfile=f"a/{path}",
    tofile=f"b/{path}",
    n=5,          # lines of context around each change
    lineterm="",
))
```

変更種別ごとの扱いは次の通りです。変更前後の差分だけをモデルに渡すので、変更のない行はトークンを消費しません。

| 変更種別 | モデルに渡す内容 |
| --- | --- |
| 変更(M) | unified diff(前後 5 行のコンテキスト付き) |
| 追加(A) | ファイル全体 |
| 削除(D) | パスのみ(「削除された」と記載) |
| バイナリ・空 | 本文なし(その旨を記載) |

また、1 回のレビューで扱う差分の行数に上限を設けています。上限に達したら、ファイル単位でそれ以降を打ち切り、打ち切ったことを PR コメントに記載します。

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

レビュー担当のモデルを `@tool` にして、サマリエージェントから呼ばせます。最初は、レビュー担当のツールに差分を引数として渡す作りにしていました。しかし、ツールを呼ぶのはサマリエージェント(LLM)なので、差分を引数として一字ずつ生成することになります。差分は大きいため、この生成に時間がかかり、タイムアウトの原因になりました。
今は、ツールを引数なしにしました。差分入りのプロンプトはツールの外側の変数に持たせておき、ツールがそれを直接参照します。差分が LLM を経由しなくなるため、この問題は起きません。

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

今回はレビューの仕組み構築だけでなく、社内で導入効果を報告することを念頭に置いて設計と実装をしました。そのため、どんな数字を取るかをレビューの実装と並行して先に決めました。

ただし、実装は最初からすべて揃っていたわけではなく、運用しながら必要になったメトリクスを少しずつ足していきました。

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

コメント本文の Markdown から重要度を正規表現で取得する方法もありますが、本文の書式が少し変わるだけで取得できなくなります。しかし、ツールの引数で受ければ指摘数と LGTM をそのまま数値として使えるようになります。

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

デプロイパラメータの `ENABLE_METRICS` で送信を切り替えられ、送信に失敗してもレビュー自体は失敗させず、ログに残すだけです。

#### 複数モデルの一致度

モデルを 2 つ使うと、「同じ指摘を両方が出したのか、片方だけなのか」が分かります。`detected_by` が 2 つ以上の指摘を一致、1 つの指摘を独自検出として数えています。一致率が高ければモデルを 1 つに減らしてコストを下げる根拠になり、低ければ 2 つ使う意味がある、という判断材料になります。ただし、「一致した指摘が正しい」とは限らない点には注意が必要です(後述の限界を参照)。

### ② コストと利用状況は呼び出しログにメタデータを付与

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

コストは、集計したトークン数に設定した単価を掛けて概算します。単価はパラメータファイルの `modelPricing`(入力・出力それぞれの 1,000 トークンあたりの USD)で与えます。なお、これは概算ですので、正確な金額は Cost Explorer などで確認します。

### ③ PRマージまでの時間を記録

PR のステータス変更イベント(`pullRequestStatusChanged`)を受けて、別の Lambda がリードタイムを記録します。

ただし、このイベントだけでは「マージされた」のか「マージせずに閉じた」のか区別できない点に注意が必要です。そのため、`GetPullRequest` を呼び、`pullRequestTargets[].mergeMetadata.isMerged` を確認します。マージされずに閉じた PR は記録しません。

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

集めた数字は次の 3 つの方法で見られるようにしています。

### CloudWatch ダッシュボード

①のメトリクスを、リポジトリ別のレビュー回数、重要度別の指摘数、複数モデルの一致・独自検出、モデル別のトークン使用量などのグラフで表示します。リポジトリは増減するので、ウィジェットは `SEARCH` 式で組み、リポジトリ名を固定で書かないようにしています。

![dashboard](/images/codecommit-pr-agent/dashboard-metrics.png)
*CloudWatch ダッシュボード(重要度別の指摘数とモデル別のトークン使用量を抜粋)*

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

![report-mail-monthly.png](/images/codecommit-pr-agent/report-mail-monthly.png)
*月次レポート*

![report-mail-daily.png](/images/codecommit-pr-agent/report-mail-daily.png)
*日次レポート*

```json
{
  "reportType": "daily",
  "environment": "dev",
  "periodStart": "2026-09-29T00:00:00Z",
  "periodEnd": "2026-09-30T00:00:00Z",
  "generatedAt": "2026-09-30T00:05:40Z",
  "summary": {
    "reviewCount": 40,
    "lgtmCount": 0,
    "totalInputTokens": 1073657,
    "totalOutputTokens": 167242,
    "avgLatencySeconds": 72.403,
    "totalReviewedFiles": 188,
    "totalReviewedLines": 12995
  },
  :
}
```

### 利用状況ダッシュボード(オプション)

S3 の JSON を Web 画面で見たい場合のために、CloudFront + S3 の静的サイトと、Cognito の JWT 認証付き API Gateway(HTTP API)も作成しました。API は Lambda 経由で S3 のレポートを読み、全体の画面と PR 作成者別の画面の 2 つで表示します。

- 認証は Authorization Code + PKCE で、セルフサインアップは無効です
- 静的サイトは OAC で S3 に閉じ、CloudFront からのみアクセスできます

これは既定では無効で、オプションで有効化できます。

![dashboard-opt-1](/images/codecommit-pr-agent/dashboard-opt-1-summary.png)
*利用状況ダッシュボード-全体(上部を抜粋)*

![dashboard-opt-2](/images/codecommit-pr-agent/dashboard-opt-2-summary.png)
*利用状況ダッシュボード-個人(上部を抜粋、PR 作成者はマスキング)*

## コストの考え方

Lambda、EventBridge、SQS、S3 は、PR の数が月数百件程度なら、Bedrock に比べて小さくなります。主なコストは Bedrock のトークン代で、概算の式は次の通りです。

```text
月額 ≒ PR 数 × 1 PR あたりの回数 × (入力トークン × 入力単価 + 出力トークン × 出力単価) × モデル数
```

メトリクス収集の追加コストは、カスタムメトリクスの数(ディメンションの組み合わせごとに 1 つ)と `PutMetricData` の回数で決まります。リポジトリ・重要度・環境の組み合わせで増えていくので、リポジトリ数が多い場合は確認してください。単価は最新の CloudWatch 料金ページで確認してください。

## 運用実績

社内の開発チーム(5 人)が、1 つの CDK インフラリポジトリで、約 10 週間動かした結果です。数字は S3 のレポート JSON と Cost Explorer の請求額から取っています。この環境には他のリポジトリのレビューも少し含まれますが、ほとんどは検証対象のリポジトリです。構成は単一モデル(`reviewMode: "single"`)で、モデルは Claude Sonnet 4.6(クロスリージョン推論)です。今回は、複数モデルでの運用実績ではありません。

| 月 | レビュー回数 | 指摘(Critical / Warning / Info) | LGTM | 平均所要時間 | Bedrock 実請求額 |
| --- | ---: | --- | ---: | ---: | ---: |
| 7 月(23 日から) | 73 | 112 / 319 / 272 | 0 | 68 秒 | 20.94 ドル |
| 8 月 | 362 | 406 / 1,236 / 1,027 | 6 | 61 秒 | 54.65 ドル |
| 9 月 | 551 | 530 / 1,861 / 1,653 | 15 | 58 秒 | 105.00 ドル |
| 合計 | 986 | 1,048 / 3,416 / 2,952 | 21 | 約 60 秒 | 180.60 ドル |

- 1 回のレビューで平均 12 ファイル・約 300 行で、指摘は Critical 1.1 件、Warning 3.5 件です。指摘なし(LGTM)は 986 回中 21 回(約 2%)で、ほとんどのレビューで何かしら指摘が出ています
- 所要時間は平均 1 分程度です。週次の p95 は 2〜3 分台で、最も遅かった週は約 5 分でした
- 作成者別に見ると、5 人のうち 2 人の PR で Bedrock 呼び出しの約 8 割を占めていました。PR を出す頻度の差がそのまま出ています

チームの修正記録と突き合わせると、次のような指摘が実際の修正につながっていました。

- ECS クラスターの Exec 設定で、CloudWatch Logs の暗号化設定と実際のロググループが食い違い、IAM 権限があってもセッションを張れない
- プレフィックスリストを参照するセキュリティグループのルールは、実際のエントリ数ではなく `MaxEntries` の分だけルールのクォータを消費する

### 概算と実額の比較

1 レビューあたり約 0.18 ドルでした。7 月から 9 月でレビュー回数は約 7.5 倍、請求額は約 5 倍になり、1 回あたりは 7 月 0.29 ドル、8 月 0.15 ドル、9 月 0.19 ドルでした。

トークン数から上の式で概算すると(入力 2,958 万、出力 433 万トークン、Sonnet の一般公開単価で約 154 ドル)、実請求額より 15% ほど低く出ました。正確な金額は Cost Explorer で確認したほうがよさそうです。

## 設計の判断

| 判断 | 選んだ方法 | 理由・トレードオフ |
| --- | --- | --- |
| 結果の受け取り | tool_use(構造化出力) | 本文の書式変更に強い。ただしモデルが自己申告した重要度をそのまま数えるので、正しさは保証されない |
| メトリクス送信 | `PutMetricData` を直接呼ぶ | 1 レビューで 10〜15 回程度の呼び出しで、EMF を入れるほどの量ではない(1,500 回で約 0.015 ドル/月の見積もり)。量が増えたら EMF を検討する |
| マージの判定 | `GetPullRequest` で確認 | イベントだけではマージと却下を区別できない。1 PR につき API を 1 回呼ぶ分のコストと引き換え |
| 呼び出しログへの付与 | `requestMetadata` | アプリ側でトークンを数え直さず、Bedrock 側の実測値を使える |
| ダッシュボードの認証 | 静的サイトの HTML・JS は認証なしで配信し、`/api/*` だけ Cognito の JWT で保護 | 未ログインだとページ内の JavaScript が Cognito のログイン画面へ遷移させる。未ログインでも画面構成や API のパスは見えるが、集計値は取れず実害は小さい。HTML・JS の配信前に認証したい場合は CloudFront 側で認証を掛ける方法があるが、構成が複雑になる |

## 限界と今後の改善

- 指摘の正しさは測っていません。重要度はモデルの自己申告で、実際にバグだったか、修正されたかは分かりません。指摘数が減っても、コードの品質が上がったとは言えません
  - 改善として、指摘への返信、👍/👎 のリアクション、指摘したファイルがその後変更されたかを、PR のマージ・クローズ時に回収する Lambda(`review_feedback`)を実装しました。ただし運用での検証はこれからで、この記事の数字には含めていません。
- リードタイムは、利用状況ダッシュボードで日次・リポジトリ別・PR 作成者別に見られますが、レビュー導入前後の比較はできていません
  - 導入前のデータがないので、導入前の PR は CodeCommit の履歴から計算し直す必要があります
- PR 作成者別の指摘数と LGTM 率は出せません。呼び出しログには `prAuthor` を付けているので、作成者別のトークン数は出せますが、指摘や LGTM のメトリクスには作成者を付けていません
  - メトリクスに作成者を足すと、ディメンションの組み合わせが増えてカスタムメトリクスの数と費用が増えます。必要になったときに、費用と見合うか確認してから追加を検討します
- `prAuthor` を呼び出しログとレポートに残すので、個人ごとの利用状況が見えます。目的は個人の評価ではなく利用状況の把握であることを、運用の中で決めておく必要があります
  - 今後、利用状況ダッシュボードを有効にする場合は、閲覧できる人の範囲もあわせて決めます
- PR には、それを出した人が好きな文章を書けます。コメントなどに指示文を紛れ込ませて、レビュー結果を誘導される可能性(プロンプトインジェクション)があります
  - レビュー Lambda が行うのは PR へのコメント投稿だけで、コードの変更やマージはしません。誘導されても影響はコメントの内容にとどまります。今後は、PR の本文や差分を「指示ではなく対象のデータ」として扱うようプロンプトで明示するなど、誘導されにくくする対策を試します

## まとめ

レビューを行い、コメントを投稿するところまでは比較的簡単に作れます。ただ、効果を数字で見るには、構造化した受け取りと呼び出しログへのメタデータ付与が必要でした。まだ測れていないのは、指摘が正しかったかどうかと、導入前後でリードタイムがどう変わったかです。実測が 1 チーム分だけなので、ほかのチームでも運用しながら見直していきたいです。
