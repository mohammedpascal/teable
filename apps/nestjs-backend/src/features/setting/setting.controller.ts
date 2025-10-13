import { Body, Controller, Get, Patch } from '@nestjs/common';
import type { IPublicSettingVo, ISettingVo } from '@teable/openapi';
import { IUpdateSettingRo, updateSettingRoSchema } from '@teable/openapi';
import { ZodValidationPipe } from '../../zod.validation.pipe';
import { Public } from '../auth/decorators/public.decorator';
import { SettingService } from './setting.service';

@Controller('api/admin/setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  async getSetting(): Promise<ISettingVo> {
    return await this.settingService.getSetting();
  }

  /**
   * Public endpoint for getting public settings without authentication
   */
  @Public()
  @Get('public')
  async getPublicSetting(): Promise<IPublicSettingVo> {
    return await this.settingService.getSetting();
  }

  @Patch()
  async updateSetting(
    @Body(new ZodValidationPipe(updateSettingRoSchema))
    updateSettingRo: IUpdateSettingRo
  ): Promise<ISettingVo> {
    return await this.settingService.updateSetting(updateSettingRo);
  }
}
