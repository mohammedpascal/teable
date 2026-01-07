import { useQuery } from '@tanstack/react-query';
import type { IRoleListVo } from '@teable/openapi';
import { getRoleList } from '@teable/openapi';
import { ReactQueryKeys } from '@/sdk/config';

export function useRoles() {
  return useQuery<IRoleListVo[]>({
    queryKey: ReactQueryKeys.roles(),
    queryFn: () => getRoleList().then(({ data }) => data),
  });
}

