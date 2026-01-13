import { createFileRoute } from '@tanstack/react-router';
import { QueryBuilder } from '@/features/app/blocks/setting/query-builder/QueryBuilder';

export const Route = createFileRoute('/_settings/settings/query-builder')({
  path: '/settings/query-builder',
  component: QueryBuilderPageComponent,
});

function QueryBuilderPageComponent() {
  return (
    <QueryBuilder />
  );
}

