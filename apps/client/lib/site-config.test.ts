import assert from 'node:assert/strict';
import test from 'node:test';

import {
  normalizeBasePath,
  normalizeGoogleSiteVerification,
  normalizeSiteUrl,
  readBasePath,
  readSiteUrl,
} from '../site-config.js';

test('base path defaults to /me and treats an empty value as the domain root', () => {
  assert.equal(normalizeBasePath(undefined), '/me');
  assert.equal(readBasePath({}), '/me');
  assert.equal(normalizeBasePath(''), '');
  assert.equal(normalizeBasePath('/'), '');
  assert.equal(normalizeBasePath('/me'), '/me');
  assert.equal(normalizeBasePath('me/'), '/me');
  assert.equal(readBasePath({ NEXT_PUBLIC_BASE_PATH: '' }), '');
  assert.throws(() => normalizeBasePath('https://example.com'), /NEXT_PUBLIC_BASE_PATH/);
});

test('site URL defaults to the GitHub Pages project URL and drops a trailing slash', () => {
  assert.equal(normalizeSiteUrl(undefined), 'https://leejunyeolkor.github.io/me');
  assert.equal(readSiteUrl({}), 'https://leejunyeolkor.github.io/me');
  assert.equal(normalizeSiteUrl('https://example.com/'), 'https://example.com');
  assert.equal(normalizeSiteUrl(''), 'https://leejunyeolkor.github.io/me');
  assert.throws(() => normalizeSiteUrl('example.com'), /NEXT_PUBLIC_SITE_URL/);
});

test('Google site verification is omitted until a token is set', () => {
  assert.equal(normalizeGoogleSiteVerification(undefined), undefined);
  assert.equal(normalizeGoogleSiteVerification('  '), undefined);
  assert.equal(normalizeGoogleSiteVerification('abc_123-XYZ'), 'abc_123-XYZ');
  assert.throws(() => normalizeGoogleSiteVerification('<meta name="google-site-verification"'), /token/);
});
