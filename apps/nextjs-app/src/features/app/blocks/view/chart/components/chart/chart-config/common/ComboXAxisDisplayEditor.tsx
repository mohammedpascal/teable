import { Input } from '@teable/ui-lib';
import { useState } from 'react';
import type { IChartXAxisDisplay } from '../../chart-show/types';
import { ConfigItem } from './ConfigItem';

export const ComboXAxisDisplayEditor = (props: {
  value?: IChartXAxisDisplay;
  onChange: (value?: IChartXAxisDisplay) => void;
}) => {
  const { value: display, onChange } = props;
  const [value, setValue] = useState(display?.label || '');

  return (
    <ConfigItem label={'Label'}>
      <Input
        className="h-8 text-[13px]"
        value={value || ''}
        onBlur={() =>
          onChange({
            ...display,
            label: value,
          })
        }
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </ConfigItem>
  );
};
