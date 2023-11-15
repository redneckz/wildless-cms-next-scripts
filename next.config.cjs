const withPWA = require('next-pwa');
const withBundleAnalyzer = require('@next/bundle-analyzer');

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(
  withPWA({
    dest: 'public',
    publicExcludes: ['!**/*'], // temp to disable precache
    buildExcludes: [() => true], // temp to disable precache
  })(),
);

module.exports = {
  ...nextConfig,
  async rewrites() {
    return [
      {
        source: '/icons/:icon',
        destination: 'https://www.rshb.ru/icons/:icon',
      },
      {
        source: '/wcms-resources/:item',
        destination: 'https://www.rshb.ru/wcms-resources/:item',
        basePath: false,
      },
      {
        source: '/api/v1/:item*',
        destination: 'https://www.rshb.ru/api/v1/:item*',
        basePath: false,
      },
    ];
  },
};
