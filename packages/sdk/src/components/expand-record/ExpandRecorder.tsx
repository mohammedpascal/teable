import type { IRecord } from '@teable/core';
import { deleteRecord } from '@teable/openapi';
import { sonner } from '@teable/ui-lib';
import { useEffect, type FC, type PropsWithChildren } from 'react';
import { useLocalStorage } from 'react-use';
import { LocalStorageKeys } from '../../config/local-storage-keys';
import { StandaloneViewProvider, ViewProvider } from '../../context';
import { useTranslation } from '../../context/app/i18n';
import { useBaseId, useTableId, useTablePermission } from '../../hooks';
import { Record } from '../../model';
import { syncCopy } from '../../utils';
import { ExpandRecord } from './ExpandRecord';
import type { ExpandRecordModel } from './type';

const { toast } = sonner;
const Wrap: FC<PropsWithChildren<{ tableId: string }>> = (props) => {
  const { tableId, children } = props;
  const currentTableId = useTableId();
  const baseId = useBaseId();

  if (tableId !== currentTableId) {
    return (
      <StandaloneViewProvider baseId={baseId} tableId={tableId}>
        <ViewProvider>{children}</ViewProvider>
      </StandaloneViewProvider>
    );
  }
  return <>{children}</>;
};

interface IExpandRecorderProps {
  tableId: string;
  viewId?: string;
  recordId?: string;
  recordIds?: string[];
  model?: ExpandRecordModel;
  serverData?: IRecord;
  onClose?: () => void;
  onUpdateRecordIdCallback?: (recordId: string) => void;
}

export const ExpandRecorder = (props: IExpandRecorderProps) => {
  const {
    model,
    tableId,
    recordId,
    recordIds,
    serverData,
    onClose,
    onUpdateRecordIdCallback,
    viewId,
  } = props;
  const { t } = useTranslation();
  const permission = useTablePermission();
  const editable = Boolean(permission['record|update']);
  const canRead = Boolean(permission['record|read']);
  const canDelete = Boolean(permission['record|delete']);
  const [recordHistoryVisible, setRecordHistoryVisible] = useLocalStorage<boolean>(
    LocalStorageKeys.RecordHistoryVisible,
    false
  );



  if (!recordId) {
    return <></>;
  }

  const onDuplicate = async () => {
    await Record.duplicateRecord(tableId, recordId, {
      viewId: viewId || '',
      anchorId: recordId,
      position: 'after',
    });
    toast.success(t('expandRecord.duplicateRecord'));
  };

  const updateCurrentRecordId = (recordId: string) => {
    onUpdateRecordIdCallback?.(recordId);
  };

  const onCopyUrl = () => {
    const url = window.location.href;
    syncCopy(url);
    toast.success(t('expandRecord.copy'));
  };

  const onRecordHistoryToggle = () => {
    setRecordHistoryVisible(!recordHistoryVisible);
  };


  return (
    <div id={`${tableId}-${recordId}`}>
      <Wrap tableId={tableId}>
        <ExpandRecord
          visible
          model={model}
          recordId={recordId}
          recordIds={recordIds}
          serverData={serverData?.id === recordId ? serverData : undefined}
          recordHistoryVisible={editable && recordHistoryVisible}
          onClose={onClose}
          onPrev={updateCurrentRecordId}
          onNext={updateCurrentRecordId}
          onCopyUrl={onCopyUrl}
          onDuplicate={viewId ? onDuplicate : undefined}
          onRecordHistoryToggle={onRecordHistoryToggle}
          onDelete={async () => {
            if (canDelete) await deleteRecord(tableId, recordId);
          }}
        />
      </Wrap>
    </div>
  );
};
