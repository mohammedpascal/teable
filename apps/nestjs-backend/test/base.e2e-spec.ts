import type { INestApplication } from '@nestjs/common';
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
});
