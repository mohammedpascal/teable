import { createFileRoute } from '@tanstack/react-router';
import { RolesPage } from '@/features/app/blocks/setting/roles/RolesPage';
import { getRoleList, IRoleListResponseVo } from '@teable/openapi';

export const Route = createFileRoute('/_settings/settings/roles')({
  component: RolesSettingsPageComponent,
  loader: async () => {
    const rolesData: IRoleListResponseVo = await getRoleList().then((res) => res.data);
    return { rolesData: rolesData || undefined };
  }
});

function RolesSettingsPageComponent() {
  return <RolesPage />;
}
