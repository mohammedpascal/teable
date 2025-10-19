import { ChartViewCore } from '@teable/core';
import type { IChartView } from '@teable/core';
import { updateViewOptions } from '@teable/openapi';
import { Mixin } from 'ts-mixer';
import type { AxiosResponse } from 'axios';
import { requestWrap } from '../../utils/requestWrap';
import { View } from './view';

export class ChartView extends Mixin(ChartViewCore, View) implements IChartView {
  async updateOption(option: ChartView['options']) {
    return await requestWrap(updateViewOptions)(this.tableId, this.id, { options: option });
  }
}
