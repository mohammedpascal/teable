import { QueryClientProvider } from '@tanstack/react-query';
import { ForgetPasswordPage } from '@/features/auth/pages/ForgetPasswordPage';
import { createQueryClient } from '@/sdk/context';

export default function ForgetPasswordRoute() {
  const queryClient = createQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ForgetPasswordPage />
    </QueryClientProvider>
  );
}
