import { ViewType } from '@teable/core';
import { sortBy } from 'lodash';
import { useContext, useMemo } from 'react';
import { FieldContext } from '../context';
import { TablePermissionContext } from '../context/table-permission';
import { useView } from './use-view';

export function useFields(options: { withHidden?: boolean; withDenied?: boolean } = {}) {
  const { withHidden, withDenied } = options;
  const { fields: originFields } = useContext(FieldContext);
  const { table } = useContext(TablePermissionContext);

  const view = useView();
  const { type: viewType, columnMeta } = view ?? {};

  return useMemo(() => {
    const sortedFields = sortBy(originFields, (field) => columnMeta?.[field.id]?.order ?? Infinity);

    if ((withHidden && withDenied) || viewType == null) {
      return sortedFields;
    }

    const hasTableManage = table?.['table|manage'] ?? false;

    return sortedFields.filter(({ id }) => {
      const isHidden = () => {
        if (withHidden) {
          return true;
        }
        if (
          viewType === ViewType.Form ||
          viewType === ViewType.Kanban ||
          viewType === ViewType.Gallery ||
          viewType === ViewType.Calendar
        ) {
          return columnMeta?.[id]?.visible;
        }
        return !(columnMeta?.[id] as any)?.hidden;
      };
      const hasPermission = () => {
        if (withDenied || hasTableManage) {
          return true;
        }
        return false;
      };
      return isHidden() && hasPermission();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originFields, withHidden, viewType, table, JSON.stringify(columnMeta)]);
}
