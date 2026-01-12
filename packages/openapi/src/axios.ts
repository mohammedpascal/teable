import { HttpError } from '@teable/core';
import axiosInstance from 'axios';

export const createAxios = () => {

  let baseURL = 'http://localhost:3000/api';
  if (typeof window !== 'undefined') {
    baseURL = window.location.protocol === 'https:' ? 'https://tea.successta.com/api' : 'http://localhost:3000/api';
  }
  const axios = axiosInstance.create({
    withCredentials: true,
    baseURL,
  });

  axios.interceptors.response.use(
    (response) => {
      // Any status code that lie within the range of 2xx cause this function to trigger
      return response;
    },
    (error) => {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      const { data, status } = error?.response || {};
      throw new HttpError(data || error?.message || 'no response from server', status || 500);
    }
  );
  return axios;
};

const axios = createAxios();

/**
 * Configuration options for the Axios instance.
 */
export interface IAPIRequestConfig {
  /**
   * API endpoint, defaults to 'https://app.teable.io'.
   */
  endpoint?: string;
  /**
   * Bearer token for authentication.
   */
  token: string;
}

/**
 * Configures the Axios instance with the provided options.
 * @param config - Configuration options
 */
export const configApi = (config: IAPIRequestConfig) => {
  const { token, endpoint = 'https://app.teable.io' } = config;
  if (!token) {
    throw new Error(
      `token is required, visit ${endpoint}/setting/personal-access-token to get one`
    );
  }

  axios.defaults.baseURL = `${endpoint}/api`;
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  return axios;
};

export { axios };
