import { createFileRoute } from '@tanstack/react-router';
import { UsersPage } from '@/features/app/blocks/setting/users/UsersPage';
import { SettingLayout } from '@/features/app/layouts/SettingLayout';
import { getUsersServerData } from '@/server/users';
import { createServerFn } from '@tanstack/react-start';

const loadUsers = createServerFn({ method: 'GET' }).handler(() => getUsersServerData());

export const Route = createFileRoute('/settings/users')({
  loader: async () => {
    try {
      const usersData = await loadUsers();
      return { usersData };
    } catch (error) {
      console.error('Failed to load users data:', error);
      // Return undefined to allow the component to handle the error gracefully
      return { usersData: undefined };
    }
  },
  component: UsersSettingsPageComponent,
});

function UsersSettingsPageComponent() {
  return (
    <SettingLayout>
      <UsersPage />
    </SettingLayout>
  );
}
