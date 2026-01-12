import { createAxios } from '@teable/openapi';
import { getBackendUrl } from '@/lib/utils/get-backend-url';

export const getAxios = () => {
  const axios = createAxios();
  // Use getBackendUrl for client-side compatibility
  if (typeof window !== 'undefined') {
    axios.defaults.baseURL = `${getBackendUrl()}/api`;
  } else {
    // Fallback for SSR (though we're removing SSR, keeping for safety)
    axios.defaults.baseURL = `http://localhost:3000/api`;
  }
  return axios;
};

export const axios = getAxios();
