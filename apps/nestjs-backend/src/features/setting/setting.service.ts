import { Injectable, NotFoundException } from '@nestjs/common';
import type { ISettingVo, IUpdateSettingRo } from '@teable/openapi';
import { PrismaService } from '../../prisma';

@Injectable()
export class SettingService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSetting(): Promise<ISettingVo> {
    return await this.prismaService.setting
      .findFirstOrThrow({
        select: {
          instanceId: true,
          disallowSignUp: true,
          enableEmailVerification: true,
        },
      })
      .catch(() => {
        throw new NotFoundException('Setting not found');
      });
  }

  async updateSetting(updateSettingRo: IUpdateSettingRo) {
    const setting = await this.getSetting();

    return await this.prismaService.setting.update({
      where: { instanceId: setting.instanceId },
      data: updateSettingRo,
    });
  }
}
