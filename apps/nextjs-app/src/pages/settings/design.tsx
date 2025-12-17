import { dehydrate, QueryClient } from '@tanstack/react-query';
import { ReactQueryKeys } from '@/sdk/config';
import { TableProvider } from '@/sdk/context';
import type { ITableVo } from '@teable/openapi';
import type { ReactElement } from 'react';
import { Design } from '@/features/app/blocks/design/Design';
import { SettingLayout } from '@/features/app/layouts/SettingLayout';
import { tableConfig } from '@/features/i18n/table.config';
import ensureLogin from '@/lib/ensureLogin';
import { getTranslationsProps } from '@/lib/i18n';
import type { NextPageWithLayout } from '@/lib/type';
import withAuthSSR from '@/lib/withAuthSSR';
import withEnv from '@/lib/withEnv';
import type { GetServerSideProps } from 'next';

interface IDesignPageProps {
  tableServerData: ITableVo[];
  dehydratedState?: unknown;
}

const DesignPage: NextPageWithLayout<IDesignPageProps> = ({ tableServerData, dehydratedState }) => {
  return (
    <TableProvider serverData={tableServerData}>
      <Design />
    </TableProvider>
  );
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

      const queryClient = new QueryClient();
      const [tables] = await Promise.all([
        ssrApi.getTables(),

        queryClient.fetchQuery({
          queryKey: ReactQueryKeys.base(),
          queryFn: () => Promise.resolve({ id: 'bse0', name: 'Base' }),
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

DesignPage.getLayout = function getLayout(page: ReactElement, pageProps) {
  return <SettingLayout {...pageProps}>{page}</SettingLayout>;
};

export default DesignPage;

