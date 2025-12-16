import { Edit, Trash2 } from '@/components/icons';
import type { IRoleListVo } from '@teable/openapi';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
} from '@teable/ui-lib/shadcn';
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
  // permission value is saved as text
  // sample value: ["view|create","view|delete","view|update","record|delete","record|update","table|read","table|import","table|export"]
  const formatPermissionsSummary = (permissions: string[]) => {
    // Handle new JSON format
    const totalPermissions = permissions.length;

    if (totalPermissions > 0) {
      return {
        summary: `${totalPermissions} permission${totalPermissions !== 1 ? 's' : ''}`,
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
            <TableHead className="text-right">
              {t('common:actions', { defaultValue: 'Actions' })}
            </TableHead>
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
                    className="size-8 p-0"
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(role.id)}
                    className="size-8 p-0 text-destructive hover:text-destructive"
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
