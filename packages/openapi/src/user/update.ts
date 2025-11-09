import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { axios } from '../axios';
import { registerRoute, urlBuilder } from '../utils';
import { z } from '../zod';
import { userListVoSchema } from './list';

export const UPDATE_USER = '/user/{id}';

export const updateUserRoSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  isAdmin: z.boolean().optional(),
});

export type IUpdateUserRo = z.infer<typeof updateUserRoSchema>;
export type IUpdateUserVo = z.infer<typeof userListVoSchema>;

export const updateUserRoute: RouteConfig = registerRoute({
  method: 'patch',
  path: UPDATE_USER,
  description: 'Update user (admin only)',
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: {
      content: {
        'application/json': {
          schema: updateUserRoSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successfully updated user',
      content: {
        'application/json': {
          schema: userListVoSchema,
        },
      },
    },
  },
  tags: ['user'],
});

export const updateUser = async (id: string, updateUserRo: IUpdateUserRo) => {
  return axios.patch<IUpdateUserVo>(urlBuilder(UPDATE_USER, { id }), updateUserRo);
};

