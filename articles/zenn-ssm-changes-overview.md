---
title: "【初心者向け】Systems Manager（SSM） 入門！完全ガイド⑤（変更管理機能編）" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study"]
published: true
---

# AWS Systems Manager（SSM）:変更管理<!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

<!-- Duration: 00:01:00 -->

- [変更管理の機能](#変更管理の機能)
- [メンテナンスウィンドウ](#メンテナンスウィンドウ)
  - [メンテナンスウィンドウの料金](#メンテナンスウィンドウの料金)
- [オートメーション](#オートメーション)
  - [オートメーションの料金](#オートメーションの料金)
- [Change Manager](#change-manager)
  - [Change Manager の料金](#change-manager-の料金)
- [変更カレンダー](#変更カレンダー)
  - [変更カレンダーの料金](#変更カレンダーの料金)

## 変更管理の機能

<!-- Duration: 00:01:00 -->

- 変更管理
  - メンテナンスウィンドウ
  - オートメーション
  - Change Manager
  - Change Calendar

## メンテナンスウィンドウ

<!-- Duration: 00:01:00 -->

[AWS Systems Manager Maintenance Windows](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-maintenance.html)

パッチ適用やソフトウェアのインストール、OS のアップグレードなどの一連のタスクをスケジュール実行できる機能です。

![maintenance-window](/images/ssm/maintenance-window.png)

### メンテナンスウィンドウの料金

無料で利用できます。

[メンテナンスウィンドウの料金](https://aws.amazon.com/jp/systems-manager/pricing/#Maintenance_Windows)

## オートメーション

<!-- Duration: 00:01:00 -->

[AWS Systems Manager Automation](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-automation.html)

インスタンス上でリモートコマンドを実行できるようにしたものです。
自動化ではリモート命令以外にも、例えば実行の一部として AWS の API を利用することができます。
SSM 自動化タイプのドキュメントを利用することで、多くの段階を組み合わせて複雑なタスクを完了させることもあります。
なお、SSM サービス上で動作する自動ドキュメントの最大実行時間 AWS アカウントと AWS リージョンあたり、1,000,000 秒となります。

### オートメーションの料金

ステップの数と実行時間で課金されます。

[オートメーションの料金](https://aws.amazon.com/jp/systems-manager/pricing/#Automation)

## Change Manager

<!-- Duration: 00:03:00 -->

[AWS Systems Manager Change Manager](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/change-manager.html)

AWS の変更管理といえば、「AWS CloudTrail」や「AWS Config」を利用した証跡管理があります。ただ、これらは変更があった事実を記録しているだけであり、変更に至った経緯などは記録できていません。

そこで、「アプリケーションの設定とインフラストラクチャに対する運用上の変更をリクエスト、承認、実装、および報告するためのエンタープライズ変更管理フレームワーク」を提供する Change Manager を利用します。

![change-manager](/images/ssm/change-manager.png)

テンプレートには、オートメーションのドキュメントを指定することができます。

例えば、EC2 の起動 `AWS-StartEC2Instance` をワークフロー化することができます。
![change-manager-start-ec2](/images/ssm/change-manager-start-ec2.png)

他には、`AWS-AttachEBSVolume`や `AWS-StopRdsInstance` などがあります。

### Change Manager の料金

「変更リクエスト件数」とそれによって実行された「API リクエスト数」で課金されます。

[Change Manager の料金](https://aws.amazon.com/jp/systems-manager/pricing/#Change_Manager)

## 変更カレンダー

<!-- Duration: 00:10:00 -->

[AWS Systems Manager Change Calendar](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-change-calendar.html)

重要なイベントや負荷が集中する時間帯、バッチ処理が行われる時間帯などを設定することで、定期実行処理を回避することができます。

作成するカレンダーは次の 2 種類が選択できます。

- Open by default (デフォルトでオープン)
  - カレンダーに作成されたイベントの期間を休業日、つまり「CLOSE」と扱うカレンダーになります。
- Closed by default (デフォルトでクローズ)
  - カレンダーに作成されたイベントの期間を営業日、つまり「OPEN」と扱うカレンダーになります。

この違いは、カレンダーを使って日付を判定するときの結果に影響します。

`at-time` で指定した日時をカレンダーで「OPEN」であるのか「CLOSED」であるのかを判定させます。このパラメータを省略した場合は、現在日時が使用されます。

※ 日時の指定は、厳密な「[ISO 8601](https://ja.wikipedia.org/wiki/ISO_8601)」の書式に準拠している必要があります。

```sh
aws ssm get-calendar-state \
    --calendar-names "arn:aws:ssm:ap-northeast-1:123456789012:document/calendar-name" \
    --at-time "2023-09-18T00:00:00+09:00"
```

このような結果が返ってきます。`State` が判定結果です。
`AtTime` はコマンドで与えた日時です。UTC になっているので注意です。
`NextTransitionTime` は、次に `State` が変化する日時です。`AtTime` の日時が "OPEN"ならば "CLOSED"、"CLOSED" ならば "OPEN" となる日時です。

```json
{
  "State": "CLOSED",
  "AtTime": "2023-09-17T15:00:00Z",
  "NextTransitionTime": "2023-09-18T15:00:00Z"
}
```

`ssm get-calendar-state` のパラメータ `calendar-names` にはカレンダーを複数指定して組み合わせて判定することができます。

```sh
aws ssm get-calendar-state \
    --calendar-names "arn:aws:ssm:ap-northeast-1:123456789012:document/calendar-name1" \
                      "arn:aws:ssm:ap-northeast-1:123456789012:document/calendar-name2" \
    --at-time "2023-09-18T00:00:00+09:00"
```

- 複数のカレンダーを指定した場合、全てのカレンダーで「OPEN」の場合に「OPEN」となります。
- どれか一つでも「CLOSED」となっている場合は「CLOSED」と判定されます。
  - この判定ロジックの仕様上、カレンダー上は休業日だが、臨時営業日とするといった場合は別のカレンダーのみを使用して判定する必要があります。

また、他のカレンダーをインポートすることもできます。
Google の祝日カレンダーの `iCal 形式の公開 URL` から ics ファイルをダウンロードします。

```text
※ 祝日は自動更新されませんので、手動でインポートするか、自動でインポートできるような仕組みを構築する必要があります。
例えば、「内閣府>「国民の祝日」について」から CSV 形式でダウンロードして利用することもできます。
2月に翌年のカレンダーが掲載されるようです。

内閣府>「国民の祝日」について
https://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html
```

ダウンロードした部分にタイムゾーンの記載があるので `UTC` から `Asia/Tokyo` 変更します。（ここを変更しないでインポートした場合は後述します。）

```text
X-WR-TIMEZONE:Asia/Tokyo
```

[Import calendar] で先ほどダウンロードした ics ファイルを指定します。

![change-calendar-import-1](/images/ssm/change-calendar/change-calendar-import-1.png)

![change-calendar-import-2](/images/ssm/change-calendar/change-calendar-import-2.png)

無事にインポートされました。

![google-holiday](/images/ssm/change-calendar/change-calendar-google-holiday.png)

先ほどタイムゾーンを `UTC` から `Asia/Tokyo` に変更しましたが、変更しないでインポートした場合は、次のようなカレンダーになります。

![-google-holiday-utc](/images/ssm/change-calendar/change-calendar-google-holiday-utc.png)

「敬老の日」が `Asia/Tokyo` では「2023/09/18 9:00 ～ 2023/09/19 9:00」になってしまっています。
![google-holiday-keirou](/images/ssm/change-calendar/change-calendar-google-holiday-utc-1.png)

これは、ics ファイルで敬老の日は次のように定義されているものを 「2023/09/18 00:00+0:00 ～ 2023/09/19 00:00+0:00」として UTC でインポートしてしまうためです。

```text
DTSTART;VALUE=DATE:20230918
DTEND;VALUE=DATE:20230919
DTSTAMP:20230905T140124Z
:
CLASS:PUBLIC
CREATED:20220927T105018Z
DESCRIPTION:祝日
LAST-MODIFIED:20220927T105018Z
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:敬老の日
```

UTC でインポートしたカレンダーを使用した場合、先ほどは 「CLOSED」と判定された日時　"2023-09-18T00:00:00+09:00"　は次のように「OPEN」と判定されました。

```sh
aws ssm get-calendar-state \
    --calendar-names "arn:aws:ssm:ap-northeast-1:123456789012:document/calendar-name3" \
    --at-time "2023-09-18T00:00:00+09:00"

{
    "State": "OPEN",
    "AtTime": "2023-09-17T15:00:00Z",
    "NextTransitionTime": "2023-09-18T00:00:00Z"
}
```

Lambda など、Python を使って取得する場合は、[get_calendar_state](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/ssm/client/get_calendar_state.html#) を使用します。

```py
client = boto3.client('ssm')

response = client.get_calendar_state(
    CalendarNames=[
        '＜カレンダーの名前またはARN＞',
        '＜カレンダーの名前またはARN＞',
    ],
    AtTime='＜判定対象の日付時刻 (省略時は現在時刻)＞'
)

{
    'State': 'OPEN'|'CLOSED',
    'AtTime': 'string',
    'NextTransitionTime': 'string'
}
```

### 変更カレンダーの料金

無料で利用できます。