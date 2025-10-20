import { useQueryClient } from '@tanstack/react-query';
import { RefreshCcw } from '@teable/icons';
import { Button, cn } from '@teable/ui-lib';

export const QueryStatus = () => {
  const queryClient = useQueryClient();

  // Default values since these properties don't exist in the current context
  const queryError = false;
  const onTabChange = (tab: string) => {
    console.log('Tab change requested:', tab);
  };

  const refreshQuery = () => {
    // Invalidate all queries since we don't have access to baseId
    queryClient.invalidateQueries();
  };

  return (
    <div
      className={cn(
        'absolute inset-x-0 top-0 flex h-10 items-center justify-center bg-green-100 text-sm text-green-900 dark:bg-green-900 dark:text-green-100 z-10',
        {
          'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100': queryError,
        }
      )}
    >
      {queryError ? 'Query Error' : 'Query Success'}
      <Button
        className={cn('h-auto text-green-900 underline dark:text-green-100', {
          'text-red-900 dark:text-red-100': queryError,
        })}
        size={'xs'}
        variant="link"
        onClick={() => onTabChange('query')}
      >
        Update Query
      </Button>
      <Button
        title="Reload Query"
        className="h-auto p-0 pt-0.5"
        size={'xs'}
        variant="link"
        onClick={refreshQuery}
      >
        <RefreshCcw />
      </Button>
    </div>
  );
};
