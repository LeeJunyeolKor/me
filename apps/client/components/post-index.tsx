'use client';
import Link from 'next/link';
import { useDeferredValue, useEffect, useState } from 'react';
import { filterPosts, type SearchPost } from '@/lib/search-filter';
export function PostIndex({ posts }: { posts: readonly SearchPost[] }) {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const topics = Array.from(new Set(posts.map((post) => post.category)));
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags))).sort();
  useEffect(() => {
    function restore() {
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get('q') || '');
      setTopic(params.get('topic') || '');
      setTags(params.getAll('tag'));
      setReady(true);
    }
    restore();
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    url.search = '';
    if (query) url.searchParams.set('q', query);
    if (topic) url.searchParams.set('topic', topic);
    tags.forEach((tag) => url.searchParams.append('tag', tag));
    window.history.replaceState(window.history.state, '', url);
  }, [query, topic, tags, ready]);
  const filtered = filterPosts(posts, deferredQuery, topic, tags);
  const active = Boolean(query || topic || tags.length);
  function reset() {
    setQuery('');
    setTopic('');
    setTags([]);
  }
  function toggle(tag: string) {
    setTags((current) => (current.includes(tag) ? current.filter((value) => value !== tag) : [...current, tag]));
  }
  return (
    <div>
      <div className='search-row'>
        <label className='search-field'>
          <span className='sr-only'>블로그 전체 검색</span>
          <input
            type='search'
            placeholder='제목, 내용, 태그 검색'
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        {active && (
          <button className='text-button' onClick={reset}>
            초기화
          </button>
        )}
      </div>
      <div className='filters'>
        <label className='topic-label'>
          주제
          <select value={topic} onChange={(event) => setTopic(event.target.value)}>
            <option value=''>모든 주제</option>
            {topics.map((value) => (
              <option key={value}>{value}</option>
            ))}
            {topic && !topics.includes(topic) && <option>{topic}</option>}
          </select>
        </label>
        <fieldset>
          <legend>태그 · 하나라도 일치</legend>
          <div className='tag-options'>
            {Array.from(new Set([...allTags, ...tags])).map((tag) => (
              <label key={tag}>
                <input type='checkbox' checked={tags.includes(tag)} onChange={() => toggle(tag)} />
                {tag}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <div className='result-info'>
        <span role='status'>
          {filtered.length}개의 글{active ? ' · 필터 적용됨' : ''}
        </span>
        <span>검색은 본문까지 포함합니다</span>
      </div>
      <div className='post-list'>
        {filtered.map((post) => (
          <article className='post-row' key={post.slug}>
            <div className='post-meta'>
              <time dateTime={post.date}>{post.date.replaceAll('-', '.')}</time>
              <span>{post.category}</span>
              <span>{post.readingTime} 읽기</span>
            </div>
            <div>
              <h3>
                <Link href={'/posts/' + post.slug + '/'}>{post.title}</Link>
              </h3>
              <p>{post.description}</p>
              <div className='post-tags'>
                {post.tags.map((tag) => (
                  <button key={tag} aria-pressed={tags.includes(tag)} onClick={() => toggle(tag)}>
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className='empty'>
          <h3>검색 결과가 없습니다.</h3>
          <p>검색어를 줄이거나 주제와 태그를 해제해 보세요.</p>
          <button onClick={reset} className='text-button'>
            모든 조건 지우기
          </button>
        </div>
      )}
    </div>
  );
}
