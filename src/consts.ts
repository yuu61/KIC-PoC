// サイト名(ヘッダーとページタイトルに使用)。プロダクト名に合わせて変更する
export const SITE_TITLE = 'KIC-PoC';
// description が指定されないページ(トップ・詳細・404)の meta description フォールバック
export const SITE_DESCRIPTION =
  'エンタープライズ機器を用いたキャンパスネットワークの再設計と実証 — 単一SSIDローミングと L2/L3 フラッディング抑制';
export const AUTHOR = 'yuu61';
export const GITHUB_URL = 'https://github.com/yuu61';

// 詳細ページとして扱わない予約 id('index' はトップ本文、'404' は 404.astro と衝突)
export const RESERVED_PAGE_IDS = ['index', '404'];
