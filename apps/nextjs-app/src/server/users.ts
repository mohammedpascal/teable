import { PrismaClient } from '@prisma/client';
import type { IUserListResponseVo } from '@teable/openapi';
import { getFullAvatarUrl } from './utils/avatar-url';

const prisma = new PrismaClient();

export async function getUsersServerData(
  skip = 0,
  take = 100
): Promise<IUserListResponseVo> {
  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          isSystem: null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          isAdmin: true,
          createdTime: true,
          lastSignTime: true,
          deactivatedTime: true,
          roleId: true,
          role: {
            select: {
              id: true,
              name: true,
              description: true,
              permissions: true,
            },
          },
        },
        skip,
        take,
        orderBy: {
          createdTime: 'desc',
        },
      }),
      prisma.user.count({
        where: {
          isSystem: null,
        },
      }),
    ]);

    return {
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: getFullAvatarUrl(user.avatar),
        isAdmin: user.isAdmin,
        roleId: user.roleId,
        role: user.role
          ? {
              id: user.role.id,
              name: user.role.name,
            }
          : null,
        createdTime: user.createdTime.toISOString(),
        lastSignTime: user.lastSignTime?.toISOString() ?? null,
        deactivatedTime: user.deactivatedTime?.toISOString() ?? null,
      })),
      total,
    };
  } catch (error) {
    console.error('Failed to fetch users data:', error);
    throw error;
  }
}

