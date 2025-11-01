/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable sonarjs/no-duplicate-string */
import type { INestApplication } from '@nestjs/common';
import type { IFieldRo, ILinkFieldOptions } from '@teable/core';
import { FieldType, Relationship } from '@teable/core';
import { PrismaService } from '../src/prisma';
import type { ITableFullVo } from '@teable/openapi';
import {
  checkBaseIntegrity,
  convertField,
  deleteBase,
  fixBaseIntegrity,
  getRecord,
  getRecords,
  updateRecord,
  updateRecords,
} from '@teable/openapi';
import type { Knex } from 'knex';
import { DB_PROVIDER_SYMBOL } from '../src/db-provider/db.provider';
import type { IDbProvider } from '../src/db-provider/db.provider.interface';
import {
  createField,
  createTable,
  deleteTable,
  getField,
  initApp,
} from './utils/init-app';

describe('OpenAPI integrity (e2e)', () => {
  let app: INestApplication;
  const baseId = globalThis.testConfig.baseId;

  let prisma: PrismaService;
  let dbProvider: IDbProvider;

  async function executeKnex(builder: Knex.SchemaBuilder | Knex.QueryBuilder) {
    const query = builder.toQuery();
    return await prisma.$executeRawUnsafe(query);
  }

  beforeAll(async () => {
    const appCtx = await initApp();
    dbProvider = appCtx.app.get<IDbProvider>(DB_PROVIDER_SYMBOL);
    prisma = appCtx.app.get<PrismaService>(PrismaService);
    app = appCtx.app;
  });

  afterAll(async () => {
    await app.close();
  });
});
