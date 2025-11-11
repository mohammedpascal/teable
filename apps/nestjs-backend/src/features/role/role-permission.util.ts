import type { User } from '../../prisma';

// Action-based permissions that apply globally
export const VALID_PERMISSIONS = [
  'record|create',
  'record|delete',
  'record|update',
  'view|create',
  'view|delete',
  'view|update',
  'table|read',
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

  return [];
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

  return false;
}
