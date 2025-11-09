import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { axios } from '../axios';
import { registerRoute, urlBuilder } from '../utils';
import { z } from '../zod';

export const DELETE_USER = '/user/{id}';

export const deleteUserRoute: RouteConfig = registerRoute({
  method: 'delete',
  path: DELETE_USER,
  description: 'Delete user (admin only)',
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'Successfully deleted user',
    },
  },
  tags: ['user'],
});

export const deleteUser = async (id: string) => {
  return axios.delete<void>(urlBuilder(DELETE_USER, { id }));
};

