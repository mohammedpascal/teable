/* eslint-disable @typescript-eslint/naming-convention */
import type { RecordAction, ViewAction } from '../actions';

export type ShareViewAction = ViewAction | RecordAction;

export const shareViewPermissions: Record<ShareViewAction, boolean> = {
  'view|create': false,
  'view|delete': false,
  'view|update': false,
  'view|share': false,
  'record|create': false,
  'record|comment': false,
  'record|delete': false,
  'record|update': false,
};
