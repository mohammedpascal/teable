import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { axios } from '../axios';
import { registerRoute } from '../utils';
import { z } from '../zod';

export const GET_ROLE_LIST = '/role';

const actionPermissionEnum = z.enum([
  'record|create',
  'record|delete',
  'record|read',
  'record|update',
  'view|create',
  'view|delete',
  'view|read',
  'view|update',
  'table|create',
  'table|delete',
  'table|read',
  'table|update',
  'table|import',
  'table|export',
]);

export const roleListVoSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  permissions: z.array(actionPermissionEnum).or(z.record(z.string(), z.array(z.string()))), // Array of action strings or legacy format
  createdTime: z.string().datetime(),
  lastModifiedTime: z.string().datetime().nullable().optional(),
  _count: z.object({
    users: z.number(),
  }),
});

export const roleListResponseSchema = z.array(roleListVoSchema);

export type IRoleListVo = z.infer<typeof roleListVoSchema>;
export type IRoleListResponseVo = z.infer<typeof roleListResponseSchema>;

export const getRoleListRoute: RouteConfig = registerRoute({
  method: 'get',
  path: GET_ROLE_LIST,
  description: 'Get list of roles (admin only)',
  request: {},
  responses: {
    200: {
      description: 'Successfully retrieved role list',
      content: {
        'application/json': {
          schema: roleListResponseSchema,
        },
      },
    },
  },
  tags: ['role'],
});

export const getRoleList = async () => {
  return axios.get<IRoleListResponseVo>(GET_ROLE_LIST);
};

