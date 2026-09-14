import { getAllPosts } from '@/lib/posts';
import { siteUrl } from '@/lib/site';
export const dynamic = 'force-static';
export default function sitemap() {
  return [
    { url: siteUrl + '/' },
    { url: siteUrl + '/about/' },
    ...getAllPosts().map((post) => ({ url: siteUrl + '/posts/' + post.slug + '/', lastModified: post.publishedAt })),
  ];
}
