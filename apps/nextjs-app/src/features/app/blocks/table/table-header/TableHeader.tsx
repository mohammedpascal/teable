import { Code2, MoreHorizontal, Settings } from '@teable/icons';
import { useTable, useTableId } from '@teable/sdk/hooks';
import {
  Button,
  cn,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  ScrollBar,
} from '@teable/ui-lib/shadcn';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Fragment, useState } from 'react';
import { tableConfig } from '@/features/i18n/table.config';
import { TableOperation } from '../../table-list/TableOperation';
import { ExpandViewList } from '../../view/list/ExpandViewList';
import { ViewList } from '../../view/list/ViewList';

import { AddView } from './AddView';
import { OnlineUsers } from './OnlineUsers';
import { TableInfo } from './TableInfo';

const RightList = ({ className }: { className?: string }) => {
  const table = useTable();
  const [open, setOpen] = useState(false);

  return (
    <div className={cn('flex', className)}>
      <div className="flex items-center gap-2">
        <OnlineUsers />
        <Button onClick={() => setOpen(true)} variant="ghost" size="xs" className={cn('flex')}>
          <MoreHorizontal className="size-4" />
        </Button>
      </div>

      {table && (
        <TableOperation
          open={open}
          table={table}
          setOpen={setOpen}
          className="size-4 shrink-0 sm:opacity-0 sm:group-hover:opacity-100"
        />
      )}
    </div>
  );
};

const RightMenu = ({ className }: { className?: string }) => {
  const tableId = useTableId();
  const { t } = useTranslation(tableConfig.i18nNamespaces);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'ghost'}
          size={'xs'}
          className={cn('font-normal shrink-0 truncate', className)}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="w-32 p-0">
        <div className="flex flex-col">
          <Button asChild variant="ghost" size="xs" className="flex justify-start">
            <Link
              href={{
                pathname: '/settings/query-builder',
                query: { tableId },
              }}
              target="_blank"
            >
              <Code2 className="size-4" /> {t('table:toolbar.others.api.restfulApi')}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="xs" className="flex justify-start">
            <Link
              href={{
                pathname: '/design',
                query: { tableId },
              }}
              title={t('table:table.design')}
            >
              <Settings className="size-4" /> {t('table:table.design')}
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const TableHeader: React.FC = () => {
  return (
    <Fragment>
      <div
        className={cn(
          'flex h-[42px] shrink-0 flex-row items-center gap-2 px-4 @container/view-header'
        )}
      >
        <TableInfo className="shrink-0 grow-0" />
        <ExpandViewList />
        <ScrollArea className="h-[42px]">
          <div className="flex h-[42px] items-center gap-2">
            <ViewList />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <AddView />
        <div className="grow basis-0"></div>
        <RightList className="hidden gap-2 @md/view-header:flex" />
        <RightMenu className="flex @md/view-header:hidden" />
      </div>
    </Fragment>
  );
};
