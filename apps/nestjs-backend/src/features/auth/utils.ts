import { UploadType, type IUserMeVo } from '@teable/openapi';
import { pick } from 'lodash';
import type { Prisma } from '../../prisma';
import StorageAdapter from '../attachments/plugins/adapter';
import { getFullStorageUrl } from '../attachments/plugins/utils';
import { parsePermissionsString } from '../role/role-permission.util';

export const pickUserMe = (
  user: Pick<
    Prisma.UserGetPayload<{ include: { role: true } }>,
    | 'id'
    | 'name'
    | 'avatar'
    | 'phone'
    | 'email'
    | 'password'
    | 'notifyMeta'
    | 'isAdmin'
    | 'roleId'
    | 'role'
  >
): IUserMeVo => {
  const result: IUserMeVo = {
    ...pick(user, 'id', 'name', 'phone', 'email', 'isAdmin'),
    notifyMeta: typeof user.notifyMeta === 'object' ? user.notifyMeta : JSON.parse(user.notifyMeta),
    avatar:
      user.avatar && !user.avatar?.startsWith('http')
        ? getFullStorageUrl(StorageAdapter.getBucket(UploadType.Avatar), user.avatar)
        : user.avatar,
    hasPassword: user.password !== null,
  };

  // Include role information if available
  if (user.roleId) {
    result.roleId = user.roleId;
  }

  if (user.role) {
    // Parse permissions from role
    const permissions = parsePermissionsString(user.role.permissions);
    result.role = {
      id: user.role.id,
      name: user.role.name,
      permissions,
    };
  }

  return result;
};
