'use client';

import { useView, useUpdateView } from '@teable/sdk';
import { createContext, useContext, useRef, useState } from 'react';
import type { IChartViewOptions } from '@teable/core';

interface IChartContext {
  view: any; // Will be properly typed
  options: IChartViewOptions;
  onOptionsChange: (options: IChartViewOptions) => Promise<void>;
}

export const ChartContext = createContext<IChartContext>({
  view: null,
  options: {},
  onOptionsChange: async () => {},
});

export const ChartProvider = ({ children, view }: { children: React.ReactNode; view: any }) => {
  const updateView = useUpdateView();
  const [options, setOptions] = useState<IChartViewOptions>(view?.options || {});
  const preOptions = useRef<IChartViewOptions | undefined>();

  const onOptionsChange = async (newOptions: IChartViewOptions) => {
    try {
      preOptions.current = options;
      setOptions(newOptions);
      await updateView({ options: newOptions });
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
