import { Spin } from '@teable/ui-lib';
import { useContext } from 'react';
import { useBaseQueryData } from '../hooks/useBaseQueryData';
import { ChartCombo } from './chart/chart-show/combo/Combo';
import { ChartPie } from './chart/chart-show/pie/Pie';
import { ChartTable } from './chart/chart-show/table/ChartTable';
import { ChartContext } from './ChartProvider';

export const ChartDisplay = (props: { previewTable?: boolean }) => {
  const { previewTable } = props;
  const { options } = useContext(ChartContext);
  const queryData = useBaseQueryData();

  if (!queryData) {
    return (
      <div>
        <Spin />
      </div>
    );
  }

  if (previewTable) {
    return <ChartTable />;
  }
  if (!options?.config?.type) {
    return;
  }
  switch (options?.config?.type) {
    case 'bar':
    case 'line':
    case 'area':
      return <ChartCombo config={options.config as any} defaultType={options?.config?.type} />;
    case 'pie':
      return <ChartPie config={options.config as any} />;
    case 'table':
      return <ChartTable config={options.config as any} />;
    default:
      return <div>Chart type not supported</div>;
  }
};
