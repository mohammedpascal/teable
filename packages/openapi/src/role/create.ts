import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { axios } from '../axios';
import { registerRoute } from '../utils';
import { z } from '../zod';
import { roleListVoSchema } from './list';

export const CREATE_ROLE = '/role';

const permissionEnum = z.enum(['View', 'Create', 'Update', 'Delete', 'Configure']);

export const createRoleRoSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  permissions: z.record(z.string(), z.array(permissionEnum)),
});

export type ICreateRoleRo = z.infer<typeof createRoleRoSchema>;
export type ICreateRoleVo = z.infer<typeof roleListVoSchema>;

export const createRoleRoute: RouteConfig = registerRoute({
  method: 'post',
  path: CREATE_ROLE,
  description: 'Create a new role (admin only)',
  request: {
    body: {
      content: {
        'application/json': {
          schema: createRoleRoSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successfully created role',
      content: {
        'application/json': {
          schema: roleListVoSchema,
        },
      },
    },
  },
  tags: ['role'],
});

export const createRole = async (createRoleRo: ICreateRoleRo) => {
  return axios.post<ICreateRoleVo>(CREATE_ROLE, createRoleRo);
};

