---
title: "Hugoで一週間のPV数順の人気記事を作る方法"
description: ""
date: 2022-01-12T15:34:42+09:00
lastmod: 2022-01-12T15:34:42+09:00
draft: false
tags: ["人気記事", "ランキング", "GA", "tips"]
categories: "Hugo"
archives: ["2022年1月"]
share: true
toc: true
comment: true
---

HugoとGoogle Analyticsを使って人気記事のランキングを作る方法を紹介します

ステップとしては
1. GCPから鍵を作成し、Google Analyticsで権限を付与
2. Google Analytics Data APIからpv数を取得するスクリプトを作成
3. 保存したpvデータを元にHugoからランキング作成
4. CIで定期的にpv取得スクリプトを起動させる

<br>

## 1. GCPから鍵を作成し、Google Analyticsで権限を付与

基本的にはdevelopers IOさんの記事を参考にします。「Google Analyticsでサービスアカウント用のユーザーに権限を与える」の部分まで実行してください。

2020年10月以降はGA4が使われるようになったので「Google Analytics Data API」を使います。そちらを有効にしてください。

[アナリティクス Reporting API v4を使ってGoogle Analyticsのデータを取得する](https://dev.classmethod.jp/articles/ga-api-v4/)

<br>

## 2. Google Analytics Data APIからpv数を取得するスクリプトを作成

まずは必要なnpmライブラリをinstallします

```bash
npm install @google-analytics/data
npm install dayjs
```

次にpv取得スクリプトを作成します。`propertyId`にはgoogle analyticsのプロパティIDを、`process.env.GOOGLE_APPLICATION_CREDENTIALS`には上記の記事で作成したcredentialsファイルを指定します。

scripts/create-ranking.js

```js
try {
    /**
     * TODO(developer): Uncomment this variable and replace with your
     *   Google Analytics 4 property ID before running the sample.
     */
    propertyId = '286243825'
    process.env.GOOGLE_APPLICATION_CREDENTIALS = `.gcp/google-analytics_credentials.json`

    // Imports the Google Analytics Data API client library.
    const dayjs = require('dayjs')
    const utc = require('dayjs/plugin/utc.js')
    const timezone = require('dayjs/plugin/timezone.js')
    const fs = require('fs')
    const { BetaAnalyticsDataClient } = require('@google-analytics/data')

    dayjs.extend(timezone)
    dayjs.extend(utc)
    dayjs.tz.setDefault('Asia/Tokyo')

    // Using a default constructor instructs the client to use the credentials
    // specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
    const analyticsDataClient = new BetaAnalyticsDataClient()

    // Runs a simple report.
    async function runReport() {
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                {
                    startDate: '8daysAgo',
                    endDate: '1daysAgo',
                },
            ],
            dimensions: [
                {
                    name: 'pagePath',
                },
            ],
            metrics: [
                {
                    name: 'screenPageViews',
                },
            ],
        })

        let rankings = []
        response.rows.forEach((row) => {
            rankings.push({
                pagePath: row.dimensionValues[0].value,
                pv: row.metricValues[0].value,
            })
        })
        fs.writeFileSync(
            'data/ranking.json',
            JSON.stringify(
                {
                    items: rankings,
                    createdAt: dayjs().toISOString(),
                },
                null,
                4
            )
        )
    }

    runReport()
} catch (error) {
    console.error(error)
}
```

GA4向けのGoogle Analytics Data APIのドキュメントTOP  
https://developers.google.com/analytics/devguides/reporting/data/v1

Google Analytics Data APIクイックスタート  
https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries

dimensions（寸法）一覧  
https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#dimensions

metrics（指標）一覧  
https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#metrics

--------------------------------------------------

package.jsonのscriptsに追記します

```json
  "scripts": {
    "create-ranking": "node scripts/create-ranking.js"
```

そして`npm run create-ranking`を実行するとdataディレクトリに下記のようなjsonが出力されます

ranking.json

```json
{
    "items": [
        {
            "pagePath": "/",
            "pv": "49"
        },
        {
            "pagePath": "/article/salt/about/",
            "pv": "14"
        },
        {
            "pagePath": "/article/hugo/archive/",
            "pv": "11"
        },
        ...
    ],
    "createdAt": "2022-01-12T08:46:12.008Z"
}
```

<br>

## 3. 保存したpvデータを元にHugoからランキング作成

```go-template
{{ $ranking := slice }}
{{ range $item := sort .Site.Data.ranking.items "pv" "desc" }}
    {{ with $page := $.Site.GetPage (path.Clean $item.pagePath) }}
        {{ if eq .Section "article" }}
            {{ $ranking = $ranking | append (dict "page" $page "pv" $item.pv) }}
        {{ end }}
    {{ end }}
{{ end }}
{{ $ranking }}
```

`{{ $ranking }}`を展開してみるとこのようなmapになるのであとは表示するだけです

```
[
    map[page:Page(/article/salt/about/index.md) pv:14] 
    map[page:Page(/article/hugo/archive/index.md) pv:11] 
    map[page:Page(/article/salt/custom-figure/index.md) pv:8] 
    map[page:Page(/article/hugo/tips/index.md) pv:6] 
    map[page:Page(/article/salt/self-blog-card/index.md) pv:5] 
    map[page:Page(/article/sample/hugo-shortcode/index.md) pv:4] 
    map[page:Page(/article/hugo/search/index.md) pv:3] 
    map[page:Page(/article/go/go-template/index.md) pv:2] 
    map[page:Page(/article/go/variable/index.md) pv:2] 
    map[page:Page(/article/hugo/about/index.md) pv:2] 
    map[page:Page(/article/sample/markdown/index.md) pv:2] 
    map[page:Page(/article/hugo/fontawsome/index.md) pv:1]
]
```

<br>

## 4. CIで定期的にpv取得スクリプトを起動させる

あとは毎日CIで実行させればOK。

### GitHub Actions

gcpからDLした鍵の内容をGitHubのsercretsに`GOOGLE_ANALYTICS_CREDENTIALS`として保存してください。

.github/workflows/create_ranking.yml

```yml
name: Create Ranking

on:
  push:
    branches:
      - main
  schedule:
    - cron: '0 0 * * *'

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v2

      - name: Setup npm
        uses: actions/setup-node@v1
        with:
          node-version: '14.x'

      - uses: actions/cache@v1
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-

      - name: npm Install
        run: |
          npm ci

      - name: Create Ranking
        env:
          GOOGLE_ANALYTICS_CREDENTIALS: ${{ secrets.GOOGLE_ANALYTICS_CREDENTIALS }}
        run: |
          mkdir .gcp
          echo "$GOOGLE_ANALYTICS_CREDENTIALS" > .gcp/google-analytics_credentials.json
          npm run create-ranking

      - name: Commit and Push
        run: |
          git branch
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git commit -am "Create Ranking"
          git push origin HEAD

```


### GitLab CI
GitLabのプロジェクトを選択し、設定 > CI/CD > 変数に下記を設定
- `GITLAB_USER_EMAIL`はGitLabで使っているemail
- `GITLAB_USER_NAME`はGitLabで使っているuser name
- `SSH_PRIVATE_KEY`はGitLab CIからpushする用のssh key
- `GOOGLE_ANALYTICS_CREDENTIALS`はGCPから落としてきた鍵の中身

`SSH_PRIVATE_KEY`はssh-keygenコマンドから作成した秘密鍵をセットしてください
```
mkdir ./.ssh
ssh-keygen
> ./.ssh/gitlab_id_rsa
> Enter
> Enter
Your identification has been saved in .ssh/gitlab_id_rsa
Your public key has been saved in .ssh/gitlab_id_rsa.pub
```

GitLabのユーザー設定 > SSH鍵に公開鍵を登録するのをお忘れなく！

.gitlab-ci.yml

```yml
stages:
  - build
  - deploy

variables:
  GIT_SUBMODULE_STRATEGY: recursive

create-ranking:
  timeout: 5m
  stage: build
  image: node:14
  before_script:
    - eval `ssh-agent`
    - ssh-add <(echo "$SSH_PRIVATE_KEY")
    - mkdir .gcp
    - echo "$GOOGLE_ANALYTICS_CREDENTIALS" > .gcp/google-analytics_credentials.json
  script:
    - git config --global user.email $GITLAB_USER_EMAIL
    - git config --global user.name $GITLAB_USER_NAME
    - git remote set-url origin git@$CI_SERVER_HOST:$CI_PROJECT_PATH.git
    - git checkout $CI_COMMIT_REF_NAME
    - npm ci
    - npm run create-ranking
    - git add ./data
    - git commit -am "Create Ranking"
    - git -c core.sshCommand="ssh -oStrictHostKeyChecking=no" push origin ${CI_COMMIT_REF_NAME}
  only:
    - schedules

pages:
  timeout: 5m
  stage: deploy
  image: node:14
  script: |
    npm ci
    npm run build
  artifacts:
    paths:
      - public
  only:
    - main
```

最後にCI/CD > スケジュールから新規スケジュールを追加してください
