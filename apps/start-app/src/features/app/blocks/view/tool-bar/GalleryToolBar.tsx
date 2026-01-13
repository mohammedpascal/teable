import { GalleryViewOperators } from './components';
import { useViewConfigurable } from './hook';

export const GalleryToolBar: React.FC = () => {
  const { isViewConfigurable } = useViewConfigurable();

  return (
    <div className="flex items-center gap-2 border-y px-4 py-2 @container/toolbar">
      <div className="flex flex-1 justify-between">
        <GalleryViewOperators disabled={!isViewConfigurable} />
      </div>
    </div>
  );
};
