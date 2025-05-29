---
title: "Hugo標準のgistショートコードをテーマ内に移行しました"
description: ""
date: 2025-05-28T18:02:09+09:00
lastmod: 2025-05-28T18:02:09+09:00
draft: false
tags: ["Hugo", "ショートコード"]
categories: "Saltの使い方"
archives: ["2025年5月"]
share: true
toc: false
comment: true
---

Hugo公式のgistショートコードはバージョン0.143.0で非推奨となり、将来のリリースで削除されるそうなので
Hugo Theme Salt内ののショートコードとして使えるように移行しました

```
WARN  The "gist" shortcode was deprecated in v0.143.0 and will be removed in a future release. See https://gohugo.io/shortcodes/gist for instructions to create a replacement.
```

Hugo公式ページでは下記の通り

{{< blog-card "https://gohugo.io/shortcodes/gist/" >}}

<br>

> The gist shortcode was deprecated in version 0.143.0 and will be removed in a future release. To continue embedding > GitHub Gists in your content, you’ll need to create a custom shortcode:

Gist ショートコードはバージョン 0.143.0 で非推奨となり、今後のリリースで削除される予定です。コンテンツに GitHub Gist を埋め込むには、カスタムショートコードを作成する必要があります。

> Create a new file: Create a file named gist.html within the layouts/shortcodes directory.
> Copy the source code: Paste the original source code of the gist shortcode into the newly created gist.html file.
> This will allow you to maintain the functionality of embedding GitHub Gists in your content after the deprecation of the original shortcode.

新規ファイルの作成: layouts/shortcodes ディレクトリ内に gist.html というファイルを作成します。ソースコードをコピー: 新規作成した gist.html ファイルに、Gist ショートコードの元のソースコードを貼り付けます。これにより、元のショートコードが非推奨になった後も、コンテンツに GitHub Gist を埋め込む機能を維持できます。

ソースコード：
{{< blog-card "https://github.com/gohugoio/hugo/blob/v0.147.5/tpl/tplimpl/embedded/templates/_shortcodes/gist.html" >}}

<br>

layouts/shortcodes/gist.html
```
<script src="https://gist.github.com/{{ index .Params 0 }}/{{ index .Params 1 }}.js{{if len .Params | eq 3 }}?file={{ index .Params 2 }}{{end}}"></script>
```

<br>

そしてこのテーマ内では同様のショートコードを移行しているので引き続き使用可能です

```
{{</* gist spf13 7896402 */>}}
```

{{< gist spf13 7896402 >}}
