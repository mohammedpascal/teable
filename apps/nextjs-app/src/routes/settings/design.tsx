import { createFileRoute } from '@tanstack/react-router';
import type { ITableVo } from '@teable/openapi';
import { Design } from '@/features/app/blocks/design/Design';
import { SettingLayout } from '@/features/app/layouts/SettingLayout';
import { TableProvider } from '@/sdk/context';

export const Route = createFileRoute('/settings/design')({
  component: DesignPageComponent,
});

function DesignPageComponent() {
  // TODO: Load server data via loader
  const tableServerData: ITableVo[] | undefined = undefined;

  return (
    <SettingLayout>
      <TableProvider serverData={tableServerData}>
        <Design />
      </TableProvider>
    </SettingLayout>
  );
}

