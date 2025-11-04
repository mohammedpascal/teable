import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { axios } from '../axios';
import { registerRoute, urlBuilder } from '../utils';
import { z } from '../zod';
import { pluginInstallStorageSchema } from './types';

export const GET_DASHBOARD_INSTALL_PLUGIN =
  '/dashboard/{dashboardId}/plugin/{installPluginId}';

export const getDashboardInstallPluginVoSchema = z.object({
  pluginId: z.string(),
  pluginInstallId: z.string(),
  name: z.string(),
  storage: pluginInstallStorageSchema.optional(),
});

export type IGetDashboardInstallPluginVo = z.infer<typeof getDashboardInstallPluginVoSchema>;

export const GetDashboardInstallPluginRoute: RouteConfig = registerRoute({
  method: 'get',
  path: GET_DASHBOARD_INSTALL_PLUGIN,
  description: 'Get a dashboard install plugin by id',
  request: {
    params: z.object({
      dashboardId: z.string(),
      installPluginId: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'Returns data about the dashboard install plugin.',
      content: {
        'application/json': {
          schema: getDashboardInstallPluginVoSchema,
        },
      },
    },
  },
  tags: ['dashboard'],
});

export const getDashboardInstallPlugin = async (
  dashboardId: string,
  installPluginId: string
) => {
  return axios.get<IGetDashboardInstallPluginVo>(
    urlBuilder(GET_DASHBOARD_INSTALL_PLUGIN, { dashboardId, installPluginId })
  );
};
