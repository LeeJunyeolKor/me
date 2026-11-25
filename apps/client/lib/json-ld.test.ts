import assert from 'node:assert/strict';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import test from 'node:test';

import { jsonLdScript, postJsonLd } from './json-ld';
import { loadPosts, type Post } from './post-source';

const origin = 'https://leejunyeolkor.github.io/me';
const fixtures = join(dirname(fileURLToPath(import.meta.url)), '../fixtures/posts');

function post(overrides: Partial<Post> = {}): Post {
  return {
    slug: 'note',
    title: '개발 노트',
    description: '설명에 <script>가 있습니다.',
    category: 'dev',
    tags: ['next'],
    publishedAt: '2026-11-03',
    publishedLabel: '2026.11.03',
    readingTime: '1분',
    featured: false,
    draft: false,
    body: '본문',
    searchText: '본문',
    ...overrides,
  };
}

test('every post emits BlogPosting and the script cannot break out of JSON', () => {
  const data = postJsonLd(post(), origin);
  assert.equal(data['@context'], 'https://schema.org');
  assert.equal(data['@graph'].length, 1);
  assert.equal(data['@graph'][0]?.['@type'], 'BlogPosting');
  assert.equal(data['@graph'][0]?.headline, '개발 노트');
  assert.equal(data['@graph'][0]?.articleSection, '개발');
  assert.equal(data['@graph'][0]?.inLanguage, 'ko');
  assert.equal(data['@graph'][0]?.url, `${origin}/posts/note/`);
  assert.equal((data['@graph'][0]?.author as { name: string }).name, '이준열');
  const script = jsonLdScript(data);
  assert.match(script, /\\u003cscript/);
  assert.doesNotMatch(script, /<script>/);
});

test('the food fixture emits a Restaurant review and life does not', () => {
  const posts = loadPosts(fixtures);
  const food = posts.find((item) => item.category === 'food');
  const life = posts.find((item) => item.category === 'life');
  assert.ok(food?.restaurant);

  const foodLd = postJsonLd(food!, origin);
  const review = foodLd['@graph'].find((item) => item['@type'] === 'Review');
  const reviewed = review?.itemReviewed as {
    '@type': string;
    name: string;
    servesCuisine?: string;
    priceRange?: string;
    openingHours?: string[];
    openingHoursSpecification?: { dayOfWeek: string[]; opens: string; closes: string }[];
    address: { addressLocality: string; streetAddress?: string; addressCountry: string };
    hasMap?: string;
  };
  const rating = review?.reviewRating as { ratingValue: number; bestRating: number; worstRating: number };

  assert.equal(
    foodLd['@graph'].some((item) => item['@type'] === 'BlogPosting'),
    true
  );
  assert.equal(reviewed?.['@type'], 'Restaurant');
  assert.equal(reviewed?.name, '샘플국수집');
  assert.equal(reviewed?.servesCuisine, '한식');
  assert.equal(reviewed?.priceRange, '₩10,000-20,000');
  assert.deepEqual(reviewed?.openingHours, ['Mo-Fr 11:00-21:00', 'Sa 12:00-20:00']);
  assert.equal(reviewed?.openingHoursSpecification?.[0]?.opens, '11:00');
  assert.equal(reviewed?.openingHoursSpecification?.[0]?.closes, '21:00');
  assert.equal(reviewed?.address.addressLocality, '성수');
  assert.equal(reviewed?.address.streetAddress, '서울 성동구 연무장길 00');
  assert.equal(reviewed?.address.addressCountry, 'KR');
  assert.equal(reviewed?.hasMap, 'https://map.naver.com/p/entry/place/0');
  assert.equal(rating?.ratingValue, 4.5);
  assert.equal(rating?.bestRating, 5);
  assert.equal(rating?.worstRating, 1);
  assert.equal((review?.author as { name: string }).name, '이준열');
  assert.equal(review?.datePublished, '2026-11-01');

  const lifeLd = postJsonLd(life!, origin);
  assert.equal(
    lifeLd['@graph'].some((item) => item['@type'] === 'Review'),
    false
  );
  assert.equal(lifeLd['@graph'][0]?.articleSection, '일상');
});

test('free-text hours are not emitted as openingHours', () => {
  const data = postJsonLd(
    post({
      category: 'food',
      restaurant: {
        name: '가게',
        area: '연남',
        menu: [],
        priceRange: '1만원대',
        hours: '화요일 휴무',
        rating: 5,
        visitedAt: '2026-11-01',
      },
    }),
    origin
  );
  const reviewed = data['@graph'].find((item) => item['@type'] === 'Review')?.itemReviewed as Record<string, unknown>;
  assert.equal(reviewed?.name, '가게');
  assert.equal(reviewed?.address && (reviewed.address as { addressLocality: string }).addressLocality, '연남');
  assert.equal('openingHours' in reviewed, false);
  assert.equal('openingHoursSpecification' in reviewed, false);
  assert.equal('servesCuisine' in reviewed, false);
});
