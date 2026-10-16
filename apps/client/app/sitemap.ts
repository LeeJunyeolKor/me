import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { siteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const latest = posts.reduce<number | null>((max, post) => {
    const time = Date.parse(post.publishedAt);
    if (Number.isNaN(time)) return max;
    return max === null || time > max ? time : max;
  }, null);
  const updated = latest === null ? new Date() : new Date(latest);

  return [
    { url: siteUrl + '/', lastModified: updated },
    { url: siteUrl + '/about/', lastModified: updated },
    { url: siteUrl + '/notes/', lastModified: updated },
    ...posts.map((post) => ({
      url: siteUrl + '/posts/' + post.slug + '/',
      lastModified: Number.isNaN(Date.parse(post.publishedAt)) ? updated : new Date(post.publishedAt),
    })),
  ];
}
