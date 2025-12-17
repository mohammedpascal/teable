/* eslint-disable @typescript-eslint/naming-convention */
import type {
  IConvertFieldRo,
  IFieldRo,
  IGetFieldsQuery,
  NotificationStatesEnum,
} from '@teable/core';
import {
  type IAggregationRo,
  type ICalendarDailyCollectionRo,
  type IGroupPointsRo,
  type IQueryBaseRo,
} from '@teable/openapi';

export const ReactQueryKeys = {
  base: () => ['base'] as const,

  baseList: () => ['base-list'] as const,

  tableList: () => ['table-list'] as const,

  notifyList: (filter: { status: NotificationStatesEnum }) =>
    ['notification', 'list', filter] as const,
  notifyUnreadCount: () => ['notification', 'unread-count'],

  rowCount: (tableId: string, query: IQueryBaseRo) => ['row-count', tableId, query] as const,
  groupPoints: (tableId: string, query: IGroupPointsRo) =>
    ['group-points', tableId, query] as const,
  aggregations: (tableId: string, query: IAggregationRo) =>
    ['aggregations', tableId, query] as const,

  planFieldCreate: (tableId: string, fieldRo: IFieldRo) =>
    ['create-field-plan', tableId, fieldRo] as const,

  planFieldConvert: (tableId: string, fieldId: string, fieldRo: IConvertFieldRo) =>
    ['create-field-plan', tableId, fieldId, fieldRo] as const,

  planField: (tableId: string, fieldId: string) => ['field-plan', tableId, fieldId] as const,

  tableInfo: (tableId: string) => ['table-info', tableId],

  field: (tableId: string) => ['field-info', tableId],

  getViewFilterLinkRecords: (tableId: string, viewId: string) =>
    ['get-view-filter-link-records', tableId, viewId] as const,

  getFieldFilterLinkRecords: (tableId: string, fieldId: string) =>
    ['get-field-filter-link-records', tableId, fieldId] as const,

  getSharedBase: () => ['shared-base-list'] as const,

  getDashboardList: () => ['dashboard-list'] as const,

  getDashboard: (dashboardId: string) => ['dashboard', dashboardId] as const,

  viewList: (tableId: string) => ['view-list', tableId] as const,

  fieldList: (tableId: string, query?: IGetFieldsQuery) => ['field-list', tableId, query] as const,

  calendarDailyCollection: (tableId: string, query: ICalendarDailyCollectionRo) =>
    ['calendar-daily-collection', tableId, query] as const,

  getPublicSetting: () => ['public-setting'] as const,
};
