import axios from 'axios';

import { clearStorages, getToken } from '@/utils/storages';

export const BASE_URL = import.meta.env.VITE_UTANGIN_API_BASE_URL;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (axios.isCancel(err)) {
      return Promise.reject(new Error('request canceled'));
    }

    if (err.response?.data) {
      if (
        err.response.status === 401 &&
        err.response.data.error !== 'Wrong Credentials'
      ) {
        clearStorages();
        location.reload();
      }
      return Promise.reject(err.response.data);
    } else {
      return Promise.reject(
        new Error('Failed to fetch data. Pleace contact developer'),
      );
    }
  },
);

export default instance;
