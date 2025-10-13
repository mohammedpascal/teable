import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { axios } from '../axios';
import { registerRoute } from '../utils';
import { z } from '../zod';

export const DUPLICATE_BASE = '/base/duplicate';

export const duplicateBaseRoSchema = z.object({
  fromBaseId: z.string().openapi({
    description: 'The base to duplicate',
  }),
  withRecords: z.boolean().optional().openapi({
    description: 'Whether to duplicate the records',
  }),
  name: z.string().optional().openapi({
    description: 'The name of the duplicated base',
  }),
});

export const duplicateBaseVoSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().nullable(),
});

export type IDuplicateBaseRo = z.infer<typeof duplicateBaseRoSchema>;

export type IDuplicateBaseVo = z.infer<typeof duplicateBaseVoSchema>;

export const DuplicateBaseRoute: RouteConfig = registerRoute({
  method: 'post',
  path: DUPLICATE_BASE,
  description: 'duplicate a base',
  request: {
    params: z.object({
      baseId: z.string(),
    }),
    body: {
      content: {
        'application/json': {
          schema: duplicateBaseRoSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Returns information about a successfully duplicated base.',
      content: {
        'application/json': {
          schema: duplicateBaseVoSchema,
        },
      },
    },
  },
  tags: ['base'],
});

export const duplicateBase = async (params: IDuplicateBaseRo) => {
  return axios.post<IDuplicateBaseVo>(DUPLICATE_BASE, params);
};
