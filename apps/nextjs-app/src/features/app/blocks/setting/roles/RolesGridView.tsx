import type { IRoleListVo } from '@teable/openapi';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@teable/ui-lib/shadcn';
import { Button } from '@teable/ui-lib/shadcn';
import { Edit, Trash2 } from '@teable/icons';
import { useTranslation } from 'next-i18next';

interface RolesGridViewProps {
  roles: IRoleListVo[];
  isLoading: boolean;
  onEdit: (role: IRoleListVo) => void;
  onDelete: (id: string) => void;
}

export const RolesGridView = ({ roles, isLoading, onEdit, onDelete }: RolesGridViewProps) => {
  const { t } = useTranslation(['common', 'setting']);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">
          {t('common:loading', { defaultValue: 'Loading...' })}
        </p>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">
          {t('setting:roles.noRoles', { defaultValue: 'No roles found' })}
        </p>
      </div>
    );
  }

  const formatPermissionsSummary = (permissions: Record<string, string[]> | string) => {
    // Handle new JSON format
    if (typeof permissions === 'object' && permissions !== null && !Array.isArray(permissions)) {
      const tableIds = Object.keys(permissions).filter((k) => k !== '*');
      const totalTables = tableIds.length;
      if (totalTables === 0) {
        // Legacy format stored as '*'
        const legacyPerms = permissions['*'] || [];
        return {
          summary: `${legacyPerms.length} permission${legacyPerms.length !== 1 ? 's' : ''} (all tables)`,
          isLegacy: true,
        };
      }
      const totalPermissions = Object.values(permissions).reduce((sum, perms) => sum + perms.length, 0);
      const avgPermissions = totalTables > 0 ? Math.round(totalPermissions / totalTables) : 0;
      return {
        summary: `${totalTables} table${totalTables !== 1 ? 's' : ''}, ~${avgPermissions} permission${avgPermissions !== 1 ? 's' : ''} avg`,
        isLegacy: false,
        tableCount: totalTables,
        avgPermissions,
      };
    }
    
    // Handle legacy string format (shouldn't happen with new API, but just in case)
    if (typeof permissions === 'string') {
      const perms = permissions.split(',').map((p) => p.trim()).filter(Boolean);
      return {
        summary: `${perms.length} permission${perms.length !== 1 ? 's' : ''} (all tables)`,
        isLegacy: true,
      };
    }
    
    return {
      summary: 'No permissions',
      isLegacy: false,
    };
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('setting:roles.name', { defaultValue: 'Name' })}</TableHead>
            <TableHead>{t('setting:roles.description', { defaultValue: 'Description' })}</TableHead>
            <TableHead>{t('setting:roles.permissions', { defaultValue: 'Permissions' })}</TableHead>
            <TableHead>{t('setting:roles.usersCount', { defaultValue: 'Users' })}</TableHead>
            <TableHead>{t('setting:roles.created', { defaultValue: 'Created' })}</TableHead>
            <TableHead className="text-right">{t('common:actions', { defaultValue: 'Actions' })}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>
                <span className="font-medium">{role.name}</span>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {role.description || '-'}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <span className="text-muted-foreground">
                    {formatPermissionsSummary(role.permissions).summary}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {role._count?.users || 0}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {role.createdTime
                  ? new Date(role.createdTime).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : '-'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(role)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(role.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

