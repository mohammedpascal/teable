import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { generateUserId } from '@teable/core';
import { ClsService } from 'nestjs-cls';
import type { Prisma } from '../../prisma';
import { PrismaService } from '../../prisma';
import type { IClsStore } from '../../types/cls';
import { validatePermissions } from './role-permission.util';

export interface ICreateRoleDto {
  name: string;
  description?: string;
  permissions: string | string[]; // Accept JSON array string or array of action strings
}

export interface IUpdateRoleDto {
  name?: string;
  description?: string;
  permissions?: string | string[]; // Accept JSON array string or array of action strings
}

@Injectable()
export class RoleService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cls: ClsService<IClsStore>
  ) {}

  private convertPermissionsToString(permissions: string | string[]): string {
    if (typeof permissions === 'string') {
      return permissions;
    }
    if (Array.isArray(permissions)) {
      return JSON.stringify(permissions);
    }
    throw new BadRequestException(
      'Invalid permissions format. Permissions must be an array of action strings or JSON array string.'
    );
  }

  private parsePermissionsFromString(permissionsString: string): string[] {
    try {
      const parsed = JSON.parse(permissionsString);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      // Legacy format: convert to array
      return permissionsString
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
    } catch {
      // Legacy format: comma-separated
      return permissionsString
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
    }
  }

  private async checkNameConflict(name: string, excludeId?: string): Promise<void> {
    const nameConflict = await this.prismaService.txClient().role.findUnique({
      where: { name },
    });

    if (nameConflict && nameConflict.id !== excludeId) {
      throw new BadRequestException(`Role with name "${name}" already exists`);
    }
  }

  async createRole(data: ICreateRoleDto) {
    const userId = this.cls.get('user.id');

    // Convert permissions to JSON array string
    const permissionsString = this.convertPermissionsToString(data.permissions);

    // Validate permissions format
    if (!validatePermissions(permissionsString)) {
      throw new BadRequestException(
        'Invalid permissions format. Permissions must be a JSON array of action strings: ["record|create", "table|manage", ...]'
      );
    }

    // Check if role name already exists
    await this.checkNameConflict(data.name);

    const role = await this.prismaService.txClient().role.create({
      data: {
        id: generateUserId(),
        name: data.name,
        description: data.description,
        permissions: permissionsString,
        createdBy: userId,
      },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    const permissions = this.parsePermissionsFromString(role.permissions);

    return {
      ...role,
      permissions,
    };
  }

  async getRole(id: string) {
    const role = await this.prismaService.txClient().role.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException(`Role with id "${id}" not found`);
    }

    const permissions = this.parsePermissionsFromString(role.permissions);

    return {
      ...role,
      permissions,
    };
  }

  async getAllRoles() {
    const roles = await this.prismaService.txClient().role.findMany({
      orderBy: {
        createdTime: 'desc',
      },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    // Parse permissions JSON string to array for each role
    return roles.map((role) => ({
      ...role,
      permissions: this.parsePermissionsFromString(role.permissions),
    }));
  }

  async updateRole(id: string, data: IUpdateRoleDto) {
    const userId = this.cls.get('user.id');

    // Check if role exists
    const existingRole = await this.prismaService.txClient().role.findUnique({
      where: { id },
    });

    if (!existingRole) {
      throw new NotFoundException(`Role with id "${id}" not found`);
    }

    // Convert and validate permissions if provided
    let permissionsString: string | undefined;
    if (data.permissions !== undefined) {
      permissionsString = this.convertPermissionsToString(data.permissions);
      if (!validatePermissions(permissionsString)) {
        throw new BadRequestException(
          'Invalid permissions format. Permissions must be a JSON array of action strings: ["record|create", "table|manage", ...]'
        );
      }
    }

    // Check if new name conflicts with existing role
    if (data.name && data.name !== existingRole.name) {
      await this.checkNameConflict(data.name, id);
    }

    const updateData: Prisma.RoleUpdateInput = {
      lastModifiedBy: userId,
      lastModifiedTime: new Date(),
    };

    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    if (data.description !== undefined) {
      updateData.description = data.description;
    }
    if (permissionsString !== undefined) {
      updateData.permissions = permissionsString;
    }

    const role = await this.prismaService.txClient().role.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    const permissions = this.parsePermissionsFromString(role.permissions);

    return {
      ...role,
      permissions,
    };
  }

  async deleteRole(id: string) {
    // Check if role exists
    const existingRole = await this.prismaService.txClient().role.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    if (!existingRole) {
      throw new NotFoundException(`Role with id "${id}" not found`);
    }

    // Check if role is assigned to any users
    if (existingRole._count.users > 0) {
      throw new BadRequestException(
        `Cannot delete role "${existingRole.name}" because it is assigned to ${existingRole._count.users} user(s)`
      );
    }

    return await this.prismaService.txClient().role.delete({
      where: { id },
    });
  }
}
