// ui.config.cjs
const path = require('path')
const deepMerge = require('deepmerge')

const shadcnuiConfigMod = require('./tailwind.shadcnui.config.js')
const shadcnuiConfig = shadcnuiConfigMod.default ?? shadcnuiConfigMod

const filePath = path.join(__dirname, './src/**/*.{js,ts,jsx,tsx}')
const buildFilePath = path.join(__dirname, './dist/**/*.{js,ts,jsx,tsx}')

/** @type {import('tailwindcss').Config} */
module.exports = {
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
}