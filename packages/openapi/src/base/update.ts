import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { axios } from '../axios';
import { registerRoute, urlBuilder } from '../utils';
import { z } from '../zod';

export const UPDATE_BASE = '/base/{baseId}';

export const updateBaseRoSchema = z.object({
  name: z.string().optional(),
});

export type IUpdateBaseRo = z.infer<typeof updateBaseRoSchema>;

export const updateBaseVoSchema = z.object({
  name: z.string(),
});

export type IUpdateBaseVo = z.infer<typeof updateBaseVoSchema>;

export const UpdateBaseRoute: RouteConfig = registerRoute({
  method: 'patch',
  path: UPDATE_BASE,
  description: 'Update a base info',
  request: {
    params: z.object({
      baseId: z.string(),
    }),
    body: {
      content: {
        'application/json': {
          schema: updateBaseRoSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Returns information about a successfully updated base.',
      content: {
        'application/json': {
          schema: updateBaseVoSchema,
        },
      },
    },
  },
  tags: ['base'],
});

export const updateBase = async (params: { baseId: string; updateBaseRo: IUpdateBaseRo }) => {
  const { baseId, updateBaseRo } = params;
  return axios.patch<IUpdateBaseVo>(
    urlBuilder(UPDATE_BASE, {
      baseId,
    }),
    updateBaseRo
  );
};
