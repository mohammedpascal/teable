import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import { BaseSettingsPage } from '@/features/app/blocks/setting/BaseSettingsPage';
import { SettingLayout } from '@/features/app/layouts/SettingLayout';
import ensureLogin from '@/lib/ensureLogin';
import { getTranslationsProps } from '@/lib/i18n';
import type { NextPageWithLayout } from '@/lib/type';
import withEnv from '@/lib/withEnv';

const Settings: NextPageWithLayout = () => {
  return <BaseSettingsPage />;
};

export const getServerSideProps: GetServerSideProps = withEnv(
  ensureLogin(async (context) => {
    return {
      props: {
        ...(await getTranslationsProps(context, ['common', 'setting', 'developer'])),
      },
    };
  })
);

Settings.getLayout = function getLayout(page: ReactElement, pageProps) {
  return <SettingLayout {...pageProps}>{page}</SettingLayout>;
};

export default Settings;

