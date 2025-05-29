---
title: "Hugo標準のショートコード表示サンプル"
description: ""
date: 2021-09-11T23:09:41+09:00
lastmod: 2021-09-11T23:09:41+09:00
draft: false
tags: ["Hugo", "ショートコード"]
categories: "サンプル"
share: true
toc: true
comment: true
archives: ["2021年9月"]
---

Hugoで用意されているショートコード使用時の表示サンプルです

## figure

{{< figure src="suica.png" title="スイカの画像" >}}

## gist

{{< gist spf13 7896402 >}}

※このgistショートコードはHugoのバージョン0.143.0で非推奨となり、将来のリリースで削除予定なので
Hugo Theme Salt内のショートコードに移行しました

{{< self-blog-card "/article/salt/gist" >}}


## highlight

{{< highlight html >}}
<section id="main">
  <div>
   <h1 id="title">{{ .Title }}</h1>
    {{ range .Pages }}
        {{ .Render "summary"}}
    {{ end }}
  </div>
</section>
{{< /highlight >}}


## instagram

{{< instagram CxOWiQNP2MO >}}

## X

{{< x user="SanDiegoZoo" id="1453110110599868418" >}}

## vimeo

{{< vimeo 146022717 >}}

## youtube

{{< youtube w7Ft2ymGmfc >}}
