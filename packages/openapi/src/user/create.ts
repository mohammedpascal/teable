import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { axios } from '../axios';
import { registerRoute } from '../utils';
import { z } from '../zod';
import { userListVoSchema } from './list';

export const CREATE_USER = '/user';

export const createUserRoSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8).optional(),
  isAdmin: z.boolean().optional(),
  roleId: z.string().nullable().optional(),
});

export type ICreateUserRo = z.infer<typeof createUserRoSchema>;
export type ICreateUserVo = z.infer<typeof userListVoSchema>;

export const createUserRoute: RouteConfig = registerRoute({
  method: 'post',
  path: CREATE_USER,
  description: 'Create a new user (admin only)',
  request: {
    body: {
      content: {
        'application/json': {
          schema: createUserRoSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successfully created user',
      content: {
        'application/json': {
          schema: userListVoSchema,
        },
      },
    },
  },
  tags: ['user'],
});

export const createUser = async (createUserRo: ICreateUserRo) => {
  return axios.post<ICreateUserVo>(CREATE_USER, createUserRo);
};

