import type { ReactElement } from 'react';
import type { ISettingPageProps } from '@/features/app/blocks/admin';
import { SettingPage } from '@/features/app/blocks/admin';
import { SettingLayout } from '@/features/app/layouts/SettingLayout';
import type { NextPageWithLayout } from '@/lib/type';

const GeneralSettingsPage: NextPageWithLayout<ISettingPageProps> = ({ settingServerData }) => (
  <SettingPage settingServerData={settingServerData} />
);

GeneralSettingsPage.getLayout = function getLayout(page: ReactElement, pageProps) {
  return <SettingLayout {...pageProps}>{page}</SettingLayout>;
};

export default GeneralSettingsPage;
