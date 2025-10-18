export enum PageType {
  Chart = 'chart',
  View = 'view',
}

export interface IPageParams {
  baseId?: string;
  tableId?: string;
  viewId?: string;
  pluginId?: string;
  pluginInstallId?: string;
  positionId?: string;
  positionType?: string;
  pluginUrl?: string;
  lang?: string;
  shareId?: string;
  theme?: string;
}
