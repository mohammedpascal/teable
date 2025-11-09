import type { User } from '../../prisma';

export type ViewPermission = 'View' | 'Create' | 'Update' | 'Delete' | 'Configure';

const VALID_PERMISSIONS: ViewPermission[] = ['View', 'Create', 'Update', 'Delete', 'Configure'];

/**
 * Parse comma-separated permissions string into array
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
 * Check if user's role has a specific permission
 * Admin users bypass all permission checks
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
 * Validate permissions string format
 */
export function validatePermissions(permissionsString: string): boolean {
  if (!permissionsString.trim()) {
    return false;
  }

  const permissions = parsePermissions(permissionsString);
  const inputPermissions = permissionsString
    .split(',')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // All provided permissions must be valid
  return permissions.length === inputPermissions.length;
}

