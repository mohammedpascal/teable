import { Injectable } from '@nestjs/common';
import { ActionPrefix, actionPrefixMap } from '@teable/core';
import type { IGetBasePermissionVo } from '@teable/openapi';
import { PrismaService } from '../../prisma';

@Injectable()
export class BaseService {
  constructor(private readonly prismaService: PrismaService) {}

  async getBaseById() {
    return {
      id: 'bse0',
      name: 'Base',
    };
  }

  async getPermission() {
    // Return all permissions as true for authenticated users
    return [
      ...actionPrefixMap[ActionPrefix.Table],
      ...actionPrefixMap[ActionPrefix.Base],
      ...actionPrefixMap[ActionPrefix.TableRecordHistory],
    ].reduce((acc, action) => {
      acc[action] = true;
      return acc;
    }, {} as IGetBasePermissionVo);
  }
}
