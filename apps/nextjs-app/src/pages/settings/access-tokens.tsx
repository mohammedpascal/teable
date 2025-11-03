import type { ReactElement } from 'react';
import { PersonAccessTokenPage } from '@/features/app/blocks/setting/access-token/PersonAccessTokenPage';
import { SettingLayout } from '@/features/app/layouts/SettingLayout';
import { personalAccessTokenConfig } from '@/features/i18n/personal-access-token.config';
import ensureLogin from '@/lib/ensureLogin';
import { getTranslationsProps } from '@/lib/i18n';
import type { NextPageWithLayout } from '@/lib/type';
import withAuthSSR from '@/lib/withAuthSSR';
import withEnv from '@/lib/withEnv';

const PersonalAccessToken: NextPageWithLayout = () => {
  return <PersonAccessTokenPage />;
};
export const getServerSideProps = withEnv(
  ensureLogin(
    withAuthSSR(async (context, ssrApi) => {
      return {
        props: {
          ...(await getTranslationsProps(context, personalAccessTokenConfig.i18nNamespaces)),
        },
      };
    })
  )
);

PersonalAccessToken.getLayout = function getLayout(page: ReactElement, pageProps) {
  return <SettingLayout {...pageProps}>{page}</SettingLayout>;
};

export default PersonalAccessToken;

