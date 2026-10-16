/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{tsx,ts,js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f97316', // orange-500
          dark: '#c2410c'
        },
        slate: {
          900: '#0f172a'
        },
        zinc: {
          800: '#27272a'
        }
      }
    }
  },
  plugins: []
};
