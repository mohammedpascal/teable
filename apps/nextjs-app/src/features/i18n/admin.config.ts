import type { I18nActiveNamespaces } from '@/lib/i18n';

export interface IAdminConfig {
  i18nNamespaces: I18nActiveNamespaces<'common' | 'space'>;
}

export const adminConfig: IAdminConfig = {
  i18nNamespaces: ['common', 'space'],
};
