import { TeableNew } from '@teable/icons';
import { useBase } from '@teable/sdk/hooks';
import { Emoji } from '@/features/app/components/emoji/Emoji';

export const BaseSidebarHeaderLeft = () => {
  const base = useBase();

  return (
    <div className="flex max-w-[calc(100%-28px)] shrink grow items-center">
      <div className="relative mr-2 size-6 shrink-0">
        <div className="absolute top-0 size-6 transition-all ">
          {base.icon ? (
            <Emoji emoji={base.icon} size={'1.5rem'} />
          ) : (
            <TeableNew className="size-6 text-black" />
          )}
        </div>
      </div>
      <div className="flex shrink grow items-center gap-1 overflow-hidden p-1">
        <p className="shrink truncate text-sm" title={base.name}>
          {base.name}
        </p>
      </div>
    </div>
  );
};
