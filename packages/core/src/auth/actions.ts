/* eslint-disable @typescript-eslint/naming-convention */
import { z } from 'zod';

export enum ActionPrefix {
  Base = 'base',
  Table = 'table',
  View = 'view',
  Record = 'record',
  Field = 'field',
  User = 'user',
  Instance = 'instance',
  Enterprise = 'enterprise',
}

export const baseActions = [
  'base|delete',
  'base|read',
  'base|read_all',
  'base|update',
  'base|invite_email',
  'base|invite_link',
  'base|table_import',
  'base|table_export',
  'base|db_connection',
  'base|query_data',
] as const;
export const baseActionSchema = z.enum(baseActions);
export type BaseAction = z.infer<typeof baseActionSchema>;

export const tableActions = [
  'table|read',
  'table|manage',
  'table|import',
  'table|export',
] as const;
export const tableActionSchema = z.enum(tableActions);
export type TableAction = z.infer<typeof tableActionSchema>;

export const viewActions = [
  'view|create',
  'view|delete',
  'view|update',
  'view|share',
] as const;
export const viewActionSchema = z.enum(viewActions);
export type ViewAction = z.infer<typeof viewActionSchema>;

export const recordActions = [
  'record|create',
  'record|delete',
  'record|update',
  'record|comment',
] as const;
export const recordActionSchema = z.enum(recordActions);
export type RecordAction = z.infer<typeof recordActionSchema>;

export const userActions = ['user|email_read'] as const;
export const userActionSchema = z.enum(userActions);
export type UserAction = z.infer<typeof userActionSchema>;

export const instanceActions = ['instance|read', 'instance|update'] as const;
export const instanceActionSchema = z.enum(instanceActions);
export type InstanceAction = z.infer<typeof instanceActionSchema>;

export const enterpriseActions = ['enterprise|read', 'enterprise|update'] as const;
export const enterpriseActionSchema = z.enum(enterpriseActions);
export type EnterpriseAction = z.infer<typeof enterpriseActionSchema>;

export type Action =
  | BaseAction
  | TableAction
  | ViewAction
  | RecordAction
  | UserAction
  | InstanceAction
  | EnterpriseAction;

export type ActionPrefixMap = {
  [ActionPrefix.Base]: BaseAction[];
  [ActionPrefix.Table]: TableAction[];
  [ActionPrefix.View]: ViewAction[];
  [ActionPrefix.Record]: RecordAction[];
  [ActionPrefix.User]: UserAction[];
  [ActionPrefix.Instance]: InstanceAction[];
  [ActionPrefix.Enterprise]: EnterpriseAction[];
};
export const actionPrefixMap: ActionPrefixMap = {
  [ActionPrefix.Base]: [...baseActions],
  [ActionPrefix.Table]: [...tableActions],
  [ActionPrefix.View]: [...viewActions],
  [ActionPrefix.Record]: [...recordActions],
  [ActionPrefix.User]: [...userActions],
  [ActionPrefix.Instance]: [...instanceActions],
  [ActionPrefix.Enterprise]: [...enterpriseActions],
};
