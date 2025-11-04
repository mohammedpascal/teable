import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { axios } from '../axios';
import { registerRoute, urlBuilder } from '../utils';
import { z } from '../zod';

export const DELETE_BASE = '/base/bse0';

export const DeleteBaseRoute: RouteConfig = registerRoute({
  method: 'delete',
  path: DELETE_BASE,
  description: 'Delete a base by baseId',
  request: {},
  responses: {
    200: {
      description: 'Deleted successfully',
    },
  },
  tags: ['base'],
});

export const deleteBase = async () => {
  return await axios.delete<null>(urlBuilder(DELETE_BASE));
};
