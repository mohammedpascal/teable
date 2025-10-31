import type { INestApplication } from '@nestjs/common';
import { Role } from '@teable/core';
import type { IUserMeVo, ListBaseInvitationLinkVo } from '@teable/openapi';
import {
  CREATE_BASE_INVITATION_LINK,
  createBaseInvitationLink,
  createBaseInvitationLinkVoSchema,
  DELETE_BASE,
  deleteBaseInvitationLink,
  EMAIL_BASE_INVITATION,
  emailBaseInvitation,
  listBaseInvitationLink,
  UPDATE_BASE_INVITATION_LINK,
  updateBaseInvitationLink,
  urlBuilder,
  USER_ME,
} from '@teable/openapi';
import type { AxiosInstance } from 'axios';
import { createNewUserAxios } from './utils/axios-instance/new-user';
import { getError } from './utils/get-error';
import { initApp } from './utils/init-app';

describe('OpenAPI BaseController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const appCtx = await initApp();
    app = appCtx.app;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Base Invitation', () => {
    const newUserEmail = 'newuser@example.com';
    const newUser3Email = 'newuser2@example.com';

    let userRequest: AxiosInstance;
    let user3Request: AxiosInstance;
    let spaceId: string;
    let baseId: string;
    beforeAll(async () => {
      user3Request = await createNewUserAxios({
        email: newUser3Email,
        password: '12345678',
      });
      userRequest = await createNewUserAxios({
        email: newUserEmail,
        password: '12345678',
      });
      spaceId = globalThis.testConfig.spaceId;
    });
    beforeEach(async () => {
      baseId = globalThis.testConfig.baseId;
      await userRequest.post(urlBuilder(EMAIL_BASE_INVITATION, { baseId }), {
        emails: [globalThis.testConfig.email],
        role: Role.Creator,
      });
    });

    afterEach(async () => {
      await userRequest.delete<null>(
        urlBuilder(DELETE_BASE, {
          baseId,
        })
      );
    });
    afterAll(async () => {
      // Space cleanup is handled by test config
    });

    it('/api/base/:baseId/invitation/link (POST)', async () => {
      const res = await createBaseInvitationLink({
        baseId,
        createBaseInvitationLinkRo: { role: Role.Creator },
      });
      expect(createBaseInvitationLinkVoSchema.safeParse(res.data).success).toEqual(true);

      const linkList = await listBaseInvitationLink(baseId);
      expect(linkList.data).toHaveLength(1);
    });

    it('/api/base/{baseId}/invitation/link (POST) - Forbidden', async () => {
      await userRequest.post(urlBuilder(EMAIL_BASE_INVITATION, { baseId }), {
        emails: [newUser3Email],
        role: Role.Editor,
      });
      const error = await getError(() =>
        user3Request.post(urlBuilder(CREATE_BASE_INVITATION_LINK, { baseId }), {
          role: Role.Creator,
        })
      );
      expect(error?.status).toBe(403);
    });

    it('/api/base/:baseId/invitation/link/:invitationCode (PATCH)', async () => {
      const res = await createBaseInvitationLink({
        baseId,
        createBaseInvitationLinkRo: { role: Role.Editor },
      });
      const newInvitationId = res.data.invitationCode;

      const newBaseUpdate = await updateBaseInvitationLink({
        baseId,
        invitationId: newInvitationId,
        updateBaseInvitationLinkRo: { role: Role.Editor },
      });
      expect(newBaseUpdate.data.role).toEqual(Role.Editor);
    });

    it('/api/base/:baseId/invitation/link/:invitationCode (PATCH) - exceeds limit role', async () => {
      const res = await createBaseInvitationLink({
        baseId,
        createBaseInvitationLinkRo: { role: Role.Editor },
      });
      const newInvitationId = res.data.invitationCode;

      await userRequest.post(urlBuilder(EMAIL_BASE_INVITATION, { baseId }), {
        emails: [newUser3Email],
        role: Role.Editor,
      });
      const error = await getError(() =>
        user3Request.patch(
          urlBuilder(UPDATE_BASE_INVITATION_LINK, { baseId, invitationCode: newInvitationId }),
          { role: Role.Creator }
        )
      );
      expect(error?.status).toBe(403);
    });

    // Collaboration removed - collaborator list endpoints no longer exist
    // it('/api/base/:baseId/invitation/link (GET)', async () => {
    //   const res = await getBaseCollaboratorList(baseId);
    //   expect(res.data.collaborators).toHaveLength(2);
    // });

    it('/api/base/:baseId/invitation/link/:invitationCode (DELETE)', async () => {
      const res = await createBaseInvitationLink({
        baseId,
        createBaseInvitationLinkRo: { role: Role.Editor },
      });
      const newInvitationId = res.data.invitationCode;

      await deleteBaseInvitationLink({ baseId, invitationId: newInvitationId });

      const list: ListBaseInvitationLinkVo = (await listBaseInvitationLink(baseId)).data;
      expect(list.find((v) => v.invitationCode === newInvitationId)).toBeUndefined();
    });

    it('/api/base/:baseId/invitation/email (POST)', async () => {
      await emailBaseInvitation({
        baseId,
        emailBaseInvitationRo: { role: Role.Creator, emails: [newUser3Email] },
      });
      // Collaboration removed - no longer checking collaborator list
    });

    it('/api/base/:baseId/invitation/email (POST) - exceeds limit role', async () => {
      await userRequest.post(urlBuilder(EMAIL_BASE_INVITATION, { baseId }), {
        emails: [newUser3Email],
        role: Role.Editor,
      });
      const error = await getError(() =>
        user3Request.post(urlBuilder(EMAIL_BASE_INVITATION, { baseId }), {
          emails: [newUser3Email],
          role: Role.Creator,
        })
      );
      expect(error?.status).toBe(403);
    });

    it('/api/base/:baseId/invitation/email (POST) - not exist email', async () => {
      await emailBaseInvitation({
        baseId,
        emailBaseInvitationRo: { emails: ['not.exist@email.com'], role: Role.Creator },
      });
      // Collaboration removed - no longer checking collaborator list
    });

    it('/api/base/:baseId/invitation/email (POST) - user in space', async () => {
      const error = await getError(() =>
        emailBaseInvitation({
          baseId,
          emailBaseInvitationRo: { emails: [globalThis.testConfig.email], role: Role.Creator },
        })
      );
      expect(error?.status).toBe(400);
    });

    // Collaboration removed - collaborator management endpoints no longer exist
    // describe('operator collaborators', () => {
    //   ... all collaborator management tests removed
    // });
  });
});
