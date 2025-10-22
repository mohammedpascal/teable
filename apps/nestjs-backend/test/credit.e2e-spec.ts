/* eslint-disable sonarjs/no-duplicate-string */
import type { INestApplication } from '@nestjs/common';
import { FieldKeyType } from '@teable/core';
import { PrismaService } from '../src/prisma';
import type { ITableFullVo } from '@teable/openapi';
// TODO: Space functionality not yet implemented
// import { createBase, createSpace, deleteBase, deleteSpace } from '@teable/openapi';
import { createRecords, createTable, deleteTable, initApp } from './utils/init-app';

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
