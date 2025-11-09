import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoleList, createRole, updateRole, deleteRole } from '@teable/openapi';
import { Button } from '@teable/ui-lib/shadcn';
import { Plus } from '@teable/icons';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { SettingRight } from '../SettingRight';
import { SettingRightTitle } from '../SettingRightTitle';
import { RolesGridView } from './RolesGridView';
import { RoleDialog } from './RoleDialog';
import type { IRoleListVo, ICreateRoleRo, IUpdateRoleRo } from '@teable/openapi';

export const RolesPage = () => {
  const { t } = useTranslation(['common', 'setting']);
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<IRoleListVo | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['role-list'],
    queryFn: () => getRoleList().then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (roleData: ICreateRoleRo) => createRole(roleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-list'] });
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateRoleRo }) => updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-list'] });
      setIsDialogOpen(false);
      setEditingRole(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-list'] });
    },
  });

  const handleCreate = () => {
    setEditingRole(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (role: IRoleListVo) => {
    setEditingRole(role);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('common:confirmDelete', { defaultValue: 'Are you sure you want to delete this role?' }))) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        // Error handling is done by the mutation
        console.error('Failed to delete role:', error);
      }
    }
  };

  const handleSubmit = (roleData: ICreateRoleRo | IUpdateRoleRo) => {
    if (editingRole) {
      updateMutation.mutate({ id: editingRole.id, data: roleData as IUpdateRoleRo });
    } else {
      createMutation.mutate(roleData as ICreateRoleRo);
    }
  };

  return (
    <SettingRight title={<SettingRightTitle title={t('setting:roles.title', { defaultValue: 'Roles' })} />}>
      <div className="flex w-full flex-col gap-4 pb-8 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t('setting:roles.description', { defaultValue: 'Manage roles and permissions' })}
          </p>
          <Button onClick={handleCreate} size="sm">
            <Plus className="mr-2 size-4" />
            {t('setting:roles.addRole', { defaultValue: 'Add Role' })}
          </Button>
        </div>

        {error && (
          <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
            {t('common:error', { defaultValue: 'An error occurred' })}
          </div>
        )}

        <RolesGridView
          roles={data || []}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <RoleDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          role={editingRole}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </div>
    </SettingRight>
  );
};

