import { Module, forwardRef } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { ContactModule } from '../contact/contact.module';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
  imports: [forwardRef(() => ContactModule)],
})
export class TransactionModule {}
