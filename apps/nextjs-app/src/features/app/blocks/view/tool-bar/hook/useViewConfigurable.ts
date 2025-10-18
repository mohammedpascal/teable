import { useTablePermission, useView } from '@teable/sdk/hooks';

export const useViewConfigurable = () => {
  const view = useView();
  const permission = useTablePermission();

  return {
    isViewConfigurable: !(view as any)?.isLocked && permission['view|update'],
  };
};
