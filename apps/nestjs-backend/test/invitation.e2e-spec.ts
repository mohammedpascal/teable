import type { INestApplication } from '@nestjs/common';
import { initApp } from './utils/init-app';

describe('OpenAPI InvitationController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const appCtx = await initApp();
    app = appCtx.app;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/invitation/link/accept (POST)', async () => {
    // Test placeholder - base invitations are now used instead of space invitations
  });
});
