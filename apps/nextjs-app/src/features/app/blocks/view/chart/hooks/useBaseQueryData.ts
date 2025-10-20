import { useRecords, useFields } from '@teable/sdk';

export const useBaseQueryData = () => {
  const recordsData = useRecords();
  const fields = useFields();

  if (!recordsData || !fields) {
    return null;
  }

  // Extract records array from the records data
  const records = recordsData.records || [];

  // Transform records and fields into the format expected by chart components
  const rows = records.map((record) => {
    const row: Record<string, unknown> = { id: record.id };
    fields.forEach((field) => {
      row[field.id] = record.fields[field.id];
    });
    return row;
  });

  const columns = fields.map((field) => ({
    id: field.id,
    name: field.name,
    type: field.type,
  }));

  return {
    rows,
    columns,
  };
};
