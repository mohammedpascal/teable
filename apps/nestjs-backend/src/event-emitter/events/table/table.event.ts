import type { ITableOp } from '@teable/core';
import { match } from 'ts-pattern';
import { RawOpType } from '../../../share-db/interface';
import type { IEventContext } from '../core-event';
import { Events } from '../event.enum';
import type { IChangeValue } from '../op-event';
import { OpEvent } from '../op-event';

export type IChangeTable = Record<keyof Omit<ITableOp, 'id' | 'lastModifiedTime'>, IChangeValue> & {
  id: string;
};

type ITableCreatePayload = { table: ITableOp };
type ITableDeletePayload = { tableId: string };
type ITableUpdatePayload = { table: IChangeTable };

export class TableCreateEvent extends OpEvent<ITableCreatePayload> {
  public readonly name = Events.TABLE_CREATE;
  public readonly rawOpType = RawOpType.Create;

  constructor(table: ITableOp, context: IEventContext) {
    super({ table }, context);
  }
}

export class TableDeleteEvent extends OpEvent<ITableDeletePayload> {
  public readonly name = Events.TABLE_DELETE;
  public readonly rawOpType = RawOpType.Del;

  constructor(tableId: string, context: IEventContext) {
    super({ tableId }, context);
  }
}

export class TableUpdateEvent extends OpEvent<ITableUpdatePayload> {
  public readonly name = Events.TABLE_UPDATE;
  public readonly rawOpType = RawOpType.Edit;

  constructor(table: IChangeTable, context: IEventContext) {
    super({ table }, context);
  }
}

export class TableEventFactory {
  static create(
    name: string,
    payload: ITableCreatePayload | ITableDeletePayload | ITableUpdatePayload,
    context: IEventContext
  ) {
    return match(name)
      .with(Events.TABLE_CREATE, () => {
        const { table } = payload as ITableCreatePayload;
        return new TableCreateEvent(table, context);
      })
      .with(Events.TABLE_DELETE, () => {
        const { tableId } = payload as ITableDeletePayload;
        return new TableDeleteEvent(tableId, context);
      })
      .with(Events.TABLE_UPDATE, () => {
        const { table } = payload as ITableUpdatePayload;
        return new TableUpdateEvent(table, context);
      })
      .otherwise(() => null);
  }
}
