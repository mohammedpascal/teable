import { cn, ScrollArea } from '@teable/ui-lib';
import { useContext } from 'react';
import { ChartContext } from '../../ChartProvider';
import { ChartForm } from './ChartForm';
import { ConfigItem } from './common/ConfigItem';
import { QueryStatus } from './QueryStatus';
import { TypeSelector } from './TypeSelector';

export const ChartSetting = (props: { className?: string }) => {
  const { className } = props;
  const { options, onOptionsChange } = useContext(ChartContext);
  const config = (options as Record<string, unknown>)?.chart as Record<string, unknown> | undefined;
  const chartConfig = config?.config as Record<string, unknown> | undefined;
  if (!options) {
    return;
  }

  return (
    <ScrollArea className={cn('border-l p-4 w-80', className)}>
      <QueryStatus />
      <div className="mt-9 space-y-4">
        <ConfigItem label="Chart Type">
          <TypeSelector
            type={chartConfig?.type as 'bar' | 'line' | 'area' | 'pie' | 'table' | undefined}
            onChange={(type) =>
              onOptionsChange({
                ...options,
                chart: {
                  ...(config || {}),
                  config: { type: type as string },
                },
              } as Record<string, unknown>)
            }
          />
        </ConfigItem>
        <div>
          {chartConfig && (
            <ChartForm
              value={chartConfig as any}
              onChange={(config) => {
                onOptionsChange({
                  ...options,
                  chart: {
                    ...(config || {}),
                    config: config as Record<string, unknown>,
                  },
                } as Record<string, unknown>);
              }}
            />
          )}
        </div>
      </div>
    </ScrollArea>
  );
};
