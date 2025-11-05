import { IdPrefix } from '@teable/core';
import type { ITableVo } from '@teable/openapi';
import type { FC, ReactNode } from 'react';
import { createTableInstance } from '../../model';
import { useInstances } from '../use-instances';
import { TableContext } from './TableContext';

interface ITableProviderProps {
  serverData?: ITableVo[];
  children: ReactNode;
}

export const TableProvider: FC<ITableProviderProps> = ({ children, serverData }) => {
  const { instances: tables } = useInstances({
    collection: `${IdPrefix.Table}_bse0`,
    factory: createTableInstance,
    initData: serverData,
    queryParams: {},
  });

  return <TableContext.Provider value={{ tables }}>{children}</TableContext.Provider>;
};
