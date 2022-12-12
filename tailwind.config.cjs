const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./content/**/*.json', './pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Ubuntu', ...defaultTheme.fontFamily.sans],
    },
    extend: {},
  },
  plugins: [],
};
