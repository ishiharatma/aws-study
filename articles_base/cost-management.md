# AWS コスト管理

## ☘️ はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents

- [AWS コスト管理](#aws-コスト管理)
  - [☘️ はじめに](#️-はじめに)
  - [👀 Contents](#-contents)
  - [AWS コスト管理 とは](#aws-コスト管理-とは)
  - [ワークロードの特性を把握する](#ワークロードの特性を把握する)
  - [料金体系を理解する](#料金体系を理解する)
  - [想定外のコストが発生する要因を理解する](#想定外のコストが発生する要因を理解する)
  - [コストの可視化](#コストの可視化)
    - [AWS Cost Explorer で可視化する](#aws-cost-explorer-で可視化する)
    - [AWS Cost and Usage Report で可視化する](#aws-cost-and-usage-report-で可視化する)
    - [コスト異常を検出する](#コスト異常を検出する)
    - [予算を作成して把握する](#予算を作成して把握する)
    - [Amazon Athena を利用して可視化する](#amazon-athena-を利用して可視化する)
    - [AWS Cost Categories](#aws-cost-categories)
    - [コスト分配タグ](#コスト分配タグ)
  - [コスト削減ポイント](#コスト削減ポイント)

## AWS コスト管理 とは

AWS を利用する上で、コストの管理は避けられません。利用しているサービスの課金体系と利用状況を把握して運用を行わないと、「突然高額請求が！」といった状況が発生し、実際にそのような事例も多くあります。

【AWS Black Belt Online Seminar】[xx(YouTube)](xxx)(1:00:33)

![xx](/images/xx/)

[xx サービス概要](https://aws.amazon.com/jp/xx/)

[xx ドキュメント](https://docs.aws.amazon.com/ja_jp/xx/?id=docs_gateway)

[xx よくある質問](https://aws.amazon.com/jp/xx/faqs/)

## ワークロードの特性を把握する

ビジネスのワークロードとして、以下のような特性を把握する必要があります。

- データ量
- HTTP リクエスト数
- アクセスパターン（時間帯によるアクセス、急激なアクセス）

## 料金体系を理解する

AWS の利用料金は従量課金制ですが、サービスによって課金される単位が異なります。

課金単位を大きく分けると、以下のようなものがあります。

- 利用時間
  - リソースが作成されると、その利用時間（起動時間）で料金が発生します
  - 利用量に比べるとコスト見積が容易で、コスト削減もやりやすい
- 利用量（ストレージやキャパシティサイズなど）
  - リソースの作成自体には料金がかからず、イベント数や使用容量に応じて料金が発生します
  - ビジネスのワークロードに影響されるため、コストの見積やコスト削減が難しい
- 月額固定（Route 53 のホストゾーンなど）
  - リソースが作成されると、月額固定で料金が発生します

また、サポート契約の料金も理解しておく必要があります。

[AWS Support プラン比較](https://aws.amazon.com/jp/premiumsupport/plans/)

## 想定外のコストが発生する要因を理解する

料金体系を理解していても、運用中にはうっかり想定外のコストが発生することがあります。

想定外のコストが発生するパターンは次のようなものがあります。

- リソースの消し忘れや戻し忘れ
- 保存データの肥大化
- 管理系サービスの肥大化
- オプション機能の追加コスト
- サービス仕様の考慮不足
- 料金単位の理解不足

## コストの可視化

Duration: 0:01:30

### AWS Cost Explorer で可視化する

[AWS Cost Explorer](https://aws.amazon.com/jp/aws-cost-management/aws-cost-explorer/)

AWS アカウント作成後は、IAM ユーザーが Cost Explorer にアクセスできません。このままではルートユーザーでしか確認できません。IAM ユーザーの利用が推奨されているので、AWS アカウント作成後すぐに「IAM ユーザー/ロールによる請求情報へのアクセス」を有効化しましょう。

[アカウントで請求データへのアクセスを有効にする](https://docs.aws.amazon.com/ja_jp/IAM/latest/UserGuide/tutorial_billing.html#tutorial-billing-step1)

次に、請求ダッシュボードから、Cost Explorer を開き、「Cost Explorer を起動」をクリックします。
初めて開いたときから有効になり、当月のデータは約 24 時間後に表示可能になります。

![cost_explorer](/images/costmanagement/cost_explorer.png)

[Cost Explorer を有効にする](https://docs.aws.amazon.com/ja_jp/cost-management/latest/userguide/ce-enable.html)

基本的な使い方は以下のドキュメントを参考にします。

[Cost Explorer を使用してデータを探索する](https://docs.aws.amazon.com/ja_jp/cost-management/latest/userguide/ce-exploring-data.html)

Cost Explorer の画面で指定したフィルタリング条件は URL のパラメータに反映されています。
そのままブラウザのブックマークに登録することで、次回も同じ条件で表示することができます。

[Cost Explorer の設定をブックマークまたはお気に入りとして保存する](https://docs.aws.amazon.com/ja_jp/cost-management/latest/userguide/ce-bookmarks.html)

### AWS Cost and Usage Report で可視化する

[AWS Cost and Usage Reports](https://aws.amazon.com/jp/aws-cost-management/aws-cost-and-usage-reporting/)

Cost and Usage Report はデフォルトでは有効になっておらず、「レポートの作成」を行うことで有効になります。

![cost_usage_report](/images/costmanagement/cost_usage_report.png)

詳しいレポート作成方法については以下のドキュメントを参考にします。

![コストと使用状況レポートを作成する](https://docs.aws.amazon.com/ja_jp/cur/latest/userguide/creating-cur.html)

### コスト異常を検出する

[AWS コスト異常検出](https://aws.amazon.com/jp/aws-cost-management/aws-cost-anomaly-detection/)

[AWS 異常検出で異常な使用料を検出する](https://docs.aws.amazon.com/ja_jp/cost-management/latest/userguide/manage-ad.html)

機械学習モデルを使用して、通常とは異なるコストの発生を検知できるサービスです。これを利用することで想定外のコストが発生することを把握でき、予め対応を行うこともできます。

![cost-anomaly-detection](/images/costmanagement/cost-anomaly-detection.png)

検知に敷居値を設定することはできますが、基本的には過去の利用傾向から自動的にチェックし検知するため、難しい定義など行わなくても利用することができます。
コスト異常検知自体は無料で利用できますので、設定しておくのがよいでしょう。
ただし、通知先に Amazon SNS などを利用する場合はその利用量に応じた料金は発生します。

### 予算を作成して把握する

[AWS Budgets](https://aws.amazon.com/jp/aws-cost-management/aws-budgets/)

[AWS Budgets を用いてコストを管理する](https://docs.aws.amazon.com/ja_jp/cost-management/latest/userguide/budgets-managing-costs.html)

予め設定した月額予算に対して、実績コストが指定した敷居値(%または絶対値)を超えた場合や、超えることが予測される場合に通知することができます。

![aws-budget-alert](/images/costmanagement/aws-budget-alert.png)

### Amazon Athena を利用して可視化する

[Amazon Athena を使用したコストと使用状況レポートのクエリ](https://docs.aws.amazon.com/ja_jp/cur/latest/userguide/cur-query-athena.html)

[AWS ブログ - Amazon Athena を使用して AWS Cost and Usage Report をクエリする](https://aws.amazon.com/jp/blogs/news/querying-your-aws-cost-and-usage-report-using-amazon-athena/)

基本的な構成は用意されている CloudFormation テンプレートで自動的に構築されます。

![cur-athena](/images/costmanagement/cur-athena.png)

その後、手動で Athena でテーブルを作成する必要があります。[⇒Athena の手動セットアップ](https://docs.aws.amazon.com/ja_jp/cur/latest/userguide/cur-ate-manual.html)

手順通りテーブル作成まで完了したら、以下のようなクエリを実行することで、コストを確認することができます。

```sql
// ステータス確認、READY になっていればクエリを実行できます
select status from cost_and_usage_data_status;

// 2022年の月額コストをAWSサービス毎（line_item_product_code）に表示する
SELECT line_item_product_code,
sum(line_item_blended_cost) AS cost, month
FROM mycostandusage_parquet
WHERE year='2022'
GROUP BY  line_item_product_code, month
HAVING sum(line_item_blended_cost) > 0
ORDER BY  line_item_product_code;

// コストが高い EC2 インスタンスを抽出する
SELECT line_item_resource_id AS instance_id,
sum(line_item_unblended_cost) AS cost
FROM mycostandusage_parquet
WHERE year='2022' AND month='12'
  AND line_item_product_code = 'AmazonEC2'
  AND regexp_like(line_item_operation, 'RunInstance')
  AND regexp_like(line_item_resource_id, 'i-')
GROUP BY  line_item_resource_id
HAVING sum(line_item_unblended_cost) > 100
ORDER BY  cost desc
```

カラムについては、[データディクショナリ](https://docs.aws.amazon.com/ja_jp/cur/latest/userguide/data-dictionary.html)を参照してください。

ただし、次のようなデータは、Athena だと `line_item_product_code` となるため注意が必要です。

![cur-athena-dd](/images/costmanagement/cur-athena-dd.png)

- line_item_usage_account_id: AWS アカウント ID
- line_item_product_code: AWS サービス名
- line_item_resource_id: リソース ID
- line_item_operation: コストが発生した API 操作
- line_item_type: 料金タイプ
- line_item_unblended_cost: 実コスト
- year: 請求年
- month: 請求月

さらに、Amazon QuickSight を利用して可視化することもできます。

[Amazon へのレポートデータを Amazon へのレポートデータのロード QuickSight](https://docs.aws.amazon.com/ja_jp/cur/latest/userguide/cur-query-other.html#cur-query-other-qs)

[Analyzing AWS Billing Data Using Amazon Quicksight(YouTube)](https://www.youtube.com/watch?v=2JnfuAA-TiU)

[AWS Blog-Query and Visualize AWS Cost and Usage Data Using Amazon Athena and Amazon QuickSight](https://aws.amazon.com/jp/blogs/big-data/query-and-visualize-aws-cost-and-usage-data-using-amazon-athena-and-amazon-quicksight/)

![cur-quicksight](/images/costmanagement/cur-quicksight.png)

### AWS Cost Categories

[AWS Cost Categories](https://aws.amazon.com/jp/aws-cost-management/aws-cost-categories/)

### コスト分配タグ

[AWS コスト配分タグの使用](https://docs.aws.amazon.com/ja_jp/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html)

## コスト削減ポイント
