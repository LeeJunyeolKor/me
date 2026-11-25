import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { JSON_SCHEMA, load } from 'js-yaml';
import { remark } from 'remark';
import { visit } from 'unist-util-visit';

import { readCategory, type Category } from './categories';
import { isRealDate } from './date';
import { readRestaurant, type Restaurant } from './restaurant';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type Post = {
  slug: string;
  title: string;
  description: string;
  category: Category;
  tags: readonly string[];
  publishedAt: string;
  publishedLabel: string;
  readingTime: string;
  featured: boolean;
  draft: boolean;
  restaurant?: Restaurant;
  body: string;
  searchText: string;
};

export function markdownToPlainText(markdown: string): string {
  const tree = remark().parse(markdown);
  const parts: string[] = [];

  visit(tree, (node) => {
    if (node.type === 'text' || node.type === 'inlineCode' || node.type === 'code') {
      parts.push((node as { value: string }).value);
    }
  });

  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

export function readingTimeLabel(plain: string): string {
  const characters = plain.replace(/\s/g, '').length;
  return `${Math.max(1, Math.round(characters / 500))}분`;
}

export function adjacentPosts<T extends { slug: string }>(
  posts: readonly T[],
  slug: string
): { previous: T | null; next: T | null } {
  const postIndex = posts.findIndex((post) => post.slug === slug);
  if (postIndex === -1) return { previous: null, next: null };

  return {
    previous: posts[postIndex + 1] ?? null,
    next: posts[postIndex - 1] ?? null,
  };
}

export function publishedPosts<T extends { draft: boolean }>(posts: readonly T[]): T[] {
  return posts.filter((post) => !post.draft);
}

export function loadPosts(directory: string): Post[] {
  if (!existsSync(directory)) return [];

  const errors: string[] = [];
  const posts: Post[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.mdx')) continue;
    try {
      posts.push(parsePost(entry.name, readFileSync(join(directory, entry.name), 'utf8')));
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  if (errors.length) {
    throw new Error(`Invalid blog posts:\n${errors.map((error) => `- ${error}`).join('\n')}`);
  }

  return posts.sort((a, b) => {
    if (a.publishedAt === b.publishedAt) {
      if (a.slug === b.slug) return 0;
      return a.slug < b.slug ? -1 : 1;
    }
    return a.publishedAt < b.publishedAt ? 1 : -1;
  });
}

function parsePost(filename: string, source: string): Post {
  const slug = filename.slice(0, -'.mdx'.length);
  if (!SLUG.test(slug) || slug === '__empty__') {
    throw new Error(`Invalid post "${filename}": slug "${slug}" must use lowercase letters, numbers, and hyphens.`);
  }

  const { data, body } = splitFrontmatter(source, filename);
  const publishedAt = readDate(data.publishedAt, filename);
  const category = readCategory(data.category, filename);
  const restaurant = readRestaurant(data.restaurant, filename, category);
  const searchText = [markdownToPlainText(body), restaurantSearchText(restaurant)].filter(Boolean).join(' ');

  return {
    slug,
    title: requiredString(data, 'title', filename),
    description: requiredString(data, 'description', filename),
    category,
    tags: readTags(data.tags, filename),
    publishedAt,
    publishedLabel: publishedAt.replaceAll('-', '.'),
    readingTime: readingTimeLabel(searchText),
    featured: readFeatured(data.featured, filename),
    draft: readDraft(data.draft, filename),
    restaurant,
    body,
    searchText,
  };
}

function splitFrontmatter(source: string, filename: string): { data: Record<string, unknown>; body: string } {
  const text = source.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  if (!text.startsWith('---\n')) {
    throw new Error(`Invalid post "${filename}": frontmatter must start with ---.`);
  }

  const lines = text.split('\n');
  let close = -1;
  for (let index = 1; index < lines.length; index += 1) {
    if (lines[index] === '---') {
      close = index;
      break;
    }
  }
  if (close === -1) {
    throw new Error(`Invalid post "${filename}": frontmatter must end with ---.`);
  }

  const yaml = lines.slice(1, close).join('\n');
  let data: unknown;
  try {
    data = yaml.trim() ? load(yaml, { schema: JSON_SCHEMA }) : {};
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid post "${filename}": frontmatter YAML is invalid. ${message}`);
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error(`Invalid post "${filename}": frontmatter must be a mapping.`);
  }

  return { data: data as Record<string, unknown>, body: lines.slice(close + 1).join('\n') };
}

function requiredString(data: Record<string, unknown>, key: string, filename: string): string {
  const value = data[key];
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Invalid post "${filename}": "${key}" must be a non-empty string.`);
  }
  return value.trim();
}

function readDate(value: unknown, filename: string): string {
  if (typeof value !== 'string' || !isRealDate(value)) {
    throw new Error(`Invalid post "${filename}": "publishedAt" must be a YYYY-MM-DD date.`);
  }
  return value;
}

function readTags(value: unknown, filename: string): string[] {
  if (!Array.isArray(value)) {
    throw new Error(`Invalid post "${filename}": "tags" must be a list of strings.`);
  }

  const tags: string[] = [];
  for (const tag of value) {
    if (typeof tag !== 'string' || !tag.trim()) {
      throw new Error(`Invalid post "${filename}": "tags" must be a list of strings.`);
    }
    const trimmed = tag.trim();
    if (!tags.includes(trimmed)) tags.push(trimmed);
  }
  return tags;
}

function readFeatured(value: unknown, filename: string): boolean {
  if (value === undefined) return false;
  if (typeof value !== 'boolean') {
    throw new Error(`Invalid post "${filename}": "featured" must be true or false.`);
  }
  return value;
}

function readDraft(value: unknown, filename: string): boolean {
  if (value === undefined) return false;
  if (typeof value !== 'boolean') {
    throw new Error(`Invalid post "${filename}": "draft" must be true or false.`);
  }
  return value;
}

function restaurantSearchText(restaurant: Restaurant | undefined): string {
  if (!restaurant) return '';
  return [
    restaurant.name,
    restaurant.area,
    restaurant.address,
    restaurant.servesCuisine,
    restaurant.priceRange,
    ...restaurant.menu.map((item) => item.name),
  ]
    .filter((value): value is string => Boolean(value))
    .join(' ');
}
