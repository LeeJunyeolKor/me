import Link from 'next/link';
import { basePath } from '@/lib/site';
export function SiteHeader() {
  return (
    <>
      <a className='skip-link' href='#main-content'>
        본문으로 이동
      </a>
      <header className='site-header shell'>
        <Link className='wordmark' href='/'>
          JY <span>/ LOG</span>
        </Link>
        <nav aria-label='주요 메뉴'>
          <Link href='/#writing'>글</Link>
          <Link href='/about'>소개</Link>
          <a href={basePath + '/feed.xml'}>RSS</a>
        </nav>
      </header>
    </>
  );
}
