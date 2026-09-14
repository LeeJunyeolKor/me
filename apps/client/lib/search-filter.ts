export type SearchPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readingTime: string;
  tags: readonly string[];
  text: string;
};
export function filterPosts(posts: readonly SearchPost[], query: string, topic: string, tags: readonly string[]) {
  const terms = query.normalize('NFKC').toLocaleLowerCase('ko-KR').trim().split(/\s+/).filter(Boolean);
  return posts.filter((post) => {
    const text = [post.title, post.description, post.text, post.category, ...post.tags]
      .join(' ')
      .normalize('NFKC')
      .toLocaleLowerCase('ko-KR');
    return (
      (!topic || post.category === topic) &&
      (!tags.length || tags.some((tag) => post.tags.includes(tag))) &&
      terms.every((term) => text.includes(term))
    );
  });
}
