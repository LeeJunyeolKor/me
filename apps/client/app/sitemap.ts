import type { MetadataRoute } from 'next';

import { sitemapEntries } from '@/lib/sitemap-entries';
import { getAllPosts } from '@/lib/posts';
import { siteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries(getAllPosts(), siteUrl);
}
