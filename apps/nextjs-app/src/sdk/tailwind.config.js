const { join } = require('path');
const uiConfig = require('@teable/ui-lib/ui.config.js');
const sdkPath = join(__dirname, './**/*.{js,ts,jsx,tsx}');

/** @type {import('tailwindcss').Config} */
module.exports = uiConfig({
  content: [sdkPath],
  darkMode: ['class'],
  theme: {
    extend: {
      keyframes: {
        scale: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.8)' },
        },
      },
    },
  },
  plugins: [],
});
