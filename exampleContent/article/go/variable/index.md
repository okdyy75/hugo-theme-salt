---
title: "Go言語Tips① 変数について"
description: ""
date: 2021-09-13T10:39:48+09:00
lastmod: 2021-09-13T10:39:48+09:00
draft: false
tags: ["go", "tips"]
categories: "Go言語"
share: true
toc: true
comment: true
archives: ["2021年9月"]
---

## 変数定義

Hugoのテンプレート内で`{{ $title := .Title }}`や`{{ $title = .Title }}`
のようにコロンをつけたり、付けなかったりする記述を見ます。

これはgo言語の書き方の特徴で、変数を定義する場合の省略記法です
```go
title := "タイトル"
```

省略しない場合はこうなります
```go
var title string = "タイトル"
```

## 変数のスコープ

go言語の変数スコープはif、for、switchなどのブロック内で有効です  
if内などで新しく変数を定義するとifブロック内での変数になるので注意です。
```go
    title := "タイトル"
    if true {
        fmt.Println(title)
        title := "タイトル2"
		fmt.Println(title)
    }
    fmt.Println(title)
```

```
タイトル
タイトル2
タイトル
```

## 変数の命名規則
go言語では変数名を短く、スコープも小さく、変数の寿命を短くすること推奨されます  
処理が長くなる場合は細かい単位でメソッドに切り出します。

ですが、変数名がどうしても長くなってしまう場合はスネークケースで書きます

```go
site_tile := "タイトル"
```

とgo言語の入門本で学びましたが、タイトルを忘れてしまいました。。
