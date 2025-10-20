/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { ChevronsUpDown, Table2 } from '@teable/icons';
import { Button, cn, Popover, PopoverContent, PopoverTrigger } from '@teable/ui-lib';
import { BarChart, LineChart, PieChart, AreaChart } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { IChartConfig } from '../chart-show/types';

export const TypeSelector = (props: {
  className?: string;
  type?: IChartConfig['type'];
  onChange: (type: IChartConfig['type']) => void;
}) => {
  const { className, type, onChange } = props;
  const [open, setOpen] = useState(false);

  const options = useMemo(() => {
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
        label: 'Pie',
        value: 'pie',
        Icon: PieChart,
      },
      {
        label: 'Area',
        value: 'area',
        Icon: AreaChart,
      },
      {
        label: 'Table',
        value: 'table',
        Icon: Table2,
      },
    ] as const;
  }, []);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between h-8 font-normal', className)}
        >
          {options.find((o) => o.value === type)?.label ?? (
            <span className="text-muted-foreground">Select chart type</span>
          )}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-wrap gap-4">
          {options.map(({ label, Icon, value }) => (
            <div
              key={value}
              onClick={() => {
                onChange(value);
                setOpen(false);
              }}
            >
              <div
                className={cn('hover:border-primary cursor-pointer rounded-full border p-3', {
                  'border-primary': type === value,
                })}
              >
                <Icon />
              </div>
              <div className="text-center text-sm">{label}</div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
