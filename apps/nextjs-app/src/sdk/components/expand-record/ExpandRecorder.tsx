import type { IRecord } from '@teable/core';
import { deleteRecord } from '@teable/openapi';
import { sonner } from '@/ui-lib';
import { type FC, type PropsWithChildren } from 'react';
import { StandaloneViewProvider, ViewProvider } from '../../context';
import { useTranslation } from '../../context/app/i18n';
import { useTableId } from '../../hooks';
import { useHookPermission } from '../../hooks/use-hook-permission';
import { Record } from '../../model';
import { syncCopy } from '../../utils';
import { ExpandRecord } from './ExpandRecord';
import type { ExpandRecordModel } from './type';

const { toast } = sonner;
const Wrap: FC<PropsWithChildren<{ tableId: string }>> = (props) => {
  const { tableId, children } = props;
  const currentTableId = useTableId();

  if (tableId !== currentTableId) {
    return (
      <StandaloneViewProvider tableId={tableId}>
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
  const permission = useHookPermission();
  const canDelete = Boolean(permission['record|delete']);

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

  return (
    <div id={`${tableId}-${recordId}`}>
      <Wrap tableId={tableId}>
        <ExpandRecord
          visible
          model={model}
          recordId={recordId}
          recordIds={recordIds}
          serverData={serverData?.id === recordId ? serverData : undefined}
          onClose={onClose}
          onPrev={updateCurrentRecordId}
          onNext={updateCurrentRecordId}
          onCopyUrl={onCopyUrl}
          onDuplicate={viewId ? onDuplicate : undefined}
          onDelete={async () => {
            if (canDelete) await deleteRecord(tableId, recordId);
          }}
        />
      </Wrap>
    </div>
  );
};
