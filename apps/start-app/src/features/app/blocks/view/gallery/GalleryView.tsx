import { RecordProvider, RowCountProvider } from '@/sdk/context';
import { SearchProvider } from '@/sdk/context/query';
import { useIsHydrated } from '@/sdk/hooks';
import { GalleryToolBar } from '../tool-bar/GalleryToolBar';
import { GalleryProvider } from './context';
import { GalleryViewBase } from './GalleryViewBase';

export const GalleryView = () => {
  const isHydrated = useIsHydrated();

  return (
    <SearchProvider>
      <RecordProvider>
        <RowCountProvider>
          <GalleryToolBar />
          <GalleryProvider>
            <div className="w-full grow overflow-hidden">{isHydrated && <GalleryViewBase />}</div>
          </GalleryProvider>
        </RowCountProvider>
      </RecordProvider>
    </SearchProvider>
  );
};
