import type { IRecord } from '@teable/core';
import { useTableId, useViewId } from '@/sdk/hooks';
import { useNavigate, useRouterState, useSearch } from '@tanstack/react-router';
import { forwardRef, useCallback } from 'react';
import { ExpandRecordContainerBase } from './ExpandRecordContainerBase';
import type { IExpandRecordContainerRef } from './types';

export const ExpandRecordContainer = forwardRef<
  IExpandRecordContainerRef,
  { recordServerData?: IRecord }
>((props, forwardRef) => {
  const { recordServerData } = props;
  const navigate = useNavigate();
  const routerState = useRouterState();
  const search = useSearch({ strict: false });
  const tableId = useTableId();
  const viewId = useViewId();
  const recordId = (search.recordId as string) || '';

  const onClose = useCallback(() => {
    if (!recordId) {
      return;
    }
    const { recordId: _recordId, fromNotify: _fromNotify, ...resetQuery } = search;
    navigate({
      to: routerState.location.pathname,
      search: resetQuery as Record<string, unknown>,
      replace: true,
    });
  }, [recordId, navigate, routerState.location.pathname, search]);

  const onUpdateRecordIdCallback = useCallback(
    (recordId: string) => {
      navigate({
        to: routerState.location.pathname,
        search: { ...search, recordId },
        replace: true,
      });
    },
    [navigate, routerState.location.pathname, search]
  );

  if (!tableId) {
    return <></>;
  }

  return (
    <ExpandRecordContainerBase
      ref={forwardRef}
      tableId={tableId}
      viewId={viewId}
      recordServerData={recordServerData}
      onClose={onClose}
      onUpdateRecordIdCallback={onUpdateRecordIdCallback}
    />
  );
});

ExpandRecordContainer.displayName = 'ExpandRecordContainer';
