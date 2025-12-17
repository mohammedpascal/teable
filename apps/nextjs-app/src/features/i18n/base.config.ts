import type { I18nActiveNamespaces } from '@/lib/i18n';

export interface IBaseConfig {
  i18nNamespaces: I18nActiveNamespaces<'common' | 'sdk' | 'table'>;
}

export const baseConfig: IBaseConfig = {
  i18nNamespaces: ['common', 'sdk', 'table'] as I18nActiveNamespaces<'common' | 'sdk' | 'table'>,
};
