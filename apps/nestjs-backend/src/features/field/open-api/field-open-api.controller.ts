/* eslint-disable sonarjs/no-duplicate-string */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Post,
  Query,
  Headers,
} from '@nestjs/common';
import type { IFieldVo } from '@teable/core';
import {
  createFieldRoSchema,
  getFieldsQuerySchema,
  IFieldRo,
  IGetFieldsQuery,
  IConvertFieldRo,
  convertFieldRoSchema,
  updateFieldRoSchema,
  IUpdateFieldRo,
} from '@teable/core';
import { deleteFieldsQuerySchema, IDeleteFieldsQuery } from '@teable/openapi';
import type {
  IGetViewFilterLinkRecordsVo,
  IPlanFieldConvertVo,
  IPlanFieldVo,
} from '@teable/openapi';
import { ZodValidationPipe } from '../../../zod.validation.pipe';
import { FieldService } from '../field.service';
import { FieldOpenApiService } from './field-open-api.service';

@Controller('api/table/:tableId/field')
export class FieldOpenApiController {
  constructor(
    private readonly fieldService: FieldService,
    private readonly fieldOpenApiService: FieldOpenApiService
  ) {}

  @Get(':fieldId/plan')
  async planField(
    @Param('tableId') tableId: string,
    @Param('fieldId') fieldId: string
  ): Promise<IPlanFieldVo> {
    return await this.fieldOpenApiService.planField(tableId, fieldId);
  }

  @Get(':fieldId')
  async getField(
    @Param('tableId') tableId: string,
    @Param('fieldId') fieldId: string
  ): Promise<IFieldVo> {
    return await this.fieldService.getField(tableId, fieldId);
  }

  @Get()
  async getFields(
    @Param('tableId') tableId: string,
    @Query(new ZodValidationPipe(getFieldsQuerySchema)) query: IGetFieldsQuery
  ): Promise<IFieldVo[]> {
    return await this.fieldOpenApiService.getFields(tableId, query);
  }

  @Post('/plan')
  async planFieldCreate(
    @Param('tableId') tableId: string,
    @Body(new ZodValidationPipe(createFieldRoSchema)) fieldRo: IFieldRo
  ): Promise<IPlanFieldVo> {
    return await this.fieldOpenApiService.planFieldCreate(tableId, fieldRo);
  }

  @Post()
  async createField(
    @Param('tableId') tableId: string,
    @Body(new ZodValidationPipe(createFieldRoSchema)) fieldRo: IFieldRo,
    @Headers('x-window-id') windowId: string
  ): Promise<IFieldVo> {
    return await this.fieldOpenApiService.createField(tableId, fieldRo, windowId);
  }

  @Put(':fieldId/plan')
  async planFieldConvert(
    @Param('tableId') tableId: string,
    @Param('fieldId') fieldId: string,
    @Body(new ZodValidationPipe(convertFieldRoSchema)) updateFieldRo: IConvertFieldRo
  ): Promise<IPlanFieldConvertVo> {
    return await this.fieldOpenApiService.planFieldConvert(tableId, fieldId, updateFieldRo);
  }

  @Put(':fieldId/convert')
  async convertField(
    @Param('tableId') tableId: string,
    @Param('fieldId') fieldId: string,
    @Body(new ZodValidationPipe(convertFieldRoSchema)) updateFieldRo: IConvertFieldRo,
    @Headers('x-window-id') windowId: string
  ) {
    return await this.fieldOpenApiService.convertField(tableId, fieldId, updateFieldRo, windowId);
  }

  @Patch(':fieldId')
  async updateField(
    @Param('tableId') tableId: string,
    @Param('fieldId') fieldId: string,
    @Body(new ZodValidationPipe(updateFieldRoSchema)) updateFieldRo: IUpdateFieldRo
  ) {
    return await this.fieldOpenApiService.updateField(tableId, fieldId, updateFieldRo);
  }

  @Delete(':fieldId')
  async deleteField(
    @Param('tableId') tableId: string,
    @Param('fieldId') fieldId: string,
    @Headers('x-window-id') windowId: string
  ) {
    await this.fieldOpenApiService.deleteField(tableId, fieldId, windowId);
  }

  @Delete()
  async deleteFields(
    @Param('tableId') tableId: string,
    @Query(new ZodValidationPipe(deleteFieldsQuerySchema)) query: IDeleteFieldsQuery,
    @Headers('x-window-id') windowId: string
  ) {
    await this.fieldOpenApiService.deleteFields(tableId, query.fieldIds, windowId);
  }

  @Get('/:fieldId/filter-link-records')
  async getFilterLinkRecords(
    @Param('tableId') tableId: string,
    @Param('fieldId') fieldId: string
  ): Promise<IGetViewFilterLinkRecordsVo> {
    return this.fieldOpenApiService.getFilterLinkRecords(tableId, fieldId);
  }

  @Get('/socket/snapshot-bulk')
  async getSnapshotBulk(@Param('tableId') tableId: string, @Query('ids') ids: string[]) {
    return this.fieldService.getSnapshotBulk(tableId, ids);
  }

  @Get('/socket/doc-ids')
  async getDocIds(
    @Param('tableId') tableId: string,
    @Query(new ZodValidationPipe(getFieldsQuerySchema)) query: IGetFieldsQuery
  ) {
    return this.fieldService.getDocIdsByQuery(tableId, query);
  }
}
