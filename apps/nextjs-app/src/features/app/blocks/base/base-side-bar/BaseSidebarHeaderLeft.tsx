import { useQuery } from '@tanstack/react-query';
import { getPublicSetting } from '@teable/openapi';
import { ReactQueryKeys } from '@teable/sdk/config';
import { cn } from '@teable/ui-lib/shadcn';
import Tea from '@/components/Tea';
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
        isCollapsed ? 'justify-center' : 'max-w-[calc(100%-28px)] shrink grow gap-2'
      )}
    >
      <div className={cn(isCollapsed ? 'flex items-center justify-center' : 'shrink-0 mx-2')}>
        <Tea />
      </div>
      {!isCollapsed && (
        <p className="truncate text-sm" title={instanceName}>
          {instanceName}
        </p>
      )}
    </div>
  );
};
