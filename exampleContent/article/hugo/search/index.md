---
title: "Hugoに検索機能を追加しよう"
description: ""
date: 2021-10-15T21:35:10+09:00
lastmod: 2021-10-15T21:35:10+09:00
draft: false
tags: ["tips", "検索", "lunr"]
categories: "Hugo"
archives: ["2021年10月"]
share: true
toc: true
comment: true
---

このサイトにも実装されているんですが、Hugoにlunaを使った検索機能を実装する方法を紹介します。

基本的には公式で紹介されているgistを参考に実装します。（コメント下の方にvanilla js版を作ってくれた方がいました！感謝！）
<iframe src="https://hatenablog-parts.com/embed?url=https://gohugo.io/tools/search/" title="Search for your Hugo Website | Hugo" class="embed-card embed-blogcard" scrolling="no" frameborder="0" style="display: block;width: 100%;height: 190px;max-width: 680px;margin: 10px 0px;"></iframe>

<iframe src="https://hatenablog-parts.com/embed?url=https://gist.github.com/sebz/efddfc8fdcb6b480f567" title="hugo + gruntjs + lunrjs = <3 search" class="embed-card embed-blogcard" scrolling="no" frameborder="0" style="display: block;width: 100%;height: 190px;max-width: 680px;margin: 10px 0px;"></iframe>

こちらのサイトも参考にさせて頂きました。  
<iframe src="https://hatenablog-parts.com/embed?url=https://blog.unigiri.net/article/hugo-lunr%E3%81%AB%E3%82%88%E3%82%8B%E6%97%A5%E6%9C%AC%E8%AA%9E%E5%85%A8%E6%96%87%E6%A4%9C%E7%B4%A2/" title="Hugo + Lunrによる日本語全文検索 | Unigiri" class="embed-card embed-blogcard" scrolling="no" frameborder="0" style="display: block;width: 100%;height: 190px;max-width: 680px;margin: 10px 0px;"></iframe>


## 1. lunrのセットアップ
`npm install lunr lunr-languages`を実行してパッケージをインストールし、config.ymlに下記を追加します

config.yml
```yml
module:
  mounts:
    - source: static
      target: static
    # 検索に必要
    - source: node_modules/lunr/lunr.min.js
      target: static/js/vendor/lunr/lunr.min.js
    - source: node_modules/lunr-languages/lunr.stemmer.support.js
      target: static/js/vendor/lunr-languages/lunr.stemmer.support.js
    - source: node_modules/lunr-languages/tinyseg.js
      target: static/js/vendor/lunr-languages/tinyseg.js
    - source: node_modules/lunr-languages/lunr.ja.js
      target: static/js/vendor/lunr-languages/lunr.ja.js
```

headでlunrを読み込みます

head.html
```go-template
{{ if eq .Section "search" }}
    <script type="text/javascript" src="{{ "js/vendor/lunr/lunr.min.js" | absURL }}"></script>
    <script type="text/javascript" src="{{ "js/vendor/lunr-languages/lunr.stemmer.support.js" | absURL }}"></script>
    <script type="text/javascript" src="{{ "js/vendor/lunr-languages/tinyseg.js" | absURL }}"></script>
    <script type="text/javascript" src="{{ "js/vendor/lunr-languages/lunr.ja.js" | absURL  }}"></script>
    <script type="text/javascript" src="{{ with  resources.Get "js/search.js" | minify }}{{ .RelPermalink }}{{ end }}"></script>
{{ end }}
```

searchのsectionを作成し、検索結果ページ（一覧ページ）を作ります

content/search/_index.md
```md
---
title: "検索"
draft: false
outputs:
    - html
    - json
---
```

検索に使用するインデックス用jsonを作成します

layouts/search/list.json
```go-template
{{- $.Scratch.Add "index" slice -}}
{{- range where .Site.RegularPages ".Section" "==" "article" -}}
    {{- $thumbnail := or
        (.Resources.GetMatch "thumbnail.*")
        (resources.Get .Params.thumbnail)
        (resources.Get .Site.Params.defaultNoimage)
    -}}
    {{- if $thumbnail -}}
        {{- $thumbnail = $thumbnail.Fill (printf "640x360 center q%d webp" .Site.Params.imageQuality) -}}
    {{- end -}}
    {{- $.Scratch.Add "index" (
        dict "title" .Title
            "description" .Description
            "thumbnail" $thumbnail.Permalink
            "summary" .Summary
            "date" (.Date.Format "2006-01-02")
            "lastmod" (.Lastmod.Format "2006-01-02")
            "tags" .Params.tags
            "categories" .Params.categories
            "href" .Permalink
    ) -}}
{{- end -}}
{{- $.Scratch.Get "index" | jsonify -}}
```

## 2. 検索処理の実装

検索処理本体を実装します。実際のソースは下記の通りです

assets/js/search.js

```js
//vanilla js version of https://gist.github.com/sebz/efddfc8fdcb6b480f567

var lunrIndex, $results, pagesIndex, tinySegmenter;

// Initialize lunrjs using our generated index file
function initLunr() {
    tinySegmenter = new lunr.TinySegmenter();

    return new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.open("GET", "index.json", true);

        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                pagesIndex = JSON.parse(request.responseText);
                console.log("index:", pagesIndex);

                // Set up lunrjs by declaring the fields we use
                // Also provide their boost level for the ranking
                lunrIndex = lunr(function () {
                    this.use(lunr.ja);
                    this.field("title", {
                        boost: 10,
                    });
                    this.field("categories");
                    this.field("tags");
                    this.field("description");

                    // ref is the result item identifier (I chose the page URL)
                    this.ref("href");
                    for (var i = 0; i < pagesIndex.length; ++i) {
                        this.add(pagesIndex[i]);
                    }
                    resolve();
                });
            } else {
                var err = textStatus + ", " + error;
                console.error("Error getting Hugo index flie:", err);
                reject(err);
            }
        };

        request.send();
    });
}

// Nothing crazy here, just hook up a event handler on the input field
function initUI() {
    $results = document.getElementById("results");
    $search = document.getElementById("search");
    $search.onkeyup = function () {
        while ($results.firstChild) {
            $results.removeChild($results.firstChild);
        }

        var query = $search.value;
        query = decodeURI(query);
        var results = search(query);
        renderResults(results);
    };
}

/**
 * Trigger a search in lunr and transform the result
 *
 * @param  {String} query
 * @return {Array}  results
 */
function search(query) {
    var segs = tinySegmenter.segment(query);
    segs = segs.map(function (seg) {
        seg = seg.trim();
        if (seg.length) {
            // 空でなければ、AND検索であいまい検索
            seg = `+*${seg}*`;
        }
        return seg;
    });
    query = segs.join(" ").replace(/\s+/g, " ").trim();

    // Find the item in our index corresponding to the lunr one to have more info
    // Lunr result:
    //  {ref: "/section/page1", score: 0.2725657778206127}
    // Our result:
    //  {title:"Page1", href:"/section/page1", ...}
    console.log("search:", query);
    return lunrIndex.search(query).map(function (result) {
        return pagesIndex.filter(function (page) {
            return page.href === result.ref;
        })[0];
    });
}

/**
 * Display the 10 first results
 *
 * @param  {Array} results to display
 */
function renderResults(results) {
    if (!results.length) {
        return;
    }

    // Only show the ten first results
    $results = document.getElementById("results");
    results.slice(0, 10).forEach(function (result) {
        var div = document.createElement("div");
        var category = "";
        if (result.categories) {
            category = `
                <a href="/categories/${result.categories}">
                    <i class="fas fa-folder"></i>&nbsp;${result.categories}
                </a>
            `;
        }
        var tag = "";
        if (result.tags) {
            var list = result.tags.map(function (val) {
                return `
                    <li class="partials__tagList__item">
                        <a href="/tags/${val}" class="partials__tagList__itemLink">
                            <i class="fas fa-tag partials__tagList__itemIcon"></i>${val}
                        </a>
                    </li>
                `;
            });
            tag = `
                <ul class="partials__tagList">
                    ${list.join("")}
                </ul>
            `;
        }
        div.innerHTML = `
            <article class="partials__articleCard">
                <div class="partials__articleCard__inner">
                    <a href="${result.href}" class="partials__articleCard__link"></a>
                    <img src='${result.thumbnail}' alt="${result.title}" loading="lazy" class="partials__articleCard__thumbnail">
                    <h4 class="partials__articleCard__title">
                        ${result.title}
                    </h4>
                    <div class="partials__articleCard__detail">
                        ${category}
                        <div class="partials__articleCard__detail__center"></div>
                        <div>
                            <i class="fas fa-clock"></i>&nbsp;${result.lastmod}
                        </div>
                    </div>
                    ${tag}
                    <div class="partials__articleCard__description">
                        ${result.summary}
                    </div>
                </div>
            </article>
        `;
        $results.appendChild(div);
    });
}

// Let's get started
initLunr().then(function () {
    var query = getQuery()["query"] || "";
    query = decodeURI(query);
    var results = search(query);
    renderResults(results);
    if (query.length) {
        document.getElementById("list-title").innerText = `「${query}」を検索`;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // initUI();
});

function getQuery() {
    var queryString = window.location.search;
    queryString = queryString.slice(1); // 文頭?を除外

    var queries = {};
    queryString.split("&").forEach(function (item) {
        const q = item.split("=");
        queries[q[0]] = q[1];
    });

    return queries;
}
```


### 検索ロジック

基本的にはHugo公式のgistを使っていますが、そのままでは思ったような検索結果を得られないので検索ロジックを修正します。

検索ロジックを修正するにはまず、下記を知る必要があります。
1. 記事のインデックスがどのように作成されているか
2. lunrの検索方法

#### 1. 記事のインデックスがどのように作成されているか
日本語では下記ライブラリを使って日本語を分かち書きし、記事のインデックスが作成されます。  
http://chasen.org/~taku/software/TinySegmenter/

このような記事タイトルの場合
```
サイト内ブログカードを作る自作ショートコード
```

こんな風にインデックスが作成される訳です
```
サイト | 内 | ブログカード | を | 作る | 自作 | ショートコード |
```

なのでHugo公式にあるgistの検索ロジックそのままでは、「サイト内ブログ」といったワードで検索しても引っ掛からないのです。

それを解決するために、一度検索キーワードも分かち書きをする必要があります
```js
tinySegmenter = new lunr.TinySegmenter();
〜
var segs = tinySegmenter.segment(query);
```

#### 2. lunrの検索方法
公式ドキュメントにありますが  
https://lunrjs.com/guides/searching.html

##### 簡単にまとめると
「foo」を持つインデックスを持つ記事を検索する場合
```
idx.search('foo')
```

「foo」または「bar」を持つインデックスを持つ記事を検索する場合
```
idx.search('foo bar')
```

「foo」を含むインデックスを持つ記事を検索する場合
```
idx.search('*foo*')
```

フィールドで絞りたい場合
```
idx.search('title:foo')
```

「foo」に対して関連スコアを上げたい（重みつけ10倍）場合
```
idx.search('foo^10 bar')
```

「foo」の編集距離が1（「fooo」や「fo」や「boo」）のインデックスを持つ記事を検索する場合
```
idx.search('foo~1')
```

AND検索の場合
```
idx.search("+foo +bar")
```

「bar」を含まない検索
```
idx.search("foo -bar")
```

##### 上記を踏まえて
- できるだけ検索ワードを記事に引っ掛ける
- スペースの場合はAND検索とする

とすると、検索ロジックが下記のようになります

```js
    var segs = tinySegmenter.segment(query);
    segs = segs.map(function (seg) {
        seg = seg.trim();
        if (seg.length) {
            // 空でなければ、AND検索であいまい検索
            seg = `+*${seg}*`;
        }
        return seg;
    });
    query = segs.join(" ").replace(/\s+/g, " ").trim();
```

## 3. 検索フォームを設置
あとは検索フォームを設置して、検索ページに飛ばすだけです

```go-template
<form action="{{ "search/" | relURL }}" class="partials__sidebar__search__form">
    <input type="text" name="query" id="search" class="partials__sidebar__search__query">
    <button type="submit" class="partials__sidebar__search__button">
        <i class="fas fa-search"></i>
    </button>
</form>
```

検索結果を表示するため、htmlタグに「id=results」を設定するのをお忘れなく！
