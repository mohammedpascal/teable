/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTablePermission, useView } from '@/sdk/hooks';
import { useHookPermission } from '@/sdk/hooks/use-hook-permission';

export const useViewConfigurable = () => {
  const view = useView() as any;
  const permission = useHookPermission();

  return {
    isViewConfigurable: !view?.isLocked && permission['view|update'],
  };
};
