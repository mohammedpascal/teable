import type { IBaseQuery } from '@teable/openapi';
import type { IBaseQueryBuilderRef } from '@teable/sdk';
import { BaseQueryBuilder } from '@teable/sdk';
import { Button, cn } from '@teable/ui-lib';
import { useEffect, useRef, useState } from 'react';

export const ChartQuery = () => {
  const [query, setQuery] = useState<IBaseQuery | undefined>();
  const [isLoading, setLoading] = useState(false);
  const queryBuilderRef = useRef<IBaseQueryBuilderRef>(null);

  // Default values since these properties don't exist in the current context
  const tab = 'query';
  const storage = { query };
  const onTabChange = (newTab: string) => {
    console.log('Tab change requested:', newTab);
  };
  const onStorageChange = (newStorage: Record<string, unknown>) => {
    console.log('Storage change requested:', newStorage);
  };

  useEffect(() => {
    if (tab === 'query') {
      // TODO: refactor query builder, remove setTimeout
      setTimeout(() => {
        queryBuilderRef.current?.initContext();
      });
    }
  }, [tab]);

  return (
    <div className="flex size-full flex-col">
      <div className="flex h-10 w-full items-center justify-between border-b px-6">
        <div>Query Builder</div>
        <div className="flex items-center gap-2">
          <Button
            className={cn({
              hidden: !storage?.query,
            })}
            variant="ghost"
            size="xs"
            onClick={() => onTabChange('chart')}
          >
            Cancel
          </Button>
          <Button
            size="xs"
            disabled={isLoading || !query}
            onClick={async () => {
              if (!query) {
                return;
              }
              setLoading(true);
              await onStorageChange(
                storage
                  ? {
                      ...storage,
                      query,
                    }
                  : { query }
              );
              setLoading(false);
              onTabChange('chart');
            }}
          >
            Save
          </Button>
        </div>
      </div>
      {tab === 'query' && (
        <div className="flex-1 overflow-auto">
          <BaseQueryBuilder
            ref={queryBuilderRef}
            className="border-none p-8"
            query={query}
            onChange={setQuery}
          />
        </div>
      )}
    </div>
  );
};
