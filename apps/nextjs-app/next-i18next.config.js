const defaultLocale = 'en';
const debugI18n = ['true', 1].includes(process?.env?.NEXTJS_DEBUG_I18N ?? 'false');
const path = require('path');
const localePublicFolder = undefined;

const localPaths = [path.join(__dirname, 'src/lib/i18n/locales'), process.env.I18N_LOCALES_PATH];

function getLocalPath() {
  if (typeof window === 'undefined') {
    const fs = require('node:fs');
    return localPaths.find((str) => {
      return fs.existsSync(str);
    });
  }

  return localePublicFolder;
}

const localePath = getLocalPath();

/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  i18n: {
    defaultLocale,
    locales: ['en', 'it', 'zh', 'fr', 'ja', 'ru', 'de', 'uk', 'tr', 'es'],
  },
  saveMissing: false,
  strictMode: true,
  serializeConfig: false,
  reloadOnPrerender: process?.env?.NODE_ENV === 'development',
  react: {
    useSuspense: false,
  },
  debug: debugI18n,
  /*
  interpolation: {
    escapeValue: false,
  },
  */
  localePath,
};
