# AWS CloudFormation IaC ジェネレーター<!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

- [CloudFormation IaC ジェネレーター とは](#cloudformation-iac-ジェネレーター-とは)
- [やってみる](#やってみる)
- [📖 さいごに](#-さいごに)

## CloudFormation IaC ジェネレーター とは

既存リソースから、CloudFormation のテンプレートを作成できる機能です。

[AWS CloudFormation>リリース履歴](https://docs.aws.amazon.com/ja_jp/AWSCloudFormation/latest/UserGuide/ReleaseHistory.html)

![iac_generator_release](/images/cfn_iac_generator/iac_generator_release.png)

## やってみる

AWS CloudFormation コンソールにログインします。[IaC ジェネレーター]をクリックします。

![](/images/cfn_iac_generator/iac_generator_1_menu.jpg)

[新しいスキャンを開始]をクリックして、スキャンを開始します。

![](/images/cfn_iac_generator/iac_generator_2.jpg)

1000 個のリソースで最大 10 分となっていますが、5 分くらいだったと思います。
![](/images/cfn_iac_generator/iac_generator_3_scan.jpg)

「2804」もリソースがあったようです。そんなに？と思いましたが、これは後で出てくる CloudWatch ログがかなりの割合を占めていたようです。

![](/images/cfn_iac_generator/iac_generator_4_scan_complete.jpg)

スキャンした内容からテンプレートを作成します。

![](/images/cfn_iac_generator/iac_generator_5_create_template.jpg)

テンプレートにする対象リソースを一つずつ選択しなけれなばりません。
![](/images/cfn_iac_generator/iac_generator_6_resource_select_0.jpg)

列ヘッダ部分にある全選択をするといくつか選択されません。「スタックによる管理」が「はい」になっているものが選択されないようです。

既存スタック管理のリソースが選択できれば、既存テンプレートと違いがあるか確認できたのですが、残念。

![](/images/cfn_iac_generator/iac_generator_6_resource_select_1.jpg)

次のページに移動すると、選択されていないので、先ほどと同じことを繰り返す必要があります。

ドキュメントにも「必要なリソースがすべてテンプレートに追加されるまで繰り返します。」と書いてあります。結構大変です。（※この点について、「さいごに」の部分に補足しています）

![](/images/cfn_iac_generator/iac_generator_6_resource_select_2.jpg)

ページ数が減るので、「スタック管理されていて選択できないもの」くらい除外できないかと思いましたが、「リソースタイプ／タグキー／タグ値／リソース識別子」でしか検索できず、演算子は一致（＝）でしか絞り込めません。

![](/images/cfn_iac_generator/iac_generator_6_resource_select_3a.png)

![](/images/cfn_iac_generator/iac_generator_6_resource_select_3.jpg)

無心で全選択 → ページ移動を繰り返すと、「AWS::Logs::LogStream」ばかりになってきました。スキャンしたリソース数が多かったのはこれが原因です。
今回はお試しなので、これくらいでやめてテンプレートを生成しようと思います。

![](/images/cfn_iac_generator/iac_generator_6_resource_select_4.jpg)

[次へ]をクリックすると
![](/images/cfn_iac_generator/iac_generator_6_resource_select_5.jpg)

「リソースの数は 500 を超えることができません」となりました。無心で 894 リソースを選択したのはやりすぎでした。。

![](/images/cfn_iac_generator/iac_generator_6_resource_select_6.jpg)

ドキュメントに書いてあります。（事前によく読みましょう・・）

![](/images/cfn_iac_generator/iac_generator_6_resource_select_7.jpg)

チェックを外して減らすのも大変ですが、なんとか減らしました。

![](/images/cfn_iac_generator/iac_generator_6_resource_select_8.jpg)

[次へ]で進むと、「関連リソースを追加」ということで全部にチェックが入っているようです。
`AWS::Logs::LogStream` は不要だと思いつつも、チェック外すのが大変そうだったので、そのまま[次へ]

![](/images/cfn_iac_generator/iac_generator_7_related_add_1a.jpg)

[次へ]で進むと、また出ました。「リソースの数は 500 を超えることができません」
親切に全部チェック入っているものを解除しなければなりませんでした。。

![](/images/cfn_iac_generator/iac_generator_7_related_add_1b.jpg)

何とかチェックを外して、[次へ]をクリック。

![](/images/cfn_iac_generator/iac_generator_7_related_add_2.jpg)

[テンプレートを作成]をクリック！
![](/images/cfn_iac_generator/iac_generator_8_1.jpg)

・・・最初に指定したテンプレート名に `_` が使われているのを注意されてしまいました（最初に教えて・・）
`-` に変更して、[テンプレートを作成]をクリック！

![](/images/cfn_iac_generator/iac_generator_8_2.jpg)

ようやく生成が開始されました。

![](/images/cfn_iac_generator/iac_generator_9_finish_0.jpg)

しばらくすると、「Internal Error」が！詳細については、「テンプレートリソース」を参照してくださいとあったので確認してみます。

![](/images/cfn_iac_generator/iac_generator_9_finish_1.jpg)

全部、「COMPLETE」となっていて何が失敗か分かりません。
![](/images/cfn_iac_generator/iac_generator_9_finish_2.jpg)

テンプレートの定義タブに戻って見ると、[ダウンロード]がクリックできるので、ダウンロードをしてみると YAML ファイルがダウンロードできました。
![](/images/cfn_iac_generator/iac_generator_9_finish_2a.jpg)

生成されています。

![](/images/cfn_iac_generator/iac_generator_9_finish_3.png)

ただ、[スタックにインポート]というボタンが押せないので、ファイルは生成されているが処理が最後まで完了しなかったということなのでしょうか。

![](/images/cfn_iac_generator/iac_generator_9_finish_4.jpg)

しっかり対象リソースを選択できていれば、次のように成功するようです。
![](/images/cfn_iac_generator/iac_generator_9_finish_5.png)

## 📖 さいごに

今回は AWS CloudFormation の IaC ジェネレーターがマネジメントコンソールでも使えるようになっていたので、お試しで確認してみました。
リソース選択のところは除外もできるといいなと思いましたが、次のような使い方にすることで除外しなくても出来そうです。

リソースタイプで、`AWS::ApiGateway::RestApi` のようにメインとなるリソースだけ選択すれば関連リソースが抽出されて追加されます。ドキュメントには、「必要なリソースがすべてテンプレートに追加されるまで繰り返します。」と書いてありますが、関連リソース抽出機能に期待したリソース選択をすることで、選択の手間も軽減されてよいのではないかと思いました。