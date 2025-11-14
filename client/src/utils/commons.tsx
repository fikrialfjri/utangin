import type { NavItem } from '@/types/commons';

import { removeToken } from '@/utils/storages';

export const logoutUser = () => {
  removeToken();
  globalThis.location.replace('/auth/login');
};

export const getNavItem = (
  label: NavItem['label'],
  key: NavItem['key'],
  icon?: NavItem['icon'],
  iconActive?: NavItem['iconActive'],
): NavItem => {
  return {
    label,
    key,
    icon,
    iconActive,
  };
};

export const joinClassnames = (classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export const isMinusNumber = (value: number): boolean => value < 0;
export const isZeroNumber = (value: number): boolean => value === 0;
