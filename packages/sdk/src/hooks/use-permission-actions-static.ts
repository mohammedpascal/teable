/* eslint-disable @typescript-eslint/naming-convention */
import type { Action } from '@teable/core';
import { ActionPrefix } from '@teable/core';
import { useMemo } from 'react';
import { useTranslation } from '../context/app/i18n';
import type { TKey } from '../context/app/i18n';

const actionsI18nMap: Record<
  Action,
  {
    description: TKey;
  }
> = {
  'base|delete': {
    description: 'permission.actionDescription.baseDelete',
  },
  'base|read': {
    description: 'permission.actionDescription.baseRead',
  },
  'base|read_all': {
    description: 'permission.actionDescription.baseReadAll',
  },
  'base|update': {
    description: 'permission.actionDescription.baseUpdate',
  },
  'base|invite_email': {
    description: 'permission.actionDescription.baseInviteEmail',
  },
  'base|invite_link': {
    description: 'permission.actionDescription.baseInviteLink',
  },
  'base|table_import': {
    description: 'permission.actionDescription.tableImport',
  },
  'base|table_export': {
    description: 'permission.actionDescription.tableExport',
  },
  'base|db_connection': {
    description: 'permission.actionDescription.baseDbConnect',
  },
  'table|create': {
    description: 'permission.actionDescription.tableCreate',
  },
  'table|read': {
    description: 'permission.actionDescription.tableRead',
  },
  'table|delete': {
    description: 'permission.actionDescription.tableDelete',
  },
  'table|update': {
    description: 'permission.actionDescription.tableUpdate',
  },
  'table|import': {
    description: 'permission.actionDescription.tableImport',
  },
  'table|export': {
    description: 'permission.actionDescription.tableExport',
  },
  'view|create': {
    description: 'permission.actionDescription.viewCreate',
  },
  'view|delete': {
    description: 'permission.actionDescription.viewDelete',
  },
  'view|read': {
    description: 'permission.actionDescription.viewRead',
  },
  'view|update': {
    description: 'permission.actionDescription.viewUpdate',
  },
  'view|share': {
    description: 'permission.actionDescription.viewShare',
  },
  'record|create': {
    description: 'permission.actionDescription.recordCreate',
  },
  'record|delete': {
    description: 'permission.actionDescription.recordDelete',
  },
  'record|read': {
    description: 'permission.actionDescription.recordRead',
  },
  'record|update': {
    description: 'permission.actionDescription.recordUpdate',
  },
  'record|comment': {
    description: 'permission.actionDescription.recordUpdate',
  },
  'user|email_read': {
    description: 'permission.actionDescription.userEmailRead',
  },
  'base|query_data': {
    description: 'permission.actionDescription.baseQuery',
  },
  'instance|read': {
    description: 'permission.actionDescription.instanceRead',
  },
  'instance|update': {
    description: 'permission.actionDescription.instanceUpdate',
  },
  'enterprise|read': {
    description: 'permission.actionDescription.enterpriseRead',
  },
  'enterprise|update': {
    description: 'permission.actionDescription.enterpriseUpdate',
  },
};

const actionPrefixI18nMap: Record<ActionPrefix, { title: TKey }> = {
  [ActionPrefix.Base]: {
    title: 'noun.base',
  },
  [ActionPrefix.Table]: {
    title: 'noun.table',
  },
  [ActionPrefix.View]: {
    title: 'noun.view',
  },
  [ActionPrefix.Field]: {
    title: 'noun.field',
  },
  [ActionPrefix.Record]: {
    title: 'noun.record',
  },
  [ActionPrefix.User]: {
    title: 'noun.user',
  },
  [ActionPrefix.Instance]: {
    title: 'noun.instance',
  },
  [ActionPrefix.Enterprise]: {
    title: 'noun.enterprise',
  },
};

export const usePermissionActionsStatic = () => {
  const { t } = useTranslation();
  return useMemo(() => {
    const actionStaticMap = Object.keys(actionsI18nMap).reduce(
      (acc, key) => {
        const action = key as Action;
        acc[action] = {
          description: t(actionsI18nMap[action].description),
        };
        return acc;
      },
      {} as Record<Action, { description: string }>
    );
    const actionPrefixStaticMap = Object.values(ActionPrefix).reduce(
      (acc, prefix) => {
        acc[prefix] = {
          title: t(actionPrefixI18nMap[prefix].title),
        };
        return acc;
      },
      {} as Record<ActionPrefix, { title: string }>
    );
    return { actionStaticMap, actionPrefixStaticMap };
  }, [t]);
};
