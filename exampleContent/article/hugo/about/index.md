---
title: "Hugoでできること"
description: ""
date: 2021-09-12T17:43:50+09:00
lastmod: 2021-09-12T17:43:50+09:00
draft: false
tags: ["Hugo", "まとめ"]
categories: "Hugo"
pickups: ["top"]
pickups_weight: -90
share: true
---

最近はSSG（静的サイトジェネレータ）全盛期の時代で、サーバー代をかけずにブログが作れる時代になりました。
そこで実際にHugoを使ってこのブログを作ってみた所感とHugoでできることを紹介したいと思います

## ちなみにHugoとGatsbyどっちの方がいいの？
サイト内でリッチなグラフやテーブルを使ったり、動きのあるサイトを作りたい場合は、Gatsbyのほうが良いと思います。

というのもGatsbyの方がReactベースで作られているので、jsとの相性が非常に良く、Reactのライブラリをそのまま使えます。

逆にHugoとjsの親和性は低いので、素のHTMLに対してjsやjQueryで操作・加工する事になり、時代を逆行する事になります。（SPAを導入することもできますが、それなら最初からGatsby使う方が、、、）

さらにこれもHugoのデメリットなんですが、検索機能をつける際もゴリゴリなdom操作をする事になるので、検索機能がサイトの重要な要素を占める場合はGatsbyの方が実装しやすくリッチなものを作れると思います。

<br>

## あれ、、、Gatsbyで作った方がよいのでは？
ここまでの話だと完全にGatsbyの方が良さげなんですが、Hugoで圧倒的に作りやすいものがあります。

それは・・・**ブログです！**

ここからはHugoの推しポイントを語らせてください！

<br>

## Huogの前提知識について
Hugoは  
・content配下に設置するマークダウン形式の記事本体と
・layout配下に設置するhtml形式のテンプレートファイル
の組み合わせでページが生成されます。以下contentとlayoutとします

content例  
content/about.md

```md
---
title: "このサイトについて"
description: ""
date: 2021-08-31T22:30:41+09:00
lastmod: 2021-08-31T22:30:41+09:00
draft: false
share: true
---

このサイトはシンプルなHugoブログテーマ「Salt」の紹介サイトです

「Salt」は**シンプルなブログを低コストで作成できる**

を目標にしたHugo用テーマです。名前の通り、できるだけ素材そのものを引き出せるようなシンプルなデザイン・レイアウトにしました。
```

layout例  
layouts/_default/single.html
```go-template
{{ define "main" }}
    <section class="single">
        <h2>{{ .Title }}</h2>
        {{ .Content }}
    </section>
{{ end }}
```

詳しくは公式ドキュメントをチェック  
https://gohugo.io/content-management/organization/

<br>

# ここからHugoの推しポイントを紹介します！

## ポイント① タグ・カテゴリーのページを自動で作ってくれる
記事本体にタグやカテゴリーを設定していれば、下記のような一覧ページを自動で作ってくれます。
```
http://example.com/categories
http://example.com/categories/game
http://example.com/tags
http://example.com/tags/android
```

一覧ページのフォーマットが決まっていれば、layout一枚で対応することも可能ですし  
layouts/_default/taxonomy.html
```go-template
<ul>
    {{ range .Pages }}
        <li>
            <a href="{{ .Permalink }}">{{ .Title }}</a>
        </li>
    {{ end }}
</ul>
```

タグやカテゴリーごとに個別のlayoutを使って、一覧ページを作ることもできます。
```
layouts
└── taxonomy
    ├── category.html
    ├── category.terms.html
    ├── tag.html
    └── tag.terms.html
```

タグやカテゴリーに限らず、オススメやシリーズなど自作の分類を作ることもできるので、かなり効率的に特集ページを作ることができます。

詳しくはタクソノミーのページをチェック  
https://gohugo.io/content-management/taxonomies/

<br>

## ポイント② layoutの自由度が高い
一覧ページ、詳細ページのフォーマットが決まっていれば下記layoutの最小構成で済みます。

```
layouts
└── _default
   ├── baseof.html
   ├── list.html
   └── single.html
```

使用するlayout名で優先順が決まっており、柔軟に使い分けることもできます。  
https://gohugo.io/templates/lookup-order/

<br>

またlayout内からは他ページのタイトルやコンテンツなどあらゆるデータを取得することができるので、レコメンドや関連記事も作りやすいです。むしろ関連記事を作る機能が標準で用意されています

<br>

## ポイント③ 関連記事を自動で作ってくれる
HugoにはRelated Contentという機能があり、関連記事を自動で作ってくれます。
とくに設定等も要らず自動で作られます。もちろん関連させたい要素を細かく設定できます。すごい

https://gohugo.io/content-management/related/

<br>

## ポイント④ ファイルからデータの取得＆表示が簡単
HugoにData Templatesと言う機能があるんですが、data配下にyaml、toml、jsonいずれかのフォーマットでファイルを置いておくと、layout内で使用できます。

GatsbyにもGraphQLを使って取得する方法がありますがHugoの方が直感的で使いやすいかと思います。

https://gohugo.io/templates/data-templates/

<br>

## ポイント⑤ jsonページを出力できる
HugoにはCustom Output Formatsという機能がありhtml以外にもjsonやcsv、RSSといった形式で出力できます
簡易的なapiサーバーとしても使えますね！

https://gohugo.io/templates/output-formats/

<br>

## ポイント⑥ 画像を最適化して表示できる
HugoにはImage Processingという機能があり画像のリサイズ、トリミングなど柔軟に画像を最適化できます。
他にもjpgやpng、gifなどへのフォーマット・品質を指定しての変換も可能です。

2021年5月にはHugo v0.83でwebpへの変換も可能になりました。

PageSpeed Insightsでボトルネックになりがちな画像周りを最適化できますね！

https://gohugo.io/content-management/image-processing/

<br>

## 使えば使うほど強くなるHugo
まだまだおそらく紹介しきれていませんが

Hugoはコンテンツが充実するほどにコンテンツの見せ方や可能性が増えていきます

またコンテンツが増えてもlayoutを使いこなすことでシンプルな構成を保つことができます。

ぜひHugo触ってみてください！
