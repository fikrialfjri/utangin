import { Module, forwardRef } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { TransactionModule } from '../transaction/transaction.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
  imports: [forwardRef(() => TransactionModule), AuthModule],
})
export class ContactModule {}
