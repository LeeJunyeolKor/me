import assert from 'node:assert/strict';
import test from 'node:test';

import { formatHours, formatKrw, readRestaurant } from './restaurant';

const restaurant = {
  name: '샘플국수집',
  area: '성수',
  menu: [{ name: '비빔국수', price: 11000 }],
  priceRange: '₩10,000-20,000',
  hours: '매일 11:00-21:00, 월요일 휴무',
  rating: 4,
  visitedAt: '2026-10-28',
};

test('free-text hours stay text and prices format in KRW', () => {
  const parsed = readRestaurant(restaurant, 'food.mdx', 'food');
  assert.equal(parsed?.hours, '매일 11:00-21:00, 월요일 휴무');
  assert.equal(formatHours(parsed?.hours ?? ''), '매일 11:00-21:00, 월요일 휴무');
  assert.equal(formatKrw(11000), '11,000원');
});

test('structured hours accept Korean days and quoted times', () => {
  const parsed = readRestaurant(
    {
      ...restaurant,
      hours: [
        { days: '월-금', opens: '11:00', closes: '21:00' },
        { days: '토,일', opens: '12:00', closes: '20:00' },
      ],
    },
    'food.mdx',
    'food'
  );
  assert.equal(Array.isArray(parsed?.hours), true);
  if (!parsed || typeof parsed.hours === 'string') return;
  assert.equal(parsed.hours[0]?.openingHours, 'Mo-Fr 11:00-21:00');
  assert.deepEqual(parsed.hours[0]?.dayOfWeek, ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  assert.equal(parsed.hours[1]?.openingHours, 'Sa-Su 12:00-20:00');
  assert.equal(formatHours(parsed.hours), '월-금 11:00–21:00\n토,일 12:00–20:00');
});

test('restaurant fields fail the build with the field name', () => {
  assert.equal(readRestaurant(undefined, 'food.mdx', 'food'), undefined);
  assert.throws(
    () => readRestaurant(restaurant, 'note.mdx', 'dev'),
    /note\.mdx[\s\S]*only allowed when category is food/
  );
  assert.throws(() => readRestaurant({ ...restaurant, rating: 6 }, 'food.mdx', 'food'), /restaurant\.rating/);
  assert.throws(() => readRestaurant({ ...restaurant, rating: 4.2 }, 'food.mdx', 'food'), /restaurant\.rating/);
  assert.throws(
    () => readRestaurant({ ...restaurant, menu: [{ name: '국수', price: 10.5 }] }, 'food.mdx', 'food'),
    /menu\[0\]\.price/
  );
  assert.throws(() => readRestaurant({ ...restaurant, visitedAt: '2026-02-31' }, 'food.mdx', 'food'), /visitedAt/);
  assert.throws(() => readRestaurant({ ...restaurant, mapUrl: 'naver' }, 'food.mdx', 'food'), /mapUrl/);
  assert.throws(
    () =>
      readRestaurant({ ...restaurant, hours: [{ days: '휴무', opens: '11:00', closes: '21:00' }] }, 'food.mdx', 'food'),
    /hours\[0\]\.days/
  );
  assert.throws(
    () => readRestaurant({ ...restaurant, hours: [{ days: '월', opens: '11', closes: '21:00' }] }, 'food.mdx', 'food'),
    /opens/
  );
  assert.throws(() => readRestaurant({ ...restaurant, nickname: '별명' }, 'food.mdx', 'food'), /nickname/);
});
