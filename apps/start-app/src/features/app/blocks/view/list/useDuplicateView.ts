import type { IViewInstance } from '@/sdk';
import { useTable } from '@/sdk/hooks';
import pick from 'lodash/pick';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback } from 'react';

export function useDuplicateView(view: IViewInstance) {
  const table = useTable();
  const navigate = useNavigate();
  const search = useSearch({ strict: false });

  const newView = pick(view, [
    'type',
    'columnMeta',
    'description',
    'filter',
    'group',
    'name',
    'options',
    'sort',
  ]);

  return useCallback(async () => {
    if (!table) return;

    const viewDoc = (await table.createView(newView)).data;
    const viewId = viewDoc.id;
    navigate({
      to: '/table/$tableId/$viewId',
      params: { tableId: table.id, viewId },
      replace: Boolean(search.viewId),
    });
  }, [navigate, table, newView, search.viewId]);
}
