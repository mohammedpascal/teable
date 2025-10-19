import { cn } from '@teable/ui-lib';
import { useContext } from 'react';
import { ChartContext } from './ChartProvider';
import { ChartForm } from './chart/chart-config/ChartForm';
import { TypeSelector } from './chart/chart-config/TypeSelector';

export const ChartSetting = ({ className }: { className?: string }) => {
  const { options, onOptionsChange } = useContext(ChartContext);

  const handleTypeChange = (type: any) => {
    const newConfig = { ...options?.config, type };
    onOptionsChange({
      ...options,
      config: newConfig,
    });
  };

  const handleConfigChange = (config: any) => {
    onOptionsChange({
      ...options,
      config,
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
          <TypeSelector
            type={options.config.type}
            onChange={handleTypeChange}
            className="mt-2"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium">Configuration</h3>
          <ChartForm
            value={options.config}
            onChange={handleConfigChange}
          />
        </div>
      </div>
    </div>
  );
};
