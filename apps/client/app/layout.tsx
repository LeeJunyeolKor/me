import './globals.css';
import type { Metadata } from 'next';
import { googleSiteVerification, ogImage, siteName, siteUrl } from '@/lib/site';

const description = '개발, 맛집, 일상을 기록하는 이준열의 블로그입니다.';

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s — ${siteName}`,
  },
  description,
  authors: [{ name: 'Junyeol Lee', url: 'https://github.com/LeeJunyeolKor' }],
  creator: 'Junyeol Lee',
  metadataBase: new URL(siteUrl + '/'),
  alternates: { canonical: './' },
  openGraph: {
    title: siteName,
    description,
    type: 'website',
    locale: 'ko_KR',
    siteName,
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description,
    images: [ogImage],
  },
  ...(googleSiteVerification ? { verification: { google: googleSiteVerification } } : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ko'>
      <body>{children}</body>
    </html>
  );
}
