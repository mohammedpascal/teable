import type { ITableProps } from '@/features/app/blocks/table/Table';
import { Table } from '@/features/app/blocks/table/Table';
import type { IViewPageProps } from '@/lib/view-pages-data';
import { getViewPageServerData } from '@/server/table';
import { createLazyFileRoute } from '@tanstack/react-router';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export const Route = createLazyFileRoute('/_base/table/$tableId/$viewId')({
  path: '/table/$tableId/$viewId',
  component: TableViewRouteComponent,
  loader: async ({ params }) => {
    const { tableId, viewId } = params;
    const serverData: IViewPageProps = await getViewPageServerData(tableId, viewId);
    return { serverData: serverData  };
  }
});

function TableViewRouteComponent() {
  const { serverData } = Route.useLoaderData() as { serverData: IViewPageProps };

  if (!serverData) {
    return <div>No data</div>;
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

