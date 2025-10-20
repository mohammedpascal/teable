import type { IAreaConfig } from '../../chart-show/types';
import { SwitchEditor } from '../common/SwitchEditor';
import { ComboForm } from './ComboForm';

export const AreaForm = (props: {
  config: IAreaConfig;
  onChange: (config: IAreaConfig) => void;
}) => {
  const { config, onChange } = props;

  return (
    <div className="space-y-5">
      <ComboForm
        type="area"
        config={config}
        onChange={(val) => {
          onChange({
            type: 'area',
            ...val,
          });
        }}
      />
      <SwitchEditor
        label={'Stack'}
        value={config.stack}
        onChange={(checked) => {
          onChange({
            ...config,
            stack: checked,
          });
        }}
      />
    </div>
  );
};
