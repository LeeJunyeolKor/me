import assert from 'node:assert/strict';
import test from 'node:test';

import { sitemapEntries } from './sitemap-entries';
import { absoluteUrl } from './urls';

const origin = 'https://leejunyeolkor.github.io/me';

test('absolute URLs include the site origin once', () => {
  assert.equal(absoluteUrl(origin, '/'), `${origin}/`);
  assert.equal(absoluteUrl(`${origin}/`, '/category/food'), `${origin}/category/food/`);
  assert.equal(absoluteUrl(origin, '/posts/a/'), `${origin}/posts/a/`);
  assert.equal(absoluteUrl('https://example.com', '/sitemap.xml'), 'https://example.com/sitemap.xml');
  assert.equal(absoluteUrl('https://example.com', '/opengraph.png'), 'https://example.com/opengraph.png');
  assert.doesNotMatch(absoluteUrl(origin, '/category/dev/'), /\/me\/me\//);
});

test('sitemap lists category pages and post URLs under the site origin', () => {
  const urls = sitemapEntries([{ slug: 'hello', publishedAt: '2026-11-01' }], origin).map((entry) => entry.url);
  assert.deepEqual(urls, [
    `${origin}/`,
    `${origin}/about/`,
    `${origin}/notes/`,
    `${origin}/privacy/`,
    `${origin}/category/dev/`,
    `${origin}/category/food/`,
    `${origin}/category/life/`,
    `${origin}/posts/hello/`,
  ]);
  assert.equal(
    urls.some((url) => url.includes('/me/me/')),
    false
  );
});
