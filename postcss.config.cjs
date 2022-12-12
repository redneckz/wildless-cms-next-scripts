module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-url': {},
    tailwindcss: {},
    autoprefixer: {},
    cssnano: process.env.NODE_ENV === 'production' ? {} : false,
  },
};
