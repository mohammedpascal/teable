import { MoreHorizontal } from '@teable/icons';
import { useTable } from '@teable/sdk/hooks';
import { Button, cn, ScrollArea, ScrollBar } from '@teable/ui-lib/shadcn';
import { Fragment, useState } from 'react';
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
      </div>
    </Fragment>
  );
};
