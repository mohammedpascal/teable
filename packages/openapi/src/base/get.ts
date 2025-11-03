import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { registerRoute } from '../utils';
import { z } from '../zod';

export const GET_BASE = '/base/{baseId}';

export const getBaseItemSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const getBaseVoSchema = getBaseItemSchema;

export type IGetBaseVo = z.infer<typeof getBaseVoSchema>;

export const GetBaseRoute: RouteConfig = registerRoute({
  method: 'get',
  path: GET_BASE,
  description: 'Get a base by baseId',
  request: {
    params: z.object({
      baseId: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'Returns information about a base.',
      content: {
        'application/json': {
          schema: getBaseVoSchema,
        },
      },
    },
  },
  tags: ['base'],
});

export const getBaseById = async () => {
  return {
    id: 'bse0',
    name: 'Base',
  };
};
