import type { IRole } from '@teable/core';
import type { IGetBaseVo, ICreateTableRo, CollaboratorType } from '@teable/openapi';
import { Table } from './table/table';

export class Base implements IGetBaseVo {
  id: string;
  name: string;
  icon: string | null;
  role: IRole;
  collaboratorType?: CollaboratorType;

  constructor(base: IGetBaseVo) {
    const { id, name, icon, role, collaboratorType } = base;
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.role = role;
    this.collaboratorType = collaboratorType;
  }

  async createTable(tableRo?: ICreateTableRo) {
    return Table.createTable(this.id, tableRo);
  }

  async deleteTable(tableId: string) {
    return Table.deleteTable(this.id, tableId);
  }
}
