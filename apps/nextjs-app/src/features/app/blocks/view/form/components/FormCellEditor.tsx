import type {
  IAttachmentCellValue,
  ILinkCellValue,
  ILinkFieldOptions,
  IUserCellValue,
} from '@teable/core';
import { FieldType } from '@teable/core';
import { AttachmentManager, CellEditor, LinkDisplayType, LinkEditor } from '@teable/sdk/components';
import { UploadAttachment } from '@teable/sdk/components/editor/attachment/upload-attachment/UploadAttachment';
import type { Field, LinkField, UserField } from '@teable/sdk/model';
import { cn } from '@teable/ui-lib/shadcn';

interface IFormCellEditor {
  className?: string;
  cellValue?: unknown;
  field: Field;
  onChange?: (cellValue?: unknown) => void;
}

const attachmentManager = new AttachmentManager(2);

export const FormCellEditor = (props: IFormCellEditor) => {
  const { cellValue, field, className, onChange } = props;
  const { id, type, options } = field;
  if (type === FieldType.Link) {
    return (
      <LinkEditor
        className={className}
        cellValue={cellValue as ILinkCellValue | ILinkCellValue[]}
        options={options as ILinkFieldOptions}
        onChange={onChange}
        fieldId={id}
        displayType={LinkDisplayType.List}
      />
    );
  }

  return (
    <CellEditor cellValue={cellValue} field={field} onChange={onChange} className={className} />
  );
};
