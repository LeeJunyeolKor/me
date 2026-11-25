import type { Category } from './categories';
import { isRealDate } from './date';

const DAYS = [
  { abbr: 'Mo', name: 'Monday', keys: ['mo', 'mon', 'monday', '월'] },
  { abbr: 'Tu', name: 'Tuesday', keys: ['tu', 'tue', 'tues', 'tuesday', '화'] },
  { abbr: 'We', name: 'Wednesday', keys: ['we', 'wed', 'wednesday', '수'] },
  { abbr: 'Th', name: 'Thursday', keys: ['th', 'thu', 'thur', 'thurs', 'thursday', '목'] },
  { abbr: 'Fr', name: 'Friday', keys: ['fr', 'fri', 'friday', '금'] },
  { abbr: 'Sa', name: 'Saturday', keys: ['sa', 'sat', 'saturday', '토'] },
  { abbr: 'Su', name: 'Sunday', keys: ['su', 'sun', 'sunday', '일'] },
] as const;

const RESTAURANT_FIELDS = new Set([
  'name',
  'area',
  'address',
  'menu',
  'priceRange',
  'hours',
  'mapUrl',
  'rating',
  'visitedAt',
  'servesCuisine',
]);

export type MenuItem = {
  name: string;
  price: number;
};

export type HoursSpan = {
  days: string;
  opens: string;
  closes: string;
  openingHours: string;
  dayOfWeek: readonly string[];
};

export type Restaurant = {
  name: string;
  area: string;
  address?: string;
  menu: readonly MenuItem[];
  priceRange: string;
  hours: string | readonly HoursSpan[];
  mapUrl?: string;
  servesCuisine?: string;
  rating: number;
  visitedAt: string;
};

export function formatKrw(price: number): string {
  return `${new Intl.NumberFormat('ko-KR').format(price)}원`;
}

export function formatHours(hours: Restaurant['hours']): string {
  if (typeof hours === 'string') return hours;
  return hours.map((span) => `${span.days} ${span.opens}–${span.closes}`).join('\n');
}

export function readRestaurant(value: unknown, filename: string, category: Category): Restaurant | undefined {
  if (value === undefined) return undefined;
  if (category !== 'food') {
    throw new Error(`Invalid post "${filename}": "restaurant" is only allowed when category is food.`);
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Invalid post "${filename}": "restaurant" must be a mapping.`);
  }

  const data = value as Record<string, unknown>;
  for (const key of Object.keys(data)) {
    if (!RESTAURANT_FIELDS.has(key)) {
      throw new Error(`Invalid post "${filename}": "restaurant.${key}" is not a restaurant field.`);
    }
  }

  return {
    name: readText(data.name, filename, 'restaurant.name'),
    area: readText(data.area, filename, 'restaurant.area'),
    address: readOptionalText(data.address, filename, 'restaurant.address'),
    servesCuisine: readOptionalText(data.servesCuisine, filename, 'restaurant.servesCuisine'),
    menu: readMenu(data.menu, filename),
    priceRange: readText(data.priceRange, filename, 'restaurant.priceRange'),
    hours: readHours(data.hours, filename),
    mapUrl: readOptionalUrl(data.mapUrl, filename),
    rating: readRating(data.rating, filename),
    visitedAt: readVisitedAt(data.visitedAt, filename),
  };
}

function fail(filename: string, path: string, message: string): never {
  throw new Error(`Invalid post "${filename}": "${path}" ${message}`);
}

function readText(value: unknown, filename: string, path: string): string {
  if (typeof value !== 'string' || !value.trim()) fail(filename, path, 'must be a non-empty string.');
  return value.trim();
}

function readOptionalText(value: unknown, filename: string, path: string): string | undefined {
  if (value === undefined) return undefined;
  return readText(value, filename, path);
}

function readOptionalUrl(value: unknown, filename: string): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || !/^https?:\/\/\S+$/.test(value.trim())) {
    fail(filename, 'restaurant.mapUrl', 'must be an http(s) URL.');
  }
  return value.trim();
}

function readMenu(value: unknown, filename: string): MenuItem[] {
  if (!Array.isArray(value)) fail(filename, 'restaurant.menu', 'must be a list of { name, price }.');
  return value.map((item, index) => {
    const path = `restaurant.menu[${index}]`;
    if (!item || typeof item !== 'object' || Array.isArray(item)) fail(filename, path, 'must be a mapping.');
    const record = item as Record<string, unknown>;
    for (const key of Object.keys(record)) {
      if (key !== 'name' && key !== 'price') fail(filename, `${path}.${key}`, 'is not a menu field.');
    }
    return {
      name: readText(record.name, filename, `${path}.name`),
      price: readKrw(record.price, filename, `${path}.price`),
    };
  });
}

function readKrw(value: unknown, filename: string, path: string): number {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0) return value;
  if (typeof value === 'string' && /^\d+$/.test(value.trim())) return Number(value.trim());
  fail(filename, path, 'must be a whole number of KRW, 0 or greater.');
}

function readRating(value: unknown, filename: string): number {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < 1 ||
    value > 5 ||
    Math.round(value * 2) !== value * 2
  ) {
    fail(filename, 'restaurant.rating', 'must be a number from 1 to 5 in steps of 0.5.');
  }
  return value;
}

function readVisitedAt(value: unknown, filename: string): string {
  if (typeof value !== 'string' || !isRealDate(value)) {
    fail(filename, 'restaurant.visitedAt', 'must be a YYYY-MM-DD date.');
  }
  return value;
}

function readHours(value: unknown, filename: string): string | HoursSpan[] {
  if (typeof value === 'string') {
    if (!value.trim()) fail(filename, 'restaurant.hours', 'must be text or a list of { days, opens, closes }.');
    return value.trim();
  }
  if (value && typeof value === 'object' && !Array.isArray(value))
    return [readHoursSpan(value, filename, 'restaurant.hours')];
  if (!Array.isArray(value) || value.length === 0) {
    fail(filename, 'restaurant.hours', 'must be text or a list of { days, opens, closes }.');
  }
  return value.map((item, index) => readHoursSpan(item, filename, `restaurant.hours[${index}]`));
}

function readHoursSpan(value: unknown, filename: string, path: string): HoursSpan {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    fail(filename, path, 'must be a mapping with days, opens, and closes.');
  }
  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (key !== 'days' && key !== 'opens' && key !== 'closes')
      fail(filename, `${path}.${key}`, 'is not an hours field.');
  }
  const days = readText(record.days, filename, `${path}.days`);
  const opens = readTime(record.opens, filename, `${path}.opens`);
  const closes = readTime(record.closes, filename, `${path}.closes`);
  const indexes = parseDayIndexes(days, filename, `${path}.days`);
  return {
    days,
    opens,
    closes,
    openingHours: `${schemaDayExpression(indexes)} ${opens}-${closes}`,
    dayOfWeek: schemaDayNames(indexes),
  };
}

function readTime(value: unknown, filename: string, path: string): string {
  if (typeof value !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    fail(filename, path, 'must be HH:MM.');
  }
  return value;
}

function parseDayIndexes(days: string, filename: string, path: string): number[] {
  const parts = days
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  if (!parts.length) fail(filename, path, 'must use Mo–Su or 월–일.');

  const indexes: number[] = [];
  for (const part of parts) {
    const range = part.split('-').map((token) => token.trim());
    if (range.length === 1) {
      indexes.push(dayIndex(range[0], filename, path));
      continue;
    }
    if (range.length !== 2 || !range[0] || !range[1]) fail(filename, path, 'must use Mo–Su or 월–일.');
    const start = dayIndex(range[0], filename, path);
    const end = dayIndex(range[1], filename, path);
    let cursor = start;
    indexes.push(cursor);
    while (cursor !== end) {
      cursor = (cursor + 1) % 7;
      indexes.push(cursor);
      if (indexes.length > 14) break;
    }
  }

  return indexes.filter((index, position) => indexes.indexOf(index) === position);
}

function dayIndex(token: string, filename: string, path: string): number {
  const key = token.toLowerCase();
  const index = DAYS.findIndex((day) => (day.keys as readonly string[]).includes(key));
  if (index === -1) fail(filename, path, 'must use Mo–Su or 월–일.');
  return index;
}

function schemaDayExpression(indexes: readonly number[]): string {
  const sorted = Array.from(new Set(indexes)).sort((a, b) => a - b);
  if (sorted.length === 7) return 'Mo-Su';
  const ranges: string[] = [];
  let start = sorted[0] ?? 0;
  let previous = start;
  for (let index = 1; index <= sorted.length; index += 1) {
    const current = sorted[index];
    if (current === previous + 1) {
      previous = current;
      continue;
    }
    ranges.push(start === previous ? DAYS[start].abbr : `${DAYS[start].abbr}-${DAYS[previous].abbr}`);
    start = current ?? start;
    previous = current ?? previous;
  }
  return ranges.join(',');
}

function schemaDayNames(indexes: readonly number[]): string[] {
  return DAYS.filter((_, index) => indexes.includes(index)).map((day) => day.name);
}
