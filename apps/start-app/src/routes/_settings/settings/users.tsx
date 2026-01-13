import { createFileRoute } from '@tanstack/react-router';
import { UsersPage } from '@/features/app/blocks/setting/users/UsersPage';
import { getUserList } from '@teable/openapi';
import type { IUserListResponseVo } from '@teable/openapi';

export const Route = createFileRoute('/_settings/settings/users')({
  path: '/settings/users',
  component: UsersSettingsPageComponent,
  loader: async () => {
    const usersData: IUserListResponseVo = await getUserList().then((res) => res.data);
    return { usersData: usersData || undefined };
  }
});

function UsersSettingsPageComponent() {
  return <UsersPage />;
}

