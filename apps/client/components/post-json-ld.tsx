import { jsonLdScript, postJsonLd } from '@/lib/json-ld';
import type { Post } from '@/lib/posts';
import { siteUrl } from '@/lib/site';

export function PostJsonLd({ post }: { post: Post }) {
  return (
    <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: jsonLdScript(postJsonLd(post, siteUrl)) }} />
  );
}
