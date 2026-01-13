import { createFileRoute } from '@tanstack/react-router';
import { BaseLayout } from '@/features/app/layouts/BaseLayout';

export const Route = createFileRoute('/_base')({
  component: BaseLayoutComponent,
});

function BaseLayoutComponent() {
  return <BaseLayout />;
}
