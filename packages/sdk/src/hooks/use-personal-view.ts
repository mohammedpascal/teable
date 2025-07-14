import { type IProxyPersonalView } from '../context';
import { useView } from './use-view';

export const usePersonalView = () => {
  const view = useView();

  const closePersonalView = () => {
    console.log('closePersonalView');
  };

  const openPersonalView = () => {
    console.log('openPersonalView');
  };

  const syncViewProperties = async () => {
    await (view as IProxyPersonalView)?.syncViewProperties?.();
  };

  return {
    isPersonalView: false,
    personalViewMap: undefined,
    personalViewCommonQuery: undefined,
    personalViewAggregationQuery: undefined,
    openPersonalView,
    closePersonalView,
    syncViewProperties,
  };
};
