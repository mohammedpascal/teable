/* eslint-disable @typescript-eslint/naming-convention */
import { z } from 'zod';

export enum ActionPrefix {
  User = 'user',
  View = 'view',
  Table = 'table',
  Field = 'field',
  Record = 'record',
}

export const tableActions = ['table|read', 'table|manage', 'table|import', 'table|export'] as const;
export const tableActionSchema = z.enum(tableActions);
export type TableAction = z.infer<typeof tableActionSchema>;

export const viewActions = ['view|create', 'view|delete', 'view|update'] as const;
export const viewActionSchema = z.enum(viewActions);
export type ViewAction = z.infer<typeof viewActionSchema>;

export const recordActions = ['record|create', 'record|delete', 'record|update'] as const;
export const recordActionSchema = z.enum(recordActions);
export type RecordAction = z.infer<typeof recordActionSchema>;

export const userActions = ['user|email_read', 'user|manage'] as const;
export const userActionSchema = z.enum(userActions);
export type UserAction = z.infer<typeof userActionSchema>;

export type Action = TableAction | ViewAction | RecordAction | UserAction;

export type ActionPrefixMap = {
  [ActionPrefix.Table]: TableAction[];
  [ActionPrefix.View]: ViewAction[];
  [ActionPrefix.Record]: RecordAction[];
  [ActionPrefix.User]: UserAction[];
};
export const actionPrefixMap: ActionPrefixMap = {
  [ActionPrefix.Table]: [...tableActions],
  [ActionPrefix.View]: [...viewActions],
  [ActionPrefix.Record]: [...recordActions],
  [ActionPrefix.User]: [...userActions],
};
