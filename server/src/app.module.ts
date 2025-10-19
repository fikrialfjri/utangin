import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ContactModule } from './modules/contact/contact.module';
import { TransactionModule } from './modules/transaction/transaction.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    ProfileModule,
    ContactModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
