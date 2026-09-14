import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { siteUrl } from '@/lib/site';
export const metadata: Metadata = { title: '소개', alternates: { canonical: siteUrl + '/about/' } };
export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main id='main-content' className='about shell editorial-grid'>
        <div className='rail'>소개</div>
        <div>
          <h1>이준열</h1>
          <p>프론트엔드 엔지니어입니다.</p>
          <p>개발하며 배운 내용과 문제를 해결한 과정을 정리합니다. 프론트엔드, 브라우저, AI 개발에 관심이 있습니다.</p>
          <a href='https://github.com/LeeJunyeolKor'>GitHub</a>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
