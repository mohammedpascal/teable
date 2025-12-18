import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { createQueryClient } from '@/sdk/context';

export default function LoginRoute() {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LoginPage />
    </QueryClientProvider>
  );
}
