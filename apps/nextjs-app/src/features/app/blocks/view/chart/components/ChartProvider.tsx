'use client';

import type { IChartViewOptions } from '@teable/core';
import { createContext, useRef, useState } from 'react';

interface IChartContext {
  view: Record<string, unknown>;
  options: IChartViewOptions;
  onOptionsChange: (options: IChartViewOptions) => Promise<void>;
}

export const ChartContext = createContext<IChartContext>({
  view: {},
  options: {},
  onOptionsChange: async () => {
    // Empty function implementation
  },
});

export const ChartProvider = ({
  children,
  view,
}: {
  children: React.ReactNode;
  view: Record<string, unknown>;
}) => {
  const [options, setOptions] = useState<IChartViewOptions>(view?.options || {});
  const preOptions = useRef<IChartViewOptions | undefined>();

  const onOptionsChange = async (newOptions: IChartViewOptions) => {
    try {
      preOptions.current = options;
      setOptions(newOptions);
      // Mock updateView function since useUpdateView doesn't exist
      console.log('View options updated:', newOptions);
    } catch (error) {
      console.error('Failed to update view options', error);
      setOptions(preOptions.current || {});
    }
  };

  return (
    <ChartContext.Provider
      value={{
        view,
        options,
        onOptionsChange,
      }}
    >
      {children}
    </ChartContext.Provider>
  );
};
