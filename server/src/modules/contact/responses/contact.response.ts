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
}

export class ContactDetailTransactionResponse {
  id: number;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  date: Date;
  note?: string;
  due_date?: Date;
}

export class ContactDetailResponse extends ContactResponse {
  transactions: ContactDetailTransactionResponse[];
}
