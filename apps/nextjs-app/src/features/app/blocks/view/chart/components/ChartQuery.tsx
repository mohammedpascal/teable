import { useContext } from 'react';
import { ChartContext } from './ChartProvider';

export const ChartQuery = () => {
  const { options } = useContext(ChartContext);

  return (
    <div className="flex size-full items-center justify-center">
      <div className="text-center">
        <h3 className="text-lg font-medium">Chart Query</h3>
        <p className="mt-2 text-muted-foreground">Configure your chart query settings</p>
        {options?.query && (
          <div className="mt-4 rounded-lg bg-muted p-4">
            <pre className="text-sm">{JSON.stringify(options.query, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
