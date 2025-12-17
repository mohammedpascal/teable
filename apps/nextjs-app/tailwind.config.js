const { join } = require('path');
const uiConfig = require('./src/ui-lib/ui.config.js');
const filePath = join(__dirname, './src/**/*.{js,ts,jsx,tsx}');
const sdkPath = join(__dirname, './src/sdk/**/*.{js,ts,jsx,tsx}');
const uiLibPath = join(__dirname, './src/ui-lib/**/*.{js,ts,jsx,tsx}');
const scrollbarPlugin = require('tailwind-scrollbar');

/** @type {import('tailwindcss').Config} */
module.exports = uiConfig({
  content: [filePath, sdkPath, uiLibPath],
  darkMode: 'class',
  theme: {},
  plugins: [
    scrollbarPlugin({ nocompatible: true }),
    function ({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-min-thumb': {
          '&::-webkit-scrollbar-thumb': {
            minHeight: '32px',
          },
          '&::-webkit-scrollbar-thumb:vertical': {
            minHeight: '32px',
          },
        },
      };

      addUtilities(newUtilities);
    },
    require('@tailwindcss/container-queries'),
  ],
});
