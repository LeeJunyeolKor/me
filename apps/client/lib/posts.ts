import { join } from 'node:path';

import { adjacentPosts, loadPosts, type Post } from './post-source';

export type { Post };

export type AdjacentPosts = {
  previous: Post | null;
  next: Post | null;
};

function postsDirectory() {
  return join(process.cwd(), 'content', 'posts');
}

let cached: readonly Post[] | undefined;

export function getAllPosts(): readonly Post[] {
  if (process.env.NODE_ENV === 'production' && cached) return cached;
  const posts = loadPosts(postsDirectory());
  if (process.env.NODE_ENV === 'production') cached = posts;
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getAdjacentPosts(slug: string): AdjacentPosts {
  return adjacentPosts(getAllPosts(), slug);
}
