import type { TransactionStatus, TransactionType } from './commons';

export interface IContact {
  id: number;
  avatar?: string | null;
  name: string;
}

export interface ISummary {
  nominal: number;
  recent_contacts?: IContact[];
}

export interface ITransaction {
  id: number;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  date: string;
  contact: IContact;
}
