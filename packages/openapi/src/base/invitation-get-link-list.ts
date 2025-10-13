import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { baseRolesSchema } from '@teable/core';
import { axios } from '../axios';
import { itemInvitationLinkVoSchema } from '../types/collaborator';
import { registerRoute, urlBuilder } from '../utils';
import { z } from '../zod';

export const LIST_BASE_INVITATION_LINK = '/base/{baseId}/invitation/link';

export const itemBaseInvitationLinkVoSchema = itemInvitationLinkVoSchema
  .omit({
    role: true,
  })
  .extend({
    role: baseRolesSchema,
  });

export type ItemBaseInvitationLinkVo = z.infer<typeof itemBaseInvitationLinkVoSchema>;

export const listBaseInvitationLinkVoSchema = z.array(itemBaseInvitationLinkVoSchema);

export type ListBaseInvitationLinkVo = z.infer<typeof listBaseInvitationLinkVoSchema>;

export const ListBaseInvitationLinkRoute: RouteConfig = registerRoute({
  method: 'get',
  path: LIST_BASE_INVITATION_LINK,
  description: 'List a invitation link to your',
  request: {
    params: z.object({
      baseId: z.string(),
    }),
  },
  responses: {
    200: {
      description: 'Successful response, return invitation information list.',
      content: {
        'application/json': {
          schema: listBaseInvitationLinkVoSchema,
        },
      },
    },
  },
  tags: ['base'],
});

export const listBaseInvitationLink = (baseId: string) => {
  return axios.get<ListBaseInvitationLinkVo>(urlBuilder(LIST_BASE_INVITATION_LINK, { baseId }));
};
