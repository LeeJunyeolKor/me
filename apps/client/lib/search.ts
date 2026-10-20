import { getAllPosts } from './posts';
import type { SearchPost } from './search-filter';
export function getSearchPosts(): SearchPost[] {
  return getAllPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    category: post.category,
    tags: post.tags,
    date: post.publishedAt,
    readingTime: post.readingTime,
    text: post.searchText,
  }));
}
