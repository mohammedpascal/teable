import { useContext, useMemo } from 'react';
import { TablePermissionContext } from '../context/table-permission';

export type IUseFieldPermissionAction = keyof ReturnType<typeof useFieldPermission>;

export const useFieldPermission = (fieldId: string | undefined) => {
  const { table } = useContext(TablePermissionContext) ?? {};
  return useMemo(() => {
    if (!fieldId || !table) return {};
    // Derive field permissions from table permissions
    const hasTableManage = table['table|manage'] ?? false;
    return {
      'field|read': hasTableManage,
      'field|update': hasTableManage,
      'field|delete': hasTableManage,
    };
  }, [table, fieldId]);
};
