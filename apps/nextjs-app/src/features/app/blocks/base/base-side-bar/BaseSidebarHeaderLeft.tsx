import { useQuery } from '@tanstack/react-query';
import { getPublicSetting } from '@teable/openapi';
import { ReactQueryKeys } from '@teable/sdk/config';
import { cn } from '@teable/ui-lib/shadcn';
import { SquareDot } from 'lucide-react';
import { useSidebar } from '../../../contexts/SidebarContext';

export const BaseSidebarHeaderLeft = () => {
  const { data: setting } = useQuery({
    queryKey: ReactQueryKeys.getPublicSetting(),
    queryFn: () => getPublicSetting().then(({ data }) => data),
  });

  const { leftVisible } = useSidebar();
  const isCollapsed = leftVisible === 'collapsed';
  const instanceName = setting?.instanceName ?? 'Tea';

  return (
    <div
      className={cn(
        'flex items-center',
        isCollapsed ? 'justify-center' : 'max-w-[calc(100%-28px)] shrink grow'
      )}
    >
      <div
        className={cn(
          isCollapsed ? 'flex items-center justify-center' : 'relative mr-2 size-8 shrink-0'
        )}
      >
        <div
          className={cn(
            isCollapsed
              ? 'flex items-center justify-center'
              : 'absolute top-0 size-8 transition-all'
          )}
        >
          <SquareDot className="size-8 text-black" />
        </div>
      </div>
      {!isCollapsed && (
        <div className="flex shrink grow items-center gap-1 overflow-hidden p-1">
          <p className="shrink truncate text-sm" title={instanceName}>
            {instanceName}
          </p>
        </div>
      )}
    </div>
  );
};
