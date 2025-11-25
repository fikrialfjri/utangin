import type { TransactionStatus, TransactionType } from './commons';

export interface ISummary {
  nominal: number;
  recent_contacts?: IContact[];
}

export interface IDashboardSummary {
  potential: ISummary;
  current: ISummary;
  receivable_debt: ISummary;
  debt: ISummary;
  receivable: ISummary;
}

export interface IContact {
  id: number;
  avatar?: string | null;
  name: string;
}

export interface ITransaction {
  id: number;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  date: string;
  contact: IContact;
}

export interface IGroupedTransaction {
  month: string;
  label: string;
  transactions: ITransaction[];
}
