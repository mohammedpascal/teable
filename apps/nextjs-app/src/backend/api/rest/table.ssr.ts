import type { IFieldVo, IGetFieldsQuery, IRecord, IViewVo } from '@teable/core';
import { FieldKeyType } from '@teable/core';
import type {
  IGetBaseVo,
  IGetDefaultViewIdVo,
  IUpdateNotifyStatusRo,
  ITableFullVo,
  ITableListVo,
  ISettingVo,
  IUserMeVo,
  IRecordsVo,
  ITableVo,
  IGroupPointsRo,
  IGroupPointsVo,
  IPublicSettingVo,
  IGetBasePermissionVo,
  ITablePermissionVo,
} from '@teable/openapi';
import {
  GET_BASE,
  GET_BASE_ALL,
  GET_DEFAULT_VIEW_ID,
  GET_FIELD_LIST,
  GET_GROUP_POINTS,
  GET_PUBLIC_SETTING,
  GET_RECORDS_URL,
  GET_RECORD_URL,
  GET_SETTING,
  GET_TABLE,
  GET_TABLE_LIST,
  GET_VIEW_LIST,
  UPDATE_NOTIFICATION_STATUS,
  USER_ME,
  GET_BASE_PERMISSION,
  GET_TABLE_PERMISSION,
  urlBuilder,
} from '@teable/openapi';
import type { AxiosInstance } from 'axios';
import { getAxios } from './axios';

export class SsrApi {
  axios: AxiosInstance;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {
    this.axios = getAxios();
  }

  async getTable(
    baseId: string,
    tableId: string,
    viewId?: string
  ): Promise<ITableFullVo & { extra: IRecordsVo['extra'] }> {
    const fields = await this.getFields(tableId, { viewId });
    const views = await this.axios
      .get<IViewVo[]>(urlBuilder(GET_VIEW_LIST, { tableId }))
      .then(({ data }) => data);
    const table = await this.axios
      .get<ITableVo>(urlBuilder(GET_TABLE, { baseId, tableId }), {
        params: {
          includeContent: true,
          viewId,
          fieldKeyType: FieldKeyType.Id,
        },
      })
      .then(({ data }) => data);

    const currentView = views.find((view) => view.id === viewId);
    const { records, extra } = await this.axios
      .get<IRecordsVo>(urlBuilder(GET_RECORDS_URL, { baseId, tableId }), {
        params: {
          viewId,
          fieldKeyType: FieldKeyType.Id,
          groupBy: currentView?.group ? JSON.stringify(currentView.group) : undefined,
        },
      })
      .then(({ data }) => data);

    return {
      ...table,
      records,
      views,
      fields,
      extra,
    };
  }

  async getFields(tableId: string, query?: IGetFieldsQuery) {
    return this.axios
      .get<IFieldVo[]>(urlBuilder(GET_FIELD_LIST, { tableId }), { params: query })
      .then(({ data }) => data);
  }

  async getTables(baseId: string) {
    return this.axios
      .get<ITableListVo>(urlBuilder(GET_TABLE_LIST, { baseId }))
      .then(({ data }) => data);
  }

  async getDefaultViewId(baseId: string, tableId: string) {
    return this.axios
      .get<IGetDefaultViewIdVo>(urlBuilder(GET_DEFAULT_VIEW_ID, { baseId, tableId }))
      .then(({ data }) => data);
  }

  async getRecord(tableId: string, recordId: string) {
    return this.axios
      .get<IRecord>(urlBuilder(GET_RECORD_URL, { tableId, recordId }), {
        params: { fieldKeyType: FieldKeyType.Id },
      })
      .then(({ data }) => data);
  }

  async getBaseById(baseId: string) {
    return await this.axios
      .get<IGetBaseVo>(urlBuilder(GET_BASE, { baseId }))
      .then(({ data }) => data);
  }

  async getBaseList() {
    return await this.axios.get<IGetBaseVo[]>(GET_BASE_ALL).then(({ data }) => data);
  }

  async getBasePermission(baseId: string) {
    return await this.axios
      .get<IGetBasePermissionVo>(urlBuilder(GET_BASE_PERMISSION, { baseId }))
      .then((res) => res.data);
  }

  async getTablePermission(baseId: string, tableId: string) {
    return await this.axios
      .get<ITablePermissionVo>(urlBuilder(GET_TABLE_PERMISSION, { baseId, tableId }))
      .then((res) => res.data);
  }

  async updateNotificationStatus(notificationId: string, data: IUpdateNotifyStatusRo) {
    return this.axios
      .patch<void>(urlBuilder(UPDATE_NOTIFICATION_STATUS, { notificationId }), data)
      .then(({ data }) => data);
  }

  async getSetting() {
    return this.axios.get<ISettingVo>(GET_SETTING).then(({ data }) => data);
  }

  async getPublicSetting() {
    return this.axios.get<IPublicSettingVo>(GET_PUBLIC_SETTING).then(({ data }) => data);
  }

  async getUserMe() {
    return this.axios.get<IUserMeVo>(USER_ME).then(({ data }) => data);
  }

  async getGroupPoints(tableId: string, query: IGroupPointsRo) {
    return this.axios
      .get<IGroupPointsVo>(urlBuilder(GET_GROUP_POINTS, { tableId }), {
        params: {
          ...query,
          filter: JSON.stringify(query?.filter),
          groupBy: JSON.stringify(query?.groupBy),
        },
      })
      .then(({ data }) => data);
  }
}
