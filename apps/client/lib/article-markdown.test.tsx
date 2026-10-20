import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { ArticleMarkdown } from '../components/article-markdown';
import { tableOfContents } from './toc';

const markdown = `도입 {count} 입니다.

## 코드

- 하나
- 둘

1. 첫째

> 인용

\`\`\`ts caption="예제"
export const answer = 42
\`\`\`

[다른 글](/posts/other)
`;

test('markdown keeps the article markup, highlighting, caption, and trailing slash', () => {
  const toc = tableOfContents(markdown);
  const html = renderToStaticMarkup(createElement(ArticleMarkdown, { markdown, toc }));

  assert.deepEqual(toc, [{ id: '코드', title: '코드' }]);
  assert.match(html, /id="코드"/);
  assert.match(html, /article-content__paragraph/);
  assert.match(html, /\{count\}/);
  assert.match(html, /article-content__list/);
  assert.match(html, /article-content__list--ordered/);
  assert.match(html, /article-content__quote/);
  assert.match(html, /article-code__bar/);
  assert.match(html, /<small>ts<\/small>/);
  assert.match(html, /article-code__caption/);
  assert.match(html, /예제/);
  assert.match(html, /hljs-keyword/);
  assert.match(html, /hljs-number/);
  assert.match(html, /href="\/posts\/other\/"/);
});
