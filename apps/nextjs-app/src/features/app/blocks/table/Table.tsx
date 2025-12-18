import type { IFieldVo, IRecord, IViewVo } from '@teable/core';
import { type IGroupPointsVo } from '@teable/openapi';
import { AnchorContext, FieldProvider, useTable, ViewProvider } from '@/sdk';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ErrorBoundary } from 'react-error-boundary';
import { View } from '../view/View';
import { FailAlert } from './FailAlert';
import { useViewErrorHandler } from './hooks/use-view-error-handler';
import { TableHeader } from './table-header/TableHeader';

export interface ITableProps {
  fieldServerData?: IFieldVo[];
  viewServerData?: IViewVo[];
  recordsServerData?: { records: IRecord[] };
  recordServerData?: IRecord;
  groupPointsServerDataMap?: { [viewId: string]: IGroupPointsVo | undefined };
}

export const Table: React.FC<ITableProps> = ({
  fieldServerData,
  viewServerData,
  recordsServerData,
  recordServerData,
  groupPointsServerDataMap,
}) => {
  const table = useTable();
  const router = useRouter();
  const { tableId, viewId } = router.query as {
    tableId: string;
    viewId: string;
  };

  useViewErrorHandler(tableId, viewId);

  return (
    <AnchorContext.Provider value={{ tableId, viewId }}>
      <Head>
        <title>
          {table?.name ? `${table?.icon ? table.icon + ' ' : ''}${table.name}: Teable` : 'Teable'}
        </title>
        <style data-fullcalendar></style>
      </Head>
      <ViewProvider serverData={viewServerData}>
        <div className="flex h-full grow basis-[500px]">
          <div className="flex flex-1 flex-col overflow-hidden">
            <TableHeader />
            <FieldProvider serverSideData={fieldServerData}>
              <ErrorBoundary
                fallback={
                  <div className="flex size-full items-center justify-center">
                    <FailAlert />
                  </div>
                }
              >
                <View
                  recordServerData={recordServerData}
                  recordsServerData={recordsServerData}
                  groupPointsServerDataMap={groupPointsServerDataMap}
                />
              </ErrorBoundary>
            </FieldProvider>
          </div>
        </div>
      </ViewProvider>
    </AnchorContext.Provider>
  );
};
