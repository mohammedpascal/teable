'use client';

import { useRouter } from '@tanstack/react-router';
import NProgress from 'nprogress';
import { useEffect } from 'react';

NProgress.configure({ showSpinner: false });

export default function RouterProgressBar() {
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => {
      NProgress.start();
    };
    const handleStop = () => {
      NProgress.done();
    };

    // TanStack Router doesn't have events like Next.js, so we'll use navigation state
    // For now, we'll trigger on route changes via router state
    const unsubscribe = router.subscribe('onBeforeLoad', () => {
      handleStart();
    });

    // Note: TanStack Router handles navigation differently
    // This is a simplified version - may need adjustment based on actual router API
    return () => {
      unsubscribe?.();
      handleStop();
    };
  }, [router]);

  return (
    <style>
      {`
        #nprogress .bar {
          height: 2px;
        }
     `}
    </style>
  );
}
