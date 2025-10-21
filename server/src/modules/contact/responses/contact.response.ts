import { UserResponse } from 'src/modules/auth/responses/auth.response';
import { TransactionResponse } from 'src/modules/transaction/responses/transaction.response';

export class ContactResponse {
  id: number;
  name: string;
  user: UserResponse;
  transactions: TransactionResponse[];
  avatar?: string | null;
}
