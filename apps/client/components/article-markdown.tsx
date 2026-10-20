import type { ComponentProps, ReactNode } from 'react';
import Markdown, { type Components, type ExtraProps, type Options } from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

import { fenceLanguage } from '@/lib/code-caption';
import { remarkFenceCaption } from '@/lib/fence-caption';
import { ensureTrailingSlash } from '@/lib/links';
import { basePath } from '@/lib/site';
import type { TocItem } from '@/lib/toc';

const highlightOptions = {
  aliases: {
    typescript: ['ts', 'tsx'],
    javascript: ['js', 'jsx', 'mjs', 'cjs'],
    bash: ['sh', 'shell', 'zsh'],
    yaml: ['yml'],
    markdown: ['md', 'mdx'],
    xml: ['html'],
  },
  plainText: ['text', 'txt', 'plaintext'],
};

type MarkdownProps<Tag extends keyof JSX.IntrinsicElements> = ComponentProps<Tag> & ExtraProps;

function ArticleH1({ children }: MarkdownProps<'h1'>) {
  return <h1 className='article-content__heading'>{children}</h1>;
}

function ArticleH3({ children }: MarkdownProps<'h3'>) {
  return <h3 className='article-content__subheading'>{children}</h3>;
}

function ArticleParagraph({ children }: MarkdownProps<'p'>) {
  return <p className='article-content__paragraph'>{children}</p>;
}

function ArticleList({ children }: MarkdownProps<'ul'>) {
  return <ul className='article-content__list'>{children}</ul>;
}

function ArticleOrderedList({ children }: MarkdownProps<'ol'>) {
  return <ol className='article-content__list article-content__list--ordered'>{children}</ol>;
}

function ArticleQuote({ children }: MarkdownProps<'blockquote'>) {
  return <blockquote className='article-content__quote'>{children}</blockquote>;
}

function ArticleAnchor({ href, children }: MarkdownProps<'a'>) {
  if (!href || href.startsWith('#') || !href.startsWith('/') || href.startsWith('//')) {
    return <a href={href}>{children}</a>;
  }

  const prefix = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  return <a href={`${prefix}${ensureTrailingSlash(href)}`}>{children}</a>;
}

function codeProperties(children: ReactNode): { className?: string; caption?: string } {
  const nodes = Array.isArray(children) ? children : [children];
  for (const node of nodes) {
    if (!node || typeof node !== 'object' || !('props' in node)) continue;
    const props = node.props as {
      className?: string;
      'data-caption'?: string;
      dataCaption?: string;
    };
    return {
      className: props.className,
      caption: props['data-caption'] || props.dataCaption,
    };
  }
  return {};
}

function ArticlePre({ children }: MarkdownProps<'pre'>) {
  const { className, caption } = codeProperties(children);
  const language = fenceLanguage(className);

  return (
    <figure className='article-code'>
      <div className='article-code__bar' aria-hidden='true'>
        <span />
        <span />
        <span />
        {language ? <small>{language}</small> : null}
      </div>
      <pre className='article-code__pre'>{children}</pre>
      {caption ? <figcaption className='article-code__caption'>{caption}</figcaption> : null}
    </figure>
  );
}

export function ArticleMarkdown({ markdown, toc }: { markdown: string; toc: readonly TocItem[] }) {
  let headingIndex = 0;
  const components: Components = {
    h1: ArticleH1,
    h2: ({ children }: MarkdownProps<'h2'>) => {
      const id = toc[headingIndex]?.id;
      headingIndex += 1;
      return (
        <h2 className='article-content__heading' id={id}>
          {children}
        </h2>
      );
    },
    h3: ArticleH3,
    p: ArticleParagraph,
    ul: ArticleList,
    ol: ArticleOrderedList,
    blockquote: ArticleQuote,
    a: ArticleAnchor,
    pre: ArticlePre,
  };

  return (
    <Markdown
      components={components}
      remarkPlugins={[remarkFenceCaption] as Options['remarkPlugins']}
      rehypePlugins={[[rehypeHighlight, highlightOptions]] as Options['rehypePlugins']}>
      {markdown}
    </Markdown>
  );
}
