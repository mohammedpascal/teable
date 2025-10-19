import { useFields } from '@teable/sdk';
import { useMemo } from 'react';

export const useFilterNumberColumns = () => {
  const fields = useFields();

  return useMemo(() => {
    if (!fields) return [];
    
    return fields.filter(field => {
      // Filter for number-like fields that can be used in charts
      return field.type === 'number' || 
             field.type === 'currency' || 
             field.type === 'percent' ||
             field.type === 'rating' ||
             field.type === 'count';
    });
  }, [fields]);
};