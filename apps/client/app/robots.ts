import { siteUrl } from '@/lib/site';
import { absoluteUrl } from '@/lib/urls';

export const dynamic = 'force-static';

export default function robots() {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: absoluteUrl(siteUrl, '/sitemap.xml') };
}
