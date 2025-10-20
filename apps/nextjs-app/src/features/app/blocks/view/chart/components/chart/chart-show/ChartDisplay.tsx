import { Spin } from '@teable/ui-lib';
import { useContext } from 'react';
import { useBaseQueryData } from '../../../hooks/useBaseQueryData';
import { ChartContext } from '../../ChartProvider';
import { ChartCombo } from './combo/Combo';
import { ChartPie } from './pie/Pie';
import { ChartTable } from './table/ChartTable';

export const ChartDisplay = (props: { previewTable?: boolean }) => {
  const { previewTable } = props;
  const { options } = useContext(ChartContext);
  const queryData = useBaseQueryData();

  // Default values since these properties don't exist in the current context
  const queryError = null;

  if (queryError) {
    return (
      <div className="font-sm flex size-full items-center justify-center text-center text-destructive">
        Error: {queryError}
      </div>
    );
  }

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

  // Access the chart type from options directly
  const chartType = (options as Record<string, unknown>)?.type;
  if (!chartType) {
    return null;
  }

  switch (chartType) {
    case 'bar':
    case 'line':
    case 'area':
      return (
        <ChartCombo config={options as any} defaultType={chartType as 'bar' | 'line' | 'area'} />
      );
    case 'pie':
      return <ChartPie config={options as any} />;
    case 'table':
      return <ChartTable config={options as any} />;
    default:
      return <div>Chart type not supported</div>;
  }
};
