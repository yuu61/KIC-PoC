# KIC-PoC — プロダクト解説サイト

1つのプロダクトを解説するための静的サイト。本文は Markdown で書き、
[Astro](https://astro.build/) でビルドして GitHub Pages にホストしています。

**公開 URL:** https://kic-poc.github.tukushityann.net/

## サイトの書き方

### トップページ(メインの解説)

`src/content/pages/index.md` を編集します。frontmatter の `title` が見出し、
`description` がリード文と meta description になります。`repo` / `demo` に URL を
書くとページ上部にボタンが表示されます。

サイト名(ヘッダー表記)を変えるときは `src/consts.ts` の `SITE_TITLE` を編集します。

### 詳細ページ(必要になったら)

長くなる話題はページを分けられます。

1. `src/content/pages/_template.md` をコピーして `src/content/pages/` に新しい `.md` を作る
   - ファイル名がそのまま URL になる(例: `architecture.md` → `/architecture/`)
   - 先頭が `_` のファイルはビルド対象外(テンプレート置き場)
2. frontmatter を記入して本文を書く

   | 項目 | 必須 | 説明 |
   | --- | --- | --- |
   | `title` | ✔ | ページタイトル |
   | `description` | - | 一覧と meta description に使われる短い説明 |
   | `order` | - | トップページの一覧での表示順(小さいほど上。省略時は 0) |
   | `updatedDate` | - | 更新日(ページ上部に表示) |
   | `repo` / `demo` | - | URL を書くとページ上部にボタン表示 |
   | `draft` | - | `true` で下書き(公開されない) |

3. 詳細ページはトップページ下部の「詳細ページ」一覧に自動で載ります

`main` に push すると GitHub Actions が自動でビルド・公開します。

## ローカル開発

```sh
npm install        # 依存関係のインストール(初回のみ)
npm run dev        # 開発サーバー http://localhost:4321/
npm run build      # 本番ビルド(dist/ に出力)
npm run preview    # ビルド結果のプレビュー
```

Node.js 22.12 以上が必要です。

## デプロイ

`main` ブランチへの push をトリガーに `.github/workflows/deploy.yml` が実行され、
GitHub Pages(Source: GitHub Actions)へ自動デプロイされます。手動実行も可能です
(Actions タブ → Deploy to GitHub Pages → Run workflow)。

## 構成

```text
/
├── .github/workflows/deploy.yml   # GitHub Pages への自動デプロイ
├── public/                        # そのまま配信される静的ファイル(favicon・画像等)
├── src/
│   ├── consts.ts                      # サイト名などの定数
│   ├── content.config.ts              # ページコレクションのスキーマ定義
│   ├── content/pages/index.md         # ★ トップページの本文(メインの解説)
│   ├── content/pages/                 # ★ 詳細ページ(Markdown)はここに追加
│   ├── layouts/BaseLayout.astro       # 共通レイアウト(ヘッダー・フッター)
│   ├── pages/404.astro                # 404ページ
│   ├── pages/index.astro              # トップページ(index.md を描画)
│   ├── pages/[...slug].astro          # 詳細ページ(index.md 以外を描画)
│   ├── styles/global.css              # 全体スタイル(ダークモード対応)
│   └── utils.ts                       # base パス対応リンク等のユーティリティ
└── astro.config.mjs               # site / base(サブパス公開)の設定
```
