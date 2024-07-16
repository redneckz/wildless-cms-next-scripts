module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-url': {},
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
  },
};
