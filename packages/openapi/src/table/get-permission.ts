import type {
  RecordAction,
  TableAction,
  ViewAction,
} from '@teable/core';
import { axios } from '../axios';
import { registerRoute, urlBuilder } from '../utils';
import { z } from '../zod';

export const GET_TABLE_PERMISSION = '/table/{tableId}/permission';

export const tablePermissionVoSchema = z.object({
  table: z.record(z.custom<TableAction>(), z.boolean()),
  view: z.record(z.custom<ViewAction>(), z.boolean()),
  record: z.record(z.custom<RecordAction>(), z.boolean()),
});

export type ITablePermissionVo = z.infer<typeof tablePermissionVoSchema>;

export const GetTablePermissionRoute = registerRoute({
  method: 'get',
  path: GET_TABLE_PERMISSION,
  summary: 'Get table permissions',
  description:
    "Retrieve the current user's permissions for a table, including access rights for table operations, views, and records.",
  request: {
    params: z.object({
      tableId: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'Successfully retrieved table permissions for the current user.',
      content: {
        'application/json': {
          schema: tablePermissionVoSchema,
        },
      },
    },
  },
  tags: ['table'],
});

export const getTablePermission = async (tableId: string) => {
  return axios.get<ITablePermissionVo>(
    urlBuilder(GET_TABLE_PERMISSION, {
      tableId,
    })
  );
};
