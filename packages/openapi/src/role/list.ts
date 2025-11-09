import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { axios } from '../axios';
import { registerRoute } from '../utils';
import { z } from '../zod';

export const GET_ROLE_LIST = '/role';

const permissionEnum = z.enum(['View', 'Create', 'Update', 'Delete', 'Configure']);

export const roleListVoSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  permissions: z.record(z.string(), z.array(permissionEnum)), // Parsed JSON object
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

