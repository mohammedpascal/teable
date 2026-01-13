import { createFileRoute } from '@tanstack/react-router';
import { sentryMonitor } from '@/server/_monitor/sentry';

export const Route = createFileRoute('/api/_monitor/sentry')({
  loader: async () => {
    await sentryMonitor();
  },
  component: SentryMonitorApiComponent,
});

function SentryMonitorApiComponent() {
  return <div>Sentry monitor API route</div>;
}

