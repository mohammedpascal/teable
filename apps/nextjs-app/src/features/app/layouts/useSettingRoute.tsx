import { Code2, Key, Settings } from '@teable/icons';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

export const useSettingRoute = () => {
  const { t } = useTranslation(['setting', 'common', 'developer']);
  const router = useRouter();
  const baseId = router.query.baseId as string | undefined;

  return useMemo(() => {
    // Base-specific routes
    if (baseId) {
      return [
        {
          Icon: Key,
          label: t('personalAccessToken'),
          route: '/base/[baseId]/setting',
          pathTo: `/base/${baseId}/setting`,
        },
        {
          Icon: Code2,
          label: t('developer:apiQueryBuilder'),
          route: '/base/[baseId]/query-builder',
          pathTo: `/base/${baseId}/query-builder`,
        },
      ];
    }

    // Global routes
    return [
      {
        Icon: Key,
        label: t('personalAccessToken'),
        route: '/setting/personal-access-token',
        pathTo: '/setting/personal-access-token',
      },
      {
        Icon: Code2,
        label: t('developer:apiQueryBuilder'),
        route: '/developer/tool/query-builder',
        pathTo: '/developer/tool/query-builder',
      },
      {
        Icon: Settings,
        label: t('settings.title1'),
        route: '/admin/setting',
        pathTo: '/admin/setting',
      },
    ];
  }, [t, baseId]);
};
