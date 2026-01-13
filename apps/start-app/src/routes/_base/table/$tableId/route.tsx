import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_base/table/$tableId')({
  path: '/table/$tableId',
  component: TableLayout,
});

function TableLayout() {
  return <Outlet />;
}

