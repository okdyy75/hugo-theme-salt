---
title: "Go言語Tips② Hugoで使われるlayoutの正体"
description: ""
date: 2021-09-13T11:59:12+09:00
lastmod: 2021-09-13T11:59:12+09:00
draft: false
tags: ["go", "Hugo", "go-template", "tips"]
categories: "Go言語"
share: true
---

<br>

Hugoで使われるlayoutですが実態は**go-template**という、いわゆるテンプレートエンジンです

https://pkg.go.dev/text/template

<br>

## テンプレート内のハイフンありなしの違い
たまにHugoテンプレート内で`{{ .Title }}`や`{{- .Title -}}`で書いてるものを見かけます
この違いはハイフンを付けることで前後の空白を除去したい場合に使われます

ちなみに公式ドキュメントにあります  
https://pkg.go.dev/text/template#hdr-Text_and_spaces

<br>

## 配列や連想配列の空チェック

Hugoを使う際、空ではない文字列or配列or連想配列のチェックする時に、最初はこんな感じで空チェックをしていたんですが

```go-template
{{ $item := dict "tags" (slice "tag1" "tag2") }}

{{ if isset $item "tags" }}
    {{ if gt (len $item.tags) 0 }}
        {{ if reflect.IsMap $item.tags }}
            空ではない連想配列です
        {{ else if reflect.IsSlice $item.tags }}
            空ではない配列です
        {{ else }}
            空ではない文字列です
        {{ end }}
    {{ end }}
{{ end }}
```

if文を使うともっとシンプルに書けます

```go-template
{{ if $item.tags }}
    {{ if reflect.IsMap $item.tags }}
        空ではない連想配列です
    {{ else if reflect.IsSlice $item.tags }}
        空ではない配列です
    {{ else }}
        空ではない文字列です
    {{ end }}
{{ end }}
```

<br>

これはgo-templateの仕様でifの「偽」とみなされる値は  
**false、0、nil、""（空文字）、長さ0の配列・連想配列**  
となるためです

https://pkg.go.dev/text/template#hdr-Actions
