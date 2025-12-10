/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ISelectOption, NavItem } from '@/types/commons';

import { PASSWORD_RULES } from '@/libs/constants';

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

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  })
    .format(amount)
    .replace(/\s/g, '');
};

export const hasTruthyValue = (obj: Record<string, any>): boolean =>
  Object.values(obj).some((msg) => !!msg);

export const isAllFilled = (obj: Record<string, any>): boolean =>
  Object.values(obj).every(
    (v) => v !== null && v !== undefined && String(v).trim() !== '',
  );

export const sentenceCase = (str: string): string =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

export const isAllPasswordRulesFulfilled = (password: string): boolean => {
  return PASSWORD_RULES.every((rule) => rule.regex.test(password));
};

interface GenerateOptionsKeys {
  label?: string;
  value?: string;
}

export const generateOptions = <
  T extends { name?: string; id?: string | number },
>(
  data: T[] | null | undefined,
  keys?: GenerateOptionsKeys,
): ISelectOption[] => {
  if (!data) return [];

  const labelKey = keys?.label;
  const valueKey = keys?.value;

  return data.map((item) => {
    const anyItem = item as Record<string, unknown>;

    const labelSrc = (labelKey && anyItem[labelKey]) ?? item.name ?? '';
    const valueSrc = (valueKey && anyItem[valueKey]) ?? item.id ?? '';

    return {
      label: labelSrc as string,
      value: valueSrc as string | number,
    };
  });
};

export const removeEmptyFields = <T extends Record<string, any>>(obj: T) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== '' && v != null),
  ) as {
    [K in keyof T as T[K] extends '' | null | undefined ? never : K]: T[K];
  };
};
