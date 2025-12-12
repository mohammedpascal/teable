import { createContext, useContext, useState, type ReactNode } from 'react';

interface ISidebarContext {
  leftVisible: boolean;
  setLeftVisible: (visible: boolean) => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<ISidebarContext | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [leftVisible, setLeftVisible] = useState(true);

  const toggleSidebar = () => {
    setLeftVisible((prev) => !prev);
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

