import { TransactionStatus, TransactionType } from '@prisma/client';

export class GlobalContactResponse {
  id: number;
  name: string;
  avatar?: string | null;
}

export class ContactResponse extends GlobalContactResponse {
  total_debt: number;
  total_receivable: number;
  net_total: number;
  status?: TransactionType;
  last_transaction: Date;
  last_payment?: Date;
  has_active_transactions: boolean;
}

export class ContactDetailTransactionResponse {
  id: number;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  date: Date;
  last_payment?: Date;
  note?: string;
  due_date?: Date;
  total_paid: number;
  remaining: number;
  percentage: number;
}

export class ContactDetailResponse extends ContactResponse {
  total_amount: number;
  total_paid: number;
  remaining: number;
  percentage: number;
  payment_count: number;
  transaction_count: number;
  transactions: ContactDetailTransactionResponse[];
}
