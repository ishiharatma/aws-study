<!--# Keycloak の最新バージョンをチェックする<!-- omit in toc -->

## ☘️ はじめに<!-- omit in toc -->

本ページは、AWS に関する個人の勉強および勉強会で使用することを目的に、AWS ドキュメントなどを参照し作成しておりますが、記載の誤り等が含まれる場合がございます。

最新の情報については、AWS 公式ドキュメントをご参照ください。

## 👀 Contents<!-- omit in toc -->

- [経緯](#経緯)
- [Keycloak のバージョン一覧取得](#keycloak-のバージョン一覧取得)
- [チェックする Lambda コードの概要](#チェックする-lambda-コードの概要)
- [まとめ](#まとめ)

## 経緯

## Keycloak のバージョン一覧取得

`https://quay.io/api/v1/repository/keycloak/keycloak/tag/` を呼び出すと次のレスポンスが返ってきますのでこれを利用します。

```json
{
    "tags": [
        {
            "name": "nightly",
            "reversion": false,
            "start_ts": 1713749244,
            "manifest_digest": "sha256:c3725955988f5f9db6db4d13f621c71ca69188ce337d865252eef39ab6a35a64",
            "is_manifest_list": true,
            "size": null,
            "last_modified": "Mon, 22 Apr 2024 01:27:24 -0000"
        },
        :
        {
            "name": "latest",
            "reversion": false,
            "start_ts": 1713288209,
            "manifest_digest": "sha256:0d71412ed56b5f66f7e922efc0c3ff73b3f54ba2fe84fedb5e281a1f90b95bd6",
            "is_manifest_list": true,
            "size": null,
            "last_modified": "Tue, 16 Apr 2024 17:23:29 -0000"
        },
        {
            "name": "24.0",
            "reversion": false,
            "start_ts": 1713288208,
            "manifest_digest": "sha256:0d71412ed56b5f66f7e922efc0c3ff73b3f54ba2fe84fedb5e281a1f90b95bd6",
            "is_manifest_list": true,
            "size": null,
            "last_modified": "Tue, 16 Apr 2024 17:23:28 -0000"
        },
        {
            "name": "24.0.3-0",
            "reversion": false,
            "start_ts": 1713288206,
            "manifest_digest": "sha256:0d71412ed56b5f66f7e922efc0c3ff73b3f54ba2fe84fedb5e281a1f90b95bd6",
            "is_manifest_list": true,
            "size": null,
            "last_modified": "Tue, 16 Apr 2024 17:23:26 -0000"
        },
        :
    ],
    "page": 1,
    "has_additional": true
}
```

## チェックする Lambda コードの概要

必要なモジュールをインポート

```python
import os
import json
import urllib.request
import boto3
import re
import time
```

ログは必要に応じて設定します。

```python
from logging import getLogger, INFO, DEBUG

logger = getLogger()
logger.setLevel(INFO)
```

Keycloak のバージョンタグ情報を取得します。

```python
def lambda_handler(event, context):
  url = 'https://quay.io/api/v1/repository/keycloak/keycloak/tag/'

  req = urllib.request.Request(url)
  response = ''
  # レスポンスを取得
  # {"tags":[{},{},{},...], "page": 1, "has_additional": true}
  with urllib.request.urlopen(req) as res:
      response = res.read()
  response_json = json.loads(response)

  # レスポンスからタグを取得します
  tags = response_json['tags']

  # legacy は WildFly ベースの旧バージョンなので除外する
  # end_ts がない場合は現在の時刻とする
  # 'nightly','latest' は除外
  target_tags = list(filter(lambda item : item.get("end_ts",now_unixtime) >= now_unixtime and
                                          item["name"] not in ['nightly','latest'] and
                                          not item["name"].endswith("legacy"), tags))
  target_tags_sorted = sorted(target_tags,key=lambda x: x['name'],reverse=True)
```

ECR に登録されている Keycloak のカスタムイメージを取得します。イメージタグは、「環境識別子-<Keycloak バージョン番号：0.0.0>-コミット番号」という形式になっていることが前提です。

```python
  ecrclient = boto3.client("ecr", region_name="ap-northeast-1")
  response_image_latest_tag = ecrclient.describe_images(
      repositoryName= REPO_NAME,
      imageIds=[
          {
              'imageTag': 'latest',
          }
      ]
  )
```

取得した結果を処理します。

```python
  git_pattern = re.compile(r'([0-9]+)\.([0-9]+)(\.[0-9]+)?')
  if 'imageDetails' in response_image_latest_tag:
    if len(imageTags) > 0:
      for imageTag in imageTags: # latestが付いているのは、1つのタグだけなので、1回のみの処理
          logger.debug(imageTag)
          m = p.match(imageTag)
          if m!=None:
            for ver in m.groups():
                now_ver = ver
                # タグから取得したバージョン番号とKeycloakのバージョンを比較
                ret = check_version(ver, target_tags_sorted)
                if ret['is_major_update'] or ret['is_current_major_update']:
                    # 同一メジャーか、最新メジャーバージョンが存在
                    is_latest = False
                    if ret['newer_current_version']:
                        latest_version.append(ret['newer_current_version'])
                        current_version_up = ret['newer_current_version']
                    if ret['newer_major_version']:
                        latest_version.append(ret['newer_major_version'])
                        major_version_up = ret['newer_major_version']
                    logger.info('version ng!')
                    break
                else:
                      logger.info('version ok!')
            else:
                continue
            break
```

## まとめ