import { createFileRoute } from '@tanstack/react-router';
import type { ITableProps } from '@/features/app/blocks/table/Table';
import { Table } from '@/features/app/blocks/table/Table';
import { BaseLayout } from '@/features/app/layouts/BaseLayout';
import { getViewPageServerData } from '@/server/table';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export const Route = createFileRoute('/table/$tableId/$viewId')({
  loader: async ({ params }) => {
    const { tableId, viewId } = params;
    const serverData = await getViewPageServerData(tableId, viewId);
    return serverData || {
      tableServerData: undefined,
      fieldServerData: undefined,
      viewServerData: undefined,
      recordsServerData: undefined,
      groupPointsServerDataMap: undefined,
    };
  },
  component: TableViewRouteComponent,
});

function TableViewRouteComponent() {
  const serverData = Route.useLoaderData();
  const props: ITableProps = {
    fieldServerData: serverData.fieldServerData,
    viewServerData: serverData.viewServerData,
    recordsServerData: serverData.recordsServerData,
    groupPointsServerDataMap: serverData.groupPointsServerDataMap,
  };

  return (
    <BaseLayout>
      <Table
        fieldServerData={props.fieldServerData}
        viewServerData={props.viewServerData}
        recordsServerData={props.recordsServerData}
        recordServerData={props.recordServerData}
        groupPointsServerDataMap={props.groupPointsServerDataMap}
      />
    </BaseLayout>
  );
}

