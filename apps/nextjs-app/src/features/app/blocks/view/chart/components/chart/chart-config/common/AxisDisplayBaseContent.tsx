import type { IChartBaseAxisDisplay } from '../../chart-show/types';
import { ComboLineStyleEditor } from './ComboLineStyleEditor';
import { ComboTypeEditor } from './ComboTypeEditor';
import { ConfigItem } from './ConfigItem';
import { YAxisPositionEditor } from './YAxisPositionEditor';

export const AxisDisplayBaseContent = (props: {
  value: IChartBaseAxisDisplay;
  onChange: (value: IChartBaseAxisDisplay) => void;
}) => {
  const { value: displayValue, onChange } = props;
  return (
    <>
      <ConfigItem label="Display Type">
        <ComboTypeEditor
          value={displayValue.type}
          onChange={(type) => {
            switch (type) {
              case 'bar': {
                return onChange({
                  type,
                  position: displayValue.position,
                });
              }

              case 'area':
              case 'line': {
                return onChange({
                  lineStyle: 'normal',
                  ...displayValue,
                  position: displayValue.position,
                  type,
                });
              }
              default:
                throw new Error('Invalid display type');
            }
          }}
        />
      </ConfigItem>
      {displayValue.type !== 'bar' && (
        <ConfigItem label={'Line Style'}>
          <ComboLineStyleEditor
            value={displayValue.lineStyle}
            onChange={(val) => {
              onChange({
                ...displayValue,
                lineStyle: val,
              });
            }}
          />
        </ConfigItem>
      )}
      <ConfigItem label={'Y-axis position'}>
        <YAxisPositionEditor
          value={displayValue.position}
          onChange={(val) => {
            if (!displayValue) {
              return;
            }
            onChange({
              ...displayValue,
              position: val,
            });
          }}
        />
      </ConfigItem>
    </>
  );
};
