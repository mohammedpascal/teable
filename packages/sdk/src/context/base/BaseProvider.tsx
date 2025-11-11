import type { FC, ReactNode } from 'react';
import { useMemo } from 'react';
import { baseActions, tableActions, type Action } from '@teable/core';
import { Base } from '../../model';
import { useSession } from '../../hooks';
import { BaseContext } from './BaseContext';
interface IBaseProviderProps {
  children: ReactNode;
}

export const BaseProvider: FC<IBaseProviderProps> = ({ children }) => {
  const { user } = useSession();

  const basePermissionData = useMemo(() => {
    // All base and table actions that should be tracked
    const allBaseTableActions = [...baseActions, ...tableActions] as Action[];

    // Initialize all permissions to false
    const permissions: Record<string, boolean> = {};
    allBaseTableActions.forEach((action) => {
      permissions[action] = false;
    });

    // Admin users have all permissions
    if (user?.isAdmin) {
      allBaseTableActions.forEach((action) => {
        permissions[action] = true;
      });
      return permissions;
    }

    // Users without roles have no permissions (already all false)
    if (!user?.role?.permissions || user.role.permissions.length === 0) {
      return permissions;
    }

    // Convert role permissions array to record format
    // Only include base and table permissions
    user.role.permissions.forEach((permission) => {
      if (allBaseTableActions.includes(permission as Action)) {
        permissions[permission] = true;
      }
    });

    return permissions;
  }, [user]);

  const value = {
    base: new Base(),
    permission: basePermissionData,
  };

  return <BaseContext.Provider value={value}>{children}</BaseContext.Provider>;
};
