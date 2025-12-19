import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

const defaultLocale = 'en';
const debugI18n = ['true', '1'].includes(import.meta.env.VITE_DEBUG_I18N ?? 'false');

i18n
  .use(
    resourcesToBackend((language: string, namespace: string) => {
      // Load translation files from src/lib/i18n/locales
      // Using dynamic import for Vite
      return import(`./locales/${language}/${namespace}.json`);
    })
  )
  .use(initReactI18next)
  .init({
    lng: defaultLocale,
    fallbackLng: defaultLocale,
    supportedLngs: ['en', 'it', 'zh', 'fr', 'ja', 'ru', 'de', 'uk', 'tr', 'es'],
    defaultNS: 'common',
    ns: [
      'auth',
      'common',
      'system',
      'sdk',
      'share',
      'table',
      'token',
      'setting',
      'oauth',
      'zod',
      'developer',
      'plugin',
      'dashboard',
    ],
    debug: debugI18n,
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

