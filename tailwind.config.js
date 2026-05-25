/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        cosmic: {
          bg: '#0a0015',
          surface: '#160030',
          primary: '#9b59b6',
          accent: '#f1c40f',
          text: '#e8d5f5',
          muted: '#8e6aaa',
          star: '#ffe066',
          'error-bg': '#4a0000',
          'error-border': '#ff4444',
          'error-text': '#ff8080',
          'field-error': '#ff6b6b',
        },
      },
    },
  },
  plugins: [],
};
