const withPWA = require('next-pwa');
const withBundleAnalyzer = require('@next/bundle-analyzer');

const isDevelopment = process.env.NODE_ENV === 'development';

const devRewrites = [
  {
    source: '/icons/:icon',
    destination: 'https://www.rshb.ru/icons/:icon',
    basePath: false,
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

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(
  withPWA({
    disable: isDevelopment,
    dest: 'public',
    publicExcludes: ['!**/*'], // temp to disable precache
    buildExcludes: [() => true], // temp to disable precache
  })(),
);

/**
 *
 * @param {import('next').NextConfig} config
 * @returns {import('next').NextConfig}
 */
module.exports = async (config) => {
  const { computeEnv } = await import('./scripts/utils/computeEnv.js');

  return {
    poweredByHeader: false,
    ...nextConfig,
    ...config,
    env: {
      ...config?.env,
      ENV_STAND: computeEnv(),
    },
    async rewrites() {
      const configRewrites = (await config?.rewrites?.()) ?? [];

      const combineRewrites = Array.isArray(configRewrites)
        ? [...configRewrites, ...devRewrites]
        : { ...configRewrites, beforeFiles: [...configRewrites.beforeFiles, ...devRewrites] };

      return isDevelopment ? combineRewrites : configRewrites;
    },
  };
};
