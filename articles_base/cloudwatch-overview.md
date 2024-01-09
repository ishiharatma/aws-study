# CloudWatch

## ☘️ はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents

- [CloudWatch](#cloudwatch)
  - [☘️ はじめに](#️-はじめに)
  - [👀 Contents](#-contents)
  - [CloudWatch とは](#cloudwatch-とは)
  - [オブザーバビリティ（Observability）とは](#オブザーバビリティobservabilityとは)
  - [CloudWatch Metrics](#cloudwatch-metrics)
  - [CloudWatch Metric Math](#cloudwatch-metric-math)
  - [CloudWatch Metric Streams](#cloudwatch-metric-streams)
  - [CloudWatch Alarms](#cloudwatch-alarms)
  - [CloudWatch Logs](#cloudwatch-logs)
  - [CloudWatch エージェント](#cloudwatch-エージェント)
  - [CloudWatch Dashboards](#cloudwatch-dashboards)
  - [CloudWatch Events / EventBridge](#cloudwatch-events--eventbridge)
  - [CloudWatch Metrics Insights](#cloudwatch-metrics-insights)
  - [CloudWatch Logs Insights](#cloudwatch-logs-insights)
  - [CloudWatch Container Insights](#cloudwatch-container-insights)
  - [CloudWatch Lambda Insights](#cloudwatch-lambda-insights)
  - [CloudWatch Contributor Insights](#cloudwatch-contributor-insights)
  - [CloudWatch Application Insights](#cloudwatch-application-insights)
  - [CloudWatch ServiceLens](#cloudwatch-servicelens)
  - [CloudWatch Resource Health](#cloudwatch-resource-health)
  - [CloudWatch Synthetics](#cloudwatch-synthetics)
  - [CloudWatch Evidently](#cloudwatch-evidently)
  - [CloudWatch Real-User Monitoring (RUM)](#cloudwatch-real-user-monitoring-rum)
  - [CloudWatch Anomaly Detection](#cloudwatch-anomaly-detection)
  - [One Observability Workshop](#one-observability-workshop)
  - [📖 まとめ](#-まとめ)

## CloudWatch とは

Duration: 2:27:15

モニタリングに関する様々な機能を提供するサービスです。

【AWS Black Belt Online Seminar】[Amazon CloudWatch(YouTube)](https://www.youtube.com/watch?v=gOaZeJpb0Y4)(47:14)

![blackbelt-cw1](/images/cloudwatch/blackbelt-cloudwatch_1-320.jpg)

[Amazon CloudWatch の概要と基本【AWS Black Belt】(YouTube)](https://www.youtube.com/watch?v=fzVkJne3OMI)(1:00:43)

![blackbelt-cw2](/images/cloudwatch/blackbelt-cloudwatch_2-320.jpg)

[Amazon CloudWatch Synthetics【AWS Black Belt】(YouTube)](https://www.youtube.com/watch?v=H1YXgBEY5nE)(39:18)

![blackbelt-Synthetics](/images/cloudwatch/blackbelt-cloudwatch_3-320.jpg)

[CloudWatch サービス概要](https://aws.amazon.com/jp/cloudwatch/)

[CloudWatch ドキュメント](https://docs.aws.amazon.com/ja_jp/cloudwatch/)

[CloudWatch よくある質問](https://aws.amazon.com/jp/cloudwatch/faqs/)

[CloudWatch の料金](https://aws.amazon.com/jp/cloudwatch/pricing/)

## オブザーバビリティ（Observability）とは

Duration: 0:01:00

「可観測性」といい、システムの外部から、システム内部の状態が推測・把握できるかという意味です。

システムの状態把握に必要なものと、それに対応する AWS サービスは次のとおりです。

- ログ　 ⇒ CloudWatch Logs
- メトリクス　 ⇒ CloudWatch Metrics
- トレース　 ⇒ X-Ray

## CloudWatch Metrics

Duration: 0:01:00

メトリクスを収集し、統計を取得

- 名前空間＞ディメンション＞メトリクス
- 次の統計が使用可能
  - Minimum
  - Maximum
  - Sum
  - Average
  - SampleCount
  - パーセンタイル

## CloudWatch Metric Math

Duration: 0:03:00

[Metric Math を使用する](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/using-metric-math.html)

メトリクスに数式を使用して新しいメトリクスを作成できます

コンソールで、CloudWatch メトリクスを表示している状態で、[数式の追加]を選択します。

![CloudWatchMetricMath1](/images/cloudwatch/CloudWatchMetricMath1.png)

既に表示しているメトリクスの Id 列の文字列を使うことで、演算が可能です。単純な四則演算や、SUM や AVG といった集計も利用できます。

![CloudWatchMetricMath2](/images/cloudwatch/CloudWatchMetricMath2.png)

ここで作成した数式使ってアラームを作成することができます。

![CloudWatchMetricMath3](/images/cloudwatch/CloudWatchMetricMath3.png)

## CloudWatch Metric Streams

Duration: 0:03:00

[メトリクスストリームの使用](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-Metric-Streams.html)

ほぼリアルタイムにメトリクスを Kinesis 経由で送信するサービスです。
AWS サービスはもちろん、New Relic や Datadog のような外部の SaaS 、HTTP エンドポイントと連携できます。

設定は、コンソールから メトリクス＞ストリーム を選択し、[メトリクスストリームの作成]から作成できます。

![CloudWatchMetricStreams1](/images/cloudwatch/CloudWatchMetricStreams1.png)

![CloudWatchMetricStreams2](/images/cloudwatch/CloudWatchMetricStreams2.png)

![CloudWatchMetricStreams3](/images/cloudwatch/CloudWatchMetricStreams3.png)

## CloudWatch Alarms

Duration: 0:03:00

![CloudWatchAlarm](/images/cloudwatch/CloudWatchAlarm.png)

![CloudWatchAlarm1](/images/cloudwatch/CloudWatchAlarm1.jpg)

メトリクスを監視し、敷居値を超えた場合にアクションを実行できます。
アクションには、SNS のトピックや Lambda を呼び出すなどができます

２つ以上のアラームを組み合わせた `複合アラーム` も設定できます。

```text
ALARM(CPUUtilizationTooHigh) AND ALARM(DiskReadOpsTooHigh)
```

アラームをテストするには、AWS CLI の `aws cloudwatch set-alarm-state` を利用してステータスを強制的に変更し アラームを実行させる方法があります。
ほかには、すぐにアラームが実行されるような敷居値にする、という方法もありますが、値を変更しないでテストできる `set-alarm-state` のほうがいいでしょう。

## CloudWatch Logs

Duration: 0:03:00

ログを集約できるサービスです。ロググループ＞ログストリーム という形式で格納されます。
ロググループ単位で保存期間を任意に設定することで、コスト削減できます。

サブスクリプションフィルターを使うことで、ログから任意の文字（ERROR など）を検知し、処理(kinesis や Lmabda に連携)を行うできます。

kinesis と連携することでログを S3 に転送することもできます
[CloudWatch Logs サブスクリプションフィルターの使用](https:/cs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logsbscriptionFilters.html)

## CloudWatch エージェント

Duration: 0:03:00

[CloudWatch エージェントを使用して Amazon EC2 インスタンスとオンプレミスサーバーからメトリクスとログを収集する](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)

EC2 やオンプレミスサーバに CloudWatch エージェントをインストールすることで、ログファイルを CloudWatch Logs に転送したり、標準では取得できないメモリなどのメトリクスを CloudWatch に転送することができます。

エージェントは、次の方法でインストールできます

- [CloudWatch エージェントパッケージをダウンロードする](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/download-cloudwatch-agent-commandline.html)

- [AWS Systems Manager を使用したインストール](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/download-CloudWatch-Agent-on-EC2-Instance-SSM-first.html)

オンプレミスサーバにもエージェントをインストールし、メトリクスやログを収集することができます。オンプレミスサーバ上の `~/.aws/credentials` に aws_access_key_id と aws_secret_access_key を設定します。

- [オンプレミスサーバーへの CloudWatch エージェントのインストール](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/install-CloudWatch-Agent-on-premise.html)

## CloudWatch Dashboards

Duration: 0:01:00

![CloudWatchDashboards](/images/cloudwatch/CloudWatchDashboards.jpg)

CloudWatch にて収集したデータをグラフなどで表示するサービスです

## CloudWatch Events / EventBridge

Duration: 0:01:00

現在は、拡張された Amazon EventBridge を利用します
時間や、他のリソースなど、イベント駆動アーキテクチャを実現するためのサービスです

## CloudWatch Metrics Insights

Duration: 0:03:00

[CloudWatch Metrics Insights を使用してメトリクスをクエリする](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/query_with_cloudwatch-metrics-insights.html)

![CloudWatchMetricsInsights](/images/cloudwatch/CloudWatchMetricsInsights.png)

`Metric Math` を使うことで、四則演算、最大最小などを求めることはできますが、式が複雑になりがちです。

`Metrics Insights` を使うことで、SQL によるメトリクスの集計が可能になります。次のような構文で分析を行うことができます。

```text
SELECT FUNCTION(metricName)
FROM namespace | SCHEMA(...)
[ WHERE labelKey OPERATOR labelValue [AND ... ] ]
[ GROUP BY labelKey [ , ... ] ]
[ ORDER BY FUNCTION() [ DESC | ASC ] ]
[ LIMIT number ]
```

SQL が書けなくてもクエリビルダーを使うことで簡単に作成することができます。

![CloudWatchMetricsInsights2](/images/cloudwatch/CloudWatchMetricsInsights2.png)

## CloudWatch Logs Insights

Duration: 0:03:00

[チュートリアル: サンプルクエリを実行および変更する](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/logs/CWL_AnalyzeLogData_RunSampleQuery.html)

クエリ言語を使用して、ロググループを検索、集計できます

```text
fields @message
  | parse @message "[*] *" as loggingType, loggingMessage
  | filter loggingType = "ERROR"
  | display loggingMessage
```

![CloudWatchLogsInsights](/images/cloudwatch/CloudWatchLogsInsights.jpg)

## CloudWatch Container Insights

Duration: 0:03:00

![CloudWatchContainerInsights](/images/cloudwatch/CloudWatchContainerInsights.jpg)

[Container Insights の使用](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContainerInsights.html)

タスクやコンテナ単位のメトリクスが、Container Insights によって取得できるようになるサービスです。

![CloudWatchContainerInsights1](/images/cloudwatch/CloudWatchContainerInsights4-600.jpg)

![CloudWatchContainerInsights1](/images/cloudwatch/CloudWatchContainerInsights5-600.jpg)

ECS コンテナのクラスター設定で `有効` にすることで利用できます。

![CloudWatchContainerInsights1](/images/cloudwatch/CloudWatchContainerInsights1.png)

[アカウント設定] を使うことで、アカウントレベルで設定を行い、アカウント内で作成される ECS クラスタに対して Container Insights を有効にすることができます。

![CloudWatchContainerInsights2](/images/cloudwatch/CloudWatchContainerInsights2.png)

収集されたメトリクスは、`ECS/ContainerInsights` 名前空間にあります。
[Container Insights により収集されるメトリクス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Container-Insights-metrics.html)

![CloudWatchContainerInsights3](/images/cloudwatch/CloudWatchContainerInsights3.png)

## CloudWatch Lambda Insights

Duration: 0:03:00

[Lambda Insights の使用](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Lambda-Insights.html)

![LambdaInsights1](/images/cloudwatch/LambdaInsights1.png)

サーバーレスアプリケーションの Lambda 関数ランタイムパフォーマンスメトリクスとログを収集および集計できるサービスです。

使用したい Lambda 関数の [設定＞モニタリングおよび運用ツール]から、「拡張モニタリング」を `ON` にすることで利用できます。

![LambdaInsights2](/images/cloudwatch/LambdaInsights2.png)

[Lambda Insights によって収集されたメトリクス](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Lambda-Insights-metrics.html) に記載がありますが、`init_duration` メトリクスが取得できるようになるので、コールドスタートの時間も分析できます。
また、`memory_utilization` メトリクスにより関数に割り当てられたメモリの使用率も取得することができます。

## CloudWatch Contributor Insights

Duration: 0:03:00

[Contributor Insights を使用した高カーディナリティデータの分析](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/ContributorInsights.html)

![CloudWatchContributorInsights](/images/cloudwatch/CloudWatchContributorInsights.jpg)

CloudWatch Logs の特定箇所を抽出して、可視化することができます。
例えば、VPC フローログを CloudWatch Logs に出力している場合、サンプルルールを使用することで簡単に可視化できます。

![CloudWatchContributorInsights2](/images/cloudwatch/CloudWatchContributorInsights2.jpg)

![CloudWatchContributorInsights3](/images/cloudwatch/CloudWatchContributorInsights3.jpg)

他にも CloudWatch Logs にログを出力していれば、アプリケーションのログを分析することが可能です。

## CloudWatch Application Insights

Duration: 0:03:00

[Amazon CloudWatch Application Insights](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/cloudwatch-application-insights.html)

特定のリソースのメトリクスだけでなく、リソースグループという単位で Amazon EC2 インスタンスを使用するアプリケーションをまとめて監視、通知できるサービスです。

CloudWatch コンソールから、[Application Insight の使用を開始する] から設定するだけです。

![CloudWatchApplicationInsights1](/images/cloudwatch/CloudWatchApplicationInsights1.png)

![CloudWatchApplicationInsights2](/images/cloudwatch/CloudWatchApplicationInsights2.png)

セットアップ後、アラームも自動で作成されています。

![CloudWatchApplicationInsights3](/images/cloudwatch/CloudWatchApplicationInsights3.png)

ダッシュボードでアラームを確認することができます。

![CloudWatchApplicationInsights4](/images/cloudwatch/CloudWatchApplicationInsights4.png)

## CloudWatch ServiceLens

Duration: 0:03:00

![CloudWatchServiceLens](/images/cloudwatch/CloudWatchServiceLens.jpg)

様々なリソースの情報を 1 カ所に統合して可視化するサービスで、マイクロサービスなどで特に効果を発揮します。X-Ray と連携します。

![CloudWatchServiceLens1](/images/cloudwatch/CloudWatchServiceLens1-600.jpg)

![CloudWatchServiceLens2](/images/cloudwatch/CloudWatchServiceLens2-600.jpg)

## CloudWatch Resource Health

Duration: 0:03:00

CPU やメモリの使用率の状況を視覚的に把握することができるサービスです。管理している EC2 の台数が多い場合はカッコイイ表示ができます。

![CloudWatchResourceHealth](/images/cloudwatch/CloudWatchResourceHealth.png)

[引用元：Introducing CloudWatch Resource Health to monitor your EC2 hosts | AWS Management & Governance Blog](https://aws.amazon.com/jp/blogs/mt/introducing-cloudwatch-resource-health-monitor-ec2-hosts/)

デフォルトではマップ表示ですが、表示形式を切り替えることができます。
（先ほどの引用画像とは異なり、EC2 が少なく、停止しているような状態では少々さみしい感じになってしまいます）

マップ表示
![CloudWatchResourceHealth1](/images/cloudwatch/CloudWatchResourceHealth1.jpg)

リスト表示では、EC2 コンソールと似ていますが、CPU やメモリの使用率が一覧で見られる点が異なります。

![CloudWatchResourceHealth2](/images/cloudwatch/CloudWatchResourceHealth2.jpg)

## CloudWatch Synthetics

Duration: 0:03:00

![CloudWatchSynthetics](/images/cloudwatch/CloudWatchSynthetics.jpg)

[模擬モニターリングの使用](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html)

Web サイトや URL、REST API に対してのモニタリングを自動で実行可能なサービスで、Web サイトの死活監視も可能です。
同様の機能に、Route53 の HealthCheck がありますが、こちらよりも複雑な条件を設定することができ、実際にユーザーがアクセスするようなパラメータを再現できます。

テンプレートがあるので、簡単に作成することができます。

![CloudWatchSynthetics1](/images/cloudwatch/CloudWatchSynthetics1.jpg)

失敗した場合はこのようになります。

![CloudWatchSynthetics2](/images/cloudwatch/CloudWatchSynthetics2.jpg)

スクリーンショットを取得するようにしていると、このように確認することができます。

![CloudWatchSynthetics2ss](/images/cloudwatch/CloudWatchSynthetics2ss.jpg)

成功の場合はこのようになります。

![CloudWatchSynthetics5](/images/cloudwatch/CloudWatchSynthetics5.jpg)

削除する場合は、一度[中止]してから[削除]を行います。スクリーンショットなどの出力先である S3 バケットは削除されませんので、後で削除する必要があります。

![CloudWatchSynthetics3](/images/cloudwatch/CloudWatchSynthetics3.jpg)

チェックした結果は、`CloudWatchSynthetics` 名前空間にメトリクスがあるので、アラームを設定することもできます。

![CloudWatchSynthetics4](/images/cloudwatch/CloudWatchSynthetics4.jpg)

## CloudWatch Evidently

Duration: 0:02:00

![CloudWatchEvidently](/images/cloudwatch/CloudWatchEvidently.jpg)

機能フラグ(フィーチャーフラグ:Feature Flag)と A/B テストが実施できるサービスです。

機能フラグとは、「コードを書き換えることなく動的にシステムの振る舞いを変更できる」開発手法です。

たとえば、DB のエンドポイントを渡すことで動的に切り替える、特定のユーザーやある割合のユーザーのみに機能を公開し、徐々に割合を増やしていくといったケースで使われます。

![CloudWatchEvidently1](/images/cloudwatch/CloudWatchEvidently1.jpg)

![CloudWatchEvidently2](/images/cloudwatch/CloudWatchEvidently2.jpg)

![CloudWatchEvidently3](/images/cloudwatch/CloudWatchEvidently3.jpg)

## CloudWatch Real-User Monitoring (RUM)

Duration: 0:01:00

![CloudWatchRUM](/images/cloudwatch/CloudWatchRUM.png)

[CloudWatch RUM を使用する](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM.html)

JavaScript のコードスニペットをクライアントアプリに埋め込んでデータを収集し、ダッシュボードで可視化できます。

サイト訪問者の地域やブラウザ、動線を統計分析してくれる機能です。

## CloudWatch Anomaly Detection

Duration: 0:03:00

[CloudWatch 異常検出の使用](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/CloudWatch_Anomaly_Detection.html)

CloudWatch メトリクス上の異常値を自動検出ができるサービスです。

CloudWatch アラームを作成するときに、適正な閾値を設定するのは容易ではありません。平日・休日、日中・夜間、キャンペーン時期などなど、考慮することが多いです。

そのようなときに、利用するのが本サービスです。機械学習により異常値を自動検出できます。

![CloudWatchAnomalyDetection](/images/cloudwatch/CloudWatchAnomalyDetection.png)

自動検出を有効にしたメトリクスでは、予想される範囲がグレーで表示され、異常値と判定したところが赤線になっています。

アラーム設定では、[静的]ではなく[異常値]にすることで利用できます。

![CloudWatchAnomalyDetection1](/images/cloudwatch/CloudWatchAnomalyDetection1.png)

[異常検出に基づく CloudWatch アラームの作成](https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/monitoring/Create_Anomaly_Detection_Alarm.html)

## One Observability Workshop

監視系のサービスを学べるワークショップ。3~4 時間ほどで終わるが、下記構成図から分かるように様々なサービスを利用するので、ある程度の課金を覚悟して使う。

https://catalog.us-east-1.prod.workshops.aws/workshops/31676d37-bbe9-4992-9cd1-ceae13c5116c/ja-JP

![One Observability Workshop](/images/cloudwatch/PetAdoptions_architecture.png)

## 📖 まとめ

![CloudWatch](/images/all/cloudwatch.png)
