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

@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboard(): Promise<IGetDashboardListVo> {
    return this.dashboardService.getDashboard();
  }

  @Get(':id')
  getDashboardById(@Param('id') id: string): Promise<IGetDashboardVo> {
    return this.dashboardService.getDashboardById(id);
  }

  @Post()
  createDashboard(
    @Body(new ZodValidationPipe(createDashboardRoSchema)) ro: ICreateDashboardRo
  ): Promise<ICreateDashboardVo> {
    return this.dashboardService.createDashboard(ro);
  }

  @Patch(':id/rename')
  updateDashboard(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(renameDashboardRoSchema)) ro: IRenameDashboardRo
  ): Promise<IRenameDashboardVo> {
    return this.dashboardService.renameDashboard(id, ro.name);
  }

  @Patch(':id/layout')
  updateLayout(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateLayoutDashboardRoSchema)) ro: IUpdateLayoutDashboardRo
  ): Promise<IUpdateLayoutDashboardVo> {
    return this.dashboardService.updateLayout(id, ro.layout);
  }

  @Delete(':id')
  deleteDashboard(@Param('id') id: string): Promise<void> {
    return this.dashboardService.deleteDashboard(id);
  }

  // Widget management endpoints
  @Post(':id/widget')
  createWidget(
    @Param('id') dashboardId: string,
    @Body() widgetData: { name: string; type: string; config?: string; position?: string }
  ) {
    return this.dashboardService.createWidget(dashboardId, widgetData);
  }

  @Patch(':id/widget/:widgetId')
  updateWidget(
    @Param('id') dashboardId: string,
    @Param('widgetId') widgetId: string,
    @Body() widgetData: { name?: string; config?: string; position?: string }
  ) {
    return this.dashboardService.updateWidget(dashboardId, widgetId, widgetData);
  }

  @Delete(':id/widget/:widgetId')
  deleteWidget(@Param('id') dashboardId: string, @Param('widgetId') widgetId: string) {
    return this.dashboardService.deleteWidget(dashboardId, widgetId);
  }
}
