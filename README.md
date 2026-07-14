# KIC-PoC — 個人製作プロダクト紹介サイト

個人製作プロダクトの紹介記事を Markdown で書いて公開する静的サイト。
[Astro](https://astro.build/) 製で、GitHub Pages にホストしています。

**公開 URL:** https://yuu61.github.io/KIC-PoC/

## 記事の追加方法

1. `src/content/products/_template.md` をコピーして `src/content/products/` に新しい `.md` ファイルを作る
   - ファイル名がそのまま URL になる(例: `my-tool.md` → `/KIC-PoC/products/my-tool/`)
   - 先頭が `_` のファイルはビルド対象外(テンプレート置き場として利用)
2. frontmatter を記入する

   | 項目 | 必須 | 説明 |
   | --- | --- | --- |
   | `title` | ✔ | プロダクト名 |
   | `description` | ✔ | 一覧カードに表示される短い説明 |
   | `pubDate` | ✔ | 公開日(`YYYY-MM-DD`) |
   | `updatedDate` | - | 更新日 |
   | `tags` | - | タグのリスト |
   | `repo` | - | GitHub リポジトリの URL(ボタン表示) |
   | `demo` | - | デモサイトの URL(ボタン表示) |
   | `draft` | - | `true` で下書き(ビルドから除外) |

3. 本文を Markdown で書く
4. `main` に push すると GitHub Actions が自動でビルドして公開する

## ローカル開発

```sh
npm install        # 依存関係のインストール(初回のみ)
npm run dev        # 開発サーバー http://localhost:4321/KIC-PoC/
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
├── public/                        # そのまま配信される静的ファイル(favicon 等)
├── src/
│   ├── components/ProductCard.astro   # 一覧のプロダクトカード
│   ├── consts.ts                      # サイト名・説明などの定数
│   ├── content.config.ts              # 記事コレクションのスキーマ定義
│   ├── content/products/              # ★ 記事(Markdown)はここに置く
│   ├── layouts/BaseLayout.astro       # 共通レイアウト(ヘッダー・フッター)
│   ├── pages/404.astro                # 404ページ
│   ├── pages/index.astro              # トップページ(記事一覧)
│   ├── pages/products/[...slug].astro # 記事詳細ページ
│   ├── styles/global.css              # 全体スタイル(ダークモード対応)
│   └── utils.ts                       # base パス対応リンク等のユーティリティ
└── astro.config.mjs               # site / base(サブパス公開)の設定
```
