import { Code2, Key } from '@teable/icons';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';

export const useSettingRoute = () => {
  const { t } = useTranslation(['setting', 'common', 'developer']);

  return useMemo(() => {
    return [
      {
        Icon: Key,
        label: t('personalAccessToken'),
        route: '/settings/access-tokens',
        pathTo: `/settings/access-tokens`,
      },
      {
        Icon: Code2,
        label: t('developer:apiQueryBuilder'),
        route: '/settings/query-builder',
        pathTo: `/settings/query-builder`,
      },
    ];
  }, [t]);
};
