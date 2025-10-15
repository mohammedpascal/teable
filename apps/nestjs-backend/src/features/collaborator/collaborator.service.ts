// TODO: Multi-user collaboration functionality removed
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable sonarjs/no-duplicate-string */
import { Injectable } from '@nestjs/common';
import { Role, type IBaseRole, type IRole } from '@teable/core';
import { PrismaService } from '@teable/db-main-prisma';
import { CollaboratorType, PrincipalType } from '@teable/openapi';
import { ClsService } from 'nestjs-cls';
import type { IClsStore } from '../../types/cls';

@Injectable()
export class CollaboratorService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cls: ClsService<IClsStore>
  ) {}

  // Stub method - collaboration removed, return empty list
  async getUserCollaboratorsByTableId(
    tableId: string,
    query: {
      containsIn: {
        keys: ('id' | 'name' | 'email' | 'phone')[];
        values: string[];
      };
    }
  ) {
    // TODO: Multi-user collaboration removed - return empty
    return [];
  }

  // Stub method - collaboration removed, assume user owns their base
  async getCurrentUserCollaboratorsBaseArray(searchRoles?: IRole[]) {
    // TODO: Multi-user collaboration removed
    // Return base owned by user directly instead of through collaborator table
    const userId = this.cls.get('user.id');
    const base = await this.prismaService.txClient().base.findFirst({
      where: {
        userId: userId,
      },
      select: {
        id: true,
      },
    });
    
    const baseIds = base ? [base.id] : [];
    const roleMap: Record<string, IRole> = {};
    baseIds.forEach(id => {
      roleMap[id] = Role.Owner; // User owns their own base
    });
    
    return {
      baseIds,
      roleMap,
    };
  }

  // Keep for invitation service - creates base access for invited user
  async createBaseCollaborator({
    collaborators,
    baseId,
    role,
    createdBy,
  }: {
    collaborators: {
      principalId: string;
      principalType: PrincipalType;
    }[];
    baseId: string;
    role: IBaseRole;
    createdBy?: string;
  }) {
    // TODO: Multi-user collaboration removed
    // For now, this is a no-op since we don't support multi-user collaboration
    // Invitations can still be created but won't grant actual access
    return 0;
  }


  // Keep for invitation service - validates user can add collaborators
  async validateUserAddRole({
    departmentIds,
    userId,
    addRole,
    resourceId,
    resourceType,
  }: {
    departmentIds?: string[];
    userId: string;
    addRole: IRole;
    resourceId: string;
    resourceType: CollaboratorType;
  }) {
    // TODO: Multi-user collaboration removed
    // Check if user owns the base directly
    if (resourceType === CollaboratorType.Base) {
      const base = await this.prismaService.txClient().base.findFirst({
        where: {
          id: resourceId,
          userId: userId,
        },
        select: { id: true },
      });
      
      if (!base) {
        throw new Error('User does not own this base');
      }
    }
    // For spaces, skip validation since spaces not implemented
  }
}

// Original implementation commented out below:
/*
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { canManageRole, getRandomString, Role, type IBaseRole, type IRole } from '@teable/core';
import { PrismaService } from '@teable/db-main-prisma';
import type { AddBaseCollaboratorRo, CollaboratorItem } from '@teable/openapi';
import { CollaboratorType, UploadType, PrincipalType } from '@teable/openapi';
import { Knex } from 'knex';
import { difference, map } from 'lodash';
import { InjectModel } from 'nest-knexjs';
import { ClsService } from 'nestjs-cls';
import { InjectDbProvider } from '../../db-provider/db.provider';
import { IDbProvider } from '../../db-provider/db.provider.interface';
import { EventEmitterService } from '../../event-emitter/event-emitter.service';
import {
  CollaboratorCreateEvent,
  CollaboratorDeleteEvent,
  Events,
} from '../../event-emitter/events';
import type { IClsStore } from '../../types/cls';
import { getMaxLevelRole } from '../../utils/get-max-level-role';
import StorageAdapter from '../attachments/plugins/adapter';
import { getFullStorageUrl } from '../attachments/plugins/utils';

@Injectable()
export class CollaboratorService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cls: ClsService<IClsStore>,
    private readonly eventEmitterService: EventEmitterService,
    @InjectModel('CUSTOM_KNEX') private readonly knex: Knex,
    @InjectDbProvider() private readonly dbProvider: IDbProvider
  ) {}

  protected async getBaseCollaboratorBuilder(
    knex: Knex.QueryBuilder,
    baseId: string,
    options?: { includeSystem?: boolean; search?: string; type?: PrincipalType }
  ) {
    const userId = this.cls.get('user.id');

    // Check if user owns the base directly
    const userBase = await this.prismaService.txClient().base.findFirst({
      where: {
        id: baseId,
        userId: userId,
      },
      select: { id: true },
    });

    const builder = knex
      .from('collaborator')
      .leftJoin('users', 'collaborator.principal_id', 'users.id')
      .whereIn('collaborator.resource_id', [baseId]);

    const { includeSystem, search, type } = options ?? {};
    if (!includeSystem) {
      builder.where((db) => {
        return db.whereNull('users.is_system').orWhere('users.is_system', false);
      });
    }
    if (search) {
      this.dbProvider.searchBuilder(builder, [
        ['users.name', search],
        ['users.email', search],
      ]);
    }
    if (type) {
      builder.where('collaborator.principal_type', type);
    }
  }

  async getTotalBase(
    baseId: string,
    options?: { includeSystem?: boolean; search?: string; type?: PrincipalType }
  ) {
    const builder = this.knex();
    await this.getBaseCollaboratorBuilder(builder, baseId, options);
    const res = await this.prismaService
      .txClient()
      .$queryRawUnsafe<
        { count: number }[]
      >(builder.select(this.knex.raw('COUNT(*) as count')).toQuery());
    return Number(res[0].count);
  }

  protected async getListByBaseBuilder(
    builder: Knex.QueryBuilder,
    options?: {
      includeSystem?: boolean;
      skip?: number;
      take?: number;
      search?: string;
      type?: PrincipalType;
    }
  ) {
    const { skip = 0, take = 50 } = options ?? {};
    builder.offset(skip);
    builder.limit(take);
    builder.select({
      resource_id: 'collaborator.resource_id',
      role_name: 'collaborator.role_name',
      created_time: 'collaborator.created_time',
      resource_type: 'collaborator.resource_type',
      user_id: 'users.id',
      user_name: 'users.name',
      user_email: 'users.email',
      user_avatar: 'users.avatar',
      user_is_system: 'users.is_system',
    });
    builder.orderBy('collaborator.created_time', 'asc');
  }

  async getListByBase(
    baseId: string,
    options?: {
      includeSystem?: boolean;
      skip?: number;
      take?: number;
      search?: string;
      type?: PrincipalType;
    }
  ): Promise<CollaboratorItem[]> {
    const builder = this.knex();
    builder.whereNotNull('users.id');
    await this.getBaseCollaboratorBuilder(builder, baseId, options);
    await this.getListByBaseBuilder(builder, options);
    const collaborators = await this.prismaService.txClient().$queryRawUnsafe<
      {
        resource_id: string;
        role_name: string;
        created_time: Date;
        resource_type: string;
        user_id: string;
        user_name: string;
        user_email: string;
        user_avatar: string;
        user_is_system: boolean | null;
      }[]
    >(builder.toQuery());

    return collaborators.map((collaborator) => ({
      type: PrincipalType.User,
      userId: collaborator.user_id,
      userName: collaborator.user_name,
      email: collaborator.user_email,
      avatar: collaborator.user_avatar
        ? getFullStorageUrl(StorageAdapter.getBucket(UploadType.Avatar), collaborator.user_avatar)
        : null,
      role: collaborator.role_name as IRole,
      createdTime: collaborator.created_time.toISOString(),
      resourceType: collaborator.resource_type as CollaboratorType,
      isSystem: collaborator.user_is_system || undefined,
    }));
  }

  async getUserCollaboratorsByTableId(
    tableId: string,
    query: {
      containsIn: {
        keys: ('id' | 'name' | 'email' | 'phone')[];
        values: string[];
      };
    }
  ) {
    const { baseId } = await this.prismaService.txClient().tableMeta.findUniqueOrThrow({
      select: { baseId: true },
      where: { id: tableId },
    });

    const userId = this.cls.get('user.id');

    // Check if user owns the base directly
    const userBase = await this.prismaService.txClient().base.findFirst({
      where: {
        id: baseId,
        userId: userId,
      },
      select: { id: true },
    });

    const builder = this.knex('collaborator');
    builder.join('users', 'collaborator.principal_id', 'users.id');
    builder.whereIn('collaborator.resource_id', [baseId]);
    if (query.containsIn) {
      builder.where((db) => {
        const keys = query.containsIn.keys;
        const values = query.containsIn.values;
        keys.forEach((key) => {
          db.orWhereIn('users.' + key, values);
        });
        return db;
      });
    }
    builder.orderBy('collaborator.created_time', 'asc');
    builder.select({
      user_id: 'users.id',
      user_name: 'users.name',
      user_email: 'users.email',
      user_avatar: 'users.avatar',
      user_is_system: 'users.is_system',
    });
    const collaborators = await this.prismaService.txClient().$queryRawUnsafe<
      {
        user_id: string;
        user_name: string;
        user_email: string;
        user_avatar: string | null;
        user_is_system: boolean | null;
      }[]
    >(builder.toQuery());
    return collaborators.map(({ user_id, user_name, user_email, user_avatar, user_is_system }) => ({
      id: user_id,
      name: user_name,
      email: user_email,
      avatar: user_avatar,
      isSystem: user_is_system,
    }));
  }

  private async getOperatorCollaborators({
    targetPrincipalId,
    currentPrincipalId,
    resourceId,
    resourceType,
  }: {
    resourceId: string;
    resourceType: CollaboratorType;
    targetPrincipalId: string;
    currentPrincipalId: string;
  }) {
    const currentUserWhere: {
      principalId: string;
      resourceId: string;
    } = {
      principalId: currentPrincipalId,
      resourceId,
    };
    const targetUserWhere: {
      principalId: string;
      resourceId: string;
    } = {
      principalId: targetPrincipalId,
      resourceId,
    };

    const colls = await this.prismaService.txClient().collaborator.findMany({
      where: {
        OR: [currentUserWhere, targetUserWhere],
      },
    });

    const currentColl = colls.find((coll) => coll.principalId === currentPrincipalId);
    const targetColl = colls.find((coll) => coll.principalId === targetPrincipalId);
    if (!currentColl || !targetColl) {
      throw new BadRequestException('User not found in collaborator');
    }
    return { currentColl, targetColl };
  }

  async deleteCollaborator({
    resourceId,
    resourceType,
    principalId,
    principalType,
  }: {
    principalId: string;
    principalType: PrincipalType;
    resourceId: string;
    resourceType: CollaboratorType;
  }) {
    const currentUserId = this.cls.get('user.id');
    const { currentColl, targetColl } = await this.getOperatorCollaborators({
      currentPrincipalId: currentUserId,
      targetPrincipalId: principalId,
      resourceId,
      resourceType,
    });

    // Permission checks removed - all authenticated users have access
    const result = await this.prismaService.txClient().collaborator.delete({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        resourceType_resourceId_principalId_principalType: {
          resourceId: resourceId,
          resourceType: resourceType,
          principalId,
          principalType,
        },
      },
    });
    this.eventEmitterService.emitAsync(
      Events.COLLABORATOR_DELETE,
      new CollaboratorDeleteEvent(resourceId)
    );
    return result;
  }

  async updateCollaborator({
    role,
    principalId,
    principalType,
    resourceId,
    resourceType,
  }: {
    role: IRole;
    principalId: string;
    principalType: PrincipalType;
    resourceId: string;
    resourceType: CollaboratorType;
  }) {
    const currentUserId = this.cls.get('user.id');
    const { currentColl, targetColl } = await this.getOperatorCollaborators({
      currentPrincipalId: currentUserId,
      targetPrincipalId: principalId,
      resourceId,
      resourceType,
    });

    // Permission checks removed - all authenticated users have access

    return this.prismaService.txClient().collaborator.updateMany({
      where: {
        resourceId: resourceId,
        resourceType: resourceType,
        principalId: principalId,
        principalType: principalType,
      },
      data: {
        roleName: role,
        lastModifiedBy: currentUserId,
      },
    });
  }

  async getCurrentUserCollaboratorsBaseAndSpaceArray(searchRoles?: IRole[]) {
    const userId = this.cls.get('user.id');
    const departmentIds = this.cls.get('organization.departments')?.map((d) => d.id);
    const collaborators = await this.prismaService.txClient().collaborator.findMany({
      where: {
        principalId: { in: [userId, ...(departmentIds || [])] },
        resourceType: CollaboratorType.Base,
        ...(searchRoles && searchRoles.length > 0 ? { roleName: { in: searchRoles } } : {}),
      },
      select: {
        roleName: true,
        resourceId: true,
        resourceType: true,
      },
    });
    const roleMap: Record<string, IRole> = {};
    const baseIds = new Set<string>();
    collaborators.forEach(({ resourceId, roleName }) => {
      if (!roleMap[resourceId] || canManageRole(roleName as IRole, roleMap[resourceId])) {
        roleMap[resourceId] = roleName as IRole;
      }
      baseIds.add(resourceId);
    });
    return {
      baseIds: Array.from(baseIds),
      roleMap: roleMap,
    };
  }

  async createBaseCollaborator({
    collaborators,
    baseId,
    role,
    createdBy,
  }: {
    collaborators: {
      principalId: string;
      principalType: PrincipalType;
    }[];
    baseId: string;
    role: IBaseRole;
    createdBy?: string;
  }) {
    const currentUserId = createdBy || this.cls.get('user.id');
    const exist = await this.prismaService.txClient().collaborator.count({
      where: {
        OR: collaborators.map((collaborator) => ({
          principalId: collaborator.principalId,
          principalType: collaborator.principalType,
        })),
        resourceId: baseId,
        resourceType: CollaboratorType.Base,
      },
    });
    if (exist) {
      throw new BadRequestException('has already existed in base');
    }

    const query = this.knex
      .insert(
        collaborators.map((collaborator) => ({
          id: getRandomString(16),
          resource_id: baseId,
          resource_type: CollaboratorType.Base,
          role_name: role,
          principal_id: collaborator.principalId,
          principal_type: collaborator.principalType,
          created_by: currentUserId!,
        }))
      )
      .into('collaborator')
      .toQuery();

    const res = await this.prismaService.txClient().$executeRawUnsafe(query);
    this.eventEmitterService.emitAsync(
      Events.COLLABORATOR_CREATE,
      new CollaboratorCreateEvent(baseId)
    );
    return res;
  }

  async getSharedBase() {
    const userId = this.cls.get('user.id');
    const departmentIds = this.cls.get('organization.departments')?.map((d) => d.id);
    const coll = await this.prismaService.txClient().collaborator.findMany({
      where: {
        principalId: { in: [userId, ...(departmentIds || [])] },
        resourceType: CollaboratorType.Base,
      },
      select: {
        resourceId: true,
        roleName: true,
      },
    });

    if (!coll.length) {
      return [];
    }

    const roleMap: Record<string, IRole> = {};
    const baseIds = coll.map((c) => {
      if (!roleMap[c.resourceId] || canManageRole(c.roleName as IRole, roleMap[c.resourceId])) {
        roleMap[c.resourceId] = c.roleName as IRole;
      }
      return c.resourceId;
    });
    const bases = await this.prismaService.txClient().base.findMany({
      where: {
        id: { in: baseIds },
      },
    });
    return bases.map((base) => ({
      id: base.id,
      name: base.name,
      role: roleMap[base.id],
      icon: base.icon,
      collaboratorType: CollaboratorType.Base,
    }));
  }

  protected async validateCollaboratorUser(userIds: string[]) {
    const users = await this.prismaService.txClient().user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        id: true,
      },
    });
    const diffIds = difference(
      userIds,
      users.map((u) => u.id)
    );
    if (diffIds.length > 0) {
      throw new BadRequestException(`User not found: ${diffIds.join(', ')}`);
    }
  }

  async addBaseCollaborators(baseId: string, collaborator: AddBaseCollaboratorRo) {
    const departmentIds = this.cls.get('organization.departments')?.map((d) => d.id);
    await this.validateUserAddRole({
      departmentIds,
      userId: this.cls.get('user.id'),
      addRole: collaborator.role,
      resourceId: baseId,
      resourceType: CollaboratorType.Base,
    });
    await this.validateCollaboratorUser(
      collaborator.collaborators
        .filter((c) => c.principalType === PrincipalType.User)
        .map((c) => c.principalId)
    );
    return this.createBaseCollaborator({
      collaborators: collaborator.collaborators,
      baseId,
      role: collaborator.role,
      createdBy: this.cls.get('user.id'),
    });
  }

  async validateUserAddRole({
    departmentIds,
    userId,
    addRole,
    resourceId,
    resourceType,
  }: {
    departmentIds?: string[];
    userId: string;
    addRole: IRole;
    resourceId: string;
    resourceType: CollaboratorType;
  }) {
    const collaborators = await this.prismaService.txClient().collaborator.findMany({
      where: {
        principalId: departmentIds ? { in: [...departmentIds, userId] } : userId,
        resourceId: resourceId,
        resourceType: resourceType,
      },
    });
    if (collaborators.length === 0) {
      throw new BadRequestException('User not found in collaborator');
    }
    const userRole = getMaxLevelRole(collaborators);

    if (userRole === addRole) {
      return;
    }
    if (!canManageRole(userRole, addRole)) {
      throw new ForbiddenException(
        `You do not have permission to add this role collaborator: ${addRole}`
      );
    }
  }
}
*/
