import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { axios } from '../axios';
import { registerRoute } from '../utils';
import { z } from '../zod';
import { tableListVoSchema } from './create';

export type ITableListVo = z.infer<typeof tableListVoSchema>;

export const GET_TABLE_LIST = '/base/bse0/table';

export const GetTableListRoute: RouteConfig = registerRoute({
  method: 'get',
  path: GET_TABLE_LIST,
  summary: 'List tables',
  description:
    'Retrieve a list of all tables in the specified base, including their basic information and configurations.',
  request: {
    params: z.object({}),
  },
  responses: {
    200: {
      description: 'Successfully retrieved the list of tables.',
      content: {
        'application/json': {
          schema: tableListVoSchema,
        },
      },
    },
  },
  tags: ['table'],
});

export const getTableList = async () => {
  return axios.get<ITableListVo>(GET_TABLE_LIST);
};
