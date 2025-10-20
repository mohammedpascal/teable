/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTablePermission, useView } from '@teable/sdk/hooks';

export const useViewConfigurable = () => {
  const view = useView() as any;
  const permission = useTablePermission();

  return {
    isViewConfigurable: !view?.isLocked && permission['view|update'],
  };
};
