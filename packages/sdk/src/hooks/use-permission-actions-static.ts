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
  'table|read': {
    description: 'permission.actionDescription.tableRead',
  },
  'table|manage': {
    description: 'permission.actionDescription.tableManage',
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
  'view|update': {
    description: 'permission.actionDescription.viewUpdate',
  },
  'record|create': {
    description: 'permission.actionDescription.recordCreate',
  },
  'record|delete': {
    description: 'permission.actionDescription.recordDelete',
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
  'user|manage': {
    description: 'permission.actionDescription.userManage',
  },
};

const actionPrefixI18nMap: Record<ActionPrefix, { title: TKey }> = {
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
