export function absoluteUrl(siteUrl: string, path: string): string {
  const origin = siteUrl.replace(/\/+$/, '');
  if (path === '' || path === '/') return `${origin}/`;

  const suffix = path.startsWith('/') ? path : `/${path}`;
  const pathname = suffix.split(/[?#]/)[0];
  if (pathname.endsWith('/') || /\.[a-z0-9]+$/i.test(pathname)) return `${origin}${suffix}`;

  const hash = suffix.indexOf('#');
  const query = suffix.indexOf('?');
  const cuts = [hash, query].filter((index) => index >= 0);
  const cut = cuts.length ? Math.min(...cuts) : suffix.length;
  return `${origin}${suffix.slice(0, cut)}/${suffix.slice(cut)}`;
}
