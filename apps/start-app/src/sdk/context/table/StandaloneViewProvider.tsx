import React, { useMemo } from 'react';
import { RowCountContext, RowCountProvider } from '../aggregation';
import { AnchorContext } from '../anchor/AnchorContext';
import { FieldContext, FieldProvider } from '../field';
import { SearchProvider } from '../query';
import { RecordContext, RecordProvider } from '../record';
import { ViewContext, ViewProvider } from '../view';

export interface IStandaloneViewProvider {
  tableId: string | undefined;
  viewId?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const StandaloneViewProvider: React.FC<IStandaloneViewProvider> = ({
  children,
  viewId,
  tableId,
  fallback,
}) => {
  const value = useMemo(() => {
    return { viewId, tableId };
  }, [viewId, tableId]);

  return (
    <AnchorContext.Provider value={value}>
      {tableId ? (
        <SearchProvider>
          <FieldProvider fallback={fallback}>
            <ViewProvider>
              <RecordProvider>
                <RowCountProvider>{children}</RowCountProvider>
              </RecordProvider>
            </ViewProvider>
          </FieldProvider>
        </SearchProvider>
      ) : (
        <FieldContext.Provider value={{ fields: [] }}>
          <ViewContext.Provider value={{ views: [] }}>
            <RecordContext.Provider value={{}}>
              <RowCountContext.Provider value={null}>{children}</RowCountContext.Provider>
            </RecordContext.Provider>
          </ViewContext.Provider>
        </FieldContext.Provider>
      )}
    </AnchorContext.Provider>
  );
};
