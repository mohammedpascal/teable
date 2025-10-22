import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ActionPrefix, actionPrefixMap, isUnrestrictedRole } from '@teable/core';
import { PrismaService } from '../../prisma';
import { CollaboratorType, ResourceType } from '@teable/openapi';
import type { IDuplicateBaseRo, IGetBasePermissionVo } from '@teable/openapi';
import { ClsService } from 'nestjs-cls';
import { IThresholdConfig, ThresholdConfig } from '../../configs/threshold.config';
import { InjectDbProvider } from '../../db-provider/db.provider';
import { IDbProvider } from '../../db-provider/db.provider.interface';
import type { IClsStore } from '../../types/cls';
import { getMaxLevelRole } from '../../utils/get-max-level-role';
import { CollaboratorService } from '../collaborator/collaborator.service';
import { TableOpenApiService } from '../table/open-api/table-open-api.service';
import { BaseDuplicateService } from './base-duplicate.service';

@Injectable()
export class BaseService {
  private logger = new Logger(BaseService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly cls: ClsService<IClsStore>,
    private readonly collaboratorService: CollaboratorService,
    private readonly baseDuplicateService: BaseDuplicateService,
    private readonly tableOpenApiService: TableOpenApiService,
    @InjectDbProvider() private readonly dbProvider: IDbProvider,
    @ThresholdConfig() private readonly thresholdConfig: IThresholdConfig
  ) {}

  async getBaseById(baseId: string) {
    const userId = this.cls.get('user.id');
    const departmentIds = this.cls.get('organization.departments')?.map((d) => d.id);
    const base = await this.prismaService.base
      .findFirstOrThrow({
        select: {
          id: true,
          name: true,
          icon: true,
          userId: true,
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
      isUnrestricted: true,
    };
  }

  async getAllBaseList() {
    const { baseIds, roleMap } =
      await this.collaboratorService.getCurrentUserCollaboratorsBaseArray();
    const userId = this.cls.get('user.id');

    const baseList = await this.prismaService.base.findMany({
      select: {
        id: true,
        name: true,
        order: true,
        userId: true,
        icon: true,
      },
      where: {
        OR: [
          {
            id: {
              in: baseIds,
            },
          },
          {
            userId: userId,
          },
        ],
      },
      orderBy: [{ userId: 'asc' }, { order: 'asc' }],
    });
    return baseList.map((base) => ({ ...base, role: roleMap[base.id] }));
  }

  async getAccessBaseList() {
    const userId = this.cls.get('user.id');
    const accessTokenId = this.cls.get('accessTokenId');
    const { baseIds } =
      await this.collaboratorService.getCurrentUserCollaboratorsBaseArray();

    if (accessTokenId) {
      const access = await this.prismaService.accessToken.findFirst({
        select: {
          baseIds: true,
        },
        where: {
          id: accessTokenId,
          userId,
        },
      });
      if (!access) {
        return [];
      }
      baseIds.push(...(access.baseIds || []));
    }

    // Get user's own base
    const userBase = await this.prismaService.base.findFirst({
      select: {
        id: true,
        name: true,
      },
      where: {
        userId: userId,
      },
    });

    return userBase ? [userBase] : [];
  }

  async getUserDefaultBase() {
    const userId = this.cls.get('user.id');

    const base = await this.prismaService.base.findFirst({
      select: {
        id: true,
        name: true,
        icon: true,
        userId: true,
      },
      where: {
        userId: userId,
      },
    });

    if (!base) {
      throw new NotFoundException('User default base not found');
    }

    return base;
  }

  async duplicateBase(duplicateBaseRo: IDuplicateBaseRo) {
    // permission check, base read permission
    await this.checkBaseReadPermission(duplicateBaseRo.fromBaseId);
    return await this.prismaService.$tx(
      async () => {
        return await this.baseDuplicateService.duplicate(duplicateBaseRo);
      },
      { timeout: this.thresholdConfig.bigTransactionTimeout }
    );
  }

  private async checkBaseReadPermission(_baseId: string) {
    // Permission checks removed - all authenticated users have access
    return;
  }

  async getPermission() {
    // Return all permissions as true for authenticated users
    return [
      ...actionPrefixMap[ActionPrefix.Table],
      ...actionPrefixMap[ActionPrefix.Base],
      ...actionPrefixMap[ActionPrefix.Automation],
      ...actionPrefixMap[ActionPrefix.TableRecordHistory],
    ].reduce((acc, action) => {
      acc[action] = true;
      return acc;
    }, {} as IGetBasePermissionVo);
  }

  async deleteBase(baseId: string) {
    // Permission checks removed - all authenticated users have access

    return await this.prismaService.$tx(
      async (prisma) => {
        const tables = await prisma.tableMeta.findMany({
          where: { baseId },
          select: { id: true },
        });
        const tableIds = tables.map(({ id }) => id);

        await this.dropBase(baseId, tableIds);
        await this.tableOpenApiService.cleanReferenceFieldIds(tableIds);
        await this.tableOpenApiService.cleanTablesRelatedData(baseId, tableIds);
        await this.cleanBaseRelatedData(baseId);
      },
      {
        timeout: this.thresholdConfig.bigTransactionTimeout,
      }
    );
  }

  async dropBase(baseId: string, tableIds: string[]) {
    const sql = this.dbProvider.dropSchema(baseId);
    if (sql) {
      return await this.prismaService.txClient().$executeRawUnsafe(sql);
    }
    await this.tableOpenApiService.dropTables(tableIds);
  }

  async cleanBaseRelatedData(baseId: string) {
    // delete collaborators for base
    await this.prismaService.txClient().collaborator.deleteMany({
      where: { resourceId: baseId, resourceType: CollaboratorType.Base },
    });

    // delete invitation for base
    await this.prismaService.txClient().invitation.deleteMany({
      where: { baseId },
    });

    // delete invitation record for base
    await this.prismaService.txClient().invitationRecord.deleteMany({
      where: { baseId },
    });

    // delete base
    await this.prismaService.txClient().base.delete({
      where: { id: baseId },
    });

  }
}
