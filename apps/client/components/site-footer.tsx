import { basePath } from '@/lib/site';
export function SiteFooter() {
  return (
    <footer className='site-footer shell'>
      <small>© {new Date().getFullYear()} JY / LOG</small>
      <nav aria-label='외부 링크'>
        <a href={basePath + '/feed.xml'}>RSS</a>
        <a href='https://github.com/LeeJunyeolKor'>GitHub</a>
      </nav>
    </footer>
  );
}
