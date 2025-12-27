import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Plus } from '@/components/icons';
import type { ICreateUserRo, IUpdateUserRo, IUserListVo } from '@teable/openapi';
import { createUser, deleteUser, updateUser } from '@teable/openapi';
import { Button, Separator } from '@/ui-lib/shadcn';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Route } from '@/routes/settings/users';
import { SettingsHeader } from '../SettingsHeader';
import { UserDialog } from './UserDialog';
import { UsersGridView } from './UsersGridView';

export const UsersPage = () => {
  const { t } = useTranslation(['common', 'setting']);
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUserListVo | null>(null);

  const { usersData } = Route.useLoaderData();

  const createMutation = useMutation({
    mutationFn: (userData: ICreateUserRo) => createUser(userData),
    onSuccess: () => {
      setIsDialogOpen(false);
      // Refetch data by navigating to the same route
      navigate({ to: '/settings/users', replace: true });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateUserRo }) => updateUser(id, data),
    onSuccess: () => {
      setIsDialogOpen(false);
      setEditingUser(null);
      // Refetch data by navigating to the same route
      navigate({ to: '/settings/users', replace: true });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      // Refetch data by navigating to the same route
      navigate({ to: '/settings/users', replace: true });
    },
  });

  const handleCreate = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (user: IUserListVo) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (
      confirm(
        t('common:confirmDelete', { defaultValue: 'Are you sure you want to delete this user?' })
      )
    ) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleSubmit = (userData: ICreateUserRo | IUpdateUserRo) => {
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data: userData as IUpdateUserRo });
    } else {
      createMutation.mutate(userData as ICreateUserRo);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-y-auto overflow-x-hidden">
      <SettingsHeader title={t('setting:users.title', { defaultValue: 'Users' })}>
        <>
          <span className="grow" />
          <Button onClick={handleCreate} size="sm">
            <Plus className="mr-2 size-4" />
            {t('setting:users.addUser', { defaultValue: 'Add User' })}
          </Button>
        </>
      </SettingsHeader>
      <Separator />
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <UsersGridView
          users={usersData?.users || []}
          total={usersData?.total || 0}
          isLoading={false}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <UserDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          user={editingUser}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </div>
    </div>
  );
};
