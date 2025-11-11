import type { RecordAction, TableAction, UserAction, ViewAction } from './actions';

export const OAUTH_ACTIONS: (TableAction | ViewAction | RecordAction | UserAction)[] =
  [
    'table|manage',
    'table|export',
    'table|import',
    'view|create',
    'view|delete',
    'view|read',
    'view|update',
    'record|comment',
    'record|create',
    'record|delete',
    'record|read',
    'record|update',
    'user|email_read',
  ];
