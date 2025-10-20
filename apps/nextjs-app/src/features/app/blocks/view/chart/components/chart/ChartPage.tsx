'use client';

import { Table2 } from '@teable/icons';
import { cn, Toggle } from '@teable/ui-lib';
import { useContext, useState } from 'react';
import { useUIConfig } from '../../hooks/useUIConfig';
import { ChartContext } from '../ChartProvider';
import { ChartSetting } from './chart-config/ChartSetting';
import { ChartDisplay } from './chart-show/ChartDisplay';

export const ChartPage = () => {
  const { options } = useContext(ChartContext);
  const { isShowingSettings } = useUIConfig();
  const [isTable, setIsTable] = useState(false);

  // Default values since these properties don't exist in the current context
  const hasTable = (options as Record<string, unknown>)?.type === 'table';

  // Always show chart display since we don't have tab switching functionality
  // if (tab === 'query' && isShowingSettings) {
  //   return <ChartQuery />;
  // }

  return (
    <div className="flex size-full">
      <div className="relative flex-1 overflow-hidden">
        <ChartDisplay previewTable={isTable} />
        {!hasTable && isShowingSettings && (
          <Toggle
            size="sm"
            variant="outline"
            pressed={isTable}
            onPressedChange={setIsTable}
            className="absolute bottom-0.5 right-0.5 h-auto p-1.5 data-[state=on]:bg-foreground data-[state=on]:text-background"
            aria-label="Toggle bold"
          >
            <Table2 />
          </Toggle>
        )}
      </div>
      {isShowingSettings && (
        <ChartSetting
          className={cn({
            hidden: !isShowingSettings,
          })}
        />
      )}
    </div>
  );
};
