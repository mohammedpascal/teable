import { Injectable } from '@nestjs/common';
import type { ISettingVo, IUpdateSettingRo } from '@teable/openapi';
import { PrismaService } from '../../prisma';

@Injectable()
export class SettingService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSetting(): Promise<ISettingVo> {
    let setting = await this.prismaService.setting.findFirst({
      select: {
        instanceId: true,
        disallowSignUp: true,
        enableEmailVerification: true,
      },
    });

    if (!setting) {
      setting = await this.prismaService.setting.create({
        data: {
          disallowSignUp: null,
          enableEmailVerification: null,
        },
        select: {
          instanceId: true,
          disallowSignUp: true,
          enableEmailVerification: true,
        },
      });
    }

    return setting;
  }

  async updateSetting(updateSettingRo: IUpdateSettingRo) {
    const setting = await this.getSetting();

    return await this.prismaService.setting.update({
      where: { instanceId: setting.instanceId },
      data: updateSettingRo,
    });
  }
}
