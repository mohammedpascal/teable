import { useQuery } from '@tanstack/react-query';
import { getBasePermission } from '@teable/openapi';
import type { FC, ReactNode } from 'react';
import { useMemo } from 'react';
import { ReactQueryKeys } from '../../config';
import { Base } from '../../model';
import { BaseContext } from './BaseContext';
interface IBaseProviderProps {
  children: ReactNode;
  fallback?: React.ReactNode;
}

export const BaseProvider: FC<IBaseProviderProps> = ({ children }) => {
  const baseId = 'bse0';
  const { data: basePermissionData } = useQuery({
    queryKey: ReactQueryKeys.getBasePermission(baseId),
    queryFn: () => getBasePermission(baseId).then((res) => res.data),
  });

  const value = useMemo(() => {
    return {
      base: new Base(),
      permission: basePermissionData,
    };
  }, [basePermissionData]);

  return <BaseContext.Provider value={value}>{children}</BaseContext.Provider>;
};
