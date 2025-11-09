import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { axios } from '../axios';
import { registerRoute } from '../utils';
import { z } from '../zod';

export const GET_USER_LIST = '/user/list';

export const userListVoSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().nullable().optional(),
  isAdmin: z.boolean().nullable().optional(),
  roleId: z.string().nullable().optional(),
  role: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable()
    .optional(),
  createdTime: z.string().datetime(),
  lastSignTime: z.string().datetime().nullable().optional(),
  deactivatedTime: z.string().datetime().nullable().optional(),
});

export const userListResponseSchema = z.object({
  users: z.array(userListVoSchema),
  total: z.number(),
});

export type IUserListVo = z.infer<typeof userListVoSchema>;
export type IUserListResponseVo = z.infer<typeof userListResponseSchema>;

export const getUserListRoute: RouteConfig = registerRoute({
  method: 'get',
  path: GET_USER_LIST,
  description: 'Get list of users (admin only)',
  request: {
    query: z.object({
      skip: z.string().or(z.number()).transform(Number).optional(),
      take: z.string().or(z.number()).transform(Number).optional(),
    }),
  },
  responses: {
    200: {
      description: 'Successfully retrieved user list',
      content: {
        'application/json': {
          schema: userListResponseSchema,
        },
      },
    },
  },
  tags: ['user'],
});

export const getUserList = async (query?: { skip?: number; take?: number }) => {
  return axios.get<IUserListResponseVo>(GET_USER_LIST, { params: query });
};
