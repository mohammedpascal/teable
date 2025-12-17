import { recordActions, tableActions, viewActions, type Action } from '@teable/core';
import { useMemo } from 'react';
import { useSession } from './use-session';

export const useHookPermission = (): Record<string, boolean> => {
  const { user } = useSession();

  const permissions = useMemo(() => {
    // All actions that should be tracked
    const allActions = [...viewActions, ...recordActions, ...tableActions] as Action[];

    // Initialize all permissions to false
    const permissions: Record<string, boolean> = {};
    allActions.forEach((action) => (permissions[action] = false));

    // Admin users have all permissions
    if (user?.isAdmin) {
      allActions.forEach((action) => (permissions[action] = true));
      return permissions;
    }

    // Users without roles have no permissions (already all false)
    user.role?.permissions?.forEach((action) => {
      permissions[action] = true;
    });

    return permissions;
  }, [user]);

  return permissions ?? {};
};
