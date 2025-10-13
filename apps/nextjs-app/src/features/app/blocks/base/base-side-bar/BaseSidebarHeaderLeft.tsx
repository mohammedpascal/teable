import { TeableNew } from '@teable/icons';

export const BaseSidebarHeaderLeft = () => {
  return (
    <div className="flex max-w-[calc(100%-28px)] shrink grow items-center">
      <div className="relative mr-2 size-6 shrink-0">
        <div className="absolute top-0 size-6 transition-all ">
          <TeableNew className="size-6 text-black" />
        </div>
      </div>
      <div className="flex shrink grow items-center gap-1 overflow-hidden p-1">
        <p className="shrink truncate text-sm" title="Base">
          Base
        </p>
      </div>
    </div>
  );
};
