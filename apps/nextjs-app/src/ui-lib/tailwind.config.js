import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import deepMerge from 'deepmerge';
import shadcnuiConfig from './tailwind.shadcnui.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = join(__dirname, './src/**/*.{js,ts,jsx,tsx}');
const buildFilePath = join(__dirname, './dist/**/*.{js,ts,jsx,tsx}');

/** @type {import('tailwindcss').Config} */
export default {
  content: [filePath, buildFilePath],
  darkMode: ['class'],
  theme: deepMerge(
    {
      extend: {
        colors: {
          warning: 'hsl(var(--warning))',
          'warning-foreground': 'hsl(var(--warning-foreground))',
        },
      },
    },
    shadcnuiConfig.theme
  ),
  plugins: [...shadcnuiConfig.plugins],
};
