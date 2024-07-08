// @ts-check

const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } = require('next/constants');
const withBundleAnalyzer = require('@next/bundle-analyzer');

// You may want to use a more robust revision to cache
// files more efficiently.
// A viable option is `git rev-parse HEAD`.
const revision = crypto.randomUUID();

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
const config = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})();

/**
 *
 * @type {(phase: string, defaultConfig: import("next").NextConfig) => Promise<import("next").NextConfig>}
 */
module.exports = async (phase, defaultConfig) => {
  const { computeEnv } = await import('./scripts/utils/computeEnv.js');
  const { BUILD_DIR } = await import('./scripts/dirs.js');

  /** @type {import('next').NextConfig} */
  const staticConfig = {
    output: 'export',
    distDir: `./${BUILD_DIR}/${process.env.NEXT_PUBLIC_MOBILE ? 'mobile/' : ''}`,
  };

  /** @type {import('next').NextConfig} */
  const nextConfig = {
    ...(isDevelopment ? {} : staticConfig),
    poweredByHeader: false,
    ...config,
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

  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    const withSerwist = (await import('@serwist/next')).default({
      cacheOnNavigation: true,
      swSrc: 'src/sw.ts',
      swDest: 'public/sw.js',
      additionalPrecacheEntries: [{ url: '/~offline', revision }],
    });
    return withSerwist(nextConfig);
  }

  return nextConfig;
};
