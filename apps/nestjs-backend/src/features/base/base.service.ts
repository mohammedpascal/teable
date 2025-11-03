import { Injectable } from '@nestjs/common';
import { ActionPrefix, actionPrefixMap } from '@teable/core';
import type { IGetBasePermissionVo } from '@teable/openapi';

@Injectable()
export class BaseService {
  async getPermission() {
    // Return all permissions as true for authenticated users
    return [...actionPrefixMap[ActionPrefix.Table], ...actionPrefixMap[ActionPrefix.Base]].reduce(
      (acc, action) => {
        acc[action] = true;
        return acc;
      },
      {} as IGetBasePermissionVo
    );
  }
}
