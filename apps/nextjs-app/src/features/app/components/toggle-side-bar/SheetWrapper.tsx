import { Sheet, SheetContent } from '@teable/ui-lib';

interface SheetWrapperProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SheetWrapper = (props: SheetWrapperProps) => {
  const { children, open, onOpenChange } = props;

  return (
    <Sheet modal={true} open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0" closeable={false}>
        {children}
      </SheetContent>
    </Sheet>
  );
};
