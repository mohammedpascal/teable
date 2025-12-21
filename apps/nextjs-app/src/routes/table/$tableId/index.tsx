import { createFileRoute, redirect } from '@tanstack/react-router';
import { getDefaultViewId } from '@teable/openapi';

export const Route = createFileRoute('/table/$tableId/')({
  loader: async ({ params }) => {
    const { tableId } = params;

    if (!tableId) {
      throw redirect({ to: '/' });
    }

    try {
      const result = await getDefaultViewId(tableId);
      const destination = `/table/${tableId}/${result.data.id}`;

      console.log({ destination });
      throw redirect({ to: destination });
    } catch (error) {
      // If it's already a redirect, re-throw it
      if (error && typeof error === 'object' && 'status' in error && error.status === 301) {
        throw error;
      }
      console.error('Failed to get default view ID:', error);
      // Redirect to home on error
      throw redirect({ to: '/' });
    }
  },
  component: TableIdRouteComponent,
});

function TableIdRouteComponent() {
  return <p>redirecting999</p>;
}
