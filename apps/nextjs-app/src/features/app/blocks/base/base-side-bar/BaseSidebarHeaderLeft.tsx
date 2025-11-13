import { useQuery } from '@tanstack/react-query';
import { TeableNew } from '@teable/icons';
import { getPublicSetting } from '@teable/openapi';
import { ReactQueryKeys } from '@teable/sdk/config';

export const BaseSidebarHeaderLeft = () => {
  const { data: setting } = useQuery({
    queryKey: ReactQueryKeys.getPublicSetting(),
    queryFn: () => getPublicSetting().then(({ data }) => data),
  });

  const instanceName = setting?.instanceName ?? 'Tea';

  return (
    <div className="flex max-w-[calc(100%-28px)] shrink grow items-center">
      <div className="relative mr-2 size-6 shrink-0">
        <div className="absolute top-0 size-6 transition-all ">
          <TeableNew className="size-6 text-black" />
        </div>
      </div>
      <div className="flex shrink grow items-center gap-1 overflow-hidden p-1">
        <p className="shrink truncate text-sm" title={instanceName}>
          {instanceName}
        </p>
      </div>
    </div>
  );
};
