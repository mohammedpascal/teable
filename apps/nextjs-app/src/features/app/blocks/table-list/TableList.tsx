import { File, FileCsv, FileExcel } from '@/components/icons';
import { SUPPORTEDTYPE } from '@teable/openapi';
import { useConnection, useHookPermission } from '@/sdk';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui-lib';
import { ConfirmDialog } from '@/ui-lib/base';
import AddBoldIcon from '@/ui-lib/icons/app/add-bold.svg';
import { Input, Label, cn } from '@/ui-lib/shadcn';
import { Button } from '@/ui-lib/shadcn/ui/button';
import { useTranslation } from 'next-i18next';
import { useState, useEffect, useRef } from 'react';
import { GUIDE_CREATE_TABLE } from '@/components/Guide';
import { useSidebar } from '@/features/app/contexts/SidebarContext';
import { tableConfig } from '@/features/i18n/table.config';
import { TableImport } from '../import-table';
import { DraggableList } from './DraggableList';
import { NoDraggableList } from './NoDraggableList';
import { useAddTable } from './useAddTable';

export const TableList: React.FC = () => {
  const { connected } = useConnection();
  const {
    dialogOpen,
    setDialogOpen,
    tableName,
    setTableName,
    defaultTableName,
    createTable,
    isCreating,
    error,
    openDialog,
  } = useAddTable();
  const permission = useHookPermission();
  const { t } = useTranslation(['table', ...tableConfig.i18nNamespaces]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [fileType, setFileType] = useState<SUPPORTEDTYPE>(SUPPORTEDTYPE.CSV);
  const inputRef = useRef<HTMLInputElement>(null);
  const { leftVisible } = useSidebar();
  const isCollapsed = leftVisible === 'collapsed';
  const importFile = (type: SUPPORTEDTYPE) => {
    setDialogVisible(true);
    setFileType(type);
  };

  // Reset table name when dialog opens
  useEffect(() => {
    if (dialogOpen) {
      setTableName(defaultTableName);
    }
  }, [dialogOpen, defaultTableName, setTableName]);

  // Focus and select input text when dialog opens
  useEffect(() => {
    if (dialogOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [dialogOpen]);

  const handleCreateTable = async () => {
    await createTable(tableName);
  };

  return (
    <div className="flex w-full flex-col gap-2 overflow-auto pt-0">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <div className={cn('px-3', isCollapsed && 'flex justify-center')}>
            {permission?.['table|manage'] && (
              <Button
                variant={'outline'}
                size={'xs'}
                className={cn(`${GUIDE_CREATE_TABLE}`, isCollapsed ? 'w-auto' : 'w-full')}
              >
                <AddBoldIcon />
              </Button>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          <DropdownMenuItem onClick={openDialog} className="cursor-pointer">
            <Button variant="ghost" size="xs" className="h-4">
              <File className="size-4" />
              {t('table.operator.createBlank')}
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="px-4 text-xs font-normal text-muted-foreground">
            {t('table:import.menu.addFromOtherSource')}
          </DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => importFile(SUPPORTEDTYPE.CSV)}
          >
            <Button variant="ghost" size="xs" className="h-4">
              <FileCsv className="size-4" />
              {t('table:import.menu.csvFile')}
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => importFile(SUPPORTEDTYPE.EXCEL)}
          >
            <Button variant="ghost" size="xs" className="h-4">
              <FileExcel className="size-4" />
              {t('table:import.menu.excelFile')}
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {dialogVisible && (
        <TableImport
          fileType={fileType}
          open={dialogVisible}
          onOpenChange={(open) => setDialogVisible(open)}
        />
      )}

      <ConfirmDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!isCreating) {
            setDialogOpen(open);
          }
        }}
        cancelText={t('common:actions.cancel')}
        confirmText={t('common:actions.create')}
        confirmLoading={isCreating}
        content={
          <div className="flex flex-col space-y-2 text-sm">
            <div className="flex flex-col gap-2">
              <Label>
                {t('common:noun.table')} {t('common:name')}
              </Label>
              <Input
                ref={inputRef}
                value={tableName}
                onChange={(e) => {
                  const value = e.target.value;
                  setTableName(value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isCreating && tableName.trim()) {
                    handleCreateTable();
                  }
                }}
              />
            </div>
            {error && (
              <div className="rounded-md bg-destructive/10 p-2 text-sm text-destructive">
                {error}
              </div>
            )}
          </div>
        }
        onCancel={() => {
          if (!isCreating) {
            setDialogOpen(false);
          }
        }}
        onConfirm={handleCreateTable}
      />

      <div className={cn('overflow-y-auto', isCollapsed ? 'px-2' : 'px-3')}>
        {connected && permission?.['table|manage'] ? <DraggableList /> : <NoDraggableList />}
      </div>
    </div>
  );
};
