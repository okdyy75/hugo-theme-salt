---
title: "Hugoでついに外部URLのブログカードを作れるようになった【自作ショートコード】"
description: ""
date: 2022-05-06T23:34:09+09:00
lastmod: 2022-05-06T23:34:09+09:00
draft: false
tags: ["Hugo", "ショートコード"]
categories: "Saltの使い方"
archives: ["2022年5月"]
share: true
toc: true
comment: true
---

Hugoでは外部サイトのデータを扱う場合、`getJSON`や`getCSV`を使った方法しかありませんでしたが、ついにv0.91で`GetRemote`が実装されました。

{{< blog-card "https://github.com/gohugoio/hugo/releases/tag/v0.91.0" >}}

<br>

{{< blog-card "https://gohugo.io/hugo-pipes/introduction/#get-resource-with-resourcesget-and-resourcesgetremote" >}}

<br>

## GetRemoteの基本

基本の使い方はこんな感じで、html以外にも外部の画像、css、jsといったデータも取得できます。

```go-template
{{ with resources.GetRemote "https://example.com" }}
    {{ .Content }}
{{ end }}
```

エラーハンドリング

```go-template
{{ with resources.GetRemote "https://gohugo.io/images/gohugoio-card-1.png" }}
  {{ with .Err }}
    {{ warnf "%s" . }}
  {{ else }}
    <img src="{{ .RelPermalink }}" width="{{ .Width }}" height="{{ .Height }}" alt="">
  {{ end }}
{{ end }}
```

<br>

## 外部URLブログカードのショートコード

### 実際のコード
- unmarshalを使いたかったのですが、多くのサイトでパースエラーが起きてしまうので、正規表現を使うことにしました。

layouts/shortcodes/blog-card.html

```go-template
{{- $url := (.Get 0) -}}
{{- with $result := resources.GetRemote $url -}}
    {{- if $result.Err -}}
        {{ $result.Err }}
    {{ else }}
        {{- $title := "" -}}
        {{- $description := "" -}}
        {{- $image := "" -}}
        {{- with $findHead := index (findRE "<head>(.|\n)*?</head>" $result.Content) 0 -}}
            {{- range $meta := findRE "<meta.*?>" $findHead -}}
                {{- $property := replaceRE "<.*property=\"(.*?)\".*>" "$1" $meta -}}
                {{- $content := replaceRE "<.*content=\"(.*?)\".*>" "$1" $meta -}}
                {{- if eq $property "og:title" -}}
                    {{- $title = $content -}}
                {{- else if eq $property "og:description" -}}
                    {{- $description = $content -}}
                {{- else if eq $property "og:image" -}}
                    {{- $image = $content -}}
                {{- end -}}
            {{- end -}}
        {{- end -}}

        {{- $thumbnail := resources.GetRemote $image -}}
        {{- if $thumbnail.Err -}}
            {{- $thumbnail = resources.Get $.Site.Params.dafaultNoimage -}}
            {{- $thumbnail = $thumbnail.Fit (printf "200x200 center q%d webp" $.Site.Params.imageQuality) -}}
        {{- else -}}
            {{- $thumbnail = $thumbnail.Fit (printf "200x200 center q%d webp" $.Site.Params.imageQuality) -}}
        {{- end -}}

        <a href="{{- $url -}}" style="padding: 12px;border: solid 1px #eee;display: flex;text-decoration: none;color: #000;" onMouseOver="this.style.opacity='0.9'">
            <div style="flex-shrink: 0;">
                <img src="{{- $thumbnail.Permalink -}}" alt="{{- $title -}}" width="100" height="100" style="object-fit: contain;">
            </div>
            <div style="margin-left: 10px;">
                <h2 style="margin: 0;padding-bottom: 13px;border: none;font-size: 16px;">
                    {{- $title -}}
                </h2>
                <p style="margin: 0;font-size: 13px;">
                    {{- $description | plainify | safeHTML -}}
                </p>
            </div>
        </a>
    {{- end -}}
{{- end -}}
```

### 使い方
- 外部のurlを設定するだけ
- このサイトで使っているHugoブログテーマ「Salt」内でも実装済みです

```
{{</* blog-card "https://hugo-theme-salt.okdyy75.com/" */>}}
```

### 表示例

{{< blog-card "https://qiita.com" >}}

<br>

{{< blog-card "https://zenn.dev/" >}}

<br>

{{< blog-card "https://b.hatena.ne.jp/" >}}

<br>

{{< blog-card "https://hugo-theme-salt.okdyy75.com/" >}}

### エラー時の表示例

#### ページが存在しない場合（500系など）
- その場でエラーメッセージが表示されます

```
{{</* blog-card "https://example.com.invalid/" */>}}
```

{{< blog-card "https://example.com.invalid/" >}}

#### ページが見つからない場合（400系など）
- 何も表示されません

```
{{</* blog-card "https://example.com/test" */>}}
```

{{< blog-card "https://example.com/test" >}}


#### metaタグに`og:image`がない場合  
- デフォルトのNoImage画像が表示されます

```
{{</* blog-card "https://example.com" */>}}
```

{{< blog-card "https://example.com" >}}

<br>

#### metaタグに`og:image`が存在するが、リンク切れを起こしている場合
- リンク切れで表示されます。（`src=""`）

```
{{</* blog-card "https://hugo-theme-salt.okdyy75.com/test.html" */>}}
```

{{< blog-card "https://hugo-theme-salt.okdyy75.com/test.html" >}}
