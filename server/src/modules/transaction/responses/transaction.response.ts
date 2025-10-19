import { TransactionStatus, TransactionType } from '@prisma/client';

export class TransactionResponse {
  id: number;
  type: TransactionType;
  amount: number;
  description?: string;
  status: TransactionStatus;
  date: Date;
  due_date?: Date;
}
