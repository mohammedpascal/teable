import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { axios } from '../axios';
import { registerRoute, urlBuilder } from '../utils';
import { z } from '../zod';
import { roleListVoSchema } from './list';

export const UPDATE_ROLE = '/role/{id}';

const actionPermissionEnum = z.enum([
  'table|manage',
  'table|import',
  'table|export',

  'record|read',
  'record|create',
  'record|delete',
  'record|update',

  'view|read',
  'view|create',
  'view|delete',
  'view|update',
]);

export const updateRoleRoSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  permissions: z.array(actionPermissionEnum).optional(),
});

export type IUpdateRoleRo = z.infer<typeof updateRoleRoSchema>;
export type IUpdateRoleVo = z.infer<typeof roleListVoSchema>;

export const updateRoleRoute: RouteConfig = registerRoute({
  method: 'patch',
  path: UPDATE_ROLE,
  description: 'Update role (admin only)',
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: {
      content: {
        'application/json': {
          schema: updateRoleRoSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successfully updated role',
      content: {
        'application/json': {
          schema: roleListVoSchema,
        },
      },
    },
  },
  tags: ['role'],
});

export const updateRole = async (id: string, updateRoleRo: IUpdateRoleRo) => {
  return axios.patch<IUpdateRoleVo>(urlBuilder(UPDATE_ROLE, { id }), updateRoleRo);
};
