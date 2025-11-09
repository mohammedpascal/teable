import { Code2, Settings, Users } from '@teable/icons';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';

export const useSettingRoute = () => {
  const { t } = useTranslation(['setting', 'common', 'developer']);

  return useMemo(() => {
    return [
      {
        Icon: Settings,
        label: t('common:settings.general', { defaultValue: 'General' }),
        route: '/settings/general',
        pathTo: `/settings/general`,
      },
      {
        Icon: Users,
        label: t('setting:users.title', { defaultValue: 'Users' }),
        route: '/settings/users',
        pathTo: `/settings/users`,
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
