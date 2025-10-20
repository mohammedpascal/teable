import { Label, RadioGroup, RadioGroupItem } from '@teable/ui-lib';
import { AreaChart, BarChart, LineChart } from 'lucide-react';
import { useMemo } from 'react';
import type { IChartBaseAxisDisplay } from '../../chart-show/types';

export const ComboTypeEditor = (props: {
  value?: IChartBaseAxisDisplay['type'];
  onChange: (value: IChartBaseAxisDisplay['type']) => void;
}) => {
  const { value: displayType, onChange } = props;
  const displayTypes = useMemo(() => {
    return [
      {
        label: 'Bar',
        value: 'bar',
        Icon: BarChart,
      },
      {
        label: 'Line',
        value: 'line',
        Icon: LineChart,
      },
      {
        label: 'Area',
        value: 'area',
        Icon: AreaChart,
      },
    ] as const;
  }, []);

  return (
    <RadioGroup className="flex gap-4" value={displayType} onValueChange={onChange}>
      {displayTypes.map(({ label, Icon, value }) => (
        <div key={value} className="flex items-center gap-2">
          <RadioGroupItem value={value} id={value} />
          <Label
            title={label}
            htmlFor={value}
            className="flex items-center rounded border p-1 text-xs font-normal"
          >
            <Icon className="size-5" />
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};
