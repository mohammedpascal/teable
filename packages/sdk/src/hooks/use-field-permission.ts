import { useContext, useMemo } from 'react';
import { TablePermissionContext } from '../context/table-permission';

export type IUseFieldPermissionAction = keyof ReturnType<typeof useFieldPermission>;

export const useFieldPermission = (fieldId: string | undefined) => {
  const { table } = useContext(TablePermissionContext) ?? {};
  return useMemo(() => {
    if (!fieldId || !table) return {};
    // Derive field permissions from table permissions
    return {
      'field|read': table['table|read'] ?? false,
      'field|update': (table['table|update'] ?? false) || (table['table|create'] ?? false),
      'field|delete': (table['table|update'] ?? false) || (table['table|delete'] ?? false),
    };
  }, [table, fieldId]);
};
