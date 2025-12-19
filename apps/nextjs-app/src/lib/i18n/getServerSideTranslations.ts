/**
 * @deprecated This function is for Next.js compatibility only.
 * TanStack Start uses client-side translation loading via `useLoadAllTranslations`.
 * This function may be removed after full migration is complete.
 * 
 * Retrieve translations on server-side, wraps next-i18next.serverSideTranslations
 * to allow further customizations.
 */
import type { SSRConfig, UserConfig } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { I18nNamespace } from '@/lib/i18n/I18nNamespace.types';

export const getServerSideTranslations = async (
  locale: string,
  namespacesRequired?: I18nNamespace[] | I18nNamespace | undefined,
  configOverride?: UserConfig | null,
  extraLocales?: string[] | false
): Promise<SSRConfig> => {
  return serverSideTranslations(locale, namespacesRequired, configOverride, extraLocales);
};
