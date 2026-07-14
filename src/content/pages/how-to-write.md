---
title: 'サンプル: ページの書き方'
description: 詳細ページの追加方法と Markdown 記法の表示例。確認したら削除してください。
order: 99
---

## ページの追加方法

1. `src/content/pages/_template.md` をコピーして、`src/content/pages/` に新しいファイルを作る
2. ファイル名は URL になるので、英小文字とハイフンで付ける(例: `architecture.md` → `/KIC-PoC/architecture/`)
3. frontmatter(`---` で囲まれた部分)を書き換え、本文を Markdown で書く
4. `main` ブランチに push すると GitHub Actions が自動でビルド・公開する

トップページの本文は `src/content/pages/index.md` です。詳細ページはトップページ下部の一覧に自動で載ります。

## frontmatter の項目

| 項目 | 必須 | 説明 |
| --- | --- | --- |
| `title` | ✔ | ページタイトル |
| `description` | - | 一覧と meta description に使われる短い説明 |
| `order` | - | 一覧での表示順(小さいほど上。省略時は 0) |
| `updatedDate` | - | 更新日(ページ上部に表示) |
| `repo` / `demo` | - | URL を書くとページ上部にボタン表示 |
| `draft` | - | `true` で下書き(公開されない) |

## Markdown 表示例

本文では **強調**、*斜体*、`インラインコード`、[リンク](https://docs.astro.build/)などが使えます。

> 引用ブロックはこのように表示されます。

```ts
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return `${base}/${path.replace(/^\/+/, '')}`;
}
```

画像は `public/` に置いて `![代替テキスト](/KIC-PoC/ファイル名.png)` で参照できます。詳しくは [Astro のドキュメント](https://docs.astro.build/en/guides/images/)を参照してください。
