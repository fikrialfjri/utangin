import { TransactionType } from '@prisma/client';

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
}
