export type PostParagraph = {
  type: 'paragraph';
  text: string;
};

export type PostList = {
  type: 'list';
  items: readonly string[];
};

export type PostQuote = {
  type: 'quote';
  text: string;
  attribution?: string;
};

export type PostCode = {
  type: 'code';
  language: string;
  code: string;
  caption?: string;
};

export type PostBlock = PostParagraph | PostList | PostQuote | PostCode;

export type PostSection = {
  id: string;
  title: string;
  blocks: readonly PostBlock[];
};

export type Post = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: readonly string[];
  publishedAt: string;
  publishedLabel: string;
  readingTime: string;
  featured: boolean;
  sections: readonly PostSection[];
};

export type AdjacentPosts = {
  previous: Post | null;
  next: Post | null;
};

const POSTS: readonly Post[] = [];

export function getAllPosts(): readonly Post[] {
  return POSTS;
}

export function getPostBySlug(slug: string): Post | undefined {
  return POSTS.find((post) => post.slug === slug);
}

export function getAdjacentPosts(slug: string): AdjacentPosts {
  const postIndex = POSTS.findIndex((post) => post.slug === slug);

  if (postIndex === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: POSTS[postIndex + 1] ?? null,
    next: POSTS[postIndex - 1] ?? null,
  };
}
