import { useQuery } from '@tanstack/react-query';
import type { IUserListResponseVo } from '@teable/openapi';
import { getUserList } from '@teable/openapi';
import { ReactQueryKeys } from '@/sdk/config';

export function useUsers(skip = 0, take = 100) {
  return useQuery<IUserListResponseVo>({
    queryKey: ReactQueryKeys.users(skip, take),
    queryFn: () => getUserList({ skip, take }).then(({ data }) => data),
  });
}

