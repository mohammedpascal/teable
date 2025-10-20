import { Label, RadioGroup, RadioGroupItem } from '@teable/ui-lib';
import { useMemo } from 'react';
import type { IChartBaseAxisDisplay } from '../../chart-show/types';

export const YAxisPositionEditor = (props: {
  value?: IChartBaseAxisDisplay['position'];
  onChange: (value: IChartBaseAxisDisplay['position']) => void;
}) => {
  const { value: position, onChange } = props;
  const positions = useMemo(() => {
    return [
      {
        label: 'Auto',
        value: 'auto',
      },
      {
        label: 'Left',
        value: 'left',
      },
      {
        label: 'Right',
        value: 'right',
      },
    ] as const;
  }, []);

  return (
    <RadioGroup className="flex gap-4" value={position} onValueChange={onChange}>
      {positions.map(({ label, value }) => (
        <div key={value} className="flex items-center gap-2">
          <RadioGroupItem value={value} id={value} />
          <Label
            title={label}
            htmlFor={value}
            className="flex items-center gap-2 text-xs font-normal"
          >
            {label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};
