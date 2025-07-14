import type { IViewVo, ISort, IColumnMetaRo, IFilter, IGroup } from '@teable/core';
import { useViews } from '../../hooks';
import type { IViewInstance } from '../../model/view/factory';
import { ViewContext } from './ViewContext';

interface IPersonalViewProxyProps {
  serverData?: IViewVo[];
  children: React.ReactNode;
}

export interface IProxyPersonalView
  extends Omit<
    IViewInstance,
    'updateFilter' | 'updateSort' | 'updateGroup' | 'updateOption' | 'updateColumnMeta'
  > {
  updateFilter: (filter: IFilter) => void;
  updateSort: (sort: ISort) => void;
  updateGroup: (group: IGroup) => void;
  updateOption: (option: Record<string, unknown>) => void;
  updateColumnMeta: (columnMeta: IColumnMetaRo) => void;
  syncViewProperties?: () => void | Promise<void>;
}

export const PersonalViewProxy = (props: IPersonalViewProxyProps) => {
  const { children } = props;
  const views = useViews();

  return (
    <ViewContext.Provider value={{ views: (views ?? []) as IViewInstance[] }}>
      {children}
    </ViewContext.Provider>
  );
};
