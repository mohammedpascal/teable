import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { axios } from '../axios';
import { registerRoute, urlBuilder } from '../utils';
import { z } from '../zod';

export const CREATE_DASHBOARD = '/dashboard';

export const createDashboardRoSchema = z.object({
  name: z.string(),
});

export type ICreateDashboardRo = z.infer<typeof createDashboardRoSchema>;

export const createDashboardVoSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type ICreateDashboardVo = z.infer<typeof createDashboardVoSchema>;

export const CreateDashboardRoute: RouteConfig = registerRoute({
  method: 'post',
  path: CREATE_DASHBOARD,
  description: 'Create a new dashboard',
  request: {
    body: {
      content: {
        'application/json': {
          schema: createDashboardRoSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Returns data about the created dashboard.',
      content: {
        'application/json': {
          schema: createDashboardVoSchema,
        },
      },
    },
  },
  tags: ['dashboard'],
});

export const createDashboard = async (body: z.infer<typeof createDashboardRoSchema>) => {
  return axios.post<ICreateDashboardVo>(urlBuilder(CREATE_DASHBOARD, {}), body);
};
