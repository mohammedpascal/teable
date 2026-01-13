import { createLazyFileRoute } from '@tanstack/react-router';
import type { ITableVo } from '@teable/openapi';
import { Design } from '@/features/app/blocks/design/Design';
import { TableProvider } from '@/sdk/context';

export const Route = createLazyFileRoute('/_settings/settings/design')({
  path: '/settings/design',
  component: DesignPageComponent,
});

function DesignPageComponent() {
  // TODO: Load server data via loader
  const tableServerData: ITableVo[] | undefined = undefined;

  return (
    <TableProvider serverData={tableServerData}>
      <Design />
    </TableProvider>
  );
}

