/* eslint-disable sonarjs/no-duplicate-string */
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  createDashboardRoSchema,
  dashboardInstallPluginRoSchema,
  ICreateDashboardRo,
  IRenameDashboardRo,
  IUpdateLayoutDashboardRo,
  renameDashboardRoSchema,
  updateLayoutDashboardRoSchema,
  IDashboardInstallPluginRo,
  dashboardPluginUpdateStorageRoSchema,
  IDashboardPluginUpdateStorageRo,
} from '@teable/openapi';
import type {
  ICreateDashboardVo,
  IGetDashboardVo,
  IRenameDashboardVo,
  IUpdateLayoutDashboardVo,
  IGetDashboardListVo,
  IDashboardInstallPluginVo,
  IDashboardPluginUpdateStorageVo,
  IGetDashboardInstallPluginVo,
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

  @Post(':id/plugin')
  installPlugin(
    @Param('baseId') baseId: string,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(dashboardInstallPluginRoSchema)) ro: IDashboardInstallPluginRo
  ): Promise<IDashboardInstallPluginVo> {
    return this.dashboardService.installPlugin(baseId, id, ro);
  }

  @Delete(':id/plugin/:pluginInstallId')
  removePlugin(
    @Param('baseId') baseId: string,
    @Param('id') id: string,
    @Param('pluginInstallId') pluginInstallId: string
  ): Promise<void> {
    return this.dashboardService.removePlugin(baseId, id, pluginInstallId);
  }

  @Patch(':id/plugin/:pluginInstallId/rename')
  renamePlugin(
    @Param('baseId') baseId: string,
    @Param('id') id: string,
    @Param('pluginInstallId') pluginInstallId: string,
    @Body(new ZodValidationPipe(renameDashboardRoSchema)) ro: IRenameDashboardRo
  ): Promise<IRenameDashboardVo> {
    return this.dashboardService.renamePlugin(baseId, id, pluginInstallId, ro.name);
  }

  @Patch(':id/plugin/:pluginInstallId/update-storage')
  updatePluginStorage(
    @Param('baseId') baseId: string,
    @Param('id') id: string,
    @Param('pluginInstallId') pluginInstallId: string,
    @Body(new ZodValidationPipe(dashboardPluginUpdateStorageRoSchema))
    ro: IDashboardPluginUpdateStorageRo
  ): Promise<IDashboardPluginUpdateStorageVo> {
    return this.dashboardService.updatePluginStorage(baseId, id, pluginInstallId, ro.storage);
  }

  @Get(':id/plugin/:pluginInstallId')
  getPluginInstall(
    @Param('baseId') baseId: string,
    @Param('id') id: string,
    @Param('pluginInstallId') pluginInstallId: string
  ): Promise<IGetDashboardInstallPluginVo> {
    return this.dashboardService.getPluginInstall(baseId, id, pluginInstallId);
  }
}
