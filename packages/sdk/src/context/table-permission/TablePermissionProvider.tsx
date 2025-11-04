import { useQuery } from '@tanstack/react-query';
import type { ITableActionKey } from '@teable/core';
import { getTablePermission } from '@teable/openapi';
import { useCallback, useMemo } from 'react';
import { ReactQueryKeys } from '../../config';
import { useTableId, useTableListener } from '../../hooks';
import {
  TablePermissionContext,
  TablePermissionContextDefaultValue,
} from './TablePermissionContext';

export const TablePermissionProvider = ({ children }: { children: React.ReactNode }) => {
  const tableId = useTableId();
  const { data: tablePermission, refetch } = useQuery({
    queryKey: ReactQueryKeys.getTablePermission(tableId!),
    queryFn: () => getTablePermission(tableId!).then((res) => res.data),
    enabled: !!tableId,
  });

  const refetchTablePermission = useCallback(() => {
    refetch();
  }, [refetch]);

  const tableMatches = useMemo<ITableActionKey[]>(() => ['addField'], []);
  useTableListener(tableId, tableMatches, refetchTablePermission);

  return (
    <TablePermissionContext.Provider value={tablePermission ?? TablePermissionContextDefaultValue}>
      {children}
    </TablePermissionContext.Provider>
  );
};
