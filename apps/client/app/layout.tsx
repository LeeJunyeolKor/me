import './globals.css';
import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: {
    default: 'JY / LOG',
    template: '%s — JY / LOG',
  },
  description: '이준열의 소개, 노트, 그리고 프론트엔드 개발 기록을 담은 블로그입니다.',
  authors: [{ name: 'Junyeol Lee', url: 'https://github.com/LeeJunyeolKor' }],
  creator: 'Junyeol Lee',
  metadataBase: new URL(siteUrl + '/'),
  alternates: { canonical: './' },
  openGraph: {
    title: 'JY / LOG',
    description: '프론트엔드, 제품, AI와 함께 일하는 방식에 대한 기록',
    type: 'website',
    locale: 'ko_KR',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ko'>
      <body>{children}</body>
    </html>
  );
}
