/* eslint-disable sonarjs/no-duplicate-string */
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import type {
  IDuplicateTableVo,
  IGetAbnormalVo,
  ITableFullVo,
  ITableListVo,
  ITableVo,
} from '@teable/openapi';
import {
  tableRoSchema,
  ICreateTableWithDefault,
  dbTableNameRoSchema,
  IDbTableNameRo,
  ITableDescriptionRo,
  ITableIconRo,
  ITableNameRo,
  IUpdateOrderRo,
  tableDescriptionRoSchema,
  tableIconRoSchema,
  tableNameRoSchema,
  updateOrderRoSchema,
  IToggleIndexRo,
  toggleIndexRoSchema,
  TableIndex,
  duplicateTableRoSchema,
  IDuplicateTableRo,
} from '@teable/openapi';
import { ZodValidationPipe } from '../../../zod.validation.pipe';
import { TableIndexService } from '../table-index.service';
import { TableService } from '../table.service';
import { TableOpenApiService } from './table-open-api.service';
import { TablePipe } from './table.pipe';

@Controller('api/base/bse0/table')
export class TableController {
  constructor(
    private readonly tableService: TableService,
    private readonly tableOpenApiService: TableOpenApiService,
    private readonly tableIndexService: TableIndexService
  ) {}

  @Get(':tableId/default-view-id')
  async getDefaultViewId(@Param('tableId') tableId: string): Promise<{ id: string }> {
    return await this.tableService.getDefaultViewId(tableId);
  }

  @Get(':tableId')
  async getTable(@Param('tableId') tableId: string): Promise<ITableVo> {
    return await this.tableOpenApiService.getTable(tableId);
  }

  @Get()
  async getTables(): Promise<ITableListVo> {
    try {
      const result = await this.tableOpenApiService.getTables();
      console.log(`✅ TableController.getTables success, found ${result.length} tables`);
      return result;
    } catch (error) {
      console.error('❌ TableController.getTables error:', error);
      throw error;
    }
  }

  @Put(':tableId/name')
  async updateName(
    @Param('tableId') tableId: string,
    @Body(new ZodValidationPipe(tableNameRoSchema)) tableNameRo: ITableNameRo
  ) {
    return await this.tableOpenApiService.updateName(tableId, tableNameRo.name);
  }

  @Put(':tableId/icon')
  async updateIcon(
    @Param('tableId') tableId: string,
    @Body(new ZodValidationPipe(tableIconRoSchema)) tableIconRo: ITableIconRo
  ) {
    return await this.tableOpenApiService.updateIcon(tableId, tableIconRo.icon);
  }

  @Put(':tableId/description')
  async updateDescription(
    @Param('tableId') tableId: string,
    @Body(new ZodValidationPipe(tableDescriptionRoSchema)) tableDescriptionRo: ITableDescriptionRo
  ) {
    return await this.tableOpenApiService.updateDescription(
      tableId,
      tableDescriptionRo.description
    );
  }

  @Put(':tableId/db-table-name')
  async updateDbTableName(
    @Param('tableId') tableId: string,
    @Body(new ZodValidationPipe(dbTableNameRoSchema)) dbTableNameRo: IDbTableNameRo
  ) {
    return await this.tableOpenApiService.updateDbTableName(
      tableId,
      dbTableNameRo.dbTableName
    );
  }

  @Put(':tableId/order')
  async updateOrder(
    @Param('tableId') tableId: string,
    @Body(new ZodValidationPipe(updateOrderRoSchema)) updateOrderRo: IUpdateOrderRo
  ) {
    return await this.tableOpenApiService.updateOrder(tableId, updateOrderRo);
  }

  @Post()
  async createTable(
    @Body(new ZodValidationPipe(tableRoSchema), TablePipe) createTableRo: ICreateTableWithDefault
  ): Promise<ITableFullVo> {
    return await this.tableOpenApiService.createTable(createTableRo);
  }

  @Post(':tableId/duplicate')
  async duplicateTable(
    @Param('tableId') tableId: string,
    @Body(new ZodValidationPipe(duplicateTableRoSchema), TablePipe)
    duplicateTableRo: IDuplicateTableRo
  ): Promise<IDuplicateTableVo> {
    return await this.tableOpenApiService.duplicateTable(tableId, duplicateTableRo);
  }

  @Delete(':tableId')
  async archiveTable(@Param('tableId') tableId: string) {
    return await this.tableOpenApiService.deleteTable(tableId);
  }

  @Delete(':tableId/permanent')
  permanentDeleteTable(@Param('tableId') tableId: string) {
    return this.tableOpenApiService.deleteTables([tableId]);
  }

  @Get(':tableId/permission')
  async getPermission(@Param('tableId') tableId: string) {
    return await this.tableOpenApiService.getPermission(tableId);
  }

  @Get('/socket/snapshot-bulk')
  async getSnapshotBulk(@Query('ids') ids: string[]) {
    const snapshotBulk = await this.tableService.getSnapshotBulk(ids);
    return snapshotBulk.map((snapshot) => {
      return {
        ...snapshot,
        data: {
          ...snapshot.data,
          permission: {},
        },
      };
    });
  }

  @Get('/socket/doc-ids')
  async getDocIds() {
    return this.tableService.getDocIdsByQuery('bse0', undefined);
  }

  @Post(':tableId/index')
  async toggleIndex(
    @Param('tableId') tableId: string,
    @Body(new ZodValidationPipe(toggleIndexRoSchema)) searchIndexRo: IToggleIndexRo
  ) {
    return this.tableIndexService.toggleIndex(tableId, searchIndexRo);
  }

  @Get(':tableId/activated-index')
  async getTableIndex(@Param('tableId') tableId: string): Promise<string[]> {
    return this.tableIndexService.getActivatedTableIndexes(tableId);
  }

  @Get(':tableId/abnormal-index')
  async getAbnormalTableIndex(
    @Param('tableId') tableId: string,
    @Query('type') tableIndexType: TableIndex
  ): Promise<IGetAbnormalVo> {
    return this.tableIndexService.getAbnormalTableIndex(tableId, tableIndexType);
  }

  @Patch(':tableId/index/repair')
  async repairIndex(
    @Param('tableId') tableId: string,
    @Query('type') tableIndexType: TableIndex
  ): Promise<void> {
    return this.tableIndexService.repairIndex(tableId, tableIndexType);
  }
}
