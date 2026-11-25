import { absoluteUrl } from './urls';

export type SitemapPost = {
  slug: string;
  publishedAt: string;
};

const STATIC_PATHS = ['/', '/about/', '/notes/', '/privacy/', '/category/dev/', '/category/food/', '/category/life/'];

export function sitemapEntries(posts: readonly SitemapPost[], siteUrl: string): { url: string; lastModified: Date }[] {
  const latest = posts.reduce<number | null>((max, post) => {
    const time = Date.parse(post.publishedAt);
    if (Number.isNaN(time)) return max;
    return max === null || time > max ? time : max;
  }, null);
  const updated = latest === null ? new Date() : new Date(latest);

  return [
    ...STATIC_PATHS.map((path) => ({ url: absoluteUrl(siteUrl, path), lastModified: updated })),
    ...posts.map((post) => ({
      url: absoluteUrl(siteUrl, `/posts/${post.slug}/`),
      lastModified: Number.isNaN(Date.parse(post.publishedAt)) ? updated : new Date(post.publishedAt),
    })),
  ];
}
