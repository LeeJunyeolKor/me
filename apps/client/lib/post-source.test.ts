import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { adjacentPosts, loadPosts, markdownToPlainText, readingTimeLabel } from './post-source';
import { filterPosts } from './search-filter';
import { uniqueSlug } from './slug';
import { tableOfContents } from './toc';
import { readCodeCaption } from './code-caption';
import { fenceLanguage } from './code-caption';
import { ensureTrailingSlash, withBasePath } from './links';

const post = `---
title: 글 제목
description: 한 줄 설명
publishedAt: 2026-10-20
category: 프론트엔드
tags:
  - react
  - react
  - nextjs
---

## 설치

\`pnpm\`으로 설치합니다.

\`\`\`ts
const snake_case = 1
\`\`\`
`;

function tempPosts() {
  return mkdtempSync(join(tmpdir(), 'blog-posts-'));
}

test('reads one mdx file into a post and ignores other files', () => {
  const directory = tempPosts();
  try {
    writeFileSync(join(directory, 'hello-world.mdx'), post);
    writeFileSync(join(directory, '.gitkeep'), '');
    writeFileSync(join(directory, 'notes.md'), post);
    mkdirSync(join(directory, 'nested'));
    writeFileSync(join(directory, 'nested', 'skip.mdx'), post);

    const posts = loadPosts(directory);

    assert.equal(posts.length, 1);
    assert.equal(posts[0]?.slug, 'hello-world');
    assert.equal(posts[0]?.title, '글 제목');
    assert.equal(posts[0]?.description, '한 줄 설명');
    assert.equal(posts[0]?.publishedAt, '2026-10-20');
    assert.equal(posts[0]?.publishedLabel, '2026.10.20');
    assert.equal(posts[0]?.category, '프론트엔드');
    assert.deepEqual(posts[0]?.tags, ['react', 'nextjs']);
    assert.equal(posts[0]?.featured, false);
    assert.match(posts[0]?.searchText ?? '', /설치/);
    assert.match(posts[0]?.searchText ?? '', /pnpm/);
    assert.match(posts[0]?.searchText ?? '', /snake_case/);
    assert.doesNotMatch(posts[0]?.searchText ?? '', /```/);
    assert.equal(posts[0]?.readingTime, '1분');
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('returns no posts when the directory is missing or empty', () => {
  assert.deepEqual(loadPosts(join(tmpdir(), 'blog-posts-missing-directory')), []);
  const directory = tempPosts();
  try {
    assert.deepEqual(loadPosts(directory), []);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('sorts newest first and links older posts as previous', () => {
  const directory = tempPosts();
  try {
    writeFileSync(join(directory, 'newer.mdx'), post.replace('2026-10-20', '2026-10-21').replace('글 제목', '최신'));
    writeFileSync(join(directory, 'same-b.mdx'), post.replace('글 제목', '같은날 B'));
    writeFileSync(join(directory, 'same-a.mdx'), post.replace('글 제목', '같은날 A'));

    const posts = loadPosts(directory);

    assert.deepEqual(
      posts.map((item) => item.slug),
      ['newer', 'same-a', 'same-b']
    );
    assert.equal(adjacentPosts(posts, 'newer').previous?.slug, 'same-a');
    assert.equal(adjacentPosts(posts, 'newer').next, null);
    assert.equal(adjacentPosts(posts, 'same-a').previous?.slug, 'same-b');
    assert.equal(adjacentPosts(posts, 'same-a').next?.slug, 'newer');
    assert.equal(adjacentPosts(posts, 'same-b').previous, null);
    assert.equal(adjacentPosts(posts, 'same-b').next?.slug, 'same-a');
    assert.deepEqual(adjacentPosts(posts, 'missing'), { previous: null, next: null });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('rejects posts that cannot be published', () => {
  const directory = tempPosts();
  try {
    writeFileSync(join(directory, 'bad.mdx'), post.replace('publishedAt: 2026-10-20', 'publishedAt: 2026-02-31'));
    writeFileSync(join(directory, 'Hello.mdx'), post);
    writeFileSync(join(directory, '__empty__.mdx'), post);
    assert.throws(() => loadPosts(directory), /bad\.mdx[\s\S]*publishedAt/);
    assert.throws(() => loadPosts(join(directory)), /Hello\.mdx|__empty__\.mdx|bad\.mdx/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('requires the authoring fields and keeps an explicit featured flag', () => {
  const directory = tempPosts();
  try {
    writeFileSync(join(directory, 'topic-only.mdx'), post.replace('category: 프론트엔드', 'topic: 프론트엔드'));
    assert.throws(() => loadPosts(directory), /topic-only\.mdx[\s\S]*category/);

    writeFileSync(
      join(directory, 'featured.mdx'),
      post.replace('category: 프론트엔드', 'category: 프론트엔드\nfeatured: true').replace('topic: 프론트엔드', '')
    );
    rmSync(join(directory, 'topic-only.mdx'));
    assert.equal(loadPosts(directory)[0]?.featured, true);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('plain text keeps code identifiers and drops fence markers', () => {
  const text = markdownToPlainText('## 제목\n\n`pnpm` 설치\n\n```ts\nconst snake_case = 1\n```\n');
  assert.match(text, /제목/);
  assert.match(text, /pnpm/);
  assert.match(text, /snake_case/);
  assert.doesNotMatch(text, /```/);
  assert.doesNotMatch(text, /##/);
});

test('reading time is one minute per 500 non-space characters', () => {
  assert.equal(readingTimeLabel(''), '1분');
  assert.equal(readingTimeLabel('가'.repeat(250)), '1분');
  assert.equal(readingTimeLabel('가'.repeat(500)), '1분');
  assert.equal(readingTimeLabel('가'.repeat(750)), '2분');
});

test('heading ids skip fenced code and stay unique', () => {
  assert.equal(uniqueSlug('Hello, World!', new Map()), 'hello-world');
  const toc = tableOfContents('## 첫 절\n\n```md\n## 코드 안의 제목\n```\n\n## 첫 절\n');
  assert.deepEqual(toc, [
    { id: '첫-절', title: '첫 절' },
    { id: '첫-절-1', title: '첫 절' },
  ]);
});

test('code captions and fence languages come from the markdown fence', () => {
  assert.equal(readCodeCaption('caption="예제"'), '예제');
  assert.equal(readCodeCaption("caption='example'"), 'example');
  assert.equal(readCodeCaption('title="nope"'), undefined);
  assert.equal(readCodeCaption(''), undefined);
  assert.equal(fenceLanguage('hljs language-tsx'), 'tsx');
  assert.equal(fenceLanguage('language-ts extra'), 'ts');
  assert.equal(fenceLanguage('hljs'), '');
  assert.equal(fenceLanguage(undefined), '');
});

test('root-relative links and images keep the pages base path', () => {
  assert.equal(withBasePath('/me', '/images/diagram.png'), '/me/images/diagram.png');
  assert.equal(withBasePath('/me/', '/posts/other/'), '/me/posts/other/');
  assert.equal(withBasePath('', '/images/diagram.png'), '/images/diagram.png');
  assert.equal(withBasePath('/me', 'https://example.com/a.png'), 'https://example.com/a.png');
  assert.equal(withBasePath('/me', ensureTrailingSlash('/posts/other')), '/me/posts/other/');
});

test('root-relative links keep a trailing slash', () => {
  assert.equal(ensureTrailingSlash('/posts/other'), '/posts/other/');
  assert.equal(ensureTrailingSlash('/posts/other/'), '/posts/other/');
  assert.equal(ensureTrailingSlash('/posts/other#install'), '/posts/other/#install');
  assert.equal(ensureTrailingSlash('/posts/other?q=1'), '/posts/other/?q=1');
  assert.equal(ensureTrailingSlash('/opengraph.png'), '/opengraph.png');
  assert.equal(ensureTrailingSlash('https://example.com/posts/other'), 'https://example.com/posts/other');
  assert.equal(ensureTrailingSlash('#install'), '#install');
});

test('search still requires every term, one topic, and any selected tag', () => {
  const posts = [
    {
      slug: 'a',
      title: '리액트 훅',
      description: '설명',
      category: '프론트엔드',
      date: '2026-10-20',
      readingTime: '1분',
      tags: ['react', 'hook'],
      text: 'useEffect 코드 const snake_case = 1',
    },
  ];

  assert.equal(filterPosts(posts, '리액트 snake_case', '프론트엔드', ['hook']).length, 1);
  assert.equal(filterPosts(posts, '리액트 없는단어', '', []).length, 0);
  assert.equal(filterPosts(posts, '', '백엔드', []).length, 0);
  assert.equal(filterPosts(posts, '', '', ['vue']).length, 0);
  assert.equal(filterPosts(posts, '', '', ['react', 'vue']).length, 1);
});
