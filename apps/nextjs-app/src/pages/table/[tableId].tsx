import { getDefaultViewId } from '@teable/openapi';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import type { NextPageWithLayout } from '@/lib/type';

const Node: NextPageWithLayout = () => {
  const router = useRouter();
  const { tableId, ...queryParams } = router.query;

  useEffect(() => {
    if (!tableId || typeof tableId !== 'string') {
      return;
    }

    const redirect = async () => {
      try {
        const result = await getDefaultViewId(tableId);
        const queryString = new URLSearchParams(queryParams as Record<string, string>).toString();
        const destination = `/table/${tableId}/${result.data.id}${queryString ? `?${queryString}` : ''}`;
        router.replace(destination);
      } catch (error) {
        console.error('Failed to get default view ID:', error);
      }
    };

    redirect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableId]);

  return <p>redirecting</p>;
};

export default Node;
