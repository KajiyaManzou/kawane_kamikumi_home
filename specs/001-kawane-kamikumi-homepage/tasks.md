# Tasks: 東川根上組ホームページ 静的Webサイト

**Input**: Design documents from `/specs/001-kawane-kamikumi-homepage/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/pages.md ✓, quickstart.md ✓

**Tests**: 仕様書にテスト要求なし — 手動ブラウザ確認方式を採用

**Organization**: ユーザーストーリー (US1/US2/US3) 別にフェーズを編成

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 並列実行可能（異なるファイル・依存なし）
- **[Story]**: 対応するユーザーストーリー（US1/US2/US3）

---

## Phase 1: Setup（プロジェクト初期化）

**Purpose**: Eleventy プロジェクトの構成とディレクトリ構造の確立

- [x] T001 Markdownコンテンツディレクトリを作成する `content/notices/` `content/circulars/`
- [x] T002 Eleventy テンプレートディレクトリを作成する `src/_includes/` `src/_data/`
- [x] T003 `package.json` を作成し Eleventy 依存パッケージを定義する（`@11ty/eleventy` `@11ty/eleventy-fetch` `rss-parser`）
- [x] T004 [P] `npm install` で依存パッケージをインストールする
- [x] T005 [P] `wwwroot/assets/css/` `wwwroot/assets/js/` `wwwroot/files/` ディレクトリを作成する

---

## Phase 2: Foundational（全ストーリー共通の基盤）

**Purpose**: 全ユーザーストーリー実装の前提となる共通基盤。この Phase 完了前にストーリー実装を始めないこと

**⚠️ CRITICAL**: この Phase が完了するまで US1〜US3 の実装は開始できない

- [x] T006 `.eleventy.js` を作成し、入力ディレクトリ（`src/` `content/`）・出力ディレクトリ（`wwwroot/`）・passthrough コピー設定（`wwwroot/files/**` `wwwroot/assets/**`）を定義する
- [x] T007 [P] ベースレイアウト `src/_includes/base.njk` を作成する（`<html lang="ja">`・ヘッダー「東川根上組 公式情報ページ」・フッター・CSS読み込み）
- [x] T008 [P] `src/_data/config.js` を作成し Googleフォーム URL プレースホルダーを定義する
- [x] T009 スタイルシート `wwwroot/assets/css/style.css` を作成する（モバイルファースト・本文16px以上・コントラスト比4.5:1以上・レスポンシブ 768px/1024px ブレークポイント・横スクロールなし）
- [x] T010 `npx eleventy --output=wwwroot` でビルドが成功することを確認し、`wwwroot/index.html` が生成されることを確認する

**Checkpoint**: Eleventy ビルド成功 → localhost:8080 でベースレイアウトが表示される

---

## Phase 3: User Story 1 — お知らせ・回覧板の閲覧 (Priority: P1) 🎯 MVP

**Goal**: 住民がトップページで最新5件のお知らせと最新1件の回覧板をPDFリンク付きで確認できる

**Independent Test**: `npx eleventy --output=wwwroot` 後に `http://localhost:8080` を開き、お知らせ一覧5件・回覧板1件・PDFリンクが表示されることを確認。アーカイブページ `/archives/`・回覧板一覧 `/circulars/` が表示されることを確認。

### Implementation for User Story 1

- [x] T011 [P] [US1] お知らせカードコンポーネント `src/_includes/notice-card.njk` を作成する（日付・タイトル・PDFリンク表示）
- [x] T012 [P] [US1] 回覧板カードコンポーネント `src/_includes/circular-card.njk` を作成する（日付・タイトル・PDFリンク表示）
- [x] T013 [US1] トップページテンプレート `src/index.njk` を作成する（お知らせ最新5件セクション・回覧板最新1件セクション・「過去のお知らせ →」「過去の回覧板 →」リンク）
- [x] T014 [US1] お知らせアーカイブページ `src/archives/index.njk` を作成する（全お知らせを日付降順で一覧表示）
- [x] T015 [US1] 回覧板一覧ページ `src/circulars/index.njk` を作成する（全回覧板を日付降順で一覧表示）
- [x] T016 [P] [US1] サンプルお知らせ Markdown ファイルを作成する `content/notices/2026-03-27-spring-festival.md`（frontmatter: title/date/pdf）
- [x] T017 [P] [US1] サンプル回覧板 Markdown ファイルを作成する `content/circulars/2026-03-01-march-circular.md`（frontmatter: title/date/pdf）
- [x] T018 [US1] Eleventy コレクション設定を `.eleventy.js` に追加する（notices コレクション・circulars コレクション、日付降順ソート）
- [x] T019 [US1] 既存の手書き `wwwroot/index.html` を削除または移動し、Eleventy 生成版に置き換えることを確認する

**Checkpoint**: US1 完了 — `http://localhost:8080` でお知らせ5件・回覧板1件・アーカイブリンクが正常表示される

---

## Phase 4: User Story 2 — ご意見・ご要望フォーム (Priority: P2)

**Goal**: 住民がサイト上の Googleフォームからご意見を送信できる。フォーム付近に個人情報取り扱い説明文が表示される

**Independent Test**: `http://localhost:8080` のご意見セクションに Googleフォーム（またはプレースホルダー）と個人情報説明文が表示されることを確認。フォーム読み込み失敗時に代替連絡先が表示されることを確認。

### Implementation for User Story 2

- [ ] T020 [US2] `src/index.njk` にご意見・ご要望セクションを追加する（Googleフォーム iframe 埋め込み・`config.googleFormUrl` を参照）
- [ ] T021 [US2] `src/index.njk` のフォーム上部に個人情報取り扱い説明文（1〜2文）を追加する（「送信内容は東川根上組の活動改善にのみ使用します」等）
- [ ] T022 [US2] フォームが読み込めない場合の代替連絡先テキストを `src/index.njk` に追加する（`<noscript>` タグまたは説明文として）
- [ ] T023 [US2] `src/_data/config.js` の `googleFormUrl` にサンプル URL またはプレースホルダーを設定し、フォームセクションの表示を確認する

**Checkpoint**: US2 完了 — フォームセクションと個人情報説明文が正常表示される

---

## Phase 5: User Story 3 — 地域ニュース（東海村情報）(Priority: P3)

**Goal**: 住民がトップページで東海村公式サイトの最新5件のお知らせを確認し、元記事を別タブで開ける

**Independent Test**: `http://localhost:8080` の東海村ニュースセクションに記事タイトルと外部リンクが最大5件表示されることを確認。RSS取得失敗時に「現在情報を取得できません」メッセージが表示されることを確認。

### Implementation for User Story 3

- [ ] T024 [US3] `src/_data/tokai_news.js` を作成する（`@11ty/eleventy-fetch` で `https://www.vill.tokai.ibaraki.jp/cgi-bin/feed.php?siteNew=1` をビルド時取得・`rss-parser` で XML をパース・最新5件を返す・取得失敗時は空配列を返す）
- [ ] T025 [US3] `src/index.njk` に東海村ニュースセクションを追加する（記事タイトル・日付・外部リンク `target="_blank" rel="noopener"` で表示・最大5件）
- [ ] T026 [US3] `src/index.njk` の東海村ニュースセクションに、データが空の場合「現在情報を取得できません」メッセージを表示する条件分岐を追加する
- [ ] T027 [US3] ローカルでビルドし、東海村 RSS フェッチが正常に動作することを確認する（`npx eleventy --output=wwwroot` 実行後にニュース5件が表示されること）

**Checkpoint**: US3 完了 — 東海村ニュース5件または取得失敗メッセージが表示される

---

## Phase 6: Polish & Cloudflare Pages デプロイ設定

**Purpose**: 全ストーリー横断の品質確認とデプロイ自動化

- [ ] T028 [P] `.github/workflows/daily-deploy.yml` を作成する（UTC 21:00 = JST 6:00 の cron スケジュール・Cloudflare Pages デプロイフック URL を呼び出し）
- [ ] T029 [P] Cloudflare Pages ビルド設定を確認・記録する（ビルドコマンド: `npm install && npx eleventy --output=wwwroot`・出力ディレクトリ: `wwwroot`・Node.js バージョン: 20.x）
- [ ] T030 スマートフォン表示を確認する（Chrome DevTools モバイルエミュレーション・横スクロールなし・タップターゲット 44×44px 以上）
- [ ] T031 アクセシビリティを確認する（本文フォントサイズ 16px 以上・コントラスト比 4.5:1 以上・`<html lang="ja">` 設定・画像 alt テキスト）
- [ ] T032 全ページのリンクが正常に機能することを確認する（PDFリンク・アーカイブリンク・外部リンク）
- [ ] T033 GitHubにプッシュして Cloudflare Pages の自動デプロイが動作することを確認する

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: 依存なし — 即時開始可能
- **Phase 2 (Foundational)**: Phase 1 完了後 — **全ストーリーをブロック**
- **Phase 3 (US1)**: Phase 2 完了後 — MVP 最優先
- **Phase 4 (US2)**: Phase 2 完了後（US1 と並列可能）
- **Phase 5 (US3)**: Phase 2 完了後（US1/US2 と並列可能）
- **Phase 6 (Polish)**: US1〜US3 すべて完了後

### User Story Dependencies

- **US1 (P1)**: Phase 2 完了後に開始可能 — 他ストーリーへの依存なし
- **US2 (P2)**: Phase 2 完了後に開始可能 — US1 への依存なし（独立して実装・テスト可能）
- **US3 (P3)**: Phase 2 完了後に開始可能 — US1/US2 への依存なし

### Within Each User Story

- コンポーネント（Nunjucks）→ テンプレート（index.njk 等）→ コレクション設定（.eleventy.js）の順
- データファイル（_data/）はテンプレートの前に作成

### Parallel Opportunities

- T011 と T012（カードコンポーネント2種）は同時作成可能
- T016 と T017（サンプル Markdown ファイル）は同時作成可能
- T024（RSS データ）と T020（フォームセクション）は別ファイルのため並列可能
- T028 と T029（デプロイ設定）は並列可能

---

## Parallel Example: User Story 1

```bash
# カードコンポーネント2種を同時作成:
Task: "T011 お知らせカードコンポーネント src/_includes/notice-card.njk を作成"
Task: "T012 回覧板カードコンポーネント src/_includes/circular-card.njk を作成"

# サンプルコンテンツ2種を同時作成:
Task: "T016 サンプルお知らせ content/notices/2026-03-27-spring-festival.md"
Task: "T017 サンプル回覧板 content/circulars/2026-03-01-march-circular.md"
```

---

## Implementation Strategy

### MVP First（User Story 1 のみ）

1. Phase 1 完了: プロジェクト初期化
2. Phase 2 完了: Eleventy 基盤確立（**ブロッカー**）
3. Phase 3 完了: お知らせ・回覧板の閲覧機能
4. **STOP & VALIDATE**: `http://localhost:8080` で US1 を独立確認
5. GitHub プッシュ → Cloudflare Pages でデプロイ

### Incremental Delivery

1. Phase 1 + 2 → 基盤完成
2. US1 完了 → テスト → デプロイ（MVP）
3. US2 完了 → テスト → デプロイ（フォーム追加）
4. US3 完了 → テスト → デプロイ（ニュース追加）
5. Phase 6 → 最終品質確認

---

## Notes

- `[P]` タスク = 異なるファイル、相互依存なし → 並列実行可能
- `[US1/US2/US3]` ラベル = トレーサビリティのため全実装タスクに付与
- 各 Checkpoint でブラウザ確認を実施してから次フェーズへ進む
- Googleフォーム URL は自治会担当者から提供後に `src/_data/config.js` を更新
- 東海村 RSS は `https://www.vill.tokai.ibaraki.jp/cgi-bin/feed.php?siteNew=1`
