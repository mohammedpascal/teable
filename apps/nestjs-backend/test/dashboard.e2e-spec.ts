import type { INestApplication } from '@nestjs/common';
import {
  createDashboard,
  createDashboardVoSchema,
  deleteDashboard,
  getDashboard,
  getDashboardVoSchema,
  renameDashboard,
  updateLayoutDashboard,
} from '@teable/openapi';
import { getError } from './utils/get-error';
import { initApp } from './utils/init-app';

const dashboardRo = {
  name: 'dashboard',
};

describe('DashboardController', () => {
  let app: INestApplication;
  let dashboardId: string;

  beforeAll(async () => {
    const appCtx = await initApp();
    app = appCtx.app;
  });

  beforeEach(async () => {
    const res = await createDashboard(dashboardRo);
    dashboardId = res.data.id;
  });

  afterEach(async () => {
    await deleteDashboard(dashboardId);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/dashboard (POST)', async () => {
    const res = await createDashboard(dashboardRo);
    expect(createDashboardVoSchema.strict().safeParse(res.data).success).toBe(true);
    expect(res.status).toBe(201);
    await deleteDashboard(res.data.id);
  });

  it('/api/dashboard/:id (GET)', async () => {
    const getRes = await getDashboard(dashboardId);
    expect(getDashboardVoSchema.strict().safeParse(getRes.data).success).toBe(true);
    expect(getRes.data.id).toBe(dashboardId);
  });

  it('/api/dashboard/:id (DELETE)', async () => {
    const res = await createDashboard(dashboardRo);
    await deleteDashboard(res.data.id);
    const error = await getError(() => getDashboard(res.data.id));
    expect(error?.status).toBe(404);
  });

  it('/api/dashboard/:id/rename (PATCH)', async () => {
    const res = await createDashboard(dashboardRo);
    const newName = 'new-dashboard';
    const renameRes = await renameDashboard(res.data.id, newName);
    expect(renameRes.data.name).toBe(newName);
    await deleteDashboard(res.data.id);
  });

  it('/api/dashboard/:id/layout (PATCH)', async () => {
    const res = await createDashboard(dashboardRo);
    const layout = [{ widgetId: 'widget-id', x: 0, y: 0, w: 1, h: 1 }];
    const updateRes = await updateLayoutDashboard(res.data.id, layout);
    expect(updateRes.data.layout).toEqual(layout);
    await deleteDashboard(res.data.id);
  });
});
