/* eslint-disable @typescript-eslint/no-explicit-any */
import type { INestApplication } from '@nestjs/common';
import { ViewType } from '@teable/core';
import map from 'lodash/map';
import { createTable, deleteTable, initApp, updateViewColumnMeta } from './utils/init-app';

describe('Share (socket-e2e) (e2e)', () => {
  let app: INestApplication;
  let tableId: string;
  let viewId: string;
  let fieldIds: string[] = [];

  beforeAll(async () => {
    const appCtx = await initApp();
    app = appCtx.app;

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
