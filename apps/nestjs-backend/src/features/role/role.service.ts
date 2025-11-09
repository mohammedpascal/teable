import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { generateUserId } from '@teable/core';
import type { Prisma } from '../../prisma';
import { PrismaService } from '../../prisma';
import { ClsService } from 'nestjs-cls';
import type { IClsStore } from '../../types/cls';
import { validatePermissions } from './role-permission.util';

export interface ICreateRoleDto {
  name: string;
  description?: string;
  permissions: string | Record<string, string[]>; // Accept JSON object or string
}

export interface IUpdateRoleDto {
  name?: string;
  description?: string;
  permissions?: string | Record<string, string[]>; // Accept JSON object or string
}

@Injectable()
export class RoleService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cls: ClsService<IClsStore>
  ) {}

  async createRole(data: ICreateRoleDto) {
    const userId = this.cls.get('user.id');

    // Convert permissions to string if it's an object
    let permissionsString: string;
    if (typeof data.permissions === 'string') {
      permissionsString = data.permissions;
    } else {
      permissionsString = JSON.stringify(data.permissions);
    }

    // Validate permissions format
    if (!validatePermissions(permissionsString)) {
      throw new BadRequestException(
        'Invalid permissions format. Permissions must be either a JSON object mapping table IDs to permission arrays, or comma-separated values: View, Create, Update, Delete, Configure'
      );
    }

    // Check if role name already exists
    const existingRole = await this.prismaService.txClient().role.findUnique({
      where: { name: data.name },
    });

    if (existingRole) {
      throw new BadRequestException(`Role with name "${data.name}" already exists`);
    }

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

    // Parse permissions JSON string to object for response
    let permissions: Record<string, string[]>;
    try {
      permissions = JSON.parse(role.permissions);
    } catch {
      // Legacy format: treat as applying to all tables
      const perms = role.permissions.split(',').map((p) => p.trim()).filter(Boolean);
      permissions = { '*': perms };
    }

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

    // Parse permissions JSON string to object
    let permissions: Record<string, string[]>;
    try {
      permissions = JSON.parse(role.permissions);
    } catch {
      // Legacy format: treat as applying to all tables
      const perms = role.permissions.split(',').map((p) => p.trim()).filter(Boolean);
      permissions = { '*': perms };
    }

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

    // Parse permissions JSON string to object for each role
    return roles.map((role) => {
      let permissions: Record<string, string[]>;
      try {
        permissions = JSON.parse(role.permissions);
      } catch {
        // Legacy format: treat as applying to all tables
        const perms = role.permissions.split(',').map((p) => p.trim()).filter(Boolean);
        permissions = { '*': perms };
      }

      return {
        ...role,
        permissions,
      };
    });
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

    // Convert permissions to string if it's an object
    let permissionsString: string | undefined;
    if (data.permissions !== undefined) {
      if (typeof data.permissions === 'string') {
        permissionsString = data.permissions;
      } else {
        permissionsString = JSON.stringify(data.permissions);
      }

      // Validate permissions format if provided
      if (permissionsString && !validatePermissions(permissionsString)) {
        throw new BadRequestException(
          'Invalid permissions format. Permissions must be either a JSON object mapping table IDs to permission arrays, or comma-separated values: View, Create, Update, Delete, Configure'
        );
      }
    }

    // Check if new name conflicts with existing role
    if (data.name && data.name !== existingRole.name) {
      const nameConflict = await this.prismaService.txClient().role.findUnique({
        where: { name: data.name },
      });

      if (nameConflict) {
        throw new BadRequestException(`Role with name "${data.name}" already exists`);
      }
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

    // Parse permissions JSON string to object for response
    let permissions: Record<string, string[]>;
    try {
      permissions = JSON.parse(role.permissions);
    } catch {
      // Legacy format: treat as applying to all tables
      const perms = role.permissions.split(',').map((p) => p.trim()).filter(Boolean);
      permissions = { '*': perms };
    }

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

