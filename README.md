# Hugo Theme Salt
シンプルなHugo用ブログテーマ「Salt」です

詳しい使い方はこちら  
https://zenn.dev/okdyy75/books/fe9188ccfd6ae3


### Develop Usage

```
hugo server -c exampleContent --config config.org.yml
hugo new article/sample/hoge/index.md -c exampleContent --config config.org.yml
```

#### Development Workflow

1. `feature` → `develop` → `main` の順でマージ
2. `main`マージ後にv1.2.3形式でタグ付けしてリリースノートを公開
3. 公開後は`vX`ブランチを`main`ブランチでpullして最新状態に更新
