import { createFileRoute } from '@tanstack/react-router';
import { RolesPage } from '@/features/app/blocks/setting/roles/RolesPage';
import { getRolesServerData } from '@/server/roles';
import { createServerFn } from '@tanstack/react-start';

const loadRoles = createServerFn({ method: 'GET' }).handler(() => getRolesServerData());

export const Route = createFileRoute('/_settings/settings/roles')({
  path: '/settings/roles',
  loader: async () => {
    try {
      const rolesData = await loadRoles();
      return { rolesData };
    } catch (error) {
      console.error('Failed to load roles data:', error);
      // Return undefined to allow the component to handle the error gracefully
      return { rolesData: undefined };
    }
  },
  component: RolesSettingsPageComponent,
});

function RolesSettingsPageComponent() {
  return (
    <RolesPage />
  );
}
