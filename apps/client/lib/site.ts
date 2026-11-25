import { normalizeBasePath, normalizeGoogleSiteVerification, normalizeSiteUrl } from '../site-config';

// Pass the env value in directly so Next.js can inline NEXT_PUBLIC_* for client bundles.
export const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);
export const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
export const googleSiteVerification = normalizeGoogleSiteVerification(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION);

export const siteName = 'JY / LOG';
export const authorName = '이준열';
export const authorUrl = 'https://github.com/LeeJunyeolKor';

// Absolute on purpose: a relative opengraph-image URL is joined with metadataBase,
// and both already include the GitHub Pages base path.
export const ogImage = {
  url: `${siteUrl}/opengraph.png`,
  width: 1200,
  height: 630,
  alt: 'JY / LOG',
  type: 'image/png',
};
