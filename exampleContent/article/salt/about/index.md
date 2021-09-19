---
title: "Hugoブログテーマ「Salt」とは？"
description: ""
date: 2021-09-12T15:07:11+09:00
lastmod: 2021-09-17T21:04:11+09:00
draft: false
tags: ["Hugo", "Hugoテーマ"]
categories: "Saltの使い方"
pickups: ["top", "sidebar"]
pickups_weight: -100
share: true
---

「Salt」は**シンプルなブログを低コストで作成できる**

を目標にしたHugo用テーマです。名前の通り、できるだけ素材そのものを引き出せるようなシンプルなデザイン・レイアウトにしました。

実際にSaltでできることについて紹介したいと思います

<br>

## 1. レスポンシブデザイン対応
PCとSP表示に対応しています。
デフォルトで横幅600pxをデフォルトにしていますが、任意のサイズに変更できます。

<br>

## 2. サイトカラーを自分の好きなように変更可能
ヘッダー・フッダー・コンテンツの背景色、記事カードの細かいスタイルも簡単に変更できます

<br>

## 3. 各SNSのブログカードを簡単表示
Hugo標準のショートコードを使用することで、TwitterやYouTubeといったブログカードを簡単に表示できます

{{< self-blog-card "article/sample/hugo-shortcode" >}}

#### もちろん自サイト内のブログカードにも対応しています

{{< self-blog-card "article/salt/self-blog-card" >}}

<br>

## 4. 記事内に使用する画像を簡単に最適化
Hugoのショートコードであるfigureを改造した「custom-figure」というショートコードを作成しました。このショートコードで画像のリサイズ・トリミングができます。

{{< self-blog-card "article/salt/custom-figure" >}}

<br>

## 5. 表示画像を最適化済みなのでサイト全体が高速に動作
記事一覧ページのサムネや、記事ページのサムネ表示時は必ずリサイズ＆webpに変換しているので、サイト全体が高速に表示されます。webpは次世代画像フォーマットで高い圧縮率を誇ります

PageSpeed Insightsではモバイル90前後は出せるかと思います  
https://developers.google.com/speed/pagespeed/insights/?hl=ja&url=https://hugo-theme-salt.okdyy75.com/

<br>

## 6. メニューを簡単にカスタマイズ可能
フッダー・ヘッダー・サイドのメニューを簡単＆自由にカスタマイズできます。  
fontawsomeが使用可能なので、サイドメニューのアイコンに最適なものを選べます  
もちろん記事内にもアイコンが使えます
<i class="fa-2x far fa-thumbs-up"></i>

※ただし無料アイコンのみです

使いたいアイコンがあるか探してみてください！  
https://fontawesome.com/v5.15/icons

<br>

## 7. フルカスタマイズ可能
Hugoの特徴ですが、themeフォルダ内のファイルを、ローカルにコピーすると上書きして使えます。

なのでフルカスタム可能です

<br>

## 8. 固定記事を簡単表示
トップとサイドバーに固定記事を簡単に設定＆表示できます。（ピックアップ部分）

<br>

## 9. 記事ページに関連記事を自動で表示
関連記事の表示はもちろん、関連させたい要素（タグやカテゴリー）を設定することも可能です
