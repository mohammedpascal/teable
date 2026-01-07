import { createFileRoute } from '@tanstack/react-router';
import { RolesPage } from '@/features/app/blocks/setting/roles/RolesPage';

export const Route = createFileRoute('/_settings/settings/roles')({
  path: '/settings/roles',
  component: RolesSettingsPageComponent,
});

function RolesSettingsPageComponent() {
  return (
    <RolesPage />
  );
}

