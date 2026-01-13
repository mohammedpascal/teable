import { PrismaClient } from '@prisma/client';
import type { IRoleListVo } from '@teable/openapi';

const prisma = new PrismaClient();

export async function getRolesServerData(): Promise<IRoleListVo[]> {
  try {
    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        permissions: true,
        createdTime: true,
        lastModifiedTime: true,
        createdBy: true,
        lastModifiedBy: true,
      },
      orderBy: {
        createdTime: 'desc',
      },
    });

    return roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      createdTime: role.createdTime.toISOString(),
      lastModifiedTime: role.lastModifiedTime?.toISOString() ?? null,
      createdBy: role.createdBy,
      lastModifiedBy: role.lastModifiedBy,
    }));
  } catch (error) {
    console.error('Failed to fetch roles data:', error);
    throw error;
  }
}
