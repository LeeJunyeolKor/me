export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://leejunyeolkor.github.io/me').replace(/\/$/, '');

// Absolute on purpose: a relative opengraph-image URL is joined with metadataBase,
// and both already include the GitHub Pages base path.
export const ogImage = {
  url: `${siteUrl}/opengraph.png`,
  width: 1200,
  height: 630,
  alt: 'JY / LOG',
  type: 'image/png',
};
