import type { ReactNode } from 'react';

export interface ISidebarHeaderProps {
  headerLeft: ReactNode;
  onExpand?: () => void;
}

export const SidebarHeader = (prop: ISidebarHeaderProps) => {
  const { headerLeft } = prop;

  return <div className="flex h-10 w-full items-center gap-1 p-2">{headerLeft}</div>;
};
