import type { IFieldRo, IHttpError } from '@teable/core';
import { Colors, FieldType, getUniqName, NumberFormattingType, ViewType } from '@teable/core';
import { useTables } from '@/sdk/hooks';
import { Table } from '@/sdk/model';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useCallback, useMemo, useState } from 'react';
import { convertTableNameToDbTableName } from './utils';

const useDefaultFields = (): IFieldRo[] => {
  const { t } = useTranslation('table');
  return [
    { name: t('field.default.singleLineText.title'), type: FieldType.SingleLineText },
    {
      name: t('field.default.number.title'),
      type: FieldType.Number,
      options: {
        formatting: {
          precision: 0,
          type: NumberFormattingType.Decimal,
        },
      },
    },
    {
      name: t('field.default.singleSelect.title'),
      type: FieldType.SingleSelect,
      options: {
        choices: [
          {
            name: t('field.default.singleSelect.options.todo'),
            color: Colors.OrangeDark1,
          },
          {
            name: t('field.default.singleSelect.options.inProgress'),
            color: Colors.CyanBright,
          },
          {
            name: t('field.default.singleSelect.options.done'),
            color: Colors.Teal,
          },
        ],
      },
    },
  ];
};

export function useAddTable() {
  const tables = useTables();
  const router = useRouter();
  const { t } = useTranslation('table');
  const fieldRos = useDefaultFields();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tableName, setTableName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultTableName = useMemo(
    () =>
      getUniqName(
        t('table.newTableLabel'),
        tables.map((table) => table.name)
      ),
    [t, tables]
  );

  const createTable = useCallback(
    async (name: string) => {
      if (!name || name.trim() === '') {
        setError('Table name cannot be empty');
        return;
      }

      setIsCreating(true);
      setError(null);

      try {
        const dbTableName = convertTableNameToDbTableName(name);
        const tableData = (
          await Table.createTable({
            name: name.trim(),
            dbTableName,
            views: [{ name: t('view.category.table'), type: ViewType.Grid }],
            fields: fieldRos,
          })
        ).data;
        const tableId = tableData.id;
        const viewId = tableData.defaultViewId;
        setDialogOpen(false);
        setTableName('');
        router.push(
          {
            pathname: '/table/[tableId]/[viewId]',
            query: { tableId, viewId },
          },
          undefined,
          {
            shallow: Boolean(router.query.viewId),
          }
        );
      } catch (err: unknown) {
        const error = err as IHttpError;
        setError(error.message || 'Failed to create table. Please try again.');
      } finally {
        setIsCreating(false);
      }
    },
    [t, fieldRos, router]
  );

  const openDialog = useCallback(() => {
    setTableName(defaultTableName);
    setError(null);
    setDialogOpen(true);
  }, [defaultTableName]);

  return {
    dialogOpen,
    setDialogOpen,
    tableName,
    setTableName,
    defaultTableName,
    createTable,
    isCreating,
    error,
    openDialog,
  };
}
