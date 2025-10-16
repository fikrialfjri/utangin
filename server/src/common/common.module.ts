import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/common';
import { JwtStrategy } from './auth/strategies/jwt.strategy';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.SECRET_KEY,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [PrismaService, JwtStrategy],
  exports: [PrismaService],
})
export class CommonModule {}
