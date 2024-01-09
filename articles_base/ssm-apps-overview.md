# AWS Systems Manager（SSM）:アプリケーション管理

## ☘️ はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents

Duration: 00:01:00

- [AWS Systems Manager（SSM）:アプリケーション管理](#aws-systems-managerssmアプリケーション管理)
  - [☘️ はじめに](#️-はじめに)
  - [👀 Contents](#-contents)
  - [アプリケーション管理の機能](#アプリケーション管理の機能)
  - [パラメータストア](#パラメータストア)
    - [パラメータ階層](#パラメータ階層)
    - [パラメータストアの料金](#パラメータストアの料金)
  - [AppConfig](#appconfig)
    - [ECS で利用する](#ecs-で利用する)
    - [EC2 で利用する](#ec2-で利用する)
    - [AppConfig の料金](#appconfig-の料金)
  - [アプリケーションマネージャー](#アプリケーションマネージャー)
    - [アプリケーションマネージャーの料金](#アプリケーションマネージャーの料金)

## アプリケーション管理の機能

- アプリケーション管理
  - パラメータストア
  - AppConfig
  - アプリケーションマネージャー

## パラメータストア

Duration: 00:20:00

[AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/systems-manager-parameter-store.html)

設定値やシークレットなどを安全に保存できる機能です。

![ps-1](/images/ssm/parameter-store/parameterstore-1.png)

格納できるタイプは、次の通りです。

- 文字列（String）
  - 任意の文字列です。
  - 文字列ならば何でも格納できます。中身に `JSON` 文字列を格納することも可能です。
- 文字列のリスト（StringList）

  - カンマ区切りの文字列を格納できます。
  - AWS マネジメントコンソールで改行を入れた場合のみ、カンマ区切りに変換されます。CLI の場合は改行コードがそのまま保存されます。ただし、AWS マネジメントコンソールで開いて保存すると、改行がカンマ区切りに変換されてしまいます。
  - 参照するときの動作は、文字列（String）と違いがありません。カンマ区切りの文字列が返ってきます。
  - 更新するときは、`AllowedPattern` によって、カンマ区切りにした値それぞれに入力チェックができます。
    - `aws ssm put-parameter --name "hoge" --value "123,456" --allowed-pattern="^\d+$" --type String`
      - 文字列（String）の場合、カンマが入っているため、エラーになります。
    - `aws ssm put-parameter --name "hoge" --value "123,456" --allowed-pattern="^\d+$" --type StringList`
      - 文字列のリスト（StringList）の場合、エラーになりません。

- 安全な文字列（SecureString）
  - KMS キーを使用して暗号化して格納できます

パラメータストアには最大スループットという制限があります。

デフォルトのスループットは、毎秒 40 です。
高スループットの場合は、毎秒 10,000 です。高スループットにすると、追加料金が発生します。
詳しくは [Parameter Store 料金](https://aws.amazon.com/jp/systems-manager/pricing/)を確認してください。

高スループットにするには、[設定]タブより変更することができます。高スループットが不要になった場合は元に戻す（制限をリセットする）ことが可能です。

![ps-2](/images/ssm/parameter-store/parameterstore-2.png)

![ps-3](/images/ssm/parameter-store/parameterstore-3.png)

Lambda からパラメータストアを利用する場合は、次のようになります。

```py
import boto3

ssm = boto3.client('ssm', region)
response = ssm.get_parameter(
    Name = "sampleparams"
)
sample = response["Parameter"]["Value"]
print(sample)
```

複数のパラメータを取得することも可能です。ただし、`Names` に複数指定した場合は、返却される順番を指定することが出来ません。

```py
import boto3

ssm = boto3.client('ssm', region)
response = ssm.get_parameters(
    Names='sampleparams1', 'sampleparams2', 'sampleparams3'
    WithDecryption=True,
)

sampleparams1 = response["Parameters"][0]["Value"]
sampleparams2 = response["Parameters"][1]["Value"]
sampleparams3 = response["Parameters"][2]["Value"]


print(sampleparams1) # パラメータ sampleparams1 になっているとは限らない
print(sampleparams2)
print(sampleparams3)

```

### パラメータ階層

[パラメータ階層の使用](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/sysman-paramstore-hierarchies.html)

パラメータ階層とは、パラメータ名を "/"(スラッシュ) 区切りで作成したものです。
通常、パラメータストアには文字列が格納でき、JSON なども格納することが可能です。

例えばデータベース接続ユーザーとパスワードを次のように保存したとします。
このように保存すると、同じような情報を複数のパラメータストアに作成してしまうなど、管理が煩雑になってしまうケースがあります。

```json
{
  "username": "hoge",
  "password": "fuga",
  "database_name": "piyo"
}
```

これを避けるために、名前で明確に管理するようにします。
先ほどのデータベース接続の例の場合、データベース名、ユーザー名、パスワードと３つのパラメータを作成します。
複数環境も考慮して、環境識別子を付与しておくとよいでしょう。

```sh
/prod/db/database_name
/prod/db/username
/prod/db/password
```

このようにすることで、パラメータ名から格納されている情報を判別することができ、同じ情報を複数のパラメータ内に保存することが避けられます。

パラメータを取得するときは、次のようにすることで階層化したパラメータを一括で取得することができます。

種類が "SecureString" のパラメータを取得する場合に `--with-decryption` を付けないと、暗号化された文字列が `"Value": "AQICAHghew2so+pI8yP5dBYCCInkLLp8X2HBzubi+TbUs75qwQHfDsjEL26GJ5GQhT8N/ymWAAAAYjBgBgkqhkiG9w0BBwagUzBRAgEAMEwGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMzc2oVk47CCZD9EloAgEQgB+qZaLcuNu2/b1Itv6ZUjTpFUQTVWHTd05zFUP4uTSK"` のように返ってきます。

```sh
aws ssm get-parameters-by-path --path /prod/db --with-decryption

{
  "Parameters":[
    {
            "Type": "SecureString",
            "Name": "/prod/db/database_name",
            "Value": "piyo",
            "Version": 1,
            "LastModifiedDate": "YYYY-MM-DDTHH:MI:SS.FFFFFF+00:00"
            "ARN": "arn:aws:ssm:region:123456789012:parameter/prod/db/database_name",
            "DataType": "text"
    },
    {
            "Type": "SecureString",
            "Name": "/prod/db/username",
            "Value": "hoge",
            "Version": 1,
            "LastModifiedDate": "YYYY-MM-DDTHH:MI:SS.FFFFFF+00:00"
            "ARN": "arn:aws:ssm:region:123456789012:parameter/prod/db/username",
            "DataType": "text"
    },
    {
            "Type": "SecureString",
            "Name": "/prod/db/password",
            "Value": "fuga",
            "Version": 1,
            "LastModifiedDate": "YYYY-MM-DDTHH:MI:SS.FFFFFF+00:00"
            "ARN": "arn:aws:ssm:region:123456789012:parameter/prod/db/password",
            "DataType": "text"
    }
  ]
}
```

キーと値のみを取得したい場合は--query オプションを使って以下のようにします。

```sh
aws ssm get-parameters-by-path --path /prod/db --with-decryption --query "Parameters[].[Name,Value]"

[
    [
        "/prod/db/database_name",
        "piyo"
    ],
    [
        "/prod/db/password",
        "fuga"
    ],
    [
        "/prod/db/username",
        "hoge"
    ]
]
```

`--recursive` を指定すると階層を再帰的に取得します。指定しない場合や `--no-recursive` を指定した場合は、1 階層のみの取得になります。

```sh
# recursive を指定しないまたは、no-recursive を指定した場合
aws ssm get-parameters-by-path --path /prod --with-decryption --query "Parameters[].[Name,Value]"
aws ssm get-parameters-by-path --path /prod --with-decryption --query "Parameters[].[Name,Value]"　--no-recursive

## prod の直下にはパラメータがないため取得できない
[]

# recursive を指定した場合
aws ssm get-parameters-by-path --path /prod --with-decryption --query "Parameters[].[Name,Value]"　--recursive

## 再帰的に取得
[
    [
        "/prod/db/database_name",
        "piyo"
    ],
    [
        "/prod/db/password",
        "fuga"
    ],
    [
        "/prod/db/username",
        "hoge"
    ]
]
```

### パラメータストアの料金

パラメータの種類が「アドバンスド」の場合に追加料金が発生します。

[パラメータストアの料金](https://aws.amazon.com/jp/systems-manager/pricing/#Parameter_Store)

## AppConfig

Duration: 00:10:00

[AWS AppConfig](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/appconfig.html)

AppConfig はアプリケーションの設定を管理、保存、デプロイすることが出来るサービスです。
つまり、アプリケーションの設定をコードの外に出して別管理して、設定の変更のデプロイまで簡単に出来るサービスです。

[Amazon Web Services ブログ>AWS AppConfig を使用したアプリケーション構成設定の安全なデプロイ - 02 12 月 2019](https://aws.amazon.com/jp/blogs/news/safe-deployment-of-application-configuration-settings-with-aws-appconfig/)

よくある質問には以下のように記載があります。

```text
Q: AWS AppConfig はどのような人が使うべきですか?
AWS AppConfig は、コードを管理する方法に似ていますが、構成値が変更されたときにコードをデプロイする必要がなく、
結果としてサービス停止のリスクが軽減したいシステム管理者、DevOps チーム、開発者向けに設計されています。
AWS AppConfig は、構成のターゲット (ホスト、サーバー、AWS Lambda 関数、コンテナ、モバイルデバイス、IoT デバイスなど) を持つ
任意の規模またはタイプの企業または組織を対象にしています。
```

アプリケーションの設定というと、環境変数、設定ファイル、データベース等で外だしにすることがあると思います。AWS でもパラメータストアで管理することが可能です。

```text
Q: AWS Systems Manager のパラメータストアと AWS AppConfig はそれぞれいつ使用すべきですか?

AWS Systems Manager のパラメータストアは、秘密またはプレーンテキスト構成値を保存、取得、および管理する能力を提供する機能です。
パラメータストアの一般的な使用には、データベース文字列とライセンスコードをパラメータ値として保存することが含まれます。
セルフマネージドの方法で値を保存、取得する必要がある場合は、パラメータストアを使用してください。
AWS AppConfig はランタイムに更新されたアプリケーションを安全にリリースし、構成をパラメータとして保存することができるようにする
アプリケーション構成管理サービスです。
特定の状況で変更をロールバックすることができる制御された環境で安全に検証して
デプロイできる複雑なセットのアプリケーション構成をモデル化する必要がある場合、AWS AppConfig を使用する必要があります。
```

パラメータストアに比べて、AppConfig では Deployment や Environment という概念を持っており、複数のパラメータをまとまった単位（configuration profile）で管理できるなどパラメータストアに比べて、アプリケーション向けになっていると言えます。

### ECS で利用する

[AWS AppConfig integration with Amazon ECS and Amazon EKS](https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-integration-containers-agent.html)

ECS に `AppConfig agent`（AppConfig の値をアプリケーションの代わりに自動でポーリング・データのキャッシュを行ってくれるプログラム） をインストールしたコンテナをサイドカーとして構成します。コンテナのポートは `2772` です。

次のコマンドで取得することができるようになります。[Retrieving configuration data](https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-integration-containers-agent.html#appconfig-integration-containers-agent-retrieving-data)

```sh
curl "http://localhost:2772/applications/<application_name>/environments/<environment_name>/configurations/<configuration_name>"
```

### EC2 で利用する

EC2 もサポートされるようになりました。

[AWS AppConfig エージェントが Amazon EC2 の機能フラグと設定の使用を簡素化 - Jul 21, 2023](https://aws.amazon.com/jp/about-aws/whats-new/2023/07/aws-appconfig-agent-feature-flag-configuration-amazon-ec2/)

### AppConfig の料金

[AppConfig の料金](https://aws.amazon.com/jp/systems-manager/pricing/#AppConfig)

## アプリケーションマネージャー

Duration: 00:10:00

[AWS Systems Manager Application Manager](https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/application-manager.html)

AWS 上で運用している各サービスを１つの画面で俯瞰・対応できるサービスで、追加料金なしで利用できます。
以下のようなサービスが 1 画面で俯瞰することができます。

- CloudFormation スタック
- AWS Resource Groups
- Launch Wizard デプロイ
- AppRegistry アプリケーション
- Amazon ECS および Amazon EKS クラスタ

![app-manager-view](/images/ssm/application-manager/app-manager-view-s.jpg)

### アプリケーションマネージャーの料金

無料で利用できます。
