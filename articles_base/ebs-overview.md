# Amazon Elastic Block Store(EBS)<!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

<!-- Duration: 00:01:00 -->

- [Amazon EBS とは](#amazon-ebs-とは)
- [EBS の基本](#ebs-の基本)
- [IOPS(Input/Output Operations Per Second)](#iopsinputoutput-operations-per-second)
- [EBS の種類](#ebs-の種類)
  - [SSD](#ssd)
  - [HDD](#hdd)
  - [参考：コスト比較（東京リージョンの場合）](#参考コスト比較東京リージョンの場合)
- [EBS マルチアタッチ](#ebs-マルチアタッチ)
- [ルートボリュームを置き換える](#ルートボリュームを置き換える)
- [スナップショット](#スナップショット)
  - [スナップショットのコピー](#スナップショットのコピー)
- [暗号化](#暗号化)
  - [暗号化されていないボリュームを暗号化するには？](#暗号化されていないボリュームを暗号化するには)
  - [暗号化されているボリュームの暗号化を解除するには？](#暗号化されているボリュームの暗号化を解除するには)
- [パフォーマンス](#パフォーマンス)
- [モニタリング](#モニタリング)

## Amazon EBS とは

Amazon Elastic Block Store (EBS) は、AWS EC2 インスタンスで使用するための永続的な**ブロックストレージ**サービスです。

【AWS Black Belt Online Seminar】[xx(YouTube)](https://www.youtube.com/watch?v=ffND-tX1Qxs)(0:55:30)

![xx](/images/blackbelt/blackbelt-ebs-320.jpg)

[Amazon EBS サービス概要](https://aws.amazon.com/jp/ebs/)

[Amazon EBS ドキュメント](https://docs.aws.amazon.com/ja_jp/ebs/?id=docs_gateway)

[Amazon EBS よくある質問](https://aws.amazon.com/jp/ebs/faqs/)

[Amazon EBS の料金](https://aws.amazon.com/jp/ebs/pricing/)

## EBS の基本

<!-- Duration: 0:01:30 -->

![ebs](/images/ebs/ebs.png)

- EC2 にアタッチして使用します
- EBS はブロックストレージサービスです
- EBS は AZ の単位です
  - ![ebs-az](/images/ebs/ebs-az.png)
- EC2 にアタッチする EBS は同一 AZ のみです。
  - ![ebs-az-ec2](/images/ebs/ebs-az-ec2.png)
- EC2 のルートボリュームはデフォルトでは EC2 が終了すると削除されます。ただし、下記手順で保持することが可能です。
  - [Amazon EC2 インスタンスの終了後も Amazon EBS ルートボリュームを保持する](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/configure-root-volume-delete-on-termination.html)
    - EC2 起動時のみコンソールで指定可能
    - 起動後は、CLI で設定
- EBS には SSD タイプと HDD タイプがあります。
  - SSD タイプはアクセス頻度が高く、パフォーマンス重視
  - HDD タイプは、大容量の処理に優れている
- オンプレサーバの物理的なディスクに近いイメージを持つかもしれないが、EBS はネットワーク接続型です。Windows でいうとネットワークドライブを割り当てているイメージが近いかもしれません。
  - ![ebs-nw](/images/ebs/ebs-nw.png)

## IOPS(Input/Output Operations Per Second)

EBS を知る上では、IOPS を理解しておく必要があります。

Input/Output Operations Per Second という意味であり、1 秒間に読み取り/書き込みできる量で、小さなランダム I/O 操作（通常 4KB または 16KB→[ブロックサイズを参照](https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/volume_constraints.html#block_size)）の処理能力を示します。

データベース、トランザクション処理システムなど、高頻度の小規模 I/O 操作を必要とするワークロードのパフォーマンスに直接影響しますので、重要な指標です。

IOPS が高いからといって、例レイテンシであるとは限らない点には注意が必要です。

IOPS を最適化する上で [EBS 最適化インスタンス](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/ebs-optimized.html)の利用も考慮します。
一部のインスタンスではデフォルトで有効になっている EBS 専用の帯域が確保される機能です。
また、IOPS は単純に高ければよいというものではないので、アプリケーションの要件、コスト、インスタンスタイプなどを総合的に考慮する必要があります。

![ebs-optimized](/images/ebs/ebs-optimized.png)

## EBS の種類

[Amazon EBS ボリュームタイプ](https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/ebs-volume-types.html)

![volume-type](/images/ebs/ebs-volume-types.png)

### SSD

- 汎用（General Purpose） SSD
  - ユースケース：中規模などワークロード、データベース
  - gp3 / gp2(旧世代)
    - 耐久性: 99.8%～ 99.9%
    - ボリュームサイズ: 1 GiB から 16 TiB
    - IOPS:
      - gp3: ボリュームサイズに関係なく、3,000 IOPS から 16,000 IOPS を指定可能
        - ![ebs-gp3](/images/ebs/ebs-gp3.png)
        - ただし、60GiB 未満は、500 IOPS/ GiB によって計算される値に変更する必要がある
        - ![less60](/images/ebs/ebs-gp3-less60.png)
      - gp2: ボリュームサイズによって、3 IOPS/ GiB のレートで決定される。100 ～ 16,000 IOPS
        - ![ebs-gp2](/images/ebs/ebs-gp2.png)
    - スループット:
      - gp3: 125 MiB/s から 1,000 MiB/s
      - gp2: 128 MiB/s から 250 MiB/s
    - [gp2 から gp3 への変更](https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/ebs-modify-volume.html)
- プロビジョンド IOPS SSD
  - ユースケース：ミリ秒未満のレイテンシーなど、高い IOPS が必要なワークロード、データベース
  - io2 Block Express
    - io2 の後継で、2023 年 11 月 21 日以降は io2 Block Express
    - 最も要求の厳しい I/O 集約型アプリケーションのパフォーマンス要件を満たす目的
    - 耐久性: 99.999%
    - ボリュームサイズ: 4 GiB から 64 TiB
    - IOPS: ～ 256,000 IOPS
      - 1,000 IOPS/ GiB なのでボリュームサイズ 256 GiB で最大値に達する
    - スループット: 4,000 MiB/s
      - 0.256 MiB/s/IOPS なので 16,000 IOPS で最大値に達する
    - マルチアタッチ: OK
  - io1
    - 耐久性: 99.8%～ 99.9%
    - ボリュームサイズ: 1 GiB から 16 TiB
    - IOPS: ～ 64,000 IOPS
      - 50 IOPS/ GiB なのでボリュームサイズ 1,280 GiB で最大値に達する
    - スループット: 1,000 MiB/s
      - 0.016 MiB/s/IOPS なので 640,000 IOPS で最大値に達する
    - マルチアタッチ: OK

### HDD

- スループット最適化 HDD (st1)
  - ユースケース: 大規模なシーケンシャル I/O を含むワークロードに最適化,ビッグデータ,ログ処理,分析
    - 耐久性: 99.8%～ 99.9%
    - ボリュームサイズ: 125 GiB から 16 TiB
    - IOPS: ～ 500 IOPS
    - スループット: 500 MiB/s
- コールド HDD (sc1)
  - ユースケース: アクセス頻度の低いワークロード向けの最も低コスト
    - 耐久性: 99.8%～ 99.9%
    - ボリュームサイズ: 125 GiB から 16 TiB
    - IOPS: ～ 250 IOPS
    - スループット: 250 MiB/s

### 参考：コスト比較（東京リージョンの場合）

| 種類              | ストレージ    | IOPS            | スループット    | 2,000 GiB の場合の料金 |
| ----------------- | ------------- | --------------- | --------------- | ---------------------- |
| gp3               | 0.096 USD/GiB | 0.006 USD/IOPS  | 0.048 USD/MiB/s | 192 USD/月             |
| gp2               | 0.120 USD/GiB |                 |                 | 240 USD/月             |
| io2 Block Express | 0.142 USD/GiB | \*1             |                 | 284 USD/月             |
| io1               | 0.142 USD/GiB | 0.0740 USD/IOPS |                 | 284 USD/月             |
| st1               | 0.054 USD/GiB |                 |                 | 108 USD/月             |
| sc1               | 0.018 USD/GiB |                 |                 | 36 USD/月              |

\*1 32,000 IOPS まで: 0.0740 USD/IOPS, 64,000 IOPS まで: 0.046 USD/IOPS, 64,000 IOPS 以上: 0.032 USD/IOPS

## EBS マルチアタッチ

[Amazon EBS マルチアタッチを使用した複数のインスタンスへのボリュームのアタッチ](https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/ebs-volumes-multi.html)

プロビジョンド IOPS SSD で利用できる機能で、同一の AZ にある複数のインスタンスにボリュームをアタッチできます。
クラスタリングされたデータベースや High Availability シナリオに有用

以下の制約があります。

- EC2 と同一の AZ のみ
- 最大 16 のインスタンスに同時アタッチ可能
- Linux は io1/io2 で利用可能
- Windows は io2 で利用可能
- アプリケーション側で同時書き込みの排他制御を担保する必要がある
  - [NVMe 予約](https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/nvme-reservations.html)
- XFS や EXT4 などの標準ファイルシステムは、EC2 インスタンスなどの複数のサーバーから同時にアクセスできるように設計されていません。
  - クラスター化されたファイルシステムを使用する必要がある

単純なファイルの共有方法としては使えないことに注意が必要です。参考：[EBS マルチアタッチボリュームを使用して複数の EC2 インスタンスを有効にし、標準のファイルシステムに同時にアクセスすることはできますか?](https://repost.aws/ja/knowledge-center/ebs-access-volumes-using-multi-attach)

この機能は、RedHat 社が開発した [GFS2(Global File System 2)](https://docs.redhat.com/ja/documentation/red_hat_enterprise_linux/7/html/global_file_system_2/ch-overview-gfs2) や、オラクル社が開発した [OCFS2 (Oracle Cluster File System 2)](https://docs.oracle.com/cd/E39368_01/adminsg/ol_about_ocfs2.html) といった分散ファイルシステムで使うことが前提の機能です。

[AWS Storage Blog > Clustered storage simplified: GFS2 on Amazon EBS Multi-Attach enabled volumes](https://aws.amazon.com/jp/blogs/storage/clustered-storage-simplified-gfs2-on-amazon-ebs-multi-attach-enabled-volumes/)

## ルートボリュームを置き換える

[ルートボリュームを置き換える](https://docs.aws.amazon.com/ja_jp/AWSEC2/latest/UserGuide/replace-root.html#replace)

- EC2 インスタンスを停止することなく、ルートボリュームを置き換えることができます。
- インスタンスが実行中のみ置き換えることができます。
- ただし、再起動によるダウンタイムは発生します。
- ルートボリュームを置き換えるスナップショットは 置き換える EBS から作成されたものでなくてはいけません。
  - スナップショットのコピーで作成したものは置き換えに使用できません。

![root-volume](/images/ebs/ebs-rootvolume-change.png)

## スナップショット

[スナップショットの仕組み](https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/ebs-snapshots.html#how_snapshots_work)

![ebs-snapshot](/images/ebs/ebs-snapshot.png)

- 増分スナップショット
  - 変更されたブロックのみをバックアップ
  - スナップショット作成時間の短縮とストレージコストの削減
  - 過去のスナップショットが削除されても、最新のスナップショットがあれば全量が復元できるようになっている
  - この仕組みで、スナップショットを削除してもコストが減少しないことがある。

増分バックアップでは、初回はフルバックアップとなり、それ以降は更新したデータのみを保持し、
更新されていないデータは、過去のスナップショットを参照します。

![incremental](/images/ebs/ebs-snaphost-incremental.png)

スナップショットを削除すると、直後のスナップショットにデータが移動します。

![incremental-delete](/images/ebs/ebs-snaphost-incremental-delete.png)

- スナップショットのライフサイクル
  - [Amazon Data Lifecycle Manager (DLM)](https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/snapshot-lifecycle.html) を使用した自動化
  - タグベースのポリシー設定が可能

### [スナップショットのコピー](https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/ebs-copy-snapshot.html)

![snapshot-copy](/images/ebs/ebs-snapshot-copy.png)

- 転送中は、スナップショットが格納されている S3 の KMS で暗号化
- コピーしたスナップショットはオリジナルのスナップショットと異なる ID
  - ルートボリュームの入れ替えでは使えない
- コピー時に暗号化または、元の KMS と異なるキーで暗号化できる
  - この場合、フルサイズのコピーとなるのでストレージ料金に注意
- 共有されたスナップショットをコピーする場合は、KMS キーへのアクセス権限が必要
  - 共有されたスナップショットは自身の KMS で再暗号化してコピーしておくことを推奨
  - 元の KMS キーが侵害された、または所有者が取り消した場合、スナップショットを使用して作成した暗号化されたボリュームにアクセスできなくなる可能性があるため
- リージョンまたはアカウント間でのコピーの場合、初回コピーはフルサイズ、1 回でもフルバックアップのスナップショットをコピーしたことがある場合は、増分コピーとなる

## 暗号化

[Amazon EBS ボリュームの暗号化](https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/EBSEncryption.html)

EBS ボリュームの暗号化では、以下が暗号化されます。

- ボリューム内で保管中のデータ
- ボリュームとインスタンス間で移動されるデータ
- ボリュームから作成されたスナップショット
- スナップショットから復元された新しいボリューム

![ebs-encryption](/images/ebs/ebs-encryption-01.png)

暗号化は、AWS Key Management Service (KMS) によって行われます。

- デフォルトでは、AWS 管理の`aws/ebs` キーで暗号化されます。
- CMK を指定することもできます。

EBS 作成時に暗号化有無を指定できますが、デフォルトで暗号化するようにもできます。
[デフォルトで暗号化の有効化](https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/work-with-ebs-encr.html#encryption-by-default)

![default-encryption](/images/ebs/ebs-default-encryption-00.png)

![default-encryption](/images/ebs/ebs-default-encryption-01.png)

### 暗号化されていないボリュームを暗号化するには？

[暗号化されていないリソースの暗号化](https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/ebs-encryption.html#encrypt-unencrypted)

暗号化なしで作成した既存のボリュームまたはスナップショットを直接暗号化することはできません。

- ボリュームを暗号化するには、新しい暗号化されたボリュームを作成する必要があります。
  - ① 暗号化されていないボリュームを持つ EC2 からスナップショットを作成する（この時は暗号化はできない）
  - ② スナップショットのコピーで新しい暗号化されたスナップショットを作成する
  - ③ 暗号化されていないボリュームをデタッチ
  - ④ 暗号化されたスナップショットを使って、ボリュームをアタッチ（デバイス名はデタッチ前と同じにする）
- スナップショットを暗号化するには、スナップショットのコピーによって、新しい暗号化されたスナップショットを作成する必要があります。

![dec-enc](/images/ebs/ebs-dec-enc.png)

### 暗号化されているボリュームの暗号化を解除するには？

[Linux で暗号化された EBS ボリュームの暗号化を解除するにはどうすればいいですか?](https://repost.aws/ja/knowledge-center/create-unencrypted-volume-kms-key)

こちらの記事にある手順によると、次のように実施します。

- 別のインスタンスを作成（レスキューインスタンス）
- 暗号化していないボリュームをレスキューインスタンスにアタッチ
- ① 元のインスタンスから暗号化されている EBS を デタッチ
- ② レスキューインスタンスに暗号化 EBS をアタッチ
- ③ レスキューインスタンスの暗号化していないボリュームに、暗号化した EBS の内容をコピー
- ④ レスキューインスタンスのボリュームをデタッチ
- ⑤ 元のインスタンスにアタッチ

![decryption](/images/ebs/ebs-decryption.png)

## パフォーマンス

- EBS 最適化されたインスタンスを使用
- [RAID](https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/raid-config.html)
  - RAID 0（ストライピング） によって単一の EBS よりパフォーマンスが向上する
  - RAID 5（分散パリティ） および 6（複数分散パリティ） ではボリュームに使用できる IOPS の一部がパリティ（復元するために使われる符号）書き込み操作によって消費されるため、EBS では非推奨
  - RAID 1（ミラーリング） も非推奨。同時に複数ボリュームに書き込まれるため帯域を多く消費する
- 初期化：事前ウォーミング(Pre-Warming)
  - 以前は、「事前ウォーミング(Pre-Warming)」と呼ばれていた
  - スナップショットから復元したボリュームに限り必要になる
    - 参考：[EBS ボリュームの初期化](https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/ebs-initialize.html)
    - スナップショットの保存されている S3 からストレージにコピーされる事前処理があるため一定時間かかる
    - 各ブロックへの初回アクセス時には I/O はレイテンシーが著しく増加する可能性がある
    - 全てのブロックを読み込んだ状態にすることを初期化という
    - ただし、要件によってはこれを行うことが困難な場合がある
      - →「[高速スナップショット復元](https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/ebs-fast-snapshot-restore.html)」を有効にしたスナップショットにする

## モニタリング

- CloudTrail
- CloudWatch
  - メトリクスはデフォルトで 1 分間隔で送信される（無料）
  - 空き容量を AWS が提供するデフォルトのメトリクスで取得することはできない。CloudWatch エージェントを設定してインスタンスから送信する。参考：[空きディスク容量の表示](https://docs.aws.amazon.com/ja_jp/ebs/latest/userguide/ebs-describing-volumes.html#ebs-view-free-disk-space-lin)
- EventBridge
- GuardDuty

<!-- ## 📖 まとめ -->
