import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from '@teable/icons';
import type { ICreateUserRo, IUpdateUserRo, IUserListVo } from '@teable/openapi';
import { createUser, deleteUser, getUserList, updateUser } from '@teable/openapi';
import { Button, Separator } from '@teable/ui-lib/shadcn';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { SettingsHeader } from '../SettingsHeader';
import { UserDialog } from './UserDialog';
import { UsersGridView } from './UsersGridView';

export const UsersPage = () => {
  const { t } = useTranslation(['common', 'setting']);
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUserListVo | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['user-list'],
    queryFn: () => getUserList().then((res) => res.data),
  });

  const createMutation = useMutation({
    mutationFn: (userData: ICreateUserRo) => createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-list'] });
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateUserRo }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-list'] });
      setIsDialogOpen(false);
      setEditingUser(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-list'] });
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
          users={data?.users || []}
          total={data?.total || 0}
          isLoading={isLoading}
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
