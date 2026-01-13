import { tableConfig } from '@/features/i18n/table.config';
import { verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ChevronDown, DraggableHandle } from '@/components/icons';
import { useHookPermission } from '@/sdk/hooks/use-hook-permission';
import {
  Button,
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui-lib/shadcn';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { VIEW_ICON_MAP } from '../constant';
import { DraggableWrapper } from './DraggableWrapper';

export const ExpandViewList = () => {
  const { t } = useTranslation(tableConfig.i18nNamespaces);
  const [open, setOpen] = useState(false);
  const [isDraggable, setIsDraggable] = useState(true);
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const tableId = (params as { tableId?: string }).tableId || '';
  const permission = useHookPermission();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="size-7 shrink-0 px-0" size="xs" variant="ghost">
          <ChevronDown className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="p-1">
        <Command>
          <CommandInput
            className="h-9"
            placeholder={t('table:view.searchView')}
            onValueChange={(value) => setIsDraggable(!value)}
          />
          <CommandEmpty>{t('common:noResult')}</CommandEmpty>
          <CommandList className="p-0.5">
            <DraggableWrapper strategy={verticalListSortingStrategy}>
              {({
                view: { id, name, type },
                setNodeRef,
                attributes,
                listeners,
                style,
                isDragging,
              }) => {
                const Icon = VIEW_ICON_MAP[type];

                return (
                  <CommandItem
                    key={id}
                    value={name}
                    ref={setNodeRef}
                    style={{
                      ...style,
                      opacity: isDragging ? '0.6' : '1',
                    }}
                    onSelect={() => {
                      navigate({
                        to: '/table/$tableId/$viewId',
                        params: { tableId, viewId: id },
                        replace: true,
                      });
                      setOpen(false);
                    }}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="ml-2 truncate text-sm">{name}</span>
                    <span className="grow" />
                    {isDraggable && permission['view|update'] && (
                      <div {...attributes} {...listeners} className="pr-1">
                        <DraggableHandle className="size-3 shrink-0" />
                      </div>
                    )}
                  </CommandItem>
                );
              }}
            </DraggableWrapper>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
