const withPreact = require('next-plugin-preact');
const withPWA = require('next-pwa');
const withBundleAnalyzer = require('@next/bundle-analyzer');
const { withSentryConfig } = require('@sentry/nextjs');

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

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

module.exports = withSentryConfig(
  {
    ...nextConfig,
    sentry: {
      // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
      // for client-side builds. (This will be the default starting in
      // `@sentry/nextjs` version 8.0.0.) See
      // https://webpack.js.org/configuration/devtool/ and
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
      // for more information.
      hideSourceMaps: true,
    },
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
  },
  sentryWebpackPluginOptions,
);
