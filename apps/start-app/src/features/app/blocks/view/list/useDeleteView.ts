import { useTable } from '@/sdk/hooks';
import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { getTableById } from '@teable/openapi';

export function useDeleteView(viewId: string) {
  const table = useTable();
  const navigate = useNavigate();

  return useCallback(async () => {
    if (!table) {
      return;
    }

    await table.deleteView(viewId);
    const tableData = await getTableById(table.id);
    const defaultViewId = tableData.data.defaultViewId;
    navigate({
      to: '/table/$tableId/$viewId',
      params: { tableId: table.id, viewId: defaultViewId },
    });
  }, [navigate, table, viewId]);
}
