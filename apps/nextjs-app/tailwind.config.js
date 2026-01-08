import path from 'path';

import { fileURLToPath } from 'url';
import uiConfig from './src/ui-lib/ui.config.js';
import scrollbarPlugin from 'tailwind-scrollbar';
import containerQueries from '@tailwindcss/container-queries';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const filePath = path.join(dirname, './src/**/*.{js,ts,jsx,tsx}');
const sdkPath = path.join(dirname, './src/sdk/**/*.{js,ts,jsx,tsx}');
const uiLibPath = path.join(dirname, './src/ui-lib/**/*.{js,ts,jsx,tsx}');

/** @type {import('tailwindcss').Config} */
export default uiConfig({
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
    containerQueries,
  ],
});
