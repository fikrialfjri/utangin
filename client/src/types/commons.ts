import type { ComponentType, ReactNode } from 'react';

import type {
  SUMMARY_CARD_VARIANTS,
  TRANSACTION_STATUS,
  TRANSACTION_TYPES,
} from '@/libs/constants';

export type StringMap = { [key: string]: string };
export type ReactNodeMap = { [key: string]: ReactNode };
export type TransactionType =
  (typeof TRANSACTION_TYPES)[keyof typeof TRANSACTION_TYPES];
export type TransactionStatus =
  (typeof TRANSACTION_STATUS)[keyof typeof TRANSACTION_STATUS];
export type SummaryCardVariant =
  (typeof SUMMARY_CARD_VARIANTS)[keyof typeof SUMMARY_CARD_VARIANTS];

export interface IMetaResponse {
  page?: number;
  limit?: number;
  total?: number;
}

export interface NavItem {
  label: string;
  key: string;
  icon?: ComponentType<{ className?: string }>;
  iconActive?: ComponentType<{ className?: string }>;
}

export interface ISelectOption {
  value: string | number;
  label: string;
}
