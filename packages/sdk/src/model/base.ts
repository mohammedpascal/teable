import type { ICreateTableRo } from '@teable/openapi';
import { Table } from './table/table';

export class Base {
  id: string;
  name: string;

  constructor() {
    this.id = 'bse0';
    this.name = 'Base';
  }

  async createTable(tableRo?: ICreateTableRo) {
    return Table.createTable(tableRo);
  }

  async deleteTable(tableId: string) {
    return Table.deleteTable(tableId);
  }
}
