const withPreact = require('next-plugin-preact');
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
  })(
    withPreact({
      reactStrictMode: true,
    }),
  ),
);

module.exports = {
  ...nextConfig,
  async rewrites() {
    return [
      {
        source: '/icons/:icon',
        destination: 'https://redneckz.github.io/wildless-cms-uni-blocks/icons/:icon',
        basePath: false,
      },
      {
        source: '/wcms-resources/:item',
        destination: 'https://redneckz.github.io/wildless-cms-uni-blocks/wcms-resources/:item',
        basePath: false,
      },
    ];
  },
};
