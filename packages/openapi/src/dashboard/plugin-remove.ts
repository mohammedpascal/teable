import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { axios } from '../axios';
import { registerRoute, urlBuilder } from '../utils';
import { z } from '../zod';

export const DASHBOARD_REMOVE_PLUGIN =
  '/dashboard/{dashboardId}/plugin/{pluginInstallId}';

export const DashboardRemovePluginRoute: RouteConfig = registerRoute({
  method: 'delete',
  path: DASHBOARD_REMOVE_PLUGIN,
  description: 'Remove a plugin from a dashboard',
  request: {
    params: z.object({
      dashboardId: z.string(),
      pluginInstallId: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'Plugin removed successfully.',
    },
  },
  tags: ['dashboard'],
});

export const removePlugin = async (
  dashboardId: string,
  pluginInstallId: string
) => {
  return axios.delete(
    urlBuilder(DASHBOARD_REMOVE_PLUGIN, { dashboardId, pluginInstallId })
  );
};
