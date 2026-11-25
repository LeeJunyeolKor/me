import Link from 'next/link';
import { basePath } from '@/lib/site';
export function SiteFooter() {
  return (
    <footer className='site-footer shell'>
      <small>© {new Date().getFullYear()} JY / LOG</small>
      <nav aria-label='사이트 정보'>
        <Link href='/privacy/'>개인정보처리방침</Link>
        <a href={basePath + '/feed.xml'}>RSS</a>
        <a href='https://github.com/LeeJunyeolKor'>GitHub</a>
      </nav>
    </footer>
  );
}
