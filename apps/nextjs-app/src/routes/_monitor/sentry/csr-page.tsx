import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

const getAsyncError = async (): Promise<void> => {
  throw new Error(
    'Error purposely crafted for monitoring sentry (/_monitor/sentry/csr-page.tsx)'
  );
};

export const Route = createFileRoute('/_monitor/sentry/csr-page')({
  component: MonitorSentryCsrRouteComponent,
});

function MonitorSentryCsrRouteComponent() {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getAsyncError().catch((err) => setError(err));
  }, []);

  if (error) {
    throw error;
  }
  return (
    <div>
      <h1>Unexpected error</h1>
      <p>
        If you see this message, it means that an error thrown in a client-side component wasn't caught
        by the global error handler. This is a bug in the application and may affect the ability to
        display error pages and log errors on Sentry. See the monitoring page in /_monitor/sentry/csr-page.tsx.
      </p>
    </div>
  );
}

