const fs = require('fs')
const path = require('path')

/**
 * 記事データをコピーし、assetsディレクトリに保存するスクリプト
 * Usage: node scripts/copy-article-to-assets.js
 */

// ベースディレクトリの設定
const BASE_DIR = path.resolve(__dirname, '..')
const ASSETS_DIR = path.join(BASE_DIR, 'assets')
const CONTENT_DIR = path.join(BASE_DIR, 'content')

/**
 * JSONのURLを取得して指定ディレクトリにindex.jsonとして保存する
 */
async function saveIndexJson(inputJsonUrl, outputJsonDir) {
    const response = await fetch(inputJsonUrl)
    const jsonData = await response.json()
    const saveFilePath = path.join(outputJsonDir, 'index.json')
    fs.mkdirSync(outputJsonDir, { recursive: true })
    fs.writeFileSync(saveFilePath, JSON.stringify(jsonData, null, 4), 'utf-8')
    console.log(`index.jsonを保存しました: ${saveFilePath}`)
}

/**
 * 指定ディレクトリからthumbnail画像をコピーする
 */
function copyThumbnailImage(inputThumbnailDir, outputThumbnailDir) {
    if (!fs.existsSync(inputThumbnailDir)) {
        // ディレクトリが存在しない場合はコピーしない
        return
    }
    const files = fs.readdirSync(inputThumbnailDir)
    const thumbnailFiles = files.filter((file) => /^thumbnail\..+/.test(file))

    if (thumbnailFiles.length > 0) {
        const thumbnailFile = thumbnailFiles[0]
        const inputFilePath = path.join(inputThumbnailDir, thumbnailFile)
        const outputFilePath = path.join(outputThumbnailDir, thumbnailFile)
        fs.mkdirSync(outputThumbnailDir, { recursive: true })
        fs.copyFileSync(inputFilePath, outputFilePath)
        console.log(`サムネイル画像をコピーしました`)
        console.log(`from: ${inputFilePath}`)
        console.log(`  to: ${outputFilePath}`)
    }
}

/**
 * メイン処理
 */
async function main() {
    // サイトのindex.jsonからURL一覧を取得
    const siteIndexUrl = 'http://localhost:1313/index.json'
    const response = await fetch(siteIndexUrl)
    const urls = await response.json()

    for (const url of urls) {
        console.log('==========================================')
        console.log(`対象URL: ${url}`)

        // URLからパスを抽出
        const urlObj = new URL(url)
        const urlPath = urlObj.pathname

        // 1. index.jsonを取得＆保存
        const inputJsonUrl = `${url}index.json`
        const outputJsonDir = path.join(ASSETS_DIR, urlPath)
        await saveIndexJson(inputJsonUrl, outputJsonDir)

        // 2. thumbnail画像をコピー
        const inputThumbnailDir = path.join(CONTENT_DIR, urlPath)
        const outputThumbnailDir = path.join(ASSETS_DIR, urlPath)
        copyThumbnailImage(inputThumbnailDir, outputThumbnailDir)
        console.log('==========================================\n')
    }
}

;(async () => {
    console.log('処理を開始します...')
    await main()
    console.log('処理が完了しました！')
})()
