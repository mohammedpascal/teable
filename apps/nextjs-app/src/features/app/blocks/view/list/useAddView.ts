import { ViewType } from '@teable/core';
import { useTable, useViews } from '@/sdk/hooks';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback } from 'react';

export function useAddView() {
  const table = useTable();
  const views = useViews();
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const viewName = views?.[views.length - 1]?.name + ' ' + views?.length;

  return useCallback(
    async (type: ViewType = ViewType.Grid, name?: string) => {
      if (!table) {
        return;
      }

      const viewDoc = (
        await table.createView({
          name: name ?? viewName,
          type,
        })
      ).data;
      const viewId = viewDoc.id;
      navigate({
        to: '/table/$tableId/$viewId',
        params: { tableId: table.id, viewId },
        replace: Boolean(search.viewId),
      });
    },
    [navigate, table, viewName, search.viewId]
  );
}
