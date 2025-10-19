import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { axios } from '../axios';
import { registerRoute, urlBuilder } from '../utils';
import { z } from '../zod';

export const CREATE_WIDGET = '/base/{baseId}/dashboard/{dashboardId}/widget';
export const UPDATE_WIDGET = '/base/{baseId}/dashboard/{dashboardId}/widget/{widgetId}';
export const DELETE_WIDGET = '/base/{baseId}/dashboard/{dashboardId}/widget/{widgetId}';

export const createWidgetRoSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  config: z.string().optional(),
  position: z.string().optional(),
});

export const updateWidgetRoSchema = z.object({
  name: z.string().optional(),
  config: z.string().optional(),
  position: z.string().optional(),
});

export const widgetVoSchema = z.object({
  id: z.string(),
  dashboardId: z.string(),
  name: z.string(),
  type: z.string(),
  config: z.string().nullable(),
  position: z.string().nullable(),
  createdTime: z.string(),
  createdBy: z.string(),
  lastModifiedTime: z.string().nullable(),
  lastModifiedBy: z.string().nullable(),
});

export type CreateWidgetRo = z.infer<typeof createWidgetRoSchema>;
export type UpdateWidgetRo = z.infer<typeof updateWidgetRoSchema>;
export type WidgetVo = z.infer<typeof widgetVoSchema>;

export const CreateWidgetRoute: RouteConfig = registerRoute({
  method: 'post',
  path: CREATE_WIDGET,
  description: 'Create a new widget in a dashboard',
  request: {
    params: z.object({
      baseId: z.string(),
      dashboardId: z.string(),
    }),
    body: {
      content: {
        'application/json': {
          schema: createWidgetRoSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Returns data about the created widget.',
      content: {
        'application/json': {
          schema: widgetVoSchema,
        },
      },
    },
  },
  tags: ['dashboard'],
});

export const UpdateWidgetRoute: RouteConfig = registerRoute({
  method: 'patch',
  path: UPDATE_WIDGET,
  description: 'Update a widget in a dashboard',
  request: {
    params: z.object({
      baseId: z.string(),
      dashboardId: z.string(),
      widgetId: z.string(),
    }),
    body: {
      content: {
        'application/json': {
          schema: updateWidgetRoSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Returns data about the updated widget.',
      content: {
        'application/json': {
          schema: widgetVoSchema,
        },
      },
    },
  },
  tags: ['dashboard'],
});

export const DeleteWidgetRoute: RouteConfig = registerRoute({
  method: 'delete',
  path: DELETE_WIDGET,
  description: 'Delete a widget from a dashboard',
  request: {
    params: z.object({
      baseId: z.string(),
      dashboardId: z.string(),
      widgetId: z.string(),
    }),
  },
  responses: {
    204: {
      description: 'Widget deleted successfully.',
    },
  },
  tags: ['dashboard'],
});

export const createWidget = async (
  baseId: string,
  dashboardId: string,
  widgetData: CreateWidgetRo
) => {
  return axios.post<WidgetVo>(urlBuilder(CREATE_WIDGET, { baseId, dashboardId }), widgetData);
};

export const updateWidget = async (
  baseId: string,
  dashboardId: string,
  widgetId: string,
  widgetData: UpdateWidgetRo
) => {
  return axios.patch<WidgetVo>(
    urlBuilder(UPDATE_WIDGET, { baseId, dashboardId, widgetId }),
    widgetData
  );
};

export const deleteWidget = async (baseId: string, dashboardId: string, widgetId: string) => {
  return axios.delete(urlBuilder(DELETE_WIDGET, { baseId, dashboardId, widgetId }));
};
