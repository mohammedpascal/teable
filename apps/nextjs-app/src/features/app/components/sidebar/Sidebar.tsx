import { useIsMobile } from '@/sdk';
import { cn } from '@teable/ui-lib';
import type { FC, PropsWithChildren, ReactNode } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSidebar } from '../../contexts/SidebarContext';
import { SheetWrapper } from '../toggle-side-bar/SheetWrapper';
import { SidebarHeader } from './SidebarHeader';

interface ISidebarProps {
  headerLeft: ReactNode;
}

export const Sidebar: FC<PropsWithChildren<ISidebarProps>> = (props) => {
  const { headerLeft, children } = props;
  const isMobile = useIsMobile();
  const { leftVisible, toggleSidebar, setLeftVisible } = useSidebar();

  useHotkeys(`meta+b`, () => {
    toggleSidebar();
  });

  return (
    <>
      {isMobile ? (
        <SheetWrapper
          open={leftVisible === 'expanded'}
          onOpenChange={(open) => setLeftVisible(open ? 'expanded' : 'collapsed')}
        >
          <div className="group/sidebar flex size-full flex-col overflow-hidden bg-popover p-5">
            <SidebarHeader headerLeft={headerLeft} />
            {children}
          </div>
        </SheetWrapper>
      ) : (
        <div
          className={cn('flex border-r flex-shrink-0 h-full transition-all duration-200', {
            'w-16': leftVisible === 'collapsed',
            'w-72': leftVisible === 'expanded',
          })}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="group/sidebar flex size-full flex-col overflow-hidden bg-popover">
            <SidebarHeader headerLeft={headerLeft} />
            {children}
          </div>
        </div>
      )}
    </>
  );
};
