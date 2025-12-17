import { type IGridViewOptions } from '@teable/core';
import { ArrowUpDown, Filter as FilterIcon, EyeOff, LayoutList, Share2 } from '@/components/icons';
import { HideFields, RowHeight, Sort, Group, ViewFilter } from '@/sdk';
import { useView } from '@/sdk/hooks/use-view';
import { cn } from '@/ui-lib/shadcn';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef } from 'react';
import { useToolbarChange } from '../../hooks/useToolbarChange';
import { ToolBarButton } from '../ToolBarButton';
import { useToolBarStore } from './useToolBarStore';
import { FieldDeleteConfirm } from './FieldDeleteConfirm';
import { GUIDE_VIEW_FILTERING, GUIDE_VIEW_SORTING, GUIDE_VIEW_GROUPING } from '@/components/Guide';
import { tableConfig } from '@/features/i18n/table.config';

export const GridViewOperators: React.FC<{ disabled?: boolean }> = (props) => {
  const { disabled } = props;
  const view = useView();
  const { onFilterChange, onRowHeightChange, onSortChange, onGroupChange } = useToolbarChange();
  const { t } = useTranslation(tableConfig.i18nNamespaces);
  const { setFilterRef, setSortRef, setGroupRef, setDeleteFieldRef } = useToolBarStore();
  const filterRef = useRef<HTMLButtonElement>(null);
  const sortRef = useRef<HTMLButtonElement>(null);
  const groupRef = useRef<HTMLButtonElement>(null);
  const deleteFieldRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setFilterRef(filterRef);
    setSortRef(sortRef);
    setGroupRef(groupRef);
    setDeleteFieldRef(deleteFieldRef);
  }, [setFilterRef, setGroupRef, setSortRef, setDeleteFieldRef]);

  if (!view) {
    return <div></div>;
  }
  return (
    <div className="@sm/toolbar:gap-1 flex">
      <HideFields>
        {(text, isActive) => (
          <ToolBarButton
            disabled={disabled}
            isActive={isActive}
            text={text}
            textClassName="@2xl/toolbar:inline"
          >
            <EyeOff className="size-4 text-sm" />
          </ToolBarButton>
        )}
      </HideFields>
      <ViewFilter filters={view?.filter || null} onChange={onFilterChange}>
        {(text, isActive) => (
          <ToolBarButton
            disabled={disabled}
            isActive={isActive}
            text={text}
            ref={filterRef}
            className={cn(
              GUIDE_VIEW_FILTERING,
              'max-w-xs',
              isActive &&
                'bg-violet-100 dark:bg-violet-600/30 hover:bg-violet-200 dark:hover:bg-violet-500/30'
            )}
            textClassName="@2xl/toolbar:inline"
          >
            <FilterIcon className="size-4 text-sm" />
          </ToolBarButton>
        )}
      </ViewFilter>
      <Sort sorts={view?.sort || null} onChange={onSortChange}>
        {(text: string, isActive) => (
          <ToolBarButton
            disabled={disabled}
            isActive={isActive}
            text={text}
            ref={sortRef}
            className={cn(
              GUIDE_VIEW_SORTING,
              'max-w-xs',
              isActive &&
                'bg-orange-100 dark:bg-orange-600/30 hover:bg-orange-200 dark:hover:bg-orange-500/30'
            )}
            textClassName="@2xl/toolbar:inline"
          >
            <ArrowUpDown className="size-4 text-sm" />
          </ToolBarButton>
        )}
      </Sort>
      <Group group={view?.group || null} onChange={onGroupChange}>
        {(text: string, isActive) => (
          <ToolBarButton
            disabled={disabled}
            isActive={isActive}
            text={text}
            ref={groupRef}
            className={cn(
              GUIDE_VIEW_GROUPING,
              'max-w-xs',
              isActive &&
                'bg-green-100 dark:bg-green-600/30 hover:bg-green-200 dark:hover:bg-green-500/30'
            )}
            textClassName="@2xl/toolbar:inline"
          >
            <LayoutList className="size-4 text-sm" />
          </ToolBarButton>
        )}
      </Group>
      {/* <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {
              // disabled doesn't trigger the tooltip, so wrap div
            }
            <div>
              <Color>
                {(text: string, isActive) => (
                  <ToolBarButton
                    disabled={true}
                    isActive={isActive}
                    text={text}
                    className={cn(
                      GUIDE_VIEW_GROUPING,
                      'max-w-xs',
                      isActive &&
                        'bg-green-100 dark:bg-green-600/30 hover:bg-green-200 dark:hover:bg-green-500/30'
                    )}
                    textClassName="@2xl/toolbar:inline"
                  >
                    <PaintBucket className="size-4 text-sm" />
                  </ToolBarButton>
                )}
              </Color>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('table:toolbar.comingSoon')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider> */}

      <RowHeight
        rowHeight={(view?.options as IGridViewOptions)?.rowHeight || null}
        onChange={onRowHeightChange}
      >
        {(_, isActive, Icon) => (
          <ToolBarButton disabled={disabled} isActive={isActive}>
            <Icon className="text-sm" />
          </ToolBarButton>
        )}
      </RowHeight>
      <FieldDeleteConfirm triggerRef={deleteFieldRef} />
    </div>
  );
};
