import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [AuthModule],
})
export class ProfileModule {}
