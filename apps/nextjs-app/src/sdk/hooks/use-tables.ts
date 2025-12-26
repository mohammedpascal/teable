import orderBy from 'lodash/orderBy';
import { useContext, useMemo } from 'react';
import { TableContext } from '../context/table';

export function useTables() {
  const tableContext = useContext(TableContext);
  return useMemo(() => orderBy(tableContext?.tables, ['order']), [tableContext?.tables]);
}
