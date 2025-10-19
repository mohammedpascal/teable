import { useRecords, useFields } from '@teable/sdk';
import { useContext } from 'react';
import { ChartContext } from '../components/ChartProvider';

export const useBaseQueryData = () => {
  const { options } = useContext(ChartContext);
  const records = useRecords();
  const fields = useFields();

  if (!records || !fields) {
    return null;
  }

  // Transform records and fields into the format expected by chart components
  const rows = records.map(record => {
    const row: Record<string, any> = { id: record.id };
    fields.forEach(field => {
      row[field.id] = record.fields[field.id];
    });
    return row;
  });

  const columns = fields.map(field => ({
    id: field.id,
    name: field.name,
    type: field.type,
  }));

  return {
    rows,
    columns,
  };
};