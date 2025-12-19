import { SsrApi } from '@/backend/api/rest/table.ssr';
import type { IViewPageProps } from '@/lib/view-pages-data';

export async function getViewPageServerData(
  tableId: string,
  viewId: string
): Promise<IViewPageProps | undefined> {
  try {
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
  } catch (error) {
    console.error(`Failed to fetch table data for tableId: ${tableId}, viewId: ${viewId}`, error);
    throw error; // Re-throw to let the loader handle it
  }
}
