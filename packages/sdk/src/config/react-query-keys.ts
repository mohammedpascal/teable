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
  type ListBaseCollaboratorRo,
  type ICalendarDailyCollectionRo,
  type IGetDepartmentListRo,
  type IGetDepartmentUserRo,
} from '@teable/openapi';

export const ReactQueryKeys = {
  base: (baseId: string) => ['base', baseId] as const,

  baseAll: () => ['base-all'] as const,

  baseList: () => ['base-list'] as const,


  tableList: (baseId: string) => ['table-list', baseId] as const,

  recordCommentCount: (tableId: string, recordId: string) =>
    ['record-comment-count', tableId, recordId] as const,

  commentList: (tableId: string, recordId: string) => ['comment-list', tableId, recordId] as const,

  commentCount: (tableId: string, query?: IGetRecordsRo) =>
    ['comment-count', tableId, query] as const,

  commentDetail: (tableId: string, recordId: string, commentId: string) =>
    ['comment-detail', tableId, recordId, commentId] as const,

  commentAttachment: (tableId: string, recordId: string, path: string) =>
    ['comment-attachment', tableId, recordId, path] as const,

  commentSubscribeStatus: (tableId: string, recordId: string) =>
    ['comment-notify-status', tableId, recordId] as const,

  subscriptionSummary: (baseId: string) => ['subscription-summary', baseId] as const,

  subscriptionSummaryList: () => ['subscription-summary'] as const,

  baseCollaboratorList: (baseId: string, options?: ListBaseCollaboratorRo) =>
    options
      ? (['base-collaborator-list', baseId, options] as const)
      : (['base-collaborator-list', baseId] as const),

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

  getSpaceTrash: (resourceType: ResourceType) => ['space-trash', resourceType] as const,

  getTrashItems: (resourceId: string) => ['trash-items', resourceId] as const,

  getDashboardList: (baseId: string) => ['dashboard-list', baseId] as const,

  getDashboard: (dashboardId: string) => ['dashboard', dashboardId] as const,

  viewList: (tableId: string) => ['view-list', tableId] as const,

  fieldList: (tableId: string, query?: IGetFieldsQuery) => ['field-list', tableId, query] as const,

  calendarDailyCollection: (tableId: string, query: ICalendarDailyCollectionRo) =>
    ['calendar-daily-collection', tableId, query] as const,

  getDepartmentList: (ro?: IGetDepartmentListRo) => ['department-list', ro] as const,

  getDepartmentUsers: (ro?: IGetDepartmentUserRo) => ['department-users', ro] as const,

  getOrganizationMe: () => ['organization-me'] as const,

  getIntegrationList: (spaceId: string) => ['integration-list', spaceId] as const,

  getPluginPanelList: (tableId: string) => ['plugin-list', tableId] as const,

  getPluginPanel: (tableId: string, panelId: string) => ['plugin', tableId, panelId] as const,

  getPluginContextMenuPlugins: (tableId: string) =>
    ['plugin-context-menu-plugins', tableId] as const,

  getPluginContextMenuPlugin: (tableId: string, pluginInstallId: string) =>
    ['plugin-context-menu-plugin', tableId, pluginInstallId] as const,

  getPublicSetting: () => ['public-setting'] as const,
};
