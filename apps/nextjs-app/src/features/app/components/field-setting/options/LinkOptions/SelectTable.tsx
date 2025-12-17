import { ArrowUpRight, Table2 } from '@/components/icons';
import { AnchorContext, TableProvider } from '@/sdk/context';
import { useTableId, useTables } from '@/sdk/hooks';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Selector } from '@/components/Selector';
import { tableConfig } from '@/features/i18n/table.config';

interface ISelectTableProps {
  tableId?: string;
  onChange?: (tableId?: string) => void;
}

export const SelectTable = ({ tableId, onChange }: ISelectTableProps) => {
  const { t } = useTranslation(tableConfig.i18nNamespaces);
  const selfTableId = useTableId();

  return (
    <div className="flex flex-col gap-1">
      <AnchorContext.Provider value={{ tableId }}>
        <div className="neutral-content label-text flex h-7 items-center justify-between">
          <span className="flex items-center gap-1">
            {t('table:field.editor.linkTable')}
            {tableId && (
              <Link href={`/table/${tableId}`} target="_blank">
                <ArrowUpRight className="size-4 shrink-0" />
              </Link>
            )}
          </span>
        </div>
        <TableProvider>
          <TablePicker
            tableId={tableId}
            selfTableId={selfTableId}
            onChange={(tableId) => onChange?.(tableId)}
          />
        </TableProvider>
      </AnchorContext.Provider>
    </div>
  );
};

interface ITablePickerProps {
  tableId: string | undefined;
  readonly?: boolean;
  selfTableId?: string;
  onChange?: (tableId: string) => void;
}

const TablePicker = ({ tableId, selfTableId, readonly, onChange }: ITablePickerProps) => {
  const { t } = useTranslation(tableConfig.i18nNamespaces);
  let tables = useTables() as { id: string; name: string; icon?: string }[];

  if (tableId && !tables.find((table) => table.id === tableId)) {
    tables = tables.concat({
      id: tableId!,
      name: t('table:field.editor.tableNoPermission'),
    });
  }

  return (
    <Selector
      className="w-full"
      readonly={readonly}
      selectedId={tableId}
      onChange={(tableId) => onChange?.(tableId)}
      candidates={tables.map((table) => ({
        id: table.id,
        name: table.name + (selfTableId === table.id ? ` (${t('table:field.editor.self')})` : ''),
        icon: table.icon || <Table2 className="size-4 shrink-0" />,
      }))}
      placeholder={t('table:field.editor.selectTable')}
    />
  );
};
