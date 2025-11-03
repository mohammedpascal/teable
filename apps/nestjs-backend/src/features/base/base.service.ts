import { Injectable, NotFoundException } from '@nestjs/common';
import { ActionPrefix, actionPrefixMap } from '@teable/core';
import type { IGetBasePermissionVo } from '@teable/openapi';
import { CollaboratorType } from '@teable/openapi';
import { PrismaService } from '../../prisma';

@Injectable()
export class BaseService {
  constructor(private readonly prismaService: PrismaService) {}

  async getBaseById(baseId: string) {
    const base = await this.prismaService.base
      .findFirstOrThrow({
        select: {
          id: true,
          name: true,
        },
        where: {
          id: baseId,
        },
      })
      .catch(() => {
        throw new NotFoundException('Base not found');
      });
    // Permission checks removed - all authenticated users have access
    // Return base with default role for authenticated users
    return {
      ...base,
      role: 'creator' as const, // Default role for authenticated users
      collaboratorType: CollaboratorType.Base,
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
