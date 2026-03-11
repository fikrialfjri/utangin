import { TransactionStatus, TransactionType } from '@prisma/client';
import { GlobalContactResponse } from 'src/modules/contact/responses/contact.response';
import { PaymentResponse } from './payment.response';

export class TransactionResponse {
  id: number;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  date: Date;
  note?: string;
  due_date?: Date;
  contact: GlobalContactResponse;
}

export class TransactionDetailResponse extends TransactionResponse {
  total_paid: number;
  remaining: number;
  percentage: number;
  payments: PaymentResponse[];
}

export class GroupedTransactionResponse {
  month: string;
  label: string;
  transactions: TransactionResponse[];
}
