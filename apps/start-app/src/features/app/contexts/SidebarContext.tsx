import { createContext, useContext, useState, type ReactNode } from 'react';

type SidebarState = 'expanded' | 'collapsed';

interface ISidebarContext {
  leftVisible: SidebarState;
  setLeftVisible: (visible: SidebarState) => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<ISidebarContext | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [leftVisible, setLeftVisible] = useState<SidebarState>('expanded');

  const toggleSidebar = () => {
    setLeftVisible((prev) => (prev === 'expanded' ? 'collapsed' : 'expanded'));
  };

  return (
    <SidebarContext.Provider value={{ leftVisible, setLeftVisible, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

