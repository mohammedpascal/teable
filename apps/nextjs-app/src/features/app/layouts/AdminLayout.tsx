import type { DehydratedState } from '@tanstack/react-query';
import { Admin, Settings } from '@teable/icons';
import { SessionProvider } from '@teable/sdk';
import type { IUser } from '@teable/sdk';
import { AppProvider } from '@teable/sdk/context';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { AppLayout } from '@/features/app/layouts';
import { Sidebar } from '../components/sidebar/Sidebar';
import { SidebarContent } from '../components/sidebar/SidebarContent';
import { SidebarHeaderLeft } from '../components/sidebar/SidebarHeaderLeft';
import { useSdkLocale } from '../hooks/useSdkLocale';
import { useBase } from '@teable/sdk/hooks';

export const AdminLayout: React.FC<{
  children: React.ReactNode;
  user?: IUser;
  dehydratedState?: DehydratedState;
}> = ({ children, user, dehydratedState }) => {
  const sdkLocale = useSdkLocale();
  const { i18n } = useTranslation();
  const { t } = useTranslation(['common']);
  const router = useRouter();

  const base = useBase();

  const onBack = () => {
    if (base?.id) {
      router.push({ pathname: `/base/${base.id}` });
    } else {
      router.push({ pathname: '/' });
    }
  };

  const routes = [
    {
      Icon: Settings,
      label: t('settings.title'),
      route: '/admin/setting',
      pathTo: '/admin/setting',
    },
  ];

  return (
    <AppLayout>
      <Head>
        <title>{t('noun.adminPanel')}</title>
      </Head>
      <AppProvider locale={sdkLocale} lang={i18n.language} dehydratedState={dehydratedState}>
        <SessionProvider user={user}>
          <div id="portal" className="relative flex h-screen w-full items-start">
            <Sidebar
              headerLeft={
                <SidebarHeaderLeft
                  title={t('noun.adminPanel')}
                  icon={<Admin className="size-5 shrink-0" />}
                  onBack={onBack}
                />
              }
            >
              <SidebarContent routes={routes} />
            </Sidebar>
            {children}
          </div>
        </SessionProvider>
      </AppProvider>
    </AppLayout>
  );
};
