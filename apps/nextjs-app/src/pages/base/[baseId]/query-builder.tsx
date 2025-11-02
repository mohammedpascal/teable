import type { ReactElement } from 'react';
import { QueryBuilder } from '@/features/app/blocks/setting/query-builder/QueryBuilder';
import { SettingLayout } from '@/features/app/layouts/SettingLayout';
import { developerConfig } from '@/features/i18n/developer.config';
import ensureLogin from '@/lib/ensureLogin';
import { getTranslationsProps } from '@/lib/i18n';
import type { NextPageWithLayout } from '@/lib/type';
import withAuthSSR from '@/lib/withAuthSSR';
import withEnv from '@/lib/withEnv';

const Node: NextPageWithLayout = () => {
  return <QueryBuilder />;
};

export const getServerSideProps = withEnv(
  ensureLogin(
    withAuthSSR(async (context, ssrApi) => {
      return {
        props: {
          ...(await getTranslationsProps(context, developerConfig.i18nNamespaces)),
        },
      };
    })
  )
);

Node.getLayout = function getLayout(page: ReactElement, pageProps) {
  return <SettingLayout {...pageProps}>{page}</SettingLayout>;
};

export default Node;

