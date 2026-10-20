import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArticleMarkdown } from '@/components/article-markdown';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getAdjacentPosts, getAllPosts, getPostBySlug } from '@/lib/posts';
import { ogImage, siteUrl } from '@/lib/site';
import { tableOfContents } from '@/lib/toc';

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  const posts = getAllPosts();
  // Next.js 15 static export requires a nonempty parameter list. This missing slug renders notFound().
  return posts.length ? posts.map((post) => ({ slug: post.slug })) : [{ slug: '__empty__' }];
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = getPostBySlug((await params).slug);

  if (!post) {
    return {
      title: '글을 찾을 수 없습니다 | JY / LOG',
    };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${siteUrl}/posts/${post.slug}/`,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      url: `${siteUrl}/posts/${post.slug}/`,
      tags: [...post.tags],
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug((await params).slug);

  if (!post) {
    notFound();
  }

  const { previous, next } = getAdjacentPosts(post.slug);
  const toc = tableOfContents(post.body);

  return (
    <div className='article-page'>
      <SiteHeader />

      <main className='article-main' id='main-content'>
        <article className='article-shell'>
          <header className='article-hero'>
            <Link className='article-hero__back' href='/#writing'>
              <span aria-hidden='true'>←</span> 글 목록
            </Link>

            <div className='article-hero__meta'>
              <span className='article-hero__category'>{post.category}</span>
              <span aria-hidden='true'>/</span>
              <time dateTime={post.publishedAt}>{post.publishedLabel}</time>
              <span aria-hidden='true'>/</span>
              <span>{post.readingTime} 읽기</span>
            </div>

            <h1 className='article-hero__title'>{post.title}</h1>
            <p className='article-hero__description'>{post.description}</p>
          </header>

          <div className='article-body'>
            <aside className='article-toc' aria-labelledby='article-toc-title'>
              <p className='article-toc__title' id='article-toc-title'>
                목차
              </p>
              <ol className='article-toc__list'>
                {toc.map((section, index) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>
                      <span aria-hidden='true'>{String(index + 1).padStart(2, '0')}</span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </aside>

            <div className='article-content'>
              <ArticleMarkdown markdown={post.body} toc={toc} />
            </div>
          </div>

          <nav className='article-pagination' aria-label='다른 글'>
            {previous ? (
              <Link
                className='article-pagination__link article-pagination__link--previous'
                href={`/posts/${previous.slug}/`}>
                <span className='article-pagination__label'>이전 글</span>
                <strong>{previous.title}</strong>
              </Link>
            ) : (
              <span className='article-pagination__spacer' />
            )}

            {next ? (
              <Link className='article-pagination__link article-pagination__link--next' href={`/posts/${next.slug}/`}>
                <span className='article-pagination__label'>다음 글</span>
                <strong>{next.title}</strong>
              </Link>
            ) : (
              <span className='article-pagination__spacer' />
            )}
          </nav>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
