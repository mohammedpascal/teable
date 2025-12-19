import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/table/$tableId')({
  component: TableLayout,
});

function TableLayout() {
  return <Outlet />;
}
