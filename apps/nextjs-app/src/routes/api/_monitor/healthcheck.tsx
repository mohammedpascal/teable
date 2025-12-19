import { createFileRoute } from '@tanstack/react-router';
import { healthCheck } from '@/server/_monitor/healthcheck';

export const Route = createFileRoute('/api/_monitor/healthcheck')({
  loader: async () => {
    const response = await healthCheck();
    return response.json();
  },
  component: HealthCheckApiComponent,
});

function HealthCheckApiComponent() {
  const data = Route.useLoaderData();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

