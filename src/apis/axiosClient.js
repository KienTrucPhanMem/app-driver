import axios from 'axios';
import queryString from 'query-string';
import { store } from '../redux/store';

const axiosClient = axios.create({
  baseURL: 'https://ktpm-gateway.herokuapp.com',
  paramsSerializer: (params) => queryString.stringify(params)
});

axiosClient.interceptors.request.use(
  async (config) => {
    const auth = store.getState().auth;

    if (auth.token && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosClient };
