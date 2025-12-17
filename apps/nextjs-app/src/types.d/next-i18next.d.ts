/**
 * Types augmentation for translation keys to allow to typecheck
 * and suggesting keys to the t function. In case it's too slow
 * you can opt out by commenting the following code.
 * @link https://react.i18next.com/latest/typescript
 */
import 'next-i18next';
import type { I18nNamespaces } from '@/lib/i18n/I18nNamespaces';

declare module 'next-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: I18nNamespaces;
  }
}
