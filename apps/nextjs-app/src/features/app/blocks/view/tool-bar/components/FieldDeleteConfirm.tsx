import type { RefObject } from 'react';
import { deleteFields } from '@teable/openapi';
import { useTableId } from '@teable/sdk';
import { Button, Popover, PopoverContent, PopoverTrigger } from '@teable/ui-lib/shadcn';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { tableConfig } from '@/features/i18n/table.config';
import { useToolBarStore } from './useToolBarStore';

interface IFieldDeleteConfirmProps {
  triggerRef: RefObject<HTMLButtonElement>;
}

export const FieldDeleteConfirm = ({ triggerRef }: IFieldDeleteConfirmProps) => {
  const { t } = useTranslation(tableConfig.i18nNamespaces);
  const tableId = useTableId();
  const { pendingDeleteFields, setPendingDeleteFields } = useToolBarStore();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Open popover when pendingDeleteFields is set
  useEffect(() => {
    if (pendingDeleteFields && pendingDeleteFields.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [pendingDeleteFields]);

  const handleCancel = () => {
    setPendingDeleteFields(null);
    setOpen(false);
  };

  const handleConfirm = async () => {
    if (!tableId || !pendingDeleteFields || pendingDeleteFields.length === 0) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteFields(
        tableId,
        pendingDeleteFields.map((f) => f.id)
      );
      setPendingDeleteFields(null);
      setOpen(false);
    } catch (error) {
      console.error('Failed to delete fields:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const fieldNames = pendingDeleteFields?.map((f) => f.name).join(', ') || '';
  const isMultiple = (pendingDeleteFields?.length || 0) > 1;

  return (
    <Popover open={open} onOpenChange={(newOpen) => {
      if (!newOpen && !isDeleting) {
        handleCancel();
      }
    }}>
      <PopoverTrigger asChild>
        <button
          ref={triggerRef}
          className="size-0 opacity-0 pointer-events-none"
          aria-hidden="true"
        />
      </PopoverTrigger>
      {pendingDeleteFields && pendingDeleteFields.length > 0 && (
        <PopoverContent
          side="bottom"
          align="start"
          className="flex w-min min-w-[544px] max-w-screen-md flex-col overflow-hidden p-0"
          onPointerDownOutside={(e) => {
            if (!isDeleting) {
              e.preventDefault();
            }
          }}
        >
          <div className="px-4 py-3 border-b">
            <div className="text-sm font-medium">
              {isMultiple
                ? t('table:menu.deleteAllSelectedFields')
                : t('table:menu.deleteField')}
            </div>
          </div>
          <div className="px-4 py-3">
            <div className="text-sm text-muted-foreground mb-4">
              {isMultiple
                ? `Are you sure you want to delete ${pendingDeleteFields.length} field${pendingDeleteFields.length > 1 ? 's' : ''}? This action cannot be undone.`
                : `Are you sure you want to delete "${fieldNames}"? This action cannot be undone.`}
            </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isDeleting}
            >
              {t('common:actions.cancel')}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? t('table:notification.deleting') : t('common:actions.delete')}
            </Button>
          </div>
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
};

