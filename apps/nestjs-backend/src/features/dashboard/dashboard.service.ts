/* eslint-disable sonarjs/no-duplicate-string */
import { Injectable, NotFoundException } from '@nestjs/common';
import { generateDashboardId } from '@teable/core';
import type {
  ICreateDashboardRo,
  IGetDashboardListVo,
  IGetDashboardVo,
  IUpdateLayoutDashboardRo,
} from '@teable/openapi';
import { ClsService } from 'nestjs-cls';
import { PrismaService } from '../../prisma';
import type { IClsStore } from '../../types/cls';
import { CollaboratorService } from '../collaborator/collaborator.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cls: ClsService<IClsStore>,
    private readonly collaboratorService: CollaboratorService
  ) {}

  async getDashboard(baseId: string): Promise<IGetDashboardListVo> {
    return this.prismaService.dashboard.findMany({
      where: {
        baseId,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        createdTime: 'asc',
      },
    });
  }

  async getDashboardById(baseId: string, id: string): Promise<IGetDashboardVo> {
    const dashboard = await this.prismaService.dashboard
      .findFirstOrThrow({
        where: {
          id,
          baseId,
        },
        select: {
          id: true,
          name: true,
          layout: true,
        },
      })
      .catch(() => {
        throw new NotFoundException('Dashboard not found');
      });

    const widgets = await this.prismaService.dashboardWidget.findMany({
      where: {
        dashboardId: dashboard.id,
      },
      select: {
        id: true,
        name: true,
        type: true,
        config: true,
        position: true,
      },
    });

    return {
      ...dashboard,
      layout: dashboard.layout ? JSON.parse(dashboard.layout) : undefined,
      widgetMap: widgets.reduce(
        (acc, widget) => {
          acc[widget.id] = {
            id: widget.id,
            name: widget.name,
            type: widget.type,
            config: widget.config,
            position: widget.position,
          };
          return acc;
        },
        {} as Record<string, any>
      ),
    };
  }

  async createDashboard(baseId: string, dashboard: ICreateDashboardRo) {
    const userId = this.cls.get('user.id');
    return this.prismaService.dashboard.create({
      data: {
        id: generateDashboardId(),
        baseId,
        name: dashboard.name,
        createdBy: userId,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async renameDashboard(baseId: string, id: string, name: string) {
    return this.prismaService.dashboard
      .update({
        where: {
          baseId,
          id,
        },
        data: {
          name,
        },
        select: {
          id: true,
          name: true,
        },
      })
      .catch(() => {
        throw new NotFoundException('Dashboard not found');
      });
  }

  async updateLayout(baseId: string, id: string, layout: IUpdateLayoutDashboardRo['layout']) {
    const ro = await this.prismaService.dashboard
      .update({
        where: {
          baseId,
          id,
        },
        data: {
          layout: JSON.stringify(layout),
        },
        select: {
          id: true,
          name: true,
          layout: true,
        },
      })
      .catch(() => {
        throw new NotFoundException('Dashboard not found');
      });
    return {
      ...ro,
      layout: ro.layout ? JSON.parse(ro.layout) : undefined,
    };
  }

  async deleteDashboard(baseId: string, id: string) {
    await this.prismaService.dashboard
      .delete({
        where: {
          baseId,
          id,
        },
      })
      .catch(() => {
        throw new NotFoundException('Dashboard not found');
      });
  }

  private async validateDashboard(baseId: string, dashboardId: string) {
    await this.prismaService
      .txClient()
      .dashboard.findFirstOrThrow({
        where: {
          baseId,
          id: dashboardId,
        },
      })
      .catch(() => {
        throw new NotFoundException('Dashboard not found');
      });
  }

  // Widget management methods
  async createWidget(
    baseId: string,
    dashboardId: string,
    widgetData: { name: string; type: string; config?: string; position?: string }
  ) {
    const userId = this.cls.get('user.id');

    // Verify dashboard exists and user has access
    const dashboard = await this.prismaService.dashboard.findFirstOrThrow({
      where: { id: dashboardId, baseId },
    });

    // Create the widget
    const widget = await this.prismaService.dashboardWidget.create({
      data: {
        dashboardId,
        name: widgetData.name,
        type: widgetData.type,
        config: widgetData.config,
        position: widgetData.position,
        createdBy: userId,
      },
    });

    // Add widget to dashboard layout
    const currentLayout = dashboard.layout ? JSON.parse(dashboard.layout) : [];
    const newLayoutItem = {
      widgetId: widget.id,
      x: 0,
      y: 0,
      w: 6,
      h: 4,
    };

    const updatedLayout = [...currentLayout, newLayoutItem];

    await this.prismaService.dashboard.update({
      where: { id: dashboardId },
      data: { layout: JSON.stringify(updatedLayout) },
    });

    return widget;
  }

  async updateWidget(
    baseId: string,
    dashboardId: string,
    widgetId: string,
    widgetData: { name?: string; config?: string; position?: string }
  ) {
    const userId = this.cls.get('user.id');

    // Verify dashboard and widget exist
    await this.prismaService.dashboardWidget.findFirstOrThrow({
      where: {
        id: widgetId,
        dashboardId,
        dashboard: { baseId },
      },
    });

    return await this.prismaService.dashboardWidget.update({
      where: { id: widgetId },
      data: {
        ...widgetData,
        lastModifiedBy: userId,
      },
    });
  }

  async deleteWidget(baseId: string, dashboardId: string, widgetId: string) {
    // Verify dashboard and widget exist
    const dashboard = await this.prismaService.dashboard.findFirstOrThrow({
      where: { id: dashboardId, baseId },
    });

    await this.prismaService.dashboardWidget.delete({
      where: { id: widgetId },
    });

    // Remove widget from dashboard layout
    const currentLayout = dashboard.layout ? JSON.parse(dashboard.layout) : [];
    const updatedLayout = currentLayout.filter((item: any) => item.widgetId !== widgetId);

    await this.prismaService.dashboard.update({
      where: { id: dashboardId },
      data: { layout: JSON.stringify(updatedLayout) },
    });
  }
}
