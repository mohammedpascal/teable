import type { IRecord } from '@teable/core';
import { ExpandRecorder, ExpandRecordModel } from '@/sdk';
import { useSearch } from '@tanstack/react-router';
import { forwardRef, useImperativeHandle, useState } from 'react';
import type { IExpandRecordContainerRef } from './types';

export const ExpandRecordContainerBase = forwardRef<
  IExpandRecordContainerRef,
  {
    tableId: string;
    viewId?: string;
    recordServerData?: IRecord;
    onClose?: () => void;
    onUpdateRecordIdCallback?: (recordId: string) => void;
  }
>((props, forwardRef) => {
  const { tableId, viewId, recordServerData, onClose, onUpdateRecordIdCallback } = props;
  const search = useSearch({ strict: false });
  const recordId = (search.recordId as string) || '';
  const [recordIds, setRecordIds] = useState<string[]>();

  useImperativeHandle(forwardRef, () => ({
    updateRecordIds: setRecordIds,
  }));

  return (
    <ExpandRecorder
      tableId={tableId}
      viewId={viewId}
      recordId={recordId}
      recordIds={recordIds}
      serverData={recordServerData}
      model={ExpandRecordModel.Modal}
      onClose={onClose}
      onUpdateRecordIdCallback={onUpdateRecordIdCallback}
    />
  );
});

ExpandRecordContainerBase.displayName = 'ExpandRecordContainerBase';
