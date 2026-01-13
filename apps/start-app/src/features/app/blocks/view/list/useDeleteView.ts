import { useTable } from '@/sdk/hooks';
import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';

export function useDeleteView(viewId: string) {
  const table = useTable();
  const navigate = useNavigate();

  return useCallback(async () => {
    if (!table) {
      return;
    }

    await table.deleteView(viewId);
    navigate({ to: '/table/$tableId', params: { tableId: table.id } });
  }, [navigate, table, viewId]);
}
