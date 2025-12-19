import { createFileRoute, ErrorComponentProps } from '@tanstack/react-router';
import * as Sentry from '@sentry/react';
import { ErrorPage } from '@/features/system/pages';

export const Route = createFileRoute('/_error')({
  component: ErrorRouteComponent,
});

function ErrorRouteComponent({ error }: ErrorComponentProps) {
  const err = error instanceof Error ? error : undefined;
  let sentryErrorId: string | undefined;

  if (err) {
    try {
      sentryErrorId = Sentry.captureException(err);
    } catch (e) {
      console.error(`Couldn't send error to sentry: ${e instanceof Error ? e.message : 'unknown'}`);
    }
  }

  return (
    <ErrorPage
      error={err}
      errorId={sentryErrorId}
      statusCode={500}
    />
  );
}

