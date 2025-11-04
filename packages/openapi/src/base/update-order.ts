import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { axios } from '../axios';
import { registerRoute, urlBuilder } from '../utils';
import type { IUpdateOrderRo } from '../view/update-order';
import { updateOrderRoSchema } from '../view/update-order';
import { z } from '../zod';

export const BASE_ORDER = '/base/bse0/order';

export const updateBaseOrderRoute: RouteConfig = registerRoute({
  method: 'put',
  path: BASE_ORDER,
  description: 'Update base order',
  request: {
    body: {
      content: {
        'application/json': {
          schema: updateOrderRoSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successfully update.',
    },
  },
  tags: ['base'],
});

export const updateBaseOrder = async (orderRo: IUpdateOrderRo) => {
  return axios.put<void>(urlBuilder(BASE_ORDER), orderRo);
};
