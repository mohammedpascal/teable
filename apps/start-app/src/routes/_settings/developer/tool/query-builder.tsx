import { createFileRoute } from '@tanstack/react-router';
import { QueryBuilder } from '@/features/app/blocks/setting/query-builder/QueryBuilder';

export const Route = createFileRoute('/_settings/developer/tool/query-builder')({
  path: '/developer/tool/query-builder',
  component: DeveloperQueryBuilderPageComponent,
});

function DeveloperQueryBuilderPageComponent() {
  return (
    <QueryBuilder />
  );
}

