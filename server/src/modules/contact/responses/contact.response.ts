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

export class TransactionProgressResponse {
  total_amount: number;
  total_paid: number;
  remaining: number;
  percentage: number;
  transaction_count: number;
  payment_count: number;
  is_paid: boolean;
  has_data: boolean;
}

export class ContactDetailResponse extends ContactResponse {
  debt_progress: TransactionProgressResponse;
  receivable_progress: TransactionProgressResponse;
  transactions: ContactDetailTransactionResponse[];
}
