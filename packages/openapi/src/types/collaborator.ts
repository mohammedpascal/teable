import { z } from '../zod';

export enum PrincipalType {
  User = 'user',
}

export enum CollaboratorType {
  Base = 'base',
}

export const emailInvitationVoSchema = z.record(
  z.object({
    invitationId: z.string(),
  })
);

export const itemInvitationLinkVoSchema = z.object({
  id: z.string(),
  invitationCode: z.string(),
  role: z.string(),
  type: z.string(),
  expiredTime: z.string().nullable(),
  createdTime: z.string(),
  createdBy: z.string(),
});

export type EmailInvitationVo = z.infer<typeof emailInvitationVoSchema>;

export type ItemInvitationLinkVo = z.infer<typeof itemInvitationLinkVoSchema>;

