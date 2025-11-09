import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { axios } from '../axios';
import { registerRoute, urlBuilder } from '../utils';
import { z } from '../zod';

export const DELETE_ROLE = '/role/{id}';

export const deleteRoleRoute: RouteConfig = registerRoute({
  method: 'delete',
  path: DELETE_ROLE,
  description: 'Delete role (admin only)',
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'Successfully deleted role',
    },
  },
  tags: ['role'],
});

export const deleteRole = async (id: string) => {
  return axios.delete<void>(urlBuilder(DELETE_ROLE, { id }));
};

