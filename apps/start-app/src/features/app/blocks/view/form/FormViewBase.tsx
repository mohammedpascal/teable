import { FieldKeyType } from '@teable/core';
import { useIsMobile, useTableId, useViewId } from '@/sdk/hooks';
import { useHookPermission } from '@/sdk/hooks/use-hook-permission';
import { Record as RecordSdk } from '@/sdk/model';
import { FormMode, useFormModeStore } from '../tool-bar/store';
import { FormEditor, FormPreviewer } from './components';
import { generateUniqLocalKey } from './util';

export const FormViewBase = () => {
  const tableId = useTableId();
  const activeViewId = useViewId();
  const { modeMap } = useFormModeStore();
  const isMobile = useIsMobile();
  const permission = useHookPermission();

  const modeKey = generateUniqLocalKey(tableId, activeViewId);
  const mode = modeMap[modeKey] ?? FormMode.Edit;
  const isEditMode = permission['view|update'] && mode === FormMode.Edit;

  const submitForm = async (fields: Record<string, unknown>) => {
    if (!tableId) return;
    await RecordSdk.createRecords(tableId, {
      fieldKeyType: FieldKeyType.Id,
      records: [
        {
          fields,
        },
      ],
    });
  };

  return (
    <div className="flex size-full">
      {isEditMode && !isMobile ? <FormEditor /> : <FormPreviewer submit={submitForm} />}
    </div>
  );
};
