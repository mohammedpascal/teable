import { cn } from '@teable/ui-lib';
import { useContext } from 'react';
import { ChartForm } from './chart/chart-config/ChartForm';
import { TypeSelector } from './chart/chart-config/TypeSelector';
import { ChartContext } from './ChartProvider';

export const ChartSetting = ({ className }: { className?: string }) => {
  const { options, onOptionsChange } = useContext(ChartContext);

  const handleTypeChange = (type: string) => {
    const newConfig = { ...options?.config, type: type as string };
    onOptionsChange({
      ...options,
      config: newConfig as Record<string, unknown>,
    });
  };

  const handleConfigChange = (config: Record<string, unknown>) => {
    onOptionsChange({
      ...options,
      config: config as Record<string, unknown>,
    });
  };

  if (!options?.config) {
    return (
      <div className={cn('w-80 border-l bg-background p-4', className)}>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">Chart Type</h3>
            <TypeSelector
              type={options?.config?.type}
              onChange={handleTypeChange}
              className="mt-2"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-80 border-l bg-background p-4', className)}>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium">Chart Type</h3>
          <TypeSelector type={options.config.type} onChange={handleTypeChange} className="mt-2" />
        </div>
        <div>
          <h3 className="text-sm font-medium">Configuration</h3>
          <ChartForm
            value={options.config as Record<string, unknown>}
            onChange={handleConfigChange}
          />
        </div>
      </div>
    </div>
  );
};
