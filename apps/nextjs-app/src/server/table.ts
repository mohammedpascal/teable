import type { IFieldVo, IRecord, IViewVo } from '@teable/core';
import type { IGroupPointsVo, ITableVo } from '@teable/openapi';
import type { IViewPageProps } from '@/lib/view-pages-data';
import { SsrApi } from '@/backend/api/rest/table.ssr';

export async function getViewPageServerData(
  tableId: string,
  viewId: string
): Promise<IViewPageProps | undefined> {
  const ssrApi = new SsrApi();
  const tableResult = await ssrApi.getTable(tableId, viewId);
  
  if (tableResult) {
    const tablesResult = await ssrApi.getTables();
    const { fields, views, records, extra } = tableResult;

    return {
      tableServerData: tablesResult,
      fieldServerData: fields,
      viewServerData: views,
      recordsServerData: { records },
      groupPointsServerDataMap: {
        [viewId]: extra?.groupPoints,
      },
    };
  }

  return undefined;
}

