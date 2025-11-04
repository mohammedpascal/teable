import type { BaseAction, TableAction } from '@teable/core';
import { axios } from '../axios';
import { registerRoute, urlBuilder } from '../utils';
import { z } from '../zod';

export const GET_BASE_PERMISSION = '/base/bse0/permission';

export const GetBasePermissionVoSchema = z.record(
  z.custom<TableAction | BaseAction>(),
  z.boolean()
);

export type IGetBasePermissionVo = z.infer<typeof GetBasePermissionVoSchema>;

export const GetBasePermissionRoute = registerRoute({
  method: 'get',
  path: GET_BASE_PERMISSION,
  description: 'Get a base permission',
  request: {},
  responses: {
    200: {
      description: 'Returns data about a base permission.',
      content: {
        'application/json': {
          schema: GetBasePermissionVoSchema,
        },
      },
    },
  },
  tags: ['base'],
});

export const getBasePermission = async () => {
  return axios.get<IGetBasePermissionVo>(urlBuilder(GET_BASE_PERMISSION));
};
