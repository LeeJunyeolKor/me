export function ensureTrailingSlash(href: string): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href;

  const hash = href.indexOf('#');
  const query = href.indexOf('?');
  const cuts = [hash, query].filter((index) => index >= 0);
  const cut = cuts.length ? Math.min(...cuts) : href.length;
  const path = href.slice(0, cut);
  const suffix = href.slice(cut);

  if (path.endsWith('/') || /\.[a-z0-9]+$/i.test(path)) return href;
  return `${path}/${suffix}`;
}
