/* eslint-disable sonarjs/no-duplicate-string */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Headers,
} from '@nestjs/common';
import type { IViewVo } from '@teable/core';
import {
  viewRoSchema,
  manualSortRoSchema,
  IManualSortRo,
  IViewRo,
  IColumnMetaRo,
  columnMetaRoSchema,
  IFilterRo,
  IViewGroupRo,
  filterRoSchema,
  viewGroupRoSchema,
} from '@teable/core';
import {
  viewNameRoSchema,
  IViewNameRo,
  viewDescriptionRoSchema,
  IViewDescriptionRo,
  viewSortRoSchema,
  IViewSortRo,
  viewOptionsRoSchema,
  IViewOptionsRo,
  updateOrderRoSchema,
  IUpdateOrderRo,
  updateRecordOrdersRoSchema,
  IUpdateRecordOrdersRo,
  viewInstallPluginRoSchema,
  IViewInstallPluginRo,
  viewPluginUpdateStorageRoSchema,
  IViewPluginUpdateStorageRo,
  viewLockedRoSchema,
  IViewLockedRo,
} from '@teable/openapi';
import type {
  IGetViewFilterLinkRecordsVo,
  IGetViewInstallPluginVo,
  IViewInstallPluginVo,
} from '@teable/openapi';
import { ZodValidationPipe } from '../../..//zod.validation.pipe';
import { EmitControllerEvent } from '../../../event-emitter/decorators/emit-controller-event.decorator';
import { Events } from '../../../event-emitter/events';
import { ViewService } from '../view.service';
import { ViewOpenApiService } from './view-open-api.service';

@Controller('api/table/:tableId/view')
export class ViewOpenApiController {
  constructor(
    private readonly viewService: ViewService,
    private readonly viewOpenApiService: ViewOpenApiService
  ) {}

  @Get(':viewId')
  async getView(
    @Param('tableId') _tableId: string,
    @Param('viewId') viewId: string
  ): Promise<IViewVo> {
    return await this.viewService.getViewById(viewId);
  }

  @Get()
  async getViews(@Param('tableId') tableId: string): Promise<IViewVo[]> {
    return await this.viewService.getViews(tableId);
  }

  @Post()
  @EmitControllerEvent(Events.OPERATION_VIEW_CREATE)
  async createView(
    @Param('tableId') tableId: string,
    @Body(new ZodValidationPipe(viewRoSchema)) viewRo: IViewRo
  ): Promise<IViewVo> {
    return await this.viewOpenApiService.createView(tableId, viewRo);
  }

  @Delete('/:viewId')
  async deleteView(
    @Param('tableId') tableId: string,
    @Param('viewId') viewId: string,
    @Headers('x-window-id') windowId?: string
  ) {
    return await this.viewOpenApiService.deleteView(tableId, viewId, windowId);
  }

  @Put('/:viewId/name')
  async updateName(
    @Param('tableId') tableId: string,
    @Param('viewId') viewId: string,
    @Body(new ZodValidationPipe(viewNameRoSchema)) viewNameRo: IViewNameRo,
    @Headers('x-window-id') windowId?: string
  ): Promise<void> {
    return await this.viewOpenApiService.setViewProperty(
      tableId,
      viewId,
      'name',
      viewNameRo.name,
      windowId
    );
  }

  @Put('/:viewId/description')
  async updateDescription(
    @Param('tableId') tableId: string,
    @Param('viewId') viewId: string,
    @Body(new ZodValidationPipe(viewDescriptionRoSchema)) viewDescriptionRo: IViewDescriptionRo,
    @Headers('x-window-id') windowId?: string
  ): Promise<void> {
    return await this.viewOpenApiService.setViewProperty(
      tableId,
      viewId,
      'description',
      viewDescriptionRo.description,
      windowId
    );
  }

  @Put('/:viewId/locked')
  async updateLocked(
    @Param('tableId') tableId: string,
    @Param('viewId') viewId: string,
    @Body(new ZodValidationPipe(viewLockedRoSchema)) viewLockedRo: IViewLockedRo,
    @Headers('x-window-id') windowId?: string
  ): Promise<void> {
    return await this.viewOpenApiService.setViewProperty(
      tableId,
      viewId,
      'isLocked',
      viewLockedRo.isLocked,
      windowId
    );
  }

  @Put('/:viewId/manual-sort')
  async manualSort(
    @Param('tableId') tableId: string,
    @Param('viewId') viewId: string,
    @Body(new ZodValidationPipe(manualSortRoSchema)) updateViewOrderRo: IManualSortRo
  ): Promise<void> {
    return await this.viewOpenApiService.manualSort(tableId, viewId, updateViewOrderRo);
  }

  @Put('/:viewId/column-meta')
  async updateColumnMeta(
    @Param('tableId') tableId: string,
    @Param('viewId') viewId: string,
    @Body(new ZodValidationPipe(columnMetaRoSchema)) updateViewColumnMetaRo: IColumnMetaRo,
    @Headers('x-window-id') windowId?: string
  ): Promise<void> {
    return await this.viewOpenApiService.updateViewColumnMeta(
      tableId,
      viewId,
      updateViewColumnMetaRo,
      windowId
    );
  }

  @Put('/:viewId/filter')
  async updateViewFilter(
    @Param('tableId') tableId: string,
    @Param('viewId') viewId: string,
    @Body(new ZodValidationPipe(filterRoSchema)) updateViewFilterRo: IFilterRo,
    @Headers('x-window-id') windowId?: string
  ): Promise<void> {
    return await this.viewOpenApiService.setViewProperty(
      tableId,
      viewId,
      'filter',
      updateViewFilterRo.filter,
      windowId
    );
  }

  @Put('/:viewId/sort')
  async updateViewSort(
    @Param('tableId') tableId: string,
    @Param('viewId') viewId: string,
    @Body(new ZodValidationPipe(viewSortRoSchema)) updateViewSortRo: IViewSortRo,
    @Headers('x-window-id') windowId?: string
  ): Promise<void> {
    return await this.viewOpenApiService.setViewProperty(
      tableId,
      viewId,
      'sort',
      updateViewSortRo.sort,
      windowId
    );
  }

  @Put('/:viewId/group')
  async updateViewGroup(
    @Param('tableId') tableId: string,
    @Param('viewId') viewId: string,
    @Body(new ZodValidationPipe(viewGroupRoSchema)) updateViewGroupRo: IViewGroupRo,
    @Headers('x-window-id') windowId?: string
  ): Promise<void> {
    return await this.viewOpenApiService.setViewProperty(
      tableId,
      viewId,
      'group',
      updateViewGroupRo.group,
      windowId
    );
  }

  @Patch('/:viewId/options')
  async updateViewOptions(
    @Param('tableId') tableId: string,
    @Param('viewId') viewId: string,
    @Body(new ZodValidationPipe(viewOptionsRoSchema)) updateViewOptionRo: IViewOptionsRo,
    @Headers('x-window-id') windowId?: string
  ): Promise<void> {
    return await this.viewOpenApiService.patchViewOptions(
      tableId,
      viewId,
      updateViewOptionRo.options,
      windowId
    );
  }

  @Put('/:viewId/order')
  async updateViewOrder(
    @Param('tableId') tableId: string,
    @Param('viewId') viewId: string,
    @Body(new ZodValidationPipe(updateOrderRoSchema)) updateOrderRo: IUpdateOrderRo,
    @Headers('x-window-id') windowId?: string
  ): Promise<void> {
    return await this.viewOpenApiService.updateViewOrder(tableId, viewId, updateOrderRo, windowId);
  }

  @Put('/:viewId/record-order')
  async updateRecordOrders(
    @Param('tableId') tableId: string,
    @Param('viewId') viewId: string,
    @Body(new ZodValidationPipe(updateRecordOrdersRoSchema))
    updateRecordOrdersRo: IUpdateRecordOrdersRo,
    @Headers('x-window-id') windowId?: string
  ): Promise<void> {
    return await this.viewOpenApiService.updateRecordOrders(
      tableId,
      viewId,
      updateRecordOrdersRo,
      windowId
    );
  }

  @Get('/:viewId/filter-link-records')
  async getFilterLinkRecords(
    @Param('tableId') tableId: string,
    @Param('viewId') viewId: string
  ): Promise<IGetViewFilterLinkRecordsVo> {
    return this.viewOpenApiService.getFilterLinkRecords(tableId, viewId);
  }

  @Get('/socket/snapshot-bulk')
  async getSnapshotBulk(@Param('tableId') tableId: string, @Query('ids') ids: string[]) {
    return this.viewService.getSnapshotBulk(tableId, ids);
  }

  @Get('/socket/doc-ids')
  async getDocIds(@Param('tableId') tableId: string) {
    return this.viewService.getDocIdsByQuery(tableId, undefined);
  }

  @Post('/plugin')
  async pluginInstall(
    @Param('tableId') tableId: string,
    @Body(new ZodValidationPipe(viewInstallPluginRoSchema)) ro: IViewInstallPluginRo
  ): Promise<IViewInstallPluginVo> {
    return this.viewOpenApiService.pluginInstall(tableId, ro);
  }

  @Get(':viewId/plugin')
  getPluginInstall(
    @Param('tableId') tableId: string,
    @Param('viewId') viewId: string
  ): Promise<IGetViewInstallPluginVo> {
    return this.viewOpenApiService.getPluginInstall(tableId, viewId);
  }

  @Patch(':viewId/plugin/:pluginInstallId')
  async pluginUpdateStorage(
    @Param('viewId') viewId: string,
    @Body(new ZodValidationPipe(viewPluginUpdateStorageRoSchema))
    ro: IViewPluginUpdateStorageRo
  ) {
    return this.viewOpenApiService.updatePluginStorage(viewId, ro.storage);
  }
}
