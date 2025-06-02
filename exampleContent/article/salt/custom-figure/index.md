---
title: "画像のリサイズ・トリミング可能な自作ショートコード"
description: ""
date: 2021-09-11T23:39:15+09:00
lastmod: 2021-09-11T23:39:15+09:00
draft: false
tags: ["Hugo", "ショートコード"]
categories: "Saltの使い方"
pickups: ["sidebar"]
pickups_weight: -90
share: true
toc: true
comment: true
archives: ["2021年9月"]
---

このテーマ内で画像のリサイズ・トリミングができる「custom-figure」というショートコードを作成しました。

## 使い方
- Hugo標準の[figureショートコード](https://gohugo.io/shortcodes/figure/)の機能をそのまま使えます
- Hugoの[Image Processing](https://gohugo.io/content-management/image-processing/)で使えるResize、Fit、Fillが使えます
- デフォルトで`loading="lazy"`で画像を読み込みます。動作を変更したい場合は`loading="eager"`を明示的に指定してください

Image Processingについてはこちらをチェック

{{< blog-card "https://gohugo.io/content-management/image-processing/" >}}

<br>

```
{{</* custom-figure src="image.png" title="Resize スイカ" Resize="320x180" */>}}

{{</* custom-figure src="image.png" title="Fit スイカ" Fit="320x180" */>}}

{{</* custom-figure src="image.png" title="Fill スイカ" Fill="320x180" */>}}

{{</* custom-figure src="image.png" title="Crop スイカ" Crop="320x180" */>}}

{{</* custom-figure src="image.png" title="Crop スイカ" Crop="320x180" loading="eager" */>}}
```

## 表示例

元画像は512x512です

{{< custom-figure src="image.png" title="Resize 320x180 スイカ" Resize="320x180" >}}

<br>

{{< custom-figure src="image.png" title="Fit 320x180 スイカ" Fit="320x180" >}}

<br>

{{< custom-figure src="image.png" title="Fill 320x180 スイカ" Fill="320x180" >}}

<br>

{{< custom-figure src="image.png" title="Crop 320x180 スイカ" Crop="320x180" >}}

<br>

{{< custom-figure src="image.png" title="loading=\"eager\"の場合" Crop="320x180" loading="eager" >}}
