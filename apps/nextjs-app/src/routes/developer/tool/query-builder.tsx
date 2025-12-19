import { createFileRoute } from '@tanstack/react-router';
import { QueryBuilder } from '@/features/app/blocks/setting/query-builder/QueryBuilder';
import { SettingLayout } from '@/features/app/layouts/SettingLayout';

export const Route = createFileRoute('/developer/tool/query-builder')({
  component: DeveloperQueryBuilderPageComponent,
});

function DeveloperQueryBuilderPageComponent() {
  return (
    <SettingLayout>
      <QueryBuilder />
    </SettingLayout>
  );
}

