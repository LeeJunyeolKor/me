import { getAllPosts } from '@/lib/posts';
import { siteUrl } from '@/lib/site';
export const dynamic = 'force-static';
const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export function GET() {
  const items = getAllPosts()
    .map(
      (post) =>
        `<item><title>${escape(post.title)}</title><link>${siteUrl}/posts/${post.slug}/</link><guid>${siteUrl}/posts/${post.slug}/</guid><description>${escape(post.description)}</description><pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate></item>`
    )
    .join('');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>이준열의 개발 블로그</title><link>${siteUrl}/</link><description>프론트엔드와 AI 개발에 관해 씁니다.</description>${items}</channel></rss>`,
    { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } }
  );
}
