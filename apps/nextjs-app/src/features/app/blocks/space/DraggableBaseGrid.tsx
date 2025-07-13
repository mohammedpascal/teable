import type { IGetBaseAllVo } from '@teable/openapi';
import { BaseCard } from './BaseCard';

interface IDraggableBaseGridProps {
  className?: string;
  bases: IGetBaseAllVo;
}

const DraggableBaseGrid = (props: IDraggableBaseGridProps) => {
  const { bases } = props;

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-3">
      {bases.map((base) => (
        <div key={base.id}>
          <BaseCard
            base={base}
            key={base.id}
            className="h-24 max-w-[34rem] flex-1 sm:min-w-[17rem]"
          />
        </div>
      ))}
    </div>
  );
};

export { DraggableBaseGrid };
