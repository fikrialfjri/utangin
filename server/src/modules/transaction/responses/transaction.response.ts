import { TransactionStatus, TransactionType } from '@prisma/client';

export class TransactionResponse {
  id: number;
  contact_id: number;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  date: Date;
  description?: string;
  due_date?: Date;
}
