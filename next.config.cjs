const withPreact = require('next-plugin-preact');
const withPWA = require('next-pwa');
const withBundleAnalyzer = require('@next/bundle-analyzer');

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(
  withPWA({
    dest: 'public',
  })(
    withPreact({
      reactStrictMode: true,
    }),
  ),
);

module.exports = nextConfig;
