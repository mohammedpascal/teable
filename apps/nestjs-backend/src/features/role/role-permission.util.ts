import type { User } from '../../prisma';

// Action-based permissions that apply globally
export const VALID_PERMISSIONS = [
  'record|create',
  'record|delete',
  'record|read',
  'record|update',
  'view|create',
  'view|delete',
  'view|read',
  'view|update',
  'table|manage',
  'table|import',
  'table|export',
] as const;

export type ActionPermission = (typeof VALID_PERMISSIONS)[number];

/**
 * Check if a string is valid JSON
 */
function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Parse permissions string - expects JSON array of action strings
 */
export function parsePermissionsString(
  permissionsString: string | null | undefined
): ActionPermission[] {
  if (!permissionsString || !permissionsString.trim()) {
    return [];
  }

  // Try to parse as JSON array
  if (isJsonString(permissionsString)) {
    try {
      const parsed = JSON.parse(permissionsString);
      if (Array.isArray(parsed)) {
        return parsed.filter((p): p is ActionPermission =>
          VALID_PERMISSIONS.includes(p as ActionPermission)
        );
      }
    } catch {
      // Invalid JSON, return empty array
    }
  }

  // Legacy format: comma-separated permissions (for backward compatibility)
  return permissionsString
    .split(',')
    .map((p) => p.trim())
    .filter((p): p is ActionPermission => {
      return VALID_PERMISSIONS.includes(p as ActionPermission);
    });
}

/**
 * Parse permissions string into array (alias for parsePermissionsString for backward compatibility)
 */
export function parsePermissions(permissionsString: string | null | undefined): ActionPermission[] {
  return parsePermissionsString(permissionsString);
}

/**
 * Check if user has a specific action permission
 * Admin users bypass all permission checks
 */
export function hasActionPermission(
  user: (User & { role?: { permissions: string } | null }) | null,
  action: ActionPermission
): boolean {
  if (!user) {
    return false;
  }

  // Admin users bypass all permission checks
  if (user.isAdmin) {
    return true;
  }

  // Users without a role have no permissions
  if (!user.role || !user.role.permissions) {
    return false;
  }

  const permissions = parsePermissionsString(user.role.permissions);
  return permissions.includes(action);
}

/**
 * Check if user's role has a specific permission for a table (deprecated, use hasActionPermission)
 * @deprecated Use hasActionPermission instead
 */
export function hasTablePermission(
  user: (User & { role?: { permissions: string } | null }) | null,
  tableId: string,
  permission: string
): boolean {
  // Map old ViewPermission to new action permissions for backward compatibility
  const permissionMap: Record<string, ActionPermission> = {
    View: 'table|manage',
    Create: 'table|manage',
    Update: 'table|manage',
    Delete: 'table|manage',
    Configure: 'table|manage',
  };

  const action = permissionMap[permission];
  if (action) {
    return hasActionPermission(user, action);
  }

  return hasActionPermission(user, permission as ActionPermission);
}

/**
 * Get all permissions for a specific table (deprecated, use getUserPermissions)
 * @deprecated Use getUserPermissions instead
 */
export function getTablePermissions(
  user: (User & { role?: { permissions: string } | null }) | null,
  tableId: string
): ActionPermission[] {
  return getUserPermissions(user);
}

/**
 * Check if user's role has a specific permission (deprecated, use hasActionPermission)
 * @deprecated Use hasActionPermission instead
 */
export function hasPermission(
  user: (User & { role?: { permissions: string } | null }) | null,
  permission: string
): boolean {
  return hasActionPermission(user, permission as ActionPermission);
}

/**
 * Get all permissions for a user
 */
export function getUserPermissions(
  user: (User & { role?: { permissions: string } | null }) | null
): ActionPermission[] {
  if (!user) {
    return [];
  }

  // Admin users have all permissions
  if (user.isAdmin) {
    return [...VALID_PERMISSIONS];
  }

  // Users without a role have no permissions
  if (!user.role || !user.role.permissions) {
    return [];
  }

  return parsePermissions(user.role.permissions);
}

/**
 * Validate permissions string format (expects JSON array of action strings)
 */
export function validatePermissions(permissionsString: string): boolean {
  if (!permissionsString || !permissionsString.trim()) {
    return false;
  }

  // Try JSON format first
  if (isJsonString(permissionsString)) {
    try {
      const parsed = JSON.parse(permissionsString);
      if (!Array.isArray(parsed)) {
        return false;
      }

      // Empty array is valid (no permissions)
      if (parsed.length === 0) {
        return true;
      }

      // Validate that all values are valid action permissions
      for (const perm of parsed) {
        if (typeof perm !== 'string' || !VALID_PERMISSIONS.includes(perm as ActionPermission)) {
          return false;
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  // Legacy format: comma-separated (for backward compatibility)
  const permissions = parsePermissions(permissionsString);
  const inputPermissions = permissionsString
    .split(',')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // All provided permissions must be valid
  return permissions.length === inputPermissions.length;
}
