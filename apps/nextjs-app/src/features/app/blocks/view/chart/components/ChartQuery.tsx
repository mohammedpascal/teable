import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { ChartContext } from './ChartProvider';

export const ChartQuery = () => {
  const { t } = useTranslation();
  const { options } = useContext(ChartContext);

  return (
    <div className="flex size-full items-center justify-center">
      <div className="text-center">
        <h3 className="text-lg font-medium">{t('chart.query.title')}</h3>
        <p className="text-muted-foreground mt-2">
          {t('chart.query.description')}
        </p>
        {options?.query && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <pre className="text-sm">
              {JSON.stringify(options.query, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
