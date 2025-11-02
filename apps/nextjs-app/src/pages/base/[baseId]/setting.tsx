import { dehydrate, QueryClient } from '@tanstack/react-query';
import { ReactQueryKeys } from '@teable/sdk/config';
import type { ReactElement } from 'react';
import { PersonAccessTokenPage } from '@/features/app/blocks/setting/access-token/PersonAccessTokenPage';
import { BaseLayout } from '@/features/app/layouts/BaseLayout';
import { personalAccessTokenConfig } from '@/features/i18n/personal-access-token.config';
import ensureLogin from '@/lib/ensureLogin';
import { getTranslationsProps } from '@/lib/i18n';
import type { NextPageWithLayout } from '@/lib/type';
import type { IViewPageProps } from '@/lib/view-pages-data';
import withAuthSSR from '@/lib/withAuthSSR';
import withEnv from '@/lib/withEnv';

const Node: NextPageWithLayout = () => {
  return <PersonAccessTokenPage />;
};

export const getServerSideProps = withEnv(
  ensureLogin(
    withAuthSSR(async (context, ssrApi) => {
      const { baseId } = context.query;
      const queryClient = new QueryClient();
      const [tables] = await Promise.all([
        ssrApi.getTables(baseId as string),

        queryClient.fetchQuery({
          queryKey: ReactQueryKeys.base(baseId as string),
          queryFn: ({ queryKey }) =>
            queryKey[1] ? ssrApi.getBaseById(baseId as string) : undefined,
        }),

        queryClient.fetchQuery({
          queryKey: ReactQueryKeys.getBasePermission(baseId as string),
          queryFn: ({ queryKey }) => ssrApi.getBasePermission(queryKey[1]),
        }),
      ]);

      if (tables) {
        return {
          props: {
            tableServerData: tables,
            dehydratedState: dehydrate(queryClient),
            ...(await getTranslationsProps(context, personalAccessTokenConfig.i18nNamespaces)),
          },
        };
      }

      return {
        notFound: true,
      };
    })
  )
);

Node.getLayout = function getLayout(page: ReactElement, pageProps: IViewPageProps) {
  return <BaseLayout {...pageProps}>{page}</BaseLayout>;
};

export default Node;

