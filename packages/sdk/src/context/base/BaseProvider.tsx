import type { FC, ReactNode } from 'react';
import { Base } from '../../model';
import { BaseContext } from './BaseContext';
interface IBaseProviderProps {
  children: ReactNode;
}

export const BaseProvider: FC<IBaseProviderProps> = ({ children }) => {
  const basePermissionData = {
    'table|create': true,
    'table|delete': true,
    'table|read': true,
    'table|update': true,
    'table|import': true,
    'table|export': true,
    'base|delete': true,
    'base|read': true,
    'base|read_all': true,
    'base|update': true,
    'base|invite_email': true,
    'base|invite_link': true,
    'base|table_import': true,
    'base|table_export': true,
    'base|db_connection': true,
    'base|query_data': true,
  };

  const value = {
    base: new Base(),
    permission: basePermissionData,
  };

  return <BaseContext.Provider value={value}>{children}</BaseContext.Provider>;
};
