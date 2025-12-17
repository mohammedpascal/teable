import type { ITableVo } from '@teable/openapi';
import { plainToInstance } from 'class-transformer';
import type { Doc } from 'sharedb/lib/client';
import { Table } from './table';

export function createTableInstance(tableSnapshot: ITableVo, doc?: Doc<ITableVo>) {
  const instance = plainToInstance(Table, tableSnapshot);

  // force inject doc into instance (similar to field factory pattern)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const temp: any = instance;
  temp.doc = doc;

  return instance;
}
