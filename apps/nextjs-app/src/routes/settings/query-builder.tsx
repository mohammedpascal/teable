import { createFileRoute } from '@tanstack/react-router';
import { QueryBuilder } from '@/features/app/blocks/setting/query-builder/QueryBuilder';
import { SettingLayout } from '@/features/app/layouts/SettingLayout';

export const Route = createFileRoute('/settings/query-builder')({
  component: QueryBuilderPageComponent,
});

function QueryBuilderPageComponent() {
  return (
    <SettingLayout>
      <QueryBuilder />
    </SettingLayout>
  );
}

