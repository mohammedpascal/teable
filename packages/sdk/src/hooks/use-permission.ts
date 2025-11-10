import { useContext } from 'react';
import { BaseContext } from '../context';

export const usePermission = () => {
  const { permission } = useContext(BaseContext);

  return permission;
};

