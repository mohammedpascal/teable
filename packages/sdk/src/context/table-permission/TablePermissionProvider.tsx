import { useMemo } from 'react';
import type { ITableActionKey, TableAction, ViewAction, RecordAction, Action } from '@teable/core';
import { tableActions, viewActions, recordActions, ActionPrefix, actionPrefixMap } from '@teable/core';
import { useTableId, useTableListener, useSession } from '../../hooks';
import {
  TablePermissionContext,
  TablePermissionContextDefaultValue,
} from './TablePermissionContext';

export const TablePermissionProvider = ({ children }: { children: React.ReactNode }) => {
  const tableId = useTableId();
  const { user } = useSession();

  const tablePermission = useMemo(() => {
    // Initialize all permissions to false
    const tablePerms: Record<TableAction, boolean> = {} as Record<TableAction, boolean>;
    const viewPerms: Record<ViewAction, boolean> = {} as Record<ViewAction, boolean>;
    const recordPerms: Record<RecordAction, boolean> = {} as Record<RecordAction, boolean>;

    // Initialize all actions to false
    tableActions.forEach((action) => {
      tablePerms[action] = false;
    });
    viewActions.forEach((action) => {
      viewPerms[action] = false;
    });
    recordActions.forEach((action) => {
      recordPerms[action] = false;
    });

    // Admin users have all permissions
    if (user?.isAdmin) {
      tableActions.forEach((action) => {
        tablePerms[action] = true;
      });
      viewActions.forEach((action) => {
        viewPerms[action] = true;
      });
      recordActions.forEach((action) => {
        recordPerms[action] = true;
      });
      return {
        table: tablePerms,
        view: viewPerms,
        record: recordPerms,
      };
    }

    // Users without roles have no permissions (already all false)
    if (!user?.role?.permissions || user.role.permissions.length === 0) {
      return {
        table: tablePerms,
        view: viewPerms,
        record: recordPerms,
      };
    }

    // Convert role permissions array to record format
    // Filter to only table, view, and record permissions
    const allTableViewRecordActions = [
      ...actionPrefixMap[ActionPrefix.Table],
      ...actionPrefixMap[ActionPrefix.View],
      ...actionPrefixMap[ActionPrefix.Record],
    ] as Action[];

    user.role.permissions.forEach((permission) => {
      if (allTableViewRecordActions.includes(permission as Action)) {
        // Check which category this permission belongs to
        if (tableActions.includes(permission as TableAction)) {
          tablePerms[permission as TableAction] = true;
        } else if (viewActions.includes(permission as ViewAction)) {
          viewPerms[permission as ViewAction] = true;
        } else if (recordActions.includes(permission as RecordAction)) {
          recordPerms[permission as RecordAction] = true;
        }
      }
    });

    return {
      table: tablePerms,
      view: viewPerms,
      record: recordPerms,
    };
  }, [user]);

  // Keep useTableListener for compatibility, but permissions are now role-based
  // so refetch is not needed (permissions don't change based on table events)
  const tableMatches = useMemo<ITableActionKey[]>(() => ['addField'], []);
  useTableListener(tableId, tableMatches, () => {
    // No-op: permissions are role-based, not table-specific
  });

  return (
    <TablePermissionContext.Provider value={tablePermission}>
      {children}
    </TablePermissionContext.Provider>
  );
};
