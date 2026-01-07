import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Plus } from '@/components/icons';
import type { ICreateRoleRo, IRoleListVo, IUpdateRoleRo } from '@teable/openapi';
import { createRole, deleteRole, updateRole } from '@teable/openapi';
import { Button, Separator } from '@/ui-lib/shadcn';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Route } from '@/routes/_settings/settings/roles';
import { SettingsHeader } from '../SettingsHeader';
import { RoleDialog } from './RoleDialog';
import { RolesGridView } from './RolesGridView';

export const RolesPage = () => {
  const { t } = useTranslation(['common', 'setting']);
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<IRoleListVo | null>(null);

  const { rolesData } = Route.useLoaderData();

  const createMutation = useMutation({
    mutationFn: (roleData: ICreateRoleRo) => createRole(roleData),
    onSuccess: () => {
      setIsDialogOpen(false);
      // Refetch data by navigating to the same route
      navigate({ to: '/settings/roles', replace: true });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateRoleRo }) => updateRole(id, data),
    onSuccess: () => {
      setIsDialogOpen(false);
      setEditingRole(null);
      // Refetch data by navigating to the same route
      navigate({ to: '/settings/roles', replace: true });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => {
      // Refetch data by navigating to the same route
      navigate({ to: '/settings/roles', replace: true });
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
    if (
      confirm(
        t('common:confirmDelete', { defaultValue: 'Are you sure you want to delete this role?' })
      )
    ) {
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
    <div className="flex h-screen w-full flex-col overflow-y-auto overflow-x-hidden">
      <SettingsHeader title={t('setting:roles.title', { defaultValue: 'Roles' })}>
        <>
          <span className="grow" />
          <Button onClick={handleCreate} size="sm">
            <Plus className="mr-2 size-4" />
            {t('setting:roles.addRole', { defaultValue: 'Add Role' })}
          </Button>
        </>
      </SettingsHeader>
      <Separator />
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <RolesGridView
          roles={rolesData || []}
          isLoading={false}
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
    </div>
  );
};
