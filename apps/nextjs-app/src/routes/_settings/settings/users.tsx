import { createFileRoute } from '@tanstack/react-router';
import { UsersPage } from '@/features/app/blocks/setting/users/UsersPage';

export const Route = createFileRoute('/_settings/settings/users')({
  path: '/settings/users',
  component: UsersSettingsPageComponent,
});

function UsersSettingsPageComponent() {
  return <UsersPage />;
}

