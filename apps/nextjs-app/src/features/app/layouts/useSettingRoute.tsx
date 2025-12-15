import { Code2, Settings, ShieldCheck, Table2, Users } from '@teable/icons';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';

export const useSettingRoute = () => {
  const { t } = useTranslation(['setting', 'common', 'developer', 'table']);

  return useMemo(() => {
    return [
      {
        Icon: Settings,
        label: t('common:settings.general', { defaultValue: 'General' }),
        route: '/settings/general',
        pathTo: `/settings/general`,
      },
      {
        Icon: Table2,
        label: t('table:table.tables', { defaultValue: 'Tables' }),
        route: '/settings/design',
        pathTo: `/settings/design`,
      },
      {
        Icon: Users,
        label: t('setting:users.title', { defaultValue: 'Users' }),
        route: '/settings/users',
        pathTo: `/settings/users`,
      },
      {
        Icon: ShieldCheck,
        label: t('setting:roles.title', { defaultValue: 'Roles' }),
        route: '/settings/roles',
        pathTo: `/settings/roles`,
      },
      {
        Icon: Code2,
        label: t('developer:apiQueryBuilder', { defaultValue: 'API Query Builder' }),
        route: '/settings/query-builder',
        pathTo: `/settings/query-builder`,
      },
    ];
  }, [t]);
};
