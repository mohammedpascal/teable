import type { IRoleListVo, ICreateRoleRo, IUpdateRoleRo, ITableVo } from '@teable/openapi';
import { getTableList } from '@teable/openapi';
import { useQuery } from '@tanstack/react-query';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@teable/ui-lib/shadcn';
import { useTranslation } from 'next-i18next';
import { useState, useEffect, useMemo } from 'react';

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: IRoleListVo | null;
  onSubmit: (data: ICreateRoleRo | IUpdateRoleRo) => void;
  isLoading: boolean;
}

const PERMISSIONS = ['View', 'Create', 'Update', 'Delete', 'Configure'] as const;
type Permission = typeof PERMISSIONS[number];

export const RoleDialog = ({ open, onOpenChange, role, onSubmit, isLoading }: RoleDialogProps) => {
  const { t } = useTranslation(['common', 'setting']);
  const isEdit = !!role;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  // State: tableId -> Set of permissions
  const [tablePermissions, setTablePermissions] = useState<Record<string, Set<Permission>>>({});

  // Fetch tables
  const { data: tables = [], isLoading: tablesLoading } = useQuery({
    queryKey: ['table-list'],
    queryFn: () => getTableList().then((res) => res.data),
    enabled: open,
  });

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description || '');
      
      // Initialize permissions from role
      const perms: Record<string, Set<Permission>> = {};
      if (typeof role.permissions === 'object' && role.permissions !== null) {
        // New JSON format
        for (const [tableId, permArray] of Object.entries(role.permissions)) {
          if (Array.isArray(permArray)) {
            perms[tableId] = new Set(permArray.filter((p): p is Permission => 
              PERMISSIONS.includes(p as Permission)
            ));
          }
        }
      }
      setTablePermissions(perms);
    } else {
      setName('');
      setDescription('');
      setTablePermissions({});
    }
  }, [role, open]);

  const handlePermissionToggle = (tableId: string, permission: Permission) => {
    setTablePermissions((prev) => {
      const newPerms = { ...prev };
      if (!newPerms[tableId]) {
        newPerms[tableId] = new Set();
      }
      const tablePerms = new Set(newPerms[tableId]);
      if (tablePerms.has(permission)) {
        tablePerms.delete(permission);
      } else {
        tablePerms.add(permission);
      }
      if (tablePerms.size === 0) {
        delete newPerms[tableId];
      } else {
        newPerms[tableId] = tablePerms;
      }
      return newPerms;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert Set to array for each table
    const permissions: Record<string, Permission[]> = {};
    for (const [tableId, permSet] of Object.entries(tablePermissions)) {
      if (permSet.size > 0) {
        permissions[tableId] = Array.from(permSet);
      }
    }
    
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
    return Object.values(tablePermissions).some((perms) => perms.size > 0);
  }, [tablePermissions]);

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
              {tablesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground">
                    {t('common:loading', { defaultValue: 'Loading tables...' })}
                  </p>
                </div>
              ) : tables.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground">
                    {t('setting:roles.noTables', { defaultValue: 'No tables found' })}
                  </p>
                </div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">
                          {t('setting:roles.table', { defaultValue: 'Table' })}
                        </TableHead>
                        {PERMISSIONS.map((permission) => (
                          <TableHead key={permission} className="text-center">
                            {permission}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tables.map((table) => (
                        <TableRow key={table.id}>
                          <TableCell className="font-medium">{table.name}</TableCell>
                          {PERMISSIONS.map((permission) => (
                            <TableCell key={permission} className="text-center">
                              <Checkbox
                                checked={tablePermissions[table.id]?.has(permission) || false}
                                onCheckedChange={() => handlePermissionToggle(table.id, permission)}
                                disabled={isLoading}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
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

