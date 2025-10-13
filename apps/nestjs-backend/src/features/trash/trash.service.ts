/* eslint-disable sonarjs/no-duplicate-string */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { FieldType, IFieldVo } from '@teable/core';
import { FieldKeyType, IdPrefix, Role } from '@teable/core';
import { PrismaService } from '@teable/db-main-prisma';
import type {
  IResetTrashItemsRo,
  IResourceMapVo,
  ITrashItemsRo,
  ITrashItemVo,
  ITrashRo,
  ITrashVo,
} from '@teable/openapi';
import { CollaboratorType, ResourceType } from '@teable/openapi';
import { keyBy } from 'lodash';
import { ClsService } from 'nestjs-cls';
import type { ICreateFieldsOperation } from '../../cache/types';
import { IThresholdConfig, ThresholdConfig } from '../../configs/threshold.config';
import type { IClsStore } from '../../types/cls';
import { FieldOpenApiService } from '../field/open-api/field-open-api.service';
import { RecordOpenApiService } from '../record/open-api/record-open-api.service';
import { TableOpenApiService } from '../table/open-api/table-open-api.service';
import { UserService } from '../user/user.service';
import { ViewService } from '../view/view.service';

@Injectable()
export class TrashService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cls: ClsService<IClsStore>,
    private readonly userService: UserService,
    private readonly tableOpenApiService: TableOpenApiService,
    private readonly fieldOpenApiService: FieldOpenApiService,
    private readonly recordOpenApiService: RecordOpenApiService,
    private readonly viewService: ViewService,
    @ThresholdConfig() private readonly thresholdConfig: IThresholdConfig
  ) {}

  async getAuthorizedBases() {
    const userId = this.cls.get('user.id');
    const departmentIds = this.cls.get('organization.departments')?.map((d) => d.id);

    const collaborators = await this.prismaService.txClient().collaborator.findMany({
      where: {
        principalId: { in: [userId, ...(departmentIds || [])] },
        roleName: { in: [Role.Owner, Role.Creator] },
        resourceType: CollaboratorType.Base,
      },
      select: {
        resourceId: true,
      },
    });

    const baseIds = new Set<string>();
    collaborators.forEach(({ resourceId }) => {
      baseIds.add(resourceId);
    });

    const bases = await this.prismaService.base.findMany({
      where: {
        id: { in: Array.from(baseIds) },
      },
      select: {
        id: true,
        name: true,
        userId: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      bases,
    };
  }

  async getTrash(trashRo: ITrashRo) {
    const { resourceType } = trashRo;

    switch (resourceType) {
      case ResourceType.Base:
        return await this.getBaseTrash();
      default:
        throw new BadRequestException('Invalid resource type');
    }
  }

  private async getBaseTrash() {
    const { bases } = await this.getAuthorizedBases();
    const baseIds = bases.map((base) => base.id);
    const baseIdMap = keyBy(bases, 'id');

    const list = await this.prismaService.trash.findMany({
      where: {
        resourceId: { in: baseIds },
        resourceType: ResourceType.Base,
      },
    });

    const trashItems: ITrashItemVo[] = [];
    const deletedBySet: Set<string> = new Set();
    const resourceMap: IResourceMapVo = {};

    list.forEach((item) => {
      const { id, resourceId, resourceType, deletedTime, deletedBy } = item;

      trashItems.push({
        id,
        resourceId,
        resourceType: resourceType as ResourceType.Base,
        deletedTime: deletedTime.toISOString(),
        deletedBy,
      });
      deletedBySet.add(deletedBy);

      const baseInfo = baseIdMap[resourceId];
      resourceMap[resourceId] = {
        id: resourceId,
        name: baseInfo.name,
      };
    });
    const userList = await this.userService.getUserInfoList(Array.from(deletedBySet));

    return {
      trashItems,
      resourceMap,
      userMap: keyBy(userList, 'id'),
      nextCursor: null,
    };
  }

  async getTrashItems(trashItemsRo: ITrashItemsRo): Promise<ITrashVo> {
    const { resourceType } = trashItemsRo;

    switch (resourceType) {
      case ResourceType.Base:
        return await this.getBaseTrashItems(trashItemsRo);
      case ResourceType.Table:
        return await this.getTableTrashItems(trashItemsRo);
      default:
        throw new BadRequestException('Invalid resource type');
    }
  }

  async getResourceMapByIds(
    resourceType: ResourceType,
    resourceIds: string[],
    tableId: string
  ): Promise<IResourceMapVo> {
    switch (resourceType) {
      case ResourceType.View: {
        const views = await this.prismaService.view.findMany({
          where: { id: { in: resourceIds }, deletedTime: { not: null } },
          select: {
            id: true,
            name: true,
            type: true,
          },
        });
        return keyBy(views, 'id');
      }
      case ResourceType.Field: {
        const fields = await this.prismaService.field.findMany({
          where: { id: { in: resourceIds }, deletedTime: { not: null } },
          select: {
            id: true,
            name: true,
            type: true,
            options: true,
            isLookup: true,
          },
        });
        return fields.reduce((acc, { id, name, type, options, isLookup }) => {
          acc[id] = {
            id,
            name,
            type: type as FieldType,
            options: options ? JSON.parse(options) : undefined,
            isLookup,
          };
          return acc;
        }, {} as IResourceMapVo);
      }
      case ResourceType.Record: {
        const recordList = await this.prismaService.recordTrash.findMany({
          where: { tableId, recordId: { in: resourceIds } },
          select: {
            recordId: true,
            snapshot: true,
          },
        });
        return recordList.reduce((acc, { recordId, snapshot }) => {
          const { name } = JSON.parse(snapshot) as { name: string };
          acc[recordId] = { id: recordId, name };
          return acc;
        }, {} as IResourceMapVo);
      }
      default:
        throw new BadRequestException('Invalid resource type');
    }
  }

  async getTableTrashItems(trashItemsRo: ITrashItemsRo): Promise<ITrashVo> {
    const { resourceId: tableId, cursor } = trashItemsRo;
    const accessTokenId = this.cls.get('accessTokenId');
    const limit = 20;
    let nextCursor: typeof cursor | undefined = undefined;

    // Permission checks removed - all authenticated users have access

    const list = await this.prismaService.tableTrash.findMany({
      where: {
        tableId,
      },
      select: {
        id: true,
        snapshot: true,
        resourceType: true,
        createdBy: true,
        createdTime: true,
      },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        createdTime: 'desc',
      },
    });

    if (list.length > limit) {
      const nextItem = list.pop();
      nextCursor = nextItem?.id;
    }

    const deletedResourceMap: Record<
      ResourceType.View | ResourceType.Field | ResourceType.Record,
      string[]
    > = {
      [ResourceType.View]: [],
      [ResourceType.Field]: [],
      [ResourceType.Record]: [],
    };
    const deletedBySet: Set<string> = new Set();
    const trashItems = list.map((item) => {
      const { id, snapshot, createdBy, createdTime } = item;
      const parsedSnapshot = JSON.parse(snapshot);
      const resourceType = item.resourceType as
        | ResourceType.View
        | ResourceType.Field
        | ResourceType.Record;

      const resourceIds =
        resourceType === ResourceType.Field
          ? (parsedSnapshot.fields as IFieldVo[]).map(({ id }) => id)
          : parsedSnapshot;
      deletedResourceMap[resourceType].push(...resourceIds);
      deletedBySet.add(createdBy);

      return {
        id,
        resourceType: resourceType,
        deletedTime: createdTime.toISOString(),
        deletedBy: createdBy,
        resourceIds,
      };
    });

    const resourceMap: IResourceMapVo = {};

    for (const [type, ids] of Object.entries(deletedResourceMap)) {
      if (ids.length > 0) {
        const resources = await this.getResourceMapByIds(type as ResourceType, ids, tableId);
        Object.assign(resourceMap, resources);
      }
    }

    const userList = await this.userService.getUserInfoList(Array.from(deletedBySet));

    return {
      trashItems,
      resourceMap,
      userMap: keyBy(userList, 'id'),
      nextCursor,
    };
  }

  async getBaseTrashItems(trashItemsRo: ITrashItemsRo): Promise<ITrashVo> {
    const { resourceId } = trashItemsRo;

    const accessTokenId = this.cls.get('accessTokenId');
    // Permission checks removed - all authenticated users have access

    const tables = await this.prismaService.tableMeta.findMany({
      where: {
        baseId: resourceId,
        deletedTime: { not: null },
      },
      select: {
        id: true,
        name: true,
      },
    });
    const tableIdMap = keyBy(tables, 'id');
    const trashItems: ITrashItemVo[] = [];
    const deletedBySet: Set<string> = new Set();
    const resourceMap: IResourceMapVo = {};

    const list = await this.prismaService.trash.findMany({
      where: {
        resourceId: { in: Object.keys(tableIdMap) },
        resourceType: ResourceType.Table,
      },
      orderBy: { deletedTime: 'desc' },
    });

    list.forEach((item) => {
      const { id, resourceId, resourceType, deletedTime, deletedBy } = item;

      trashItems.push({
        id,
        resourceId,
        resourceType: resourceType as ResourceType.Table,
        deletedTime: deletedTime.toISOString(),
        deletedBy,
      });
      deletedBySet.add(deletedBy);
      resourceMap[resourceId] = tableIdMap[resourceId];
    });
    const userList = await this.userService.getUserInfoList(Array.from(deletedBySet));

    return {
      trashItems,
      resourceMap,
      userMap: keyBy(userList, 'id'),
      nextCursor: null,
    };
  }

  async restoreResource(trashId: string) {
    const accessTokenId = this.cls.get('accessTokenId');

    return await this.prismaService.$tx(async (prisma) => {
      const { resourceId, resourceType } = await prisma.trash
        .findUniqueOrThrow({
          where: { id: trashId },
          select: {
            resourceId: true,
            resourceType: true,
          },
        })
        .catch(() => {
          throw new NotFoundException(`The trash ${trashId} not found`);
        });

      // Restore base
      if (resourceType === ResourceType.Base) {
        const base = await this.prismaService.base.findUniqueOrThrow({
          where: { id: resourceId },
          select: { id: true },
        });

        // Permission checks removed - all authenticated users have access

        await prisma.base.update({
          where: { id: resourceId },
          data: { deletedTime: null },
        });

        await prisma.trash.delete({
          where: { id: trashId },
        });
      }

      // Restore table
      if (resourceType === ResourceType.Table) {
        const { baseId } = await this.prismaService.tableMeta.findUniqueOrThrow({
          where: { id: resourceId },
          select: { id: true, baseId: true },
        });
        const base = await this.prismaService.base.findUniqueOrThrow({
          where: { id: baseId },
          select: { id: true },
        });

        // Permission checks removed - all authenticated users have access

        await this.tableOpenApiService.restoreTable(baseId, resourceId);
      }
    });
  }

  async restoreTableResource(trashId: string) {
    const accessTokenId = this.cls.get('accessTokenId');

    const {
      tableId,
      resourceType,
      snapshot: originSnapshot,
    } = await this.prismaService.tableTrash
      .findUniqueOrThrow({
        where: { id: trashId },
        select: {
          tableId: true,
          resourceType: true,
          snapshot: true,
        },
      })
      .catch(() => {
        throw new NotFoundException(`The table trash ${trashId} not found`);
      });

    // Permission checks removed - all authenticated users have access

    const snapshot = JSON.parse(originSnapshot);

    return await this.prismaService.$tx(
      async (prisma) => {
        switch (resourceType) {
          case ResourceType.View: {
            await this.viewService.restoreView(tableId, snapshot[0]);
            break;
          }
          case ResourceType.Field: {
            const { fields, records } = snapshot as ICreateFieldsOperation['result'];
            await prisma.field.updateMany({
              where: { id: { in: fields.map((f) => f.id) } },
              data: { deletedTime: null },
            });
            await this.fieldOpenApiService.createFields(tableId, fields);
            if (records) {
              await this.recordOpenApiService.updateRecords(tableId, {
                fieldKeyType: FieldKeyType.Id,
                records,
              });
            }
            break;
          }
          case ResourceType.Record: {
            const originRecords = await prisma.recordTrash.findMany({
              where: { tableId, recordId: { in: snapshot } },
              select: { snapshot: true },
            });
            const records = originRecords.map(({ snapshot }) => JSON.parse(snapshot));
            await this.recordOpenApiService.multipleCreateRecords(
              tableId,
              {
                fieldKeyType: FieldKeyType.Id,
                records,
              },
              true
            );
            await prisma.recordTrash.deleteMany({
              where: { tableId, recordId: { in: snapshot } },
            });
            break;
          }
          default:
            throw new BadRequestException('Invalid resource type');
        }

        await prisma.tableTrash.delete({
          where: { id: trashId },
        });
      },
      {
        timeout: this.thresholdConfig.bigTransactionTimeout,
      }
    );
  }

  async restoreTrash(trashId: string) {
    if (trashId.startsWith(IdPrefix.Operation)) {
      return await this.restoreTableResource(trashId);
    }
    return await this.restoreResource(trashId);
  }

  async resetTrashItems(resetTrashItemsRo: IResetTrashItemsRo) {
    const { resourceId, resourceType } = resetTrashItemsRo;
    const accessTokenId = this.cls.get('accessTokenId');

    if (![ResourceType.Base, ResourceType.Table].includes(resourceType)) {
      throw new BadRequestException('Invalid resource type');
    }

    if (resourceType === ResourceType.Base) {
      // Permission checks removed - all authenticated users have access

      const tables = await this.prismaService.tableMeta.findMany({
        where: {
          baseId: resourceId,
          deletedTime: { not: null },
        },
        select: { id: true },
      });

      if (!tables.length) return;

      const tableIds = tables.map(({ id }) => id);
      await this.tableOpenApiService.permanentDeleteTables(resourceId, tableIds);
    }

    if (resourceType === ResourceType.Table) {
      // Permission checks removed - all authenticated users have access
      await this.resetTableTrashItems(resourceId);
    }
  }

  private async resetTableTrashItems(tableId: string) {
    const deletedList = await this.prismaService.tableTrash.findMany({
      where: { tableId },
      select: { resourceType: true, snapshot: true },
    });
    let deletedViewIds: string[] = [];
    let deletedFieldIds: string[] = [];
    let deletedRecordIds: string[] = [];

    deletedList.forEach(({ resourceType, snapshot }) => {
      const parsedSnapshot = JSON.parse(snapshot);

      if (resourceType === ResourceType.View) {
        deletedViewIds.push(...parsedSnapshot);
      }

      if (resourceType === ResourceType.Field) {
        deletedFieldIds.push(...(parsedSnapshot.fields as IFieldVo[]).map(({ id }) => id));
      }

      if (resourceType === ResourceType.Record) {
        deletedRecordIds.push(...parsedSnapshot);
      }
    });

    deletedViewIds = [...new Set(deletedViewIds)];
    deletedFieldIds = [...new Set(deletedFieldIds)];
    deletedRecordIds = [...new Set(deletedRecordIds)];

    await this.prismaService.$tx(async (prisma) => {
      await prisma.view.deleteMany({
        where: { id: { in: deletedViewIds } },
      });

      await prisma.field.deleteMany({
        where: { id: { in: deletedFieldIds } },
      });

      await prisma.ops.deleteMany({
        where: {
          collection: tableId,
          docId: { in: [...deletedViewIds, ...deletedFieldIds, ...deletedRecordIds] },
        },
      });

      await prisma.recordTrash.deleteMany({
        where: { tableId },
      });

      await prisma.tableTrash.deleteMany({
        where: { tableId },
      });
    });
  }
}
