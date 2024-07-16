// @ts-check

const withPWA = require('next-pwa');
const withBundleAnalyzer = require('@next/bundle-analyzer');

const isDevelopment = process.env.NODE_ENV === 'development';

const proxyServer = 'http://localhost:7001';

/** @type {import('next/dist/lib/load-custom-routes').Rewrite[]} */
const devRewrites = [
  {
    source: '/icons/:icon',
    destination: `${proxyServer}/icons/:icon`,
    basePath: false,
  },
  {
    source: '/wcms-resources/:item',
    destination: `${proxyServer}/wcms-resources/:item`,
    basePath: false,
  },
  {
    source: '/api/v1/:item*',
    destination: `${proxyServer}/api/v1/:item*`,
    basePath: false,
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(
  withPWA({
    disable: isDevelopment,
    dest: 'public',
    publicExcludes: ['!**/*'], // temp to disable precache
    buildExcludes: [() => true], // temp to disable precache
  }),
);

/**
 *
 * @type {(phase: string, defaultConfig: import("next").NextConfig) => Promise<import("next").NextConfig>}
 */
module.exports = async (_, defaultConfig) => {
  const { computeEnv } = await import('./scripts/utils/computeEnv.js');

  return {
    poweredByHeader: false,
    ...nextConfig,
    ...defaultConfig,
    env: {
      ...defaultConfig?.env,
      ENV_STAND: computeEnv(),
    },
    async rewrites() {
      const configRewrites = (await defaultConfig?.rewrites?.()) ?? [];

      const combineRewrites = Array.isArray(configRewrites)
        ? [...configRewrites, ...devRewrites]
        : { ...configRewrites, beforeFiles: [...configRewrites.beforeFiles, ...devRewrites] };

      return isDevelopment ? combineRewrites : configRewrites;
    },
  };
};
