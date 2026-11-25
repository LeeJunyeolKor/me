const DEFAULT_SITE_URL = 'https://leejunyeolkor.github.io/me';

/**
 * Empty string and "/" mean the site is served at the domain root.
 * A missing value keeps today's GitHub Pages project path.
 * @param {string | undefined} value
 * @returns {string}
 */
function normalizeBasePath(value) {
  if (value == null) return '/me';
  const trimmed = value.trim();
  if (trimmed === '' || trimmed === '/') return '';
  const path = (trimmed.startsWith('/') ? trimmed : `/${trimmed}`).replace(/\/+$/, '');
  if (!/^\/[A-Za-z0-9][A-Za-z0-9/_-]*$/.test(path) || path.includes('//')) {
    throw new Error(`NEXT_PUBLIC_BASE_PATH "${trimmed}" must be a path like /me, or empty for a custom domain.`);
  }
  return path;
}

/**
 * @param {string | undefined} value
 * @returns {string}
 */
function normalizeSiteUrl(value) {
  if (value == null || value.trim() === '') return DEFAULT_SITE_URL;
  const stripped = value.trim().replace(/\/+$/, '');
  let url;
  try {
    url = new URL(stripped);
  } catch {
    throw new Error(`NEXT_PUBLIC_SITE_URL "${value}" must be an absolute http(s) URL.`);
  }
  if (
    (url.protocol !== 'https:' && url.protocol !== 'http:') ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error(`NEXT_PUBLIC_SITE_URL "${value}" must be an absolute http(s) URL without a query or hash.`);
  }
  return stripped;
}

/**
 * @param {string | undefined} value
 * @returns {string | undefined}
 */
function normalizeGoogleSiteVerification(value) {
  if (value == null) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (!/^[A-Za-z0-9_-]+$/.test(trimmed)) {
    throw new Error(
      'NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION must be the verification token itself, not the full meta tag.'
    );
  }
  return trimmed;
}

/**
 * @param {Record<string, string | undefined>} [env]
 * @returns {string}
 */
function readBasePath(env = process.env) {
  return normalizeBasePath(env.NEXT_PUBLIC_BASE_PATH);
}

/**
 * @param {Record<string, string | undefined>} [env]
 * @returns {string}
 */
function readSiteUrl(env = process.env) {
  return normalizeSiteUrl(env.NEXT_PUBLIC_SITE_URL);
}

/**
 * @param {Record<string, string | undefined>} [env]
 * @returns {string | undefined}
 */
function readGoogleSiteVerification(env = process.env) {
  return normalizeGoogleSiteVerification(env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION);
}

module.exports = {
  DEFAULT_SITE_URL,
  normalizeBasePath,
  normalizeSiteUrl,
  normalizeGoogleSiteVerification,
  readBasePath,
  readSiteUrl,
  readGoogleSiteVerification,
};
