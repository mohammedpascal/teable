import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { getDefaultViewId } from '@teable/openapi';
import { useEffect } from 'react';

export const Route = createFileRoute('/table/$tableId/')({
  component: TableIdRouteComponent,
});

function TableIdRouteComponent() {
  const { tableId } = Route.useParams();
  const search = useSearch({ from: Route.fullPath });
  const navigate = useNavigate();

  useEffect(() => {
    if (!tableId) {
      return;
    }

    const redirect = async () => {
      try {
        const result = await getDefaultViewId(tableId);
        const queryString = new URLSearchParams(search as Record<string, string>).toString();
        const destination = `/table/${tableId}/${result.data.id}${queryString ? `?${queryString}` : ''}`;
        navigate({ to: destination, replace: true });
      } catch (error) {
        console.error('Failed to get default view ID:', error);
      }
    };

    redirect();
  }, [tableId, navigate, search]);

  return <p>redirecting999</p>;
}
