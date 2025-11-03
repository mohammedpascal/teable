import { QueryClient, dehydrate } from '@tanstack/react-query';
import { ReactQueryKeys } from '@teable/sdk';
import type { ReactElement } from 'react';
import type { ITableProps } from '@/features/app/blocks/table/Table';
import { Table } from '@/features/app/blocks/table/Table';
import { BaseLayout } from '@/features/app/layouts/BaseLayout';
import { tableConfig } from '@/features/i18n/table.config';
import ensureLogin from '@/lib/ensureLogin';
import { getTranslationsProps } from '@/lib/i18n';
import type { NextPageWithLayout } from '@/lib/type';
import type { IViewPageProps } from '@/lib/view-pages-data';
import { getViewPageServerData } from '@/lib/view-pages-data';
import withAuthSSR from '@/lib/withAuthSSR';
import withEnv from '@/lib/withEnv';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const Node: NextPageWithLayout<ITableProps> = ({
  fieldServerData,
  viewServerData,
  recordsServerData,
  recordServerData,
  groupPointsServerDataMap,
}) => {
  return (
    <Table
      fieldServerData={fieldServerData}
      viewServerData={viewServerData}
      recordsServerData={recordsServerData}
      recordServerData={recordServerData}
      groupPointsServerDataMap={groupPointsServerDataMap}
    />
  );
};

export const getServerSideProps = withEnv(
  ensureLogin(
    withAuthSSR<IViewPageProps>(async (context, ssrApi) => {
      const { tableId, viewId, recordId, fromNotify: notifyId } = context.query;
      const queryClient = new QueryClient();

      const baseId = 'bse0';

      await Promise.all([
        queryClient.fetchQuery({
          queryKey: ReactQueryKeys.base(baseId),
          queryFn: () => Promise.resolve({ id: 'bse0', name: 'Base' }),
        }),

        queryClient.fetchQuery({
          queryKey: ReactQueryKeys.getBasePermission(baseId),
          queryFn: () => ssrApi.getBasePermission(baseId),
        }),

        queryClient.fetchQuery({
          queryKey: ReactQueryKeys.getTablePermission(baseId, tableId as string),
          queryFn: () => ssrApi.getTablePermission(baseId, tableId as string),
        }),
      ]);

      let recordServerData;
      if (recordId) {
        if (notifyId) {
          await ssrApi.updateNotificationStatus(notifyId as string, { isRead: true });
        }

        recordServerData = await ssrApi.getRecord(tableId as string, recordId as string);

        if (!recordServerData) {
          return {
            redirect: {
              destination: `/base/bse0/${tableId}/${viewId}`,
              permanent: false,
            },
          };
        }
      }

      const serverData = await getViewPageServerData(
        ssrApi,
        baseId as string,
        tableId as string,
        viewId as string
      );

      if (serverData) {
        const { i18nNamespaces } = tableConfig;
        return {
          props: {
            ...serverData,
            ...(recordServerData ? { recordServerData } : {}),
            ...(await getTranslationsProps(context, i18nNamespaces)),
            dehydratedState: dehydrate(queryClient),
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
