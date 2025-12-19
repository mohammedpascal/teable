import { createFileRoute } from '@tanstack/react-router';
import { ErrorPage } from '@/features/system/pages';

export const Route = createFileRoute('/_monitor/preview/error-page')({
  component: ErrorPagePreviewComponent,
});

function ErrorPagePreviewComponent() {
  const exampleError = new Error('ErrorPage example error');

  return (
    <ErrorPage
      statusCode={500}
      message={'ErrorPage preview'}
      errorId={'xxxxx-xxxxx-xxxxx-xxxxx'}
      error={exampleError}
    />
  );
}

