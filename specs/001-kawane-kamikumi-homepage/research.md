# Research: 東川根上組ホームページ 静的Webサイト

**Phase**: 0 | **Date**: 2026-03-27 | **Branch**: `001-kawane-kamikumi-homepage`

---

## Decision 1: 東海村公式RSSフィードの提供状況

**Decision**: 東海村公式サイトはRSSフィードを提供している。

**Feed URL**: `https://www.vill.tokai.ibaraki.jp/cgi-bin/feed.php?siteNew=1`

**Format**: RSS 1.0 (RDF)

**Content Coverage**: 村全体の新着情報（行政・予算・健康・イベント・インフラ等）を一つのフィードで提供。カテゴリ別サブフィードは存在しない。

**Rationale**: フィードURLが公式サイトに存在することを確認。コンテンツは川根地区住民が関心を持つ東海村全般の行政情報を網羅している。

**Alternatives considered**:
- X/Twitter (@tokai_vill) や Facebook: RSS非対応のため機械的取得不可
- カテゴリ別フィード: 提供されていない

---

## Decision 2: 静的サイトジェネレーター（SSG）の選択

**Decision**: **Eleventy (11ty) v3.x** を採用する。

**Rationale**:
- Node.js ベースであり、devcontainer に既に Node.js/npm が導入済み（追加インフラ不要）
- 単一言語（日本語のみ）サイトでは i18n プラグイン不要
- テンプレート言語（Nunjucks/Liquid）が Go テンプレート（Hugo）より非技術者にも理解しやすい
- Cloudflare Pages に公式サポートがある（ビルドコマンド・キャッシュ設定が自動化）
- `@11ty/eleventy-fetch` プラグインによりビルド時 RSS 取得が可能

**Alternatives considered**:
- **Hugo**: 日本語多言語サポートが優秀だが、単一言語サイトには過剰。Go テンプレートの学習コストが高い
- **Jekyll**: Ruby 依存でインストール手順が複雑。ビルドが遅い
- **Astro**: 高機能だがシンプルなコンテンツサイトには過剰

---

## Decision 3: 東海村RSSの表示方式

**Decision**: **ビルド時取得（`@11ty/eleventy-fetch` + Cloudflare Pages 定期デプロイ）** を採用する。

**Rationale**:
- ブラウザから直接フェッチすると CORS エラーが発生する（東海村サーバーが `Access-Control-Allow-Origin: *` を返さない）
- ビルド時取得はサーバー間通信のため CORS 問題なし
- ランタイムの外部依存がなく、RSS サーバーがダウンしてもサイトは表示される（ビルド時キャッシュが利用される）
- Cloudflare Pages の `.cache` ディレクトリは再デプロイ間で保持される
- 定期デプロイ（GitHub Actions の schedule cron + Cloudflare Pages デプロイフック）により毎日自動更新が可能

**Freshness tradeoff**: コンテンツの鮮度は最終デプロイ時点。リアルタイム更新は不要（自治会情報は日次更新で十分）。

**Alternatives considered**:
- **クライアントサイド JS + rss2json.com プロキシ**: 無料枠のレート制限・サービス停止リスクあり。ランタイム依存が発生
- **Cloudflare Workers + KV**: ほぼリアルタイムだが静的サイトの範囲を超える
- **AllOrigins CORS プロキシ**: XML を自力パースする必要があり複雑

---

## Decision 4: コンテンツ管理ディレクトリ構成

**Decision**: ソースコンテンツを `content/` に分離し、Eleventy が `wwwroot/` に出力する構成とする。

**Rationale**:
- devcontainer が `wwwroot/` を nginx のドキュメントルートとしてマウント済み（変更不要）
- Cloudflare Pages のビルド出力ディレクトリを `wwwroot` に設定することで一貫性を保てる
- `content/` ディレクトリは担当者がMarkdownを管理する専用領域として明確に分離される
- ビルド前の `wwwroot/` クリーンが必要（古いファイルを残さないため）

**Alternatives considered**:
- `src/` を Eleventy 入力として使う（テンプレートとコンテンツが混在し担当者が混乱する）
- `wwwroot/` に直接 Markdown を置く（出力と入力が混在してしまう）

---

## All NEEDS CLARIFICATION Resolved

| Item | Resolution |
|------|-----------|
| 東海村RSSの提供有無 | 提供確認済み。URL: `https://www.vill.tokai.ibaraki.jp/cgi-bin/feed.php?siteNew=1` |
| SSG選択 | Eleventy 3.x（Node.js、既存devcontainerに適合） |
| RSS表示方式 | ビルド時取得（eleventy-fetch + Cloudflare定期デプロイ） |
| ディレクトリ構成 | content/ (入力) → Eleventy → wwwroot/ (出力) |
