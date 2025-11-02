import type { DehydratedState } from '@tanstack/react-query';
import { Code2, Key, Settings } from '@teable/icons';
import type { ITableVo } from '@teable/openapi';
import { NotificationProvider, SessionProvider } from '@teable/sdk';
import type { IUser } from '@teable/sdk';
import { AnchorContext, AppProvider, BaseProvider, TableProvider } from '@teable/sdk/context';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React, { Fragment, useMemo } from 'react';
import { AppLayout } from '@/features/app/layouts';
import { BaseSideBar } from '../blocks/base/base-side-bar/BaseSideBar';
import { BaseSidebarHeaderLeft } from '../blocks/base/base-side-bar/BaseSidebarHeaderLeft';
import { BasePermissionListener } from '../blocks/base/BasePermissionListener';
import { Sidebar } from '../components/sidebar/Sidebar';
import { SidebarContent } from '../components/sidebar/SidebarContent';
import { SideBarFooter } from '../components/SideBarFooter';
import { useSdkLocale } from '../hooks/useSdkLocale';

export const BaseLayout: React.FC<{
  children: React.ReactNode;
  tableServerData: ITableVo[];
  dehydratedState?: DehydratedState;
  user?: IUser;
}> = ({ children, tableServerData, user, dehydratedState }) => {
  const router = useRouter();
  const { baseId, tableId, viewId } = router.query;
  const sdkLocale = useSdkLocale();
  const { i18n } = useTranslation();

  const navigationRoutes = useMemo(() => {
    if (!baseId) return [];

    const designPath = tableId
      ? `/base/${baseId}/design?tableId=${tableId}`
      : `/base/${baseId}/design`;

    return [
      {
        Icon: Settings,
        label: 'Design' as React.ReactNode,
        route: '/base/[baseId]/design',
        pathTo: designPath,
      },
      {
        Icon: Key,
        label: 'Access Tokens' as React.ReactNode,
        route: '/base/[baseId]/setting',
        pathTo: `/base/${baseId}/setting`,
      },
      {
        Icon: Code2,
        label: 'API' as React.ReactNode,
        route: '/base/[baseId]/query-builder',
        pathTo: `/base/${baseId}/query-builder`,
      },
    ];
  }, [baseId, tableId]);

  return (
    <AppLayout>
      <AppProvider lang={i18n.language} locale={sdkLocale} dehydratedState={dehydratedState}>
        <SessionProvider user={user}>
          <NotificationProvider>
            <AnchorContext.Provider
              value={{
                baseId: baseId as string,
                tableId: tableId as string,
                viewId: viewId as string,
              }}
            >
              <BaseProvider>
                <BasePermissionListener />
                <TableProvider serverData={tableServerData}>
                  <div
                    id="portal"
                    className="relative flex h-screen w-full items-start"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <div className="flex h-screen w-full">
                      <Sidebar headerLeft={<BaseSidebarHeaderLeft />}>
                        <Fragment>
                          <div className="flex flex-col gap-2 divide-y divide-solid overflow-auto py-2">
                            <BaseSideBar />
                          </div>
                          <div className="grow basis-0" />
                          {navigationRoutes.length > 0 && (
                            <SidebarContent routes={navigationRoutes} />
                          )}
                          <SideBarFooter />
                        </Fragment>
                      </Sidebar>
                      <div className="min-w-80 flex-1">{children}</div>
                    </div>
                  </div>
                </TableProvider>
              </BaseProvider>
            </AnchorContext.Provider>
          </NotificationProvider>
        </SessionProvider>
      </AppProvider>
    </AppLayout>
  );
};
