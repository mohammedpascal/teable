import type { INestApplication } from '@nestjs/common';
import { ViewType } from '@teable/core';
import type { ITableFullVo } from '@teable/openapi';
import { createTable, updateRecordOrders, updateViewOrder } from '@teable/openapi';
import {
  createRecords,
  createView,
  deleteTable,
  getRecords,
  getViews,
  initApp,
} from './utils/init-app';

describe('order update', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const appCtx = await initApp();
    app = appCtx.app;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('record', () => {
    const baseId = globalThis.testConfig.baseId;
    let table: ITableFullVo;
    beforeEach(async () => {
      table = (await createTable({ name: 'table1' })).data;
    });

    afterEach(async () => {
      await deleteTable(table.id);
    });

    it('should update record order', async () => {
      const viewId = table.views[0].id;
      const record1 = { id: table.records[0].id };
      const record2 = { id: table.records[1].id };
      const record3 = { id: table.records[2].id };

      await updateRecordOrders(table.id, viewId, {
        anchorId: record2.id,
        position: 'before',
        recordIds: [record3.id],
      });
      const data1 = await getRecords(table.id, { viewId });
      expect(data1.records).toMatchObject([record1, record3, record2]);

      await updateRecordOrders(table.id, viewId, {
        anchorId: record1.id,
        position: 'before',
        recordIds: [record3.id, record2.id],
      });
      const data2 = await getRecords(table.id, { viewId });
      expect(data2.records).toMatchObject([record3, record2, record1]);

      await updateRecordOrders(table.id, viewId, {
        anchorId: record1.id,
        position: 'after',
        recordIds: [record3.id, record2.id],
      });
      const data3 = await getRecords(table.id, { viewId });
      expect(data3.records).toMatchObject([record1, record3, record2]);

      await updateRecordOrders(table.id, viewId, {
        anchorId: record3.id,
        position: 'after',
        recordIds: [record2.id, record3.id],
      });
      const data4 = await getRecords(table.id, { viewId });
      expect(data4.records).toMatchObject([record1, record2, record3]);

      const result = await createRecords(table.id, {
        records: [{ fields: {} }],
        order: {
          viewId,
          anchorId: record1.id,
          position: 'before',
        },
      });
      const data5 = await getRecords(table.id, { viewId });
      expect(data5.records).toMatchObject([
        { id: result.records[0].id },
        record1,
        record2,
        record3,
      ]);
    });

    it('should create record with order', async () => {
      const viewId = table.views[0].id;
      const record1 = { id: table.records[0].id };
      const record2 = { id: table.records[1].id };
      const record3 = { id: table.records[2].id };

      const result = await createRecords(table.id, {
        records: [{ fields: {} }],
        order: {
          viewId,
          anchorId: record1.id,
          position: 'before',
        },
      });
      const data1 = await getRecords(table.id, { viewId });
      expect(data1.records).toMatchObject([
        { id: result.records[0].id },
        record1,
        record2,
        record3,
      ]);

      const result2 = await createRecords(table.id, {
        records: [{ fields: {} }],
        order: {
          viewId,
          anchorId: record3.id,
          position: 'after',
        },
      });
      const data2 = await getRecords(table.id, { viewId });
      expect(data2.records).toMatchObject([
        { id: result.records[0].id },
        record1,
        record2,
        record3,
        { id: result2.records[0].id },
      ]);
    });
  });

  describe('view', () => {
    const baseId = globalThis.testConfig.baseId;
    let table: ITableFullVo;
    beforeEach(async () => {
      table = (await createTable({ name: 'table1' })).data;
    });

    afterEach(async () => {
      await deleteTable(table.id);
    });

    it('should update view order', async () => {
      const view1 = { id: table.views[0].id };

      const view2 = {
        id: (
          await createView(table.id, {
            name: 'view',
            type: ViewType.Grid,
          })
        ).id,
      };

      const view3 = {
        id: (
          await createView(table.id, {
            name: 'view',
            type: ViewType.Grid,
          })
        ).id,
      };

      await updateViewOrder(table.id, view3.id, { anchorId: view2.id, position: 'before' });
      const views = await getViews(table.id);
      expect(views).toMatchObject([view1, view3, view2]);

      await updateViewOrder(table.id, view3.id, { anchorId: view1.id, position: 'before' });
      const views2 = await getViews(table.id);
      expect(views2).toMatchObject([view3, view1, view2]);

      await updateViewOrder(table.id, view3.id, { anchorId: view1.id, position: 'after' });
      const views3 = await getViews(table.id);
      expect(views3).toMatchObject([view1, view3, view2]);

      await updateViewOrder(table.id, view3.id, { anchorId: view2.id, position: 'after' });
      const views4 = await getViews(table.id);
      expect(views4).toMatchObject([view1, view2, view3]);
    });
  });

  describe('table', () => {
    it('should update table order', async () => {
      // Test placeholder - table ordering tests would go here
    });
  });
});
