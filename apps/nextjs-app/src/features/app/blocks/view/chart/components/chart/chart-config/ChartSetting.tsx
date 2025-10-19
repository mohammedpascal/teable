import { cn, ScrollArea } from '@teable/ui-lib';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ChartContext } from '../../ChartProvider';
import { ChartForm } from './ChartForm';
import { ConfigItem } from './common/ConfigItem';
import { QueryStatus } from './QueryStatus';
import { TypeSelector } from './TypeSelector';

export const ChartSetting = (props: { className?: string }) => {
  const { className } = props;
  const { options, onOptionsChange } = useContext(ChartContext);
  const { t } = useTranslation();
  const config = (options as any)?.chart?.config;
  if (!options) {
    return;
  }

  return (
    <ScrollArea className={cn('border-l p-4 w-80', className)}>
      <QueryStatus />
      <div className="mt-9 space-y-4">
        <ConfigItem label="Chart Type">
          <TypeSelector
            type={config?.type}
            onChange={(type) =>
              onOptionsChange({
                ...options,
                chart: {
                  ...(options as any).chart,
                  config: { type },
                },
              } as any)
            }
          />
        </ConfigItem>
        <div>
          {config && (
            <ChartForm
              value={config}
              onChange={(config) => {
                onOptionsChange({
                  ...options,
                  chart: {
                    ...(options as any).chart,
                    config,
                  },
                } as any);
              }}
            />
          )}
        </div>
      </div>
    </ScrollArea>
  );
};
