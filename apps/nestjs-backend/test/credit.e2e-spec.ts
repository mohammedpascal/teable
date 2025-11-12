/* eslint-disable sonarjs/no-duplicate-string */
import type { INestApplication } from '@nestjs/common';
import { initApp } from './utils/init-app';

describe('Credit limit (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    process.env.MAX_FREE_ROW_LIMIT = '10';
    const appCtx = await initApp();
    app = appCtx.app;
  });

  afterAll(async () => {
    process.env.MAX_FREE_ROW_LIMIT = undefined;
    await app.close();
  });
});
