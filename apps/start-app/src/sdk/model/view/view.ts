/* eslint-disable @typescript-eslint/naming-convention */
import type { IFilter, ISort, IViewVo, IColumnMetaRo, IManualSortRo, IGroup } from '@teable/core';
import { ViewCore } from '@teable/core';
import type { IUpdateOrderRo } from '@teable/openapi';
import {
  createView,
  deleteView,
  getViewList,
  updateViewColumnMeta,
  manualSortView,
  updateViewFilter,
  updateViewSort,
  updateViewGroup,
  updateViewOrder,
  updateViewName,
  updateViewDescription,
  updateViewLocked,
} from '@teable/openapi';
import type { AxiosResponse } from 'axios';
import type { Doc } from 'sharedb/lib/client';
import { requestWrap } from '../../utils/requestWrap';

export abstract class View extends ViewCore {
  protected doc!: Doc<IViewVo>;

  tableId!: string;

  static getViews = requestWrap(getViewList);

  static createView = requestWrap(createView);

  static deleteView = requestWrap(deleteView);

  abstract updateOption(
    option: object // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<AxiosResponse<void, any>> | void;

  async manualSort(sortRo: IManualSortRo) {
    return await requestWrap(manualSortView)(this.tableId, this.id, sortRo);
  }

  async updateColumnMeta(columnMetaRo: IColumnMetaRo) {
    return await requestWrap(updateViewColumnMeta)(this.tableId, this.id, columnMetaRo);
  }

  async updateFilter(filter: IFilter) {
    return await requestWrap(updateViewFilter)(this.tableId, this.id, { filter });
  }

  async updateSort(sort: ISort) {
    return await requestWrap(updateViewSort)(this.tableId, this.id, { sort });
  }

  async updateGroup(group: IGroup) {
    return await requestWrap(updateViewGroup)(this.tableId, this.id, { group });
  }

  async updateOrder(orderRo: IUpdateOrderRo) {
    return await requestWrap(updateViewOrder)(this.tableId, this.id, orderRo);
  }

  async updateName(name: string) {
    return await requestWrap(updateViewName)(this.tableId, this.id, { name });
  }

  async updateDescription(description: string) {
    return await requestWrap(updateViewDescription)(this.tableId, this.id, { description });
  }

  async updateLocked(isLocked: boolean) {
    return await requestWrap(updateViewLocked)(this.tableId, this.id, { isLocked });
  }
}
