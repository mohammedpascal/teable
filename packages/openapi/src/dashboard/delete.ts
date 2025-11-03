import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { axios } from '../axios';
import { registerRoute, urlBuilder } from '../utils';
import { z } from '../zod';

export const DELETE_DASHBOARD = '/dashboard/{id}';

export const DeleteDashboardRoute: RouteConfig = registerRoute({
  method: 'delete',
  path: DELETE_DASHBOARD,
  description: 'Delete a dashboard by id',
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'Dashboard deleted',
    },
  },
  tags: ['dashboard'],
});

export const deleteDashboard = async (id: string) => {
  return axios.delete(urlBuilder(DELETE_DASHBOARD, { id }));
};
