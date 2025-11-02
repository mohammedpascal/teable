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
        route: '/settings/access-tokens',
        pathTo: '/settings/access-tokens',
      },
      {
        Icon: Code2,
        label: t('developer:apiQueryBuilder'),
        route: '/settings/query-builder',
        pathTo: '/settings/query-builder',
      },
      {
        Icon: Settings,
        label: t('settings.title1'),
        route: '/settings',
        pathTo: '/settings',
      },
    ];
  }, [t, baseId]);
};
