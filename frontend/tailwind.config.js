/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050c1f',
          900: '#0a1631',
          800: '#0f2044',
          700: '#152c5c',
          600: '#1c3a78',
          500: '#254a99',
        },
        accent: {
          500: '#3b82f6',
          400: '#60a5fa',
          300: '#93c5fd',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
