import { createRouter, RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from './sdk/context/app/queryClient';

// Import route tree
import { routeTree } from './routeTree.gen';

// Create router instance
const router = createRouter({ routeTree });

// Create query client
const queryClient = createQueryClient();

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;

