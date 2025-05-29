---
title: "Content adaptersに対応しました＆既存の記事の移行方法"
description: ""
date: 2025-05-29T20:02:09+09:00
lastmod: 2025-05-29T20:02:09+09:00
draft: false
tags: []
categories: ""
archives: ["2025年5月"]
share: true
toc: true
comment: true
---

Hugo Theme SaltでもContent adaptersに対応しました。  
使用方法と移行方法をまとめたのでご参考に

## 前提として
- 目次が使えません
- ページバンドル内の画像ファイル等が考慮されていません（記事本文を修正する必要あり）
- 本文内にHugoの記法がある場合ビルドエラーになります（`{{ xxx }}`の記述）
- ディレクトリ構造について
    - 下記の構成で記事を保存している
        - content/article/[category]/[article]/index.md
        - content/article/[category]/[article]/thumbnail.jpg
    - 記事ディレクトリパスと記事URLパスが同一（slugを使用している場合は未検証）

## Content adaptersを使用した記事表示

大まかな流れとしては下記の通り

1. assetsディレクトリ内に記事jsonとサムネ画像を配置
2. カテゴリーディレクトリに_content.gotmplを作成（今回は「hugo-release」カテゴリー）

### 1. assetsディレクトリ内に記事jsonとサムネ画像を配置

下記形式で記事データを配置して下さい

```
├── assets
│   ├── article
│   │   └── hugo-release
│   │       ├── v0.145.0
│   │       │   ├── index.json
│   │       │   └── thumbnail.png
│   │       ├── v0.146.0
│   │       │   ├── index.json
│   │       │   └── thumbnail.png
│   │       └── v0.147.0
│   │           ├── index.json
│   │           └── thumbnail.jpg
```

サムネを使用する場合は`thumbnail: `にassetsディレクトリ内の画像パスを記載して下さい

assets/article/hugo-release/v0.145.0/index.json
```json
{
    "path": "v0.145.0",
    "title": "Hugo v0.145.0 リリースノートまとめ",
    "description": "",
    "date": "2025-05-29T15:23:31+09:00",
    "lastmod": "2025-05-29T15:23:31+09:00",
    "draft": false,
    "tags": [
        "Hugo",
        "Hugoリリースノートまとめ"
    ],
    "categories": "Hugoリリース",
    "archives": [
        "2025年5月"
    ],
    "share": true,
    "toc": false,
    "comment": true,
    "thumbnail": "/article/hugo-release/v0.145.0/thumbnail.png",
    "content": "<div class=\"markdown-alert markdown-alert-warning\" dir=\"auto\"><p class=\"markdown-alert-title\" dir=\"auto\">..."
}
```

### 2. カテゴリー内に_content.gotmplを作成

_content.gotmplを作成

```
├── content
│   ├── article
│   │   └── hugo-release
│   │       └── _content.gotmpl
```

gotmpl内の読み込みディレクトリ（`article/[category]`）は対象のカテゴリに変更して下さい

exampleContent/article/hugo-release/_content.gotmpl
```go-template
{{ $data := slice }}

{{ range where (os.ReadDir "assets/article/hugo-release") "IsDir" "eq" true }}
    {{ $path := .Name }}
    {{ with resources.Get (printf "article/hugo-release/%s/index.json" $path) }}
        {{ with . | transform.Unmarshal }}
            {{ $data = $data | append . }}
        {{ end }}
    {{ end }}
{{ end }}

{{ range $data }}
    {{ $content := dict
        "mediaType" "text/markdown"
        "value" .content
    }}
    {{ $dates := dict
        "date" (time.AsTime .date)
        "lastmod" (time.AsTime .lastmod)
    }}
    {{ $params := dict
        "title" .title
        "description" .description
        "date" (time.AsTime .date)
        "lastmod" (time.AsTime .lastmod)
        "tags" .tags
        "categories" .categories
        "archives" .archives
        "draft" .draft
        "share" .share
        "toc" .toc
        "comment" .comment
        "thumbnail" .thumbnail
    }}
    {{ $page := dict
        "path" .path
        "title" .title
        "draft" .draft
        "dates" $dates
        "content" $content
        "params" $params
    }}
    {{ $.AddPage $page }}
{{ end }}
```

Hugoサーバーを起動して記事が表示される事を確認して下さい

```
hugo server -D --disableFastRender
```

<br><br>

## 移行の流れ
大まかな移行の流れとしては下記の通りです

1. 移行したい記事のURL一覧、記事データをjson出力
2. assets配下に記事データをコピーするスクリプトを実行
4. Content adaptersへの移行
5. 後片付け


### 移行したい記事のURL一覧、記事データをjson出力

json出力するためにconfig.ymlに下記を追記して下さい

config.yml

```yml
outputs:
  home:
    - html
    - json
  page:
    - html
    - json
```

Hugo Theme Salt内で全記事を対象にする場合は下記の様にして下さい

layouts/_default/home.json
```go-template
[
  {{- range $index, $page := where .Site.RegularPages "Section" "article" -}}
    {{- if $index }},{{- end -}}
    {{- $page.Permalink | jsonify -}}
  {{- end -}}
]
```

layouts/_default/single.json
```go-template
{
    "path": {{ path.BaseName .RelPermalink | jsonify }},
    "title": {{ .Params.Title | jsonify }},
    "description": {{ .Params.Description | jsonify }},
    "date": {{ .Params.Date | jsonify }},
    "lastmod": {{ .Params.Lastmod | jsonify }},
    "draft": {{ .Draft | jsonify }},
    "tags": {{ .Params.Tags | jsonify }},
    "categories": {{ .Params.Categories | jsonify }},
    "archives": {{ .Params.Archives | jsonify }},
    "share": {{ .Params.share | jsonify }},
    "toc": {{ .Params.toc | jsonify }},
    "comment": {{ .Params.comment | jsonify }},
    {{ with .Resources.GetMatch "thumbnail.*" }}
        "thumbnail": {{ .RelPermalink | jsonify }},
    {{ else with .Params.thumbnail }}
        "thumbnail": {{ . | jsonify }},
    {{ end }}
    "content": {{ .Content | jsonify }}
}
```

ローカルサーバーを起動して

```bash
hugo server -D --disableFastRender
```

URL一覧と  
http://localhost:1313/index.json

記事データがjsonが出力されているかを確認して下さい  
http://localhost:1313/article/hugo-release/v0.147.0/index.json



### ②assets配下に記事データをコピーするスクリプトを実行

記事のURL一覧を元に、記事json＆サムネ画像を保存するスクリプトを実行します

```bash
node scripts/copy-article-to-assets.js
```

scripts/copy-article-to-assets.js
```js
const fs = require('fs')
const path = require('path')

/**
 * 記事データをコピーし、assetsディレクトリに保存するスクリプト
 * Usage: node scripts/copy-article-to-assets.js
 */

// ベースディレクトリの設定
const BASE_DIR = path.resolve(__dirname, '..')
const ASSETS_DIR = path.join(BASE_DIR, 'assets')
const CONTENT_DIR = path.join(BASE_DIR, 'content')

/**
 * JSONのURLを取得して指定ディレクトリにindex.jsonとして保存する
 */
async function saveIndexJson(inputJsonUrl, outputJsonDir) {
    const response = await fetch(inputJsonUrl)
    const jsonData = await response.json()
    const saveFilePath = path.join(outputJsonDir, 'index.json')
    fs.mkdirSync(outputJsonDir, { recursive: true })
    fs.writeFileSync(saveFilePath, JSON.stringify(jsonData, null, 4), 'utf-8')
    console.log(`index.jsonを保存しました: ${saveFilePath}`)
}

/**
 * 指定ディレクトリからthumbnail画像をコピーする
 */
function copyThumbnailImage(inputThumbnailDir, outputThumbnailDir) {
    if (!fs.existsSync(inputThumbnailDir)) {
        // ディレクトリが存在しない場合はコピーしない
        return
    }
    const files = fs.readdirSync(inputThumbnailDir)
    const thumbnailFiles = files.filter((file) => /^thumbnail\..+/.test(file))

    if (thumbnailFiles.length > 0) {
        const thumbnailFile = thumbnailFiles[0]
        const inputFilePath = path.join(inputThumbnailDir, thumbnailFile)
        const outputFilePath = path.join(outputThumbnailDir, thumbnailFile)
        fs.mkdirSync(outputThumbnailDir, { recursive: true })
        fs.copyFileSync(inputFilePath, outputFilePath)
        console.log(`サムネイル画像をコピーしました`)
        console.log(`from: ${inputFilePath}`)
        console.log(`  to: ${outputFilePath}`)
    }
}

/**
 * メイン処理
 */
async function main() {
    // サイトのindex.jsonからURL一覧を取得
    const siteIndexUrl = 'http://localhost:1313/index.json'
    const response = await fetch(siteIndexUrl)
    const urls = await response.json()

    for (const url of urls) {
        console.log('==========================================')
        console.log(`対象URL: ${url}`)

        // URLからパスを抽出
        const urlObj = new URL(url)
        const urlPath = urlObj.pathname

        // 1. index.jsonを取得＆保存
        const inputJsonUrl = `${url}index.json`
        const outputJsonDir = path.join(ASSETS_DIR, urlPath)
        await saveIndexJson(inputJsonUrl, outputJsonDir)

        // 2. thumbnail画像をコピー
        const inputThumbnailDir = path.join(CONTENT_DIR, urlPath)
        const outputThumbnailDir = path.join(ASSETS_DIR, urlPath)
        copyThumbnailImage(inputThumbnailDir, outputThumbnailDir)
        console.log('==========================================\n')
    }
}

;(async () => {
    console.log('処理を開始します...')
    await main()
    console.log('処理が完了しました！')
})()
```

実行後は下記の形式で保存されます。Content adaptersを使用しない記事データは適宜削除して下さい

```
assets/article/hugo-release/v0.145.0/index.json
assets/article/hugo-release/v0.145.0/thumbnail.png
```


### ③Content adaptersへの移行

[Content adaptersを使用した記事表示の流れ](#content-adaptersを使用した記事表示)を参考にContent adaptersを実装して下さい

### ④後片付け

最後に移行作業用に作成したファイルや記述を削除して作業完了です！

config.ymlの下記記述を削除

```diff
-outputs:
-  home:
-    - html
-    - json
-  page:
-    - html
-    - json
-
```

移行に使用したテンプレートファイルを削除

```
rm layouts/_default/home.json
rm layouts/_default/single.json
```
