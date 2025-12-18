import type { ReactElement } from 'react';
import React from 'react';
import { UsersPage } from '@/features/app/blocks/setting/users/UsersPage';
import { SettingLayout } from '@/features/app/layouts/SettingLayout';
import type { NextPageWithLayout } from '@/lib/type';

const UsersSettingsPage: NextPageWithLayout = () => {
  return <UsersPage />;
};

UsersSettingsPage.getLayout = function getLayout(page: ReactElement, pageProps) {
  return <SettingLayout {...pageProps}>{page}</SettingLayout>;
};

export default UsersSettingsPage;
