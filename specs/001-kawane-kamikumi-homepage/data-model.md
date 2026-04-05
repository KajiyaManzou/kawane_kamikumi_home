# Data Model: 東川根上組ホームページ

**Phase**: 1 | **Date**: 2026-03-27 | **Branch**: `001-kawane-kamikumi-homepage`

---

## コンテンツエンティティ

### お知らせ (Notice)

Markdownファイル（`content/notices/YYYY-MM-DD-slug.md`）で管理。

**Frontmatter スキーマ**:

```yaml
---
title: "春のふれあい地域まつりのお知らせ"   # 必須: 表示タイトル
date: 2026-03-27                              # 必須: 投稿日（YYYY-MM-DD）
draft: false                                  # 任意: true の場合非公開（デフォルト: false）
pdf: "/files/2026-03-matsuri.pdf"            # 任意: PDFファイルへのパス
---
```

**本文**: Markdown 形式で記述。お知らせの詳細・概要等。

**表示ルール**:
- トップページ: 日付降順で最新3件のみ表示
- アーカイブページ（`/archives/`）: 全件を日付降順で一覧表示
- `draft: true` のものは公開されない

---

### 回覧板 (Circular)

Markdownファイル（`content/circulars/YYYY-MM-DD-slug.md`）で管理。

**Frontmatter スキーマ**:

```yaml
---
title: "4月の回覧板"                          # 必須: 表示タイトル
date: 2026-04-01                              # 必須: 配布日（YYYY-MM-DD）
draft: false                                  # 任意: 非公開フラグ
pdf: "/files/2026-04-circular.pdf"           # 任意: PDFファイルへのパス
---
```

**本文**: Markdown 形式。回覧内容の要約または全文。

**表示ルール**: トップページに最新3件を一覧表示。過去分は一覧ページ（`/circulars/`）に表示。

---

### 東海村ニュース (TokaNews)

ビルド時に東海村公式RSSから取得。Markdown ファイルではなく、`src/_data/tokai_news.js` が生成するJavaScriptオブジェクト。

**データ構造**（Eleventyデータモデル）:

```js
// src/_data/tokai_news.js が返すオブジェクト
{
  items: [
    {
      title: "令和8年度当初予算について", // 記事タイトル
      link: "https://www.vill.tokai...", // 元記事URL
      pubDate: "2026-03-25",             // 公開日
      dateJa: "3月25日",                 // 表示用の記事日付
      description: "...",                // 概要（任意）
    },
    // ... 最大5件
  ],
  processedDateJa: "4/5",               // 更新日表示用（日本時間のビルド日）
}
```

**取得元**: `https://www.vill.tokai.ibaraki.jp/cgi-bin/feed.php?siteNew=1`

**表示ルール**: トップページに最新5件表示。タイトルは元サイトへの外部リンク（別タブ）。更新日表示にはRSS記事日付ではなく、日本時間（JST, Asia/Tokyo）のビルド日を用いる。

---

### Googleフォーム (ContactForm)

Markdownファイルやデータファイルは不要。HTMLテンプレート内にGoogleフォームの埋め込みiframeを直接記述する。

**設定値**（`.eleventy.js` または `src/_data/config.js` で管理）:

```js
// src/_data/config.js
module.exports = {
  googleFormUrl: "https://docs.google.com/forms/d/e/xxxxx/viewform?embedded=true",
  // 自治会担当者がGoogleフォームを作成後に差し替える
};
```

**個人情報説明文**: フォーム上部に固定テキストとしてテンプレートに埋め込む。

---

## ファイル・ディレクトリの対応

| エンティティ | 入力パス | 出力URL |
|-------------|---------|---------|
| お知らせ（最新3件） | `content/notices/*.md` | `/`（トップページ内セクション） |
| お知らせ（アーカイブ） | `content/notices/*.md` | `/archives/` |
| 回覧板（最新3件） | `content/circulars/*.md` | `/`（トップページ内セクション） |
| 回覧板（一覧） | `content/circulars/*.md` | `/circulars/` |
| 東海村ニュース | RSS（ビルド時取得） | `/`（トップページ内セクション） |
| ご意見フォーム | テンプレート埋め込み | `/`（トップページ内セクション） |
| PDFファイル | `wwwroot/files/*.pdf` | `/files/*.pdf`（静的配信） |

---

## バリデーションルール

- `title` は必須。空の場合ビルドエラーとする。
- `date` は必須。YYYY-MM-DD 形式。未来日付は許可（予告投稿用）。
- `pdf` のパスは `/files/` から始まるルート相対パスとする。
- `draft: true` のファイルはビルド出力から除外する。
