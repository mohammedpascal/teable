import { Spin } from '@teable/ui-lib';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useBaseQueryData } from '../hooks/useBaseQueryData';
import { ChartContext } from './ChartProvider';
import { ChartCombo } from './chart/chart-show/combo/Combo';
import { ChartPie } from './chart/chart-show/pie/Pie';
import { ChartTable } from './chart/chart-show/table/ChartTable';

export const ChartDisplay = (props: { previewTable?: boolean }) => {
  const { previewTable } = props;
  const { options } = useContext(ChartContext);
  const queryData = useBaseQueryData();

  const { t } = useTranslation();

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
      return <ChartCombo config={options.config} defaultType={options?.config?.type} />;
    case 'pie':
      return <ChartPie config={options.config} />;
    case 'table':
      return <ChartTable config={options.config} />;
    default:
      return <div>{t('notSupport')}</div>;
  }
};
