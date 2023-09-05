# AWS Systems Manager（SSM）:運用管理

## はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## Contents

Duration: 00:01:00

- [AWS Systems Manager（SSM）:運用管理](#aws-systems-managerssm運用管理)
  - [はじめに](#はじめに)
  - [Contents](#contents)
  - [運用管理の機能](#運用管理の機能)
  - [エクスプローラー](#エクスプローラー)
    - [エクスプローラーの料金](#エクスプローラーの料金)
  - [インシデントマネージャー](#インシデントマネージャー)
    - [インシデントマネージャーの料金](#インシデントマネージャーの料金)
  - [OpsCenter](#opscenter)
    - [OpsCenterの料金](#opscenterの料金)

## 運用管理の機能

Duration: 00:01:00

- 運用管理
  - エクスプローラー
  - OpsCenter
  - インシデントマネージャー

【AWS Black Belt Online Seminar】[AWS Systems Manager Explorer / OpsCenter 編(YouTube)](https://www.youtube.com/watch?v=XXG88mXS6_E)(30:03)

![black-belt-ssm-explorer-opscenter](/images/ssm/black-belt-ssm-explorer-opscenter-s.jpg)

【AWS Black Belt Online Seminar】[AWS Systems Manager Incident Manager 編(YouTube)](https://www.youtube.com/watch?v=03MiGRe9fkI)(23:46)

![black-belt-ssm-incident-manager](/images/ssm/black-belt-ssm-incident-manager-s.jpg)

## エクスプローラー

Duration: 00:03:00

[AWS Systems Manager Explorer](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/Explorer.html)

複数リージョンやアカウントの運用状況をひと目で把握できるダッシュボードのサービスです。

![explorer.png](/images/ssm/explorer.png)

![explorer-dashboard](/images/ssm/explorer-dashboard.png)

「AWS Support Center のケース」と、「AWS Trusted Advisor」を表示するには、サポートプランがエンタープライズまたはビジネスが必要です。

### エクスプローラーの料金

無料で利用できます。

[エクスプローラーの料金](https://aws.amazon.com/jp/systems-manager/pricing/#Explorer)

## インシデントマネージャー

Duration: 00:03:00

[AWS Systems Manager Incident Manager](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/incident-manager.html)

[AWS Systems Manager の Incident Manager のご紹介-May 10, 2021](https://aws.amazon.com/jp/about-aws/whats-new/2021/05/introducing-incident-manager-aws-systems-manager/)

CloudWatch Alarm や EventBrige Events から検出された様々な異常状態やイベントをインシデントとして管理することが可能になります。

```text
※インシデント
サービスにおける計画外の中断やサービス品質の低下をもたらすもの
```

インシデントは、「検知 > 調査と対応 > 分析」 を繰り返していく必要があります。そのための機能が提供されています。
詳しくは、【AWS Black Belt Online Seminar】[AWS Systems Manager Incident Manager 編(YouTube)](https://www.youtube.com/watch?v=03MiGRe9fkI) を参照します。

![incident-manager-sample1.png](/images/ssm/incident-manager-sample.png)

![incident-manager-sample2.png](/images/ssm/incident-manager-sample-2.png)

### インシデントマネージャーの料金

[インシデントマネージャーの料金](https://aws.amazon.com/jp/systems-manager/pricing/#Incident_Manager)

## OpsCenter

Duration: 00:03:00

[AWS Systems Manager OpsCenter](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/OpsCenter.html)

CloudWatch Events と連携して AWS リソースの運用上の問題、イベント、アラート等をOpsItems として集中管理する機能を提供しています。

AWS リソースに関する運用項目を `OpsItem` として管理します。

![ops](/images/ssm/ops.png)

詳しくは、【AWS Black Belt Online Seminar】[AWS Systems Manager Explorer / OpsCenter 編(YouTube)](https://www.youtube.com/watch?v=XXG88mXS6_E) を参照します。

### OpsCenterの料金

[OpsCenterの料金](https://aws.amazon.com/jp/systems-manager/pricing/#OpsCenter)
