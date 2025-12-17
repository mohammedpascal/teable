import { GroupPointProvider, RecordProvider } from '@/sdk/context';
import { SearchProvider } from '@/sdk/context/query';
import { useIsHydrated } from '@/sdk/hooks';
import { KanbanToolBar } from '../tool-bar/KanbanToolBar';
import { KanbanProvider } from './context';
import { KanbanViewBase } from './KanbanViewBase';

export const KanbanView = () => {
  const isHydrated = useIsHydrated();

  return (
    <SearchProvider>
      <RecordProvider>
        <GroupPointProvider>
          <KanbanToolBar />
          <KanbanProvider>
            <div className="w-full grow overflow-hidden">{isHydrated && <KanbanViewBase />}</div>
          </KanbanProvider>
        </GroupPointProvider>
      </RecordProvider>
    </SearchProvider>
  );
};
