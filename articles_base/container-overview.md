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

[Docker](https://www.docker.com/)

[Kubernetes (K8s)](https://kubernetes.io/ja/docs/concepts/overview/)

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

## AWS Black Belt Online Seminar

【AWS Black Belt Online Seminar】[CON141 コンテナ入門](https://www.youtube.com/watch?v=fUPyxos7Z-k)(0:10:00)

【AWS Black Belt Online Seminar】[CON142 Docker入門](https://www.youtube.com/watch?v=CGfRsyQW1rE)(0:14:11)

【AWS Black Belt Online Seminar】[CON120 AWSコンテナ全体概要](https://www.youtube.com/watch?v=pAGW0MdNGj4)(0:17:29)

【AWS Black Belt Online Seminar】[CON110 なぜ今コンテナなのか](https://www.youtube.com/watch?v=-xqg95QBK2M)(0:09:00)

【AWS Black Belt Online Seminar】[CON130 コンテナセキュリティ100](https://www.youtube.com/watch?v=jA63YPmkQ8I)(0:16:34)

【AWS Black Belt Online Seminar】[CON231 コンテナセキュリティ入門 Part.1](https://www.youtube.com/watch?v=I1o01lkQNHY)(0:13:51)

【AWS Black Belt Online Seminar】[CON232 コンテナセキュリティ入門 Part.2](https://www.youtube.com/watch?v=OTwC6zpgZjc)(0:10:26)

【AWS Black Belt Online Seminar】[CON233 コンテナセキュリティ入門 Part.3](https://www.youtube.com/watch?v=drWE7enGFvo)(0:13:26)
