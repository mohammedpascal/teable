/* eslint-disable sonarjs/no-duplicate-string */
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import type {
  IPluginPanelCreateVo,
  IPluginPanelGetVo,
  IPluginPanelInstallVo,
  IPluginPanelListVo,
  IPluginPanelPluginGetVo,
  IPluginPanelRenameVo,
  IPluginPanelUpdateLayoutVo,
  IPluginPanelUpdateStorageVo,
} from '@teable/openapi';
import {
  IPluginPanelCreateRo,
  pluginPanelCreateRoSchema,
  pluginPanelRenameRoSchema,
  IPluginPanelRenameRo,
  pluginPanelUpdateLayoutRoSchema,
  IPluginPanelUpdateLayoutRo,
  pluginPanelInstallRoSchema,
  IPluginPanelInstallRo,
  pluginPanelUpdateStorageRoSchema,
  IPluginPanelUpdateStorageRo,
} from '@teable/openapi';
import { ZodValidationPipe } from '../../zod.validation.pipe';
import { PluginPanelService } from './plugin-panel.service';

@Controller('api/table/:tableId/plugin-panel')
export class PluginPanelController {
  constructor(private readonly pluginPanelService: PluginPanelService) {}

  @Post()
  createPluginPanel(
    @Param('tableId') tableId: string,
    @Body(new ZodValidationPipe(pluginPanelCreateRoSchema))
    createPluginPanelDto: IPluginPanelCreateRo
  ): Promise<IPluginPanelCreateVo> {
    return this.pluginPanelService.createPluginPanel(tableId, createPluginPanelDto);
  }

  @Get()
  getPluginPanels(@Param('tableId') tableId: string): Promise<IPluginPanelListVo> {
    return this.pluginPanelService.getPluginPanels(tableId);
  }

  @Get(':pluginPanelId')
  getPluginPanel(
    @Param('tableId') tableId: string,
    @Param('pluginPanelId') pluginPanelId: string
  ): Promise<IPluginPanelGetVo> {
    return this.pluginPanelService.getPluginPanel(tableId, pluginPanelId);
  }

  @Patch(':pluginPanelId/rename')
  renamePluginPanel(
    @Param('tableId') tableId: string,
    @Param('pluginPanelId') pluginPanelId: string,
    @Body(new ZodValidationPipe(pluginPanelRenameRoSchema))
    renamePluginPanelDto: IPluginPanelRenameRo
  ): Promise<IPluginPanelRenameVo> {
    return this.pluginPanelService.renamePluginPanel(tableId, pluginPanelId, renamePluginPanelDto);
  }

  @Delete(':pluginPanelId')
  async deletePluginPanel(
    @Param('tableId') tableId: string,
    @Param('pluginPanelId') pluginPanelId: string
  ): Promise<void> {
    await this.pluginPanelService.deletePluginPanel(tableId, pluginPanelId);
  }

  @Patch(':pluginPanelId/layout')
  updatePluginPanelLayout(
    @Param('tableId') tableId: string,
    @Param('pluginPanelId') pluginPanelId: string,
    @Body(new ZodValidationPipe(pluginPanelUpdateLayoutRoSchema))
    updatePluginPanelLayoutDto: IPluginPanelUpdateLayoutRo
  ): Promise<IPluginPanelUpdateLayoutVo> {
    return this.pluginPanelService.updatePluginPanelLayout(
      tableId,
      pluginPanelId,
      updatePluginPanelLayoutDto
    );
  }

  @Post(':pluginPanelId/install')
  installPluginPanel(
    @Param('tableId') tableId: string,
    @Param('pluginPanelId') pluginPanelId: string,
    @Body(new ZodValidationPipe(pluginPanelInstallRoSchema))
    installPluginPanelDto: IPluginPanelInstallRo
  ): Promise<IPluginPanelInstallVo> {
    return this.pluginPanelService.installPluginPanel(
      tableId,
      pluginPanelId,
      installPluginPanelDto
    );
  }

  @Delete(':pluginPanelId/plugin/:pluginInstallId')
  removePluginPanelPlugin(
    @Param('tableId') tableId: string,
    @Param('pluginPanelId') pluginPanelId: string,
    @Param('pluginInstallId') pluginInstallId: string
  ): Promise<void> {
    return this.pluginPanelService.removePluginPanelPlugin(tableId, pluginPanelId, pluginInstallId);
  }

  @Patch(':pluginPanelId/plugin/:pluginInstallId/rename')
  renamePluginPanelPlugin(
    @Param('tableId') tableId: string,
    @Param('pluginPanelId') pluginPanelId: string,
    @Param('pluginInstallId') pluginInstallId: string,
    @Body(new ZodValidationPipe(pluginPanelRenameRoSchema))
    renamePluginPanelPluginDto: IPluginPanelRenameRo
  ): Promise<IPluginPanelRenameVo> {
    return this.pluginPanelService.renamePluginPanelPlugin(
      tableId,
      pluginPanelId,
      pluginInstallId,
      renamePluginPanelPluginDto
    );
  }

  @Patch(':pluginPanelId/plugin/:pluginInstallId/update-storage')
  updatePluginPanelPluginStorage(
    @Param('tableId') tableId: string,
    @Param('pluginPanelId') pluginPanelId: string,
    @Param('pluginInstallId') pluginInstallId: string,
    @Body(new ZodValidationPipe(pluginPanelUpdateStorageRoSchema))
    updatePluginPanelPluginStorageDto: IPluginPanelUpdateStorageRo
  ): Promise<IPluginPanelUpdateStorageVo> {
    return this.pluginPanelService.updatePluginPanelPluginStorage(
      tableId,
      pluginPanelId,
      pluginInstallId,
      updatePluginPanelPluginStorageDto
    );
  }

  @Get(':pluginPanelId/plugin/:pluginInstallId')
  getPluginPanelPlugin(
    @Param('tableId') tableId: string,
    @Param('pluginPanelId') pluginPanelId: string,
    @Param('pluginInstallId') pluginInstallId: string
  ): Promise<IPluginPanelPluginGetVo> {
    return this.pluginPanelService.getPluginPanelPlugin(tableId, pluginPanelId, pluginInstallId);
  }
}
