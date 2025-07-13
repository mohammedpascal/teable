import { ChevronsLeft, TeableNew } from '@teable/icons';
import { CollaboratorType } from '@teable/openapi';
import { useBase } from '@teable/sdk/hooks';
import { useRouter } from 'next/router';
import { Emoji } from '@/features/app/components/emoji/Emoji';

export const BaseSidebarHeaderLeft = () => {
  const base = useBase();
  const router = useRouter();

  const backSpace = () => {
    if (base.collaboratorType === CollaboratorType.Base) {
      router.push({
        pathname: '/space/shared-base',
      });
    } else {
      router.push({
        pathname: '/space/[spaceId]',
        query: { spaceId: base.spaceId },
      });
    }
  };

  return (
    <div className="flex max-w-[calc(100%-28px)] shrink grow items-center">
      <div
        className="relative mr-2 size-6 shrink-0 cursor-pointer"
        onClick={backSpace}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            backSpace();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="absolute top-0 size-6 transition-all group-hover/sidebar:opacity-0">
          {base.icon ? (
            <Emoji emoji={base.icon} size={'1.5rem'} />
          ) : (
            <TeableNew className="size-6 text-black" />
          )}
        </div>
        <ChevronsLeft className="absolute top-0 size-6 opacity-0 transition-all group-hover/sidebar:opacity-100" />
      </div>
      <div className="flex shrink grow items-center gap-1 overflow-hidden p-1">
        <p className="shrink truncate text-sm" title={base.name}>
          {base.name}
        </p>
      </div>
    </div>
  );
};
