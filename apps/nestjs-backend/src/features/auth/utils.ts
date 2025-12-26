import { UploadType, type IUserMeVo } from '@teable/openapi';
import pick from 'lodash/pick';
import StorageAdapter from '../attachments/plugins/adapter';
import { getFullStorageUrl } from '../attachments/plugins/utils';
import { parsePermissionsString } from '../role/role-permission.util';

// Accept user with or without role relation
// Use a more permissive type that accepts any user-like object with the required fields
type IUserWithOptionalRole = {
  id: string;
  name: string;
  phone?: string | null;
  email: string;
  isAdmin?: boolean | null;
  notifyMeta?: string | object | null;
  avatar?: string | null;
  password?: string | null;
  roleId?: string | null;
  role?: { id: string; name: string; permissions: string } | null;
  [key: string]: unknown; // Allow additional properties
};

export const pickUserMe = (user: IUserWithOptionalRole): IUserMeVo => {
  const result: IUserMeVo = {
    ...pick(user, 'id', 'name', 'phone', 'email', 'isAdmin'),
    notifyMeta:
      typeof user.notifyMeta === 'object' && user.notifyMeta !== null
        ? user.notifyMeta
        : user.notifyMeta
          ? JSON.parse(user.notifyMeta)
          : { email: true },
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
    const role = user.role as { id: string; name: string; permissions: string };
    if (role.permissions) {
      // Parse permissions from role
      const permissions = parsePermissionsString(role.permissions);
      result.role = {
        id: role.id,
        name: role.name,
        permissions: permissions as NonNullable<IUserMeVo['role']>['permissions'],
      };
    }
  }

  return result;
};
