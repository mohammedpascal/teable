import { dehydrate, QueryClient } from '@tanstack/react-query';
import { ReactQueryKeys } from '@teable/sdk/config';
import type { ReactElement } from 'react';
import { Design } from '@/features/app/blocks/design/Design';
import { BaseLayout } from '@/features/app/layouts/BaseLayout';
import { tableConfig } from '@/features/i18n/table.config';
import ensureLogin from '@/lib/ensureLogin';
import { getTranslationsProps } from '@/lib/i18n';
import type { NextPageWithLayout } from '@/lib/type';
import type { IViewPageProps } from '@/lib/view-pages-data';
import withAuthSSR from '@/lib/withAuthSSR';
import withEnv from '@/lib/withEnv';

const Node: NextPageWithLayout = () => {
  return <Design />;
};

export const getServerSideProps = withEnv(
  ensureLogin(
    withAuthSSR(async (context, ssrApi) => {
      const baseId = 'bse0';
      const queryClient = new QueryClient();
      const [tables] = await Promise.all([
        ssrApi.getTables(baseId),

        queryClient.fetchQuery({
          queryKey: ReactQueryKeys.base(),
          queryFn: () => Promise.resolve({ id: 'bse0', name: 'Base' }),
        }),

        queryClient.fetchQuery({
          queryKey: ReactQueryKeys.getBasePermission(),
          queryFn: () => ssrApi.getBasePermission(),
        }),
      ]);

      if (tables) {
        const { i18nNamespaces } = tableConfig;
        return {
          props: {
            tableServerData: tables,
            dehydratedState: dehydrate(queryClient),
            ...(await getTranslationsProps(context, i18nNamespaces)),
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
