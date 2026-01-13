import * as Sentry from '@sentry/react';

export async function sentryMonitor() {
  const error = new Error('Error purposely crafted for monitoring sentry (/server/_monitor/sentry.ts)');
  Sentry.captureException(error);
  throw error;
}

