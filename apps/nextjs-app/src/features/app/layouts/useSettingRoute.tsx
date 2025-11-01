import { Key } from '@teable/icons';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';

export const useSettingRoute = () => {
  const { t } = useTranslation(['setting', 'common']);

  return useMemo(() => {
    return [
      {
        Icon: Key,
        label: t('personalAccessToken'),
        route: '/setting/personal-access-token',
        pathTo: '/setting/personal-access-token',
      },
    ];
  }, [t]);
};
