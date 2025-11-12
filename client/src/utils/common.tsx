import type { ComponentType } from 'react';

import { removeToken } from '@/utils/storages';

export const logoutUser = () => {
  removeToken();
  globalThis.location.replace('/auth/login');
};

export const getNavItem = (
  label: string,
  key: string,
  icon?: ComponentType<{ className?: string }>,
  iconActive?: ComponentType<{ className?: string }>,
) => {
  return {
    label,
    key,
    icon,
    iconActive,
  };
};

export const joinClassnames = (classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};
