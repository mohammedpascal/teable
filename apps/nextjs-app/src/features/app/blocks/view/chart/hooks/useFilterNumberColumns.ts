import { FieldType } from '@teable/core';
import { useFields } from '@teable/sdk';
import { useMemo } from 'react';

export const useFilterNumberColumns = () => {
  const fields = useFields();

  return useMemo(() => {
    if (!fields) return [];

    return fields.filter((field) => {
      // Filter for number-like fields that can be used in charts
      const fieldType = field.type as FieldType;
      return (
        fieldType === FieldType.Number ||
        fieldType === FieldType.Rating ||
        fieldType === FieldType.Count ||
        fieldType === FieldType.Duration ||
        fieldType === FieldType.AutoNumber
      );
    });
  }, [fields]);
};
