import type { ITableActionKey } from '@teable/core';
import { useTableId, useTableListener } from '../../hooks';
import { PersonalViewContext } from './PersonalViewContext';

interface IPersonalViewProviderProps {
  children: React.ReactNode;
}

export const PersonalViewProvider = ({ children }: IPersonalViewProviderProps) => {
  const tableId = useTableId();

  const tableMatches: ITableActionKey[] = [];

  const update = (actionKey: string, payload?: any) => {
    console.log('update', actionKey, payload);
  };

  useTableListener(tableId, tableMatches, update);

  return (
    <PersonalViewContext.Provider
      value={{
        isPersonalView: false,
        personalViewMap: undefined,
        personalViewCommonQuery: undefined,
        personalViewAggregationQuery: undefined,
      }}
    >
      {children}
    </PersonalViewContext.Provider>
  );
};
