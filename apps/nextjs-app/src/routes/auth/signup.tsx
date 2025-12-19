import { createFileRoute } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { createQueryClient } from '@/sdk/context';

export const Route = createFileRoute('/auth/signup')({
  component: SignupRouteComponent,
});

function SignupRouteComponent() {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LoginPage />
    </QueryClientProvider>
  );
}

