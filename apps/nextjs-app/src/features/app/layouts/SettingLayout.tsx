import type { DriverClient } from '@teable/core';
import type { IUser } from '@/sdk';
import { AppProvider, SessionProvider } from '@/sdk';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { AppLayout } from '@/features/app/layouts';
import { SidebarProvider } from '../contexts/SidebarContext';
import { Sidebar } from '../components/sidebar/Sidebar';
import { SidebarContent } from '../components/sidebar/SidebarContent';
import { SidebarHeaderLeft } from '../components/sidebar/SidebarHeaderLeft';
import { useSdkLocale } from '../hooks/useSdkLocale';
import { useSettingRoute } from './useSettingRoute';

export const SettingLayout: React.FC<{
  children: React.ReactNode;
  user?: IUser;
  driver?: DriverClient;
  dehydratedState?: unknown;
}> = ({ children, user, dehydratedState }) => {
  const navigate = useNavigate();
  const sdkLocale = useSdkLocale();
  const { i18n } = useTranslation();
  const { t } = useTranslation(['setting', 'common']);

  const routes = useSettingRoute();

  const onBack = () => {
    navigate({ to: '/' });
  };

  return (
    <AppLayout>
      <AppProvider lang={i18n.language} locale={sdkLocale} dehydratedState={dehydratedState}>
        <SessionProvider user={user}>
          <SidebarProvider>
            <div id="portal" className="relative flex h-screen w-full items-start">
              <Sidebar
                headerLeft={<SidebarHeaderLeft title={t('common:settings.title')} onBack={onBack} />}
              >
                <SidebarContent routes={routes} />
              </Sidebar>
              {children}
            </div>
          </SidebarProvider>
        </SessionProvider>
      </AppProvider>
    </AppLayout>
  );
};
