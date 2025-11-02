import { Table2 } from '@teable/icons';
import { AnchorContext, FieldProvider, TablePermissionProvider } from '@teable/sdk/context';
import { useBase, useTable, useTablePermission, useTables } from '@teable/sdk/hooks';
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
  const base = useBase();
  const tables = useTables();
  const router = useRouter();
  const { t } = useTranslation(['common', 'table']);
  const permission = useTablePermission();
  const canDelete = permission['table|delete'];
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { baseId, tableId: routerTableId } = router.query;

  if (!table || !canDelete) return null;

  const deleteTable = async () => {
    const tableId = table?.id;

    if (!tableId) return;

    try {
      setIsDeleting(true);
      await base.deleteTable(tableId);

      const firstTableId = tables.find((t) => t.id !== tableId)?.id;
      if (routerTableId === tableId) {
        router.push(
          firstTableId
            ? {
                pathname: '/base/[baseId]/design',
                query: { baseId, tableId: firstTableId },
              }
            : {
                pathname: '/base/[baseId]',
                query: { baseId },
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
      <Button variant="destructive" onClick={() => setDeleteConfirm(true)}>
        <Trash2 className="mr-2 size-4" />
        {t('common:actions.delete')}
      </Button>

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
  const baseId = router.query.baseId as string;

  return (
    <Tabs
      value={tableId}
      onValueChange={(tableId) =>
        router.push({ pathname: router.pathname, query: { ...router.query, tableId } })
      }
      className="space-y-4"
    >
      {tables.map((table) => (
        <AnchorContext.Provider key={table.id} value={{ baseId, tableId: table.id }}>
          <TablePermissionProvider baseId={baseId}>
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
          </TablePermissionProvider>
        </AnchorContext.Provider>
      ))}
    </Tabs>
  );
};
