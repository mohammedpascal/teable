/* eslint-disable sonarjs/no-duplicate-string */
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  createDashboardRoSchema,
  ICreateDashboardRo,
  IRenameDashboardRo,
  IUpdateLayoutDashboardRo,
  renameDashboardRoSchema,
  updateLayoutDashboardRoSchema,
} from '@teable/openapi';
import type {
  ICreateDashboardVo,
  IGetDashboardVo,
  IRenameDashboardVo,
  IUpdateLayoutDashboardVo,
  IGetDashboardListVo,
} from '@teable/openapi';
import { ZodValidationPipe } from '../../zod.validation.pipe';
import { DashboardService } from './dashboard.service';

@Controller('api/base/:baseId/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboard(@Param('baseId') baseId: string): Promise<IGetDashboardListVo> {
    return this.dashboardService.getDashboard(baseId);
  }

  @Get(':id')
  getDashboardById(
    @Param('baseId') baseId: string,
    @Param('id') id: string
  ): Promise<IGetDashboardVo> {
    return this.dashboardService.getDashboardById(baseId, id);
  }

  @Post()
  createDashboard(
    @Param('baseId') baseId: string,
    @Body(new ZodValidationPipe(createDashboardRoSchema)) ro: ICreateDashboardRo
  ): Promise<ICreateDashboardVo> {
    return this.dashboardService.createDashboard(baseId, ro);
  }

  @Patch(':id/rename')
  updateDashboard(
    @Param('baseId') baseId: string,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(renameDashboardRoSchema)) ro: IRenameDashboardRo
  ): Promise<IRenameDashboardVo> {
    return this.dashboardService.renameDashboard(baseId, id, ro.name);
  }

  @Patch(':id/layout')
  updateLayout(
    @Param('baseId') baseId: string,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateLayoutDashboardRoSchema)) ro: IUpdateLayoutDashboardRo
  ): Promise<IUpdateLayoutDashboardVo> {
    return this.dashboardService.updateLayout(baseId, id, ro.layout);
  }

  @Delete(':id')
  deleteDashboard(@Param('baseId') baseId: string, @Param('id') id: string): Promise<void> {
    return this.dashboardService.deleteDashboard(baseId, id);
  }

  // Widget management endpoints
  @Post(':id/widget')
  createWidget(
    @Param('baseId') baseId: string,
    @Param('id') dashboardId: string,
    @Body() widgetData: { name: string; type: string; config?: string; position?: string }
  ) {
    return this.dashboardService.createWidget(baseId, dashboardId, widgetData);
  }

  @Patch(':id/widget/:widgetId')
  updateWidget(
    @Param('baseId') baseId: string,
    @Param('id') dashboardId: string,
    @Param('widgetId') widgetId: string,
    @Body() widgetData: { name?: string; config?: string; position?: string }
  ) {
    return this.dashboardService.updateWidget(baseId, dashboardId, widgetId, widgetData);
  }

  @Delete(':id/widget/:widgetId')
  deleteWidget(
    @Param('baseId') baseId: string,
    @Param('id') dashboardId: string,
    @Param('widgetId') widgetId: string
  ) {
    return this.dashboardService.deleteWidget(baseId, dashboardId, widgetId);
  }
}
