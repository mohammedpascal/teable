import type { IGetBaseVo, ICreateTableRo } from '@teable/openapi';
import { Table } from './table/table';

export class Base implements IGetBaseVo {
  id: string;
  name: string;

  constructor(base: IGetBaseVo) {
    const { id, name } = base;
    this.id = id;
    this.name = name;
  }

  async createTable(tableRo?: ICreateTableRo) {
    return Table.createTable(this.id, tableRo);
  }

  async deleteTable(tableId: string) {
    return Table.deleteTable(this.id, tableId);
  }
}
