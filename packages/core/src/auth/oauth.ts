import type { RecordAction, TableAction, UserAction, ViewAction } from './actions';

export const OAUTH_ACTIONS: (TableAction | ViewAction | RecordAction | UserAction)[] =
  [
    'table|read',
    'table|manage',
    'table|export',
    'table|import',
    'view|create',
    'view|delete',
    'view|update',
    'record|comment',
    'record|create',
    'record|delete',
    'record|update',
    'user|email_read',
  ];
