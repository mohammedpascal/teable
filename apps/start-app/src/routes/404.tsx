import { createFileRoute } from '@tanstack/react-router';
import { NotFoundPage } from '@/features/system/pages';

export const Route = createFileRoute('/404')({
  component: NotFoundComponent,
});

function NotFoundComponent() {
  return <NotFoundPage />;
}

