import { useQuery } from '@tanstack/react-query';
import type { ISettingVo } from '@teable/openapi';
import { getSetting } from '@teable/openapi';
import { ReactQueryKeys } from '@/sdk/config';

export function useSetting() {
  return useQuery<ISettingVo>({
    queryKey: ReactQueryKeys.setting(),
    queryFn: () => getSetting().then(({ data }) => data),
  });
}

