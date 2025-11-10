import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { axios } from '../axios';
import { userNotifyMetaSchema } from '../user';
import { registerRoute } from '../utils';
import { z } from '../zod';

export const USER_ME = '/auth/user/me';

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
  'field|create',
  'field|delete',
  'field|read',
  'field|update',
]);

export const userMeVoSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().nullable().optional(),
  accessToken: z.string().nullable().optional(),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  notifyMeta: userNotifyMetaSchema,
  hasPassword: z.boolean(),
  isAdmin: z.boolean().nullable().optional(),
  roleId: z.string().nullable().optional(),
  role: z
    .object({
      id: z.string(),
      name: z.string(),
      permissions: z.array(actionPermissionEnum),
    })
    .nullable()
    .optional(),
});

export type IUserMeVo = z.infer<typeof userMeVoSchema>;

export const userMeRoute: RouteConfig = registerRoute({
  method: 'get',
  path: USER_ME,
  description: 'Get user information',
  responses: {
    200: {
      description: 'Successfully retrieved user information',
      content: {
        'application/json': {
          schema: userMeVoSchema,
        },
      },
    },
  },
  tags: ['auth'],
});

export const userMe = async () => {
  return axios.get<IUserMeVo>(USER_ME);
};
