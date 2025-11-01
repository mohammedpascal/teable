import { useQuery } from '@tanstack/react-query';
import { getPublicSetting } from '@teable/openapi';
import { ReactQueryKeys } from '@teable/sdk/config';
import { useSession } from '@teable/sdk/hooks';

interface ISetting {
  disallowSignUp?: boolean;
}

export const useSetting = () => {
  const { user } = useSession();
  const { data: setting, isLoading } = useQuery({
    queryKey: ReactQueryKeys.getPublicSetting(),
    queryFn: () => getPublicSetting().then(({ data }) => data),
  });

  const { disallowSignUp = false } = (setting as ISetting) ?? {};

  return {
    disallowSignUp,
  };
};
