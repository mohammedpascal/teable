import { Input } from '@teable/ui-lib';
import { useState } from 'react';
import type { IChartYAxisDisplay } from '../../chart-show/types';
import { ConfigItem } from './ConfigItem';

export const ComboYAxisDisplayEditor = (props: {
  value?: IChartYAxisDisplay;
  onChange: (value?: IChartYAxisDisplay) => void;
}) => {
  const { value, onChange } = props;
  const [label, setLabel] = useState(value?.label || '');
  const [max, setMax] = useState(value?.range?.max);
  const [min, setMin] = useState(value?.range?.min);

  return (
    <div className="space-y-2">
      <ConfigItem label="Label">
        <Input
          className="h-8 text-[13px]"
          value={label}
          onBlur={() => onChange({ ...value, label })}
          onChange={(e) => setLabel(e.target.value)}
        />
      </ConfigItem>
      <ConfigItem label="Range">
        <div className="flex items-center gap-1">
          <span className="whitespace-nowrap text-muted-foreground">Min</span>
          <Input
            type="number"
            className="h-7 text-[13px]"
            value={min ?? ''}
            onChange={(e) => setMin(e.target.value.length ? parseFloat(e.target.value) : undefined)}
            onBlur={() => {
              onChange({
                ...value,
                range: {
                  ...value?.range,
                  min,
                },
              });
            }}
          />
          <span className="ml-2 whitespace-nowrap text-muted-foreground">Max</span>
          <Input
            type="number"
            className="h-7 text-[13px]"
            value={max ?? ''}
            onChange={(e) => setMax(e.target.value.length ? parseFloat(e.target.value) : undefined)}
            onBlur={() => {
              onChange({
                ...value,
                range: {
                  ...value?.range,
                  max,
                },
              });
            }}
          />
        </div>
      </ConfigItem>
    </div>
  );
};
