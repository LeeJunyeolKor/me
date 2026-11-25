import { categoryLabel } from '@/lib/categories';
import { getAllPosts } from '@/lib/posts';
import { siteUrl } from '@/lib/site';
import { absoluteUrl } from '@/lib/urls';

export const dynamic = 'force-static';

const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function GET() {
  const home = absoluteUrl(siteUrl, '/');
  const items = getAllPosts()
    .map((post) => {
      const url = absoluteUrl(siteUrl, `/posts/${post.slug}/`);
      return `<item><title>${escape(post.title)}</title><link>${url}</link><guid>${url}</guid><description>${escape(post.description)}</description><category>${escape(categoryLabel(post.category))}</category><pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate></item>`;
    })
    .join('');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>이준열의 블로그</title><link>${home}</link><description>개발, 맛집, 일상을 기록합니다.</description>${items}</channel></rss>`,
    { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } }
  );
}
