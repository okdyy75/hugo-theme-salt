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

### 使い方
- Hugo標準のfigureショートコードの機能をそのまま使えます
- HugoのImage Processingで使えるResize、Fit、Fillが使えます

Image Processingについてはこちらをチェック  
https://gohugo.io/content-management/image-processing/


```
{{</* custom-figure src="image.png" title="Resize スイカ" Resize="320x180" */>}}

{{</* custom-figure src="image.png" title="Fit スイカ" Fit="320x180" */>}}

{{</* custom-figure src="image.png" title="Fill スイカ" Fill="320x180" */>}}

```

### 表示例

元画像は512x512です

{{< custom-figure src="image.png" title="Resize 320x180 スイカ" Resize="320x180" >}}

<br>

{{< custom-figure src="image.png" title="Fit 320x180 スイカ" Fit="320x180" >}}

<br>

{{< custom-figure src="image.png" title="Fill 320x180 スイカ" Fill="320x180" >}}
