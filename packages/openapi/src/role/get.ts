import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { axios } from '../axios';
import { registerRoute, urlBuilder } from '../utils';
import { z } from '../zod';
import { roleListVoSchema } from './list';

export const GET_ROLE = '/role/{id}';

export type IGetRoleVo = z.infer<typeof roleListVoSchema>;

export const getRoleRoute: RouteConfig = registerRoute({
  method: 'get',
  path: GET_ROLE,
  description: 'Get role by ID (admin only)',
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'Successfully retrieved role',
      content: {
        'application/json': {
          schema: roleListVoSchema,
        },
      },
    },
  },
  tags: ['role'],
});

export const getRole = async (id: string) => {
  return axios.get<IGetRoleVo>(urlBuilder(GET_ROLE, { id }));
};

