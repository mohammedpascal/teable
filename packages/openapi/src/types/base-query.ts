import type { IOperator, SortFunc, StatisticsFunc } from '@teable/core';

export enum BaseQueryColumnType {
  Field = 'field',
  Aggregation = 'aggregation',
}

export enum BaseQueryJoinType {
  Left = 'left',
  Right = 'right',
  Inner = 'inner',
  Full = 'full',
}

export interface IBaseQueryColumn {
  column: string;
  type: BaseQueryColumnType;
  name: string;
  fieldSource?: any;
}

export interface IBaseQuerySelect {
  column: string;
  alias: string;
  type: BaseQueryColumnType;
}

export type IBaseQueryOrderBy = Array<{
  column: string;
  type: BaseQueryColumnType;
  order: SortFunc;
}>;

export type IBaseQueryGroupBy = Array<{
  column: string;
  type: BaseQueryColumnType;
}>;

export interface IBaseQueryJoin {
  type: BaseQueryJoinType;
  table: string;
  on: string[];
}

export interface IBaseQueryFilterItem {
  column: string;
  operator: IOperator;
  value: unknown;
  type: BaseQueryColumnType;
}

export type IBaseQueryFilter =
  | IBaseQueryFilterItem
  | {
      conjunction: 'and' | 'or';
      filterSet: IBaseQueryFilter[];
    };

export type IQueryAggregation = Array<{
  column: string;
  statisticFunc: StatisticsFunc;
  type: BaseQueryColumnType;
}>;

export interface IBaseQuery {
  from?: string | IBaseQuery;
  select?: IBaseQuerySelect[];
  aggregation?: IQueryAggregation;
  where?: IBaseQueryFilter;
  orderBy?: IBaseQueryOrderBy;
  groupBy?: IBaseQueryGroupBy;
  limit?: number;
  offset?: number;
  join?: IBaseQueryJoin[];
}

