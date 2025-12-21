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

    // Subscribe to navigation events to control progress bar
    const unsubscribeBeforeLoad = router.subscribe('onBeforeLoad', () => {
      handleStart();
    });

    const unsubscribeOnLoad = router.subscribe('onLoad', () => {
      handleStop();
    });

    const unsubscribeOnError = router.subscribe('onError', () => {
      handleStop();
    });

    return () => {
      unsubscribeBeforeLoad?.();
      unsubscribeOnLoad?.();
      unsubscribeOnError?.();
      handleStop(); // Safety cleanup
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
