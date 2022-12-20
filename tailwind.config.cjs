const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./content/**/*.json', './pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Ubuntu', ...defaultTheme.fontFamily.sans],
    },
    screens: {
      sm: { min: '640px', max: '767px' },
      // => @media (min-width: 640px and max-width: 767px) { ... }

      md: { min: '768px', max: '1023px' },
      // => @media (min-width: 768px and max-width: 1023px) { ... }

      lg: { min: '1024px', max: '1279px' },
      // => @media (min-width: 1024px and max-width: 1279px) { ... }

      xl: { min: '1280px', max: '1535px' },
      // => @media (min-width: 1280px and max-width: 1535px) { ... }
    },
    container: {
      center: true,
    },
    data: {
      primary: 'ver="primary"',
      secondary: 'ver="secondary"',
      gray: 'ver="gray"',
      transparent: 'ver="transparent"',
    },
    extend: {},
  },
  plugins: [],
};
