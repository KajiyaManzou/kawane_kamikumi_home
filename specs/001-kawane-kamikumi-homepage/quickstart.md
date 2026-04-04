# Quickstart: 東川根上組ホームページ 開発ガイド

**Date**: 2026-03-27 | **Branch**: `001-kawane-kamikumi-homepage`

---

## ローカル開発環境（Docker + nginx devcontainer）

### 1. リポジトリを開く

VS Code で本リポジトリを開き、「Reopen in Container」を選択。
nginx コンテナが起動し、`http://localhost:8080` でサイトを確認できます。

### 2. 依存パッケージをインストール

```bash
npm install
```

`package.json` が存在しない場合（初回セットアップ）:

```bash
npm init -y
npm install --save-dev @11ty/eleventy @11ty/eleventy-fetch rss-parser
```

### 3. Eleventy をビルド（wwwroot/ に出力）

```bash
npx eleventy --output=wwwroot
```

またはウォッチモード（ファイル変更を自動検知して再ビルド）:

```bash
npx eleventy --output=wwwroot --watch
```

ブラウザで `http://localhost:8080` を開くと更新が確認できます。

---

## お知らせの追加方法

1. `content/notices/` ディレクトリに新しいMarkdownファイルを作成。

   **ファイル名形式**: `YYYY-MM-DD-タイトルの概要.md`

   例: `content/notices/2026-04-01-spring-festival.md`

2. ファイルの先頭に以下のfrontmatterを記入:

   ```markdown
   ---
   title: "春のふれあい地域まつりのお知らせ"
   date: 2026-04-01
   pdf: "/files/2026-04-matsuri.pdf"
   ---

   詳細はこちら...（Markdown本文）
   ```

3. PDFファイルがある場合は `wwwroot/files/` に配置する。

4. `npx eleventy --output=wwwroot` でビルドして確認。

5. GitHubにプッシュすると Cloudflare Pages が自動デプロイ。

---

## 回覧板の追加方法

お知らせと同様に `content/circulars/` ディレクトリに作成します。

---

## Googleフォームの設定

1. Google アカウントでフォームを作成
2. 「送信」→「<>（埋め込み）」からiframe URLを取得
3. `src/_data/config.js` の `googleFormUrl` を更新:

   ```js
   module.exports = {
     googleFormUrl: "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?embedded=true",
   };
   ```

---

## Cloudflare Pages デプロイ設定

| 設定項目 | 値 |
|---------|---|
| ビルドコマンド | `npm install && npx eleventy --output=wwwroot` |
| ビルド出力ディレクトリ | `wwwroot` |
| Node.js バージョン | 20.x |

### 自動デプロイ設定（東海村ニュースの定期更新）

GitHub Actions で毎日午前6時（JST）に自動ビルド・デプロイをトリガーする。

`.github/workflows/daily-deploy.yml` を作成:

```yaml
name: Daily Deploy
on:
  schedule:
    - cron: '0 21 * * *'  # UTC 21:00 = JST 06:00
  workflow_dispatch:
jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      CF_DEPLOY_HOOK_URL: ${{ secrets.CF_DEPLOY_HOOK_URL }}
    steps:
      - name: Validate Cloudflare Pages Deploy Hook
        run: |
          if [ -z "$CF_DEPLOY_HOOK_URL" ]; then
            echo "::error title=Missing CF_DEPLOY_HOOK_URL secret::Set the Cloudflare Pages deploy hook URL in GitHub Actions secrets before running this workflow."
            exit 1
          fi

      - name: Trigger Cloudflare Pages Deploy
        run: |
          curl --fail --silent --show-error -X POST "$CF_DEPLOY_HOOK_URL"
```

`CF_DEPLOY_HOOK_URL` は GitHub Secrets に Cloudflare Pages のデプロイフック URL を設定する。

---

## ディレクトリ構成

```
kawane_kamikumi_homepage/
├── content/                  # ← 担当者が編集するMarkdownコンテンツ
│   ├── notices/              #   お知らせ
│   │   └── YYYY-MM-DD-*.md
│   └── circulars/            #   回覧板
│       └── YYYY-MM-DD-*.md
├── src/                      # Eleventyテンプレート・設定
│   ├── _includes/            #   レイアウト（base.njk, notice.njk）
│   └── _data/                #   グローバルデータ
│       ├── config.js         #   Googleフォームの設定
│       └── tokai_news.js     #   東海村RSSフェッチ
├── wwwroot/                  # ← Eleventyビルド出力（nginx/Cloudflare Pagesが配信）
│   ├── index.html
│   ├── archives/
│   ├── circulars/
│   ├── assets/
│   │   ├── css/style.css
│   │   └── js/main.js
│   └── files/                #   PDFファイル置き場
├── .eleventy.js              # Eleventy設定ファイル
├── package.json
└── .devcontainer/
    └── devcontainer.json     # Docker + nginx 開発環境設定
```
