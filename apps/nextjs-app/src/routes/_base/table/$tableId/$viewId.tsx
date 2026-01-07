import { createFileRoute, useParams } from '@tanstack/react-router';
import type { ITableProps } from '@/features/app/blocks/table/Table';
import { Table } from '@/features/app/blocks/table/Table';
import { useViewPageData } from '@/hooks/api/useViewPageData';
import { Spin } from '@/ui-lib/base/spin/Spin';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export const Route = createFileRoute('/_base/table/$tableId/$viewId')({
  path: '/table/$tableId/$viewId',
  component: TableViewRouteComponent,
});

function TableViewRouteComponent() {
  const { tableId, viewId } = useParams({ from: '/_base/table/$tableId/$viewId' });
  const { data: serverData, isLoading, isError, error } = useViewPageData(tableId, viewId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin className="size-8" />
      </div>
    );
  }

  if (isError || !serverData) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="mb-4 text-2xl font-bold">Error Loading Table</h1>
        <p className="mb-4 text-muted-foreground">{errorMessage}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  const props: ITableProps = {
    fieldServerData: serverData.fieldServerData,
    viewServerData: serverData.viewServerData,
    recordsServerData: serverData.recordsServerData,
    groupPointsServerDataMap: serverData.groupPointsServerDataMap,
  };

  return (
    <Table
      fieldServerData={props.fieldServerData}
      viewServerData={props.viewServerData}
      recordsServerData={props.recordsServerData}
      recordServerData={props.recordServerData}
      groupPointsServerDataMap={props.groupPointsServerDataMap}
    />
  );
}

