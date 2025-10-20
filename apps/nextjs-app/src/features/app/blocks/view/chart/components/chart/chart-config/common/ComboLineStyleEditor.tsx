import { Label, RadioGroup, RadioGroupItem } from '@teable/ui-lib';
import { useMemo } from 'react';
import type { IChartBaseAxisDisplay } from '../../chart-show/types';

type ILineStyle = Extract<IChartBaseAxisDisplay, { lineStyle: unknown }>['lineStyle'];

export const ComboLineStyleEditor = (props: {
  value?: ILineStyle;
  onChange: (value: ILineStyle) => void;
}) => {
  const { value: displayValue, onChange } = props;
  const lineStyles = useMemo(() => {
    return [
      {
        label: 'Normal',
        value: 'normal',
      },
      {
        label: 'Linear',
        value: 'linear',
      },
      {
        label: 'Step',
        value: 'step',
      },
    ];
  }, []);

  return (
    <RadioGroup className="flex gap-4" value={displayValue} onValueChange={onChange}>
      {lineStyles.map(({ label, value }) => (
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
