import type { FC, ReactNode } from 'react';
import { useHookPermission } from '../../hooks/use-hook-permission';
import { Base } from '../../model';
import { BaseContext } from './BaseContext';
interface IBaseProviderProps {
  children: ReactNode;
}

export const BaseProvider: FC<IBaseProviderProps> = ({ children }) => {
  const permission = useHookPermission();


  const value = {
    base: new Base(),
    permission,
  };

  return <BaseContext.Provider value={value}>{children}</BaseContext.Provider>;
};
