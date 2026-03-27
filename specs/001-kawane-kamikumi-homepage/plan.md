# Implementation Plan: 東川根上組ホームページ 静的Webサイト

**Branch**: `001-kawane-kamikumi-homepage` | **Date**: 2026-03-27 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-kawane-kamikumi-homepage/spec.md`

## Summary

茨城県那珂郡東海村 川根地区の地域自治会向け公式情報ページ。Eleventy (11ty) を用いてMarkdownコンテンツをHTMLに変換し、Cloudflare Pages で静的配信する。担当者はHTMLの知識なしにMarkdownを編集するだけでコンテンツを更新できる。東海村公式RSSはビルド時に取得してお知らせ・回覧板・ニュース・Googleフォームの4機能を提供する。

## Technical Context

**Language/Version**: HTML5 / CSS3 / JavaScript ES6 / Markdown
**Primary Dependencies**: Eleventy 3.x (`@11ty/eleventy`)、`@11ty/eleventy-fetch`、`rss-parser`
**Storage**: Gitリポジトリ内のMarkdownファイル＋PDFファイル（`content/`・`wwwroot/files/`）
**Testing**: 手動ブラウザテスト（Chrome/Safari スマートフォン・PC）、リンクチェック
**Target Platform**: Cloudflare Pages（静的ホスティング、CDN配信）
**Project Type**: 静的Webサイト（Static Site Generator）
**Performance Goals**: 4G・光回線で主要コンテンツ3秒以内表示
**Constraints**: 静的ファイルのみ（サーバーサイド処理なし）、Cloudflare Pages 無料プラン
**Scale/Scope**: 小規模コミュニティ（数百住民）、低トラフィック

## Constitution Check

*Constitution が未設定のため、このプロジェクトの一般原則でゲートチェックを実施する。*

| ゲート | チェック | 結果 |
|--------|---------|------|
| 静的ファイルのみ（サーバーサイドなし） | Eleventy はビルド時処理のみ | PASS |
| 最小依存関係（YAGNI） | 必要最小限の npm パッケージのみ | PASS |
| 非技術者が更新可能 | Markdown + frontmatter のみで更新 | PASS |
| Cloudflare Pages 対応 | ビルド出力が静的ファイルのみ | PASS |

**Gate**: PASS（違反なし）— Phase 1 設計へ進む。

## Project Structure

### Documentation (this feature)

```text
specs/001-kawane-kamikumi-homepage/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── pages.md         # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
kawane_kamikumi_homepage/
├── content/                  # 担当者が編集するMarkdownコンテンツ
│   ├── notices/              #   お知らせ（YYYY-MM-DD-slug.md）
│   └── circulars/            #   回覧板（YYYY-MM-DD-slug.md）
│
├── src/                      # Eleventyテンプレート・設定
│   ├── _includes/
│   │   ├── base.njk          #   ベースレイアウト（ヘッダー・フッター）
│   │   └── notice.njk        #   お知らせカードコンポーネント
│   └── _data/
│       ├── config.js         #   Googleフォーム設定
│       └── tokai_news.js     #   東海村RSSビルド時フェッチ
│
├── wwwroot/                  # Eleventyビルド出力（nginx/Cloudflare Pagesが配信）
│   ├── index.html            #   トップページ
│   ├── archives/index.html   #   お知らせアーカイブ
│   ├── circulars/index.html  #   回覧板一覧
│   ├── assets/
│   │   ├── css/style.css
│   │   └── js/main.js
│   └── files/                #   PDFファイル（静的配信、gitで管理）
│
├── .eleventy.js              # Eleventy設定（入力:src+content、出力:wwwroot）
├── package.json
├── .devcontainer/
│   └── devcontainer.json     # nginx:latest + Node.js 開発環境
└── .github/
    └── workflows/
        └── daily-deploy.yml  # 毎日自動デプロイ（東海村ニュース更新）
```

**Structure Decision**: コンテンツ（`content/`）とテンプレート（`src/`）とビルド出力（`wwwroot/`）を分離。担当者は `content/` のみ操作する。nginx devcontainer は `wwwroot/` をそのままサーブするため追加設定不要。

## Complexity Tracking

*Constitution 違反なし。記載不要。*
