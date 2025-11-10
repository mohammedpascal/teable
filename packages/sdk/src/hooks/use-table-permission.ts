import { useContext, useMemo } from 'react';
import { TablePermissionContext } from '../context/table-permission';

export type IUseTablePermissionAction = keyof ReturnType<typeof useTablePermission>;

// check table, view, record
export const useTablePermission = () => {
  const { table, view, record } = useContext(TablePermissionContext);
  return useMemo(() => {
    return { ...table, ...view, ...record };
  }, [table, view, record]);
};
