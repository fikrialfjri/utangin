/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const joinClassnames = (classes: (string | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const isMinusNumber = (value: number): boolean => value < 0;
export const isZeroNumber = (value: number): boolean => value === 0;

export const getObjectSearch = (search: any) => {
  const params = [];
  for (const entry of search.entries()) {
    params.push(entry);
  }

  return params.reduce((curr, acc) => ({ ...curr, [acc[0]]: acc[1] }), {});
};
