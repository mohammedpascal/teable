import type { DehydratedState } from '@tanstack/react-query';
import type { ITableVo } from '@teable/openapi';
import { useParams, Outlet } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import React, { Fragment } from 'react';
import { AppLayout } from '@/features/app/layouts';
import { NotificationProvider, SessionProvider } from '@/sdk';
import type { IUser } from '@/sdk';
import { AnchorContext, AppProvider, TableProvider } from '@/sdk/context';
import { BaseSideBar } from '../blocks/base/base-side-bar/BaseSideBar';
import { BaseSidebarHeaderLeft } from '../blocks/base/base-side-bar/BaseSidebarHeaderLeft';
import { Sidebar } from '../components/sidebar/Sidebar';
import { SidebarContent } from '../components/sidebar/SidebarContent';
import { SideBarFooter } from '../components/SideBarFooter';
import { SidebarProvider } from '../contexts/SidebarContext';
import { useSdkLocale } from '../hooks/useSdkLocale';

export const BaseLayout: React.FC<{
  tableServerData?: ITableVo[];
  dehydratedState?: DehydratedState;
  user?: IUser;
}> = ({ tableServerData, user, dehydratedState }) => {
  const params = useParams({ strict: false });
  const { tableId, viewId } = params as { tableId?: string; viewId?: string };
  const sdkLocale = useSdkLocale();
  const { i18n } = useTranslation();

  const navigationRoutes: any[] = [];

  return (
    <AppLayout>
      <AppProvider lang={i18n.language} locale={sdkLocale} dehydratedState={dehydratedState}>
        <SessionProvider user={user}>
          <NotificationProvider>
            <AnchorContext.Provider
              value={{
                tableId: tableId as string,
                viewId: viewId as string,
              }}
            >
              <TableProvider serverData={tableServerData}>
                <SidebarProvider>
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
                      <div className="min-w-80 flex-1">
                        <Outlet />
                      </div>
                    </div>
                  </div>
                </SidebarProvider>
              </TableProvider>
            </AnchorContext.Provider>
          </NotificationProvider>
        </SessionProvider>
      </AppProvider>
    </AppLayout>
  );
};
