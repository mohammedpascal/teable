/* eslint-disable @typescript-eslint/no-explicit-any */
import type { INestApplication } from '@nestjs/common';
import { IdPrefix, ViewType } from '@teable/core';
import { map } from 'lodash';
import { type Doc } from 'sharedb/lib/client';
import { ShareDbService } from '../src/share-db/share-db.service';
import { getError } from './utils/get-error';
import { initApp, updateViewColumnMeta, createTable, deleteTable } from './utils/init-app';

describe('Share (socket-e2e) (e2e)', () => {
  let app: INestApplication;
  let tableId: string;
  let shareId: string;
  let viewId: string;
  const baseId = globalThis.testConfig.baseId;
  let fieldIds: string[] = [];
  let shareDbService!: ShareDbService;

  beforeAll(async () => {
    const appCtx = await initApp();
    app = appCtx.app;
    shareDbService = app.get(ShareDbService);

    const table = await createTable({
      name: 'table1',
      views: [
        {
          type: ViewType.Grid,
          name: 'view1',
        },
        {
          type: ViewType.Form,
          name: 'view2',
        },
      ],
    });
    tableId = table.id;
    viewId = table.defaultViewId!;
    fieldIds = map(table.fields, 'id');
    // hidden last one field
    const field = table.fields[fieldIds.length - 1];
    await updateViewColumnMeta(tableId, viewId, [
      { fieldId: field.id, columnMeta: { hidden: true } },
    ]);
  });

  afterAll(async () => {
    await deleteTable(tableId);

    await app.close();
  });

  const getQuery = (collection: string, shareId: string) => {
    return new Promise<Doc<any>[]>((resolve, reject) => {
      const connection = shareDbService.connect(undefined, {
        url: `ws://localhost:3000/socket?shareId=${shareId}`,
        headers: {},
      });
      connection.createFetchQuery(collection, {}, {}, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
      connection.on('error', (err) => reject(err));
      connection.agent?.stream.on('error', (err) => reject(err));
      shareDbService.on('error', (err) => reject(err));
      setTimeout(() => {
        reject(new Error('connection error'));
      }, 2000);
    });
  };

  it('Retrieve fields other than those that are hidden', async () => {
    // TODO: View sharing functionality not yet implemented
  });

  it('Reading the view query will only get the one that was shared', async () => {
    // TODO: View sharing functionality not yet implemented
  });

  it('shareId error', async () => {
    // TODO: View sharing functionality not yet implemented
  });
});
