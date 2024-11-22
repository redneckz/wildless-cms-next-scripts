// @ts-check
const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } = require('next/constants');
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

/**
 *
 * @type {(phase: string, defaultConfig: import("next").NextConfig) => Promise<import("next").NextConfig>}
 */
module.exports = async (phase, config) => {
  const { computeEnv } = await import('./scripts/utils/computeEnv.js');
  const { getExtraPages } = await import('./scripts/utils/getExtraPages.js');
  const { getBasePath } = await import('@redneckz/wildless-cms-uni-blocks/lib/utils/getBasePath');
  const { FILE_STORAGE_BASE_URL, WCMS_RESOURCES_BASE_URL, BUILD_DIR } = await import(
    './scripts/utils/env.js'
  );

  const basePath = getBasePath(process.env.NEXT_PUBLIC_SITE_URL);

  /** @type {import('next').NextConfig} */
  const defaultConfig = process.env.EXPORT
    ? {
        output: 'export',
        distDir: `./${BUILD_DIR}/${process.env.NEXT_PUBLIC_MOBILE ? 'mobile/' : ''}`,
      }
    : {
        async headers() {
          const configHeaders = (await config?.headers?.()) ?? [];

          return [
            ...configHeaders,
            {
              source: '/:path*',
              headers: [
                {
                  key: 'X-Frame-Options',
                  value: 'SAMEORIGIN',
                },
              ],
            },
          ];
        },
        async rewrites() {
          const configRewrites = (await config?.rewrites?.()) ?? [];

          const combineRewrites = Array.isArray(configRewrites)
            ? [...configRewrites, ...devRewrites]
            : { ...configRewrites, beforeFiles: [...configRewrites.beforeFiles, ...devRewrites] };

          return isDevelopment ? combineRewrites : configRewrites;
        },
      };

  /** @type {import('next').NextConfig} */
  const nextConfig = withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
  })({
    poweredByHeader: false,
    basePath,
    ...defaultConfig,
    ...config,
    publicRuntimeConfig: {
      ...config?.publicRuntimeConfig,
      basePath,
    },
    env: {
      ...config?.env,
      ENV_STAND: computeEnv(),
      EXTRA_PATHS: await getExtraPages(),
      BUILD__FILE_STORAGE_BASE_URL: FILE_STORAGE_BASE_URL,
      BUILD__WCMS_RESOURCES_BASE_URL: WCMS_RESOURCES_BASE_URL,
    },
  });

  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    const withPWA = require('@ducanh2912/next-pwa').default({
      dest: 'public',
      publicExcludes: ['!**/*'],
      workboxOptions: {
        exclude: [() => true],
      },
    });

    return withPWA(nextConfig);
  }

  return nextConfig;
};
