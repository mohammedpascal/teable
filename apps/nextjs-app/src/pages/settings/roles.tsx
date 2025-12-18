import type { ReactElement } from 'react';
import React from 'react';
import { RolesPage } from '@/features/app/blocks/setting/roles/RolesPage';
import { SettingLayout } from '@/features/app/layouts/SettingLayout';
import type { NextPageWithLayout } from '@/lib/type';

const RolesSettingsPage: NextPageWithLayout = () => {
  return <RolesPage />;
};

RolesSettingsPage.getLayout = function getLayout(page: ReactElement, pageProps) {
  return <SettingLayout {...pageProps}>{page}</SettingLayout>;
};

export default RolesSettingsPage;
