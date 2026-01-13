import { useQuery } from '@tanstack/react-query';
import type { IViewPageProps } from '@/lib/view-pages-data';
import { SsrApi } from '@/backend/api/rest/table.ssr';
import { ReactQueryKeys } from '@/sdk/config';

export function useViewPageData(tableId: string, viewId: string) {
  return useQuery<IViewPageProps>({
    queryKey: ReactQueryKeys.viewPageData(tableId, viewId),
    queryFn: async () => {
      const api = new SsrApi();
      const tableResult = await api.getTable(tableId, viewId);

      if (tableResult) {
        const tablesResult = await api.getTables();
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

      return {
        tableServerData: [],
        fieldServerData: [],
        viewServerData: [],
        recordsServerData: { records: [] },
        groupPointsServerDataMap: {},
      } as IViewPageProps;
    },
  });
}

