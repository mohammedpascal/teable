import { z } from '../zod';

export enum PrincipalType {
  User = 'user',
  Department = 'department',
}

export enum CollaboratorType {
  Base = 'base',
}

export const collaboratorItem = z.object({
  type: z.nativeEnum(PrincipalType),
  userId: z.string().optional(),
  userName: z.string().optional(),
  email: z.string().optional(),
  avatar: z.string().nullable().optional(),
  role: z.string(),
  createdTime: z.string(),
  resourceType: z.string().optional(),
  isSystem: z.boolean().optional(),
});

export const userCollaboratorItem = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  avatar: z.string().nullable().optional(),
});

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

export const addCollaboratorSchema = z.object({
  principalId: z.string(),
  principalType: z.nativeEnum(PrincipalType),
});

export const deleteCollaboratorRoSchema = z.object({
  principalId: z.string(),
  principalType: z.nativeEnum(PrincipalType),
});

export type CollaboratorItem = z.infer<typeof collaboratorItem>;
export type UserCollaboratorItem = z.infer<typeof userCollaboratorItem>;

export type EmailInvitationVo = z.infer<typeof emailInvitationVoSchema>;

export type ItemInvitationLinkVo = z.infer<typeof itemInvitationLinkVoSchema>;

export type AddCollaborator = z.infer<typeof addCollaboratorSchema>;
