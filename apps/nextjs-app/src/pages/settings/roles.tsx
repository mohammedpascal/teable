import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import React from 'react';
import { RolesPage } from '@/features/app/blocks/setting/roles/RolesPage';
import { SettingLayout } from '@/features/app/layouts/SettingLayout';
import { baseConfig } from '@/features/i18n/base.config';
import ensureLogin from '@/lib/ensureLogin';
import { getTranslationsProps } from '@/lib/i18n';
import type { NextPageWithLayout } from '@/lib/type';
import withAuthSSR from '@/lib/withAuthSSR';
import withEnv from '@/lib/withEnv';

const RolesSettingsPage: NextPageWithLayout = () => {
  return <RolesPage />;
};

export const getServerSideProps: GetServerSideProps = withEnv(
  ensureLogin(
    withAuthSSR(async (context, ssrApi) => {
      const userMe = await ssrApi.getUserMe();

      if (!userMe?.isAdmin) {
        return {
          redirect: {
            destination: '/403',
            permanent: false,
          },
        };
      }

      return {
        props: {
          ...(await getTranslationsProps(context, baseConfig.i18nNamespaces)),
        },
      };
    })
  )
);

RolesSettingsPage.getLayout = function getLayout(page: ReactElement, pageProps) {
  return <SettingLayout {...pageProps}>{page}</SettingLayout>;
};

export default RolesSettingsPage;

