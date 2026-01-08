import deepMerge from 'deepmerge';
import uiConfig from './tailwind.config.cjs';

function wrapper(tailwindConfig) {
  return deepMerge({ ...tailwindConfig }, uiConfig);
}

export default wrapper;
