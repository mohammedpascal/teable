import { Table2 } from '@teable/icons';
import { AnchorContext, FieldProvider } from '@teable/sdk/context';
import { useTable, useTables } from '@teable/sdk/hooks';
import { useHookPermission } from '@teable/sdk/hooks/use-hook-permission';
import { Table } from '@teable/sdk/model';
import { ConfirmDialog, Selector } from '@teable/ui-lib/base';
import { Button, Tabs, TabsContent } from '@teable/ui-lib/shadcn';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { FieldSetting } from '../view/field/FieldSetting';
import { DataTable } from './data-table/DataTable';
import { TableDetail } from './TableDetail';

export const TablePicker = ({
  tableId,
  readonly,
  onChange,
}: {
  tableId: string;
  readonly: boolean;
  onChange: (tableId: string) => void;
}) => {
  const { t } = useTranslation(['table']);
  let tables = useTables() as { id: string; name: string; icon?: string }[];

  if (tableId && !tables.find((table) => table.id === tableId)) {
    tables = tables.concat({
      id: tableId!,
      name: t('table:field.editor.tableNoPermission'),
    });
  }

  return (
    <Selector
      className="w-[200px]"
      readonly={readonly}
      selectedId={tableId}
      onChange={(tableId) => onChange?.(tableId)}
      candidates={tables.map((table) => ({
        id: table.id,
        name: table.name,
        icon: table.icon || <Table2 className="size-4 shrink-0" />,
      }))}
      placeholder={t('table:field.editor.selectTable')}
    />
  );
};

const DangerZone = () => {
  const table = useTable();
  const tables = useTables();
  const router = useRouter();
  const { t } = useTranslation(['common', 'table']);
  const permission = useHookPermission();
  const canDelete = permission['table|manage'];
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { tableId: routerTableId } = router.query;

  if (!table || !canDelete) return null;

  const deleteTable = async () => {
    const tableId = table?.id;

    if (!tableId) return;

    try {
      setIsDeleting(true);
      await Table.deleteTable(tableId);

      const firstTableId = tables.find((t) => t.id !== tableId)?.id;
      if (routerTableId === tableId) {
        router.push(
          firstTableId
            ? {
                pathname: '/settings/design',
                query: { tableId: firstTableId },
              }
            : {
                pathname: '/',
                query: {},
              }
        );
      }
    } catch (error) {
      console.error('Failed to delete table:', error);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <Button
          variant="outline"
          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          onClick={() => setDeleteConfirm(true)}
        >
          <Trash2 className="mr-2 size-4" />
          {t('common:actions.delete')} {table.name} table
        </Button>
      </div>

      <ConfirmDialog
        open={deleteConfirm}
        onOpenChange={(open) => {
          if (!isDeleting) {
            setDeleteConfirm(open);
          }
        }}
        title={t('table:table.deleteConfirm', { tableName: table?.name })}
        cancelText={t('common:actions.cancel')}
        confirmText={t('common:actions.confirm')}
        confirmLoading={isDeleting}
        content={
          <div className="space-y-2 text-sm">
            <p>1. {t('table:table.deleteTip1')}</p>
          </div>
        }
        onCancel={() => {
          if (!isDeleting) {
            setDeleteConfirm(false);
          }
        }}
        onConfirm={deleteTable}
      />
    </>
  );
};

export const TableTabs = () => {
  const tables = useTables();
  const router = useRouter();
  const tableId = router.query.tableId as string;

  return (
    <Tabs
      value={tableId}
      onValueChange={(tableId) => router.push({ pathname: '/settings/design', query: { tableId } })}
      className="space-y-4"
    >
      {tables.map((table) => (
        <AnchorContext.Provider key={table.id} value={{ tableId: table.id }}>
          <TabsContent value={table.id} className="space-y-4">
            {/* Fields Table */}
            <div className="overflow-x-auto rounded-md border">
              <FieldProvider>
                <DataTable />
                <FieldSetting />
              </FieldProvider>
            </div>

            {/* Table Details */}
            <TableDetail />

            {/* Danger Zone */}
            <DangerZone />
          </TabsContent>
        </AnchorContext.Provider>
      ))}
    </Tabs>
  );
};
