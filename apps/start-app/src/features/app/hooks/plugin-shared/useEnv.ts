import { useContext } from 'react';
import { EnvContext } from '@/lib/server-env';

export const useEnv = () => {
  return useContext(EnvContext);
};
