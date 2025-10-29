import type { ITableVo } from '@teable/openapi';
import { plainToInstance } from 'class-transformer';
import type { Doc } from 'sharedb/lib/client';
import { Table } from './table';

export function createTableInstance(tableSnapshot: ITableVo, doc?: Doc<ITableVo>) {
  return plainToInstance(Table, tableSnapshot);
}
