export const TOKEN_KEY = 'utangin-token';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (value: string) => {
  return localStorage.setItem(TOKEN_KEY, value);
};

export const removeToken = () => {
  return localStorage.removeItem(TOKEN_KEY);
};

export const clearStorages = () => {
  return localStorage.clear();
};
