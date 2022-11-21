summary: Summary
id: claat-docs
categories: AWS
tags: Amazon S3
status: Published
authors: ishr
Feedback Link: 

# Simple Storage Service（S3）

## Contents
Duration: 00:30

- S3 とは
- S3 の基本
- バケットポリシー
- アクセスコントロールリスト（ACL）
- ライフサイクル
- ストレージタイプ
- バージョニング
- 暗号化
- 静的ウェブサイトのホスティング
- S3 Transfer Acceleration
- アクセスログ
- S3 Select
- Storage Lens
- リクエスタ支払いバケット
- アクセスポイント
- パフォーマンスの最適化
- 他のサービスとの連携

## S3 とは
Duration: 01:00
スケーラビリティ、データ可用性、セキュリティ、およびパフォーマンスを提供するオブジェクトストレージサービスです。
データ耐久性はイレブンナイン（99.999999999 %）です。可用性はストレージクラスによって異なります。

【AWS Black Belt Online Seminar】[Amazon S3/Glacier(YouTube)](https://www.youtube.com/watch?v=oFG5kMZjKtc)


![](./files/blackbelt_s3.jpg)


【AWS Black Belt Online Seminar】[Amazon S3 ユースケースおよびサービスアップデート(YouTube)](https://www.youtube.com/watch?v=7LRSDrHb2Ho)

![](./files/blackbelt_s3_update.jpg)


[S3 サービス概要](https://aws.amazon.com/jp/s3/)

[S3 ドキュメント](https://docs.aws.amazon.com/ja_jp/s3/?id=docs_gateway)

[S3 よくある質問](https://aws.amazon.com/jp/s3/faqs/)

## S3 の基本
Duration: 01:30

![](./files/s3_overview.png)

S3 のデータ耐久性はイレブンナイン（99.999999999 %）で、可用性は 99.99 %です（ストレージタイプによって異なります）。
耐久性とは、データが失われないことに対する指標で、可用性は稼働し続けることの指標です。

このイレブンナインという耐久性は、S3 にオブジェクトをアップロードすると、自動的に 3AZ 以上にバックアップが行われることで実現しています。バックアップされるのはリージョン内の AZ なので、リージョン障害時にはアクセスできなくなります。

S3 のオブジェクトキー名には、`BucketName/Project/WordFiles/123.txt` のように指定することが多いです。
`Project/WordFiles` がプレフィックス、`123.txt` がオブジェクト名という定義です。
マネジメントコンソールでは、フォルダのような階層で表示されますが、実際は階層というのは存在せず、`/` 区切りのプレフィックスをグループ化して表示しており、フォルダという概念をサポートしているだけです。

S3 はリージョンのサービスなので、VPC 内からアクセスするにはいくつかのパターンがあります。

### ①EC2（パブリックサブネット）⇒ Internet Gateway

![](./files/s3_ec2_access_pattern_1.png)

シンプルに、Internet Gateway を通してアクセスします。

### ②EC2（プライベートサブネット） ⇒ NAT Gateway

![](./files/s3_ec2_access_pattern_2.png)

NAT Gateway を利用することでアクセスできます。ただし、NAT Gateway はコストが高めです。

### ③EC2（プライベートサブネット） ⇒ VPC Endpoint(Gatewayタイプ)

![](./files/s3_ec2_access_pattern_3.png)

S3 や DynamoDB を利用する場合は、コストがかからないのでこちらを使います。
VPC Endpoint(Interfaceタイプ)と違い、アクセスはグローバル IPです。（通信経路は、AWS内でのプライベートです）
### ④EC2（プライベートサブネット） ⇒ VPC Endpoint(Interfaceタイプ)

![](./files/s3_ec2_access_pattern_4.png)

プライベートIPでのアクセスが可能です。ただし、VPC Endpointを起動している時間でコストが発生します。他のサービスでも VPC エンドポイントを使用していると最もコストが高くなるパターンです。

### コスト比較

月に100 GBほどデータ転送が発生した場合の比較です。
VPCエンドポイントは24時間×1か月（30.5日）使用しているものとします。

|アクセスパターン|コスト|備考|
| --- | ---:| --- |
|①EC2（パブリックサブネット）⇒ Internet Gateway|$0.00||
|②EC2（プライベートサブネット） ⇒ NAT Gateway|$51.60|NAT Gateway*1台|
|③EC2（プライベートサブネット） ⇒ VPC Endpoint(Gatewayタイプ)|$0.00||
|④EC2（プライベートサブネット） ⇒ VPC Endpoint(Interfaceタイプ)|$10.60||

## バケットポリシー
Duration: 01:30

AWS ドキュメント> [バケットポリシーの使用](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/bucket-policies.html)

バケットとその中のオブジェクトへのアクセス許可を付与できるリソースベースのポリシーで、JSON で定義します。

同一アカウント内でのアクセスに対する許可設定は、基本的にIAMポリシーによって制御します。（併用してもよいが設定が煩雑になります）

<aside class="negative">
IAMポリシーとバケットポリシーの両方を使用した場合、どちらかで拒否されていた場合は拒否されます。
</aside>

```
{
    "Version": "2012-10-17",
    "Id": "S3PolicyId1",
    "Statement": [
        {
            "Sid": "IPAllow",
            "Effect": "Deny",
            "Principal": "*",
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::DOC-EXAMPLE-BUCKET",
                "arn:aws:s3:::DOC-EXAMPLE-BUCKET/*"
            ],
            "Condition": {
                "NotIpAddress": {
                    "aws:SourceIp": "192.0.2.0/24"
                }
            }
        }
    ]
}
```

AWS ドキュメント> [バケット所有者がユーザーにバケットのアクセス許可を付与する](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/example-walkthroughs-managing-access-example1.html)

別アカウントからのアクセスを許可する場合は、バケットポリシー（アクセスされる側のS3に設定）とIAMポリシー（アクセスする別アカウント側で設定）の<font color="red">両方</font>で許可する必要があります。

AWS ドキュメント> [バケット所有者がクロスアカウントのバケットのアクセス許可を付与する](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/example-walkthroughs-managing-access-example2.html)


バケットポリシーのサイズには制限があり、20 KB となっています。
![](./files/s3_bucket_policy.png)

https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/bucket-policies.html

## アクセスコントロールリスト（ACL）
Duration: 01:30

AWS ドキュメント> [ACL によるアクセス管理](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/acls.html)

「バケット・オブジェクト」への「アクセス」を許可するもので、基本的な読み取り/書き込み許可を他の AWS アカウントに付与するために使用します。

ACL は S3 のサービスが開始された当初からあったアクセス制御の手段ですが、その後 IAM が提供されたため、アクセス制御の手段が複数になりました。
現在では、バケットポリシーやIAMポリシーのほうが柔軟な制御が可能です。

AWS ドキュメント> [ACL ベースのアクセスポリシー (バケットおよびオブジェクト ACL) の使用が適する場合](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/access-policy-alternatives-guidelines.html#when-to-use-acl)

AWS ドキュメント> [バケット所有者が自分の所有していないオブジェクトに対するアクセス許可を付与する](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/example-walkthroughs-managing-access-example3.html)

AWS ドキュメント> [バケット所有者が所有権のないオブジェクトへのクロスアカウントアクセス許可を付与する](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/example-walkthroughs-managing-access-example4.html)


## ライフサイクル
Duration: 01:00

AWS ドキュメント > [ストレージのライフサイクルの管理](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/object-lifecycle-mgmt.html)

指定した期間が経過したファイルを、別のストレージタイプに移動してコスト削減したり、削除したりできる機能です。

<aside class="negative">
ライフサイクルのルールは、最大 1,000個です。この制限は引き上げができません。
</aside>

このライフサイクルでオブジェクトが移動されるのは、0：00（UTC）です。日本時間では、午前 9時となります。
削除日数が1日の場合、午前9時より前に作成されたものは翌日9時、午前9時より後に作成されたものは、翌々日の9時以降に削除されることになります。

![](./files/s3_lifecycle_1.png)


## ストレージタイプ
Duration: 05:00

AWS ドキュメント > [Amazon S3 ストレージクラスを使用する](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/storage-class-intro.html)

![](./files/s3_storage_type.png)

上記画像は、AWSドキュメントにある[ストレージクラス間の移行のためのウォーターフォールモデル](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html#lifecycle-general-considerations-transition-sc)に情報を追加したものです。

![](./files/lifecycle-transitions-v3.png)


<aside class="positive">
アクセス頻度や削除頻度が不明な場合は、最低保存期間の制約がない「S3 Intelligent-Tiering」に移動するようにライフサイクルを定義しておけばコスト削減ができます。
</aside>

- S3 標準(Standard)
    - アクセス頻度の高いデータ向けに高い耐久性、可用性、パフォーマンスのオブジェクトストレージです。
    - 可用性は 99.99 %
    - このストレージクラスから、ライフサイクルによって他のストレージクラスへ移動することが可能です。
- S3 標準 - 低頻度アクセス(Infrequent Access)(Standard-IA)
    - アクセス頻度は低いが、必要に応じてすぐに取り出すことが必要なデータに適しています。
    - 可用性は 99.9 %
    - このストレージクラスから、ライフサイクルによって他のストレージクラスへ移動することが可能です。
    - <font color="red">このストレージクラスに格納してから 30日以内に削除された場合、30日分の課金が発生します。</font>
- S3 Intelligent-Tiering
    - アクセスパターンが不明または変化するデータに対して自動的にコストを削減する
    - 30 日間連続してアクセスされなかったオブジェクトを低頻度アクセス階層に移動
    - 90 日間アクセスがなければ、アーカイブインスタントアクセス階層に移動
    - 可用性は 99.9 %
    - 128 KB より小さなオブジェクトは、常に高頻度アクセス階層料金で課金されます。
- S3 1 ゾーン - 低頻度アクセス(S3 One Zone-IA)
    - アクセス頻度は低いが、必要に応じてすぐに取り出すことが必要なデータに適しています。
    - 他のクラスと違い、一つの AZ のみに保存されているので、Standard-IA より 20% コストを削減できます。
    - 可用性は 99.5 %
    - このストレージクラスから、ライフサイクルによって他のストレージクラスへ移動することが可能です。
    - <font color="red">このストレージクラスに格納してから 30日以内に削除された場合、30日に満たなかった分も日割での課金が発生します。</font>
- S3 Glacier Instant Retrieval
    - アクセスはほとんどないが、即時取り出しを必要とするアーカイブデータ向け
    - S3 Standard と同じミリ秒単位でのデータの取り出し
    - 可用性は 99.9 %
    - 四半期に一度データにアクセスする場合、S3 Standard-IA に比べて最大で 68%のコスト削減
    - <font color="red">このストレージクラスに格納してから 90日以内に削除された場合、90日に満たなかった分も日割での課金が発生します。</font>
- S3 Glacier Flexible Retrieval(旧 S3 Glacier)
    - 即時アクセスを必要としないアクセス頻度の低い長期データ用
    - 可用性は 99.99 %
    - 取り出し時間は 数分から数時間
    - <font color="red">このストレージクラスに格納してから 90日以内に削除された場合、90日に満たなかった分も日割での課金が発生します。</font>
- S3 Glacier Deep Archive
    - クラウド上の最も低コストなストレージで数時間で取り出し可能な長期アーカイブやデジタル保存用
    - 取り出し時間は 12 時間以内
    - 7～10年という長期間保存用に設計されており、磁気テープライブラリの理想的な代替策となる。
    - <font color="red">このストレージクラスに格納してから 180日以内に削除された場合、180日に満たなかった分も日割での課金が発生します。</font>

## バージョニング
Duration: 02:00

![](./files/s3_versioning.png)

パフォーマンスに影響を与えずに偶発的な上書きや削除から保護するためにアップロードごとに新しいバージョンを生成するオプションです。
削除されたオブジェクトの取得や、過去のバージョンへのロールバックが可能になります。

<aside class="positive">
デフォルトでは無効になっているので利用する場合は、バージョニングを有効にする必要があります。
</aside>

AWS ドキュメント > [S3 バケットでのバージョニングの使用](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/Versioning.html)

AWS ドキュメント > [バージョニングな有効なバケットへの Amazon S3 リクエストに対する HTTP 503 レスポンスが著しく増加する](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/troubleshooting-by-symptom.html)

## 暗号化
Duration: 02:00

AWS ドキュメント > [サーバー側の暗号化を使用したデータの保護](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/serv-side-encryption.html)

AWS ドキュメント > [クライアント側の暗号化を使用したデータの保護](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/UsingClientSideEncryption.html)

- サーバー側の暗号化
    - S3 データセンター内のディスクに書き込む前に暗号化
    - ダウンロードする際に自動的に復号
    - Server Side Encryption
        - SSE-S3
            - S3によって処理、管理されるキーを使用して暗号化
            - 追加料金はなし
        - SSE-KMS
            - KMS の顧客マスタキー(CMK)を使用して暗号化
            - KMS の料金が別途必要
        - SSE-C
            - 独自の暗号化キーを設定して暗号化
    - 暗号化は、ディスクが盗難にあった場合でも中身を参照できないようにする目的がある。しかし、AWS のデータセンターに侵入してディスクを盗み出すのはクライアントデバイスより困難だと思われるが・・
    - 設定したことによるデメリットがないため、特に要件がない場合でも基本的に SSE-S3 での暗号化はデフォルトで設定しておきます。
    - 要件に従い、SSE-KMS や SSE-Cなどを採用します。
- クライアント側の暗号化
    - CSE(Client Side Encryption)
        - S3 に送る前にデータを暗号化する方法
        - クライアント側暗号化ライブラリ（AWS Encryption SDK）を使用すると暗号化をより容易に実装可能である。
    - 機密性が高く、S3 からダウンロードされてしまった場合に情報漏洩されないようにしなければならない場合はこちらを採用する。

## 静的ウェブサイトのホスティング
Duration: 01:00

AWS ドキュメント > [Amazon S3 を使用して静的ウェブサイトをホスティングする](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/WebsiteHosting.html)

S3 バケット単体で静的ウェブサイトが構築できる機能です。この機能だけでは HTTP アクセスのみですので、HTTPS が必要な場合は他のサービスと組み合わせる必要があります。（CloudFrontとの併用が最も簡単です）

![](./files/s3_static_website_1.png)

IP制限をした静的ウェブサイトの設定例

![](./files/s3_static_website_2.png)

## S3 Transfer Acceleration
Duration: 05:00

AWS ドキュメント>[Amazon S3 Transfer Acceleration を使用した高速かつ安全なファイル転送の設定](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/transfer-acceleration.html)

![](./files/s3_Transfer_Acceleration.png)

遠方のリージョンからの転送を高速化できます。
同一リージョンで転送する分には問題になりませんが、海外展開している事業で、海外リージョンを利用し、中央リージョンのバケットに対して、世界中からアップロードするようなシステムの場合には、データ転送の距離により遅延が問題になります。
これを解消できる機能です。

<aside class="positive">
大きいオブジェクトの転送の場合、50%から500%まで転送速度を改善することができます。
</aside>


Transfer Acceleration はバケット単位で有効にします。有効にしたバケットへのファイル転送は、世界中に存在する CloudFront のエッジロケーションを経由してアップロードされます。エッジロケーションから S3 バケットは、AWS 内の最適化されたネットワークで通信されます。

Transfer Acceleration を使用した方が速いと判断された場合は、Transfer Acceleration のエッジロケーションが利用されます。この判定は AWS によって自動的に実施されます。
逆に、遅いと判断された場合は「その転送で使用する S3 Transfer Acceleration の料金を AWS が請求することはなく、S3 Transfer Acceleration システムをバイパスする可能性があります。」と "よくある質問" に記載があります。よって、遅くなるのに無駄に利用してコスト増といったことはないので、安心して利用できます。

ただし、使用するにはいくつか前提条件があります。
例えば、「Transfer Acceleration で使用するバケットは、ピリオド (".") が含まれていない」といったものがあり、使用する場合は既存の状態を確認する必要があります。
その他については、ドキュメントを参照してください。

AWS ドキュメント > [Transfer Acceleration を使用するための要件](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/transfer-acceleration.html#transfer-acceleration-requirements)

### Amazon S3 Transfer Acceleration の速度比較ツール

[速度比較ツール](https://s3-accelerate-speedtest.s3-accelerate.amazonaws.com/en/accelerate-speed-comparsion.html)を使用すると、高速化した場合と高速化していない場合の Amazon S3 リージョン間でのアップロード速度を比較できます。

![](./files/S3TransferAcceleration_0a.png)

ページを開くと計測が開始されます。全部終了するまでに、10分程度かかります。
このようにマルチパートアップロードによってファイルがアップロードされています。
![](./files/S3TransferAcceleration_0b.png)

結果はこのように表示されます。
東京⇒東京リージョンだと、2 %遅くなってます。別のタイミングで実施したら、5%遅くなりました。やはりエッジロケーションを経由する分、遅くなるようです。（実際に利用するときは、AWS が判定を行い、エッジロケーションを経由しない転送にするはず）

![](./files/S3TransferAcceleration_tool_0.png)

![](./files/S3TransferAcceleration_tool_1.png)

![](./files/S3TransferAcceleration_tool_2.png)

![](./files/S3TransferAcceleration_tool_3.png)

リージョンマップにマッピングしてみるとこのようになりました。
リージョン間の距離と比例してスピードアップするわけではなさそうですが、遠方のリージョンの方が明らかにスピードアップしています。
![](./files/S3TransferAcceleration_tool_world.png)


|Rank|Region| | |
| --- | --- | ---: | --- |
|1|CanadaCentral(CA-CENTRAL-1)|<font color="green">355%</font>|<font color="green">faster</font>|
|2|Oregon(US-WEST-2)|<font color="green">346%</font>|<font color="green">faster</font>|
|3|Dublin(EU-WEST-1)|<font color="green">320%</font>|<font color="green">faster</font>|
|4|Virginia(US-EAST-1)|<font color="green">290%</font>|<font color="green">faster</font>|
|5|Ohio(US-EAST-2)|<font color="green">275%</font>|<font color="green">faster</font>|
|6|Singapore(AP-SOUTHEAST-1)|<font color="green">236%</font>|<font color="green">faster</font>|
|7|Mumbai(AP-SOUTH-1)|<font color="green">214%</font>|<font color="green">faster</font>|
|8|London(EU-WEST-2)|<font color="green">198%</font>|<font color="green">faster</font>|
|9|Frankfurt(EU-CENTRAL-1)|<font color="green">189%</font>|<font color="green">faster</font>|
|10|Paris(EU-WEST-3)|<font color="green">166%</font>|<font color="green">faster</font>|
|11|SanFrancisco(US-WEST-1)|<font color="green">159%</font>|<font color="green">faster</font>|
|12|SãoPaulo(SA-EAST-1)|<font color="green">155%</font>|<font color="green">faster</font>|
|13|Sydney(AP-SOUTHEAST-2)|<font color="green">133%</font>|<font color="green">faster</font>|
|14|Seoul(AP-NORTHEAST-2)|<font color="green">103%</font>|<font color="green">faster</font>|
|15|Tokyo(AP-NORTHEAST-1)|<font color="red">2%</font>|<font color="red">slower</font>|

## アクセスログ
Duration: 02:00

AWS ドキュメント > [サーバーアクセスログを使用したリクエストのログ記録](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/ServerLogs.html)

バケットに対する監査などの目的で、S3のサーバアクセスログを別のバケットに保存することができます。

![](./files/s3_accesslog.png)

設定する場合、以下に注意する必要があります。

「Amazon S3 バケットについてのサーバーアクセスログを同じバケットにプッシュすることはできますか?」
https://aws.amazon.com/jp/premiumsupport/knowledge-center/s3-server-access-logs-same-bucket/

```
バケットについてのサーバーアクセスログを同じバケットにプッシュしないでください。
この方法でサーバーアクセスログを設定した場合、ログの無限ループが発生します。
これは、バケットにログファイルを書き込むと、バケットにもアクセスが発生し、別のログを生成するためです。
ログファイルは、バケットに書き込まれるすべてのログに対して生成され、ループが作成されます。
```

## S3 Select
Duration: 02:00

AWS ドキュメント > [Amazon S3 Select を使用したデータのフィルタリングと取得](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/selecting-content-from-objects.html)

S3 に格納した CSV 形式または JSON 形式のデータをシンプルな構造化クエリ言語 (SQL) の SELECT 文を利用して、検索・集計することができます。
検索対象にできるのは単一のオブジェクトのみです。（Athenaのように複数ファイルを対象には出来ません。）

クエリでスキャンされたデータサイズ、返されたデータサブセットのサイズで課金されます。

詳細は以下のドキュメントを参照してください。
AWS ドキュメント > [Amazon S3 Select を使用したデータのフィルタリングと取得](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/selecting-content-from-objects.html)

AWS WAF のログに対して S3 Select を実行した例です。

WAF のログは1行ずつのJSONレコードとなっています。

![](./files/s3_select_0.png)

形式を「JSON」、タイプを「行」、圧縮を「GZIP」とします。

![](./files/s3_select_0a.png)

WHERE 句でのカラムの指定は、「s.action」ではなく「s."action"」とする必要がありました。

```
SELECT * FROM s3object s WHERE s."action" = 'ALLOW' LIMIT 5
```

![](./files/s3_select_1a.png)

抽出するカラムを絞ってみます（射影）

```
SELECT s."timestamp", s."terminatingRuleId",s."action"  FROM s3object s WHERE s."action" = 'ALLOW' LIMIT 5
```

![](./files/s3_select_1b.png)

対象の日時が特定できている場合は S3 Select を使うことで手軽に検索・集計が可能です。Athena のように事前にテーブル定義を行わなくても検索できるのが便利です。
ただ、対象の日時が特定できない場合や広い範囲を検索したい場合は、Athena を使うほうがよいと思います。

<aside class="negative">
SQL の ORDER が使えないという点も注意が必要です。
</aside>

単一のファイルという点だと、外部連携ファイルといった単一のファイルであることが多い場合の検索・集計には有用だと思います。

## Storage Lens
Duration: 03:00

AWS ドキュメント > [S3 Storage Lens](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/storage_lens.html)

Storage Lens を使うと、オブジェクトストレージの使用状況とアクティビティの傾向を可視化し、ストレージコストの最適化とデータ保護のベストプラクティスの推奨事項を確認することができます。
不要なデータが存在していることや、ライフサイクルが想定通りになっておらず、容量が増加しているなど、分析できます。
デフォルトでは、「default-account-dashboard」というダッシュボードが作成されているので、すぐに分析することができます。
より詳細に分析したい場合は、無料のメトリクスから有料のメトリクスに切り替えることができます。

全バケットの概要
![](./files/strage_lens_3.png)

バケットごとの容量推移
![](./files/strage_lens_1.png)

バケットごとの現在の容量
![](./files/strage_lens_2.png)

現行バージョン、非現行バージョン、削除マーカー、未完了のマルチパートアップロード
![](./files/strage_lens_4.png)

ストレージクラスごと
![](./files/strage_lens_5.png)

## リクエスタ支払いバケット
Duration: 02:00

AWS ドキュメント > [ストレージ転送と使用量のリクエスタ支払いバケットの使用](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/RequesterPaysBuckets.html)


通常、バケットのデータ保存容量とデータ転送にかかるコストはバケット所有者が負担します。別のアカウントとバケットを共有指定いる場合もバケット所有者が負担します。

共有先からのダウンロードが大量に発生する場合、バケット所有者の負担が大きくなってしまいます。
そのような場合、リクエスタ支払いを行うことで、データを取得した先のアカウントに料金を負担してもらうことができます。

リクエスタ支払いを有効にしたバケットは、所有者を除き、通常の方法ではアクセスできなくなります。
アクセスする場合、HTTPアクセスはリクエストヘッダに"x-amz-request-payer"を付けることで、リクエスタ側が明示的にデータアクセスに対して料金を負担することを了承したことになります。
AWS CLI の場合は、オプションに「--request-player」を付与します。
## アクセスポイント
Duration: 02:00

AWS ドキュメント > [Amazon S3 アクセスポイントを使用したデータアクセスの管理](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/access-points.html)

バケットに複数のユーザーやアカウントからアクセスがある場合、バケットポリシーでの設定が煩雑になります。
そこで、用途ごとにアクセスポイントを作成することで、アクセスポイントごとのポリシーを定義することができます。

![](./files/s3_accesspoint.png)

このように、アクセスポイントポリシーを定義できます。
```
{
    "Version":"2012-10-17",
    "Statement": [
    {
        "Effect": "Allow",
        "Principal": {
            "AWS": "arn:aws:iam::123456789012:user/Alice"
        },
        "Action": ["s3:GetObject", "s3:PutObject"],
        "Resource": "arn:aws:s3:us-west-2:123456789012:accesspoint/my-access-point/object/Alice/*"
    }]
}
```

詳しくは、AWS ドキュメント > [アクセスポイントポリシーの例](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/access-points-policies.html#access-points-policy-examples)を参照してください。

## パフォーマンスの最適化
Duration: 02:00

AWS ドキュメント > [設計パターンのベストプラクティス: Amazon S3 のパフォーマンスの最適化](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/optimizing-performance.html)

以前は、連続するキープレフィックスのオブジェクトを作成すると、パフォーマンス上の問題がありましたが、現在ではそのような問題は発生しません。

```
BucketName/2022-11-02/aaa/xxx000000001.log
BucketName/2022-11-02/aaa/xxx000000002.log
BucketName/2022-11-02/aaa/xxx000000003.log
BucketName/2022-11-02/aaa/xxx000000004.log
BucketName/2022-11-03/aaa/zzz000000001.log
BucketName/2022-11-03/aaa/zzz000000002.log
BucketName/2022-11-03/aaa/zzz000000003.log
BucketName/2022-11-03/aaa/zzz000000004.log
```

以前はこのようにランダムにして対処していました。

```
BucketName/232a-2022-11-02/aaa/xxx000000001.log
BucketName/5akg-2022-11-02/aaa/xxx000000002.log
BucketName/gsrt-2022-11-02/aaa/xxx000000003.log
:
```

現在はこのままでも問題はありません。
```
BucketName/2022-11-02/aaa/xxx000000001.log
BucketName/2022-11-02/aaa/xxx000000002.log
BucketName/2022-11-02/aaa/xxx000000003.log
BucketName/2022-11-02/aaa/xxx000000004.log
```

さらに、現在は、PUT/COPY/POST/DELETE のリクエストを 3,500 回/秒、GET/HEAD リクエストを 5,500回/秒 以上を処理できるため、高アクセスを除いて特に問題は発生しません。
だた、高アクセスなシステムの場合、上記敷居値を超えるリクエストを送信すると `HTTP 503` が返ってくることがあります。
このようなケースに対応するには、「パーティションされたプレフィックス」を複数使用することを検討します。
上記敷居値は「パーティションされたプレフィックス」ごとの数値であるため、これを並列化することで、よりパフォーマンスを向上できます。
「パーティションされたプレフィックス」とは何かというと、オブジェクトキー名の先頭にある文字列（プレフィックス）です。
下記例だと、「パーティションされたプレフィックス」は `2022-11-02/aaa` が該当します。
オブジェクトキー名の最大長 (1,024 バイト)の制限の中で、プレフィックスを増やすことで、並列化によってパフォーマンスを向上させることができます。

```
BucketName/2022-11-02/aaa/xxx000000001.log
BucketName/2022-11-02/aaa/xxx000000001.log
BucketName/2022-11-02/aaa/xxx000000001.log
BucketName/2022-11-02/aaa/xxx000000001.log
```

## 他のサービスとの連携
Duration: 00:30

![](./files/s3_services.png)

2019年頃の資料のため、現在では AWS WAF も直接 S3 へログ配信できるようになっているため連携できるサービスが増えています。


=== 以上 ===
