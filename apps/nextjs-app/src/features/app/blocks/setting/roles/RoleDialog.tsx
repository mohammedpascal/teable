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
import { useState, useEffect } from 'react';

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: IRoleListVo | null;
  onSubmit: (data: ICreateRoleRo | IUpdateRoleRo) => void;
  isLoading: boolean;
}

const PERMISSIONS = ['View', 'Create', 'Update', 'Delete', 'Configure'] as const;

export const RoleDialog = ({ open, onOpenChange, role, onSubmit, isLoading }: RoleDialogProps) => {
  const { t } = useTranslation(['common', 'setting']);
  const isEdit = !!role;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description || '');
      const permissions = role.permissions
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
      setSelectedPermissions(new Set(permissions));
    } else {
      setName('');
      setDescription('');
      setSelectedPermissions(new Set());
    }
  }, [role, open]);

  const handlePermissionToggle = (permission: string) => {
    const newPermissions = new Set(selectedPermissions);
    if (newPermissions.has(permission)) {
      newPermissions.delete(permission);
    } else {
      newPermissions.add(permission);
    }
    setSelectedPermissions(newPermissions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const permissionsString = Array.from(selectedPermissions).join(', ');
    
    if (isEdit) {
      onSubmit({
        name,
        description: description || undefined,
        permissions: permissionsString,
      } as IUpdateRoleRo);
    } else {
      onSubmit({
        name,
        description: description || undefined,
        permissions: permissionsString,
      } as ICreateRoleRo);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
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
              <div className="space-y-2 rounded-md border p-4">
                {PERMISSIONS.map((permission) => (
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
                      {permission}
                    </Label>
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
            <Button type="submit" disabled={isLoading || selectedPermissions.size === 0}>
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

