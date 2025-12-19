import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_monitor/sentry/ssr-page')({
  component: MonitorSentrySsrRouteComponent,
});

function MonitorSentrySsrRouteComponent() {
  return (
    <div>
      <h1>Unexpected error</h1>
      <p>
        If you see this message, it means that an error thrown in a server function wasn't caught by
        the global error handler. This is a bug in the application and may affect the ability to display
        error pages and log errors on Sentry. See the monitoring page in /_monitor/sentry/ssr-page.tsx.
      </p>
    </div>
  );
}

