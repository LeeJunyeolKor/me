import { categoryLabel } from './categories';
import type { Post } from './post-source';
import type { HoursSpan, Restaurant } from './restaurant';
import { authorName, authorUrl } from './site';
import { absoluteUrl } from './urls';

export type JsonLdNode = Record<string, unknown>;

export type PostJsonLd = {
  '@context': 'https://schema.org';
  '@graph': JsonLdNode[];
};

export function postJsonLd(post: Post, siteUrl: string): PostJsonLd {
  const url = absoluteUrl(siteUrl, `/posts/${post.slug}/`);
  const graph: JsonLdNode[] = [blogPosting(post, siteUrl, url)];
  if (post.category === 'food' && post.restaurant) graph.push(review(post, post.restaurant, url));
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function jsonLdScript(data: PostJsonLd): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function blogPosting(post: Post, siteUrl: string, url: string): JsonLdNode {
  return defined({
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    inLanguage: 'ko',
    articleSection: categoryLabel(post.category),
    keywords: post.tags.length ? post.tags.join(', ') : undefined,
    url,
    mainEntityOfPage: url,
    image: {
      '@type': 'ImageObject',
      url: absoluteUrl(siteUrl, '/opengraph.png'),
      width: 1200,
      height: 630,
    },
    author: person(),
  });
}

function review(post: Post, restaurant: Restaurant, url: string): JsonLdNode {
  return defined({
    '@type': 'Review',
    url,
    inLanguage: 'ko',
    datePublished: post.publishedAt,
    reviewBody: post.description,
    author: person(),
    reviewRating: {
      '@type': 'Rating',
      ratingValue: restaurant.rating,
      bestRating: 5,
      worstRating: 1,
    },
    itemReviewed: restaurantNode(restaurant),
  });
}

function restaurantNode(restaurant: Restaurant): JsonLdNode {
  const structured = Array.isArray(restaurant.hours) ? restaurant.hours : undefined;
  return defined({
    '@type': 'Restaurant',
    name: restaurant.name,
    servesCuisine: restaurant.servesCuisine,
    priceRange: restaurant.priceRange,
    address: defined({
      '@type': 'PostalAddress',
      addressCountry: 'KR',
      addressLocality: restaurant.area,
      streetAddress: restaurant.address,
    }),
    hasMap: restaurant.mapUrl,
    openingHours: structured?.map((span) => span.openingHours),
    openingHoursSpecification: structured?.map(openingHoursSpecification),
  });
}

function openingHoursSpecification(span: HoursSpan): JsonLdNode {
  return {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [...span.dayOfWeek],
    opens: span.opens,
    closes: span.closes,
  };
}

function person(): JsonLdNode {
  return { '@type': 'Person', name: authorName, url: authorUrl };
}

function defined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as T;
}
