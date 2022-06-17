---
title: "HugoでFontAwesomeを使う方法"
description: ""
date: 2021-12-04T10:11:36+09:00
lastmod: 2021-12-04T10:11:36+09:00
draft: false
tags: ["tips", "アイコン", "ライブラリ", "FontAwesome"]
categories: "Hugo"
archives: ["2021年12月"]
share: true
toc: true
comment: true
---

HugoにFontAwesomeを使う場合はHugoの機能であるモジュールを使うと簡単に実現できます！

## 1. npmでFontAwesomeをインストール
package.jsonがない場合は`npm init`してください

```
npm install -D @fortawesome/fontawesome-free
```

## 2. config.ymlのmoduleに使いたいjsファイルをmounts
注意点としてmountすると、デフォルトであるtargetのルートディレクトリが無視されるので明示的に追加する必要があります

```yml
module:
  mounts:
    - source: static
      target: static
    - source: node_modules/@fortawesome/fontawesome-free/css/all.min.css
      target: static/css/vendor/@fortawesome/fontawesome-free/css/all.min.css
    - source: node_modules/@fortawesome/fontawesome-free/webfonts
      target: static/css/vendor/@fortawesome/fontawesome-free/webfonts
```


## 3. あとはheadで読み込ませるだけ

```go-template
<link rel="stylesheet" href="{{ "css/vendor/@fortawesome/fontawesome-free/css/all.min.css" | absURL }}">
```
 
 FontAwesome以外のライブラリでもいけるので、是非使ってみてください！
