import { cn } from '@/ui-lib/shadcn';
import type { ReactNode } from 'react';
import { useSidebar } from '../../contexts/SidebarContext';

export interface ISidebarHeaderProps {
  headerLeft: ReactNode;
}

export const SidebarHeader = (prop: ISidebarHeaderProps) => {
  const { headerLeft } = prop;
  const { leftVisible } = useSidebar();
  const isCollapsed = leftVisible === 'collapsed';

  return (
    <div className={cn('flex h-14 w-full items-center gap-1 p-2', isCollapsed && 'justify-center')}>
      {headerLeft}
    </div>
  );
};
