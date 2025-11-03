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
        route: '/base/[baseId]/setting',
        pathTo: `/base/bse0/setting`,
      },
      {
        Icon: Code2,
        label: t('developer:apiQueryBuilder'),
        route: '/base/[baseId]/query-builder',
        pathTo: `/base/bse0/query-builder`,
      },
    ];
  }, [t]);
};
