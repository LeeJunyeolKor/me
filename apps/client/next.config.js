const { readBasePath } = require('./site-config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: readBasePath(),
  images: { unoptimized: true },
};

module.exports = nextConfig;
