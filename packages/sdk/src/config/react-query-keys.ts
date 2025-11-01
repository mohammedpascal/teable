/* eslint-disable @typescript-eslint/naming-convention */
import type {
  IFieldRo,
  IConvertFieldRo,
  NotificationStatesEnum,
  IGetFieldsQuery,
} from '@teable/core';
import {
  type IAggregationRo,
  type IGroupPointsRo,
  type IQueryBaseRo,
  type ResourceType,
  type IGetRecordsRo,
  type ICalendarDailyCollectionRo,
} from '@teable/openapi';

export const ReactQueryKeys = {
  base: (baseId: string) => ['base', baseId] as const,

  baseAll: () => ['base-all'] as const,

  baseList: () => ['base-list'] as const,

  tableList: (baseId: string) => ['table-list', baseId] as const,



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

  personAccessTokenList: () => ['person-access-token-list'],

  personAccessToken: (id: string) => ['person-access-token-list', id],

  tableInfo: (baseId: string, tableId: string) => ['table-info', baseId, tableId],

  field: (tableId: string) => ['field-info', tableId],

  getViewFilterLinkRecords: (tableId: string, viewId: string) =>
    ['get-view-filter-link-records', tableId, viewId] as const,

  getFieldFilterLinkRecords: (tableId: string, fieldId: string) =>
    ['get-field-filter-link-records', tableId, fieldId] as const,

  getTablePermission: (baseId: string, tableId: string) =>
    ['table-permission', baseId, tableId] as const,

  getBasePermission: (baseId: string) => ['base-permission', baseId] as const,

  getRecordHistory: (tableId: string, recordId?: string) =>
    ['record-history', tableId, recordId] as const,

  getSharedBase: () => ['shared-base-list'] as const,

  getDashboardList: (baseId: string) => ['dashboard-list', baseId] as const,

  getDashboard: (dashboardId: string) => ['dashboard', dashboardId] as const,

  viewList: (tableId: string) => ['view-list', tableId] as const,

  fieldList: (tableId: string, query?: IGetFieldsQuery) => ['field-list', tableId, query] as const,

  calendarDailyCollection: (tableId: string, query: ICalendarDailyCollectionRo) =>
    ['calendar-daily-collection', tableId, query] as const,

  getPluginContextMenuPlugins: (tableId: string) =>
    ['plugin-context-menu-plugins', tableId] as const,

  getPluginContextMenuPlugin: (tableId: string, pluginInstallId: string) =>
    ['plugin-context-menu-plugin', tableId, pluginInstallId] as const,

  getPublicSetting: () => ['public-setting'] as const,
};
