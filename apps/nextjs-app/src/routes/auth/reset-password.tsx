import { createFileRoute } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';
import { createQueryClient } from '@/sdk/context';

export const Route = createFileRoute('/auth/reset-password')({
  component: ResetPasswordRouteComponent,
});

function ResetPasswordRouteComponent() {
  const queryClient = createQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ResetPasswordPage />
    </QueryClientProvider>
  );
}

