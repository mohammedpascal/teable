import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { axios } from '../../axios';
import { registerRoute } from '../../utils';
import { settingVoSchema } from './get';

export const publicSettingVoSchema = settingVoSchema.pick({
  instanceId: true,
  disallowSignUp: true,
  enableEmailVerification: true,
});

export type IPublicSettingVo = z.infer<typeof publicSettingVoSchema>;

export const GET_PUBLIC_SETTING = '/admin/setting/public';
export const GetPublicSettingRoute: RouteConfig = registerRoute({
  method: 'get',
  path: GET_PUBLIC_SETTING,
  description: 'Get the public instance settings',
  request: {},
  responses: {
    200: {
      description: 'Returns the public instance settings.',
      content: {
        'application/json': {
          schema: publicSettingVoSchema,
        },
      },
    },
  },
  tags: ['admin'],
});

export const getPublicSetting = async () => {
  return axios.get<IPublicSettingVo>(GET_PUBLIC_SETTING);
};
