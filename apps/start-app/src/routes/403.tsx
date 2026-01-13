import { createFileRoute } from '@tanstack/react-router';
import { ForbiddenPage } from '@/features/system/pages';

export const Route = createFileRoute('/403')({
  component: ForbiddenComponent,
});

function ForbiddenComponent() {
  return <ForbiddenPage />;
}

