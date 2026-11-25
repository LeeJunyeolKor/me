import { createRequire } from 'node:module';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const { readGoogleSiteVerification, readSiteUrl } = require('../site-config.js');

const out = join(process.cwd(), 'out');
const origin = readSiteUrl();
const failures = [];

function fail(message) {
  failures.push(message);
}

function read(path) {
  if (!existsSync(path)) {
    fail(`missing ${path}`);
    return '';
  }
  return readFileSync(path, 'utf8');
}

const sitemap = read(join(out, 'sitemap.xml'));
const robots = read(join(out, 'robots.txt'));
const home = read(join(out, 'index.html'));
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

for (const path of ['/', '/about/', '/notes/', '/privacy/', '/category/dev/', '/category/food/', '/category/life/']) {
  const url = path === '/' ? `${origin}/` : `${origin}${path}`;
  if (!locs.includes(url)) fail(`sitemap missing ${url}`);
}

if (origin.endsWith('/me') && sitemap.includes(`${origin}/me/`)) fail('sitemap duplicates the /me base path');
if (!robots.includes(`Sitemap: ${origin}/sitemap.xml`)) fail(`robots.txt missing Sitemap: ${origin}/sitemap.xml`);
if (!home.includes('lang="ko"')) fail('home page is missing lang="ko"');
if (!home.includes(origin)) fail(`home page is missing ${origin}`);

const token = readGoogleSiteVerification();
const hasVerification = home.includes('name="google-site-verification"');
if (token && !home.includes(`content="${token}"`)) fail('home page is missing the Google site verification token');
if (!token && hasVerification)
  fail('home page includes Google site verification without NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION');

function walk(dir, files) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, files);
    else if (entry.name.endsWith('.html')) files.push(path);
  }
}

const posts = [];
walk(join(out, 'posts'), posts);
for (const file of posts) {
  const html = readFileSync(file, 'utf8');
  if (!html.includes('application/ld+json') || !html.includes('"@type":"BlogPosting"')) {
    fail(`${file} is missing BlogPosting JSON-LD`);
  }
  if (
    html.includes('restaurant-card') &&
    (!html.includes('"@type":"Review"') || !html.includes('"@type":"Restaurant"'))
  ) {
    fail(`${file} is missing the Restaurant review JSON-LD`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
