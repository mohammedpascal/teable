import type { User } from '../../prisma';

export type ViewPermission = 'View' | 'Create' | 'Update' | 'Delete' | 'Configure';

const VALID_PERMISSIONS: ViewPermission[] = ['View', 'Create', 'Update', 'Delete', 'Configure'];

export type TablePermissions = Record<string, ViewPermission[]>;

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
 * Parse permissions string - handles both legacy comma-separated format and new JSON format
 */
export function parsePermissionsString(
  permissionsString: string | null | undefined
): TablePermissions | null {
  if (!permissionsString || !permissionsString.trim()) {
    return null;
  }

  // Try to parse as JSON first
  if (isJsonString(permissionsString)) {
    try {
      const parsed = JSON.parse(permissionsString);
      // Validate structure
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        // Validate that all values are arrays of valid permissions
        const result: TablePermissions = {};
        for (const [tableId, perms] of Object.entries(parsed)) {
          if (Array.isArray(perms)) {
            result[tableId] = perms.filter((p): p is ViewPermission =>
              VALID_PERMISSIONS.includes(p as ViewPermission)
            );
          }
        }
        return result;
      }
    } catch {
      // Invalid JSON, fall through to legacy format
    }
  }

  // Legacy format: comma-separated permissions
  // Convert to a format that applies to all tables (using '*' as key)
  const permissions = permissionsString
    .split(',')
    .map((p) => p.trim())
    .filter((p): p is ViewPermission => {
      return VALID_PERMISSIONS.includes(p as ViewPermission);
    });

  if (permissions.length === 0) {
    return null;
  }

  // Return legacy format with '*' key to indicate it applies to all tables
  return { '*': permissions };
}

/**
 * Parse comma-separated permissions string into array (legacy function, kept for backward compatibility)
 */
export function parsePermissions(permissionsString: string | null | undefined): ViewPermission[] {
  if (!permissionsString) {
    return [];
  }

  return permissionsString
    .split(',')
    .map((p) => p.trim())
    .filter((p): p is ViewPermission => {
      return VALID_PERMISSIONS.includes(p as ViewPermission);
    });
}

/**
 * Check if user's role has a specific permission for a table
 * Admin users bypass all permission checks
 */
export function hasTablePermission(
  user: User & { role?: { permissions: string } | null } | null,
  tableId: string,
  permission: ViewPermission
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

  const tablePermissions = parsePermissionsString(user.role.permissions);
  if (!tablePermissions) {
    return false;
  }

  // Check if permissions exist for this specific table
  if (tablePermissions[tableId]) {
    return tablePermissions[tableId].includes(permission);
  }

  // Check legacy format (applies to all tables)
  if (tablePermissions['*']) {
    return tablePermissions['*'].includes(permission);
  }

  return false;
}

/**
 * Get all permissions for a specific table
 */
export function getTablePermissions(
  user: User & { role?: { permissions: string } | null } | null,
  tableId: string
): ViewPermission[] {
  if (!user) {
    return [];
  }

  // Admin users have all permissions
  if (user.isAdmin) {
    return VALID_PERMISSIONS;
  }

  // Users without a role have no permissions
  if (!user.role || !user.role.permissions) {
    return [];
  }

  const tablePermissions = parsePermissionsString(user.role.permissions);
  if (!tablePermissions) {
    return [];
  }

  // Check if permissions exist for this specific table
  if (tablePermissions[tableId]) {
    return tablePermissions[tableId];
  }

  // Check legacy format (applies to all tables)
  if (tablePermissions['*']) {
    return tablePermissions['*'];
  }

  return [];
}

/**
 * Check if user's role has a specific permission (legacy function, kept for backward compatibility)
 * Admin users bypass all permission checks
 * Note: This function doesn't check table-specific permissions. Use hasTablePermission instead.
 */
export function hasPermission(
  user: User & { role?: { permissions: string } | null } | null,
  permission: ViewPermission
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

  const permissions = parsePermissions(user.role.permissions);
  return permissions.includes(permission);
}

/**
 * Get all permissions for a user
 */
export function getUserPermissions(
  user: User & { role?: { permissions: string } | null } | null
): ViewPermission[] {
  if (!user) {
    return [];
  }

  // Admin users have all permissions
  if (user.isAdmin) {
    return VALID_PERMISSIONS;
  }

  // Users without a role have no permissions
  if (!user.role || !user.role.permissions) {
    return [];
  }

  return parsePermissions(user.role.permissions);
}

/**
 * Validate permissions string format (supports both JSON and legacy comma-separated)
 */
export function validatePermissions(permissionsString: string): boolean {
  if (!permissionsString.trim()) {
    return false;
  }

  // Try JSON format first
  if (isJsonString(permissionsString)) {
    try {
      const parsed = JSON.parse(permissionsString);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        return false;
      }

      // Validate that all values are arrays of valid permissions
      for (const [tableId, perms] of Object.entries(parsed)) {
        if (!Array.isArray(perms)) {
          return false;
        }
        for (const perm of perms) {
          if (!VALID_PERMISSIONS.includes(perm as ViewPermission)) {
            return false;
          }
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  // Legacy format: comma-separated
  const permissions = parsePermissions(permissionsString);
  const inputPermissions = permissionsString
    .split(',')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // All provided permissions must be valid
  return permissions.length === inputPermissions.length;
}

