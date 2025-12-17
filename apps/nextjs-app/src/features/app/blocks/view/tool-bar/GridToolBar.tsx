import { Plus } from '@/components/icons';
import { CreateRecordModal } from '@/sdk/components';
import { useHookPermission } from '@/sdk/hooks/use-hook-permission';
import { Button } from '@teable/ui-lib/shadcn/ui/button';
import { GridViewOperators } from './components';
import { useViewConfigurable } from './hook';

export const GridToolBar: React.FC = () => {
  const permission = useHookPermission();
  const { isViewConfigurable } = useViewConfigurable();

  return (
    <div className="flex items-center border-t px-1 py-2 sm:gap-1 sm:px-2 md:gap-2 md:px-4">
      <CreateRecordModal>
        <Button
          className="size-6 shrink-0 rounded-full p-0"
          size={'xs'}
          variant={'outline'}
          disabled={!permission['record|create']}
        >
          <Plus className="size-4" />
        </Button>
      </CreateRecordModal>
      <div className="mx-2 h-4 w-px shrink-0 bg-slate-200"></div>
      <div className="flex flex-1 justify-between @container/toolbar">
        <GridViewOperators disabled={!isViewConfigurable} />
      </div>
    </div>
  );
};
