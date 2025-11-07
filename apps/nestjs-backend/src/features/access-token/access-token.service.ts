import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class AccessTokenService {
  constructor(private readonly prismaService: PrismaService) {}

  async validate(splitAccessTokenObj: { accessTokenId: string; sign: string }) {
    const { accessTokenId, sign } = splitAccessTokenObj;
    const accessTokenEntity = await this.prismaService.accessToken
      .findUniqueOrThrow({
        where: { id: accessTokenId },
        select: {
          userId: true,
          id: true,
          sign: true,
          expiredTime: true,
        },
      })
      .catch(() => {
        throw new UnauthorizedException('token not found');
      });
    if (sign !== accessTokenEntity.sign) {
      throw new UnauthorizedException('sign error');
    }
    // expiredTime 1ms tolerance
    if (accessTokenEntity.expiredTime.getTime() < Date.now() + 1000) {
      throw new UnauthorizedException('token expired');
    }
    await this.prismaService.accessToken.update({
      where: { id: accessTokenId },
      data: { lastUsedTime: new Date().toISOString() },
    });

    return {
      userId: accessTokenEntity.userId,
      accessTokenId: accessTokenEntity.id,
    };
  }
}
