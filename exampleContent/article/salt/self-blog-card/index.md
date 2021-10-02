---
title: "サイト内ブログカードを作る自作ショートコード"
description: ""
date: 2021-09-12T13:21:49+09:00
lastmod: 2021-09-12T13:21:49+09:00
draft: false
tags: ["Hugo", "ショートコード"]
categories: "Saltの使い方"
pickups: ["sidebar"]
pickups_weight: -80
share: true
archives: ["2021年9月"]
---

このテーマ内でサイト内ブログカードを作れる「self-blog-card」というショートコードを作成しました。

### 使い方
- 自サイト内のurlを指定します
- 自記事のブログカードは表示できません。
- 日本語だとconfig.ymlの`summaryLength: 200`以上推奨です

```

{{</* self-blog-card "/article/salt/custom-figure" */>}}

```

### 表示例

{{< self-blog-card "/article/salt/custom-figure" >}}
