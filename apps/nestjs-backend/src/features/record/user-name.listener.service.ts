import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FieldType } from '@teable/core';
import { IUserInfoVo } from '@teable/openapi';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { InjectDbProvider } from '../../db-provider/db.provider';
import { IDbProvider } from '../../db-provider/db.provider.interface';
import { EventEmitterService } from '../../event-emitter/event-emitter.service';
import { Events } from '../../event-emitter/events';
import { Field, PrismaService } from '../../prisma';
import { Timing } from '../../utils/timing';

@Injectable()
export class UserNameListener {
  private readonly logger = new Logger(UserNameListener.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventEmitterService: EventEmitterService,
    @InjectDbProvider() private readonly dbProvider: IDbProvider,
    @InjectModel('CUSTOM_KNEX') private readonly knex: Knex
  ) {}

  private async getFieldsForUser(userId: string) {
    // Query all user fields from all bases since user references can appear in any base
    // and we need to update the user's name wherever they are referenced
    const query = this.knex
      .join('table_meta', 'table_meta.base_id', 'base.id')
      .join('field', 'table_meta.id', 'field.table_id')
      .from('base')
      .whereIn('field.type', [FieldType.User, FieldType.CreatedBy, FieldType.LastModifiedBy])
      .select({
        id: 'field.id',
        tableId: 'field.table_id',
        type: 'field.type',
        dbFieldName: 'field.db_field_name',
        isMultipleCellValue: 'field.is_multiple_cell_value',
      })
      .toQuery();
    return this.prismaService.$queryRawUnsafe<Field[]>(query);
  }

  @Timing()
  private async updateUserFieldName(field: Field, id: string, name: string) {
    const tableId = field.tableId;
    const { dbTableName } = await this.prismaService.tableMeta.findUniqueOrThrow({
      where: { id: tableId },
      select: { dbTableName: true },
    });

    const sql = field.isMultipleCellValue
      ? this.dbProvider.updateJsonArrayColumn(dbTableName, field.dbFieldName, id, 'title', name)
      : this.dbProvider.updateJsonColumn(dbTableName, field.dbFieldName, id, 'title', name);

    return await this.prismaService.$executeRawUnsafe(sql);
  }

  @OnEvent(Events.USER_RENAME, { async: true })
  async updateUserName(user: IUserInfoVo) {
    const fields = await this.getFieldsForUser(user.id);

    this.logger.log(`Updating user name for ${fields.length} fields`);

    for (const field of fields) {
      try {
        await this.updateUserFieldName(field, user.id, user.name);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        this.logger.error(e.message, e.stack);
      }
    }

    this.eventEmitterService.emit(Events.TABLE_USER_RENAME_COMPLETE, user);
  }
}
