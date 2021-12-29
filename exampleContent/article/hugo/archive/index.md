---
title: "Hugoでアーカイブを作る方法"
description: ""
date: 2021-12-28T10:32:02+09:00
lastmod: 2021-12-28T10:32:02+09:00
draft: false
tags: ["アーカイブ", "tips"]
categories: "Hugo"
archives: ["2021年12月"]
share: true
toc: true
comment: true
---

Hugoでアーカイブを作るには2種類ほど方法があります

## ①タグやカテゴリと同様にタクソノミーを設定する

config.ymlに`archive`を追加し

```yml
taxonomies:
  archive: archives
```

記事のフロントマターに年月を設定してあげれば
```yml
archives: ["2021年12月"]
```

こんな感じのデータが作成されます。この時「yyyy年mm月」の形式でないと年月でソートされないので注意です

```go-template
    {{ .Site.Taxonomies.archives.Alphabetical.Reverse }}

    [
        {2021年12月 [WeightedPage(0,"Hugoでアーカイブを作る方法") WeightedPage(0,"HugoでFontawsomeを使う方法")]}
        {2021年10月 [WeightedPage(0,"Hugoに検索機能を追加しよう")]}
        {2021年9月 [WeightedPage(0,"Hugoを使い始めた人に捧げるTips11選") WeightedPage(0,"Go言語Tips② Hugoで使われるlayoutの正体")]}
    ]
```

新しく作る記事はarchetypesを更新してあげれば問題ないのですが、すでにある記事にarchiveを追加してあげるのは結構大変ですよね

そこでバッチを作りました！

`sh content_replace.sh --param=archives`でarchiveを追加できます。

**※実行前に必ずcommitしてください。**

正直nodeで作ればよかった。。（作るの結構大変だった）

content_replace.sh

```bash
#!/bin/bash

# ヘルプ表示
function help() {
cat <<EOT
Usage:
    $0 [--param=(archives)]
Description:
    Replace  content parameters
Options:
    --param  target parameter
EOT
}

PARAM_VAL=''
REPLACE_DIR='./content/article'
ARCHIVES_FORMAT="+[\"%Y年%-m月\"]"
ARCHIVES_FROM='date'

# オプション引数受け取り
while getopts :-: opt; do

    # OPTARG を = の位置で分割して opt と optarg に代入
    optarg="$OPTARG"
    [[ "$opt" = - ]] &&
        opt="-${OPTARG%%=*}" &&
        optarg="${OPTARG/${OPTARG%%=*}/}" &&
        optarg="${optarg#=}"

    case "-$opt" in
        --param)
            PARAM_VAL="$optarg"
            ;;
        -h|--help)
            help
            exit 0
            ;;
    esac
done


if [ "$PARAM_VAL" = "archives" ]; then
    read -p "実行前にcontentをcommitしてください。進めてよろしいですか？  (y/n) :" YN
    if [ "${YN}" != "y" ]; then
        exit 1;
    fi

    files=`find "$REPLACE_DIR" -type f -name "*.md"`
    for file in $files; do
        echo $file
        front_matter=`awk 'BEGIN { RS="---\n"; FS="\n" } NR == 2 { print $0 }' ${file}`
        dt=`echo "${front_matter}" | awk -v from="${ARCHIVES_FROM}:" 'BEGIN { FS=" " } $1 == from { print $2 }'`
        archives=`date -j -f "%Y-%m-%dT%H:%M:%S+09:00" "${dt}" "${ARCHIVES_FORMAT}"`
        content=$(
            awk -v param="${PARAM_VAL}: " -v archives="${archives}" '
                BEGIN { RS="---\n"; FS="\n"; ORS=""; OFS=""; }
                {
                    if (NR == 1) {
                    } else if (NR == 2) {
                        print "---", "\n"
                        has_archive=0
                        for (i=1; i<NF; i++) {
                            if (match($i, param) >= 1) {
                                has_archive=1
                                print param, archives, "\n"
                            } else {
                                print $i, "\n"
                            }
                        }
                        if (has_archive == 0) {
                            print param, archives, "\n"
                        }
                    } else {
                        print "---", "\n"
                        print $0, "\n"
                    }
                }
            ' ${file}
        )
        echo "$content" > $file
    done
else
    echo "See --help option."
fi
```


## ②サイト内の全記事からアーカイブを作成

特定のページに一覧で表示する際に便利です

こちらは関数を作っちゃいました！

layouts/partials/functions/archives.html

```go-template
{{ $articles := .articles }}
{{ $from := .from }}
{{ $latest := index (first 1 $articles) 0 }}
{{ $oldest := index (last 1 $articles) 0 }}
{{ $archives := slice }}
{{ range $year := seq ((index $latest.Params $from).Format "2006") ((index $oldest.Params $from).Format "2006") }}
    {{ $year_list := slice }}
    {{ range $month := seq 12 1 }}
        {{ $month_list := slice }}
        {{ range $article := $articles }}
            {{ if eq ((index $article.Params $from).Format "200601") (printf "%04d%02d" $year $month) }}
                {{ $month_list = $month_list | append $article }}
            {{ end }}
        {{ end }}
        {{ if $month_list }}
            {{ $year_list = $year_list | append (dict (string $month) $month_list)  }}
        {{ end }}
    {{ end }}
    {{ if $year_list }}
        {{ $archives = $archives | append (dict (string $year) $year_list) }}
    {{ end }}
{{ end }}
{{ return $archives }}

```

使い方は
- articlesにはアーカイブを作成したい記事データ
- fromにはアーカイブを作成する際の元にする日付

```go-template
{{ $articles := where .Site.RegularPages.ByDate.Reverse ".Section" "==" "article"}}
{{ $archives := partial "functions/archives" (dict "articles" $articles "from" "Date") }}
```

こんな感じで、年ー月のマップが作成されます

```go-template
{{ $archives }}

[
    map[
        2021:[
            map[12:Pages(2)]
            map[10:Pages(1)]
            map[9:Pages(12)]
        ]
    ]
]
```

タクソノミーのarchiveと組み合わせることも可能です

```go-template
{{ range $archives }}
    {{ range $year, $year_list := . }}
        {{ range $year_list }}
            {{ range $month, $month_list := . }}
                <a href="{{ "archives" | relURL }}/{{ printf "%s年%s月" $year $month }}">
                    {{ printf "%s年%s月" $year $month }}（{{ len $month_list }}）
                </a>
            {{ end }}
        {{ end }}
    {{ end }}
{{ end }}
```