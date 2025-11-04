import { axios } from '../axios';
import { registerRoute, urlBuilder } from '../utils';
import { z } from '../zod';

export const GET_DEFAULT_VIEW_ID = '/base/bse0/table/{tableId}/default-view-id';

export const getDefaultViewIdVoSchema = z.object({
  id: z.string(),
});

export type IGetDefaultViewIdVo = z.infer<typeof getDefaultViewIdVoSchema>;

export const GetDefaultViewIdRoute = registerRoute({
  method: 'get',
  path: GET_DEFAULT_VIEW_ID,
  summary: 'Get default view id',
  description: 'Get default view id',
  request: {
    params: z.object({
      tableId: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'Returns default view id',
      content: {
        'application/json': {
          schema: getDefaultViewIdVoSchema,
        },
      },
    },
  },
  tags: ['table'],
});

export const getDefaultViewId = async (tableId: string) => {
  return axios.get<IGetDefaultViewIdVo>(urlBuilder(GET_DEFAULT_VIEW_ID, { tableId }));
};
