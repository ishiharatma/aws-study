---
title: "【初心者向け】コンテナ について改めて整理してみた" # 記事のタイトル
type: "tech" # tech: 技術記事 / idea: アイデア記事
topics: ["aws", "study", "container"]
published: false
---

# コンテナ

## はじめに

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## コンテナ とは

コンテナを理解するには、次のようなサイトを見るとよいでしょう。

[コンテナ化とは?(AWS)](https://aws.amazon.com/jp/what-is/containerization/)

[コンテナとは(Google Cloud)](https://cloud.google.com/learn/what-are-containers?hl=ja)

[コンテナーとは(Azure)](https://azure.microsoft.com/ja-jp/resources/cloud-computing-dictionary/what-is-a-container)

[コンテナについて理解する(Red Hat)](https://www.redhat.com/ja/topics/containers)

ここでは、簡単に要点だけ記述します。

アプリケーションは、主に「ランタイム、ライブラリ、プログラムコード、設定ファイル」から構成されます。

![container-001](/images/container/container-001.png)

これらを開発のフェーズごとに異なる環境で稼働させるときの問題点として、ローカルでは動いていたけど、××環境では動かないといったことがよくあると思います。
この問題は、それぞれの環境でリリースした手順が異なっていたり、インストールされているランタイムや依存ライブラリが異なっていたり、といったことで発生します。

![container-002](/images/container/container-002.png)

これを解決するため、アプリケーションの稼働に必要なものをコンテナという一つのものにパッケージしてしまおうということです。
これによって、どの環境でも動作が保証されることになります。

![container-003](/images/container/container-003.png)

![container-003](/images/container/container-004.png)

なお、一般的にパッケージの中に「設定ファイル」は含みません。設定ファイルは、環境ごとの動作を変化させるものであるため、設定ファイルを含むということは、環境それぞれが個別にセットアップされていることと大差なく、「どの環境でも動作が保証」された状態とは言えないからです。

コンテナベースの設計思想・原則については、次の資料を参考にしてください。

- [Beyond the Twelve-Factor App](https://tanzu.vmware.com/content/blog/beyond-the-twelve-factor-app)
- [Principles of Container-based Application Design](https://kubernetes.io/blog/2018/03/principles-of-container-app-design/)

そして、コンテナとよく比較されるのが仮想マシン（VM）です。これについては、[AWS Black Belt Online Seminar CON141 コンテナ入門](https://www.youtube.com/watch?v=fUPyxos7Z-k) に次のような図で説明されています。

![vm-vs-container](/images/container/vm-vs-container.png)

仮想マシンもコンテナもライブラリや他の依存関係とアプリケーションをまとめてパッケージ化していますが、コンテナには次のようなメリットがあります。

- ゲストOS がない分、仮想マシンより軽量
- 軽量なため、高速に起動が可能
- 一度ビルドされたコンテナは不変であるため、可搬性が高い（どこでも起動できる）

また、コンテナはホストと OS のカーネルを共有しているため、セキュリティ上のリスクがあります。これについては、「AWS Black Belt Online Seminar コンテナセキュリティ入門」や、次の資料を参考にしてください。

- [NECセキュリティブログ>特権コンテナの脅威から学ぶコンテナセキュリティ](https://jpn.nec.com/cybersecurity/blog/210730/index.html)

- [【IPA】NIST SP800-190 アプリケーションコンテナセキュリティガイド](https://www.ipa.go.jp/security/reports/oversea/nist/ug65p90000019cp4-att/000085279.pdf)

- [AWS ドキュメント > AWS Fargate のセキュリティ](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/bestpracticesguide/security-fargate.html)

- [AWS ドキュメント > タスクとコンテナのセキュリティ](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/bestpracticesguide/security-tasks-containers.html)

## AWS Black Belt Online Seminar

【AWS Black Belt Online Seminar】[CON141 コンテナ入門](https://www.youtube.com/watch?v=fUPyxos7Z-k)(0:10:00)

【AWS Black Belt Online Seminar】[CON142 Docker入門](https://www.youtube.com/watch?v=CGfRsyQW1rE)(0:14:11)

【AWS Black Belt Online Seminar】[CON120 AWSコンテナ全体概要](https://www.youtube.com/watch?v=pAGW0MdNGj4)(0:17:29)

【AWS Black Belt Online Seminar】[CON110 なぜ今コンテナなのか](https://www.youtube.com/watch?v=-xqg95QBK2M)(0:09:00)

【AWS Black Belt Online Seminar】[CON130 コンテナセキュリティ100](https://www.youtube.com/watch?v=jA63YPmkQ8I)(0:16:34)

【AWS Black Belt Online Seminar】[CON231 コンテナセキュリティ入門 Part.1](https://www.youtube.com/watch?v=I1o01lkQNHY)(0:13:51)

【AWS Black Belt Online Seminar】[CON232 コンテナセキュリティ入門 Part.2](https://www.youtube.com/watch?v=OTwC6zpgZjc)(0:10:26)

【AWS Black Belt Online Seminar】[CON233 コンテナセキュリティ入門 Part.3](https://www.youtube.com/watch?v=drWE7enGFvo)(0:13:26)

## Docker

[Docker](https://www.docker.com/)

Docker社（旧 dotCloud）が開発するコンテナのアプリケーション実行環境を管理するオープンソースソフトウェア（OSS）です。

ドッカー と読みます([Wikipedia](https://ja.wikipedia.org/wiki/Docker))。

2021年9月に有料化されましたが、個人利用、スモールビジネス、教育機関、非商用のオープンソースプロジェクトでは引き続き無料で利用できます。
有償化の猶予期間は、2022年1月31日までした。

[Pricing & Subscriptions](https://www.docker.com/pricing/)

![docker-price](/images/container/docker-price-s.jpg)

コンテナは、Dockerfile というテキストファイルに記述することで利用できます。

```Dockerfile
# syntax=docker/dockerfile:1
FROM ubuntu:22.04
COPY . /app
RUN make /app
CMD python /app/app.py
```

[Dockerfile を書くベストプラクティス](https://docs.docker.jp/develop/develop-images/dockerfile_best-practices.html)

## Docker Compose

複数のコンテナで構成されるアプリケーションで、Docker イメージのビルドや各コンテナの起動・停止などを簡単に行えるようにするツールで、YAML 形式で定義します。

```yaml
version: "3.9"
services:
  web:
    build: .
    ports:
      - "8000:5000"
  redis:
    image: "redis:alpine"
```

[Docker Compose](https://docs.docker.jp/compose/toc.html)

## Kubernetes (K8s)

[Kubernetes (K8s)](https://kubernetes.io/ja/docs/concepts/overview/)

コンテナの運用管理と自動化を行うために設計されたオープンソースソフトウェアで、Google 社が社内で利用していたコンテナ管理ツールを汎用化したものです。

「クバネティス」「クバネテス」「クーべネティス」など読みます（[Wikipedia](https://ja.wikipedia.org/wiki/Kubernetes)）。「クーベ」と略したり、「K8s（ケーエイツ）」

マニフェストファイルを YAML または JSON 形式で定義します。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000000"
```