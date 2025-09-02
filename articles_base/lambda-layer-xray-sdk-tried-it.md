<!--# aws-xray-sdk の Lambda レイヤーを作成する<!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

- [手順](#手順)
  - [1.Docker ファイルを作成](#1docker-ファイルを作成)
  - [2.イメージをビルドして、zip ファイルを生成](#2イメージをビルドしてzip-ファイルを生成)
  - [3.Lambda レイヤーを登録](#3lambda-レイヤーを登録)
- [まとめ](#まとめ)

## 手順

CloudShell 上で次の手順を実施します。

1.Docker ファイルを作

2.イメージをビルドして、zip ファイルを生成

3.Lambda レイヤーを登録

### 1.Docker ファイルを作成

```sh:Dockerfile-xray-sdk
FROM public.ecr.aws/lambda/python:3.13

WORKDIR /work

# システム更新と必要なパッケージのインストール
RUN dnf update && dnf install -y zip

RUN pip install --upgrade pip && \
    pip install aws-xray-sdk -t /python/lib/python3.13/site-packages/
ENTRYPOINT [""]
CMD zip -r aws-xray-sdk.zip /python/
```

### 2.イメージをビルドして、zip ファイルを生成

```sh
docker build -t aws-xray-sdk-2.14 . -f Dockerfile-aws-xray-sdk
```

![docker-build](/images/lambda-layer-psycopg2/docker-build.jpg)

```sh
docker run -v "${PWD}":/work aws-xray-sdk-2.14
```

![docker-run](/images/lambda-layer-psycopg2/ducker-run.jpg)

psycopg2-3.12.zip が生成されました。

![result](/images/lambda-layer-psycopg2/result.jpg)

### 3.Lambda レイヤーを登録

生成した aws-xray-sdk-2.14 を Lambda レイヤーに登録します。

```sh
aws lambda publish-layer-version \
  --layer-name aws-xray-sdk \
  --description 'version 2.14' \
  --zip-file fileb://aws-xray-sdk.zip \
  --compatible-runtimes python3.13 \
  --region ap-northeast-1
```

![lambda-publish-layer](/images/lambda-layer-psycopg2/lambda-publish-layer.jpg)

マネジメントコンソールでも登録されていることが確認できました。（画像では 2 回目なのでバージョン 2 が生成されています）

![result-console](/images/lambda-layer-psycopg2/result-console.jpg)

## まとめ

CloudShell ではデフォルトで Docker コマンドが使えるため、手軽に実施できます。