import { Module, forwardRef } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
  imports: [forwardRef(() => TransactionModule)],
})
export class ContactModule {}
