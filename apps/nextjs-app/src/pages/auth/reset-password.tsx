import { QueryClientProvider } from '@tanstack/react-query';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';
import { createQueryClient } from '@/sdk/context';

export default function ForgetPasswordRoute() {
  const queryClient = createQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ResetPasswordPage />
    </QueryClientProvider>
  );
}
