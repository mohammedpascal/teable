import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { IOtOperation, ISnapshotBase } from '@teable/core';
import { generateTableId, getUniqName, IdPrefix, nullsToUndefined } from '@teable/core';
import type { ICreateTableRo, ITableVo } from '@teable/openapi';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { ClsService } from 'nestjs-cls';
import { InjectDbProvider } from '../../db-provider/db.provider';
import { IDbProvider } from '../../db-provider/db.provider.interface';
import { PrismaService } from '../../prisma';
import type { Prisma } from '../../prisma';
import type { IReadonlyAdapterService } from '../../share-db/interface';
import { RawOpType } from '../../share-db/interface';
import type { IClsStore } from '../../types/cls';
import { convertNameToValidCharacter } from '../../utils/name-conversion';
import { Timing } from '../../utils/timing';
import { BatchService } from '../calculation/batch.service';

@Injectable()
export class TableService implements IReadonlyAdapterService {
  private logger = new Logger(TableService.name);

  constructor(
    private readonly cls: ClsService<IClsStore>,
    private readonly prismaService: PrismaService,
    private readonly batchService: BatchService,
    @InjectDbProvider() private readonly dbProvider: IDbProvider,
    @InjectModel('CUSTOM_KNEX') private readonly knex: Knex
  ) {}

  generateValidName(name: string) {
    return convertNameToValidCharacter(name, 40);
  }

  /**
   * Generate a unique dbTableName by appending numbers if the name already exists.
   * Similar to getUniqName but works with dbTableNames that have the bse0_ prefix.
   */
  private async generateUniqueDbTableName(baseDbTableName: string): Promise<string> {
    const existingTables = await this.prismaService.txClient().tableMeta.findMany({
      select: { dbTableName: true },
    });
    const existingDbTableNames = existingTables.map((table) => table.dbTableName);

    // If the name doesn't exist, return it as-is
    const prefixedName = this.dbProvider.generateDbTableName(baseDbTableName);
    if (!existingDbTableNames.includes(prefixedName)) {
      return prefixedName;
    }

    // Extract base name and number if present
    let baseName = baseDbTableName;
    let num = 2;

    // Check if the name ends with a number - find the longest trailing digit sequence
    const trailingDigitsMatch = baseDbTableName.match(/(\d+)$/);
    if (trailingDigitsMatch) {
      const trailingDigits = trailingDigitsMatch[1];
      const digitsStartIndex = baseDbTableName.length - trailingDigits.length;
      if (digitsStartIndex > 0) {
        baseName = baseDbTableName.substring(0, digitsStartIndex);
        num = parseInt(trailingDigits, 10) + 1;
      }
    }

    // Generate unique name by appending numbers
    let candidateName = `${baseName}${num}`;
    let candidatePrefixed = this.dbProvider.generateDbTableName(candidateName);

    while (existingDbTableNames.includes(candidatePrefixed)) {
      num++;
      candidateName = `${baseName}${num}`;
      candidatePrefixed = this.dbProvider.generateDbTableName(candidateName);
    }

    return candidatePrefixed;
  }

  private async createDBTable(tableRo: ICreateTableRo, createTable = true) {
    const userId = this.cls.get('user.id');
    const tableRaws = await this.prismaService.txClient().tableMeta.findMany({
      select: { name: true, order: true },
    });
    const tableId = generateTableId();
    const names = tableRaws.map((table) => table.name);
    const uniqName = getUniqName(tableRo.name ?? 'New table', names);
    const order =
      tableRaws.reduce((acc, cur) => {
        return acc > cur.order ? acc : cur.order;
      }, 0) + 1;

    const validTableName = this.generateValidName(uniqName);
    const baseDbTableName = tableRo.dbTableName || validTableName;
    const dbTableName = await this.generateUniqueDbTableName(baseDbTableName);

    const data: Prisma.TableMetaCreateInput = {
      id: tableId,
      name: uniqName,
      icon: tableRo.icon,
      dbTableName,
      order,
      createdBy: userId,
      version: 1,
    };

    const tableMeta = await this.prismaService.txClient().tableMeta.create({
      data,
    });

    if (!createTable) {
      return tableMeta;
    }

    const createTableSchema = this.knex.schema.createTable(dbTableName, (table) => {
      table.string('__id').unique().notNullable();
      table.increments('__auto_number').primary();
      table.dateTime('__created_time').defaultTo(this.knex.fn.now()).notNullable();
      table.dateTime('__last_modified_time');
      table.string('__created_by').notNullable();
      table.string('__last_modified_by');
      table.integer('__version').notNullable();
    });

    for (const sql of createTableSchema.toSQL()) {
      await this.prismaService.txClient().$executeRawUnsafe(sql.sql);
    }
    return tableMeta;
  }

  @Timing()
  async getTableLastModifiedTime(tableIds: string[]) {
    if (!tableIds.length) return [];

    const nativeSql = this.knex
      .select({
        tableId: 'id',
        lastModifiedTime: this.knex
          .select('created_time')
          .from('ops')
          .whereRaw('ops.collection = table_meta.id')
          .orderBy('created_time', 'desc')
          .limit(1),
      })
      .from('table_meta')
      .whereIn('id', tableIds)
      .toSQL()
      .toNative();

    const results = await this.prismaService
      .txClient()
      .$queryRawUnsafe<
        { tableId: string; lastModifiedTime: Date }[]
      >(nativeSql.sql, ...nativeSql.bindings);

    return tableIds.map((tableId) => {
      const item = results.find((result) => result.tableId === tableId);
      return item?.lastModifiedTime?.toISOString();
    });
  }

  async getTableDefaultViewId(tableIds: string[]) {
    if (!tableIds.length) return [];

    const nativeSql = this.knex
      .select({
        tableId: 'id',
        viewId: this.knex
          .select('id')
          .from('view')
          .whereRaw('view.table_id = table_meta.id')
          .orderBy('order')
          .limit(1),
      })
      .from('table_meta')
      .whereIn('id', tableIds)
      .toSQL()
      .toNative();

    const results = await this.prismaService
      .txClient()
      .$queryRawUnsafe<{ tableId: string; viewId: string }[]>(nativeSql.sql, ...nativeSql.bindings);

    return tableIds.map((tableId) => {
      const item = results.find((result) => result.tableId === tableId);
      return item?.viewId;
    });
  }

  async getTableMeta(tableId: string): Promise<ITableVo> {
    const tableMeta = await this.prismaService.txClient().tableMeta.findFirst({
      where: { id: tableId },
    });

    if (!tableMeta) {
      throw new NotFoundException();
    }

    const tableTime = await this.getTableLastModifiedTime([tableId]);
    const tableDefaultViewIds = await this.getTableDefaultViewId([tableId]);
    if (!tableDefaultViewIds[0]) {
      throw new Error('defaultViewId is not found');
    }

    return {
      ...tableMeta,
      icon: tableMeta.icon ?? undefined,
      lastModifiedTime: tableTime[0] || tableMeta.createdTime.toISOString(),
      defaultViewId: tableDefaultViewIds[0],
    };
  }

  async getDefaultViewId(tableId: string) {
    const viewRaw = await this.prismaService.view.findFirst({
      where: { tableId },
      select: { id: true },
      orderBy: { order: 'asc' },
    });
    if (!viewRaw) {
      throw new NotFoundException('Table No found');
    }
    return viewRaw;
  }

  async createTable(snapshot: ICreateTableRo, createTable: boolean = true): Promise<ITableVo> {
    const tableVo = await this.createDBTable(snapshot, createTable);
    await this.batchService.saveRawOps('bse0', RawOpType.Create, IdPrefix.Table, [
      {
        docId: tableVo.id,
        version: 0,
        data: tableVo,
      },
    ]);
    return nullsToUndefined({
      ...tableVo,
      lastModifiedTime: tableVo.lastModifiedTime?.toISOString(),
    });
  }

  async deleteTable(tableId: string) {
    const result = await this.prismaService.txClient().tableMeta.findFirst({
      where: { id: tableId },
    });

    if (!result) {
      throw new NotFoundException('Table not found');
    }

    const { version } = result;

    // Delete related fields first to avoid foreign key constraint violations
    await this.prismaService.txClient().field.deleteMany({
      where: { tableId },
    });

    // Delete related views
    await this.prismaService.txClient().view.deleteMany({
      where: { tableId },
    });

    await this.prismaService.txClient().tableMeta.delete({
      where: { id: tableId },
    });

    await this.batchService.saveRawOps('bse0', RawOpType.Del, IdPrefix.Table, [
      { docId: tableId, version },
    ]);
  }

  async updateTable(
    tableId: string,
    input: Omit<
      Prisma.TableMetaUpdateInput,
      | 'id'
      | 'createdBy'
      | 'lastModifiedBy'
      | 'createdTime'
      | 'lastModifiedTime'
      | 'version'
      | 'fields'
      | 'views'
    >
  ) {
    const select = Object.keys(input).reduce<{ [key: string]: boolean }>((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});

    const tableRaw = await this.prismaService
      .txClient()
      .tableMeta.findFirstOrThrow({
        where: { id: tableId },
        select: {
          ...select,
          version: true,
          lastModifiedBy: true,
          lastModifiedTime: true,
        },
      })
      .catch(() => {
        throw new NotFoundException('Table not found');
      });

    const updateInput: Prisma.TableMetaUpdateInput = {
      ...input,
      version: tableRaw.version + 1,
      lastModifiedBy: this.cls.get('user.id'),
      lastModifiedTime: new Date(),
    };

    const ops = Object.entries(updateInput)
      .filter(([key, value]) => Boolean(value !== (tableRaw as Record<string, unknown>)[key]))
      .map<IOtOperation>(([key, value]) => {
        return {
          p: [key],
          oi: value,
          od: (tableRaw as Record<string, unknown>)[key],
        };
      });

    const tableRawAfter = await this.prismaService.txClient().tableMeta.update({
      where: { id: tableId },
      data: updateInput,
    });

    await this.batchService.saveRawOps('bse0', RawOpType.Edit, IdPrefix.Table, [
      {
        docId: tableId,
        version: tableRaw.version,
        data: ops,
      },
    ]);

    return tableRawAfter;
  }

  async create(snapshot: ITableVo) {
    await this.createDBTable(snapshot);
  }

  async getSnapshotBulk(_: string, ids: string[]): Promise<ISnapshotBase<ITableVo>[]> {
    const tables = await this.prismaService.txClient().tableMeta.findMany({
      where: { id: { in: ids } },
      orderBy: { order: 'asc' },
    });
    const tableTime = await this.getTableLastModifiedTime(ids);
    const tableDefaultViewIds = await this.getTableDefaultViewId(ids);
    return tables
      .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
      .map((table, i) => {
        return {
          id: table.id,
          v: table.version,
          type: 'json0',
          data: {
            ...table,
            icon: table.icon ?? undefined,
            lastModifiedTime: tableTime[i] || table.createdTime.toISOString(),
            defaultViewId: tableDefaultViewIds[i],
          },
        };
      });
  }

  async getDocIdsByQuery(_: string, query: { projectionTableIds?: string[] } = {}) {
    const { projectionTableIds } = query;
    const tables = await this.prismaService.txClient().tableMeta.findMany({
      where: {
        ...(projectionTableIds
          ? {
              id: { in: projectionTableIds },
            }
          : {}),
      },
      select: { id: true },
      orderBy: { order: 'asc' },
    });
    return { ids: tables.map((table) => table.id) };
  }
}
