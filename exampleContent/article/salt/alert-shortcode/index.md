---
title: "GitHub風アラートショートコードの使い方"
description: "HugoのショートコードでGitHubと同じようなアラート（Note, Tip, Important, Warning, Caution）を表示する方法"
date: 2025-06-02T20:12:13+09:00
lastmod: 2025-06-02T20:12:13+09:00
tags: ["Hugo", "ショートコード", "カスタマイズ"]
categories: ["Saltの使い方"]
draft: false
---

SaltテーマではGitHubのMarkdownアラート記法と同じHTML構造でアラートを表示できるショートコードを提供しています。github-markdown-cssを使用すれば自動的にGitHubと同じスタイルが適用されます。

## 対応している5種類のアラート

GitHub準拠の5種類のアラートタイプに対応しています：

### Note（情報）

{{< alert type="note" >}}
補足的な情報
{{< /alert >}}

```
{{</* alert type="note" >}}
補足的な情報
{{< /alert */>}}
```

### Tip（ヒント）

{{< alert type="tip" >}}
便利な情報
{{< /alert >}}

```
{{</* alert type="tip" >}}
便利な情報
{{< /alert */>}}
```

### Important（重要）

{{< alert type="important" >}}
重要な情報
{{< /alert >}}

```
{{</* alert type="important" >}}
重要な情報
{{< /alert */>}}
```

### Warning（注意）

{{< alert type="warning" >}}
注意すべき情報
{{< /alert >}}

```
{{</* alert type="warning" >}}
注意すべき情報
{{< /alert */>}}
```

### Caution（緊急）

{{< alert type="caution" >}}
緊急な情報
{{< /alert >}}

```
{{</* alert type="caution" >}}
緊急な情報
{{< /alert */>}}
```

### typeパラメータについて
- `note`（デフォルト）：青色のアイコンで情報を表示
- `tip`：緑色の電球アイコンでヒントを表示  
- `important`：紫色のメガホンアイコンで重要情報を表示
- `warning`：オレンジ色の三角アイコンで警告を表示
- `caution`：赤色の八角形アイコンで注意を表示

### HTML出力構造
このショートコードは以下のHTML構造を生成し、GitHubと同じ`markdown-alert`クラスを使用します：

```html
<div class="markdown-alert markdown-alert-note" dir="auto">
  <p class="markdown-alert-title" dir="auto">
    <svg class="octicon octicon-note mr-2" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="..."></path>
    </svg>
    Note
  </p>
  <p dir="auto">アラート内容...</p>
</div>
```

### スタイリング
**github-markdown-css**により自動的にGitHubと同じ見た目でスタイリングされます

{{< blog-card "https://docs.github.com/ja/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts" >}}

### Markdown記法のサポート
アラート内では通常のMarkdown記法（リンク、太字、斜体など）が使用できます：

{{< alert type="note" >}}
**太字**や*斜体*、[リンク](https://example.com)なども使用可能です。
{{< /alert >}}

### 注意点
- `type`属性を省略した場合、自動的に`note`として表示されます。（存在しないタイプを指定した場合も）
- GitHub Markdownの`> [!NOTE]`記法とは異なり、ショートコード形式で記述します
