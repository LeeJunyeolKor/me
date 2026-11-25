import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CategoryNav } from '@/components/category-nav';
import { PostIndex } from '@/components/post-index';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { CATEGORIES, categoryDescription, categoryLabel, isCategory } from '@/lib/categories';
import { getSearchPosts } from '@/lib/search';
import { ogImage, siteName, siteUrl } from '@/lib/site';
import { absoluteUrl } from '@/lib/urls';

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category: category.id }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  if (!isCategory(category)) return { title: '카테고리' };

  const label = categoryLabel(category);
  const description = categoryDescription(category);
  const url = absoluteUrl(siteUrl, `/category/${category}/`);
  const title = `${label} — ${siteName}`;

  return {
    title: label,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'ko_KR',
      siteName,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  if (!isCategory(category)) notFound();

  const posts = getSearchPosts().filter((post) => post.category === category);
  const label = categoryLabel(category);

  return (
    <>
      <SiteHeader />
      <main id='main-content'>
        <section className='intro shell editorial-grid'>
          <div aria-hidden='true' />
          <div>
            <h1>{label}</h1>
            <p>{categoryDescription(category)}</p>
          </div>
        </section>
        <section id='writing' className='writing shell editorial-grid' aria-labelledby='writing-title'>
          <div className='rail' aria-hidden='true'>
            글
          </div>
          <div className='writing-main'>
            <div className='writing-heading'>
              <h2 id='writing-title'>글 찾아보기</h2>
              <span>최신순</span>
            </div>
            <CategoryNav current={category} />
            <PostIndex posts={posts} category={category} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
