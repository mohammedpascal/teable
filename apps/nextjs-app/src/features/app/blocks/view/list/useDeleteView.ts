import { useTable } from '@/sdk/hooks';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

export function useDeleteView(viewId: string) {
  const table = useTable();
  const router = useRouter();

  return useCallback(async () => {
    if (!table) {
      return;
    }

    await table.deleteView(viewId);
    router.push({
      pathname: '/table/[tableId]',
      query: { tableId: table.id },
    });
  }, [router, table, viewId]);
}
