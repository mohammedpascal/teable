import { useContext } from 'react';
import { ChartContext } from '../components/ChartProvider';

export const useUIConfig = () => {
  const { view } = useContext(ChartContext);
  
  return {
    isShowingSettings: true, // Always show settings in native view
    isExpand: false, // Can be determined from view context if needed
  };
};