---
title: "Hugoを使い始めた人に捧げるTips11選"
description: ""
date: 2021-09-16T23:10:23+09:00
lastmod: 2021-09-16T23:10:23+09:00
draft: false
tags: ["Hugo", "tips"]
categories: "Hugo"
pickups: ["sidebar"]
share: true
toc: true
comment: true
archives: ["2021年9月"]
---


## 1. とりあえず`hugo server -D`って使ってるけどこれって何？
`draft: true`のコンテンツファイルも含めて出力。

詳しくは`hugo server --help`でチェック

<br>

## 2. taxonomyとtermの違い
- taxonomyは「タグ」や「カテゴリー」といった分類自体
- termはそのタグやカテゴリーに属する「go」とか「tips」のことです

こちらのサイトが非常に分かりやすいです！  
https://maku77.github.io/hugo/taxonomy/basic.html

<br>

## 3. content配下の固定ページに共通のlayoutを使いたい
content配下のKindが「page」になるので「layout/page/single.html」が使えます

こちらのサイトが非常に分かりやすいです！  
https://maku77.github.io/hugo/template/page-types.html

<br>

## 4. PermalinkとRelPermalinkの違いは？
```go-template
{{ .Permalink }} → "https://example.com/hugo/mystyle.css"  
{{ .RelPermalink }} → "/hugo/mystyle.css"
```

<br>

## 5. absURLとrelURLの違いは？
```go-template
{{ "mystyle.css" | absURL }} → "https://example.com/hugo/mystyle.css"
{{ "mystyle.css" | relURL }} → "/hugo/mystyle.css"
```

<br>

## 6. assetsとstaticディレクトリの使い分けは？
基本的にはassetsを使い、ファイルのビルドや圧縮をしない場合にstaticを使うといいと思います

<br>

## 7. `$.Site`と`.Site`の違いは何？
$.Siteはグローバル変数に明示的にアクセスしたい場合に使います。

ページ一覧を出力する際に、その一覧ページのタイトルを出力するときなんかに使えます  
layouts/_default/list.html
```go-template
{{ range .Pages }}
    {{ $.Title }} → 一覧ページタイトル
    {{ .Title }}  → ページタイトル
{{ end }}
```

https://gohugo.io/templates/introduction/#2-use--to-access-the-global-context

<br>

## 8. partial templateへの引数の渡し方は？
こんな感じで渡せます

layouts/partials/svgs/external-links.svg
```go-template
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
fill="{{ .fill }}" width="{{ .width }}" height="{{ .height }}" viewBox="0 0 32 32" aria-label="External Link">
</svg>
```

layouts/_default/list.html
```go-template
{{ partial "svgs/external-links.svg" (dict "fill" "#01589B" "width" 10 "height" 20 ) }}
```

詳しくは公式サイトをチェック  
https://gohugo.io/functions/dict/  
https://gohugo.io/templates/partials/

<br>

## 9. 配列や連想配列の空チェック
`reflect.IsSlice`や`reflect.IsMap`を使わなくても、if文でシンプルにチェックできます

```go-template
{{ $item := dict "tags" (slice "tag1" "tag2") }}
{{ if $item.tags }}
    {{ range $item.tags }}
        {{ . }}
    {{ end }}
{{ end }}
```

<br>

## 10. Hugoのテンプレート内のハイフンの有無について
前後の空白を取り除いてくれます
`{{- .Title -}}`

詳しくは公式サイトをチェック  
https://gohugo.io/templates/introduction/#whitespace

<br>

## 11. キャメルケースのタグが小文字に変換されてしまう
configの`disablePathToLower`trueにすると、小文字に変換されるのを無効にできます

```
disablePathToLower: true
```
