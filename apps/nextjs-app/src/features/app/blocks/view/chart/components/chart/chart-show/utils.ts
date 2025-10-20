import type { IBaseQueryColumn } from '@teable/openapi';
import type { ITableConfigColumn } from './types';

const isEmptyObject = (obj: Record<string, unknown>) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const sortTableColumns = (
  columns: IBaseQueryColumn[],
  configColumnMap: Record<string, ITableConfigColumn & { index: number }>
) => {
  if (isEmptyObject(configColumnMap)) {
    return columns;
  }
  return columns.sort((a, b) => {
    const aIndex = configColumnMap[a.column]?.index ?? -1;
    const bIndex = configColumnMap[b.column]?.index ?? -1;
    return aIndex - bIndex;
  });
};

export const tableConfigColumnsToMap = (configColumns?: ITableConfigColumn[]) => {
  if (!configColumns) {
    return {};
  }
  return configColumns.reduce(
    (acc, column, index) => {
      acc[column.column] = {
        ...column,
        index,
      };
      return acc;
    },
    {} as Record<string, ITableConfigColumn & { index: number }>
  );
};

// Simple color palette for chart series
const colors = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
  '#00ff00',
  '#ff00ff',
  '#00ffff',
  '#ffff00',
  '#ff0000',
  '#0000ff',
  '#800080',
  '#008000',
  '#ffa500',
  '#ff69b4',
  '#40e0d0',
  '#dda0dd',
];

export const getColor = (index: number): string => {
  return colors[index % colors.length];
};
