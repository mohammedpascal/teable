import { createFileRoute } from '@tanstack/react-router';
import { RolesPage } from '@/features/app/blocks/setting/roles/RolesPage';
import { SettingLayout } from '@/features/app/layouts/SettingLayout';

export const Route = createFileRoute('/settings/roles')({
  component: RolesSettingsPageComponent,
});

function RolesSettingsPageComponent() {
  return (
    <SettingLayout>
      <RolesPage />
    </SettingLayout>
  );
}

