import deepMerge from 'deepmerge';
import uiConfig from './tailwind.config.js';

function wrapper(tailwindConfig) {
  return deepMerge({ ...tailwindConfig }, uiConfig);
}

export default wrapper;
