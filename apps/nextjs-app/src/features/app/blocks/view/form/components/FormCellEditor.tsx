import type { ILinkCellValue, ILinkFieldOptions } from '@teable/core';
import { FieldType } from '@teable/core';
import { CellEditor, LinkDisplayType, LinkEditor } from '@teable/sdk/components';
import type { Field } from '@teable/sdk/model';

interface IFormCellEditor {
  className?: string;
  cellValue?: unknown;
  field: Field;
  onChange?: (cellValue?: unknown) => void;
}

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
