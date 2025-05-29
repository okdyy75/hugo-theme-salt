---
title: "Hugo v0.145.0 リリースノートまとめ"
description: ""
date: 2025-05-29T15:23:31+09:00
lastmod: 2025-05-29T15:23:31+09:00
draft: false
tags: ["Hugo", "Hugoリリースノートまとめ"]
categories: "Hugoリリース"
archives: ["2025年5月"]
share: true
toc: true
comment: true
---

<div class="markdown-alert markdown-alert-warning" dir="auto"><p class="markdown-alert-title" dir="auto"><svg class="octicon octicon-alert mr-2" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>Warning</p><p dir="auto">※この記事は生成AIを使用して作成された記事です。（create by GPT-4o）<br>記事内容については未検証ですので参考程度にご活用ください</p>
</div>

2025年2月26日にリリースされた Hugo v0.145.0 の主な更新内容をまとめます。既存ユーザー向けに **新機能**・**主な変更点**・**バグ修正**・**非推奨事項**を分類し、プロジェクトへの影響や対応方法のヒントを解説します。

## 新機能

- **`transform.PortableText` 関数の追加**  

  Sanity CMS との統合を容易にするため、<a href="https://gohugo.io/functions/transform/portabletext/" target="_blank">`transform.PortableText`</a> 関数が新たに導入されました。これにより、Sanity の Portable Text フォーマットを Hugo で直接処理できるようになります。

## 主な変更点

- **`_build` フロントマターキーの非推奨化**  
  フロントマターの `_build` キーが非推奨となり、新たに `build` キーが推奨されるようになりました。今後のバージョンアップに備え、既存の `_build` キーを `build` に置き換えることを検討してください。

- **Instagram ショートコードの HTTPS 化**  
  Instagram のショートコードで使用される JavaScript が HTTPS 経由で読み込まれるように変更され、セキュリティと互換性が向上しました。

- **デフォルトソートの改善**  
  デフォルトのソート順が、バックエンドのファイル名ではなくページパスに基づくように変更されました。これにより、より直感的な並び順が実現されます。

## バグ修正

- **関連コンテンツの問題修正**  
  コンテンツアダプターを使用した際に発生していた関連コンテンツの問題が修正されました。

- **`httpcache` 設定の nil ポインターエラー修正**  
  `httpcache` 設定において、nil ポインターが原因で発生していたエラーが修正されました。

- **`--printPathWarnings` オプションの修正**  
  `templates.Defer` を使用しているサイトで `--printPathWarnings` オプションが正しく機能しない問題が修正されました。

- **ドキュメントのリンク修正**  
  `README` の Editions セクションにおける相対リンクの誤りが修正されました。

## 非推奨事項

- **`_build` キーの非推奨化**  
  前述の通り、フロントマターの `_build` キーが非推奨となり、`build` キーの使用が推奨されます。既存のプロジェクトでは、早めの対応を検討してください。

## 影響と対応のヒント

- **Sanity CMS との統合**  
  Sanity CMS を使用している場合、新たに追加された `transform.PortableText` 関数を活用することで、Portable Text フォーマットのデータを Hugo で直接処理できるようになります。これにより、データの取り込みと表示がよりスムーズになります。

- **フロントマターの更新**  
  `_build` キーを使用している既存のコンテンツは、将来的な互換性のために `build` キーへの置き換えを検討してください。

- **ショートコードの確認**  
  Instagram のショートコードを使用している場合、HTTPS 化に伴う影響がないか確認してください。特に、外部リソースの読み込みに関する設定やポリシーに注意が必要です。

- **ソート順の確認**  
  デフォルトのソート順が変更されたことにより、ページの並び順に影響が出る可能性があります。必要に応じて、明示的なソート設定を追加してください。

---

**参考**: [Hugo v0.145.0 リリースノート（GitHub）](https://github.com/gohugoio/hugo/releases/tag/v0.145.0)
