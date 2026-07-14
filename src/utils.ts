// base(サブパス公開)を考慮したサイト内リンクを生成する
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return `${base}/${path.replace(/^\/+/, '')}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', { dateStyle: 'long' }).format(date);
}
