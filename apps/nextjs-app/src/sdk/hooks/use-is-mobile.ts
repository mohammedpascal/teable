import useMedia from 'react-use/lib/useMedia';

export const useIsMobile = () => {
  return useMedia('(max-width: 640px)');
};
