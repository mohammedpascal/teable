import { IdPrefix } from '@teable/core';
import type { ITableVo } from '@teable/openapi';
import type { FC, ReactNode } from 'react';
import { useMemo } from 'react';
import { createTableInstance } from '../../model';
import { useInstances } from '../use-instances';
import { TableContext } from './TableContext';

interface ITableProviderProps {
  serverData?: ITableVo[];
  children: ReactNode;
}

export const TableProvider: FC<ITableProviderProps> = ({ children, serverData }) => {
  const { instances: tables } = useInstances({
    collection: `${IdPrefix.Table}_`,
    factory: createTableInstance,
    initData: serverData,
    queryParams: {},
  });

  const value = useMemo(() => {
    return { tables };
  }, [tables]);

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
};
