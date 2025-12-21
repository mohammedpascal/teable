import { QueryClientProvider } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ForgetPasswordPage } from '@/features/auth/pages/ForgetPasswordPage';
import { createQueryClient } from '@/sdk/context';

export const Route = createFileRoute('/auth/forget-password')({
  component: ForgetPasswordRouteComponent,
});

function ForgetPasswordRouteComponent() {
  const queryClient = createQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ForgetPasswordPage />
    </QueryClientProvider>
  );
}
