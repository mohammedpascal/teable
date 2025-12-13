import { ChevronsRight } from '@teable/icons';
import { Sheet, SheetContent, Button, SheetTrigger } from '@teable/ui-lib';
import { cn } from '@teable/ui-lib/shadcn';
import { Sidebar } from 'lucide-react';

interface SheetWrapperProps {
  children: React.ReactNode;
}

export const SheetWrapper = (props: SheetWrapperProps) => {
  const { children } = props;

  return (
    <Sheet modal={true}>
      <SheetTrigger asChild>
        <Button
          className={cn('fixed left-0 z-50 p-1 top-7 transition-all rounded-r-md rounded-l-none')}
          size="xs"
          variant={'outline'}
        >
          <Sidebar className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0" closeable={false}>
        {children}
      </SheetContent>
    </Sheet>
  );
};
