---
title: "HugoでCIからビルド際にたまにエラーになる原因"
description: ""
date: 2022-01-29T20:11:23+09:00
lastmod: 2022-01-29T20:11:23+09:00
draft: false
tags: ["tips", "CI", "デプロイ"]
categories: "Hugo"
archives: ["2022年1月"]
share: true
toc: true
comment: true
---

たまにHugoでCIからデプロイしようとする際エラーになっていたんですが原因が分かりました。

package.json
```json
  "scripts": {
    "create-ranking": "node scripts/create-ranking.js",
    "build": "hugo --gc --minify",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

`npm run build`してみるとこんな感じのエラーが出て、たまにデプロイがうまくいきませんでした

```bash
Start building sites … 
hugo v0.89.4-AB01BA6E darwin/amd64 BuildDate=2021-11-17T08:24:09Z VendorInfo=gohugoio
ERROR 2022/01/29 20:21:30 render of "page" failed: execute of template failed: template: partials/sidebar.html:101:72: executing "sidebar" at <(index $thumbnail 0).Fill>: error calling Fill: image "/Users/okdyy75/hugo-theme-salt/content/article/hugo/fontawsome/thumbnail.png": this feature is not available in your current Hugo version, see https://goo.gl/YMrWcn for more information
ERROR 2022/01/29 20:21:30 render of "page" failed: execute of template failed: template: partials/sidebar.html:101:72: executing "sidebar" at <(index $thumbnail 0).Fill>: error calling Fill: image "/Users/okdyy75/hugo-theme-salt/content/article/hugo/fontawsome/thumbnail.png": this feature is not available in your current Hugo version, see https://goo.gl/YMrWcn for more information
ERROR 2022/01/29 20:21:30 render of "page" failed: execute of template failed: template: partials/sidebar.html:101:72: executing "sidebar" at <(index $thumbnail 0).Fill>: error calling Fill: image "/Users/okdyy75/hugo-theme-salt/content/article/hugo/fontawsome/thumbnail.png": this feature is not available in your current Hugo version, see https://goo.gl/YMrWcn for more information
ERROR 2022/01/29 20:21:30 render of "page" failed: execute of template failed: template: partials/sidebar.html:101:72: executing "sidebar" at <(index $thumbnail 0).Fill>: error calling Fill: image "/Users/okdyy75/hugo-theme-salt/content/article/hugo/fontawsome/thumbnail.png": this feature is not available in your current Hugo version, see https://goo.gl/YMrWcn for more information
Error: Error building site: failed to render pages: render of "page" failed: execute of template failed: template: partials/sidebar.html:101:72: executing "sidebar" at <(index $thumbnail 0).Fill>: error calling Fill: image "/Users/okdyy75/hugo-theme-salt/content/article/hugo/fontawsome/thumbnail.png": this feature is not available in your current Hugo version, see https://goo.gl/YMrWcn for more information
Total in 235 ms

```

ローカルのhugoとhugo-binのバージョンを確認してみると
```
hugo version
> hugo v0.92.1+extended darwin/amd64 BuildDate=unknown

./node_modules/.bin/hugo version
> hugo v0.89.4-AB01BA6E darwin/amd64 BuildDate=2021-11-17T08:24:09Z VendorInfo=gohugoio

```

よく見るとhomebrewからインストールしたhugoは`+extended`になっています。なのでhugo-binの方もextend版を使用します。package.jsonに下記を追加すればOK

package.json

```json
"hugo-bin": {
    "buildTags": "extended"
  }
```

参考URL  
https://github.com/fenneclab/hugo-bin#installation-options
