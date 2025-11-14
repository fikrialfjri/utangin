import { TransactionStatus, TransactionType } from '@prisma/client';
import { ContactResponse } from 'src/modules/contact/responses/contact.response';

export class TransactionResponse {
  id: number;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  date: Date;
  description?: string;
  due_date?: Date;
  contact: ContactResponse;
}
