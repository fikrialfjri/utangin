import { removeToken } from '@/utils/storages';

export const logoutUser = () => {
  removeToken();
  globalThis.location.replace('/auth/login');
};
