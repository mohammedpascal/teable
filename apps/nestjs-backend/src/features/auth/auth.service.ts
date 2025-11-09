import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { IUserInfoVo, IUserMeVo } from '@teable/openapi';
import { pick } from 'lodash';
import ms from 'ms';
import { ClsService } from 'nestjs-cls';
import type { IClsStore } from '../../types/cls';
import type { IJwtAuthInfo } from './strategies/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly cls: ClsService<IClsStore>,
    private readonly jwtService: JwtService
  ) {}

  async getUserInfo(user: IUserMeVo): Promise<IUserInfoVo> {
    return pick(user, ['id', 'email', 'avatar', 'name']);
  }

  async validateJwtToken(token: string) {
    try {
      return await this.jwtService.verifyAsync<IJwtAuthInfo>(token);
    } catch {
      throw new UnauthorizedException();
    }
  }

  async getTempToken(userId: string = this.cls.get('user.id')) {
    const payload: IJwtAuthInfo = {
      userId,
    };
    const expiresIn = '10m';
    return {
      accessToken: await this.jwtService.signAsync(payload, { expiresIn }),
      expiresTime: new Date(Date.now() + ms(expiresIn)).toISOString(),
    };
  }
}
