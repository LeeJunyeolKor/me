import Link from 'next/link';

import { CATEGORIES, type Category } from '@/lib/categories';

export function CategoryNav({ current }: { current?: Category }) {
  return (
    <nav className='category-nav' aria-label='카테고리'>
      <Link href='/#writing' aria-current={current ? undefined : 'page'}>
        전체
      </Link>
      {CATEGORIES.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.id}/`}
          aria-current={current === category.id ? 'page' : undefined}>
          {category.label}
        </Link>
      ))}
    </nav>
  );
}
