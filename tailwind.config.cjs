const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./content/**/*.json', './pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Ubuntu', ...defaultTheme.fontFamily.sans],
    },
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }
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
