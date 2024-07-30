// @ts-check
const withBundleAnalyzer = require('@next/bundle-analyzer');

/** @type {import('next').NextConfig} */
const config = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/**
 *
 * @type {(phase: string, defaultConfig: import("next").NextConfig) => Promise<import("next").NextConfig>}
 */
module.exports = async (phase, defaultConfig) => {
  const { BUILD_DIR } = await import('./scripts/utils/env.js');

  /** @type {import('next').NextConfig} */
  const exportConfig = process.env.EXPORT ? { distDir: `./${BUILD_DIR}`, output: 'export' } : {};

  /** @type {import('next').NextConfig} */
  const nextConfig = {
    poweredByHeader: false,
    ...exportConfig,
    ...config,
    ...defaultConfig,
  };

  return nextConfig;
};
