---
title: サンプル記事(記事の書き方)
description: この記事はサンプルです。テンプレートの使い方と Markdown 記法の表示例をまとめています。中身を確認したら削除してください。
pubDate: 2026-07-14
tags:
  - サンプル
repo: https://github.com/yuu61/KIC-PoC
---

## 記事の追加方法

1. `src/content/products/_template.md` をコピーして、`src/content/products/` に新しいファイルを作る
2. ファイル名は URL になるので、英小文字とハイフンで付ける(例: `my-tool.md`)
3. frontmatter(`---` で囲まれた部分)を書き換える
4. 本文を Markdown で書く
5. `main` ブランチに push すると GitHub Actions が自動でビルド・公開する

## frontmatter の項目

| 項目 | 必須 | 説明 |
| --- | --- | --- |
| `title` | ✔ | プロダクト名 |
| `description` | ✔ | 一覧カードに表示される短い説明 |
| `pubDate` | ✔ | 公開日(`YYYY-MM-DD`) |
| `updatedDate` | - | 更新日 |
| `tags` | - | タグのリスト |
| `repo` | - | GitHub リポジトリの URL(記事上部にボタン表示) |
| `demo` | - | デモサイトの URL(記事上部にボタン表示) |
| `draft` | - | `true` で下書き(公開されない) |

## Markdown 表示例

本文では **強調**、*斜体*、`インラインコード`、[リンク](https://docs.astro.build/)などが使えます。

> 引用ブロックはこのように表示されます。

コードブロックはシンタックスハイライト付きで表示されます。

```ts
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return `${base}/${path.replace(/^\/+/, '')}`;
}
```

画像は `src/assets/` か `public/` に置いて参照できます。詳しくは [Astro のドキュメント](https://docs.astro.build/en/guides/images/)を参照してください。
