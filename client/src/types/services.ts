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
  total_debt?: number;
  total_receivable?: number;
  net_total?: number;
  status?: TransactionType;
  last_transaction?: Date;
  last_payment?: Date;
  has_active_transactions?: boolean;
}

export interface ITransaction {
  id: number;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  date: Date;
  last_payment?: Date;
  note?: string;
  due_date?: Date;
  contact: IContact;
}

export interface IContactDetail extends IContact {
  total_amount: number;
  total_paid: number;
  remaining: number;
  percentage: number;
  payment_count: number;
  transaction_count: number;
  transactions: ITransaction[];
}

export interface IGroupedTransaction {
  month: string;
  label: string;
  transactions: ITransaction[];
}

export interface IPayment {
  id: number;
  amount: number;
  date: Date;
  note?: string;
}

export interface ITransactionDetail extends ITransaction {
  total_paid: number;
  remaining: number;
  percentage: number;
  payments: IPayment[];
}
