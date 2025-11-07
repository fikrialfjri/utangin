import axios from 'axios';

import { clearStorages, getToken } from '@/utils/storages';

export const BASE_URL = import.meta.env.UTANGIN_API_BASE_URL;

axios.interceptors.request.use(
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

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (axios.isCancel(err)) {
      return Promise.reject(new Error('request canceled'));
    }

    if (err.response?.data) {
      if (err.response.status === 401) {
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
