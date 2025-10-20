'use client';

import { Table2 } from '@teable/icons';
import { useView } from '@teable/sdk';
import { cn, Toggle } from '@teable/ui-lib';
import { useState } from 'react';
import { ChartDisplay } from './components/ChartDisplay';
import { ChartProvider } from './components/ChartProvider';
import { ChartSetting } from './components/ChartSetting';
import { useUIConfig } from './hooks/useUIConfig';

export const ChartView = () => {
  const view = useView();
  const { isShowingSettings } = useUIConfig();
  const [isTable, setIsTable] = useState(false);
  const options = view?.options as Record<string, unknown>;
  const chart = options?.chart as Record<string, unknown>;
  const hasTable = chart?.config && (chart?.config as Record<string, unknown>)?.type === 'table';

  if (!view) {
    return null;
  }

  return (
    <ChartProvider view={view as unknown as Record<string, unknown>}>
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
              aria-label="Toggle table view"
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
    </ChartProvider>
  );
};
