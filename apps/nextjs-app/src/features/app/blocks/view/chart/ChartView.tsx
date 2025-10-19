'use client';

import { useView } from '@teable/sdk';
import { ChartDisplay } from './components/ChartDisplay';
import { ChartProvider } from './components/ChartProvider';
import { ChartQuery } from './components/ChartQuery';
import { ChartSetting } from './components/ChartSetting';
import { cn, Toggle } from '@teable/ui-lib';
import { Table2 } from '@teable/icons';
import { useContext, useState } from 'react';
import { useUIConfig } from './hooks/useUIConfig';

export const ChartView = () => {
  const view = useView();
  const { isShowingSettings } = useUIConfig();
  const [isTable, setIsTable] = useState(false);
  const hasTable = (view?.options as any)?.chart?.config?.type === 'table';

  if (!view) {
    return null;
  }

  return (
    <ChartProvider view={view}>
      <div className="flex size-full">
        <div className="relative flex-1 overflow-hidden">
          <ChartDisplay previewTable={isTable} />
          {!hasTable && isShowingSettings && (
            <Toggle
              size="sm"
              variant="outline"
              pressed={isTable}
              onPressedChange={setIsTable}
              className="data-[state=on]:bg-foreground data-[state=on]:text-background absolute bottom-0.5 right-0.5 h-auto p-1.5"
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
