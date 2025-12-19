import { createFileRoute } from '@tanstack/react-router';
import { UsersPage } from '@/features/app/blocks/setting/users/UsersPage';
import { SettingLayout } from '@/features/app/layouts/SettingLayout';

export const Route = createFileRoute('/settings/users')({
  component: UsersSettingsPageComponent,
});

function UsersSettingsPageComponent() {
  return (
    <SettingLayout>
      <UsersPage />
    </SettingLayout>
  );
}

