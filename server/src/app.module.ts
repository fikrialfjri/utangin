import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';

@Module({
  imports: [CommonModule, AuthModule, ProfileModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
