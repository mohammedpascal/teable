/* eslint-disable sonarjs/no-duplicate-string */
import type { INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/prisma';
import { initApp } from './utils/init-app';

describe('Credit limit (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    process.env.MAX_FREE_ROW_LIMIT = '10';
    const appCtx = await initApp();
    app = appCtx.app;
    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    process.env.MAX_FREE_ROW_LIMIT = undefined;
    await app.close();
  });
});
