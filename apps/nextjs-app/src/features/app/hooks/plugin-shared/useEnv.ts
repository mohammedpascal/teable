import { useContext } from 'react';
import { EvnContext } from '../../components/plugin-shared/EnvProvider';

export const useEnv = () => {
  return useContext(EvnContext);
};
