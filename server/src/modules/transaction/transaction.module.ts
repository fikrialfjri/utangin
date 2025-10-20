import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { ContactModule } from '../contact/contact.module';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  imports: [ContactModule],
})
export class TransactionModule {}
