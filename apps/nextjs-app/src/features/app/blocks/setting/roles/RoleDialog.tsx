import type { IRoleListVo, ICreateRoleRo, IUpdateRoleRo } from '@teable/openapi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@teable/ui-lib/shadcn';
import { Button } from '@teable/ui-lib/shadcn';
import { Input } from '@teable/ui-lib/shadcn';
import { Label } from '@teable/ui-lib/shadcn';
import { Checkbox } from '@teable/ui-lib/shadcn';
import { useTranslation } from 'next-i18next';
import { useState, useEffect, useMemo } from 'react';

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: IRoleListVo | null;
  onSubmit: (data: ICreateRoleRo | IUpdateRoleRo) => void;
  isLoading: boolean;
}

const PERMISSIONS = [
  'record|create',
  'record|delete',
  'record|read',
  'record|update',
  'view|create',
  'view|delete',
  'view|read',
  'view|update',
  'table|create',
  'table|delete',
  'table|read',
  'table|update',
  'table|import',
  'table|export',
] as const;

type Permission = typeof PERMISSIONS[number];

const PERMISSION_GROUPS = [
  {
    label: 'Records',
    permissions: ['record|create', 'record|delete', 'record|read', 'record|update'] as const,
  },
  {
    label: 'Views',
    permissions: ['view|create', 'view|delete', 'view|read', 'view|update'] as const,
  },
  {
    label: 'Tables',
    permissions: [
      'table|create',
      'table|delete',
      'table|read',
      'table|update',
      'table|import',
      'table|export',
    ] as const,
  },
] as const;

const PERMISSION_LABELS: Record<Permission, string> = {
  'record|create': 'Create record',
  'record|delete': 'Delete record',
  'record|read': 'Read record',
  'record|update': 'Update record',
  'view|create': 'Create view',
  'view|delete': 'Delete view',
  'view|read': 'Read view',
  'view|update': 'Update view',
  'table|create': 'Create table',
  'table|delete': 'Delete table',
  'table|read': 'Read table',
  'table|update': 'Update table',
  'table|import': 'Import data into table',
  'table|export': 'Export table data',
};

export const RoleDialog = ({ open, onOpenChange, role, onSubmit, isLoading }: RoleDialogProps) => {
  const { t } = useTranslation(['common', 'setting']);
  const isEdit = !!role;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  // State: Set of selected action permissions
  const [selectedPermissions, setSelectedPermissions] = useState<Set<Permission>>(new Set());

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description || '');

      // Initialize permissions from role
      const perms = new Set<Permission>();
      if (Array.isArray(role.permissions)) {
        // New format: array of action strings
        role.permissions.forEach((perm) => {
          if (PERMISSIONS.includes(perm as Permission)) {
            perms.add(perm as Permission);
          }
        });
      } else if (typeof role.permissions === 'object' && role.permissions !== null) {
        // Legacy format: object with table IDs
        for (const permArray of Object.values(role.permissions)) {
          if (Array.isArray(permArray)) {
            permArray.forEach((perm) => {
              if (PERMISSIONS.includes(perm as Permission)) {
                perms.add(perm as Permission);
              }
            });
          }
        }
      }
      setSelectedPermissions(perms);
    } else {
      setName('');
      setDescription('');
      setSelectedPermissions(new Set());
    }
  }, [role, open]);

  const handlePermissionToggle = (permission: Permission) => {
    setSelectedPermissions((prev) => {
      const newPerms = new Set(prev);
      if (newPerms.has(permission)) {
        newPerms.delete(permission);
      } else {
        newPerms.add(permission);
      }
      return newPerms;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert Set to array of action strings
    const permissions = Array.from(selectedPermissions);

    if (isEdit) {
      onSubmit({
        name,
        description: description || undefined,
        permissions,
      } as IUpdateRoleRo);
    } else {
      onSubmit({
        name,
        description: description || undefined,
        permissions,
      } as ICreateRoleRo);
    }
  };

  const hasAnyPermissions = useMemo(() => {
    return selectedPermissions.size > 0;
  }, [selectedPermissions]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t('setting:roles.editRole', { defaultValue: 'Edit Role' })
              : t('setting:roles.addRole', { defaultValue: 'Add Role' })}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t('setting:roles.editRoleDescription', { defaultValue: 'Update role information and permissions' })
              : t('setting:roles.addRoleDescription', { defaultValue: 'Create a new role with specific permissions' })}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                {t('setting:roles.name', { defaultValue: 'Name' })}
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">
                {t('setting:roles.description', { defaultValue: 'Description' })}
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                placeholder={t('setting:roles.descriptionPlaceholder', {
                  defaultValue: 'Optional description for this role',
                })}
              />
            </div>
            <div className="grid gap-2">
              <Label>
                {t('setting:roles.permissions', { defaultValue: 'Permissions' })}
              </Label>
              <div className="rounded-md border p-4 space-y-6">
                {PERMISSION_GROUPS.map((group) => (
                  <div key={group.label} className="space-y-3">
                    <h4 className="font-semibold text-sm">{group.label}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {group.permissions.map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission}
                            checked={selectedPermissions.has(permission)}
                            onCheckedChange={() => handlePermissionToggle(permission)}
                            disabled={isLoading}
                          />
                          <Label
                            htmlFor={permission}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {PERMISSION_LABELS[permission]}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {t('common:cancel', { defaultValue: 'Cancel' })}
            </Button>
            <Button type="submit" disabled={isLoading || !hasAnyPermissions}>
              {isLoading
                ? t('common:loading', { defaultValue: 'Loading...' })
                : isEdit
                  ? t('common:save', { defaultValue: 'Save' })
                  : t('common:create', { defaultValue: 'Create' })}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

