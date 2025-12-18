import type { ReactElement } from 'react';
import type { ITableProps } from '@/features/app/blocks/table/Table';
import { Table } from '@/features/app/blocks/table/Table';
import { BaseLayout } from '@/features/app/layouts/BaseLayout';
import type { NextPageWithLayout } from '@/lib/type';
import type { IViewPageProps } from '@/lib/view-pages-data';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const Node: NextPageWithLayout<ITableProps> = (props = {}) => {
  return (
    <Table
      fieldServerData={props.fieldServerData}
      viewServerData={props.viewServerData}
      recordsServerData={props.recordsServerData}
      recordServerData={props.recordServerData}
      groupPointsServerDataMap={props.groupPointsServerDataMap}
    />
  );
};

Node.getLayout = function getLayout(page: ReactElement, pageProps?: IViewPageProps) {
  return <BaseLayout {...(pageProps || {})}>{page}</BaseLayout>;
};

export default Node;
