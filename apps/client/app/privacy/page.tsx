import type { Metadata } from 'next';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { ogImage, siteName, siteUrl } from '@/lib/site';
import { absoluteUrl } from '@/lib/urls';

const description = '이 블로그의 개인정보 처리에 대한 안내입니다.';
const url = absoluteUrl(siteUrl, '/privacy/');

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description,
  alternates: { canonical: url },
  openGraph: {
    title: `개인정보처리방침 — ${siteName}`,
    description,
    url,
    type: 'website',
    locale: 'ko_KR',
    siteName,
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: `개인정보처리방침 — ${siteName}`,
    description,
    images: [ogImage],
  },
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main id='main-content' className='about shell editorial-grid'>
        <div className='rail'>안내</div>
        <div>
          <h1>개인정보처리방침</h1>
          <p>시행일: 2026년 11월 25일</p>
          <p>
            이 블로그는 정적 페이지로 제공됩니다. 회원 가입, 댓글, 문의 폼을 두지 않으며, 글 작성자가 이 사이트를 통해
            이름, 이메일, 전화번호를 수집하지 않습니다.
          </p>
          <p>접속 기록은 이 사이트에 따로 저장하지 않습니다. 호스팅은 GitHub Pages가 제공합니다.</p>
          <p>
            나중에 Google AdSense를 켜면 광고 표시와 측정을 위해 Google이 쿠키를 사용할 수 있습니다. 광고를 켜기 전에 이
            문서를 그 내용에 맞게 고칩니다.
          </p>
          <p>
            문의는 <a href='https://github.com/LeeJunyeolKor'>GitHub</a>로 보내 주세요.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
